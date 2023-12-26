import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Legend,
} from "chart.js";
import _ from "lodash";

const AdminLineGraph = ({
  lineGraphData = [],
  lineLabel = [],
  label = "Employed",
  lineGraphData2 = [],
  lineLabel2 = [],
  label2 = "Unemployed",
  dashboard = false
}) => {
  ChartJS.register(
    Title,
    Tooltip,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler,
    Legend
  );
  // ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Oct', 'Nov', 'Dec']

  const [data, setData] = useState({
    labels: lineLabel,
    datasets: [
      {
        showLabel: true,
        data: [],
        label: label,
        borderColor: "#1282A2",
        tension: 0.5,
        fill: true,
        display: true,
        showLine: true,
        // legend: {
        //   display: false
        // }
      },
    ],
  });

  useEffect(() => {
    console.log('1')
    if(dashboard) {
      setData({
        labels: lineLabel,
        datasets: [
          {
            showLabel: true,
            data: lineGraphData,
            label: label,
            borderColor: "#1282A2",
            tension: 0.5,
            fill: true,
            display: true,
            showLine: true,
            // legend: {
            //   display: false
            // }
          },
          {
            showLabel: true,
            data: lineGraphData2,
            label: label2,
            tension: 0.5,
            borderColor: "red",
            fill: true,
            display: true,
            showLine: true,
          },
        ],
      });
    } else {
      setData({
        labels: lineLabel,
        datasets: [
          {
            showLabel: true,
            data: lineGraphData,
            label: label,
            borderColor: "#1282A2",
            tension: 0.5,
            fill: true,
            display: true,
            showLine: true,
            // legend: {
            //   display: false
            // }
          },
        ],
      });
    }

  }, [label, lineGraphData, lineLabel]);

  return (
    data && (
      <Line
        data={data}
        width={"100%"}
        sx={{ padding: 15 }}
        options={{ maintainAspectRatio: false }}
      />
    )
  );
};

export default AdminLineGraph;
