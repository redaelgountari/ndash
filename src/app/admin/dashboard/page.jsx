"use client";

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTableimport from "../orders/(componentimp)/Tabledata";
import Export from "../orders/(componentimp)/Export";
import axios from 'axios';
import Dash from './Dash';
import { setdata } from '@/app/action';

export default function Page() {
    const dispatch = useDispatch();
    const { datas, titles } = useSelector(state => state);
    const loading = !datas.length && !titles.length; // Assume loading if data and titles are empty
    const error = useSelector(state => state.error);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('/api/recive', {
                    cache: 'no-store'
                });
                dispatch(setdata(response.data.data, response.data.titles));
            } catch (error) {
                console.error('Error fetching data:', error);
                // Optionally, you could dispatch an error action to store this in the Redux state.
            }
        }

        fetchData();
    }, [dispatch]);

    if (loading) {
        return (
            <div className="loader">
                <div data-glitch="Loading..." className="glitch">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                <div className="loader">
                    <div data-glitch="Error loading data." className="glitch">Error loading data.</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Dash data={datas} /> 
            {/* <Export data={datas} /> */}
        </div>
    );
}
