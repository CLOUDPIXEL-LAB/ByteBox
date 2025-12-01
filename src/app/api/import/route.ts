/**
 * ByteBox - Import API Route
 * Made with ❤️ by Pink Pixel
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

interface ImportCategory {
  id: string;
  name: string;
  description: string | null;
  color: string;
  order: number;
}

interface ImportTag {
  name: string;
  color: string;
}

interface ImportCard {
  id: string;
  type: string;
  title: string;
  description: string | null;
  content: string | null;
  language: string | null;
  categoryId: string;
  order: number;
  tags: string[];
}

interface ImportData {
  version: string;
  exportedAt: string;
  app: string;
  data: {
    categories: ImportCategory[];
    tags: ImportTag[];
    cards: ImportCard[];
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: ImportData = await request.json();

    // Validate import data structure
    if (!body.version || !body.data) {
      return NextResponse.json(
        { error: 'Invalid import file format' },
        { status: 400 }
      );
    }

    if (body.app !== 'ByteBox') {
      return NextResponse.json(
        { error: 'Import file is not from ByteBox' },
        { status: 400 }
      );
    }

    const { categories, tags, cards } = body.data;

    // Perform import in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Clear existing data (optional - comment out if you want to merge)
      // await tx.card.deleteMany();
      // await tx.category.deleteMany();
      // await tx.tag.deleteMany();

      // Import categories
      const categoryMap = new Map<string, string>();
      for (const cat of categories) {
        const newCat = await tx.category.upsert({
          where: { id: cat.id },
          update: {
            name: cat.name,
            description: cat.description,
            color: cat.color,
            order: cat.order,
          },
          create: {
            id: cat.id,
            name: cat.name,
            description: cat.description,
            color: cat.color,
            order: cat.order,
          },
        });
        categoryMap.set(cat.id, newCat.id);
      }

      // Import tags
      const tagMap = new Map<string, string>();
      for (const tag of tags) {
        const newTag = await tx.tag.upsert({
          where: { name: tag.name },
          update: {
            color: tag.color,
          },
          create: {
            name: tag.name,
            color: tag.color,
          },
        });
        tagMap.set(tag.name, newTag.id);
      }

      // Import cards
      let importedCards = 0;
      for (const card of cards) {
        const categoryId = categoryMap.get(card.categoryId);
        if (!categoryId) continue; // Skip if category doesn't exist

        // Get tag IDs
        const cardTags = card.tags || [];
        const tagConnections = cardTags
          .map((tagName: string) => tagMap.get(tagName))
          .filter((tagId): tagId is string => tagId != null)
          .map((tagId) => ({ id: tagId }));

        await tx.card.upsert({
          where: { id: card.id },
          update: {
            type: card.type,
            title: card.title,
            description: card.description ?? undefined,
            content: card.content ?? undefined,
            language: card.language ?? undefined,
            categoryId,
            order: card.order,
            tags: {
              set: tagConnections,
            },
          },
          create: {
            id: card.id,
            type: card.type,
            title: card.title,
            description: card.description ?? undefined,
            content: card.content || '',
            language: card.language ?? undefined,
            categoryId,
            order: card.order,
            tags: {
              connect: tagConnections,
            },
          },
        });
        importedCards++;
      }

      return {
        categoriesImported: categories.length,
        tagsImported: tags.length,
        cardsImported: importedCards,
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Data imported successfully',
      ...result,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Failed to import data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
