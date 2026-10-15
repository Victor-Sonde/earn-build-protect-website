import 'server-only';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '@keystatic-config';
import { safeUrl } from './format';
import { type Pillar, type PlatformKey, platformLabels } from './site';

export { formatDate, safeUrl, youtubeId } from './format';

const reader = createReader(process.cwd(), keystaticConfig);

export type Guest = { slug: string; name: string; role: string; bio: string; photo: string | null; link: string | null };

export type Episode = {
  slug: string;
  title: string;
  featured: boolean;
  season: number | null;
  episodeNumber: number | null;
  publishDate: string | null;
  durationMinutes: number | null;
  mediaType: 'video' | 'audio';
  description: string;
  image: string | null;
  host: string;
  guests: Guest[];
  pillars: Pillar[];
  topics: string[];
  youtubeUrl: string | null;
  spotifyUrl: string | null;
  applePodcastsUrl: string | null;
  keyTakeaways: string[];
  timestamps: { time: string; label: string }[];
  transcript: string;
  relatedSlugs: string[];
  seoTitle: string;
  seoDescription: string;
  showNotes: () => Promise<unknown>;
};

export type MediaItem = {
  id: string;
  kind: 'episode' | 'clip' | 'article';
  kindLabel: string;
  title: string;
  description: string;
  href: string;
  external: boolean;
  date: string | null;
  durationMinutes: number | null;
  image: string | null;
  pillars: Pillar[];
  topics: string[];
};

const isLive = (entry: { status: string; publishDate?: string | null }) => {
  if (entry.status !== 'published') return false;
  // A future publish date keeps the item hidden until the next build on or after that date.
  if (entry.publishDate && entry.publishDate > new Date().toISOString().slice(0, 10)) return false;
  return true;
};

const byNewest = <T extends { publishDate?: string | null; date?: string | null }>(a: T, b: T) =>
  (b.publishDate ?? b.date ?? '').localeCompare(a.publishDate ?? a.date ?? '');

async function topicNames(): Promise<Map<string, string>> {
  const all = await reader.collections.topics.all();
  return new Map(all.map((t) => [t.slug, t.entry.name]));
}

const resolveTopics = (slugs: readonly (string | null)[], names: Map<string, string>) =>
  slugs.map((s) => (s ? names.get(s) : undefined)).filter((n): n is string => Boolean(n));

export async function getTopics(): Promise<string[]> {
  return [...(await topicNames()).values()].sort((a, b) => a.localeCompare(b));
}

export async function getEpisodes(): Promise<Episode[]> {
  const [all, guests, names] = await Promise.all([
    reader.collections.episodes.all(),
    reader.collections.guests.all(),
    topicNames(),
  ]);
  const guestMap = new Map<string, Guest>(
    guests.map((g) => [
      g.slug,
      { slug: g.slug, name: g.entry.name, role: g.entry.role, bio: g.entry.bio, photo: g.entry.photo, link: g.entry.link },
    ]),
  );
  return all
    .filter(({ entry }) => isLive(entry))
    .map(({ slug, entry }) => ({
      slug,
      title: entry.title,
      featured: entry.featured,
      season: entry.season,
      episodeNumber: entry.episodeNumber,
      publishDate: entry.publishDate,
      durationMinutes: entry.durationMinutes,
      mediaType: entry.mediaType,
      description: entry.description,
      image: entry.featuredImage,
      host: entry.host,
      guests: entry.guests.map((g) => (g ? guestMap.get(g) : undefined)).filter((g): g is Guest => Boolean(g)),
      pillars: [...entry.pillars] as Pillar[],
      topics: resolveTopics(entry.topics, names),
      youtubeUrl: entry.youtubeUrl,
      spotifyUrl: entry.spotifyUrl,
      applePodcastsUrl: entry.applePodcastsUrl,
      keyTakeaways: entry.keyTakeaways.filter(Boolean),
      timestamps: entry.timestamps.filter((t) => t.time && t.label),
      transcript: entry.transcript,
      relatedSlugs: entry.relatedEpisodes.filter((s): s is string => Boolean(s)),
      seoTitle: entry.seoTitle,
      seoDescription: entry.seoDescription,
      showNotes: async () => (await entry.showNotes()).node,
    }))
    .sort(byNewest);
}

export async function getEpisode(slug: string) {
  return (await getEpisodes()).find((e) => e.slug === slug) ?? null;
}

