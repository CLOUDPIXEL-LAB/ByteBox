/**
 * ByteBox - Single Card API Routes
 * Made with ❤️ by Pink Pixel
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCardById, updateCard, updateCardWithTags, deleteCard, toggleCardStarred } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const card = await getCardById(id);

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }
    return NextResponse.json(card);
  } catch (error) {
    console.error('GET /api/cards/[id] failed:', error);
    return NextResponse.json({ error: 'Failed to fetch card' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const card = await getCardById(id);
    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }
    
    const updatedCard = await updateCard(id, body);
    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error('PUT /api/cards/[id] failed:', error);
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Handle star toggle action
    if (body.action === 'toggleStar') {
      const card = await toggleCardStarred(id);
      return NextResponse.json(card);
    }
    
    // Handle partial updates
    const card = await getCardById(id);
    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }
    
    // If tagNames is provided, use the special update function
    if (body.tagNames !== undefined) {
      const updatedCard = await updateCardWithTags(id, {
        title: body.title,
        description: body.description,
        content: body.content,
        language: body.language,
        starred: body.starred,
        tagNames: body.tagNames,
      });
      return NextResponse.json(updatedCard);
    }
    
    const updatedCard = await updateCard(id, body);
    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error('PATCH /api/cards/[id] failed:', error);
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const card = await getCardById(id);

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }
    
    await deleteCard(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/cards/[id] failed:', error);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}
