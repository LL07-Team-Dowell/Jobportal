import { createContext, useContext, useState } from "react";

const JobContext = createContext();

export const useJobContext = () => {
  return useContext(JobContext);
};

export const JobContextProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [list, setlist] = useState([]);
  const [jobs2, setjobs2] = useState([]);
  const [resp, setresponse] = useState(false);
  const [searchValue, setsearchValue] = useState("");
  const [jobLinks, setJobLinks] = useState([]);
  const [projectsAdded, setProjectsAdded] = useState([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [productLinks, setProductLinks] = useState([]);
  const [subProjectsAdded, setSubProjectsAdded] = useState([]);
  const [subProjectsLoaded, setSubProjectsLoaded] = useState(false);
  const [subProjectsLoading, setSubProjectsLoading] = useState(true);
  const [reportLinks, setReportLinks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [applicationsLoaded, setApplicationsLoaded] = useState(false);
  const [dashboardDataLoaded, setDashboardDataLoaded] = useState(false);
  const [totalWorklogCountInOrg, setTotalWorklogCountInOrg] = useState(0);
  const [totalWorklogCountInOrgLoading, setTotalWorklogCountInOrgLoading] = useState(false);
  const [totalWorklogCountInOrgLoaded, setTotalWorklogCountInOrgLoaded] = useState(false);
  const [dashboardLogDataForToday, setDashboardLogDataForToday] = useState({
    datasets: [],
    labels: []
  });
  const [dashboardLogDataForMonth, setDashboardLogDataForMonth] = useState({
    datasets: [],
    labels: []
  });

  return (
    <JobContext.Provider
      value={{
        jobs,
        setJobs,
        setlist,
        list,
        jobs2,
        setjobs2,
        searchValue,
        setsearchValue,
        resp,
        setresponse,
        jobLinks,
        setJobLinks,
        projectsAdded,
        setProjectsAdded,
        projectsLoaded,
        setProjectsLoaded,
        projectsLoading,
        setProjectsLoading,
        productLinks,
        setProductLinks,
        subProjectsAdded,
        setSubProjectsAdded,
        subProjectsLoaded,
        setSubProjectsLoaded,
        subProjectsLoading,
        setSubProjectsLoading,
        reportLinks,
        setReportLinks,
        applications,
        setApplications,
        applicationsLoaded,
        setApplicationsLoaded,
        dashboardDataLoaded,
        setDashboardDataLoaded,
        totalWorklogCountInOrg,
        setTotalWorklogCountInOrg,
        totalWorklogCountInOrgLoading,
        setTotalWorklogCountInOrgLoading,
        totalWorklogCountInOrgLoaded,
        setTotalWorklogCountInOrgLoaded,
        dashboardLogDataForToday,
        setDashboardLogDataForToday,
        dashboardLogDataForMonth,
        setDashboardLogDataForMonth,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
