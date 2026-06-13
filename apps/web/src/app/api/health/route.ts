import { NextResponse } from 'next/server';
import { dbHealthCheck } from '@/lib/cms/db';
import { storageMode } from '@/lib/cms/store';

export async function GET() {
  try {
    const health = await dbHealthCheck();
    return NextResponse.json({
      ok: health.ok,
      storage: health.mode ?? storageMode(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        storage: storageMode(),
        error: error instanceof Error ? error.message : 'Database connection failed',
      },
      { status: 503 },
    );
  }
}
