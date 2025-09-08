import React from 'react';

interface HighlightTextProps {
  text: string;
  searchTerm: string;
  className?: string;
  highlightClassName?: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  searchTerm,
  className = '',
  highlightClassName = 'bg-yellow-200 font-semibold'
}) => {
  if (!searchTerm.trim()) {
    return <span className={className}>{text}</span>;
  }

  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (regex.test(part)) {
          return (
            <span key={index} className={highlightClassName}>
              {part}
            </span>
          );
        }
        return part;
      })}
    </span>
  );
};
