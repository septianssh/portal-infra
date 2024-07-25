import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/solid";
import "./DataTable.css";

const DataTable = (props) => {
  const actionColumn = {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="action-container action-icon">
          <div
            className="update"
            onClick={() => {
              props.handleUpdate(params.row);
            }}
          >
            <PlusIcon className="h-5 w-5 text-green-500" />
          </div>
          <div
            className="delete"
            onClick={() => {
              props.handleDelete(params.row);
            }}
          >
            <MinusIcon className="h-5 w-5 text-red-500" />
          </div>
        </div>
      );
    },
  };

  return (
    <div className="DataTable">
      <DataGrid
        className="dataGrid"
        rows={props.rows}
        columns={[...props.columns, actionColumn]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        components={{ Toolbar: GridToolbar }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
      />
    </div>
  );
};

export default DataTable;
