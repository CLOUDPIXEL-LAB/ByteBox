/**
 * ByteBox - Draggable Board with Persistence
 * Made with ❤️ by Pink Pixel
 */

'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { Card } from '@/components/cards/Card';
import { DraggableCard } from '@/components/cards/DraggableCard';
import type { CategoryWithCards, Card as CardType } from '@/types';
import { PlusIcon } from '@heroicons/react/24/outline';

interface DraggableBoardProps {
  categories: CategoryWithCards[];
  onCardClick?: (card: CardType) => void;
  onAddCard?: (categoryId: string) => void;
  onCardMove?: (cardId: string, newCategoryId: string, newOrder: number) => Promise<void>;
  onStarToggle?: (cardId: string, starred: boolean) => void;
  className?: string;
}

export function DraggableBoard({
  categories,
  onCardClick,
  onAddCard,
  onCardMove,
  onStarToggle,
  className,
}: DraggableBoardProps) {
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = categories
      .flatMap((c) => c.cards || [])
      .find((c) => c.id === active.id);
    if (card) setActiveCard(card);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !onCardMove) {
      setActiveCard(null);
      return;
    }

    const activeCard = categories.flatMap((c) => c.cards || []).find((c) => c.id === active.id);
    if (!activeCard) {
      setActiveCard(null);
      return;
    }

    // Find target category
    const overCard = categories.flatMap((c) => c.cards || []).find((c) => c.id === over.id);
    const targetCategory = overCard 
      ? categories.find((c) => c.cards?.some((card) => card.id === over.id))
      : categories.find((c) => c.id === over.id);

    if (targetCategory) {
      const targetCards = targetCategory.cards || [];
      const overIndex = targetCards.findIndex((c) => c.id === over.id);
      const newOrder = overIndex >= 0 ? overIndex : targetCards.length;
      
      await onCardMove(activeCard.id, targetCategory.id, newOrder);
    }

    setActiveCard(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={cn('w-full h-full', className)}>
        <div className="grid gap-4 pb-4 h-full" style={{ gridTemplateColumns: `repeat(${categories.length}, minmax(280px, 1fr))` }}>
          {categories.map((category) => {
            const cards = category.cards || [];
            return (
              <div
                key={category.id}
                className="flex flex-col min-w-0 h-full"
              >
                <div className="glass glass--dense flex h-full flex-col rounded-3xl border border-transparent overflow-hidden">
                  {/* Column Header */}
                  <div
                    className="glass-bar flex items-center justify-between gap-3 px-4 py-3"
                    style={{
                      background: `linear-gradient(135deg, ${category.color}25, transparent 70%)`,
                      borderBottomColor: `${category.color}33`,
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-(--text-strong) truncate flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </h2>
                      {category.description && (
                        <p className="text-xs text-(--text-soft) truncate mt-0.5">
                          {category.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-2">
                      <span className="text-sm font-medium text-(--text-soft)">
                        {cards.length}
                      </span>
                      {onAddCard && (
                        <button
                          onClick={() => onAddCard(category.id)}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{
                            color: category.color,
                            backgroundColor: `${category.color}18`,
                          }}
                          onMouseEnter={(event) => {
                            event.currentTarget.style.backgroundColor = `${category.color}28`;
                          }}
                          onMouseLeave={(event) => {
                            event.currentTarget.style.backgroundColor = `${category.color}18`;
                          }}
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sortable Cards Container */}
                  <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                    <div
                      className="flex-1 overflow-y-auto p-4 space-y-3"
                      style={{
                        background: 'color-mix(in srgb, var(--card-bg) 75%, transparent)',
                        borderTop: `1px solid ${category.color}22`,
                      }}
                    >
                      {cards.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                            style={{ backgroundColor: `${category.color}22` }}
                          >
                            <PlusIcon className="w-8 h-8" style={{ color: category.color }} />
                          </div>
                          <p className="text-sm text-(--foreground-soft)">No cards yet</p>
                          {onAddCard && (
                            <button
                              onClick={() => onAddCard(category.id)}
                              className="text-xs text-accent-soft hover:text-accent transition-colors mt-2"
                            >
                              Add your first card
                            </button>
                          )}
                        </div>
                      ) : (
                        cards.map((card) => (
                          <DraggableCard 
                            key={card.id} 
                            card={card} 
                            onClick={() => onCardClick?.(card)} 
                            onStarToggle={onStarToggle}
                          />
                        ))
                      )}
                    </div>
                  </SortableContext>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DragOverlay>
        {activeCard && (
          <div className="rotate-3 scale-105">
            <Card
              card={activeCard}
              className="shadow-2xl"
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
