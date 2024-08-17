"use client"
import * as React from "react"
import Image from "next/image"
import Link from "next/link"

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

export default function Cardstats(props) {
    
  return (
    <div>
    <Card x-chunk="dashboard-05-chunk-1">
    <CardHeader className="pb-2">
      <CardDescription>Inter This Week</CardDescription>
      <CardTitle className="text">{props.caltotale} DH</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-xs text-muted-foreground">
        {calculatePercentageDifference(props.datas, "INTER")}% compared to average of previous weeks
      </div>
    </CardContent>
    <CardFooter>
      <Progress value={calculatePercentageDifference(props.datas, "INTER")} aria-label="25% increase" />
    </CardFooter>
    <CardContent>
      <div className="text-xs text-muted-foreground">
        
      </div>
    </CardContent>
  </Card>
  </div>
  )
}
