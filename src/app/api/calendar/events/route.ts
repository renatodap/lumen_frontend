import { NextRequest, NextResponse } from 'next/server';
import { CalendarEvent } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Missing required query parameter: date' },
        { status: 400 }
      );
    }

    const events: CalendarEvent[] = [];

    return NextResponse.json(
      {
        success: true,
        events,
        date,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json({ error: 'Failed to fetch calendar events' }, { status: 500 });
  }
}
