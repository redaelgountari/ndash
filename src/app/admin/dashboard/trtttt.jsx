import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import Chart from "./(components)/Chart.jsx"
import Stats from "./(components)/Stats.jsx"
import Talblestats from "./(components)/Talblestats.jsx"
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

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import axios from 'axios'

async function getData() {

    try {
      const response = await axios.get("https://ndash-one.vercel.app/api/recive");
      return response.data.data[0]|| [];
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }
  let data 

  function isThisWeek(dateString) {
    const date = new Date(dateString);
    const today = new Date();
  
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    const lastDayOfWeek = new Date(today.setDate(firstDayOfWeek.getDate() + 6));
  
    firstDayOfWeek.setHours(0, 0, 0, 0);
    lastDayOfWeek.setHours(23, 59, 59, 999);
  
    return date >= firstDayOfWeek && date <= lastDayOfWeek;
  }
  
  function filterThisWeekData(datas) {
    return datas.filter((item) => isThisWeek(item.Date_de_Livraison));
  }
  
  function caltotale(datas, e) {
    const thisWeekData = filterThisWeekData(datas);
  
    const totalThisWeek = thisWeekData
      .filter((i) => i.INTRA_OU_INTER === e)
      .reduce((sum, i) => {
        const amount = parseFloat(i.TOTAL);
        return !isNaN(amount) ? sum + amount : sum;
      }, 0);
  
    return totalThisWeek.toFixed(2);
  }
  
  function calculateAverageOfPreviousWeeks(datas, e) {
    const previousWeeksData = datas.filter((i) => !isThisWeek(i.Date_de_Livraison));
  
    const totalsByWeek = previousWeeksData
      .filter((i) => i.INTRA_OU_INTER === e)
      .reduce((acc, i) => {
        const date = new Date(i.Date_de_Livraison);
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay() + 1)).toISOString().split('T')[0];
        const amount = parseFloat(i.TOTAL);
  
        if (!isNaN(amount)) {
          if (!acc[weekStart]) {
            acc[weekStart] = 0;
          }
          acc[weekStart] += amount;
        }
        return acc;
      }, {});
  
    const weeklyTotals = Object.values(totalsByWeek);
    const averageTotal = weeklyTotals.reduce((sum, total) => sum + total, 0) / weeklyTotals.length;
  
    return averageTotal.toFixed(2);
  }
  
  function calculatePercentageDifference(datas, e) {
    const totalThisWeek = parseFloat(caltotale(datas, e));
    const averagePreviousWeeks = parseFloat(calculateAverageOfPreviousWeeks(datas, e));
  
    if (averagePreviousWeeks === 0) {
      return "N/A";
    }
  
    const percentageDifference = ((totalThisWeek - averagePreviousWeeks) / averagePreviousWeeks) * 100;
    return percentageDifference.toFixed(2);
  }
  
  async function VendeurDashboard() {
    const datas = await getData();
    const datatime = filterThisWeekData(datas)
    if (datas.length === 0) {
      return <div>Error loading data.</div>;
    }
  
  return (
    <>
      <div>Vendeur Dashboard</div>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
              <Chart data={datatime} />
            </Card>
            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription>Inter This Week</CardDescription>
                <CardTitle className="text">{caltotale(datas, "INTER")} DH</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {calculatePercentageDifference(datas, "INTER")}% compared to average of previous weeks
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={calculatePercentageDifference(datas, "INTER")} aria-label="25% increase" />
              </CardFooter>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-05-chunk-2">
              <CardHeader className="pb-2">
                <CardDescription>Intra This Month</CardDescription>
                <CardTitle className="text">{caltotale(datas, "INTRA")} DH</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {calculatePercentageDifference(datas, "INTRA")}% compared to average of previous weeks
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={calculatePercentageDifference(datas, "INTRA")} aria-label="12% increase" />
              </CardFooter>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  
                </div>
              </CardContent>
            </Card>
          </div>
            <Tabs defaultValue="week">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-sm"
                      >
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Filter</span>
                      </Button>
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
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-sm"
                  >
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Export</span>
                  </Button>
                </div>
              </div>
              {/* rrrrrrr */}
              <Talblestats data={datatime}/>
              {/* rrrrrrr */}
            </Tabs>
          </div>
          <div>
            {/* EEEEEEE */}
            <Stats data={datatime}/>
            {/* EEEEEEE */}
          </div>
        </main>
    </>
  )
}

export default VendeurDashboard