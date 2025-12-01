/**
 * ByteBox - Search Page
 * Made with ❤️ by Pink Pixel
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/cards/Card';
import { Tag } from '@/components/ui/Tag';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import type { Card as PrismaCard, Category as PrismaCategory, Tag as PrismaTag } from '@prisma/client';
import type { Card as CardType } from '@/types';

type CardWithRelations = PrismaCard & {
  category: PrismaCategory;
  tags: PrismaTag[];
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cards, setCards] = useState<CardWithRelations[]>([]);
  const [filteredCards, setFilteredCards] = useState<CardWithRelations[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<PrismaTag[]>([]);
  const [filterMode, setFilterMode] = useState<'AND' | 'OR'>('OR');
  const [searchType, setSearchType] = useState<'all' | 'title' | 'content' | 'tags'>('all');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/cards');
      const data = await response.json();
      
      const allCards: CardWithRelations[] = [];
      data.boardData.categories.forEach((cat: { cards: CardWithRelations[] }) => {
        allCards.push(...cat.cards);
      });
      
      setCards(allCards);
      setAllTags(data.tags);
      setFilteredCards(allCards);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const performSearch = useCallback(() => {
    let results = [...cards];

    // Apply text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(card => {
        switch (searchType) {
          case 'title':
            return card.title.toLowerCase().includes(query);
          case 'content':
            return card.content?.toLowerCase().includes(query) || 
                   card.description?.toLowerCase().includes(query);
          case 'tags':
            return card.tags.some(tag => tag.name.toLowerCase().includes(query));
          case 'all':
          default:
            return (
              card.title.toLowerCase().includes(query) ||
              card.description?.toLowerCase().includes(query) ||
              card.content?.toLowerCase().includes(query) ||
              card.tags.some(tag => tag.name.toLowerCase().includes(query))
            );
        }
      });
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      results = results.filter(card => {
        const cardTagIds = card.tags.map(t => t.id);
        if (filterMode === 'AND') {
          return selectedTags.every(tagId => cardTagIds.includes(tagId));
        } else {
          return selectedTags.some(tagId => cardTagIds.includes(tagId));
        }
      });
    }

    setFilteredCards(results);
  }, [cards, searchQuery, searchType, selectedTags, filterMode]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSearchType('all');
  };

  return (
    <AppLayout onQuickAdd={() => alert('Please navigate to the Dashboard to create cards')}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold font-brand text-[var(--text-strong)]">Search</h1>
          <div className="h-1 w-16 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }} />
          <p className="text-[var(--text-soft)] mt-3">
            Find cards, snippets, commands, and docs instantly.
          </p>
        </div>

        {/* Search Input */}
        <div className="glass glass--dense rounded-3xl p-6 space-y-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--icon-2)' }} />
            <input
              type="text"
              placeholder="Search cards, snippets, commands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-12 pr-4 py-3 rounded-xl',
                'surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)]',
                'focus:border-[color-mix(in_srgb,var(--accent-border)_80%,transparent)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent-primary)_30%,transparent)]',
                'transition-all'
              )}
            />
          </div>

          {/* Search Type Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-[var(--text-soft)]">Search in:</span>
            {(['all', 'title', 'content', 'tags'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSearchType(type)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all border',
                  searchType === type
                    ? 'accent-gradient border-transparent shadow-[0_12px_32px_color-mix(in_srgb,var(--accent-primary)_25%,transparent)]'
                    : 'surface-card surface-card--subtle border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] hover:border-[color-mix(in_srgb,var(--accent-border)_45%,transparent)]'
                )}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="glass glass--dense rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FunnelIcon className="w-5 h-5" style={{ color: 'var(--icon-2)' }} />
                <h2 className="font-semibold">Filter by Tags</h2>
              </div>
              <button
                onClick={() => setFilterMode(filterMode === 'AND' ? 'OR' : 'AND')}
                className="px-3 py-1.5 rounded-lg text-sm font-medium surface-card surface-card--subtle border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] hover:border-[color-mix(in_srgb,var(--accent-border)_45%,transparent)] transition-all"
              >
                Mode: {filterMode}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Tag
                  key={tag.id}
                  tag={tag}
                  selected={selectedTags.includes(tag.id)}
                  onSelect={() => toggleTag(tag.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-strong)]">
              {loading ? 'Loading...' : `${filteredCards.length} Result${filteredCards.length !== 1 ? 's' : ''}`}
            </h2>
            {(searchQuery || selectedTags.length > 0) && (
              <button
                onClick={clearFilters}
                className="text-sm text-accent hover:underline mt-1"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div
              className="animate-spin w-8 h-8 border-4 rounded-full"
              style={{
                borderColor: 'color-mix(in srgb, var(--accent-primary) 28%, transparent)',
                borderTopColor: 'transparent',
                borderRightColor: 'var(--accent-primary)',
              }}
            />
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="glass glass--dense rounded-3xl p-12 text-center space-y-3">
            <MagnifyingGlassIcon
              className="w-16 h-16 mx-auto"
              style={{ color: 'color-mix(in srgb, var(--icon-3) 45%, transparent)' }}
            />
            <h3 className="text-xl font-semibold text-[var(--text-strong)]">No results found</h3>
            <p className="text-[var(--text-soft)]">
              {searchQuery || selectedTags.length > 0
                ? 'Try adjusting your search or filters'
                : 'Start searching to find your cards'}
            </p>
            {(searchQuery || selectedTags.length > 0) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-lg accent-gradient font-medium shadow-[0_16px_40px_color-mix(in_srgb,var(--accent-primary)_30%,transparent)] hover:shadow-[0_20px_55px_color-mix(in_srgb,var(--accent-primary)_40%,transparent)] transition-all"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map((card) => (
              <Card key={card.id} card={card as unknown as CardType} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
