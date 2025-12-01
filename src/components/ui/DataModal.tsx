/**
 * ByteBox - Data Modal (Backup & Restore)
 * Made with ❤️ by Pink Pixel
 */

'use client';

import { Fragment, useState, useRef } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  CircleStackIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface DataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DataModal({ isOpen, onClose }: Readonly<DataModalProps>) {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      setExporting(true);
      setMessage(null);

      const response = await fetch('/api/export');
      if (!response.ok) throw new Error('Export failed');

      const data = await response.json();

      // Create download
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bytebox-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Data exported successfully!' });
    } catch (error) {
      console.error('Export error:', error);
      setMessage({ type: 'error', text: 'Failed to export data' });
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      setMessage(null);

      // Read file
      const text = await file.text();
      const data = JSON.parse(text);

      // Validate structure
      if (!data.version || !data.data || data.app !== 'ByteBox') {
        throw new Error('Invalid ByteBox backup file');
      }

      // Send to API
      const response = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Import failed');
      }

      const result = await response.json();
      setMessage({
        type: 'success',
        text: `Imported ${result.cardsImported} cards, ${result.categoriesImported} categories, and ${result.tagsImported} tags!`,
      });

      // Refresh the page after successful import
      setTimeout(() => {
        globalThis.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Import error:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to import data',
      });
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
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
              <DialogPanel className="w-full max-w-lg transform overflow-hidden glass glass--dense rounded-3xl text-left align-middle shadow-[0_40px_120px_rgba(5,6,11,0.65)]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 glass-bar">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-accent-soft/50">
                      <CircleStackIcon className="w-5 h-5 text-accent" />
                    </div>
                    <DialogTitle className="text-lg font-semibold text-(--text-strong)">
                      Data Management
                    </DialogTitle>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl transition-all duration-300 hover:bg-(--hover-bg) hover:scale-110 active:scale-95"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                  {/* Description */}
                  <p className="text-sm text-(--text-soft)">
                    Export your vault to create a backup, or import a previous ByteBox backup to restore your data.
                  </p>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Export Button */}
                    <button
                      onClick={handleExport}
                      disabled={exporting}
                      className={cn(
                        'group flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-300 border',
                        'border-[color-mix(in_srgb,var(--card-border)_70%,transparent)]',
                        'bg-[color-mix(in_srgb,var(--background)_22%,transparent)]',
                        'hover:border-[color-mix(in_srgb,var(--accent-border)_60%,transparent)]',
                        'hover:bg-[color-mix(in_srgb,var(--hover-bg)_80%,transparent)]',
                        'hover:shadow-lg hover:shadow-[color-mix(in_srgb,var(--accent-primary)_15%,transparent)]',
                        'hover:scale-[1.02] active:scale-[0.98]',
                        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                      )}
                    >
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--background)_35%,transparent)] border border-[color-mix(in_srgb,var(--card-border)_60%,transparent)] transition-all duration-300 group-hover:scale-110 group-hover:border-accent/50">
                        <ArrowDownTrayIcon className="w-7 h-7 text-(--text-soft) group-hover:text-accent transition-colors duration-300" />
                      </span>
                      <div className="text-center">
                        <span className="text-sm font-semibold text-(--text-strong) block">
                          {exporting ? 'Exporting...' : 'Export Data'}
                        </span>
                        <span className="text-xs text-(--text-soft) mt-1 block">
                          Download JSON backup
                        </span>
                      </div>
                    </button>

                    {/* Import Button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={importing}
                      className={cn(
                        'group flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-300 border',
                        'border-[color-mix(in_srgb,var(--accent-border)_40%,transparent)]',
                        'bg-[color-mix(in_srgb,var(--accent-soft)_65%,transparent)]',
                        'hover:border-[color-mix(in_srgb,var(--accent-border)_70%,transparent)]',
                        'hover:bg-[color-mix(in_srgb,var(--accent-soft)_85%,transparent)]',
                        'hover:shadow-lg hover:shadow-[color-mix(in_srgb,var(--accent-primary)_25%,transparent)]',
                        'hover:scale-[1.02] active:scale-[0.98]',
                        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                      )}
                    >
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--accent-primary)_25%,transparent)] border border-[color-mix(in_srgb,var(--accent-border)_50%,transparent)] transition-all duration-300 group-hover:scale-110">
                        <ArrowUpTrayIcon className="w-7 h-7 text-white" />
                      </span>
                      <div className="text-center">
                        <span className="text-sm font-semibold text-(--text-strong) block">
                          {importing ? 'Importing...' : 'Import Data'}
                        </span>
                        <span className="text-xs text-(--text-soft) mt-1 block">
                          Restore from backup
                        </span>
                      </div>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </div>

                  {/* Status Message */}
                  {message && (
                    <div
                      className={cn(
                        'flex items-start gap-3 rounded-xl px-4 py-3 text-sm border transition-all duration-300',
                        message.type === 'success'
                          ? 'bg-[color-mix(in_srgb,#22c55e_18%,transparent)] border-[color-mix(in_srgb,#22c55e_40%,transparent)] text-[color-mix(in_srgb,#22c55e_75%,white)]'
                          : 'bg-[color-mix(in_srgb,#ef4444_18%,transparent)] border-[color-mix(in_srgb,#ef4444_45%,transparent)] text-[color-mix(in_srgb,#ef4444_80%,white)]'
                      )}
                    >
                      {message.type === 'success' ? (
                        <CheckCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
                      )}
                      <p>{message.text}</p>
                    </div>
                  )}

                  {/* Info Note */}
                  <div className="rounded-xl border border-[color-mix(in_srgb,var(--card-border)_60%,transparent)] bg-[color-mix(in_srgb,var(--background)_30%,transparent)] px-4 py-3 text-xs text-(--text-soft)">
                    <strong className="font-semibold text-(--text-strong)">Note:</strong>{' '}
                    Importing will merge with existing data. Duplicate IDs will be updated with the imported values.
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
