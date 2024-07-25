// ./client/src/pages/taskhistory.js
import React, { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import Modal from "../../components/common/Modal";
import useFetchTasks from "../../hooks/useFetchTaskHistory";
import "./TaskHistory.css";

const TaskHistory = () => {
    const { tasks, isLoading, fetchData } = useFetchTasks();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const handleRowClick = (params) => {
        setSelectedTask(params.row);
        setIsModalOpen(true);
    };

    const columns = [
        { field: "id", headerName: "No.", flex: 0.5 },
        { field: "jobId", headerName: "Job ID", flex: 0.5 },
        { field: "email", type: "string", headerName: "Email", flex: 1.5 },
        { field: "createdAt", type: "string", headerName: "Created at", flex: 1.5 },
        { field: "taskName", type: "string", headerName: "Task Name", flex: 1.5 },
        { field: "status", type: "string", headerName: "Status", flex: 0.75 },
        {
            field: "details",
            headerName: "Details",
            flex: 0.5,
            renderCell: (params) => (
                <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleRowClick(params)}
                >
                    View
                </button>
            ),
        },
    ];

    return (
        <div className="task-history p-5 h-full flex flex-col">
            <div className="info flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Task History</h1>
                <button
                    className="btn btn-md bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={fetchData}
                    disabled={isLoading}
                >
                    <ArrowPathIcon className="h-5 w-5 mr-2" />
                    {isLoading ? "Loading..." : "Reload"}
                </button>
            </div>
            <div className="flex-grow overflow-x-auto">
                <DataGrid
                    className="dataGrid"
                    rows={tasks}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 6,
                            },
                        },
                    }}
                    pageSizeOptions={[6]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    disableColumnFilter
                    disableDensitySelector
                    disableColumnSelector
                    components={{ Toolbar: GridToolbar }}
                    componentsProps={{
                        toolbar: {
                            showQuickFilter: true,
                            quickFilterProps: { debounceMs: 500 },
                        },
                    }}
                />
            </div>

            <Modal open={isModalOpen} setOpen={setIsModalOpen} title="Details" size="w-2/3 h-2/3">
                {selectedTask && (
                    <div className="bg-gray-100 p-4 rounded overflow-y-auto max-h-fit h-4/5">
                        <p className="preformatted-text">{selectedTask.details}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default TaskHistory;
