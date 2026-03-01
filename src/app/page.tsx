'use client';

import { useEffect, useState, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DraggableBoard } from '@/components/layout/DraggableBoard';
import { FilterPanel } from '@/components/ui/FilterPanel';
import { CardModal } from '@/components/cards/CardModal';
import CreateCardModal from '@/components/cards/CreateCardModal';
import { useSearch } from '@/hooks/useSearch';
import type { Board, Card as CardType, Tag, CategoryWithCards } from '@/types';

export default function Home() {
  const [boardData, setBoardData] = useState<Board | null>(null);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [preselectedCategoryId, setPreselectedCategoryId] = useState<string | undefined>();

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const [cardsRes, tagsRes] = await Promise.all([
          fetch('/api/cards'),
          fetch('/api/tags'),
        ]);
        if (!cardsRes.ok) throw new Error('Failed to fetch cards');
        
        const data = await cardsRes.json();
        const tagsData = tagsRes.ok ? await tagsRes.json() : data.tags;
        setBoardData(data.boardData);
        setAllTags(tagsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Extract all cards from board data
  const allCards: CardType[] = boardData?.categories.flatMap(cat => cat.cards) || [];

  // Use search hook
  const {
    setSearchQuery,
    selectedTags,
    toggleTag,
    filterMode,
    setFilterMode,
    viewMode,
    setViewMode,
    showStarredOnly,
    toggleStarredFilter,
    starredCount,
    filteredCards,
    clearFilters,
    hasActiveFilters,
  } = useSearch({ cards: allCards });

  // Helper for filtering board data
  const filterCategoryCards = (category: CategoryWithCards) => ({
    ...category,
    cards: category.cards.filter((card: CardType) => filteredCards.includes(card)),
  });

  // Build filtered board data
  const filteredBoardData: Board | null = boardData
    ? {
        ...boardData,
        categories: boardData.categories.map(filterCategoryCards),
      }
    : null;

  // Handle card move (drag & drop)
  const handleCardMove = async (cardId: string, newCategoryId: string, newOrder: number) => {
    try {
      const response = await fetch('/api/cards', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: [{ id: cardId, categoryId: newCategoryId, order: newOrder }],
        }),
      });

      if (!response.ok) throw new Error('Failed to update card position');

      // Refetch data after move
      const data = await response.json();
      setBoardData(data.boardData);
    } catch (error) {
      console.error('Error moving card:', error);
    }
  };

  // Helper to update a card in a category
  const updateCardInCategory = (category: CategoryWithCards, cardId: string, starred: boolean) => ({
    ...category,
    cards: category.cards.map(card =>
      card.id === cardId ? { ...card, starred } : card
    ),
  });

  // Helper to update a card's starred status in board data
  const updateCardStarred = useCallback((cardId: string, starred: boolean) => {
    setBoardData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        categories: prev.categories.map(category => updateCardInCategory(category, cardId, starred)),
      };
    });
  }, []);

  // Handle star toggle
  const handleStarToggle = useCallback(async (cardId: string) => {
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggleStar' }),
      });

      if (!response.ok) throw new Error('Failed to toggle star');

      const updatedCard = await response.json();
      updateCardStarred(cardId, updatedCard.starred);
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  }, [updateCardStarred]);

  // Refresh data after card creation
  const refreshData = async () => {
    try {
      const [cardsRes, tagsRes] = await Promise.all([
        fetch('/api/cards'),
        fetch('/api/tags'),
      ]);
      if (!cardsRes.ok) throw new Error('Failed to fetch cards');
      
      const data = await cardsRes.json();
      const tagsData = tagsRes.ok ? await tagsRes.json() : data.tags;
      setBoardData(data.boardData);
      setAllTags(tagsData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Handle add card from category
  const handleAddCard = (categoryId?: string) => {
    setPreselectedCategoryId(categoryId);
    setIsCreateModalOpen(true);
  };

  // Handle card click
  const handleCardClick = (card: CardType) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  // Handle create modal close
  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
    setPreselectedCategoryId(undefined);
  };

  // Handle card deletion
  const handleDeleteCard = async () => {
    // Refresh the board data after deletion
    await refreshData();
  };

  // Handle card update from modal
  const handleUpdateCard = useCallback((updatedCard: CardType) => {
    setBoardData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        categories: prev.categories.map(category => {
          const hasCard = category.cards.some(c => c.id === updatedCard.id);
          // Card moved away from this category
          if (hasCard && category.id !== updatedCard.categoryId) {
            return { ...category, cards: category.cards.filter(c => c.id !== updatedCard.id) };
          }
          // Card belongs here — update or append
          if (category.id === updatedCard.categoryId) {
            if (hasCard) {
              return { ...category, cards: category.cards.map(c => c.id === updatedCard.id ? updatedCard : c) };
            }
            return { ...category, cards: [...category.cards, updatedCard] };
          }
          return category;
        }),
      };
    });
    // Also update the selected card so the modal shows fresh data
    setSelectedCard(updatedCard);
  }, []);

  // Handle category rename
  const handleCategoryRename = useCallback(async (id: string, newName: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) throw new Error('Failed to rename category');
      setBoardData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          categories: prev.categories.map(c =>
            c.id === id ? { ...c, name: newName } : c
          ),
        };
      });
    } catch (error) {
      console.error('Error renaming category:', error);
    }
  }, []);

  // Handle category delete
  const handleCategoryDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete category');
      setBoardData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          categories: prev.categories.filter(c => c.id !== id),
        };
      });
      // If selected card was in deleted category, close modal
      setSelectedCard(prev => prev?.categoryId === id ? null : prev);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }, []);

  // Keyboard shortcut for starring selected card (Cmd/Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      // Cmd/Ctrl+Shift+S to toggle starred filter (avoid conflict with save)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        toggleStarredFilter();
      }
    };

    globalThis.window.addEventListener('keydown', handleKeyDown);
    return () => globalThis.window.removeEventListener('keydown', handleKeyDown);
  }, [toggleStarredFilter]);

  // Clean up the selected card once the modal finishes closing
  useEffect(() => {
    if (!isModalOpen && selectedCard) {
      const timeout = setTimeout(() => setSelectedCard(null), 200);
      return () => clearTimeout(timeout);
    }
  }, [isModalOpen, selectedCard]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-3">
            <div
              className="w-12 h-12 border-4 rounded-full animate-spin mx-auto"
              style={{
                borderColor: 'color-mix(in srgb, var(--accent-primary) 25%, transparent)',
                borderTopColor: 'var(--accent-primary)',
              }}
            />
            <p className="text-(--foreground-soft)">Loading ByteBox...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      onSearch={setSearchQuery}
      onToggleFilters={() => setShowFilters(!showFilters)}
      showFiltersToggle={allTags.length > 0}
      onQuickAdd={() => handleAddCard()}
      showStarredOnly={showStarredOnly}
      onToggleStarred={toggleStarredFilter}
      starredCount={starredCount}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={clearFilters}
    >
      <div className="flex gap-6 h-full">
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Active Filters Badge */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[color-mix(in_srgb,var(--accent-border)_70%,transparent)] bg-accent-soft/80 shadow-[0_12px_40px_rgba(15,23,42,0.22)]">
              <span className="text-sm text-accent">
                {filteredCards.length} of {allCards.length} cards shown
                {viewMode === 'starred' && ' (starred only)'}
                {viewMode === 'recent' && ' (most recent)'}
                {viewMode === 'by-tag' && selectedTags.length > 0 && ` (${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''})`}
              </span>
              <button
                onClick={clearFilters}
                className="ml-auto text-xs text-accent-soft hover:text-accent transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Board */}
          {filteredBoardData ? (
            <DraggableBoard
              categories={filteredBoardData.categories}
              onCardMove={handleCardMove}
              onCardClick={handleCardClick}
              onAddCard={handleAddCard}
              onStarToggle={handleStarToggle}
              onCategoryRename={handleCategoryRename}
              onCategoryDelete={handleCategoryDelete}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-(--foreground-soft)">No cards found</p>
            </div>
          )}
        </div>

        {/* Filter Sidebar */}
        {showFilters && (
          <aside className="w-80 shrink-0 animate-in slide-in-from-right duration-200">
            <div className="sticky top-0 glass glass--dense p-4 rounded-2xl">
              <FilterPanel
                availableTags={allTags}
                selectedTags={selectedTags}
                onToggleTag={toggleTag}
                filterMode={filterMode}
                onFilterModeChange={setFilterMode}
                onClearFilters={clearFilters}
                showStarredOnly={showStarredOnly}
                onToggleStarred={toggleStarredFilter}
                starredCount={starredCount}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>
          </aside>
        )}
      </div>

      {/* Card Modal */}
      <CardModal
        card={selectedCard}
        isOpen={Boolean(selectedCard) && isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={handleDeleteCard}
        onUpdate={handleUpdateCard}
        allTags={allTags}
        categories={(boardData?.categories ?? []).map((cat) => ({ id: cat.id, name: cat.name, color: cat.color }))}
      />

      {/* Create Card Modal */}
      <CreateCardModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onSuccess={refreshData}
        categories={(boardData?.categories ?? []).map((cat) => ({ id: cat.id, name: cat.name }))}
        allTags={allTags}
        preselectedCategoryId={preselectedCategoryId}
      />
    </AppLayout>
  );
}
