import React, { useState, useEffect } from "react";
import "./Add.css";

const Add = (props) => {
  const [formData, setFormData] = useState(props.user || {});
  const [message, setMessage] = useState("");

  useEffect(() => {
    setFormData(props.user || {});
  }, [props.user]);

  useEffect(() => {
    setMessage(props.modalMessage)
  }, [props.modalMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (e) => {
    await props.handleSubmit(formData);
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-2 gap-4">
        {props.columns
          .filter((item) => item.field !== "id" && item.field !== "createdAt")
          .map((column, index) => (
            <div className="item" key={index}>
              <label className="block text-gray-900">{column.headerName}</label>
              {column.field === "roles" ? (
                <select
                  name={column.field}
                  className="mt-1 p-2 w-full rounded-md bg-gray-300 text-gray-900"
                  value={formData[column.field] || ""}
                  onChange={handleChange}
                >
                  {column.options.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={column.type}
                  name={column.field}
                  placeholder={column.headerName}
                  className="mt-1 p-2 w-full rounded-md bg-gray-300 text-gray-900"
                  value={formData[column.field] || ""}
                  onChange={handleChange}
                />
              )}
            </div>
          ))}
        <div className="item">
          <label className="block text-gray-900">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="mt-1 p-2 w-full rounded-md bg-gray-300 text-gray-900"
            value={formData.password || ""}
            onChange={handleChange}
          />
        </div>
      </div>
      {message && <p className="text-red-600">{message}</p>}
      <button
        type="submit"
        className="mt-4 w-full bg-gray-300 text-gray-900 p-2 rounded-md hover:bg-gray-200"
      >
        {props.user ? "Update User" : "Add User"}
      </button>
    </form>
  );
}

export default Add;
