/**
 * ByteBox - Tags Page
 * Made with ❤️ by Pink Pixel
 */

'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/cards/Card';
import { TagIcon, HashtagIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import type { Tag as PrismaTag, Card as PrismaCard, Category as PrismaCategory } from '@prisma/client';
import type { Card as CardType } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

type CardWithRelations = PrismaCard & {
  category: PrismaCategory;
  tags: PrismaTag[];
};

type TagWithCount = PrismaTag & {
  _count: {
    cards: number;
  };
};

export default function TagsPage() {
  const { getIconColor } = useTheme();
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [cards, setCards] = useState<CardWithRelations[]>([]);
  const [filteredCards, setFilteredCards] = useState<CardWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'count'>('name');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedTag) {
      const filtered = cards.filter(card => 
        card.tags.some(tag => tag.id === selectedTag)
      );
      setFilteredCards(filtered);
    } else {
      setFilteredCards([]);
    }
  }, [selectedTag, cards]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/cards');
      const data = await response.json();
      
      const allCards: CardWithRelations[] = [];
      data.boardData.categories.forEach((cat: { cards: CardWithRelations[] }) => {
        allCards.push(...cat.cards);
      });
      
      setCards(allCards);
      setTags(data.tags);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedTags = [...tags].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return (b._count?.cards || 0) - (a._count?.cards || 0);
    }
  });

  const getTagStats = () => {
    const totalTags = tags.length;
    const totalUsage = tags.reduce((sum, tag) => sum + (tag._count?.cards || 0), 0);
    const avgPerTag = totalTags > 0 ? (totalUsage / totalTags).toFixed(1) : 0;
    return { totalTags, totalUsage, avgPerTag };
  };

  const stats = getTagStats();
  const statPalette = {
    total: getIconColor('tags-total'),
    usage: getIconColor('tags-usage'),
    avg: getIconColor('tags-average'),
  };

  return (
    <AppLayout onQuickAdd={() => alert('Please navigate to the Dashboard to create cards')}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold font-brand text-[var(--text-strong)]">
            Tags
          </h1>
          <div className="h-1 w-16 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }} />
          <p className="text-[var(--text-soft)] mt-3">
            Organize and filter by tags
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass glass--dense rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${statPalette.total}22` }}
              >
                <TagIcon className="w-6 h-6" style={{ color: statPalette.total }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-strong)]">{stats.totalTags}</p>
                <p className="text-sm text-[var(--text-soft)]">Total Tags</p>
              </div>
            </div>
          </div>

          <div className="glass glass--dense rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${statPalette.usage}22` }}
              >
                <HashtagIcon className="w-6 h-6" style={{ color: statPalette.usage }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-strong)]">{stats.totalUsage}</p>
                <p className="text-sm text-[var(--text-soft)]">Total Usage</p>
              </div>
            </div>
          </div>

          <div className="glass glass--dense rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ color: statPalette.avg, backgroundColor: `${statPalette.avg}22` }}
              >
                📊
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-strong)]">{stats.avgPerTag}</p>
                <p className="text-sm text-[var(--text-soft)]">Avg per Tag</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tags Grid */}
        <div className="glass glass--dense rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">All Tags</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--text-soft)]">Sort by:</span>
              <button
                onClick={() => setSortBy('name')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all border',
                  sortBy === 'name'
                    ? 'accent-gradient border-transparent shadow-[0_12px_32px_color-mix(in_srgb,var(--accent-primary)_25%,transparent)]'
                    : 'surface-card surface-card--subtle border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] hover:border-[color-mix(in_srgb,var(--accent-border)_45%,transparent)]'
                )}
              >
                Name
              </button>
              <button
                onClick={() => setSortBy('count')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all border',
                  sortBy === 'count'
                    ? 'accent-gradient border-transparent shadow-[0_12px_32px_color-mix(in_srgb,var(--accent-primary)_25%,transparent)]'
                    : 'surface-card surface-card--subtle border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] hover:border-[color-mix(in_srgb,var(--accent-border)_45%,transparent)]'
                )}
              >
                Usage
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div
                className="animate-spin w-8 h-8 border-4 rounded-full"
                style={{
                  borderColor: 'color-mix(in srgb, var(--accent-primary) 30%, transparent)',
                  borderTopColor: 'transparent',
                  borderRightColor: 'var(--accent-primary)',
                }}
              />
            </div>
          ) : tags.length === 0 ? (
            <div className="text-center py-12">
              <TagIcon className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No tags yet</h3>
              <p className="text-foreground/60">
                Tags will appear here as you add them to cards
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {sortedTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(selectedTag === tag.id ? null : tag.id)}
                  className={cn(
                    'group relative surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] rounded-2xl p-4 text-left transition-all',
                    'hover:border-[color-mix(in_srgb,var(--accent-border)_50%,transparent)] hover:shadow-[0_16px_45px_color-mix(in_srgb,var(--accent-primary)_18%,transparent)]',
                    selectedTag === tag.id && 'border-[color-mix(in_srgb,var(--accent-border)_80%,transparent)] bg-accent-soft/40 shadow-[0_18px_50px_color-mix(in_srgb,var(--accent-primary)_22%,transparent)]'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full surface-card surface-card--subtle text-[var(--text-soft)] border border-[color-mix(in_srgb,var(--card-border)_70%,transparent)]">
                      {tag._count?.cards || 0}
                    </span>
                  </div>
                  <p className="font-medium truncate text-[var(--text-strong)]">{tag.name}</p>
                  <p className="text-xs text-[var(--text-soft)] mt-1">
                    {tag._count?.cards || 0} card{(tag._count?.cards || 0) !== 1 ? 's' : ''}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Tag Cards */}
        {selectedTag && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Cards with {tags.find(t => t.id === selectedTag)?.name}
              </h2>
              <button
                onClick={() => setSelectedTag(null)}
                className="text-sm text-accent hover:underline"
              >
                Clear selection
              </button>
            </div>

            {filteredCards.length === 0 ? (
              <div className="glass glass--dense rounded-3xl p-12 text-center">
                <p className="text-[var(--text-soft)]">No cards found with this tag</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCards.map((card) => (
                  <Card key={card.id} card={card as unknown as CardType} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
