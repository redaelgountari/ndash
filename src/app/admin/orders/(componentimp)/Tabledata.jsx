"use client"
import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react"
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
  TableFooter,
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
  const [mode,setmode] = useState(true)
  const [valFilter, setValFilter] = useState();
  const [exportData, setExportData] = useState();
  const [titre,settitre] = useState(props.titles);
  const [Totaletransport,setTotaletransport] = useState(0)
  const [Totalecash,setTotalecash] = useState(0)
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
    "Statut": "Statut"
  };
 
  const handleFileUpload = (e) => {
    const files = e.target.files; // Get all selected files
    const fileReaders = []; // Array to hold FileReader instances

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        fileReaders.push(new Promise((resolve, reject) => {
            reader.onload = (event) => {
                const fileData = event.target.result;
                const workbook = XLSX.read(fileData, { type: "binary" });

                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                const trackingIdCdIndex = parsedData.findIndex(row => row.includes("Tracking ID CD"));

                if (trackingIdCdIndex === -1) {
                    Swal.fire({
                        title: 'Error!',
                        text: "Donner nom compatible ou non valide",
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                    reject(new Error("Invalid file format"));
                    return;
                }

                const tableData = parsedData.slice(trackingIdCdIndex);

                const filteredData = tableData.slice(1).map((row) => {
                    let filteredRow = {};

                    desiredColumns.forEach((colIndex) => {
                        let colKey = tableData[0][colIndex];

                        if (colKey) {
                            const normalizedColKey = colKey.replace(/\s+/g, ' ').trim().toLowerCase();

                            if (normalizedColKey.includes("prestation transport")) {
                                colKey = "Prestation_Transport_TVA_Incluse";
                            }
                            if (normalizedColKey == "total ht") {
                                colKey = "TOTAL";
                            }

                            if (row[colIndex] !== undefined) {
                                filteredRow[columnMapping[colKey] || colKey] = row[colIndex];
                            }
                        }
                    });

                    return filteredRow;
                });

                resolve({ data: filteredData, title: file.name });
            };

            reader.onerror = (error) => reject(error);
            reader.readAsBinaryString(file);
        }));
    }

    // Wait for all files to be processed
    Promise.all(fileReaders)
        .then(results => {
            results.forEach(({ data, title }) => {
                sendDataToServer({ data, title });
                console.log({ data, title });
            });
        })
        .catch(error => {
            console.error("Error reading files:", error);
        });
};


 useEffect(
  ()=>{
    const calculTotale = () =>{
      let totale = 0
      let totalecash = 0
      for (let i = 0; i < data.length; i++) {
        totale += parseFloat(data[i].TOTAL) || 0;
        totalecash += parseFloat(data[i].CASH_COLLECTED) || 0;
      }
      setTotaletransport(totale.toFixed(2))
      setTotalecash(totalecash.toFixed(2))
    }
    calculTotale()
    if(data != ''){
      setmode(false)
    }
  },[data]
 )
const sendDataToServer = async (dataToSend) => {
  try {
    const response = await axios.post('/api/import', dataToSend);
    setData(response.data.data);
    settitre(response.data.titles);
    console.log('Données envoyées avec succès au serveur :', response.data.titles);
} catch (error) {
    console.error('Erreur lors de l\'envoi des données au serveur:', error);
    
    let message = error.response?.data?.error || 'Erreur inconnue'; 

    Swal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        confirmButtonText: 'OK'
    });
}

};

const handlechangedatavalue = (value) => {
  if (data && data.length > 0) {
    const filtered = props.data.filter((item) => item.titre === value);
    console.log("Filtered Data:", value);
    setData(filtered);
  } else {
    console.log("No data available to filter.");
  }
};

