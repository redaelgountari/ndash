import React from 'react';
import DataTableimport from "../import/(componentimp)/Tabledata"
import axios from 'axios';

async function getData() {
    try {
        const response = await axios.get('http://localhost:3000/api/recive');
        return response.data[0];
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export default async function Page() {
    const data = await getData();
    if (!data) {
        return <div>Error loading data.</div>;
    }

    const datas = data || [];
    return (
        <div>
            <DataTableimport data={datas} />
        </div>
    );
}
