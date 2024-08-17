import React from 'react'
import db from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs'
import { stat } from 'fs';

export async function POST(req,res) {

  try{
    const {name,email,password} = await req.json()
    const hasedpassword = await bcrypt.hash(password,10)
    const insert = db.query(
      `INSERT INTO users(name,email,password) values(?,?,?)`,[
        name,email,hasedpassword
      ]
    )
    return NextResponse.json({massage:'User created successfully'},{status:200})
  }catch(error){
    console.error('Error inserting data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
