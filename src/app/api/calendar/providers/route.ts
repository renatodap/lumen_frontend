import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const providers = [
      { provider: 'google', connected: false },
      { provider: 'microsoft', connected: false },
    ];

    return NextResponse.json(
      {
        success: true,
        providers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching calendar providers:', error);
    return NextResponse.json({ error: 'Failed to fetch calendar providers' }, { status: 500 });
  }
}
