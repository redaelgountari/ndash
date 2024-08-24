import React from 'react';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db, sql } from '@vercel/postgres';

export async function POST(req) {
  const client = await db.connect();
  try {
    const { name, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    await client.sql`
      INSERT INTO users(name, email, password) VALUES (${name}, ${email}, ${hashedPassword})
      ON CONFLICT (email) DO NOTHING`; 

    return NextResponse.json({ message: 'User created successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    client.release(); 
  }
}
