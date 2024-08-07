import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const getQuery = await db.query(`SELECT * FROM reports`);
    return NextResponse.json(getQuery);
  } catch (error) {
    console.error('Error fetching data:', error);
    return new NextResponse('Error fetching data', { status: 500 });
  }
}
