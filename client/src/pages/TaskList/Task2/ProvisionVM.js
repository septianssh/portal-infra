import React, { useState } from 'react';
import SelectField from "../../../components/common/SelectField";
import VMConfigs from './VMConfigs';
import Modal from "../../../components/common/Modal";

const ManageVM = () => {
  const [tabs, setTabs] = useState([{ id: 1, title: 'VM 1', content: {} }]);
  const [activeTab, setActiveTab] = useState(1);
  const [vmActionType, setVmActionType] = useState('create_vm_GCP');
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openWarnModal, setOpenWarnModal] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState(1);
  const [modalMessage, setModalMessage] = useState('');
  const [inputErrors, setInputErrors] = useState({});

  const addTab = () => {
    const newTabId = tabs.length ? tabs[tabs.length - 1].id + 1 : 1;
    setTabs([...tabs, { id: newTabId, title: `VM ${newTabId}`, content: {} }]);
    setActiveTab(newTabId);
  };

  const removeTab = (id) => {
    const updatedTabs = tabs.filter(tab => tab.id !== id);
    setTabs(updatedTabs);
    if (activeTab === id && updatedTabs.length) {
      setActiveTab(updatedTabs[0].id);
    } else if (!updatedTabs.length) {
      setActiveTab(null);
    }
  };

  const handleInputChange = (tabId, fieldName, value) => {
    let updatedForms = tabs.map(tab => {
      if (tab.id === tabId) {
        return {
          ...tab,
          content: {
            ...tab.content,
            [fieldName]: value,
          }
        };
      }
      return tab;
    });

    function updateProjectDetails(index, value, vmvars_map) {
      if (value === "") {
        for (let field in updatedForms[index]["content"]) {
          updatedForms[index]["content"][field] = "";
        }
      } else {
        if (vmActionType === "create_vm_GCP") {
          const selectedEnvData = vmvars_map[value];
          const { project, zone, disk_type } = selectedEnvData;
          updatedForms[index]["content"]["project"] = project;
          updatedForms[index]["content"]["zone"] = zone;
          updatedForms[index]["content"]["disk_type"] = disk_type;
        }
      }
    }

    function updateNetworkDetails(index, value, vmvars_map) {
      const environment = updatedForms[index]["content"]["environment"];
      const form = updatedForms[index]["content"];

      if (value === "") {
        form["vpc_network"] = "";
        form["subnet"] = "";
        form["subnet_cidr"] = "";
      } else {
        if (vmActionType === "create_vm_GCP") {
          const envMap = vmvars_map[environment];
          form["vpc_network"] = envMap["vpc_network"][value];
          form["subnet"] = envMap["subnet"][value];
          form["subnet_cidr"] = envMap["subnet_cidr"][value];
          form["ip_address"] = envMap["subnet_cidr"][value].split("/")[0].split(".").slice(0, 3).join(".") + ".";
        }
      }
    }

    function validateEnvironmentSelection(index) {
      const environment = updatedForms[index]["content"]["environment"];
      if (!environment) {
        updatedForms[index]["environment_type"] = "";
        setModalMessage("Please select an environment first.");
        setOpenWarnModal(true);
        return false;
      }
      return true;
    }

    // IP address validation
    if (fieldName === "ip_address") {
      const octets = value.split(".");
      const invalidOctets = octets.filter(octet => parseInt(octet, 10) > 255);
      const inputErrorState = { ...inputErrors };

      if (invalidOctets.length > 0) {
        inputErrorState[`${tabId}_${fieldName}`] = true;
      } else {
        delete inputErrorState[`${tabId}_${fieldName}`];
      }

      setInputErrors(inputErrorState);
    }

    if (fieldName === "environment") {
      updateProjectDetails(tabId - 1, value, getFieldConfigs().vmvars_map);
    } else if (
      fieldName === "environment_type" &&
      validateEnvironmentSelection(tabId - 1)
    ) {
      updateNetworkDetails(tabId - 1, value, getFieldConfigs().vmvars_map);
    } else if (fieldName === "datastore") {
    }

    setTabs(updatedForms);
  };

  const [sortedDatastore, setSortedDatastore] = useState([]);
  const [fetchDatastoreDone, setFetchDatastoreDone] = useState(false);

  const handleSelectFieldClick = async (name) => {
    try {
      if (name === "datastore" && !fetchDatastoreDone) {
        const url = `${process.env.REACT_APP_API_URL}/api/tasks/fetch_datastores`;
        const options = {
          method: "POST",
          credentials: 'include',
        };

        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error("Failed to fetch datastores");
        }
        const data = await response.json();
        const content = data.success.content;

        // eslint-disable-next-line
        const cleanedData = content.replace(/\x1B\[[0-9;]*[JKmsu]/g, "");
        const startIdx = cleanedData.indexOf('"sorted_datastores":');
        const endIdx = cleanedData.lastIndexOf("}");
        const extractedString = `{ ${cleanedData.slice(startIdx, endIdx + 1)}`;
        const result = JSON.parse(extractedString);
        const datastoreOptions = Object.entries(result.sorted_datastores).map(
          ([name, value]) => ({
            label: `${name} - ${value.toFixed(2)}%`,
            value: name,
          })
        );

        setSortedDatastore(datastoreOptions);
        setFetchDatastoreDone(true);
      }
    } catch (error) {
      console.error("Error fetching datastores:", error);
    }
  };

  const renderFormFields = (fieldConfigs, tabId) => {
    return (
      <div className="flex flex-wrap -mx-2">
        {fieldConfigs.map((field, index) => {
          // Component initiated in ./VMConfigs.js
          const FieldComponent = field.component_type;

          // Custom options for the 'datastore' field based on fetched data, related to Create VMWare options
          const fieldOptions =
            field.name === "datastore"
              ? sortedDatastore.length
                ? sortedDatastore
                : [{ label: "Loading ....", value: "" }]
              : field.options;

          const errorClass = inputErrors[`${tabId}_${field.name}`] ? 'input-error' : '';

          return (
            <div key={index} className="w-full md:w-1/2 px-2 mb-4">
              <FieldComponent
                label={field.label}
                name={field.name}
                options={fieldOptions}
                disabled={field.disabled}
                value={tabs.find(tab => tab.id === tabId).content[field.name] || ''}
                onChange={(e) => handleInputChange(tabId, field.name, e.target.value)}
                onClickFetchDatastore={() => handleSelectFieldClick(field.name)}
                className={errorClass}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const getFieldConfigs = () => {
    const [action, , type] = vmActionType.split('_');
    const { field_config, vmvars_map = null } = VMConfigs[type][action];

    return {
      field_config,
      vmvars_map
    };
  };

  const handleConfirmSubmit = async () => {
    const forms = tabs.map((tab) => {
      return {
        ...tab.content,
      };
    });

    try {
      const url = `${process.env.REACT_APP_API_URL}/api/tasks/execute`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskType: "Provision_VM",
          taskParams: {
            run_type: vmActionType,
            forms_data: JSON.stringify(forms),
          },
        }),
        credentials: 'include',
      };

      const response = await fetch(url, options);

      const data = await response.json();

      if (!response.ok) {
        setModalMessage(`Failed to ${vmActionType} with code ${response.status}. Caused: ${data.message}`);
        setOpenWarnModal(true);
      } else {
        setOpenConfirmModal(false);
        setModalMessage("Create VMs have been started, please check status in dashboard.");
        setOpenWarnModal(true);
      }
    } catch (error) {
      setModalMessage(`An error occurred with message: ${error.message}`);
      setOpenWarnModal(true);
    }
  };

  const handleSubmit = () => {
    const requiredKeys = getFieldConfigs().field_config.map(field => field.name);

    const formChecker = (content) =>
      requiredKeys.every(key => content.hasOwnProperty(key) && content[key] !== '');

    const validForm = tabs.every(tab => Object.keys(tab.content).length > 0 && formChecker(tab.content));

    if (!validForm) {
      setModalMessage("All fields are required");
      setOpenWarnModal(true);
      return;
    }
    setOpenConfirmModal(true);
  };

  const renderReviewContent = () => {
    const rows = [];
    for (let i = 0; i < tabs.length; i += 10) {
      const rowTabs = tabs.slice(i, i + 10);
      rows.push(
        <div key={i} className="flex flex-wrap">
          {rowTabs.map(tab => (
            <div
              key={tab.id}
              className={`flex items-center px-4 py-2 cursor-pointer border border-b-0 rounded-t ${activeModalTab === tab.id ? 'bg-white text-black' : 'bg-gray-100 text-gray-500'
                }`}
              onClick={() => setActiveModalTab(tab.id)}
            >
              {tab.title}
            </div>
          ))}
        </div>
      );
    }
    return (
      <>
        {rows}
        <div className="bg-gray-100 p-4 rounded max-h-48 overflow-y-auto">
          {tabs.map(
            tab =>
              tab.id === activeModalTab && (
                <div key={tab.id}>
                  {Object.entries(tab.content).map(([field, value], index) => (
                    <div key={index} className="mb-2">
                      <span className="font-semibold">{field}: </span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              )
          )}
        </div>
      </>
    );
  };


  const renderTabRows = () => {
    const rows = [];
    for (let i = 0; i < tabs.length; i += 10) {
      const rowTabs = tabs.slice(i, i + 10);
      rows.push(
        <div key={i} className="flex border-b border-gray-300 mb-4">
          {rowTabs.map(tab => (
            <div
              key={tab.id}
              className={`flex items-center px-4 py-2 cursor-pointer border border-b-0 rounded-t ${activeTab === tab.id ? 'bg-white text-black' : 'bg-gray-100 text-gray-500 transition duration-300 ease-in-out'
                }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.title}
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTab(tab.id);
                }}
              >
                x
              </button>
            </div>
          ))}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <SelectField
          label="VM Action Type"
          name="vm_action_type"
          options={[
            { label: "Create VM GCP", value: "create_vm_GCP" },
            { label: "Create VMware", value: "create_vm_VMWare" },
          ]}
          onChange={(e) => setVmActionType(e.target.value)}
          value={vmActionType}
        />
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 ease-in-out"
          onClick={addTab}
        >
          +
        </button>
      </div>
      {renderTabRows()}
      <div className="p-4 border border-gray-300 rounded bg-gray-50 max-w-4xl mx-auto transition duration-300 ease-in-out">
        {tabs.map(tab => (
          tab.id === activeTab && (
            <div key={tab.id}>
              {renderFormFields(getFieldConfigs().field_config, tab.id)}
            </div>
          )
        ))}
      </div>
      <div className="flex justify-center">
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ease-in-out"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <Modal open={openWarnModal} setOpen={setOpenWarnModal} title="Alert" size="w-1/4">
        <div className="p-4">
          <p>{modalMessage}</p>
        </div>
      </Modal>
      <Modal open={openConfirmModal} setOpen={setOpenConfirmModal} title="Confirmation" size="w-1/2">
        <div className="p-4 max-w-xl mx-auto">
          <p>Are you sure you want to submit the following data?</p>
          {renderReviewContent()}
          <div className="flex justify-end">
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2 transition duration-300 ease-in-out"
              onClick={() => setOpenConfirmModal(false)}
            >
              Cancel
            </button>
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 ease-in-out"
              onClick={handleConfirmSubmit}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageVM;
