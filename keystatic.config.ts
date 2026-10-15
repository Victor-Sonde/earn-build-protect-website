import { collection, config, fields, singleton } from '@keystatic/core';

/**
 * Content model for Earn.Build.Protect.
 *
 * Storage:
 *  - Local mode (default): edits are written to the /content folder on your own machine at /keystatic.
 *  - GitHub mode: set NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO ("owner/repository") and the editorial team
 *    signs in with GitHub at https://your-domain/keystatic. Every save is a commit, and Vercel rebuilds.
 */
const githubRepo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO as `${string}/${string}` | undefined;

const pillars = fields.multiselect({
  label: 'Pillars',
  description: 'Which of the three pillars this belongs to. Choose more than one when the topics connect.',
  options: [
    { label: 'Earn', value: 'earn' },
    { label: 'Build', value: 'build' },
    { label: 'Protect', value: 'protect' },
  ],
  defaultValue: [],
});

const status = fields.select({
  label: 'Publishing status',
  description: 'Only published items appear on the public website.',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
  ],
  defaultValue: 'draft',
});

const topics = fields.array(fields.relationship({ label: 'Topic', collection: 'topics' }), {
  label: 'Topics',
  itemLabel: (props) => props.value ?? 'Choose a topic',
});

const seo = {
  seoTitle: fields.text({ label: 'Search title', description: 'Optional. Defaults to the title.' }),
  seoDescription: fields.text({
    label: 'Search description',
    description: 'Optional. Defaults to the description. Aim for under 160 characters.',
    multiline: true,
  }),
};

