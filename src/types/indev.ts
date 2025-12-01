/**
 * ByteBox - Canonical Domain Types (indev)
 * These types represent the data shapes used throughout the UI.
 * They are decoupled from Prisma types and safe to import in components.
 */

// Tag used by UI components
export type Tag = {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
};

// Card type literals for type safety
export type CardType = 'bookmark' | 'snippet' | 'command' | 'doc' | 'image' | 'note';

// Forward declaration for circular reference
export type Card = {
  url: undefined;
  id: string;
  // Raw DB type string, plus convenience array form used by UI
  type: CardType;
  cardType: [CardType];
  title: string;
  description?: string | null;
  content: string;
  imageData?: string | null;
  fileData?: string | null;
  fileName?: string | null;
  fileType?: string | null;
  fileSize?: number | null;
  language?: string | null;
  starred: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  category?: Category;
  tags: Tag[];
};

export type Category = {
  id: string;
  name: string;
  description?: string | null;
  color: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  cards?: Card[];
};

export type CategoryWithCards = Category & { cards: Card[] };

export type Board = {
  categories: CategoryWithCards[];
};

// Helper guards (optional)
export function isTag(value: unknown): value is Tag {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as { id?: unknown; name?: unknown };
  return typeof candidate.id === 'string' && typeof candidate.name === 'string';
}
