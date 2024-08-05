"use client"

import { useState } from 'react';

export default function page() {
  const [file, setFile] = useState(null);
  const [response,setresponse] = useState("none")
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/import', {
      method: 'POST',
      body: formData,
    });
    console.log("ddddd"+response.data)
    const result = await response.json();
    alert(result.message);
  };

  return (
    <div>
      <h1>Upload Excel File</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
