// ./client/src/hooks/useFetchTasks.js
import { useState, useCallback, useEffect } from "react";

const useFetchTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const url = `${process.env.REACT_APP_API_URL}/api/tasks/tasks_history`;
            const options = { credentials: "include" };
            const res = await fetch(url, options);
            const data = await res.json();
            setTasks(sortData(data.tasks));
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const sortData = (data) => {
        return data.sort((a, b) => {
            if (a.id === b.id) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return b.id - a.id;
        });
    };

    return { tasks, isLoading, fetchData };
};

export default useFetchTasks;
