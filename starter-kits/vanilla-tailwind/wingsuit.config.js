const path = require('path');

const patterns = path.resolve(__dirname, 'source/default/patterns');
const appsPatterns = path.resolve(__dirname, 'apps/storybook/patterns');
module.exports = {
  parameters: {
    placeholder: {
      service: 'placebeard',
    },
  },
  presets: [
    '@wingsuit-designsystem/preset-tailwind',
    '@wingsuit-designsystem/preset-twing',
    '@wingsuit-designsystem/preset-placeholder',
    '@wingsuit-designsystem/preset-icon',
    '@wingsuit-designsystem/preset-drupal',
    '@wingsuit-designsystem/preset-icon-spritemap',
    '@wingsuit-designsystem/preset-storybook',
  ],
  designSystems: {
    default: {
      namespaces: {
        tokens: path.resolve(__dirname, 'source/default/tokens'),
        atoms: path.resolve(patterns, '01-atoms'),
        molecules: path.resolve(patterns, '02-molecules'),
        organisms: path.resolve(patterns, '03-organisms'),
        templates: path.resolve(patterns, '04-templates'),
        pages: path.resolve(appsPatterns, '05-pages'),
      },
    },
  },
};
