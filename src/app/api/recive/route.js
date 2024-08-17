import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const getQuery = await db.query(`SELECT * FROM reports`);
    const getTitles = await db.query(`SELECT DISTINCT(titre) FROM reports`);
    return NextResponse.json({data:getQuery,titles:getTitles});
  } catch (error) {
    console.error('Error fetching data:', error);
    return new NextResponse('Error fetching data', { status: 500 });
  }
}
