import Image from 'next/image';
import { Mark } from './ui';

/**
 * 16:9 artwork. Uses the uploaded thumbnail when there is one. Otherwise draws a typographic
 * cover from the brand mark, so nothing on the site depends on stock photography.
 */
export function Cover({
  image,
  title,
  caption,
  priority = false,
  sizes = '(min-width: 1080px) 40vw, 100vw',
}: {
  image: string | null;
  title: string;
  caption?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (image) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-panel bg-ink-raised ring-1 ring-inset ring-paper/10">
        <Image
          src={image}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
    );
  }
  return (
    <div className="relative isolate flex aspect-video flex-col justify-between overflow-hidden rounded-panel bg-gradient-to-br from-ink-raised to-ink p-[7%] text-paper ring-1 ring-inset ring-ink-line">
      <div
        className="absolute -right-[20%] -top-[40%] -z-10 aspect-square w-[80%] rounded-full bg-[radial-gradient(circle,rgb(var(--amber)/0.22),transparent_65%)] transition-transform duration-700 ease-out group-hover:scale-110"
        aria-hidden="true"
      />
      <Mark className="absolute -bottom-[6%] right-[6%] -z-10 h-[62%] w-auto text-paper/[0.04]" />
      <Mark className="h-[14%] w-auto self-start text-amber" />
      <div>
        <p className="display line-clamp-3 max-w-[22ch] text-[clamp(1.125rem,2.6vw,1.875rem)] leading-[1.04]">{title}</p>
        {caption ? <p className="kicker mt-3 text-amber">{caption}</p> : null}
      </div>
    </div>
  );
}
