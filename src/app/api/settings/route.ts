/**
 * ByteBox - Settings API Route
 * Persists user theme/UI settings to the database
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserSettings, updateUserSettings } from '@/lib/db/queries';

// GET /api/settings - Retrieve current settings
export async function GET() {
  try {
    const settings = await getUserSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PATCH /api/settings - Update settings (partial update)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const settings = await updateUserSettings(body);
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Replace all settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const settings = await updateUserSettings(body);
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error replacing settings:', error);
    return NextResponse.json(
      { error: 'Failed to replace settings' },
      { status: 500 }
    );
  }
}
