// eslint-disable-next-line import/no-unresolved
import { NextLink } from '@/app/(docs)/layout';
// eslint-disable-next-line import/no-unresolved
import WingsuitPattern from '@/component/wingsuit-pattern';
import Mdx from './index.mdx';
// eslint-disable-next-line import/no-unresolved
import 'organisms/next-links';

const next: NextLink[] = [
  {
    title: 'Configure Wingsuit?',
    text: 'Check the wingsuit.config.js',
    link_title: 'Details',
    href: '/configurations/details',
  },
];

export const metadata = {
  title: 'Upgrade to Wingsuit 2.',
  description: 'Tutorial to upgrade to Wingsuit 2.',
};
export default function Page() {
  return (
    <>
      <Mdx />
      {/* @ts-expect-error Server Component */}
      <WingsuitPattern patternId="next_links" variables={{ items: next }} />
    </>
  );
}
