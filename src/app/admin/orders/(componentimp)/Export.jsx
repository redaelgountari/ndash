"use client";

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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function Export(props) {
  const [valFilter, setValFilter] = useState();
  const [exportData, setExportData] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();

    const filteredData = valFilter
      ? props.data.filter((item) => item.INTRA_OU_INTER === valFilter)
      : props.data;

    setExportData(filteredData);
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");

    XLSX.writeFile(wb, "exported_data.xlsx");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-lime-600">
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
            </RadioGroup>
            <AlertDialogFooter>
            <Button type="submit" className="">
            Export</Button>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>

        </form>
        

        </AlertDialogContent>
    </AlertDialog>
  );
}
