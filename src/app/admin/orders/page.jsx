import React from 'react';
import DataTableimport from "../orders/(componentimp)/Tabledata";
import Export from "../orders/(componentimp)/Export";
import axios from 'axios';
import "./style.css"; 
async function getData() {
    try {
        const response = await axios.get('https://ndash-one.vercel.app/api/recive',{
            cache : 'no-store'
        });
        return {
            data: response.data.data,
            titles: response.data.titles
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export default async function Page() {
    const data = await getData();
    if (!data) {
        return (
            <div className="error">
                <div class="loader">
            <div data-glitch="Error loading data." class="glitch">Error loading data.</div>
         </div>
            </div>
        )
    }

    return (
        <div>
            <DataTableimport data={data.data} titles={data.titles} />
            {/* <Export data={data.data} /> */}
        </div>
    );
    
}
