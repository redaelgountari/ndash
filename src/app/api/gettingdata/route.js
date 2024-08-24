import { db, sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET(req) {
    const client = await db.connect();

    try {
        await client.sql`BEGIN`;

        await client.sql`
        CREATE TABLE IF NOT EXISTS reports (
            "id" BIGSERIAL PRIMARY KEY,
            "Tracking_ID_CD" VARCHAR(255) UNIQUE DEFAULT NULL,
            "Tracking_ID_Client" VARCHAR(255) DEFAULT NULL,
            "Date_de_Livraison" DATE DEFAULT NULL,
            "INTRA_OU_INTER" VARCHAR(255) DEFAULT NULL,
            "CASH_COLLECTED" DECIMAL(8,2) DEFAULT NULL,
            "Prestation_Transport_TVA_Incluse" DECIMAL(8,2) DEFAULT NULL,
            "Prestation_CRBT_TVA_Incluse" DECIMAL(8,2) DEFAULT NULL,
            "Prestation_de_Collecte_TVA_Incluse" DECIMAL(8,2) DEFAULT NULL,
            "Prestation_Assurance_TVA_Incluse" DECIMAL(8,2) DEFAULT NULL,
            "Supplement_de_poids" DECIMAL(8,2) DEFAULT NULL,
            "TOTAL" DECIMAL(8,2) DEFAULT NULL,
            "Statut" VARCHAR(255) DEFAULT NULL,
            "Client" VARCHAR(255) DEFAULT NULL,
            "SIZE" VARCHAR(255) DEFAULT NULL,
            "POIDS" DECIMAL(8,2) DEFAULT NULL,
            "Status" VARCHAR(255) DEFAULT NULL,
            "titre" VARCHAR(255) DEFAULT NULL
        )`;

        const passw = "G200023E";
        const hashpassword = await bcrypt.hash(passw, 11); 

        await client.sql`
        CREATE TABLE IF NOT EXISTS users (
            "id" BIGSERIAL PRIMARY KEY,
            "name" VARCHAR(255),
            "email" VARCHAR(255) UNIQUE,
            "password" VARCHAR(255)
        )`;

        await client.sql`
        INSERT INTO users ("name", "email", "password") 
        VALUES ('admin', 'addmin@gmail.com', ${hashpassword})
        ON CONFLICT (email) DO NOTHING`;

        await client.sql`
        INSERT INTO reports 
        ("Tracking_ID_CD", "Tracking_ID_Client", "Date_de_Livraison", "INTRA_OU_INTER", "CASH_COLLECTED", 
        "Prestation_Transport_TVA_Incluse", "Prestation_CRBT_TVA_Incluse", "Prestation_de_Collecte_TVA_Incluse", 
        "Prestation_Assurance_TVA_Incluse", "Supplement_de_poids", "TOTAL", "Statut", "Client", "SIZE", "POIDS", "Status", "titre") 
        VALUES 
        ('NIMEI1230541826021425152', NULL, '2024-04-19', 'INTER', 1940.00, 28.07, NULL, NULL, NULL, NULL, 28.07, 'Completed', 'Nina Meï', 'XS', 1.00, 'Completed', 'Nina Meï Reporting Avril 2024.xlsx'),
        ('NIMEI1255121739513163776', NULL, '2024-06-26', 'INTRA', 202.00, 21.81, NULL, NULL, NULL, NULL, 180.19, 'Completed', 'Nina Meï', 'S', 1.30, 'Completed', 'Nina Meï 24-26 Juin 2024.xlsx')
        `;

        const select = await client.sql`SELECT * FROM reports`;

        await client.sql`COMMIT`;

        return NextResponse.json(select.rows);
    } catch (error) {
        console.error('Database error:', error);

        await client.sql`ROLLBACK`;
        
        return NextResponse.json({ error: 'Server issue' }, { status: 500 });
    } finally {
        client.release();
    }
}
