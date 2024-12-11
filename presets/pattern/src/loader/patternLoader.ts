import { IPatternDefinition, Variant, Property, Preview } from '@wingsuit-designsystem/pattern';
import path from 'path';
import { invokeHook, pathInfo } from '@wingsuit-designsystem/core';

const loaderUtils = require('loader-utils');
const YAML = require('yaml');
const { camelCase } = require('lodash');

export default function patternLoader(this: any, src) {
  const { ...options } = {
    prettyErrors: true,
    ...loaderUtils.getOptions(this),
  };
  const { appConfig, fileDependencyPlugin } = options;
  const res = YAML.parse(src, options);
  const info = pathInfo(this.resourcePath, appConfig);
  const exports: string[] = [];

  if (info !== null) {
    Object.keys(res).forEach((key) => {
      const pattern: IPatternDefinition = res[key];
      invokeHook(appConfig, 'patternLoaded', [key, pattern]);
      res[key] = pattern;
      pattern.namespace = pattern.namespace ?? info.namespace;
      const added = fileDependencyPlugin.addFile(
        key,
        this.resourcePath,
        `wingsuit/${key}.wingsuit.yml`,
        res
      );
      if (added) {
        const jsKey = camelCase(`Pattern${key}`);
        if (pattern.use) {
          const twigTemplatePath = pattern.use.replace('@', '');
          exports.push(`import ${jsKey}Template from '${twigTemplatePath}';`);
          exports.push(`export const ${jsKey} = getStorage().loadPattern('${key}');`);
          exports.push(`${jsKey}.setTemplate(${jsKey}Template);`);
          this.addDependency(path.resolve(twigTemplatePath));
        }
        if (pattern.variants) {
          Object.entries(pattern.variants).forEach(([variantName, variant]) => {
            if (variant && variant.use) {
              const twigVariantTemplatePath = variant.use.replace('@', '');
              exports.push(
                `import ${jsKey}${variantName}Template from '${twigVariantTemplatePath}';`
              );
              exports.push(
                `export const ${jsKey}${variantName} = getStorage().loadVariant('${key}', '${variantName}');`
              );
              exports.push(`${jsKey}${variantName}.setTemplate(${jsKey}${variantName}Template);`);
            }
          });
        }
        const linkedPatternIds = findLinkedPatternIds(pattern);
        linkedPatternIds.forEach((patternId) => {
          const linkedPatternIndexFile =
            fileDependencyPlugin.getPatternComponentNamespace(patternId);
          if (linkedPatternIndexFile) {
            exports.push(`import '${linkedPatternIndexFile}';`);
            this.addDependency(path.resolve(linkedPatternIndexFile));
          }
          const linkedPatternNamespace = fileDependencyPlugin.getPatternNamespace(patternId);
          if (linkedPatternNamespace) {
            exports.push(`import '${linkedPatternNamespace}';`);
            this.addDependency(path.resolve(linkedPatternNamespace));
          } else {
            console.error(`Unable to found pattern namespace for ${patternId}`);
          }
        });
      }
    });
  }

  const defaultPatternKey = Object.keys(res)[0];

  exports.push(`export default getStorage().loadPattern('${defaultPatternKey}');`);
  const json = JSON.stringify(res);
  return `import { getStorage } from '@wingsuit-designsystem/pattern'; 
  getStorage().addDefinitions(${json}); 
${exports.join(' ')}`;
}

export function findLinkedPatternIds(pattern: IPatternDefinition): string[] {
  const collectedPatternIds: string[] = [];
  const fields = pattern.fields ?? [];
  const { variants } = pattern;
  const previewSets: Array<Preview> = [];
  const dependencies = pattern.dependencies ?? [];
  const extendsItems = pattern.extends ?? [];

  // Collect dependency pattern ids.
  dependencies.forEach((dependency) => {
    if (typeof dependency === 'string') {
      collectedPatternIds.push(dependency);
    }
  });

  // Collect extended pattern ids.
  extendsItems.forEach((extend) => {
    if (typeof extend === 'string') {
      collectedPatternIds.push(extend.split('.')[0]);
    }
  });
  if (fields) {
    Object.values(fields).forEach((field: Property) => {
      if (field.type === 'pattern' && typeof field.preview === 'object') {
        previewSets.push(field.preview);
      }
    });
  }
  if (variants) {
    Object.values(variants).forEach((variant: Variant) => {
      if (typeof variant.fields === 'object') {
        Object.values(variant.fields).forEach((field: Preview) => {
          previewSets.push(field);
        });
      }
    });
  }

  previewSets.forEach((preset) => {
    walkAndCollect(preset, collectedPatternIds);
  });

  return collectedPatternIds.filter((v, i, a) => a.indexOf(v) === i);
}

function walkAndCollect(preset: Preview | Preview[], collectedPatternIds: string[]) {
  if (Array.isArray(preset)) {
    Object.values(preset).forEach((singlePreset) => {
      if (singlePreset.id) {
        collectedPatternIds.push(singlePreset.id);
      }
      if (typeof singlePreset.fields === 'object') {
        Object.values(singlePreset.fields).forEach((field) => {
          walkAndCollect(field, collectedPatternIds);
        });
      }
    });
  } else if (preset?.id) {
    collectedPatternIds.push(preset.id);
    if (typeof preset.fields === 'object') {
      Object.values(preset.fields).forEach((field) => {
        walkAndCollect(field, collectedPatternIds);
      });
    }
  }
}
