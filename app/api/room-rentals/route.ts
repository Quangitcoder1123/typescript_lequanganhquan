import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

// GET all room rentals with optional search
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    try {
        let query = `
            SELECT r.*, p.name as payment_type_name 
            FROM room_rentals r
            LEFT JOIN payment_types p ON r.payment_type_id = p.id
        `;
        const params = [];

        if (search) {
            query += `
                WHERE r.room_code ILIKE $1 
                OR r.tenant_name ILIKE $1 
                OR r.phone_number ILIKE $1
            `;
            params.push(`%${search}%`);
        }

        query += ' ORDER BY r.created_at DESC';
        const result = await pool.query(query, params);
        return NextResponse.json(result.rows);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching room rentals' }, { status: 500 });
    }
}

// POST new room rental
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { room_code, tenant_name, phone_number, start_date, payment_type_id, notes } = data;

        const result = await pool.query(
            `INSERT INTO room_rentals 
            (room_code, tenant_name, phone_number, start_date, payment_type_id, notes)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [room_code, tenant_name, phone_number, start_date, payment_type_id, notes]
        );

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        return NextResponse.json({ error: 'Error creating room rental' }, { status: 500 });
    }
}

// DELETE room rental(s)
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const ids = searchParams.get('ids')?.split(',');

        if (!ids || ids.length === 0) {
            return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
        }

        const result = await pool.query(
            'DELETE FROM room_rentals WHERE id = ANY($1) RETURNING *',
            [ids]
        );

        return NextResponse.json({ deleted: result.rows });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting room rentals' }, { status: 500 });
    }
} 