import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col w-64 bg-gray-900 text-gray-200">
      <div className="p-4 text-xl font-bold">
        <a href="/" className="text-white">Portal Infra</a>
      </div>
      <div className="flex-1">
        <ul className="menu p-4 space-y-2">
          <li><a href="/task-history" className="hover:bg-gray-700 p-2 block">Task History</a></li>
          <li>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`p-2 w-full text-left block flex items-center justify-between ${isDropdownOpen ? 'bg-gray-800 text-white' : 'hover:bg-gray-700'} focus:outline-none focus:bg-gray-800 focus:text-white active:bg-gray-800 active:text-white`}
            >
              Task List
              {isDropdownOpen ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>
            <ul className={`pl-4 transition-all duration-300 ease-in-out ${isDropdownOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
              <li className="py-1">
                <a href="/tasks/add-record-dns" className="block hover:bg-gray-600 p-2">Add Record DNS</a>
              </li>
              <li className="py-1">
                <a href="/tasks/provision-vm" className="block hover:bg-gray-600 p-2">Provision VM</a>
              </li>
              <li className="py-1">
                <a href="/tasks/dismantle-vm" className="block hover:bg-gray-600 p-2">Dismantle VM</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div className="p-4">
        <a href="https://support.daisyui.com" className="text-gray-400 hover:text-white">
          &copy; 2024 Portal-Infra
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
