import React from "react";

const Modal = ({ open, setOpen, title, children, size }) => {
  if (!open) return null;

  const modalWrapperClass = "fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center";
  const modalContentClass = `bg-gray-300 p-6 rounded-lg shadow-lg ${size || 'w-full max-w-md'}`;

  return (
    <div className={modalWrapperClass}>
      <div className={modalContentClass}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-900 text-lg font-semibold">{title}</h2>
          <button className="text-gray-900" onClick={() => setOpen(false)}>
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
