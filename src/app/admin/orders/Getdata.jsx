'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DataTableImport from "../orders/(componentimp)/Tabledata"; // Corrected import name
import { setdata } from '@/app/action';
import axios from 'axios';

const fetchData = async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:3000/api/recive');
    dispatch(setdata(response.data.data[0], response.data.titles[0])); // Dispatch the data to the store
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const ClientComponent = () => {
  const data = useSelector((state) => state.data);
  const titles = useSelector((state) => state.titles);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchData(dispatch);
      } catch (e) {
        setError('Error loading data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="loader">
        <div className="glitch">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <div className="loader">
          <div data-glitch={error} className="glitch">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DataTableImport data={data} titles={titles} />
    </div>
  );
};

export default ClientComponent;
