import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/auth/userSlicer";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const { loading } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const { username, password } = formData;
      const url = `${process.env.REACT_APP_API_URL}/api/auth/signin`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      };

      const res = await fetch(url, options);
      const data = await res.json();

      if (!res.ok) {
        dispatch(signInFailure(data));
        setMessage(data.message);
        return;
      }

      const { id, createdAt, updatedAt, ...rest } = data;
      dispatch(signInSuccess({ ...rest }));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error));
      setMessage(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-4">
      <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 w-full max-w-md transition duration-500 ease-in-out">
        <h1 className="text-3xl text-center font-bold mb-6 text-gray-800">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input
              type="text"
              id="username"
              placeholder="Username"
              className="appearance-none bg-gray-200 rounded-lg w-full text-gray-700 py-2 px-4 pl-10 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 transition duration-500 ease-in-out"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="appearance-none bg-gray-200 rounded-lg w-full text-gray-700 py-2 px-4 pl-10 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 transition duration-500 ease-in-out"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition duration-500 ease-in-out"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>
        {message && <p className="text-red-500 text-sm italic mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default Signin;
