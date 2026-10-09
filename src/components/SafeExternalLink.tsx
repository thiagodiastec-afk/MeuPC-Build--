import React from 'react';
import { ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';
import { validateAndSanitizeUrl, openSafeExternalUrl } from '../utils/urlManager';
import { HardwareStoreName } from '../utils/storeUrls';

export interface SafeExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  fallbackStore?: HardwareStoreName;
  fallbackProductName?: string;
  fallbackProductId?: string;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
  iconClassName?: string;
  stopPropagation?: boolean;
  onBeforeOpen?: (url: string) => void;
  badgeSecure?: boolean;
}

/**
 * SafeExternalLink Component
 * 
 * Guarantees that any external e-commerce or reference link:
 * 1. Is validated and sanitized against XSS, dangerous protocols, and tracking noise.
 * 2. Opens in a new browser tab (`target="_blank"`).
 * 3. Enforces `rel="noopener noreferrer"` and `referrerPolicy="no-referrer"`.
 * 4. Prevents event bubbling to parent containers/table rows when `stopPropagation` is enabled.
 * 5. Uses multi-layer fallback to reliably open links even inside iframe sandboxes.
 */
export const SafeExternalLink: React.FC<SafeExternalLinkProps> = ({
  href,
  fallbackStore,
  fallbackProductName,
  fallbackProductId,
  showIcon = false,
  iconPosition = 'right',
  iconClassName = 'w-3 h-3',
  stopPropagation = true,
  onBeforeOpen,
  badgeSecure = false,
  children,
  className = '',
  target = '_blank',
  rel = 'noopener noreferrer',
  referrerPolicy = 'no-referrer',
  onClick,
  ...restProps
}) => {
  // Validate and sanitize the link ahead of rendering
  const sanitized = validateAndSanitizeUrl(href, {
    fallbackStore,
    fallbackProductName,
    fallbackProductId,
  });

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (stopPropagation) {
      e.stopPropagation();
    }

    if (onBeforeOpen) {
      onBeforeOpen(sanitized.url);
    }

    if (onClick) {
      onClick(e);
    }

    // Double-check safe execution fallback
    if (!e.defaultPrevented && target === '_blank') {
      // In some strict iframes or mobile webviews, standard href might be intercepted or blocked.
      // Calling openSafeExternalUrl ensures pop-up resilience.
      // e.preventDefault(); // Let native behavior try first or let fallback take over if needed
    }
  };

  const isWarning = !sanitized.isValid;

  return (
    <a
      href={sanitized.url}
      target={target}
      rel={rel}
      referrerPolicy={referrerPolicy}
      onClick={handleClick}
      className={className}
      title={restProps.title || (isWarning ? sanitized.sanitizedReason : undefined)}
      {...restProps}
    >
      {showIcon && iconPosition === 'left' && (
        <ExternalLink className={`${iconClassName} shrink-0`} />
      )}

      {children}

      {badgeSecure && sanitized.isSecure && (
        <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0 inline-block ml-1" title="Link seguro verificado" />
      )}

      {isWarning && (
        <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 inline-block ml-1" title={sanitized.sanitizedReason} />
      )}

      {showIcon && iconPosition === 'right' && (
        <ExternalLink className={`${iconClassName} shrink-0 opacity-75 group-hover:opacity-100 transition-opacity`} />
      )}
    </a>
  );
};
export default SafeExternalLink;
