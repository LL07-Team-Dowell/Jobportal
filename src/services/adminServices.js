import { currentBackendAxiosInstance } from "./axios";

export const addNewJob = async (dataToPost) => {
  const response = await currentBackendAxiosInstance.post(
    "admin_create_jobs/",
    dataToPost
  );
  return response;
};

export const deleteJob = async (data, document_id) => {
  return await currentBackendAxiosInstance.delete(
    `admin_delete_job/${document_id}/`,
    data
  );
};

export const updateJob = async (data) => {
  console.log(data);
  return await currentBackendAxiosInstance.patch("admin_update_jobs/", data);
};

export const getApplicationForAdmin = async (company_id) => {
  return await currentBackendAxiosInstance.get(
    `candidate_get_job_application/${company_id}/`
  );
};

export const getJobsFromAdmin = async (company_id) => {
  return await currentBackendAxiosInstance.get(
    `admin_get_all_jobs/${company_id}/`
  );
};

export const generatePublicJobLink = async (data) => {
  return await currentBackendAxiosInstance.post(
    "generate_public_job_application_link/",
    data
  );
};

export const getMasterLinks = async (companyId) => {
  return await currentBackendAxiosInstance.get(
    `generate_public_job_application_link/${companyId}/`
  );
};

export const adminAddSettingUserProject = async (data) => {
  return await currentBackendAxiosInstance.post(`settinguserproject/`, data);
};

export const adminEditSettingUserProject = async (id, data) => {
  return await currentBackendAxiosInstance.put(
    `settinguserproject/${id}`,
    data
  );
};

export const generateReport = async (data) => {
  return await currentBackendAxiosInstance.post(`generate_admin_report/`, data);
};

export const getUsedQrCodes = async (companyId) => {
  return await currentBackendAxiosInstance.get(`get_all_qrcode/${companyId}/`)
};

export const createNewProductLink = async (data) => {
  return await currentBackendAxiosInstance.post(
    "public_product_url/",
    data
  );
};

export const getCreatedProductLinks = async (companyId) => {
  return await currentBackendAxiosInstance.get(
    `/fetch_public_product_url/${companyId}/`,
  );
};

export const adminEditUserSettingProfile = async (id, data) => {
  return await currentBackendAxiosInstance.put(
    `settinguserprofileinfo/${id}`,
    data
  );
};

export const getSettingUserSubProject = async () => {
  return await currentBackendAxiosInstance.get(`settingusersubproject/`)
}

export const getSingleSettingUserSubProject = async (id) => {
  return await currentBackendAxiosInstance.get(`settingusersubproject/${id}`)
}

export const createNewSettingUserSubProject = async (data) => {
  return await currentBackendAxiosInstance.post(`settingusersubproject/`, data)
}

export const editSettingUserSubProject = async (id, data) => {
  return await currentBackendAxiosInstance.put(`settingusersubproject/${id}/`, data)
}
