import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Chart data
const chartData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "Sales",
      data: [65, 59, 80, 81, 56, 55],
      borderColor: "#4F46E5",
      backgroundColor: "rgba(79, 70, 229, 0.2)",
      fill: true,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
    },
  },
};

const DashboardContent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-8">
      <h1 className="text-2xl font-semibold">Welcome to the Dashboard</h1>
      <p className="mt-2">View analytics and maps below.</p>

      {/* Chart and Map Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {/* Chart Section */}
        <div className="h-72 p-4 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Sales Chart</h2>
          <div className="h-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Map Section */}
        <div className="h-72 p-4 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Map</h2>
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={false}
            className="h-full rounded-lg"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[51.505, -0.09]}>
              <Popup>A sample popup</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
