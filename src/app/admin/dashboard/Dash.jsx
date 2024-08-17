"use client";

import * as React from "react";
import Chart from "./(components)/Chart.jsx";
import Stats from "./(components)/Stats.jsx";
import Talblestats from "./(components)/Talblestats.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import axios from "axios";
import ChartQ from "./(components)/ChartQ.jsx";

function isThisWeek(dateString) {
  const date = new Date(dateString);
  const today = new Date();

  const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
  const lastDayOfWeek = new Date(today.setDate(firstDayOfWeek.getDate() + 6));

  firstDayOfWeek.setHours(0, 0, 0, 0);
  lastDayOfWeek.setHours(23, 59, 59, 999);

  return date >= firstDayOfWeek && date <= lastDayOfWeek;
}

function isThisMonth(dateString) {
  const date = new Date(dateString);
  const today = new Date();

  return (
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function isThisYear(dateString) {
  const date = new Date(dateString);
  const today = new Date();

  return date.getFullYear() === today.getFullYear();
}

function filterData(datas, time) {
  switch (time) {
    case "week":
      return datas.filter((item) => isThisWeek(item.Date_de_Livraison));
    case "month":
      return datas.filter((item) => isThisMonth(item.Date_de_Livraison));
    case "year":
      return datas.filter((item) => isThisYear(item.Date_de_Livraison));
    case "all":
      return datas;
    default:
      return datas;
  }
}

function caltotale(datas, e) {
  const total = datas
    .filter((i) => i.INTRA_OU_INTER === e)
    .reduce((sum, i) => {
      const amount = Number(i.CASH_COLLECTED) - Number(i.Prestation_Transport_TVA_Incluse);
      return !isNaN(amount) ? sum + amount : sum;
    }, 0);

  return total.toFixed(2);
}

function calculatePercentageDifference(datas, e) {
  return "N/A"; 
}

export default function Dash(props) {
  const [datas, setDatas] = useState(props.data);
  const [datatime, setDatatime] = useState([]);
  const [time, setTime] = useState("week");

  useEffect(() => {
    setDatas(props.data);
    console.log("daata",datas)
  }, [props.data]);

  useEffect(() => {
    if (datas.length) {
      setDatatime(filterData(datas, time));
    }
  }, [datas, time]);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <div className="sm:col-span-2">
            <ChartQ data={datatime} time={time} />
          </div>
          <div className="sm:col-span-2">
            <Chart data={datatime} />
          </div>
          
        </div>
        <Tabs defaultValue="week">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="week" onClick={() => setTime("week")}>Week</TabsTrigger>
              <TabsTrigger value="month" onClick={() => setTime("month")}>Month</TabsTrigger>
              <TabsTrigger value="year" onClick={() => setTime("year")}>Year</TabsTrigger>
              <TabsTrigger value="all" onClick={() => setTime("all")}>All</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {/* <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-sm"
                  >
                    <span className="sr-only sm:not-sr-only">Filter</span>
                  </Button> */}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Fulfilled
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Declined
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Refunded
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1 text-sm"
              >
                <span className="sr-only sm:not-sr-only">Export</span>
              </Button> */}
            </div>
          </div>
          <Talblestats data={datatime} time={time} />
        </Tabs>
      </div>
      <div>
      <Card>
            <CardHeader className="pb-2">
              <CardDescription>Inter This {time}</CardDescription>
              <CardTitle className="text">{caltotale(datatime, "INTER")} DH</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {calculatePercentageDifference(datatime, "INTER")}% compared to average of previous {time}s
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={calculatePercentageDifference(datatime, "INTER")} aria-label="25% increase" />
            </CardFooter>
          </Card> <br />
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Intra This {time}</CardDescription>
              <CardTitle className="text">{caltotale(datatime, "INTRA")} DH</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {calculatePercentageDifference(datatime, "INTRA")}% compared to average of previous {time}s
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={calculatePercentageDifference(datatime, "INTRA")} aria-label="12% increase" />
            </CardFooter>
          </Card> <br />
        <Stats data={datatime} />

      </div>
    </main>
  );
}
