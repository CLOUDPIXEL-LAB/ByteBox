/**
 * ByteBox - Database Query Helpers (cleaned)
 * All Prisma access is centralized here and mapped to domain types.
 */

import type {
  Prisma,
  Tag as PrismaTag,
  Card as PrismaCard,
  Category as PrismaCategory,
} from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { ensureDefaultData } from '@/lib/db/default-seed';
import type { Board, Card, CategoryWithCards, Tag } from '@/types';

// ----------------------------------------------
// Mapping helpers (Prisma -> Domain)
// ----------------------------------------------
function toDomainTag(t: PrismaTag): Tag {
  return {
    id: t.id,
    name: t.name,
    color: t.color,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}

function toDomainCard(
  c: PrismaCard & { tags: PrismaTag[]; category?: PrismaCategory | null }
): Card {
  const type = c.type as Card['type'];
  return {
    url: undefined,
    id: c.id,
    type,
    cardType: [type],
    title: c.title,
    description: c.description ?? null,
    content: c.content,
    imageData: c.imageData ?? null,
    fileData: c.fileData ?? null,
    fileName: c.fileName ?? null,
    fileType: c.fileType ?? null,
    fileSize: c.fileSize ?? null,
    language: c.language ?? null,
    starred: c.starred,
    order: c.order,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    categoryId: c.categoryId,
    category: c.category
      ? {
          id: c.category.id,
          name: c.category.name,
          description: c.category.description ?? null,
          color: c.category.color,
          order: c.category.order,
          createdAt: c.category.createdAt,
          updatedAt: c.category.updatedAt,
        }
      : undefined,
    tags: c.tags.map(toDomainTag),
  };
}

function toDomainCategory(
  cat: PrismaCategory & { cards?: (PrismaCard & { tags: PrismaTag[] })[] }
): CategoryWithCards {
  return {
    id: cat.id,
    name: cat.name,
    description: cat.description ?? null,
    color: cat.color,
    order: cat.order,
    createdAt: cat.createdAt,
    updatedAt: cat.updatedAt,
    cards: (cat.cards ?? []).map((c) => toDomainCard({ ...c, category: cat })),
  };
}

// ----------------------------------------------
// Board
// ----------------------------------------------
export async function getBoardData(): Promise<Board> {
  await ensureDefaultData();

  const categoriesPrisma = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: {
      cards: {
        orderBy: { order: 'asc' },
        include: { tags: true },
      },
    },
  });

  return { categories: categoriesPrisma.map(toDomainCategory) };
}

// ----------------------------------------------
// Categories
// ----------------------------------------------
export async function getAllCategories(): Promise<CategoryWithCards[]> {
  const cats = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: { cards: { orderBy: { order: 'asc' }, include: { tags: true } } },
  });
  return cats.map(toDomainCategory);
}

export async function getCategoryById(id: string): Promise<CategoryWithCards | null> {
  const cat = await prisma.category.findUnique({
    where: { id },
    include: { cards: { orderBy: { order: 'asc' }, include: { tags: true } } },
  });
  return cat ? toDomainCategory(cat) : null;
}

export async function createCategory(data: Prisma.CategoryCreateInput) {
  if (data.order === undefined) {
    const agg = await prisma.category.aggregate({ _max: { order: true } });
    const nextOrder = (agg._max.order ?? -1) + 1;
    return prisma.category.create({ data: { ...data, order: nextOrder } });
  }
  return prisma.category.create({ data });
}

export async function reorderCategories(updates: { id: string; order: number }[]) {
  return prisma.$transaction(
    updates.map((u) =>
      prisma.category.update({ where: { id: u.id }, data: { order: u.order } })
    )
  );
}

export async function updateCategory(id: string, data: Prisma.CategoryUpdateInput) {
  return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}

// ----------------------------------------------
// Cards
// ----------------------------------------------
export async function getAllCards(): Promise<Card[]> {
  const cards = await prisma.card.findMany({ include: { category: true, tags: true }, orderBy: { order: 'asc' } });
  return cards.map(toDomainCard);
}

export async function getCardById(id: string): Promise<Card | null> {
  const c = await prisma.card.findUnique({ where: { id }, include: { category: true, tags: true } });
  return c ? toDomainCard(c) : null;
}

export async function getCardsByCategory(categoryId: string): Promise<Card[]> {
  const cards = await prisma.card.findMany({ where: { categoryId }, include: { category: true, tags: true }, orderBy: { order: 'asc' } });
  return cards.map(toDomainCard);
}

export async function getCardsByType(type: string): Promise<Card[]> {
  const cards = await prisma.card.findMany({ where: { type }, include: { category: true, tags: true }, orderBy: { createdAt: 'desc' } });
  return cards.map(toDomainCard);
}

export async function searchCards(query: string): Promise<Card[]> {
  const cards = await prisma.card.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
        { content: { contains: query } },
      ],
    },
    include: { category: true, tags: true },
  });
  return cards.map(toDomainCard);
}

