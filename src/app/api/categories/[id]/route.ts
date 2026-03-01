/**
 * ByteBox - Category [id] API Routes
 * Made with ❤️ by Pink Pixel
 */

import { NextRequest, NextResponse } from 'next/server';
import { updateCategory, deleteCategory, getCategoryById } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, color } = body;

    if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const existing = await getCategoryById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const updateData: Record<string, string> = {};
    if (name) updateData.name = name.trim();
    if (color && typeof color === 'string') updateData.color = color;

    const updated = await updateCategory(id, updateData);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PATCH /api/categories/[id] failed:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await getCategoryById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    await deleteCategory(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/categories/[id] failed:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
