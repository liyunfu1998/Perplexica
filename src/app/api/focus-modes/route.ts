import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { focusModes } from '@/lib/db/schema';

export async function GET() {
  try {
    const modes = await db.select().from(focusModes);
    return NextResponse.json(modes);
  } catch (error) {
    console.error('Error fetching focus modes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch focus modes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, title, description, api_source, icon } = body;

    const mode = await db
      .insert(focusModes)
      .values({
        key,
        title,
        description,
        api_source,
        icon,
      })
      .returning();

    return NextResponse.json(mode[0]);
  } catch (error) {
    console.error('Error creating focus mode:', error);
    return NextResponse.json(
      { error: 'Failed to create focus mode' },
      { status: 500 }
    );
  }
}