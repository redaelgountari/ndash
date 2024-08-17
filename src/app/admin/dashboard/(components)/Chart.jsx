"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import { useState, useEffect } from "react";
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
import { array } from "zod";

const caltotale = (datas) => {
  const total = datas.reduce((sum, i) => {
    const amount = parseFloat(i.TOTAL);
    return !isNaN(amount) ? sum + amount : sum;
  }, 0);
  return total.toFixed(2);
};

const calculateAverageOfPreviousWeeks = (datas) => {
  const weeklyTotals = datas.reduce((acc, i) => {
    const date = i.Date_de_Livraison;
    const amount = parseFloat(i.TOTAL);
    if (!isNaN(amount)) {
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += amount;
    }
    return acc;
  }, {});

  const weeklyTotalsArray = Object.values(weeklyTotals);
  const averageTotal = weeklyTotalsArray.length > 0
    ? weeklyTotalsArray.reduce((sum, total) => sum + total, 0) / weeklyTotalsArray.length
    : 0;

  return averageTotal.toFixed(2);
};

const calculatePercentageDifference = (datas) => {
  const totalOverall = parseFloat(caltotale(datas));
  const averageOverall = parseFloat(calculateAverageOfPreviousWeeks(datas));

  if (averageOverall === 0) {
    return "N/A";
  }

  const percentageDifference = ((totalOverall - averageOverall) / averageOverall) * 100;
  return percentageDifference.toFixed(2);
};

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
};

export default function Chart(props) {
  const [startday, setstartday] = useState();
  const [lastday, setlastday] = useState();
  const lengthIntra = props.data.filter((i) => i.INTRA_OU_INTER === "INTRA");
  const lengthInter = props.data.filter((i) => i.INTRA_OU_INTER === "INTER");

  const chartData = [
    { browser: "INTRA", visitors: lengthIntra.length, fill: "var(--color-chrome)" },
    { browser: "INTER", visitors: lengthInter.length, fill: "var(--color-safari)" }
  ];

  const listdates = props.data.map((i) => i.Date_de_Livraison);

  useEffect(() => {
    if (listdates.length > 0) {
      setlastday(listdates[0]);
      setstartday(listdates[listdates.length - 1]);
    }
  }, [listdates]);

  const getFormattedRange = (time) => {
    if (startday && lastday) {
      const date = new Date(time);

      const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
      const weekdayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
      const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(date);
      const formattedDate = `${weekdayName}, ${monthName}, ${year}`; 
      return formattedDate
    }
    return 'Loading...';
  };

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, [chartData]);

  const percentageDifference = calculatePercentageDifference(props.data);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription className="text capitalize text-xs">{getFormattedRange(startday)}
        {/* <span>
          <svg className="m-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style={{ display: "inline", fill: "white" }} width={12}><path  d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>
        </span> */}
        -
          {getFormattedRange(lastday)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Commandes
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by {percentageDifference}% <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the selected period
        </div>
      </CardFooter>
    </Card>
  );
}
