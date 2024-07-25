// import React from "react";

// const inputStyles =
//   "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50";
// const labelStyles = "block text-gray-700";

// const SelectField = ({
//   label,
//   name,
//   value,
//   options,
//   onChange,
//   disabled = false,
//   onClickFetchDatastore,
// }) => {
//   const handleSelectFieldClick = async () => {
//     if (onClickFetchDatastore) {
//       await onClickFetchDatastore();
//     }
//   };

//   return (
//     <div className="w-full md:w-1/2 px-2 mb-4">
//       <label className={labelStyles}>{label}:</label>
//       <select
//         name={name}
//         value={value}
//         onChange={onChange}
//         onClick={handleSelectFieldClick}
//         className={inputStyles}
//         disabled={disabled}
//       >
//         <option value="">{`Select ${label}`}</option>
//         {options.map((option) => (
//           <option key={option.value} value={option.value}>
//             {option.label}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default SelectField;

import React from "react";

const inputStyles = "select select-bordered select-sm w-full max-w-xs";
// "form-select mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50";
const labelStyles = "block text-gray-700";

const SelectField = ({
  label,
  name,
  value,
  options,
  onChange,
  disabled = false,
  onClickFetchDatastore,
}) => {
  const handleSelectFieldClick = async () => {
    if (onClickFetchDatastore) {
      await onClickFetchDatastore();
    }
  };

  return (
    <div className="w-full md:w-3/4 px-2 mb-4">
      <label className={labelStyles}>{label}:</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        onClick={handleSelectFieldClick}
        className={inputStyles}
        disabled={disabled}
      >
        <option value="">{`Select ${label}`}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
