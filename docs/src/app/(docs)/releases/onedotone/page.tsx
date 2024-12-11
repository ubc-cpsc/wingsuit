// eslint-disable-next-line import/no-unresolved
import { NextLink } from '@/app/(docs)/layout';
// eslint-disable-next-line import/no-unresolved
import WingsuitPattern from '@/component/wingsuit-pattern';
import Mdx from './index.mdx';
// eslint-disable-next-line import/no-unresolved
import 'organisms/next-links';

const next: NextLink[] = [
  {
    title: 'Did we catch your interest?',
    text: 'Do the 10 minute quickstart guide!',
    href: '/guides/quick-start-guide',
    link_title: 'Quickstart',
  },
];

export const metadata = {
  title: 'Wingsuit Version 1.1',
  description: 'We have added a lot of new features in Version 1.1.',
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
