/**
 * ByteBox - Categories API Routes
 * Made with ❤️ by Pink Pixel
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllCategories, createCategory } from '@/lib/db';

export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('GET /api/categories failed:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, color } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const category = await createCategory({
      name: name.trim(),
      description: description?.trim() || undefined,
      color: color || '#ec4899',
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('POST /api/categories failed:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
