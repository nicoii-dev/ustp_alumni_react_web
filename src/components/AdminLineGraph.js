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
  label="Employed",
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
  }, [lineGraphData]);

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
