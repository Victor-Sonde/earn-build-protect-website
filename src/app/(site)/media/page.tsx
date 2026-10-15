import type { Metadata } from 'next';
import { MediaLibrary } from '@/components/media-library';
import { Band, PageIntro } from '@/components/ui';
import { getMediaItems, getTopics } from '@/lib/content';

const description =
  'Search every Earn.Build.Protect episode, clip and article. Filter by Earn, Build or Protect, by format and by topic.';

export const metadata: Metadata = {
  title: 'Media library',
  description,
  alternates: { canonical: '/media' },
  openGraph: { title: 'Earn.Build.Protect media library', description, url: '/media' },
};

export default async function MediaPage() {
  const [items, topics] = await Promise.all([getMediaItems(), getTopics()]);
  return (
    <>
      <PageIntro
        title="Media library"
        lead="Every episode, clip and article in one place. Search by what is on your mind, or filter by pillar, format and topic."
      />
      <Band tone="paper">
        <MediaLibrary items={items} topics={topics} />
      </Band>
    </>
  );
}
