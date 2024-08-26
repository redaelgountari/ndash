import React from 'react';
import Dash from './Dash'
import axios from 'axios';
import { getServerSession } from 'next-auth';
async function getData() {
    try {
        const response = await axios.get('https://ndash-six.vercel.app/api/recive',{
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
    const session = await getServerSession()
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
           <Dash data={data.data}/> 
           {/* {session.user.email} */}
        </div>
    );
    
}
