import db from '@/lib/db';
import { NextResponse } from 'next/server';

const excelSerialDateToDate = (serial) => {
    const excelBaseDate = new Date(1900, 0, 1);
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysSinceBase = serial - 2;
    return new Date(excelBaseDate.getTime() + daysSinceBase * millisecondsPerDay);
};

const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export async function POST(req) {
    try {
        const data = await req.json();
        const queries = data.map(async (row) => {
            const date = excelSerialDateToDate(row.Date_de_Livraison);
            const formattedDate = formatDate(date);
            const transport = row.Prestation_Transport_TVA_Incluse;
            let intraxinter = "UNKNOWN";

            if (transport === 21.81) {
                intraxinter = "INTER";
            } else if (transport === 31.72) {
                intraxinter = "INTRA";
            }

            const verifyQuery = db.query(`SELECT COUNT(Tracking_ID_CD) FROM reports WHERE Tracking_ID_CD = "${row.Tracking_ID_CD}"`);
            const verifyQuery2 = row.Tracking_ID_CD
            if (verifyQuery2.length > 0,verifyQuery > 0) {
                console.log(`Doublon trouvé pour Tracking_ID_CD : ${row.Tracking_ID_CD}`);
                throw new Error(`Tracking ID ${row.Tracking_ID_CD} already exists`);
            }

            await db.query(
                `INSERT INTO reports (
                    Tracking_ID_CD, Tracking_ID_Client, Date_de_Livraison, INTRA_OU_INTER,
                    CASH_COLLECTED, Prestation_Transport_TVA_Incluse, Prestation_CRBT_TVA_Incluse,
                    Prestation_de_Collecte_TVA_Incluse, Prestation_Assurance_TVA_Incluse, 
                    Supplement_de_poids, TOTAL, Statut, Client, SIZE, POIDS, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                    row.Tracking_ID_CD, row.Tracking_ID_Client, formattedDate, intraxinter,
                    row.CASH_COLLECTED, row.Prestation_Transport_TVA_Incluse, row.Prestation_CRBT_TVA_Incluse,
                    row.Prestation_de_Collecte_TVA_Incluse, row.Prestation_Assurance_TVA_Incluse, 
                    row.Supplement_de_poids, row.TOTAL, row.Statut, row.Client, row.SIZE, row.POIDS, 
                    row.created_at, row.updated_at
                ]
            );
        });

        await Promise.all(queries);
        const getQuery = await db.query(`SELECT * FROM reports`);
        return new NextResponse(JSON.stringify(getQuery), { status: 200 });
    } catch (error) {
        console.error('Error inserting data:', error);
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