const handleSubmit = (e) => {
  e.preventDefault();

  let filteredData;

  if (valFilter === "INTRA" || valFilter === "INTER") {
    filteredData = data.filter((item) => item.INTRA_OU_INTER === valFilter);
  } else {
    filteredData = data.filter((item) => item.Status === valFilter);
  }

  setExportData(filteredData);

  const ws = XLSX.utils.json_to_sheet(filteredData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");

  XLSX.writeFile(wb, "exported_data.xlsx");
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
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
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
      cell: ({ row }) => <div className="p-3">{row.getValue("Tracking_ID_CD")}</div>,
    },
    {
      accessorKey: "Date_de_Livraison",
      header: () => <div>Date de Livraison</div>,
      cell: ({ row }) => {
        const date = row.getValue("Date_de_Livraison");
        const formattedDate = new Date(date).toISOString().split('T')[0];
        return <div>{formattedDate}</div>;
      }
    },
    {
      accessorKey: "CASH_COLLECTED",
      header: () => <div>CASH COLLECTED</div>,
      cell: ({ row }) => <div>{row.getValue("CASH_COLLECTED")}DH</div>
    },
    {
      accessorKey: "Prestation_Transport_TVA_Incluse",
      header: () => <div>Prestation Transport</div>,
      cell: ({ row }) => <div>{row.getValue("Prestation_Transport_TVA_Incluse")}DH</div>
    },
    {
      accessorKey: "TOTAL",
      header: () => <div>TOTAL</div>,
      cell: ({ row }) => {
        const cashCollected = Number(row.getValue("CASH_COLLECTED")) || 0;
        const prestationTransport = Number(row.getValue("Prestation_Transport_TVA_Incluse")) || 0;
        const result = cashCollected - prestationTransport;
      
        return <div>{result.toFixed(2)} DH</div>;
      }
      
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
      cell: ({ row }) => {
      const value = row.getValue('INTRA_OU_INTER');
      if (value === "INTRA") {
        return <Badge variant="secondary">{row.getValue("INTRA_OU_INTER")}</Badge>
      }
      else{
        return <Badge variant="outline">{row.getValue("INTRA_OU_INTER")}</Badge>
      }
      }
    },
    {
      accessorKey: "Statut",
      header: () => <div>STATUT</div>,
      cell: ({ row }) =>{
       const value = row.getValue('Statut');
        if (value === "Completed") {
          return <Badge className="bg-lime-700">{row.getValue("Statut")}</Badge>
        }
        else{
          return <Badge variant="destructive">{row.getValue("Statut")}</Badge>
        }
        }
      
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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.Tracking_ID_CD)}
              >
                Tracking ID CD ID
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.Tracking_ID_Client)}
              >
                Tracking ID Client
              </DropdownMenuItem> */}
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.Date_de_Livraison)}
              >
                Date de Livraison
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.INTRA_OU_INTER)}
              >
                INTRA OU INTER
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.CASH_COLLECTED)}
              >
                CASH COLLECTED
              </DropdownMenuItem>
             
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.Supplement_de_poids)}
              >
                Supplement de poids
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.Statut)}
              >
                Statut
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.Client)}
              >
                Client
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.SIZE)}
              >
                SIZE
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.POIDS)}
              >
                POIDS
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>View details</DropdownMenuItem> */}
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
    <div className="w-full responsivity" >
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} multiple /> <br /> <br />
      <div className="flex flex-col sm:flex-row w-full sm:w-auto sm:space-x-4">
        <Input
          placeholder={filterwith.replace(/_/g, " ")}
          value={(table.getColumn(filterwith)?.getFilterValue() ?? "")}
          onChange={(event) =>
            table.getColumn(filterwith)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
       <div className="flex flex-row gap-2">
       <Select  onValueChange={(value) => setfilterwith(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrer avec" className="sr-only sm:not-sr-only" disabled={mode} />
          <ListFilter className="h-3.5 w-3.5" />

        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="Tracking_ID_CD">Tracking ID CD</SelectItem>
            <SelectItem value="INTRA_OU_INTER">INTRA OU INTER</SelectItem>
            <SelectItem value="TOTAL">TOTAL</SelectItem>
            <SelectItem value="Date_de_Livraison">Date de Livraison</SelectItem>
            <SelectItem value="CASH_COLLECTED">CASH COLLECTED</SelectItem>
            <SelectItem value="Statut">Statut</SelectItem>
            <SelectItem value="Prestation_Transport_TVA_Incluse">Prestation Transport TVA Incluse</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
          {/* zzzzz */}
        <Select  onValueChange={(value)=>handlechangedatavalue(value)}>
        <SelectTrigger className="w-[180px]">

          <SelectValue placeholder="Filtrer avec fichier " className="sr-only sm:not-sr-only" disabled={mode} />
          <ListFilter className="h-3.5 w-3.5" />

        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {
              titre.map((e)=>(
                <SelectItem value={e.titre}>{e.titre}</SelectItem>

              ))
            }
          </SelectGroup>
          </SelectContent>
        </Select>
       </div>
       <br />

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
        
      </div> <br />
      
      <div className="rounded-md border">
        <Table className="table-responsive" >
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
      <TableFooter>
        {/* <TableRow>
          <TableCell colSpan={10}>Total</TableCell>
          <TableCell className="text-left">{parseFloat({Totaletransport}-{Totalecash})} DH</TableCell>
        </TableRow> */}
        <TableRow>
          <TableCell colSpan={8}>Total Transport</TableCell>
          <TableCell className="text-left">{Totaletransport}DH</TableCell>
        </TableRow>
      </TableFooter>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={8}>Total Cash Collected</TableCell>
          <TableCell className="text-left">{Totalecash}DH</TableCell>
        </TableRow>
      </TableFooter>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        {/* Totale : <input type="text" value={`${Totale}DH`} readOnly /> */}

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
      <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-lime-600" disabled={mode}>
        {/* <File className="h-3.5 w-3.5 m-1" /> */}

          Export excel
        </Button>
      </AlertDialogTrigger>
        <AlertDialogContent>
        <form onSubmit={handleSubmit}>
        <RadioGroup
                defaultValue="all"
                onValueChange={setValFilter}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="r1" />
                  <Label htmlFor="r1">Tout</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="INTRA" id="r2" />
                  <Label htmlFor="r2">INTRA</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="INTER" id="r3" />
                  <Label htmlFor="r3">INTER</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Returned to Sender" id="r4" />
                  <Label htmlFor="r4">Returned to Sender</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Completed" id="r5" />
                  <Label htmlFor="r5">Completed</Label>
                </div>
            </RadioGroup>
            <AlertDialogFooter>
            <Button type="submit" className="">
            Export</Button>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>

        </form>

        </AlertDialogContent>
    </AlertDialog>
    </div>
  );
}