export default config({
  storage: githubRepo ? { kind: 'github', repo: githubRepo } : { kind: 'local' },
  ui: {
    brand: { name: 'Earn.Build.Protect' },
    navigation: {
      Podcast: ['episodes', 'clips', 'guests'],
      Editorial: ['articles', 'topics'],
      Website: ['settings'],
    },
  },
  collections: {
    episodes: collection({
      label: 'Podcast episodes',
      slugField: 'title',
      path: 'content/episodes/*',
      format: { contentField: 'showNotes' },
      entryLayout: 'content',
      columns: ['title', 'status', 'publishDate'],
      schema: {
        title: fields.slug({ name: { label: 'Title', validation: { isRequired: true } } }),
        status,
        featured: fields.checkbox({
          label: 'Feature this episode',
          description: 'Featured on the homepage and podcast page. If none is featured, the latest episode is used.',
        }),
        season: fields.integer({ label: 'Season', defaultValue: 1 }),
        episodeNumber: fields.integer({ label: 'Episode number' }),
        publishDate: fields.date({ label: 'Publish date' }),
        durationMinutes: fields.integer({ label: 'Duration in minutes' }),
        mediaType: fields.select({
          label: 'Format',
          options: [
            { label: 'Video', value: 'video' },
            { label: 'Audio', value: 'audio' },
          ],
          defaultValue: 'video',
        }),
        description: fields.text({ label: 'Short description', multiline: true, validation: { isRequired: true } }),
        featuredImage: fields.image({
          label: 'Thumbnail',
          description: '16:9, at least 1280 by 720 pixels.',
          directory: 'public/images/episodes',
          publicPath: '/images/episodes/',
        }),
        host: fields.text({ label: 'Host' }),
        guests: fields.array(fields.relationship({ label: 'Guest', collection: 'guests' }), {
          label: 'Guests',
          itemLabel: (props) => props.value ?? 'Choose a guest',
        }),
        pillars,
        topics,
        youtubeUrl: fields.url({ label: 'YouTube video link' }),
        spotifyUrl: fields.url({ label: 'Spotify link' }),
        applePodcastsUrl: fields.url({ label: 'Apple Podcasts link' }),
        keyTakeaways: fields.array(fields.text({ label: 'Takeaway', multiline: true }), {
          label: 'Key takeaways',
          itemLabel: (props) => props.value || 'Takeaway',
        }),
        timestamps: fields.array(
          fields.object({
            time: fields.text({ label: 'Time', description: 'For example 04:30 or 1:02:15' }),
            label: fields.text({ label: 'What happens' }),
          }),
          { label: 'Timestamps', itemLabel: (props) => `${props.fields.time.value} ${props.fields.label.value}` },
        ),
        showNotes: fields.markdoc({ label: 'Show notes' }),
        transcript: fields.text({
          label: 'Transcript',
          description: 'Paste the full transcript. Leave a blank line between paragraphs.',
          multiline: true,
        }),
        relatedEpisodes: fields.array(fields.relationship({ label: 'Episode', collection: 'episodes' }), {
          label: 'Related episodes',
          itemLabel: (props) => props.value ?? 'Choose an episode',
        }),
        ...seo,
      },
    }),

    clips: collection({
      label: 'Clips and short media',
      slugField: 'title',
      path: 'content/clips/*',
      format: { data: 'yaml' },
      columns: ['title', 'status', 'publishDate'],
      schema: {
        title: fields.slug({ name: { label: 'Title', validation: { isRequired: true } } }),
        status,
        clipType: fields.select({
          label: 'Type',
          options: [
            { label: 'Short clip', value: 'clip' },
            { label: 'Interview', value: 'interview' },
            { label: 'Expert explainer', value: 'explainer' },
            { label: 'Educational resource', value: 'resource' },
          ],
          defaultValue: 'clip',
        }),
        description: fields.text({ label: 'Short description', multiline: true }),
        publishDate: fields.date({ label: 'Publish date' }),
        durationMinutes: fields.integer({ label: 'Duration in minutes' }),
        url: fields.url({
          label: 'Link to the media',
          description: 'YouTube, Instagram, TikTok or LinkedIn link. YouTube links play on the site.',
          validation: { isRequired: true },
        }),
        thumbnail: fields.image({
          label: 'Thumbnail',
          directory: 'public/images/clips',
          publicPath: '/images/clips/',
        }),
        pillars,
        topics,
        relatedEpisode: fields.relationship({ label: 'From episode', collection: 'episodes' }),
      },
    }),

    articles: collection({
      label: 'Articles',
      slugField: 'title',
      path: 'content/articles/*',
      format: { contentField: 'body' },
      entryLayout: 'content',
      columns: ['title', 'status', 'publishDate'],
      schema: {
        title: fields.slug({ name: { label: 'Title', validation: { isRequired: true } } }),
        status,
        description: fields.text({ label: 'Short description', multiline: true, validation: { isRequired: true } }),
        publishDate: fields.date({ label: 'Publish date' }),
        author: fields.text({ label: 'Author' }),
        image: fields.image({
          label: 'Lead image',
          directory: 'public/images/articles',
          publicPath: '/images/articles/',
        }),
        pillars,
        topics,
        body: fields.markdoc({ label: 'Article' }),
        ...seo,
      },
    }),

    guests: collection({
      label: 'Guest profiles',
      slugField: 'name',
      path: 'content/guests/*',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({ name: { label: 'Name', validation: { isRequired: true } } }),
        role: fields.text({ label: 'Role or title' }),
        bio: fields.text({ label: 'Short biography', multiline: true }),
        photo: fields.image({ label: 'Photo', directory: 'public/images/guests', publicPath: '/images/guests/' }),
        link: fields.url({ label: 'Link', description: 'Website or LinkedIn profile.' }),
      },
    }),

    topics: collection({
      label: 'Topics',
      slugField: 'name',
      path: 'content/topics/*',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({ name: { label: 'Topic name', validation: { isRequired: true } } }),
      },
    }),
  },

  singletons: {
    settings: singleton({
      label: 'Website settings',
      path: 'content/settings',
      format: { data: 'yaml' },
      schema: {
        platforms: fields.object(
          {
            youtube: fields.url({ label: 'YouTube' }),
            spotify: fields.url({ label: 'Spotify' }),
            applePodcasts: fields.url({ label: 'Apple Podcasts' }),
            linkedin: fields.url({ label: 'LinkedIn' }),
            instagram: fields.url({ label: 'Instagram' }),
            facebook: fields.url({ label: 'Facebook' }),
            tiktok: fields.url({ label: 'TikTok' }),
          },
          {
            label: 'Platform links',
            description: 'Only platforms with a link appear on the website. Leave blank until the account is live.',
          },
        ),
        host: fields.object(
          {
            name: fields.text({ label: 'Host name' }),
            role: fields.text({ label: 'Role' }),
            bio: fields.text({ label: 'Biography', multiline: true }),
            photo: fields.image({ label: 'Photo', directory: 'public/images/guests', publicPath: '/images/guests/' }),
          },
          { label: 'Podcast host', description: 'Shown on the podcast page once a name is entered.' },
        ),
        founderBio: fields.text({
          label: 'Founder introduction',
          description: 'Shown on the About page. Use confirmed information only.',
          multiline: true,
        }),
        regulatoryDisclosure: fields.text({
          label: 'Approved regulatory disclosure',
          description:
            'Shown in the footer of every page. Enter only wording that has been through the relevant compliance approval process.',
          multiline: true,
        }),
        protectionReview: fields.object(
          {
            enabled: fields.checkbox({
              label: 'Show the protection review section',
              description: 'Leave off until the wording, destination and disclosure have compliance approval.',
            }),
            heading: fields.text({ label: 'Heading' }),
            body: fields.text({ label: 'Approved wording', multiline: true }),
            buttonLabel: fields.text({ label: 'Button label' }),
            url: fields.url({ label: 'Destination link' }),
            secondaryLabel: fields.text({
              label: 'Second link label',
              description: 'Optional. For example a booking link shown beneath the button.',
            }),
            secondaryUrl: fields.url({ label: 'Second link destination' }),
            disclosure: fields.text({ label: 'Approved disclosure shown beside the button', multiline: true }),
          },
          { label: 'Optional protection review' },
        ),
      },
    }),
  },
});
