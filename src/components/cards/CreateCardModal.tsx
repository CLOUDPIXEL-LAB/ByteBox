/**
 * ByteBox - Create Card Modal (restored UX)
 * Large dialog with drag-and-drop upload for image/doc, previews and tag picking.
 */

'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { processImage, validateImageFile } from '@/lib/utils/imageUtils';
import { processDocFile, validateDocFile, formatFileSize, getFileIcon } from '@/lib/utils/fileUtils';

interface CreateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: Array<{ id: string; name: string }>;
  allTags: Array<{ id: string; name: string; color: string }>;
  preselectedCategoryId?: string;
}

export default function CreateCardModal({
  isOpen,
  onClose,
  onSuccess,
  categories,
  allTags,
  preselectedCategoryId,
}: CreateCardModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<'bookmark' | 'snippet' | 'command' | 'doc' | 'image' | 'note'>('snippet');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [categoryId, setCategoryId] = useState<string>('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [imageData, setImageData] = useState<string>('');
  const [fileData, setFileData] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCategoryId(preselectedCategoryId || categories[0]?.id || '');
    }
  }, [isOpen, preselectedCategoryId, categories]);

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]));
  };

  const resetFileState = () => {
    setImageData('');
    setFileData('');
    setFileName('');
    setFileType('');
    setFileSize(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageSelect = async (file: File) => {
    setError('');
    const ok = validateImageFile(file);
    if (!ok.valid) {
      setError(ok.error || 'Invalid image');
      return;
    }
    try {
      const base64 = await processImage(file);
      setImageData(base64);
      setContent(base64); // keep content searchable/previewable
      setFileName(file.name);
      setFileType(file.type);
      setFileSize(file.size);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to process image');
    }
  };

  const handleDocSelect = async (file: File) => {
    setError('');
    const ok = validateDocFile(file);
    if (!ok.valid) {
      setError(ok.error || 'Invalid document');
      return;
    }
    try {
      const processed = await processDocFile(file);
      setFileData(processed.base64);
      setFileName(processed.fileName);
      setFileType(processed.fileType);
      setFileSize(processed.fileSize);
      setContent(processed.extractedText);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to process document');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === 'image') handleImageSelect(file);
    else if (type === 'doc') handleDocSelect(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (type === 'image') handleImageSelect(file);
    else if (type === 'doc') handleDocSelect(file);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title || !categoryId) {
      setError('Please provide a title and category');
      return;
    }
    if (type !== 'image' && type !== 'doc' && !content) {
      setError('Please provide content');
      return;
    }
    setIsSubmitting(true);
    try {
      const tagNames = selectedTagIds
        .map((id) => allTags.find((t) => t.id === id)?.name)
        .filter((n): n is string => !!n);

      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          title,
          description,
          content,
          imageData: type === 'image' ? imageData : undefined,
          fileData: type === 'doc' ? fileData : undefined,
          fileName: type === 'doc' ? fileName : undefined,
          fileType: type === 'doc' ? fileType : undefined,
          fileSize: type === 'doc' ? fileSize : undefined,
          language: type === 'snippet' || type === 'command' ? language : undefined,
          categoryId,
          tagNames,
        }),
      });
      if (!res.ok) throw new Error('Failed to create card');

      // success
      onSuccess();
      onClose();
      // reset form
      setTitle('');
      setDescription('');
      setContent('');
      setLanguage('javascript');
      setSelectedTagIds([]);
      resetFileState();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create card');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden glass glass--dense rounded-3xl text-left align-middle shadow-[0_40px_120px_rgba(5,6,11,0.65)]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 glass-bar">
                  <Dialog.Title className="text-lg font-semibold text-(--text-strong)">Create New Card</Dialog.Title>
                  <button onClick={onClose} className="p-2 rounded-lg hover:bg-[color-mix(in_srgb,var(--hover-bg)_90%,transparent)]">
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <form onSubmit={submit} className="p-6 space-y-5">
                  {error && <div className="text-sm text-red-400">{error}</div>}

                  {/* Type & Category */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">Type</label>
                      <select
                        value={type}
                        onChange={(e) => {
                          const next = e.target.value as typeof type;
                          setType(next);
                          setContent('');
                          resetFileState();
                        }}
                        className="w-full rounded-lg border px-3 py-2 bg-background"
                      >
                        {['bookmark', 'snippet', 'command', 'doc', 'image', 'note'].map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Category</label>
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 bg-background"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">Title</label>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 bg-background"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Description</label>
                      <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border px-3 py-2 bg-background" />
                    </div>
                  </div>

                  {/* Conditional Inputs */}
                  {type === 'image' ? (
                    <div>
                      <label className="block text-xs font-medium mb-2">Upload Image</label>
                      <div
                        onDrop={onDrop}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        className={cn(
                          'relative flex flex-col items-center justify-center p-8 rounded-xl cursor-pointer transition-all border-2 border-dashed',
                          isDragging
                            ? 'border-[color-mix(in_srgb,var(--accent-border)_90%,transparent)] bg-accent-soft/30 scale-[1.02]'
                            : 'border-[color-mix(in_srgb,var(--card-border)_70%,transparent)] hover:border-[color-mix(in_srgb,var(--accent-border)_60%,transparent)] surface-card surface-card--subtle'
                        )}
                        onClick={() => fileInputRef.current?.click()}
                        title="Click or drop an image"
                      >
                        <PhotoIcon className="w-10 h-10 mb-2" />
                        <p className="text-sm">Click or drag an image here</p>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                        <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_center,var(--accent-soft),transparent_70%)] opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
                      </div>

                      {imageData && (
                        <div className="mt-3 rounded-xl overflow-hidden border border-[color-mix(in_srgb,var(--accent-border)_40%,transparent)]">
                          <img src={imageData} alt={title || 'Uploaded image'} className="w-full h-auto max-h-[60vh] object-contain bg-black/5" />
                        </div>
                      )}
                    </div>
                  ) : type === 'doc' ? (
                    <div className="space-y-3">
                      <label className="block text-xs font-medium">Upload File <span className="text-(--text-soft)">(Markdown or PDF, max 10MB)</span></label>
                      <div
                        onDrop={onDrop}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        className={cn(
                          'relative flex flex-col items-center justify-center p-8 rounded-xl cursor-pointer transition-all border-2 border-dashed',
                          isDragging
                            ? 'border-[color-mix(in_srgb,var(--accent-border)_90%,transparent)] bg-accent-soft/30 scale-[1.02]'
                            : 'border-[color-mix(in_srgb,var(--card-border)_70%,transparent)] hover:border-[color-mix(in_srgb,var(--accent-border)_60%,transparent)] surface-card surface-card--subtle'
                        )}
                        onClick={() => fileInputRef.current?.click()}
                        title="Click or drop a file"
                      >
                        <span className="text-5xl mb-2">{getFileIcon(fileType || 'text/markdown')}</span>
                        <p className="text-sm font-medium">Click or drag file here</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".md,.markdown,application/pdf,text/markdown,text/plain"
                          className="hidden"
                          onChange={handleFileInput}
                        />
                        <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_center,var(--accent-soft),transparent_70%)] opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
                      </div>

                      {fileData && (
                        <div className="p-4 rounded-xl border border-[color-mix(in_srgb,var(--accent-border)_60%,transparent)] surface-card surface-card--subtle">
                          <div className="flex items-start gap-3">
                            <span className="text-3xl shrink-0">{getFileIcon(fileType)}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{fileName}</p>
                              <p className="text-xs text-(--text-soft) mt-1">{fileType?.toUpperCase()} · {formatFileSize(fileSize)}</p>
                              {content && <p className="text-xs text-(--text-soft) mt-2 line-clamp-3">{content.substring(0, 150)}...</p>}
                            </div>
                            <button
                              type="button"
                              onClick={resetFileState}
                              className="p-2 rounded-lg hover:bg-hover transition-colors shrink-0"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-medium mb-1">{type === 'bookmark' ? 'URL' : 'Content'}</label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={type === 'bookmark' ? 'https://example.com' : 'Enter content...'}
                        rows={6}
                        className={cn('w-full px-3 py-2 rounded-lg font-mono text-sm bg-background border border-card-border focus:outline-none focus:ring-2')}
                        required={!imageData && !fileData}
                      />
                    </div>
                  )}

                  {/* Language (snippets/commands) */}
                  {(type === 'snippet' || type === 'command') && (
                    <div>
                      <label className="block text-xs font-medium mb-1">Language</label>
                      <input value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full rounded-lg border px-3 py-2 bg-background" />
                    </div>
                  )}

                  {/* Tags */}
                  <div>
                    <label className="block text-xs font-medium mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleTag(tag.id)}
                          className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-all', selectedTagIds.includes(tag.id) ? 'ring-2' : 'hover:scale-105')}
                          style={{
                            backgroundColor: selectedTagIds.includes(tag.id) ? `${tag.color}30` : `${tag.color}20`,
                            color: tag.color,
                            border: `1px solid ${tag.color}${selectedTagIds.includes(tag.id) ? '60' : '40'}`,
                          }}
                        >
                          {tag.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[color-mix(in_srgb,var(--card-border)_80%,transparent)]">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">
                      Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg accent-gradient disabled:opacity-60">
                      {isSubmitting ? 'Creating...' : 'Create Card'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
