import { ButtonLink, PageIntro } from '@/components/ui';

export default function NotFound() {
  return (
    <PageIntro
      title="This page is not here"
      lead="The link may be old, or the page may have moved. The podcast and the media library are good places to pick the trail back up."
    >
      <div className="flex flex-col gap-3 pb-24 sm:flex-row">
        <ButtonLink href="/">Go to the homepage</ButtonLink>
        <ButtonLink href="/media" variant="line-light">
          Open the media library
        </ButtonLink>
      </div>
    </PageIntro>
  );
}
