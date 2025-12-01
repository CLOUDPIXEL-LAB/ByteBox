/**
 * ByteBox - Draggable Card Wrapper
 * Made with ❤️ by Pink Pixel
 */

'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from './Card';
import type { Card as CardType } from '@/types';

interface DraggableCardProps {
  card: CardType;
  onClick?: () => void;
  onStarToggle?: (cardId: string, starred: boolean) => void;
}

export function DraggableCard({ card, onClick, onStarToggle }: DraggableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card card={card} onClick={onClick} onStarToggle={onStarToggle} className={isDragging ? 'cursor-grabbing' : 'cursor-grab'} />
    </div>
  );
}
