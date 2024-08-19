"use client";

import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const Component = ({ data, time }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const groupedData = groupDataByTime(data, time);
    setChartData(groupedData);
  }, [data, time]);

  const groupDataByTime = (data, time) => {
    const today = new Date();
    const allDates = generateAllDates(time, today);

    const groupedData = allDates.reduce((acc, date) => {
      acc[date] = { Completed: 0, Returned: 0 };
      return acc;
    }, {});

    data.forEach(item => {
      const date = new Date(item.Date_de_Livraison);
      const key = formatDate(date, time);

      if (groupedData[key]) {
        if (item.Statut === "Completed") {
          groupedData[key].Completed += 1;
        } else if (item.Statut === "Returned to Sender") {
          groupedData[key].Returned += 1;
        }
      }
    });

    return Object.keys(groupedData).map(key => ({
      name: key,
      Completed: groupedData[key].Completed,
      Returned: groupedData[key].Returned,
    }));
  };

  const generateAllDates = (time, today) => {
    const dates = [];

    if (time === "week") {
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(day.getDate() + i);
        dates.push(day.toLocaleDateString("en-US", { weekday: "long" }));
      }
    } else if (time === "month") {
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const day = new Date(today.getFullYear(), today.getMonth(), i);
        dates.push(day.toLocaleDateString("en-US", { day: "numeric" }));
      }
    } else if (time === "year") {
      for (let i = 0; i < 12; i++) {
        const month = new Date(today.getFullYear(), i);
        dates.push(month.toLocaleDateString("en-US", { month: "short" }));
      }
    } else if (time === "all") {
      const years = [...new Set(data.map(item => new Date(item.Date_de_Livraison).getFullYear()))];
      dates.push(...years.map(year => year.toString()));
    }

    return dates;
  };

  const formatDate = (date, time) => {
    if (time === "week") {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    } else if (time === "month") {
      return date.toLocaleDateString("en-US", { day: "numeric" });
    } else if (time === "year") {
      return date.toLocaleDateString("en-US", { month: "short" });
    } else if (time === "all") {
      return date.getFullYear().toString();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Completed or Returned to send</CardTitle>
        <CardDescription>Showing total stats</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartData}>
          <AreaChart
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={value => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="Returned"
              type="natural"
              fill="hsl(var(--chart-1))"
              fillOpacity={0.4}
              stroke="hsl(var(--chart-1))"
              stackId="a"
            />
            <Area
              dataKey="Completed"
              type="natural"
              fill="hsl(var(--chart-2))"
              fillOpacity={0.4}
              stroke="hsl(var(--chart-2))"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Component;