export async function createCard(data: Prisma.CardCreateInput): Promise<Card> {
  const c = await prisma.card.create({ data, include: { category: true, tags: true } });
  return toDomainCard(c);
}

export async function createCardWithTags(cardData: {
  type: string;
  title: string;
  description?: string;
  content: string;
  imageData?: string;
  fileData?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  language?: string;
  starred?: boolean;
  categoryId: string;
  tagNames?: string[];
}): Promise<Card> {
  const tags = cardData.tagNames ? await Promise.all(cardData.tagNames.map((name) => getOrCreateTag(name))) : [];

  const existing = await prisma.card.findMany({ where: { categoryId: cardData.categoryId }, select: { order: true } });
  const maxOrder = existing.length ? Math.max(...existing.map((c) => c.order)) : -1;

  const created = await prisma.card.create({
    data: {
      type: cardData.type,
      title: cardData.title,
      description: cardData.description,
      content: cardData.content,
      imageData: cardData.imageData,
      fileData: cardData.fileData,
      fileName: cardData.fileName,
      fileType: cardData.fileType,
      fileSize: cardData.fileSize,
      language: cardData.language,
      starred: cardData.starred ?? false,
      order: maxOrder + 1,
      category: { connect: { id: cardData.categoryId } },
      tags: { connect: tags.map((t) => ({ id: t.id })) },
    },
    include: { category: true, tags: true },
  });

  return toDomainCard(created);
}

export async function toggleCardStarred(id: string): Promise<Card> {
  const card = await prisma.card.findUnique({ where: { id } });
  if (!card) throw new Error('Card not found');

  const updated = await prisma.card.update({
    where: { id },
    data: { starred: !card.starred },
    include: { category: true, tags: true },
  });
  return toDomainCard(updated);
}

export async function getStarredCards(): Promise<Card[]> {
  const cards = await prisma.card.findMany({
    where: { starred: true },
    include: { category: true, tags: true },
    orderBy: { updatedAt: 'desc' },
  });
  return cards.map(toDomainCard);
}

export async function updateCard(id: string, data: Prisma.CardUpdateInput): Promise<Card> {
  const c = await prisma.card.update({ where: { id }, data, include: { category: true, tags: true } });
  return toDomainCard(c);
}

export async function updateCardWithTags(id: string, cardData: {
  title?: string;
  description?: string | null;
  content?: string;
  language?: string;
  starred?: boolean;
  categoryId?: string;
  tagNames?: string[];
}): Promise<Card> {
  // If tagNames is provided, resolve them to tag IDs
  let tagConnect: { id: string }[] | undefined;
  if (cardData.tagNames !== undefined) {
    const tags = await Promise.all(cardData.tagNames.map((name) => getOrCreateTag(name)));
    tagConnect = tags.map((t) => ({ id: t.id }));
  }

  // Build update data, excluding tagNames
  const updateData: Prisma.CardUpdateInput = {};
  if (cardData.title !== undefined) updateData.title = cardData.title;
  if (cardData.description !== undefined) updateData.description = cardData.description;
  if (cardData.content !== undefined) updateData.content = cardData.content;
  if (cardData.language !== undefined) updateData.language = cardData.language;
  if (cardData.starred !== undefined) updateData.starred = cardData.starred;
  if (cardData.categoryId !== undefined) updateData.category = { connect: { id: cardData.categoryId } };

  // Handle tags - disconnect all existing and connect new ones
  if (tagConnect !== undefined) {
    updateData.tags = {
      set: tagConnect, // This replaces all existing tag connections
    };
  }

  const c = await prisma.card.update({
    where: { id },
    data: updateData,
    include: { category: true, tags: true },
  });
  return toDomainCard(c);
}

export async function deleteCard(id: string) {
  return prisma.card.delete({ where: { id } });
}

export async function reorderCards(updates: { id: string; order: number; categoryId?: string }[]) {
  return prisma.$transaction(
    updates.map((u) =>
      prisma.card.update({ where: { id: u.id }, data: { order: u.order, ...(u.categoryId ? { categoryId: u.categoryId } : {}) } })
    )
  );
}

// ----------------------------------------------
// Tags
// ----------------------------------------------
export async function getAllTags(): Promise<Tag[]> {
  const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' } });
  return tags.map(toDomainTag);
}

export async function getAllTagsWithCards(): Promise<(Tag & { cards: Card[] })[]> {
  const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' }, include: { cards: { include: { category: true, tags: true } } } });
  return tags.map((t) => ({ ...toDomainTag(t), cards: t.cards.map((c) => toDomainCard(c)) }));
}

export async function getTagById(id: string): Promise<Tag | null> {
  const t = await prisma.tag.findUnique({ where: { id } });
  return t ? toDomainTag(t) : null;
}

export async function getTagByName(name: string): Promise<Tag | null> {
  const t = await prisma.tag.findUnique({ where: { name } });
  return t ? toDomainTag(t) : null;
}

