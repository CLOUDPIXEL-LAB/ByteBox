import { useMemo, useState, useCallback } from 'react';
import type { Card } from '@/types';

type FilterMode = 'AND' | 'OR';
export type ViewMode = 'all' | 'recent' | 'starred' | 'by-tag';

const VIEW_MODE_STORAGE_KEY = 'bytebox-view-mode';

// Load view mode from localStorage (client-side only)
function getStoredViewMode(): ViewMode {
  if (globalThis.window === undefined) return 'all';
  const stored = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
  if (stored && ['all', 'recent', 'starred', 'by-tag'].includes(stored)) {
    return stored as ViewMode;
  }
  return 'all';
}

interface UseSearchOptions {
  cards: Card[];
  initialQuery?: string;
  initialTags?: string[];
  initialMode?: FilterMode;
  initialViewMode?: ViewMode;
}

export function useSearch({ 
  cards, 
  initialQuery = '', 
  initialTags = [], 
  initialMode = 'OR',
  initialViewMode,
}: UseSearchOptions) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [filterMode, setFilterMode] = useState<FilterMode>(initialMode);
  const [viewModeInternal, setViewModeInternal] = useState<ViewMode>(() => initialViewMode || getStoredViewMode());

  // Persist view mode to localStorage
  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeInternal(mode);
    if (globalThis.window !== undefined) {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
    }
  }, []);

  // Computed starred-only state based on view mode
  const showStarredOnly = viewModeInternal === 'starred';

  // Search across all card fields
  const searchCards = (cards: Card[], query: string): Card[] => {
    if (!query.trim()) return cards;

    const lowerQuery = query.toLowerCase();
    return cards.filter(card => {
      // Search in title
      if (card.title.toLowerCase().includes(lowerQuery)) return true;
      
      // Search in description
      if (card.description?.toLowerCase().includes(lowerQuery)) return true;
      
      // Search in content
      if (card.content?.toLowerCase().includes(lowerQuery)) return true;
      
      // Search in tags
      if (card.tags.some(tag => tag.name.toLowerCase().includes(lowerQuery))) return true;
      
      return false;
    });
  };

  // Filter by tags with AND/OR logic
  const filterByTags = (cards: Card[], tags: string[], mode: FilterMode): Card[] => {
    if (tags.length === 0) return cards;

    return cards.filter(card => {
      const cardTagNames = new Set(card.tags.map(tag => tag.name));
      
      if (mode === 'AND') {
        // ALL selected tags must be present
        return tags.every(tag => cardTagNames.has(tag));
      } else {
        // ANY selected tag must be present
        return tags.some(tag => cardTagNames.has(tag));
      }
    });
  };

  // Filter by starred status
  const filterByStarred = (cards: Card[], starredOnly: boolean): Card[] => {
    if (!starredOnly) return cards;
    return cards.filter(card => card.starred);
  };

  // Sort by most recent (newest first)
  const sortByRecent = (cards: Card[]): Card[] => {
    return [...cards].sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt).getTime();
      return dateB - dateA;
    });
  };

  // Compute filtered cards based on view mode, search, and tags
  const filteredCards = useMemo(() => {
    let result = cards;
    
    // Apply view mode filtering
    switch (viewModeInternal) {
      case 'starred':
        result = filterByStarred(result, true);
        break;
      case 'recent':
        result = sortByRecent(result);
        break;
      case 'by-tag':
        // By-tag mode requires tag selection to filter
        if (selectedTags.length > 0) {
          result = filterByTags(result, selectedTags, filterMode);
        }
        break;
      case 'all':
      default:
        // No view mode filtering for 'all'
        break;
    }
    
    // Apply search on top of view mode filtering
    if (searchQuery) {
      result = searchCards(result, searchQuery);
    }
    
    // Apply tag filtering for non-by-tag modes (additional filtering)
    if (viewModeInternal !== 'by-tag' && selectedTags.length > 0) {
      result = filterByTags(result, selectedTags, filterMode);
    }
    
    return result;
  }, [cards, searchQuery, selectedTags, filterMode, viewModeInternal]);

  // Get starred cards count
  const starredCount = useMemo(() => {
    return cards.filter(card => card.starred).length;
  }, [cards]);

  // Tag toggle handler
  const toggleTag = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
    // Auto-switch to by-tag mode when selecting tags (if not already in a filter mode)
    if (viewModeInternal === 'all' && !selectedTags.includes(tagName)) {
      setViewMode('by-tag');
    }
  };

  // Toggle starred filter (now toggles view mode)
  const toggleStarredFilter = useCallback(() => {
    setViewMode(viewModeInternal === 'starred' ? 'all' : 'starred');
  }, [viewModeInternal, setViewMode]);

  // Clear all filters and reset to 'all' view
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedTags([]);
    setViewMode('all');
  }, [setViewMode]);

  // Determine if there are active filters
  const hasActiveFilters = searchQuery !== '' || selectedTags.length > 0 || viewModeInternal !== 'all';

  return {
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    toggleTag,
    filterMode,
    setFilterMode,
    viewMode: viewModeInternal,
    setViewMode,
    showStarredOnly,
    toggleStarredFilter,
    starredCount,
    filteredCards,
    clearFilters,
    hasActiveFilters,
  };
}
