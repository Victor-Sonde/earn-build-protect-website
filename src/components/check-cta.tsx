import { assessmentUrl } from '@/lib/site';
import { TrackedLink } from './tracked-link';
import { Arrow, buttonClass } from './ui';

/**
 * The one route into the existing Financial Resilience Check application.
 * The website never collects assessment answers. It only links out.
 */
export function CheckCta({
  placement,
  label = 'Take the Financial Resilience Check',
  variant = 'amber',
  className = '',
}: {
  placement: string;
  label?: string;
  variant?: 'amber' | 'ink' | 'line-light' | 'line-dark';
  className?: string;
}) {
  const href = assessmentUrl(placement);
  if (!href) {
    return (
      <span
        className={`inline-flex min-h-[3rem] flex-col justify-center rounded-panel border border-dashed border-current px-5 py-2 text-left text-meta leading-snug ${className}`}
        role="note"
      >
        <span className="font-bold">{label}</span>
        <span>Configuration needed: set NEXT_PUBLIC_ASSESSMENT_URL</span>
      </span>
    );
  }
  return (
    <TrackedLink
      href={href}
      event="resilience_check_click"
      eventProps={{ placement }}
      className={buttonClass(variant, className)}
    >
      {label}
      <Arrow />
    </TrackedLink>
  );
}
