import React from 'react';

interface TruncatedTextProps {
  text: string | undefined;
  maxLength?: number;
  className?: string;
}

export function TruncatedText({
  text,
  maxLength = 35,
  className = '',
}: TruncatedTextProps) {
  if (text === undefined) {
    return '-';
  }

  const shouldTruncate = text.length > maxLength;
  const displayText = shouldTruncate ? `${text.slice(0, maxLength)}...` : text;

  return (
    <span title={shouldTruncate ? text : undefined} className={className}>
      {displayText}
    </span>
  );
}
