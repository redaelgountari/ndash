
import { NextResponse } from 'next/server';
import promisePool from '@/lib/db';

export async function post() {
  try {
    const [rows] = await promisePool.query('SELECT * FROM users');
    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
