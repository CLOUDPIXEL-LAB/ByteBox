/**
 * ByteBox - Tags API Routes
 * Made with ❤️ by Pink Pixel
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { createTag } from '@/lib/db';

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { cards: true } },
      },
    });
    return NextResponse.json(tags);
  } catch (error) {
    console.error('GET /api/tags failed:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Tag name is required' }, { status: 400 });
    }
    if (name.trim().length > 32) {
      return NextResponse.json({ error: 'Tag name must be 32 characters or fewer' }, { status: 400 });
    }

    const ALLOWED_COLORS = [
      '#ec4899', // pink
      '#8b5cf6', // purple
      '#06b6d4', // cyan
      '#f59e0b', // amber
      '#22c55e', // green
      '#ef4444', // red
      '#f97316', // orange
      '#3b82f6', // blue
    ];

    const tagColor = ALLOWED_COLORS.includes(color) ? color : '#8b5cf6';

    const tag = await createTag({ name: name.trim(), color: tagColor });
    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('POST /api/tags failed:', error);
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}
