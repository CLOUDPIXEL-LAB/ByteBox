'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon, BookmarkIcon, CodeBracketIcon, CommandLineIcon, DocumentTextIcon, PhotoIcon, ClipboardIcon, TrashIcon, MagnifyingGlassPlusIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import type { Card as CardType } from '@/types';
import { normalizeLanguage } from '@/lib/utils/syntax';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Lightbox } from '@/components/ui/Lightbox';
import { useTheme } from '@/contexts/ThemeContext';

interface CardModalProps {
  card: CardType | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (cardId: string) => void;
}

const cardTypeIcons = {
  bookmark: BookmarkIcon,
  snippet: CodeBracketIcon,
  command: CommandLineIcon,
  doc: DocumentTextIcon,
  image: PhotoIcon,
  note: PencilSquareIcon,
};

export function CardModal({ card, isOpen, onClose, onDelete }: Readonly<CardModalProps>) {
  const { getIconColor } = useTheme();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const cardId = card?.id ?? null;
  
  useEffect(() => {
    if (!isOpen || !cardId) {
      queueMicrotask(() => {
        setShowDeleteConfirm(false);
        setCopySuccess(false);
        setLightboxOpen(false);
      });
    }
  }, [isOpen, cardId]);

  // Cleanup body styles on unmount
  useEffect(() => {
    return () => {
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
    };
  }, []);
  
  if (!card) return null;

  const Icon = cardTypeIcons[card.type as keyof typeof cardTypeIcons];
  const shouldHighlight = card.type === 'snippet' || card.type === 'command';
  const iconColor = getIconColor(card.type);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(card.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    try {
      await fetch(`/api/cards/${card.id}`, {
        method: 'DELETE',
      });
      onDelete(card.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  };

  const renderCardContent = () => {
    // Image Display
    if (card.type === 'image' && card.imageData) {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-(--text-soft)">Image</h4>
            <button
              onClick={() => setLightboxOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border border-[color-mix(in_srgb,var(--card-border)_90%,transparent)] hover:bg-[color-mix(in_srgb,var(--hover-bg)_90%,transparent)] transition-colors"
            >
              <MagnifyingGlassPlusIcon className="w-4 h-4" />
              <span>View Full-Screen</span>
            </button>
          </div>
          <button
            type="button"
            className="relative rounded-xl overflow-hidden border border-[color-mix(in_srgb,var(--accent-border)_40%,transparent)] w-full bg-transparent p-0 cursor-pointer"
            onClick={() => setLightboxOpen(true)}
            aria-label={`View ${card.title} full-screen`}
          >
            <img
              src={card.imageData.trim()}
              alt={card.title}
              className="w-full h-auto max-h-[70vh] object-contain bg-black/5"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </button>
        </div>
      );
    }

    // Code/Command with Syntax Highlighting
    if (shouldHighlight) {
      return (
        <CodeBlock
          code={card.content}
          language={normalizeLanguage(card.language ?? (card.type === 'command' ? 'bash' : 'javascript'))}
          filename={card.url ?? undefined}
        />
      );
    }

    // Bookmark URL
    if (card.type === 'bookmark') {
      return (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-(--text-soft)">URL</h4>
          <a
            href={card.content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline transition-colors font-mono text-sm block break-all"
          >
            {card.content}
          </a>
        </div>
      );
    }

    // Default content display (notes, docs, etc.)
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-(--text-soft)">Content</h4>
        <div className="prose prose-invert max-w-none">
          <pre className="whitespace-pre-wrap wrap-break-word text-sm font-mono surface-card surface-card--subtle border border-transparent px-4 py-3 rounded-xl">
            {card.content}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <>
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md" aria-hidden="true" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-4xl transform overflow-hidden glass glass--dense rounded-3xl text-left align-middle shadow-[0_40px_120px_rgba(5,6,11,0.65)] transition-all">
                {/* Header */}
                <div className="flex items-start justify-between px-6 py-5 glass-bar">
                  <div className="flex items-center gap-3 flex-1">
                    <Icon className="w-6 h-6" style={{ color: iconColor }} />
                    <div className="flex-1">
                      <DialogTitle className="text-xl font-semibold text-(--text-strong)">
                        {card.title}
                      </DialogTitle>
                      {card.description && (
                        <p className="text-sm text-(--text-soft) mt-1">
                          {card.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl transition-colors hover:bg-[color-mix(in_srgb,var(--hover-bg)_90%,transparent)]"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Card Content Display */}
                  {renderCardContent()}

                  {/* Tags */}
                  {card.tags && card.tags.length > 0 && (
                    <div className="space-y-2 pt-4 border-t border-[color-mix(in_srgb,var(--card-border)_80%,transparent)]">
                      <h4 className="text-sm font-medium text-(--text-soft)">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {card.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="px-3 py-1.5 rounded-full text-sm font-medium"
                            style={{
                              backgroundColor: `${tag.color}20`,
                              color: tag.color,
                              border: `1px solid ${tag.color}40`,
                            }}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] text-xs text-(--text-soft)">
                    <div>
                      <span className="font-medium">Type:</span>{' '}
                      <span className="capitalize">{card.type}</span>
                    </div>
                    {card.createdAt && (
                      <div>
                        <span className="font-medium">Created:</span>{' '}
                        {new Date(card.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 glass-bar border-t border-[color-mix(in_srgb,var(--card-border)_80%,transparent)]">
                  {/* Left: Delete button */}
                  <div>
                    {showDeleteConfirm ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-red-400">Delete this card?</span>
                        <button
                          onClick={handleDelete}
                          className="px-3 py-1.5 rounded-lg text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          Yes, delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-3 py-1.5 rounded-lg text-sm border border-[color-mix(in_srgb,var(--card-border)_90%,transparent)] hover:bg-[color-mix(in_srgb,var(--hover-bg)_90%,transparent)] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete card"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Right: Action buttons */}
                  <div className="flex items-center gap-3">
                    {/* Copy button (for non-image cards) */}
                    {card.type !== 'image' && card.content && (
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[color-mix(in_srgb,var(--card-border)_90%,transparent)] hover:bg-[color-mix(in_srgb,var(--hover-bg)_90%,transparent)] transition-colors"
                        title="Copy content"
                      >
                        <ClipboardIcon className="w-4 h-4" />
                        <span className="text-sm">{copySuccess ? 'Copied!' : 'Copy'}</span>
                      </button>
                    )}
                    
                    {/* Visit Link button (for bookmarks) */}
                    {card.type === 'bookmark' && card.content && (
                      <a
                        href={card.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg accent-gradient font-medium hover:shadow-lg hover:shadow-[color-mix(in_srgb,var(--accent-primary)_35%,transparent)] transition-all"
                      >
                        Visit Link
                      </a>
                    )}
                    
                    {/* Close button */}
                    <button
                      onClick={onClose}
                      className="px-4 py-2 rounded-lg border border-[color-mix(in_srgb,var(--card-border)_90%,transparent)] hover:bg-[color-mix(in_srgb,var(--hover-bg)_90%,transparent)] transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
    
    {/* Lightbox for full-screen image viewing */}
    {card.type === 'image' && card.imageData && (
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        imageUrl={card.imageData.trim()}
        title={card.title}
      />
    )}
    </>
  );
}
