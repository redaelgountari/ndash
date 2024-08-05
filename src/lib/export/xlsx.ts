import xlsx from 'json-as-xlsx';
import { ColumnDef } from '@tanstack/react-table';

// Define the structure for the Excel export
function excelExport(data: any[], columns: ColumnDef<any, any>[]) {

  console.log({ 'data': data, 'columns': columns });

  // Filter out unwanted columns and ensure we only include columns with accessorKey, excluding createdAt and updatedAt
  const columnsForExport = columns
    .filter(col => col.accessorKey && col.accessorKey !== 'createdAt' && col.accessorKey !== 'updatedAt' && col.accessorKey !== 'image')
    .map(col => ({
      label: col.accessorKey,
      value: (row: any) => row[col.accessorKey as keyof typeof row],
    }));

  const content = data.map(item => {
    const newItem: { [key: string]: any } = {};
    columnsForExport.forEach(col => {
      newItem[col.label as string] = col.value(item);
    });
    return newItem;
  });

  const settings = {
    fileName: "Produits", // Name of the exported file
    extraLength: 3, // Adds extra length to columns
    writeOptions: {} // Style options from https://sheetjs.gitbook.io/docs/
  };

  const excelData = [
    {
      sheet: "Produits",
      columns: columnsForExport.map(col => ({ label: col.label, value: col.label })),
      content: content
    }
  ];

  xlsx(excelData, settings);
}

export default excelExport;
