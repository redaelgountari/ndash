"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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

const ChartQ = ({ data, time }) => {
  const [chartData, setChartData] = useState([]);
  const [tim, setTim] = useState("cette semaine");
  const [startday, setStartday] = useState("");
  const [lastday, setLastday] = useState("");

  useEffect(() => {
    const groupedData = groupDataByTime(data, time);
    setChartData(groupedData);
  }, [data, time]);

  const groupDataByTime = (data, time) => {
    const today = new Date();
    const allDates = generateAllDates(time, today);
    const listdates = data.map((i) => i.Date_de_Livraison).sort();

    if (listdates.length > 0) {
      setStartday(listdates[0]);
      setLastday(listdates[listdates.length - 1]);
    }

    
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
      setTim("cette semaine");
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1);
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(day.getDate() + i);
        dates.push(day.toLocaleDateString("en-US", { weekday: "long" }));
      }
    } else if (time === "month") {
      setTim("ce mois");
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const day = new Date(today.getFullYear(), today.getMonth(), i);
        dates.push(day.toLocaleDateString("en-US", { day: "numeric" }));
      }
    } else if (time === "year") {
      setTim("cette année");
      for (let i = 0; i < 12; i++) {
        const month = new Date(today.getFullYear(), i);
        dates.push(month.toLocaleDateString("en-US", { month: "short" }));
      }
    } else if (time === "all") {
      setTim("ces années");
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Stacked + Legend</CardTitle>
        <CardDescription>{getFormattedRange(startday)} - {getFormattedRange(lastday)}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartData}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="Completed"
              stackId="a"
              fill="hsl(var(--chart-2))"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="Returned"
              stackId="a"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by {calculatePercentageDifference(data)}% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Affichage du nombre total de Produits au cours de {tim}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChartQ;
