import React from "react";

const inputStyles = "input input-bordered input-sm w-full max-w-xs";
const labelStyles = "block text-gray-700";

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  disabled = false,
  className,
}) => (
  <div className="w-full md:w-3/4 px-2 mb-4">
    <label className={labelStyles}>{label}:</label>
    <input
      type={type}
      placeholder="Type here"
      name={name}
      value={value}
      onChange={onChange}
      className={`${inputStyles} ${className}`}
      disabled={disabled}
    />
  </div>
);

export default InputField;
