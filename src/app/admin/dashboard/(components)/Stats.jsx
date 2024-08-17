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
import axios from 'axios'
import { useState,useEffect } from "react"

export default function Stats(props) {
    const [data,setdata] = useState(props.data)
    const [Totaletransport,setTotaletransport] = useState(0)
    const [Totalecash,setTotalecash] = useState(0)
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    
    console.log(formattedDate); 
    useEffect(() => {
      setdata(props.data.sort((a, b) => new Date(a.Date_de_Livraison) - new Date(b.Date_de_Livraison)));
      console.log("dgr :",props.data)
    }, [props.data]);
    useEffect(
        ()=>{
          const calculTotale = () =>{
            let totale = 0
            let totalecash = 0
            for (let i = 0; i < data.length; i++) {
              totale += parseFloat(data[i].Prestation_Transport_TVA_Incluse) || 0;
              totalecash += parseFloat(data[i].CASH_COLLECTED) || 0;
            }
            setTotaletransport(totale.toFixed(2))
            setTotalecash(totalecash.toFixed(2))
          }
          calculTotale()
          
        },[data]
       )
    
  return (
    <>
      <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                  {data.length} commandes
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">Copy Order ID</span>
                    </Button>
                  </CardTitle>
                  <CardDescription>Date: {formattedDate}</CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Button size="sm" variant="outline" className="h-8 gap-1" disabled={true}>
                    <Truck className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                      Track Order
                    </span>
                  </Button>
                  
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Orders Details</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Nombre de commandes</span>
                      <span>{data.length}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Nombre de commandes Intra</span>
                      <span>{data.filter((e)=>e.INTRA_OU_INTER == "INTRA").length}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Nombre de commandes Inter</span>
                      <span>{data.filter((e)=>e.INTRA_OU_INTER == "INTER").length}</span>
                    </li>
                    
                  </ul>
                  <Separator className="my-2" />
                    
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                       Total transport
                      </span>
                      <span>{Totaletransport} DH</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Total d'argent collecté
                      </span>
                      <span>{Totalecash} DH</span>
                    </li>
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground">Total</span>
                      <span>{parseFloat(Totalecash)-parseFloat(Totaletransport)} DH</span>
                    </li>
                  </ul>
                  
                </div>
                {/* <Separator className="my-4" /> */}
                {/* <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <div className="font-semibold">Shipping Information</div>
                    <address className="grid gap-0.5 not-italic text-muted-foreground">
                      <span>Liam Johnson</span>
                      <span>1234 Main St.</span>
                      <span>Anytown, CA 12345</span>
                    </address>
                  </div>
                  <div className="grid auto-rows-max gap-3">
                    <div className="font-semibold">Billing Information</div>
                    <div className="text-muted-foreground">
                      Same as shipping address
                    </div>
                  </div>
                </div> */}
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Customer Information</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Nombre renvoyé à l'expéditeur</dt>
                      <dd>{data.filter((e)=>e.Statut == "Returned to Sender").length}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Nombre de commades Complété</dt>
                      <dd>
                        <a href="mailto:">{data.filter((e)=>e.Statut == "Completed").length}</a>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      {/* <dt className="text-muted-foreground">Phone</dt>
                      <dd>
                        <a href="tel:">+1 234 567 890</a>
                      </dd> */}
                    </div>
                  </dl>
                </div>
                <Separator className="my-4" />
                
              </CardContent>
              {/* <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <div className="text-xs text-muted-foreground">
                  Updated <time dateTime="2023-11-23">November 23, 2023</time>
                </div>
                <Pagination className="ml-auto mr-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <ChevronLeft className="h-3.5 w-3.5" />
                        <span className="sr-only">Previous Order</span>
                      </Button>
                    </PaginationItem>
                    <PaginationItem>
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span className="sr-only">Next Order</span>
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardFooter> */}
            </Card>
    </>
  )
}
