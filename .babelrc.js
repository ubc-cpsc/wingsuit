const withTests = {
  presets: [
    [
      '@babel/preset-env',
      { shippedProposals: true, useBuiltIns: 'usage', corejs: '3', targets: { node: 'current' } },
    ],
  ],
  plugins: ['babel-plugin-require-context-hook', '@babel/plugin-transform-runtime', '@babel/plugin-transform-modules-commonjs'],
};

module.exports = {
  ignore: [
    './lib/codemod/src/transforms/__testfixtures__',
    './lib/postinstall/src/__testfixtures__',
  ],
  presets: [
    ['@babel/preset-env', { shippedProposals: true, useBuiltIns: 'usage', corejs: '3' }],
    '@babel/preset-typescript',
    '@babel/preset-react',
    '@babel/preset-flow'

  ],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-syntax-dynamic-import',



  ],
  env: {
    test: withTests,
  },
  overrides: [
    {
      test: './examples/vue-kitchen-sink',
      presets: ['babel-preset-vue'],
      env: {
        test: withTests,
      },
    },
    {
      test: './lib',
      presets: [
        ['@babel/preset-env', { shippedProposals: true, useBuiltIns: 'usage', corejs: '3' }],
        '@babel/preset-react',
      ],
      plugins: [
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-syntax-dynamic-import',
        'babel-plugin-macros',
        ['@emotion', { sourceMap: true, autoLabel: true }],
        '@babel/plugin-transform-react-constant-elements',
        'babel-plugin-add-react-displayname',
      ],
      env: {
        test: withTests,
      },
    },
    {
      test: [
        './lib/node-logger',
        './lib/codemod',
        './addons/storyshots',
        '**/src/server/**',
        '**/src/bin/**',
      ],
      presets: [
        [
          '@babel/preset-env',
          {
            shippedProposals: true,
            useBuiltIns: 'usage',
            targets: {
              node: '8.11',
            },
            corejs: '3',
          },
        ],
      ],
      plugins: [
        '@emotion',
        '@babel/plugin-transform-arrow-functions',
        '@babel/plugin-transform-shorthand-properties',
        '@babel/plugin-transform-block-scoping',
        '@babel/plugin-transform-destructuring',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-transform-modules-commonjs'

      ],
      env: {
        test: withTests,
      },
    },
  ],
};
