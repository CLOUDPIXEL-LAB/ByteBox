/**
 * ByteBox - Export API Route
 * Made with ❤️ by Pink Pixel
 */

import { NextResponse } from 'next/server';
import { getAllCategories, getAllTags, getAllCards } from '@/lib/db';

export async function GET() {
  try {
    // Fetch all data
    const categories = await getAllCategories();
    const tags = await getAllTags();
    const cards = await getAllCards();

    // Create export object with metadata
    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      app: 'ByteBox',
      data: {
        categories: categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description,
          color: cat.color,
          order: cat.order,
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt,
        })),
        tags: tags.map(tag => ({
          id: tag.id,
          name: tag.name,
          color: tag.color,
          createdAt: tag.createdAt,
          updatedAt: tag.updatedAt,
        })),
        cards: cards.map(card => ({
          id: card.id,
          type: card.type,
          title: card.title,
          description: card.description,
          content: card.content,
          language: card.language,
          categoryId: card.categoryId,
          tags: card.tags.map(t => t.name),
          order: card.order,
          createdAt: card.createdAt,
          updatedAt: card.updatedAt,
        })),
      },
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
