import { db } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const client = await db.connect();

  try {
    const getQuery = await client.sql`SELECT * FROM reports`;
    const getTitles = await client.sql`SELECT DISTINCT(titre) FROM reports`;
    
    return NextResponse.json({
      data: getQuery.rows,
      titles: getTitles.rows,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return new NextResponse('Error fetching data', { status: 500 });
  } 
}
