/**
 * ByteBox - Tags [id] API Routes
 * Made with ❤️ by Pink Pixel
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteTag } from '@/lib/db';
import { prisma } from '@/lib/db/prisma';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.tag.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    await deleteTag(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/tags/[id] failed:', error);
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
  }
}
