"use client"
import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import axios from 'axios';
import * as XLSX from 'xlsx';
import Modal from 'react-bootstrap/Modal';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DataTableimport(props) {
  const [data, setData] = useState(props.data);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [filterwith, setfilterwith] = useState("Tracking_ID_CD");
  const [mode,setmode] = useState("off")
  const desiredColumns = [0, 1, 2, 3, 4, 6, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
  const columnMapping = {
    "Tracking ID CD": "Tracking_ID_CD",
    "Tracking ID Client": "Trackin_ID_Client",
    "Date de Livraison": "Date_de_Livraison",
    "INTRA OU INTER":"INTRA_OU_INTER",
    "CASH COLLECTED": "CASH_COLLECTED",
    "Prestation Transport (TVA  Incluse) ": "Prestation_Transport_TVA_Incluse",
    "TOTAL": "TOTAL",
    "SIZE": "SIZE",
    "POIDS": "POIDS",
    "STATUS": "STATUS"
  };
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);

    reader.onload = (e) => {
      const fileData = e.target.result;
      const workbook = XLSX.read(fileData, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      console.log("fs data:", parsedData);

      const filteredData = parsedData.slice(1).map((row) => {
        let filteredRow = {};
        desiredColumns.forEach((colIndex) => {
          const colKey = parsedData[0][colIndex];
          if (colKey && row[colIndex] !== undefined) {
            filteredRow[columnMapping[colKey] || colKey] = row[colIndex];
          }
        });
        const transport = row[parsedData[0].indexOf("Prestation Transport (TVA  Incluse) ")];

        return filteredRow;
      });

      // setData(prevData => [...prevData, ...filteredData]);
      console.log("dr stone :", parsedData[1])
      sendDataToServer(filteredData);
    };
  };


  const sendDataToServer = async (dataToSend) => {
    try {
        const response = await axios.post('/api/import', dataToSend);
        setData(response.data[0]);
        console.log('Données envoyées avec succès au serveur :', response.data);
    } catch (error) {
        console.error('Erreur lors de l envoi des données au serveur:', error);
        
        Swal.fire({
            title: 'Error!',
            text: error.response?.data?.error || 'Une erreur s est produite lors de l envoi des données au serveur.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
};
  

//   useEffect(() => {
//     (async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/recive');
//         setData(response.data[0]);
//       } catch (err) {
//         console.log('error', err);
//       }
//     })();
//   }, []);
  

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "Tracking_ID_CD",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tracking ID CD
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("Tracking_ID_CD")}</div>,
    },
    {
      accessorKey: "Date_de_Livraison",
      header: () => <div>Date de Livraison</div>,
      cell: ({ row }) => <div>{row.getValue("Date_de_Livraison")}</div>
    },
    {
      accessorKey: "CASH_COLLECTED",
      header: () => <div>CASH COLLECTED</div>,
      cell: ({ row }) => <div>{row.getValue("CASH_COLLECTED")}</div>
    },
    {
      accessorKey: "Prestation_Transport_TVA_Incluse",
      header: () => <div>Prestation Transport TVA Incluse</div>,
      cell: ({ row }) => <div>{row.getValue("Prestation_Transport_TVA_Incluse")}</div>
    },
    {
      accessorKey: "TOTAL",
      header: () => <div>TOTAL</div>,
      cell: ({ row }) => <div>{row.getValue("TOTAL")}</div>
    },
    {
      accessorKey: "SIZE",
      header: () => <div>SIZE</div>,
      cell: ({ row }) => <div>{row.getValue("SIZE")}</div>
    },
    {
      accessorKey: "POIDS",
      header: () => <div>POIDS</div>,
      cell: ({ row }) => <div>{row.getValue("POIDS")}</div>
    },
    {
      accessorKey: "INTRA_OU_INTER",
      header: () => <div>INTRA OU INTER</div>,
      cell: ({ row }) => <div>{row.getValue("INTRA_OU_INTER")}</div>
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <div className="flex items-center py-4">
        <Input
          placeholder={filterwith}
          value={(table.getColumn(filterwith)?.getFilterValue() ?? "")}
          onChange={(event) =>
            table.getColumn(filterwith)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
       <Select onValueChange={(value) => setfilterwith(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrer avec" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="Tracking_ID_CD">Tracking ID CD</SelectItem>
            <SelectItem value="TOTAL">TOTAL</SelectItem>
            <SelectItem value="Date_de_Livraison">Date de Livraison</SelectItem>
            <SelectItem value="CASH_COLLECTED">CASH COLLECTED</SelectItem>
            <SelectItem value="Prestation_Transport_TVA_Incluse">Prestation Transport TVA Incluse</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            précédente
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivante
          </Button>
        </div>
      </div>
      <Button type="button" onClick={handleShow}>export excel</Button>
      
    </div>
  );
}
