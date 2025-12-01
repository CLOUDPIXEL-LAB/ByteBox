/**
 * ByteBox - Tag Component
 * Made with ❤️ by Pink Pixel
 */

import React from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';
import type { Tag as TagType } from '@/types';

interface TagProps {
  tag: TagType;
  selected?: boolean;
  onSelect?: (tag: TagType) => void;
  onRemove?: (tag: TagType) => void;
  showCount?: boolean;
  count?: number;
  className?: string;
}

function Tag({
  tag,
  selected = false,
  onSelect,
  onRemove,
  showCount = false,
  count,
  className,
}: TagProps) {
  const isInteractive = onSelect || onRemove;

  return (
    tag && (
  
    <span
      onClick={onSelect ? () => onSelect(tag) : undefined}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all',
        isInteractive && 'cursor-pointer hover:scale-105',
        selected && 'ring-2',
        className
      )}
      style={{
        backgroundColor: selected ? `${tag.color}30` : `${tag.color}20`,
        color: tag.color,
        border: `1px solid ${tag.color}${selected ? '60' : '40'}`,
      }}
    >
      <span>{tag.name}</span>
      
      {showCount && count !== undefined && (
        <span className="text-xs opacity-70">({count})</span>
      )}
      
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(tag);
          }}
          className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
          aria-label={`Remove ${tag.name} tag`}
        >
          <XMarkIcon className="w-3 h-3" />
        </button>
      )}
    </span>
  ));
}

interface TagListProps {
  tags: TagType[];
  selectedTags?: TagType[];
  onTagSelect?: (tag: TagType) => void;
  showCounts?: boolean;
  counts?: Record<string, number>;
  className?: string;
}

function TagList({
  tags,
  selectedTags = [],
  onTagSelect,
  showCounts = false,
  counts = {},
  className,
}: TagListProps) {
  const isTagSelected = (tag: TagType) =>
    selectedTags.some((t) => t.id === tag.id);

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag) => (
        <Tag
          key={tag.id}
          tag={tag}
          selected={isTagSelected(tag)}
          onSelect={onTagSelect}
          showCount={showCounts}
          count={counts[tag.id]}
        />
      ))}
    </div>
  );
}

interface TagFilterProps {
  tags: TagType[];
  selectedTags: TagType[];
  onTagSelect: (tag: TagType) => void;
  onTagRemove: (tag: TagType) => void;
  onClearAll?: () => void;
  showCounts?: boolean;
  counts?: Record<string, number>;
}

function TagFilter({
  tags,
  selectedTags,
  onTagSelect,
  onTagRemove,
  onClearAll,
  showCounts = false,
  counts = {},
}: TagFilterProps) {
  return (
    <div className="space-y-3">
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-(--text-soft)">
              Active Filters ({selectedTags.length})
            </span>
            {onClearAll && (
              <button
                onClick={onClearAll}
                className="text-xs text-accent hover:underline transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Tag key={tag.id} tag={tag} selected onRemove={onTagRemove} />
            ))}
          </div>
        </div>
      )}

      {/* Available Tags */}
      <div className="space-y-2">
        <span className="text-sm font-medium text-(--text-soft)">
          Available Tags
        </span>
        <TagList
          tags={tags.filter((t) => !selectedTags.some((st) => st.id === t.id))}
          onTagSelect={onTagSelect}
          showCounts={showCounts}
          counts={counts}
        />
      </div>
    </div>
  );
}
export { Tag, TagFilter, TagList, TagType };
