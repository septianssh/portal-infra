import React, { useState } from "react";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import Modal from "../../../components/common/Modal";

const AddRecordDNS = () => {
  const [activeDirectory, setActiveDirectory] = useState("");
  const [entries, setEntries] = useState([{ ip: "", hostname: "", zone: "", isValid: true }]);
  const [modalMessage, setModalMessage] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const handleAddEntry = () => {
    setEntries([...entries, { ip: "", hostname: "", zone: "", isValid: true }]);
  };

  const handleRemoveEntry = (index) => {
    if (entries.length === 1) {
      setEntries([{ ip: "", hostname: "", zone: "", isValid: true }]);
    } else {
      const newEntries = [...entries];
      newEntries.splice(index, 1);
      setEntries(newEntries);
    }
  };

  const handleChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const handleIPChange = (index, value) => {
    const sanitizedValue = value.replace(/[^\d.]/g, "");
    const octets = sanitizedValue.split(".").slice(0, 4);

    let isValid = true;
    for (let i = 0; i < octets.length; i++) {
      if (octets[i].length > 3 || parseInt(octets[i]) > 255) {
        isValid = false;
        break;
      }
    }

    const formattedValue = octets.map(octet => octet.slice(0, 3)).join(".");
    const newEntries = [...entries];
    newEntries[index].ip = formattedValue;
    newEntries[index].isValid = isValid;
    setEntries(newEntries);
  };

  const handleConfirm = async () => {
    if (!activeDirectory || entries.length === 0 || entries.some(entry => !entry.hostname || !entry.ip || !entry.zone || !entry.isValid)) {
      setModalMessage("Active Directory and valid entries must be provided");
      return;
    }
    setConfirmModalOpen(true);
  };

  const handleDirectoryChange = (directory) => {
    setActiveDirectory(directory);
    if (directory === "DEVELOPMENT") {
      const newEntries = entries.map((entry) => ({
        ...entry,
        zone: "local.altodev.id",
      }));
      setEntries(newEntries);
    }
  };

  const handleConfirmAction = async () => {
    setConfirmModalOpen(false);
    const url = `${process.env.REACT_APP_API_URL}/api/tasks/execute`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskType: "Add_Record_DNS",
        taskParams: {
          active_directory: activeDirectory,
          hosts_entries: entries,
        },
      }),
      credentials: 'include',
    };

    const response = await fetch(url, options);

    const data = await response.json();

    if (response.ok) {
      setConfirmModalOpen(false);
      setModalMessage("Add Entries has been started, please check status in dashboard.");
    } else {
      const fail_message = data.message;
      setConfirmModalOpen(false);
      setModalMessage(`Failed to add entries. Caused: ${fail_message}`);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-4">
        <div className="mb-4">
          <select
            value={activeDirectory}
            onChange={(e) => handleDirectoryChange(e.target.value)}
            className="select select-bordered select-md w-1/3 max-w-xs px-3 py-2 mr-2"
          >
            <option value="">Select Active Directory</option>
            <option value="DEVELOPMENT">Development</option>
            <option value="webserver2">Webserver 2</option>
          </select>
        </div>

        {entries.map((entry, index) => (
          <div key={index} className="flex items-center mb-4">
            <button
              onClick={handleAddEntry}
              className="bg-blue-500 text-white px-3 py-2 rounded-md mr-2"
            >
              <PlusCircleIcon className="h-5 w-5" />
            </button>

            <input
              type="text"
              value={entry.hostname}
              onChange={(e) => handleChange(index, "hostname", e.target.value)}
              placeholder="Hostname"
              className="input input-bordered input-md w-full max-w-xs px-3 py-2 mr-2"
            />

            <input
              type="text"
              value={entry.ip}
              onChange={(e) => handleIPChange(index, e.target.value)}
              placeholder="IP Address"
              className={`input input-bordered input-md w-full max-w-xs px-3 py-2 mr-2 ${entry.isValid ? "" : "input-error"}`}
            />

            <input
              type="text"
              value={entry.zone}
              onChange={(e) => handleChange(index, "zone", e.target.value)}
              placeholder="Zone"
              className="input input-bordered input-md w-full max-w-xs px-3 py-2 mr-2"
            />

            <button
              onClick={() => handleRemoveEntry(index)}
              className="bg-red-500 text-white px-3 py-2 rounded-md"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ))}

        <button
          onClick={() => handleConfirm("add_hosts")}
          className="bg-green-500 text-white px-3 py-2 rounded-md mr-2"
        >
          Add Entries
        </button>
      </div>

      <Modal open={confirmModalOpen} setOpen={setConfirmModalOpen} title="Confirmation">
        <div className="p-4">
          <p>Are you sure you want to add these entries?</p>
          <div className="flex justify-end mt-4">
            <button
              className="btn btn-sm bg-green-500 text-white py-2 px-4 rounded mr-2"
              onClick={() => handleConfirmAction()}
            >
              Yes
            </button>
            <button
              className="btn btn-sm bg-gray-500 text-white py-2 px-4 rounded"
              onClick={() => setConfirmModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={modalMessage} setOpen={setModalMessage} title="Alert">
        <div className="p-4">
          <p>{modalMessage}</p>
        </div>
      </Modal>
    </div>
  );
};

export default AddRecordDNS;
