import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ColumnDef } from '@tanstack/react-table';

// Define the structure for the PDF export
function pdfExport(data: any[], columns: ColumnDef<any, any>[]) {

  console.log({ 'data': data, 'columns': columns });

  // Filter out unwanted columns and ensure we only include columns with accessorKey, excluding createdAt and updatedAt
  const columnsForExport = columns
    .filter(col => col.accessorKey && col.accessorKey !== 'createdAt' && col.accessorKey !== 'updatedAt' && col.accessorKey !== 'image')
    .map(col => ({
      label: col.accessorKey,
      value: (row: any) => {
        const value = row[col.accessorKey as keyof typeof row];
        if (col.accessorKey === 'Disponible') {
          return value ? 'Oui' : 'Non';
        }
        return value;
      },
    }));

  // Create a new jsPDF instance
  const doc = new jsPDF();

  // Define the table columns and data
  const tableColumn = columnsForExport.map(col => col.label);
  const tableRows = data.map(item => {
    const row: { [key: string]: any } = {};
    columnsForExport.forEach(col => {
      row[col.label as string] = col.value(item);
    });
    return tableColumn.map(col => row[col]);
  });

  // Add a title
  doc.text("Produits", 14, 22);

  // Add autoTable
  autoTable(doc, {
    startY: 30,
    head: [tableColumn],
    body: tableRows,
  });

  // Save the PDF
  doc.save('Produits.pdf');
}

export default pdfExport;
