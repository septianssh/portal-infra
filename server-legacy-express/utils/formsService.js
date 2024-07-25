
const createVMGCPForm = (formData) => ({
  ad_name: formData.environment,
  vmvars_project: formData.project,
  vmvars_zone: formData.zone,
  vmvars_name: formData.hostname,
  vmvars_os: formData.os,
  vmvars_osver: formData.os_version,
  vmvars_instances_type: formData.instances_type,
  vmvars_disk_type: formData.disk_type,
  vmvars_disk: parseInt(formData.disk_size, 10),
  vmvars_vpc: formData.vpc_network,
  vmvars_subnet: formData.subnet,
  vmvars_cidr: formData.subnet_cidr,
  vmvars_ipaddress: formData.ip_address,
});

const createVMVMWareForm = (formData) => ({
  ad_name: formData.environment,
  vmvars_datacenter: formData.datacenter,
  cluster_name: formData.cluster_name,
  vmvars_name: formData.hostname,
  vmvars_template: formData.os_template,
  vmvars_cpu: parseInt(formData.cpu_thread, 10),
  vmvars_memory: parseInt(formData.memory_size, 10),
  vmvars_datastore: formData.datastore,
  v_disk: parseInt(formData.disk_size, 10),
  vmvars_app_datastore: formData.app_datastore,
  v_netname: formData.netname,
  vmvars_ipaddress: formData.ip_address,
  vmvars_gateway: formData.gateway,
});

const deleteVMGCPForm = (formData, yamlLikeEntries) => ({
  ad_name: formData.environment,
  vmvars_project: formData.project,
  vmvars_zone: formData.zone,
  parsed_data: yamlLikeEntries,
});

const deleteVMVMWareForm = (formData, yamlLikeEntries) => ({
  ad_name: formData.environment,
  parsed_data: yamlLikeEntries,
});

export {
  createVMGCPForm,
  createVMVMWareForm,
  deleteVMGCPForm,
  deleteVMVMWareForm,
};
