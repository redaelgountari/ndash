import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";

export default function Talblestats(props) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7; 

  useEffect(() => {
    setData(props.data.sort((a, b) => new Date(a.Date_de_Livraison) - new Date(b.Date_de_Livraison)));
    console.log("dgr :", props.data);
  }, [props.data]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const handleNextPage = () => {
    if (indexOfLastRow < data.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <TabsContent value={props.time}>
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>Orders</CardTitle>
            <CardDescription>
            Commandes récentes de votre boutique.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">Tracking ID CD</TableHead>
                  <TableHead className="hidden sm:table-cell">INTRA OU INTER</TableHead>
                  <TableHead className="hidden md:table-cell">STATUT</TableHead>
                  <TableHead className="text-right">Date de Livraison</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRows.map((i) => (
                  <TableRow key={i.Tracking_ID_CD}>
                    <TableCell>
                      <div className="font-medium">{i.Tracking_ID_CD}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{i.INTRA_OU_INTER}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className="text-xs" variant="secondary">{i.Status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(i.Date_de_Livraison).toISOString().split('T')[0]}
                    </TableCell>
                    <TableCell className="text-right">
                      {Number(i.CASH_COLLECTED) - Number(i.Prestation_Transport_TVA_Incluse)}DH
                    </TableCell>
                  </TableRow>
                  
                ))}
              </TableBody>
            </Table>
            {/* Pagination Controls */}
            <div className="flex justify-between mt-4">
              <Button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</Button>
              <Button onClick={handleNextPage} disabled={indexOfLastRow >= data.length}>Next</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
}
