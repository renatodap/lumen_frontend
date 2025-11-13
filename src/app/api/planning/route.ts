import { NextRequest, NextResponse } from 'next/server';
import { PlanningData } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: PlanningData = await request.json();

    const { userId, date, reviewedItems, assignedTasks, winCondition, calendarEvents } = body;

    if (!userId || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and date' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Planning data saved successfully',
        data: {
          userId,
          date,
          reviewedItemsCount: reviewedItems.length,
          assignedTasksCount: assignedTasks.length,
          winCondition,
          calendarEventsCount: calendarEvents.length,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving planning data:', error);
    return NextResponse.json({ error: 'Failed to save planning data' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');

    if (!userId || !date) {
      return NextResponse.json(
        { error: 'Missing required query parameters: userId and date' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: null,
        message: 'No planning data found for this date',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching planning data:', error);
    return NextResponse.json({ error: 'Failed to fetch planning data' }, { status: 500 });
  }
}
