import { db, sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

const excelSerialDateToDate = (serial) => {
    const excelBaseDate = new Date(1900, 0, 1);
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysSinceBase = serial - 2;
    return new Date(excelBaseDate.getTime() + daysSinceBase * millisecondsPerDay);
};

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;  // Format: YYYY-MM-DD
};

export async function POST(req) {
    try {
        const client = await db.connect();

        const { data, title } = await req.json();
        const queries = data.map(async (row) => {
            if (!row.Tracking_ID_CD) {
                return;
            }

            const date = excelSerialDateToDate(row.Date_de_Livraison);
            const formattedDate = formatDate(date);
            const transport = row.Prestation_Transport_TVA_Incluse.toFixed(2);
            let intraxinter = `UNKNOWN ${transport}`;

            if (transport == 21.81 || transport == 19.30) {
                intraxinter = "INTRA";
            } else if (transport == 31.72 || transport == 28.07) {
                intraxinter = "INTER";
            }

            const verifyQuery = await client.sql`
                SELECT COUNT(*) as count 
                FROM reports 
                WHERE "Tracking_ID_CD" = ${row.Tracking_ID_CD}`;
            const isDuplicate = verifyQuery.rows[0].count > 0;

            if (isDuplicate) {
                console.log(`Doublon trouvé pour Tracking_ID_CD : ${row.Tracking_ID_CD}`);
                throw new Error(`Tracking ID ${row.Tracking_ID_CD} déjà existant`);
            }

            await client.sql`
                INSERT INTO reports (
                    "Tracking_ID_CD", "Tracking_ID_Client", "Date_de_Livraison", "INTRA_OU_INTER", 
                    "CASH_COLLECTED", "Prestation_Transport_TVA_Incluse", "Prestation_CRBT_TVA_Incluse", 
                    "Prestation_de_Collecte_TVA_Incluse", "Prestation_Assurance_TVA_Incluse", 
                    "Supplement_de_poids", "TOTAL", "Statut", "Client", "SIZE", "POIDS", "titre", "Status"
                ) VALUES (
                    ${row.Tracking_ID_CD}, ${row.Tracking_ID_Client}, ${formattedDate}, ${intraxinter},
                    ${row.CASH_COLLECTED}, ${row.Prestation_Transport_TVA_Incluse}, ${row.Prestation_CRBT_TVA_Incluse},
                    ${row.Prestation_de_Collecte_TVA_Incluse}, ${row.Prestation_Assurance_TVA_Incluse}, 
                    ${row.Supplement_de_poids}, ${row.TOTAL}, ${row.Statut}, ${row.Client}, ${row.SIZE}, 
                    ${row.POIDS}, ${title}, ${row.Statut}
                )`;

            console.log(row.Tracking_ID_CD, row.Tracking_ID_Client, formattedDate, intraxinter,
                row.CASH_COLLECTED, row.Prestation_Transport_TVA_Incluse, row.Prestation_CRBT_TVA_Incluse,
                row.Prestation_de_Collecte_TVA_Incluse, row.Prestation_Assurance_TVA_Incluse, 
                row.Supplement_de_poids, row.TOTAL, row.Statut, row.Client, row.SIZE, row.POIDS, title,
                row.Statut);
        });

        await Promise.all(queries);
        const getQuery = await client.sql `SELECT * FROM reports`;
        const getTitles = await client.sql `SELECT DISTINCT titre FROM reports`;
        return NextResponse.json({ data: getQuery.rows, titles: getTitles.rows });
        // return NextResponse.json({ data: getQuery, titles: getTitles });

    }  catch (error) {
        console.error('Error inserting data:', error);
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
