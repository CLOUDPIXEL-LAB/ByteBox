/**
 * ByteBox - Cards API Routes
 * Made with ❤️ by Pink Pixel
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllCards, createCardWithTags, reorderCards, getBoardData, getAllTags, deleteAllData } from '@/lib/db';

export async function GET() {
  try {
    const boardData = await getBoardData();
    const cards = await getAllCards();
    const tags = await getAllTags();
    return NextResponse.json({ boardData, cards, tags });
  } catch (error) {
    console.error('GET /api/cards failed:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract tag names from tags array
    const tagNames = body.tags?.map((tag: unknown) => {
      if (typeof tag === 'string') return tag;
      if (tag && typeof tag === 'object' && 'name' in tag) {
        return (tag as { name: string }).name;
      }
      return null;
    }).filter((name: string | null): name is string => name !== null) || [];
    
    // Create card with tags
    const card = await createCardWithTags({
      type: body.type,
      title: body.title,
      description: body.description,
      content: body.content,
      imageData: body.imageData,
      fileData: body.fileData,
      fileName: body.fileName,
      fileType: body.fileType,
      fileSize: body.fileSize,
      language: body.language,
      categoryId: body.categoryId,
      tagNames,
    });
    
    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { updates } = body;
    await reorderCards(updates);
    const boardData = await getBoardData();
    const tags = await getAllTags();
    return NextResponse.json({ success: true, boardData, tags });
  } catch (error) {
    console.error('PATCH /api/cards failed:', error);
    return NextResponse.json({ error: 'Failed to reorder cards' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await deleteAllData();
    return NextResponse.json({ success: true, message: 'All data deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/cards failed:', error);
    return NextResponse.json({ error: 'Failed to delete all data' }, { status: 500 });
  }
}
