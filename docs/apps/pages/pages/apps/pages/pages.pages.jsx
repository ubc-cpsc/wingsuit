import 'protons';
import MDX from './index.mdx';

const template = require('../../docs.twig');

export default {
  path: '/apps/pages',
  template,
  MDX,
  vars: {
    meta_title: 'Wingsuit Pages',
    meta_description: 'Wingsuit Preset to generate static pages from patterns.',
    next: [
      {
        title: 'UI Patterns',
        text: 'Learn how wingsuit leverages UI patterns.',
        link_title: 'continue',
        href: '/components/wingsuit',
      },
      {
        title: 'Components',
        text: 'Learn about creating and editing components.',
        link_title: 'continue',
        href: '/components/overview',
      },
    ],
  },
};
