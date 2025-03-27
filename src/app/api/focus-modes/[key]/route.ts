import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { eq } from 'drizzle-orm';
import { focusModes } from '@/lib/db/schema';

export async function GET(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const mode = await db
      .select()
      .from(focusModes)
      .where(eq(focusModes.key, params.key));

    if (!mode.length) {
      return NextResponse.json(
        { error: 'Focus mode not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(mode[0]);
  } catch (error) {
    console.error('Error fetching focus mode:', error);
    return NextResponse.json(
      { error: 'Failed to fetch focus mode' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const body = await request.json();
    const { title, description, api_source, icon } = body;

    const mode = await db
      .update(focusModes)
      .set({
        title,
        description,
        api_source,
        icon,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(focusModes.key, params.key))
      .returning();

    if (!mode.length) {
      return NextResponse.json(
        { error: 'Focus mode not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(mode[0]);
  } catch (error) {
    console.error('Error updating focus mode:', error);
    return NextResponse.json(
      { error: 'Failed to update focus mode' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const mode = await db
      .delete(focusModes)
      .where(eq(focusModes.key, params.key))
      .returning();

    if (!mode.length) {
      return NextResponse.json(
        { error: 'Focus mode not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(mode[0]);
  } catch (error) {
    console.error('Error deleting focus mode:', error);
    return NextResponse.json(
      { error: 'Failed to delete focus mode' },
      { status: 500 }
    );
  }
}