export async function getFeaturedEpisode() {
  const episodes = await getEpisodes();
  return episodes.find((e) => e.featured) ?? episodes[0] ?? null;
}

export type Article = {
  slug: string;
  title: string;
  description: string;
  publishDate: string | null;
  author: string;
  image: string | null;
  pillars: Pillar[];
  topics: string[];
  seoTitle: string;
  seoDescription: string;
  body: () => Promise<unknown>;
};

export async function getArticles(): Promise<Article[]> {
  const [all, names] = await Promise.all([reader.collections.articles.all(), topicNames()]);
  return all
    .filter(({ entry }) => isLive(entry))
    .map(({ slug, entry }) => ({
      slug,
      title: entry.title,
      description: entry.description,
      publishDate: entry.publishDate,
      author: entry.author,
      image: entry.image,
      pillars: [...entry.pillars] as Pillar[],
      topics: resolveTopics(entry.topics, names),
      seoTitle: entry.seoTitle,
      seoDescription: entry.seoDescription,
      body: async () => (await entry.body()).node,
    }))
    .sort(byNewest);
}

const clipLabels = { clip: 'Clip', interview: 'Interview', explainer: 'Explainer', resource: 'Resource' } as const;

/** Everything published, in one list, for the media library and "latest" sections. */
export async function getMediaItems(): Promise<MediaItem[]> {
  const [episodes, articles, clips, names] = await Promise.all([
    getEpisodes(),
    getArticles(),
    reader.collections.clips.all(),
    topicNames(),
  ]);
  const items: MediaItem[] = [
    ...episodes.map((e) => ({
      id: `episode-${e.slug}`,
      kind: 'episode' as const,
      kindLabel: 'Episode',
      title: e.title,
      description: e.description,
      href: `/podcast/${e.slug}`,
      external: false,
      date: e.publishDate,
      durationMinutes: e.durationMinutes,
      image: e.image,
      pillars: e.pillars,
      topics: e.topics,
    })),
    ...clips
      .filter(({ entry }) => isLive(entry) && safeUrl(entry.url))
      .map(({ slug, entry }) => ({
        id: `clip-${slug}`,
        kind: 'clip' as const,
        kindLabel: clipLabels[entry.clipType],
        title: entry.title,
        description: entry.description,
        href: entry.url as string,
        external: true,
        date: entry.publishDate,
        durationMinutes: entry.durationMinutes,
        image: entry.thumbnail,
        pillars: [...entry.pillars] as Pillar[],
        topics: resolveTopics(entry.topics, names),
      })),
    ...articles.map((a) => ({
      id: `article-${a.slug}`,
      kind: 'article' as const,
      kindLabel: 'Article',
      title: a.title,
      description: a.description,
      href: `/insights/${a.slug}`,
      external: false,
      date: a.publishDate,
      durationMinutes: null,
      image: a.image,
      pillars: a.pillars,
      topics: a.topics,
    })),
  ];
  return items.sort(byNewest);
}

export type Platform = { key: PlatformKey; label: string; url: string };

export async function getSettings() {
  const s = await reader.singletons.settings.read();
  const platforms: Platform[] = [];
  for (const key of Object.keys(platformLabels) as PlatformKey[]) {
    const url = safeUrl(s?.platforms?.[key]);
    if (url) platforms.push({ key, label: platformLabels[key], url });
  }
  const review = s?.protectionReview;
  const reviewUrl = safeUrl(review?.url);
  return {
    platforms,
    host: s?.host?.name ? { name: s.host.name, role: s.host.role, bio: s.host.bio, photo: s.host.photo } : null,
    founderBio: s?.founderBio?.trim() || null,
    regulatoryDisclosure: s?.regulatoryDisclosure?.trim() || null,
    // The section renders only when it is switched on AND every approved element is present.
    protectionReview:
      review?.enabled && reviewUrl && review.heading && review.body && review.buttonLabel && review.disclosure
        ? {
            heading: review.heading,
            body: review.body,
            buttonLabel: review.buttonLabel,
            url: reviewUrl,
            // The second link shows only when both its label and a valid address are present.
            secondary:
              review.secondaryLabel && safeUrl(review.secondaryUrl)
                ? { label: review.secondaryLabel, url: safeUrl(review.secondaryUrl) as string }
                : null,
            disclosure: review.disclosure,
          }
        : null,
  };
}
