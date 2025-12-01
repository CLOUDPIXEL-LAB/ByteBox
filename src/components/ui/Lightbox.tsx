/**
 * ByteBox - Lightbox Component
 * Made with ❤️ by Pink Pixel
 */

'use client';

import { Fragment, useEffect } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon, ArrowDownTrayIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { downloadImage, copyImageToClipboard } from '@/lib/utils/imageUtils';
import { cn } from '@/lib/utils';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
  className?: string;
}

export function Lightbox({ isOpen, onClose, imageUrl, title, className }: Readonly<LightboxProps>) {
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    globalThis.addEventListener('keydown', handleEsc);
    return () => globalThis.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleDownload = () => {
    const filename = title ? `${title.replaceAll(/\s+/g, '_')}.jpg` : 'bytebox_image.jpg';
    downloadImage(imageUrl, filename);
  };

  const handleCopy = async () => {
    try {
      await copyImageToClipboard(imageUrl);
      // Could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop with glass effect */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div 
            className="fixed inset-0 backdrop-blur-xl"
            style={{
              background: 'rgba(5, 6, 11, 0.92)',
            }}
          />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className={cn('relative w-full max-w-7xl', className)}>
                {/* Control Bar */}
                <div className="absolute top-0 right-0 z-10 flex items-center gap-2 p-4">
                  {/* Download Button */}
                  <button
                    onClick={handleDownload}
                    className="group glass glass--dense p-3 rounded-xl transition-all hover:scale-105"
                    title="Download image"
                    style={{
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    <ArrowDownTrayIcon 
                      className="w-5 h-5 transition-colors" 
                      style={{ color: 'var(--accent-primary)' }}
                    />
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    className="group glass glass--dense p-3 rounded-xl transition-all hover:scale-105"
                    title="Copy to clipboard"
                    style={{
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    <ClipboardIcon 
                      className="w-5 h-5 transition-colors" 
                      style={{ color: 'var(--accent-primary)' }}
                    />
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="group glass glass--dense p-3 rounded-xl transition-all hover:scale-105"
                    title="Close (ESC)"
                    style={{
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    <XMarkIcon 
                      className="w-5 h-5 transition-colors" 
                      style={{ color: 'var(--accent-primary)' }}
                    />
                  </button>
                </div>

                {/* Title */}
                {title && (
                  <div className="absolute top-4 left-4 z-10">
                    <div 
                      className="glass glass--dense px-4 py-2 rounded-xl"
                      style={{
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                      }}
                    >
                      <p className="text-sm font-medium text-(--text-strong)">{title}</p>
                    </div>
                  </div>
                )}

                {/* Image Container */}
                <div 
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    boxShadow: '0 30px 120px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={title || 'Full size preview'}
                    className="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
                    style={{
                      background: 'var(--glass-bg)',
                    }}
                  />
                </div>

                {/* Keyboard hint */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                  <div 
                    className="glass glass--dense px-3 py-1.5 rounded-lg"
                    style={{
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    <p className="text-xs text-(--text-soft)">
                      Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">ESC</kbd> to close
                    </p>
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
