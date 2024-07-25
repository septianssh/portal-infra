import SelectField from "../../../components/common/SelectField";
import InputField from "../../../components/common/InputField";

const deleteGCPVMOptions = {
  environment: [
    { label: "Development", value: "DEVELOPMENT" },
    { label: "Sandbox", value: "SANDBOX" },
    { label: "Staging", value: "STAGING" },
  ],
  project: [
    { label: "dev-infra-289111", value: "dev-infra-289111" },
    { label: "sbx-infra-306502", value: "sbx-infra-306502" },
  ],
  zone: [
    { label: "asia-southeast2-a", value: "asia-southeast2-a" },
    { label: "asia-southeast2-b", value: "asia-southeast2-b" },
  ],
};

const deleteVMFieldConfigs = [
  {
    component_type: SelectField,
    label: "Environment",
    name: "environment",
    options: deleteGCPVMOptions.environment,
  },
  {
    component_type: SelectField,
    label: "Project",
    name: "project",
    options: deleteGCPVMOptions.project,
  },
  {
    component_type: SelectField,
    label: "Zone",
    name: "zone",
    options: deleteGCPVMOptions.zone,
  },
  { component_type: InputField, label: "Hostname", name: "hostname" },
  { component_type: InputField, label: "IP Address", name: "ip_address" },
];

const deleteVMWareVMOptions = {
  environment: [
    { label: "Development", value: "DEVELOPMENT" },
    { label: "Sandbox", value: "SANDBOX" },
    { label: "Staging", value: "STAGING" },
  ],
};

const deleteVMWareVMFieldConfigs = [
  {
    component_type: SelectField,
    label: "Environment",
    name: "environment",
    options: deleteVMWareVMOptions.environment,
  },
  { component_type: InputField, label: "Hostname", name: "hostname" },
  { component_type: InputField, label: "IP Address", name: "ip_address" },
];


const VMConfigs = {
  GCP: {
    delete: {
      field_config: deleteVMFieldConfigs,
    },
  },
  VMWare: {
    delete: {
      field_config: deleteVMWareVMFieldConfigs,
    },
  },
};


export default VMConfigs;
