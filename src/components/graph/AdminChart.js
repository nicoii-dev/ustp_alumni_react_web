import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import _ from 'lodash';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Legend
} from 'chart.js';

const AdminChart = ({ lineGraphData }) => {
  ChartJS.register(Title, Tooltip, LineElement, CategoryScale, LinearScale, PointElement, Filler, Legend);
  // ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Oct', 'Nov', 'Dec']
  const [data, setData] = useState({
    labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        showLabel: true,
        data: lineGraphData,
        label: "Users",
        backgroundColor: '#E9F5FF',
        borderColor: '#1282A2',
        tension: 0.5,
        fill: true,
        display: false,
        showLine: true,
        legend: {
          display: false
        }
      },
      // options: {legend:{display:false}}
    ],
  });

  return <Line data={data} width={'100%'} sx={{ padding: 15 }} options={{ maintainAspectRatio: false}} />;
};

export default AdminChart;