export async function createTag(data: Prisma.TagCreateInput): Promise<Tag> {
  const existing = await prisma.tag.findUnique({ where: { name: data.name } });
  const t = existing ?? (await prisma.tag.create({ data }));
  return toDomainTag(t);
}

export async function updateTag(id: string, data: Prisma.TagUpdateInput): Promise<Tag> {
  const t = await prisma.tag.update({ where: { id }, data });
  return toDomainTag(t);
}

export async function deleteTag(id: string) {
  return prisma.tag.delete({ where: { id } });
}

export async function getOrCreateTag(name: string, color = '#8b5cf6'): Promise<Tag> {
  const existing = await getTagByName(name);
  if (existing) return existing;
  return createTag({ name, color });
}

// ----------------------------------------------
// Maintenance
// ----------------------------------------------
export async function deleteAllData() {
  return prisma.$transaction([
    prisma.card.deleteMany({}),
    prisma.tag.deleteMany({}),
    prisma.category.deleteMany({}),
  ]);
}

// ----------------------------------------------
// User Settings
// ----------------------------------------------
const SETTINGS_ID = 'default';

export interface UserSettingsData {
  mode: string;
  accentThemeId: string;
  iconThemeId: string;
  customIconColor: string;
  glassIntensity: number;
  backgroundConfig: Record<string, unknown>;
  fontConfig: Record<string, unknown>;
  customAccentThemes: Record<string, unknown>[];
  settingsPresets: Record<string, unknown>[];
}

export async function getUserSettings(): Promise<UserSettingsData> {
  let settings = await prisma.userSettings.findUnique({
    where: { id: SETTINGS_ID },
  });
  // Create default settings if none exist
  if (!settings) {
    await prisma.userSettings.create({
      data: {
        id: SETTINGS_ID,
        mode: 'dark',
        accentThemeId: 'byte-classic',
        iconThemeId: 'neon-grid',
        customAccentThemes: '[]',
        settingsPresets: '[]',
        backgroundConfig: '{"type":"default"}',
        fontConfig: '{"uiFont":"system","monoFont":"geist-mono","uiFontSize":14,"bodyFontSize":14,"categoryTitleSize":16,"cardTitleSize":16,"codeFontSize":14,"sidebarWidth":240,"columnWidth":320}',
        customIconColor: '#f472b6',
        glassIntensity: 60,
      },
    });

    settings = await prisma.userSettings.findUnique({
      where: { id: SETTINGS_ID },
    });
  }

  if (!settings) {
    throw new Error('Failed to create default user settings');
  }

  return {
    mode: settings.mode,
    accentThemeId: settings.accentThemeId,
    iconThemeId: settings.iconThemeId,
    customIconColor: settings.customIconColor,
    glassIntensity: settings.glassIntensity,
    backgroundConfig: JSON.parse(settings.backgroundConfig),
    fontConfig: JSON.parse(settings.fontConfig),
    customAccentThemes: JSON.parse(settings.customAccentThemes),
    settingsPresets: JSON.parse(settings.settingsPresets),
  };
}

export async function updateUserSettings(data: Partial<UserSettingsData>): Promise<UserSettingsData> {
  // Ensure settings row exists
  const existing = await prisma.userSettings.findUnique({
    where: { id: SETTINGS_ID },
  });

  if (!existing) {
    await prisma.userSettings.create({
      data: { id: SETTINGS_ID },
    });
  }

  // Prepare update data, serializing JSON fields
  const updateData: Record<string, unknown> = {};

  if (data.mode !== undefined) updateData.mode = data.mode;
  if (data.accentThemeId !== undefined) updateData.accentThemeId = data.accentThemeId;
  if (data.iconThemeId !== undefined) updateData.iconThemeId = data.iconThemeId;
  if (data.customIconColor !== undefined) updateData.customIconColor = data.customIconColor;
  if (data.glassIntensity !== undefined) updateData.glassIntensity = data.glassIntensity;
  if (data.backgroundConfig !== undefined) updateData.backgroundConfig = JSON.stringify(data.backgroundConfig);
  if (data.fontConfig !== undefined) updateData.fontConfig = JSON.stringify(data.fontConfig);
  if (data.customAccentThemes !== undefined) updateData.customAccentThemes = JSON.stringify(data.customAccentThemes);
  if (data.settingsPresets !== undefined) updateData.settingsPresets = JSON.stringify(data.settingsPresets);

  const settings = await prisma.userSettings.update({
    where: { id: SETTINGS_ID },
    data: updateData,
  });

  return {
    mode: settings.mode,
    accentThemeId: settings.accentThemeId,
    iconThemeId: settings.iconThemeId,
    customIconColor: settings.customIconColor,
    glassIntensity: settings.glassIntensity,
    backgroundConfig: JSON.parse(settings.backgroundConfig),
    fontConfig: JSON.parse(settings.fontConfig),
    customAccentThemes: JSON.parse(settings.customAccentThemes),
    settingsPresets: JSON.parse(settings.settingsPresets),
  };
}
