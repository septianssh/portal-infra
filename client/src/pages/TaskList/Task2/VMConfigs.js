import SelectField from "../../../components/common/SelectField";
import InputField from "../../../components/common/InputField";

const createGCPVMOptions = {
  environment: [
    { label: "Development", value: "DEVELOPMENT" },
    { label: "QA", value: "QA" },
    { label: "Sandbox", value: "SANDBOX" },
    { label: "Staging", value: "STAGING" },
  ],
  environment_type: [
    { label: "App", value: "APP" },
    { label: "DB", value: "DB" },
    { label: "FE", value: "FE" },
  ],
  project: [
    { label: "dev-infra-289111", value: "dev-infra-289111" },
    { label: "qa-infra-306502", value: "qa-infra-306502" },
    { label: "sbx-infra-306502", value: "sbx-infra-306502" },
    { label: "stg-infra-306502", value: "stg-infra-306502" },
  ],
  zone: [
    { label: "asia-southeast2-a", value: "asia-southeast2-a" },
    { label: "asia-southeast2-b", value: "asia-southeast2-b" },
  ],
  os: [
    { label: "CentOS", value: "centos" },
    { label: "Rocky Linux", value: "rocky-linux" },
  ],
  osVersion: [
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
  ],
  instancesType: [
    { label: "e2-small", value: "e2-small" },
    { label: "e2-medium", value: "e2-medium" },
  ],
  diskType: [
    { label: "pd-standard", value: "pd-standard" },
    { label: "pd-balanced", value: "pd-balanced" },
  ],
  subnet: [
    { label: "vlan-211-app-int-dev", value: "vlan-211-app-int-dev" },
    { label: "vlan-221-db-dev", value: "vlan-221-db-dev" },
    { label: "vlan-201-fe-int-dev", value: "vlan-201-fe-int-dev" },
    { label: "vlan-212-app-int-qa", value: "vlan-212-app-int-qa" },
    { label: "vlan-222-db-qa", value: "vlan-222-db-qa" },
    { label: "vlan-202-fe-int-qa", value: "vlan-202-fe-int-qa" },
    { label: "vlan-216-app-int-sbx", value: "vlan-216-app-int-sbx" },
    { label: "vlan-226-db-sbx", value: "vlan-226-db-sbx" },
    { label: "vlan-206-fe-int-sbx", value: "vlan-206-fe-int-sbx" },
    { label: "vlan-215-app-int-stg", value: "vlan-215-app-int-stg" },
    { label: "vlan-225-db-stg", value: "vlan-225-db-stg" },
    { label: "vlan-205-fe-int-stg", value: "vlan-205-fe-int-stg" },
  ],
  subnetCidr: [
    { label: "10.57.11.0/24", value: "10.57.11.0/24" },
    { label: "10.57.21.0/24", value: "10.57.21.0/24" },
    { label: "10.57.1.0/24", value: "10.57.1.0/24" },
    { label: "10.57.12.0/24", value: "10.57.12.0/24" },
    { label: "10.57.22.0/24", value: "10.57.22.0/24" },
    { label: "10.57.2.0/24", value: "10.57.2.0/24" },
    { label: "10.57.16.0/24", value: "10.57.16.0/24" },
    { label: "10.57.26.0/24", value: "10.57.26.0/24" },
    { label: "10.57.6.0/24", value: "10.57.6.0/24" },
    { label: "10.57.15.0/24", value: "10.57.15.0/24" },
    { label: "10.57.25.0/24", value: "10.57.25.0/24" },
    { label: "10.57.5.0/24", value: "10.57.5.0/24" },
  ],
};

const createGCPVMFieldConfigs = [
  {
    component_type: SelectField,
    label: "Environment",
    name: "environment",
    options: createGCPVMOptions.environment,
  },
  {
    component_type: SelectField,
    label: "Environment Type",
    name: "environment_type",
    options: createGCPVMOptions.environment_type,
  },
  {
    component_type: SelectField,
    label: "Project",
    name: "project",
    options: createGCPVMOptions.project,
    disabled: true,
  },
  {
    component_type: SelectField,
    label: "Zone",
    name: "zone",
    options: createGCPVMOptions.zone,
    disabled: true,
  },
  { component_type: InputField, label: "Hostname", name: "hostname" },
  {
    component_type: SelectField,
    label: "OS",
    name: "os",
    options: createGCPVMOptions.os,
  },
  {
    component_type: SelectField,
    label: "OS Version",
    name: "os_version",
    options: createGCPVMOptions.osVersion,
  },
  {
    component_type: SelectField,
    label: "Instances Type",
    name: "instances_type",
    options: createGCPVMOptions.instancesType,
  },
  {
    component_type: SelectField,
    label: "Disk Type",
    name: "disk_type",
    options: createGCPVMOptions.diskType,
    disabled: true,
  },
  { component_type: InputField, label: "Size Disk (GB)", name: "disk_size" },
  {
    component_type: InputField,
    label: "VPC Network",
    name: "vpc_network",
    disabled: true,
  },
  {
    component_type: SelectField,
    label: "Subnet",
    name: "subnet",
    options: createGCPVMOptions.subnet,
    disabled: true,
  },
  {
    component_type: SelectField,
    label: "Subnet CIDR",
    name: "subnet_cidr",
    options: createGCPVMOptions.subnetCidr,
    disabled: true,
  },
  { component_type: InputField, label: "IP Address", name: "ip_address" },
];

