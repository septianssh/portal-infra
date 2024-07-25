// ./client/src/hooks/useMetrics.js
import { useState, useEffect } from "react";

const useMetrics = () => {
    const [metrics, setMetrics] = useState({
        totalTasks: 0,
        successfulTasks: 0,
        failedTasks: 0,
        runningTasks: 0,
        pendingTasks: 0,
    });

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const url = `${process.env.REACT_APP_API_URL}/api/tasks/tasks_metrics`;
                const options = { credentials: "include" };
                const res = await fetch(url, options);
                const data = await res.json();
                setMetrics(data);
            } catch (error) {
                console.error("Error fetching metrics:", error);
            }
        };

        fetchMetrics();
    }, []);

    return metrics;
};

export default useMetrics;
