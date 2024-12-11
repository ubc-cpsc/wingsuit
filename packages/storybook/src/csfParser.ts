import path from 'path';
import fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import generate from '@babel/generator';
import { AppConfig, invokeHook } from '@wingsuit-designsystem/core';

const YAML = require('yaml');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const { camelCase } = require('lodash');

interface ParserResultItem {
  label: string;
  namespace: string;
  patternId: string;
  exportName: string;
}
interface ParserResult {
  csf: string;
  items: ParserResultItem[];
}
export function csfParser(
  resourcePath,
  src,
  appConfig: AppConfig,
  loader: any = null
): ParserResult {
  const { namespaces } = appConfig;
  const ast = babylon.parse(src, {
    sourceType: 'module',
  });

  let absYamlPath = '';
  let patternClientYamlPath = '';

  traverse(ast, {
    VariableDeclaration(pathItem) {
      if (pathItem.node.declarations[0].id.name === 'patternDefinition') {
        const yamlPath = pathItem.node.declarations[0].init.arguments[0].value;
        if (yamlPath.startsWith('.') || yamlPath.startsWith('/')) {
          absYamlPath = path.join(path.dirname(resourcePath), yamlPath);
          patternClientYamlPath = `./${path.basename(absYamlPath)}`;
        } else {
          absYamlPath = require.resolve(yamlPath);
          patternClientYamlPath = `${yamlPath}`;
        }
      }
    },
  });
  const results: ParserResultItem[] = [];
  const generated = src;
  const output: string[] = [];
  if (absYamlPath !== '') {
    if (loader) {
      loader.addDependency(absYamlPath);
    }
    const hasIndexFile = fs.existsSync(path.join(path.dirname(resourcePath), 'index.js'));

    const patternDefinitionFile = fs.readFileSync(absYamlPath, 'utf8');
    const patternDefinition = YAML.parse(patternDefinitionFile);

    const patternIds = Object.keys(patternDefinition);
    const defaultPatternId = patternIds[0];
    if (!defaultPatternId) {
      return src;
    }
    const defaultPattern = patternDefinition[defaultPatternId];
    invokeHook(appConfig, 'patternLoaded', [defaultPatternId, defaultPattern]);
    invokeHook(appConfig, 'storyLoaded', [defaultPatternId, defaultPattern]);
    const defaultPatternLabel = defaultPattern.label ?? defaultPatternId;
    let defaultPatternNamespace = defaultPattern.namespace ?? '';

    let namespacePath = '';

    if (defaultPatternNamespace === '') {
      Object.keys(namespaces).forEach((key) => {
        if (
          resourcePath.startsWith(namespaces[key]) &&
          namespaces[key].length > namespacePath.length
        ) {
          defaultPatternNamespace = key;
          namespacePath = namespaces[key];
        }
      });
    } else {
      namespacePath = defaultPatternNamespace;
    }
    if (hasIndexFile) {
      output.push("import './index';");
    }
    output.push(`
    ${generated};
    import { storage } from '@wingsuit-designsystem/pattern';
    import { PatternPreview } from '@wingsuit-designsystem/pattern-react';
    import { args, argTypes } from '@wingsuit-designsystem/storybook';
    import React from 'react';
    import {version} from 'react-dom';
    import '${patternClientYamlPath}';
    export default {
      tags: ['autodocs'],
      component: PatternPreview
     }
     let pattern = null;
`);
    patternIds.forEach((patternId) => {
      const { label } = patternDefinition[patternId];
      const variants = patternDefinition[patternId].variants ?? { __default: { label: 'Default' } };
      Object.keys(variants).forEach((variantName) => {
        const variantLabel = variants[variantName].label;
        const jsKey = camelCase(`P${patternId}${variantName}Pattern`);
        const storyLabel =
          label === defaultPatternLabel ? variantLabel : `${label}: ${variantLabel}`;
        output.push(`
          export const ${jsKey} = {
          name: '${storyLabel}',
          args: {patternId: '${patternId}', variantId: '${variantName}', ...args({}, '${patternId}', '${variantName}') },
          argTypes: argTypes('${patternId}', '${variantName}'),
          parameters: {
            ... wingsuit.parameters ?? {},
            docs: { 
              description: {
                component: \`${patternDefinition[patternId].description ?? ''}\`
              },
              source: {
                  code: storage.loadVariant('${patternId}', '${variantName}').getCode(),
                  language: 'jsx',
                  type: 'auto',
                  format: true
                }
              }
            }
        }`);
        results.push({
          namespace: `${defaultPatternNamespace}/${label}`,
          label: storyLabel,
          patternId,
          exportName: jsKey,
        });
      });
    });
  }

  return { items: results, csf: output.join(' ') };
}
