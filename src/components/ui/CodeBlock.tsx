'use client';

import { useState, useEffect } from 'react';
import { codeToHtml } from 'shiki';
import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({
  code,
  language,
  filename,
  className = '',
}: Readonly<CodeBlockProps>) {
  const [html, setHtml] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function highlight() {
      try {
        setIsLoading(true);
        const highlighted = await codeToHtml(code, {
          lang: language,
          theme: 'github-dark-dimmed',
        });
        setHtml(highlighted);
      } catch (error) {
        console.error('Error highlighting code:', error);
        // Fallback to plain text if highlighting fails
        setHtml(`<pre><code>${code}</code></pre>`);
      } finally {
        setIsLoading(false);
      }
    }
    highlight();
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={`relative rounded-lg bg-[#22272e] border border-card-border overflow-hidden ${className}`}>
        <div className="flex items-center justify-center p-8">
          <div
            className="w-6 h-6 border-2 rounded-full animate-spin"
            style={{
              borderColor: 'color-mix(in srgb, var(--accent-primary) 25%, transparent)',
              borderTopColor: 'var(--accent-primary)',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      {(filename || language) && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#22272e] border border-card-border border-b-0">
          <div className="flex items-center gap-2">
            {filename && (
              <span className="text-sm font-mono text-gray-300">{filename}</span>
            )}
            {!filename && language && (
              <span className="text-xs font-mono text-gray-400 uppercase">{language}</span>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-2 py-1 rounded text-xs font-medium transition-all hover:bg-hover"
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <CheckIcon className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <ClipboardDocumentIcon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Copy
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Code */}
      <div
        className="overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          fontSize: '14px',
          lineHeight: '1.6',
        }}
      />

      {/* Copy button for no-header mode */}
      {!filename && !language && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 rounded bg-[#22272e]/80 backdrop-blur-sm border border-card-border opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Copy code"
        >
          {copied ? (
            <CheckIcon className="w-4 h-4 text-green-400" />
          ) : (
            <ClipboardDocumentIcon className="w-4 h-4 text-gray-400" />
          )}
        </button>
      )}
    </div>
  );
}
