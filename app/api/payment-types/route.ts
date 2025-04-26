import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET() {
    try {
        const result = await pool.query('SELECT * FROM payment_types ORDER BY id');
        return NextResponse.json(result.rows);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching payment types' }, { status: 500 });
    }
} 