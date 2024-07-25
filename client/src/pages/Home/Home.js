// ./client/src/pages/Home.js
import React from 'react';
import useMetrics from "../../hooks/useFetchTaskMetrics";

const Home = () => {
  const metrics = useMetrics();

  const metricDetails = [
    { value: metrics.totalTasks, label: "Total Tasks", color: "text-blue-500" },
    { value: metrics.successfulTasks, label: "Successful Tasks", color: "text-green-500" },
    { value: metrics.failedTasks, label: "Failed Tasks", color: "text-red-500" },
    { value: metrics.runningTasks, label: "Running Tasks", color: "text-yellow-500" },
    { value: metrics.pendingTasks, label: "Pending Tasks", color: "text-indigo-500" },
  ];

  const MetricCard = ({ value, label, color }) => (
    <div className="p-4 bg-white rounded shadow-md flex flex-col items-center justify-center">
      <div className={`text-4xl font-bold ${color}`}>{value}</div>
      <div className="text-sm font-medium text-gray-500">{label}</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metricDetails.map((metric, index) => (
          <MetricCard
            key={index}
            value={metric.value}
            label={metric.label}
            color={metric.color}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
