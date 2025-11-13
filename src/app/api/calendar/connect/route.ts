import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const provider = searchParams.get('provider');

    if (!provider || !['google', 'microsoft'].includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid provider. Must be "google" or "microsoft"' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: `${provider} calendar integration not yet implemented`,
        provider,
      },
      { status: 501 }
    );
  } catch (error) {
    console.error('Error connecting calendar provider:', error);
    return NextResponse.json({ error: 'Failed to connect calendar provider' }, { status: 500 });
  }
}
