import { AiOutlinePlus } from "react-icons/ai";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { useJobContext } from "../../../../contexts/Jobs";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import useLoadAdminDashboardData from "./hooks/useLoadAdminDashboardData";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import MainStatCard from "./components/MainStatCard/MainStatCard";
import { FaUsers } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";
import { GoTasklist } from "react-icons/go";
import { ImStack } from "react-icons/im";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ApplicationCardItem from "./components/ApplicationCardItem/ApplicationCardItem";
import { candidateStatuses } from "../../../CandidatePage/utils/candidateStatuses";
import CompanyProgressOverview from "./components/CompanyProgressOverview/CompanyProgressOverview";
import skeletonStyles from "./styles/skeleton.module.css";
import noLogIllus from "../../../../assets/images/4380.jpg";
import { getTotalWorklogCountInOrganization, getWorklogDetailInOrganization } from "../../../../services/adminServices";
import useLoadLogOverviewData from "./hooks/useLoadLogOverviewData";


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const generateOptionObj = (title, position) => {
    return {
        responsive: true,
        plugins: {
            legend: {
                position: position ? position : 'top',
            },
            title: {
                display: true,
                text: title ?title : 'Chart',
            },
        },
    }
};

const AdminDashboard = ({ subAdminView }) => {
    const {
        dashboardDataLoaded, 
        setDashboardDataLoaded,
        applications,
        setApplications,
        applicationsLoaded,
        setApplicationsLoaded,
        jobs,
        setJobs,
        projectsLoading,
        projectsLoaded, 
        setProjectsLoaded,
        setProjectsLoading,
        setProjectsAdded,
        projectsAdded,
        subProjectsAdded,
        setSubProjectsAdded,
        setSubProjectsLoaded,
        subProjectsLoading,
        setSubProjectsLoading,
        totalWorklogCountInOrg,
        setTotalWorklogCountInOrg,
        dashboardLogDataForToday,
        setDashboardLogDataForToday,
        dashboardLogDataForMonth,
        setDashboardLogDataForMonth,
        totalWorklogCountInOrgLoading,
        setTotalWorklogCountInOrgLoading,
        totalWorklogCountInOrgLoaded,
        setTotalWorklogCountInOrgLoaded,
    } = useJobContext();
    const { 
        currentUser,
        allCompanyApplications,
        userRemovalStatusChecked,
    } = useCurrentUserContext();
    const navigate = useNavigate();
    const [ greeting, setGreeting ] = useState('');
    const defaultLogOverviewDataFilter = 'select';
    const [ logOverviewDataFilter, setLogOverviewDataFilter ] = useState(defaultLogOverviewDataFilter);
    const [ logOverviewDataLoading, setLogOverviewDataLoading ] = useState(false);

    useLoadAdminDashboardData(
        dashboardDataLoaded,
        currentUser,
        setProjectsAdded,
        setProjectsLoading,
        setProjectsLoaded,
        setSubProjectsLoading,
        setSubProjectsLoaded,
        setSubProjectsAdded,
        setJobs,
        setDashboardDataLoaded,
    )

    useLoadLogOverviewData(
        currentUser,
        logOverviewDataFilter,
        setLogOverviewDataLoading,
        dashboardLogDataForToday,
        setDashboardLogDataForToday,
        dashboardLogDataForMonth,
        setDashboardLogDataForMonth,
    )

    useEffect(() => {

        // set greeting
        const time = new Date().getHours();
        if (time < 10) return setGreeting("Good morning");
        if (time < 20) return setGreeting("Good day");
        
        setGreeting("Good evening");

    }, [])

    useEffect(() => {
        if (!applicationsLoaded) {
            if (!userRemovalStatusChecked) return;
            setApplications(allCompanyApplications);
            setApplicationsLoaded(true);
        }
    }, [userRemovalStatusChecked, allCompanyApplications])
    
    const handleLoadTotalLogCount = async () => {
        if (totalWorklogCountInOrgLoading) return
        
        setTotalWorklogCountInOrgLoading(true);

        try {
            const res = (await getTotalWorklogCountInOrganization(currentUser?.portfolio_info[0]?.org_id)).data;
            
            setTotalWorklogCountInOrgLoading(false);
            setTotalWorklogCountInOrg(res?.worklogs_count);
            setTotalWorklogCountInOrgLoaded(true);

        } catch (error) {
            setTotalWorklogCountInOrgLoading(false);            
        }
    }
    
    return <>
        <StaffJobLandingLayout
            adminView={true}
            subAdminView={subAdminView}
            adminAlternativePageActive={true}
            pageTitle={'Dashboard'}
            newSidebarDesign={true}
        >
            <section className={styles.admin__Dash}>
                <section className={styles.top__Nav__Content}>
                    <h2>
                        <span className={styles.user__Title}>Hello {currentUser?.userinfo?.first_name} {currentUser?.userinfo?.last_name},</span>
                        <span>{greeting}</span>
                    </h2>
                    <button
                        onClick={
                            subAdminView ? 
                                () => navigate('/add-job')
                            :
                            () => navigate('/add')
                        }
                    >
                        <AiOutlinePlus />
                        <span>Add</span>
                    </button>
                </section>
                <section className={styles.top__Stats__Wrap}>
                    <MainStatCard 
                        icon={<FaUsers />}
                        title={'Total Applications'}
                        dataLoading={!applicationsLoaded}
                        dataLoaded={applicationsLoaded}
                        data={applications?.length}
                        action={subAdminView ? null : '/all-applications'}
                    />
                    <MainStatCard 
                        icon={<MdOutlineWorkOutline />}
                        title={'Total Jobs'}
                        dataLoading={!dashboardDataLoaded}
                        dataLoaded={jobs?.length}
                        data={jobs.length}
                        action={'/jobs'}
                    />
                    <MainStatCard 
                        icon={<GoTasklist />}
                        title={'Total Projects'}
                        dataLoading={projectsLoading}
                        dataLoaded={projectsLoaded}
                        data={projectsAdded[0]?.project_list?.length}
                        action={'/projects'}
                    />
                    <MainStatCard 
                        icon={<ImStack />}
                        title={'Total Logs'}
                        action={'/logs'}
                        dataLoading={totalWorklogCountInOrgLoading}
                        dataLoaded={totalWorklogCountInOrgLoaded}
                        data={totalWorklogCountInOrg}
                        hasLoadingAction={true}
                        loadingAction={handleLoadTotalLogCount}
                    />
                </section>
                <section className={styles.stat__overview}>
                    <h2 className={styles.stat__mini__Title}>Logs Overview</h2>
                    <select 
                        value={logOverviewDataFilter} 
                        onChange={({ target }) => setLogOverviewDataFilter(target.value)}
                        className={styles.log__Filter}
                        defaultValue={defaultLogOverviewDataFilter}
                        disabled={logOverviewDataLoading ? true : false}
                    >
                        <option value={defaultLogOverviewDataFilter} disabled>Select time period</option>
                        <option value={'today'}>Today</option>
                        <option value={'this month'}>This Month</option>
                    </select>
                    {
                        !dashboardDataLoaded ? <div className={`${styles.project_Overview_Loading} ${skeletonStyles.skeleton}`}></div>
                        :
                        !(
                            logOverviewDataFilter === defaultLogOverviewDataFilter ||
                            logOverviewDataFilter === 'today' ||
                            logOverviewDataFilter === 'this month'
                        ) ? 
                            <></>
                        :
                        logOverviewDataFilter === defaultLogOverviewDataFilter ? <>
                            <img src={noLogIllus} className={styles.no__Log__Img} alt="" />
                            <p className={styles.no__Log__Content}>Select a time period to get detailed worklog insights.</p>
                        </>
                        :
                        logOverviewDataLoading ? <>
                            <p className={styles.no__Log__Content}>Crunching latest data for {logOverviewDataFilter}...</p>
                            <div className={`${styles.project_Overview_Loading} ${skeletonStyles.skeleton}`}></div> 
                        </>
                        :
                            logOverviewDataFilter === 'today' && dashboardLogDataForToday?.labels?.length < 1 ?
                        <>
                            <img src={noLogIllus} className={styles.no__Log__Img} alt="" />
                            <p className={styles.no__Log__Content}>No logs have been added {logOverviewDataFilter} yet.</p>
                        </> 
                        :
                            logOverviewDataFilter === 'this month' && dashboardLogDataForMonth?.labels?.length < 1 ?
                        <>
                            <img src={noLogIllus} className={styles.no__Log__Img} alt="" />
                            <p className={styles.no__Log__Content}>No logs have been added {logOverviewDataFilter} yet.</p>
                        </> 
                        :
                        <Bar 
                            options={generateOptionObj(`Log Overview for ${logOverviewDataFilter}`)} 
                            data={
                                logOverviewDataFilter === 'today' ?
                                    dashboardLogDataForToday
                                :
                                logOverviewDataFilter === 'this month' ?
                                    dashboardLogDataForMonth
                                :
                                {
                                    datasets: [],
                                    labels: []
                                }
                            } 
                        />
                    }
                </section>
                <section className={styles.bottom__Stats__Nav}>
                    <section className={styles.application__Wrap}>
                        <h2 className={styles.stat__mini__Title}>Recent Applications</h2>
                        <div className={styles.applications__WRap__Items}>
                            {
                                applicationsLoaded ?
                                    React.Children.toArray(applications?.slice(0, 4)?.map((application, index) => {
                                        return <ApplicationCardItem 
                                            application={application}
                                            greyJobCardColor={(index + 1) % 2 === 0 ? true : false}
                                        />
                                    }))
                                :
                                    <ApplicationCardItem 
                                        loading={!applicationsLoaded}
                                    />
                            }
                        </div>
                    </section>
                    <section className={styles.company__Wrap}>
                        <h2 className={styles.stat__mini__Title}>Company Overview</h2>
                        <div className={`${styles.company__Overview__Wrap} ${!dashboardDataLoaded ? skeletonStyles.skeleton : ''}`}>
                            {
                                !dashboardDataLoaded ? <>
                                    <div style={{ width: '100%', height: '10rem', borderRadius: 8}}></div>
                                </> :
                                <>
                                    <div>
                                        <h2 className={styles.comp__mini__Title}>Active jobs</h2>
                                        <CompanyProgressOverview 
                                            tooltipId={'active_jobs'}
                                            toolTipContent={`You currently have ${jobs?.filter(job => job.is_active)?.length} active jobs out of ${jobs?.length} jobs`}
                                            value={jobs?.length < 1 ? 0 : Number(jobs?.filter(job => job.is_active)?.length) / ( Number(jobs?.length) ) * 100}
                                        />
                                    </div>
                                    <div>
                                        <h2 className={styles.comp__mini__Title}>Active Applicants</h2>
                                        <CompanyProgressOverview 
                                            tooltipId={'active_users'}
                                            toolTipContent={`You currently have ${!applications ? 0 : applications?.filter(application => application.status === candidateStatuses.ONBOARDING)?.length} hired users out of ${!applications ? 0 : applications?.length} applications`}
                                            value={
                                                !applications ? 0 
                                                : 
                                                applications?.length < 1 ? 0 
                                                : 
                                                Number(applications?.filter(application => application.status === candidateStatuses.ONBOARDING)?.length) / ( Number(applications?.length) ) * 100
                                            }
                                        />
                                    </div>    
                                </>
                            }
                        </div>
                    </section>
                    <section className={styles.project__Wrap}>
                        <h2 className={styles.stat__mini__Title}>Project Overview</h2>
                        <div className={`${styles.project__item} ${projectsLoading ? skeletonStyles.skeleton : ''}`}>
                            <h3>{projectsLoading ? '' : projectsAdded[0]?.project_list?.length ? projectsAdded[0]?.project_list?.length : 0}</h3>
                            <p>{projectsLoading ? '' : 'total projects'}</p>
                        </div>
                        <div className={`${styles.project__item} ${styles.grey__Bg} ${subProjectsLoading ? skeletonStyles.skeleton : ''}`}>
                            <h3>{subProjectsLoading ? '' : subProjectsAdded?.reduce((a, b) => a + b.sub_project_list.length, 0)}</h3>
                            <p>{subProjectsLoading ? '' : 'total subprojects'}</p>
                        </div>
                    </section>
                </section>
            </section>
        </StaffJobLandingLayout>
    </>
}

export default AdminDashboard;