const createVMWareVMOptions = {
  environment: [
    { label: "Development", value: "DEVELOPMENT" },
    { label: "QA", value: "QA" },
    { label: "Sandbox", value: "SANDBOX" },
    { label: "Staging", value: "STAGING" },
  ],
  environment_type: [
    { label: "App", value: "APP" },
    { label: "DB", value: "DB" },
    { label: "FE", value: "FE" },
  ],
  cluster_name: [
    { label: "Development", value: "DEVELOPMENT" },
    { label: "Sandbox", value: "SANDBOX" },
    { label: "Staging", value: "STAGING" },
    { label: "QA", value: "QA" },
  ],
  os_template: [
    { label: "alto-base-img-centos7", value: "alto-base-img-centos7" },
    { label: "alto-base-img-rhel7", value: "alto-base-img-rhel7" },
    { label: "alto-base-img-rhel8", value: "alto-base-img-rhel8" },
  ],
  datastore: [
    { label: "DS-D35ESXIAP01", value: "DS-D35ESXIAP01" },
    { label: "DS-D35ESXIAP02", value: "DS-D35ESXIAP02" },
    { label: "DS-D35ESXIAP03", value: "DS-D35ESXIAP03" },
  ],
  app_datastore: [
    { label: "DS-D35ESXIAP01", value: "DS-D35ESXIAP01" },
    { label: "DS-D35ESXIAP02", value: "DS-D35ESXIAP02" },
    { label: "DS-D35ESXIAP03", value: "DS-D35ESXIAP03" },
  ],
  netname: [
    { label: "APP Network", value: "APP Network" },
    { label: "DB Network", value: "DB Network" },
    { label: "FE Network", value: "FE Network" },
  ],
};

const createVMWareVMFieldConfigs = [
  {
    component_type: SelectField,
    label: "Environment",
    name: "environment",
    options: createVMWareVMOptions.environment,
  },
  {
    component_type: SelectField,
    label: "Environment Type",
    name: "environment_type",
    options: createVMWareVMOptions.environment_type,
  },
  {
    component_type: InputField,
    label: "Data Center",
    name: "datacenter",
  },
  {
    component_type: SelectField,
    label: "Cluster Name",
    name: "cluster_name",
    options: createVMWareVMOptions.cluster_name,
  },
  { component_type: InputField, label: "Hostname", name: "hostname" },
  {
    component_type: SelectField,
    label: "OS Template",
    name: "os_template",
    options: createVMWareVMOptions.os_template,
  },
  {
    component_type: InputField,
    label: "VCPU",
    name: "cpu_thread",
  },
  {
    component_type: InputField,
    label: "RAM (GB)",
    name: "memory_size",
  },
  {
    component_type: SelectField,
    label: "Datastore",
    name: "datastore",
    options: createVMWareVMOptions.datastore,
  },
  {
    component_type: InputField,
    label: "APP or DATA size (GB)",
    name: "disk_size",
  },
  {
    component_type: SelectField,
    label: "APP or data Datastore",
    name: "app_datastore",
    options: createVMWareVMOptions.app_datastore,
  },
  {
    component_type: SelectField,
    label: "Network Type",
    name: "netname",
    options: createVMWareVMOptions.netname,
  },
  { component_type: InputField, label: "IP Address", name: "ip_address" },
  { component_type: InputField, label: "IP Gateway", name: "gateway" },
];

const vmvars_map = {
  DEVELOPMENT: {
    project: "dev-infra-289111",
    zone: "asia-southeast2-a",
    disk_type: "pd-standard",
    vpc_network: {
      APP: "alto-dev-internal",
      DB: "alto-dev-internal",
      FE: "alto-dev-internal",
    },
    subnet: {
      APP: "vlan-211-app-int-dev",
      DB: "vlan-221-db-dev",
      FE: "vlan-201-fe-int-dev",
    },
    subnet_cidr: {
      APP: "10.57.11.0/24",
      DB: "10.57.21.0/24",
      FE: "10.57.1.0/24",
    },
  },
  QA: {
    project: "qa-infra-306502",
    zone: "asia-southeast2-a",
    disk_type: "pd-standard",
    vpc_network: {
      APP: "alto-qa-internal",
      DB: "alto-qa-internal",
      FE: "alto-qa-internal",
    },
    subnet: {
      APP: "vlan-212-app-int-qa",
      DB: "vlan-222-db-qa",
      FE: "vlan-202-fe-int-qa",
    },
    subnet_cidr: {
      APP: "10.57.12.0/24",
      DB: "10.57.22.0/24",
      FE: "10.57.2.0/24",
    },
  },
  SANDBOX: {
    project: "sbx-infra-306502",
    zone: "asia-southeast2-a",
    disk_type: "pd-standard",
    vpc_network: {
      APP: "alto-sbx-internal",
      DB: "alto-sbx-internal",
      FE: "alto-sbx-internal",
    },
    subnet: {
      APP: "vlan-216-app-int-sbx",
      DB: "vlan-226-db-sbx",
      FE: "vlan-206-fe-int-sbx",
    },
    subnet_cidr: {
      APP: "10.57.16.0/24",
      DB: "10.57.26.0/24",
      FE: "10.57.6.0/24",
    },
  },
  STAGING: {
    project: "stg-infra-306502",
    zone: "asia-southeast2-a",
    disk_type: "pd-standard",
    vpc_network: {
      APP: "alto-stg-internal",
      DB: "alto-stg-internal",
      FE: "alto-stg-internal",
    },
    subnet: {
      APP: "vlan-215-app-int-stg",
      DB: "vlan-225-db-stg",
      FE: "vlan-205-fe-int-stg",
    },
    subnet_cidr: {
      APP: "10.57.15.0/24",
      DB: "10.57.25.0/24",
      FE: "10.57.5.0/24",
    },
  },
};

const VMConfigs = {
  GCP: {
    create: {
      field_config: createGCPVMFieldConfigs,
      vmvars_map: vmvars_map,
    }
  },
  VMWare: {
    create: {
      field_config: createVMWareVMFieldConfigs,
    },
  },
};


export default VMConfigs;
