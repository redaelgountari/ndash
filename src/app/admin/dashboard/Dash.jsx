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
function caltotale(datas, e) {
  const total = datas
    .filter((i) => i.INTRA_OU_INTER === e)
    .reduce((sum, i) => {
      const amount = Number(i.CASH_COLLECTED) - Number(i.Prestation_Transport_TVA_Incluse);
      return !isNaN(amount) ? sum + amount : sum;
    }, 0);
  
  return total.toFixed(2);
}

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

  return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
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

const calculateAverageOfPreviousWeeks = (datas, time) => {
  const filteredData = filterData(datas, time === "week" ? "all" : time);
  const weeklyTotals = filteredData.reduce((acc, i) => {
    const date = i.Date_de_Livraison;
    const amount = parseFloat(i.CASH_COLLECTED) - parseFloat(i.Prestation_Transport_TVA_Incluse);
    if (!isNaN(amount)) {
      const weekNumber = getWeekNumber(new Date(date));
      if (!acc[weekNumber]) {
        acc[weekNumber] = 0;
      }
      acc[weekNumber] += amount;
    }
    return acc;
  }, {});

  const weeklyTotalsArray = Object.values(weeklyTotals);
  const averageTotal = weeklyTotalsArray.length > 0
    ? weeklyTotalsArray.reduce((sum, total) => sum + total, 0) / weeklyTotalsArray.length
    : 0;

  return averageTotal.toFixed(2);
};

const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = Math.floor((date - firstDayOfYear) / 86400000);
  return Math.ceil((date.getDay() + 1 + pastDaysOfYear) / 7);
};

const calculatePercentageDifference = (datas = [], datatime, type) => {
  // Check if datatime is defined and has data
  if (!datatime || !Array.isArray(datatime)) {
    return "N/A"; // or handle as you see fit
  }

  const currentTotal = parseFloat(caltotale(datatime, type));

  // Calculate the average of previous months
  const previousTotals = [];
  for (let monthOffset = 1; monthOffset <= 12; monthOffset++) { // Check up to 12 months back
    const date = new Date();
    date.setMonth(date.getMonth() - monthOffset);
    
    const month = date.getMonth(); // 0-indexed
    const year = date.getFullYear();
    
    const monthlyData = datas.filter((item) => {
      const itemDate = new Date(item.Date_de_Livraison);
      return itemDate.getMonth() === month && itemDate.getFullYear() === year;
    });

    const monthlyTotal = parseFloat(caltotale(monthlyData, type));
    if (!isNaN(monthlyTotal) && monthlyTotal > 0) {
      previousTotals.push(monthlyTotal);
    }
  }

  const averagePrevious = previousTotals.length > 0
    ? previousTotals.reduce((sum, total) => sum + total, 0) / previousTotals.length
    : 0;

  if (averagePrevious === 0) {
    return "N/A"; // Avoid division by zero
  }

  const percentageDifference = ((currentTotal - averagePrevious) / averagePrevious) * 100;
  return percentageDifference.toFixed(2);
};



export default function Dash(props) {
  const [datas, setDatas] = useState(props.data || []);
  const [datatime, setDatatime] = useState([]);
  const [time, setTime] = useState("week");
  const [startday, setstartday] = useState();
  const [lastday, setlastday] = useState();
  // gggg
  const getFormattedRange = (time) => {
    if (time) {
      const date = new Date(time);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        year: 'numeric',
      });
    }
    return 'Loading...';
  };
  const listdates = props.data.map((i) => i.Date_de_Livraison).sort();
  
  useEffect(() => {
    if (listdates.length > 0) {
      setstartday(listdates[0]);
      setlastday(listdates[listdates.length - 1]);
    }
  }, [listdates]);
  // gggg
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
            <ChartQ data={datatime} diff={calculatePercentageDifference(datatime)} time={time} startdayi={getFormattedRange(startday)} enddayi={getFormattedRange(lastday)} />
          </div>
          <div className="sm:col-span-2">
          <Chart data={datatime} diff={calculatePercentageDifference(datatime)} time={time} startdayi={getFormattedRange(startday)} enddayi={getFormattedRange(lastday)} subject={"INTRA_OU_INTER"} param1={"INTRA"} param2={"INTER"} />

          </div>
          
        </div>
        <Tabs defaultValue="week">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="week" onClick={() => setTime("week")}>Semaine</TabsTrigger>
              <TabsTrigger value="month" onClick={() => setTime("month")}>Mois</TabsTrigger>
              <TabsTrigger value="year" onClick={() => setTime("year")}>Année</TabsTrigger>
              <TabsTrigger value="all" onClick={() => setTime("all")}>Toutes</TabsTrigger>
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
                {/* {calculatePercentageDifference(datatime, "INTER")}% compared to average of previous {time}s */}
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
                {/* {calculatePercentageDifference(datatime, "INTRA")}% compared to average of previous {time}s */}
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
