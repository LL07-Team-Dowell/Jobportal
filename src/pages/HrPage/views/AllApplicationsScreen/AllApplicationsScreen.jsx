import { useEffect } from "react";
import styles from './styles.module.css';
import React, { useState } from "react";
import Select from "react-select";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { ArrowBackIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { getCandidateApplicationsForHr, getSettingUserProject } from "../../../../services/hrServices";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import { changeToTitleCase } from "../../../../helpers/helpers";
import { JOB_APPLICATION_CATEGORIES } from "../../../CandidatePage/utils/jobCategories";
import { candidateStatuses } from "../../../CandidatePage/utils/candidateStatuses";
import { createArrayWithLength } from "../../../AdminPage/views/Landingpage/LandingPage";
import { useHrJobScreenAllTasksContext } from "../../../../contexts/HrJobScreenAllTasks";
import FullApplicationCardItem from "../../component/FullApplicationCardItem/FullApplicationCardItem";


const HrAllApplicationsScreen = () => {
    const {
        applications,
        setApplications,
        applicationsLoaded,
        setApplicationsLoaded,
        projectsAdded,
        setProjectsAdded,
        projectsLoaded,
        setProjectsLoaded,
        projectsLoading,
        setProjectsLoading,
    } = useHrJobScreenAllTasksContext();
    const { currentUser } = useCurrentUserContext();
    const [ searchValue, setSearchValue ] = useState('');
    const [ projectAssignedFilter, setProjectAssignedFilter ] = useState([]);
    const [ currentApplicationCategory, setCurrentApplicationCategory ] = useState([]);
    const [ statusFilter, setStatusFilter ] = useState('All');
    const [cardPagination, setCardPagination] = useState(0);
    const [cardIndex, setCardIndex] = useState(0);
    const [cardGroupNumber, setCardGroupNumber] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!applicationsLoaded) {
            getCandidateApplicationsForHr(currentUser?.portfolio_info[0]?.org_id).then(res => {
                const applicationsFetched = res?.data?.response?.data?.filter(
                    (item) => currentUser?.portfolio_info[0]?.data_type === item.data_type
                )?.reverse()

                setApplications(applicationsFetched);
                setApplicationsLoaded(true);
            }).catch(err => {
                console.log('Failed to get applications for admin');
            })
        }
        if (!projectsLoaded) {
            setProjectsLoading(true);

            getSettingUserProject().then(res => {
                const projectsGotten = res?.data
                ?.filter(
                  (project) =>
                    project?.data_type === currentUser?.portfolio_info[0]?.data_type &&
                    project?.company_id === currentUser?.portfolio_info[0]?.org_id &&
                    project.project_list &&
                    project.project_list.every(
                      (listing) => typeof listing === "string"
                    )
                )
                ?.reverse()
        
                if (projectsGotten.length > 0) {
                    setProjectsAdded(projectsGotten);
                }
                
                setProjectsLoading(false);
                setProjectsLoaded(true);

            }).catch(err => {
                console.log('Failed to get projects for admin');
                setProjectsLoading(false);
            })
        }
    }, [])

    const incrementStepPagination = (steps, length) => {
        if (steps + 1 <= length) {
            if (steps + cardPagination !== length) {
                setCardPagination(cardPagination + 1);
            }
        }
    };

    const decrementStepPagination = () => {
        if (cardPagination !== 0) {
            setCardPagination(cardPagination - 1);
        }
    };

    return <>
        <StaffJobLandingLayout
            hrView={true}
        >
            <div className={styles.wrapper}>
                <div className={styles.header__item}>
                    <div className={styles.header__Content}>
                        <h2>Users</h2>
                    </div>
                    <SearchBar
                        searchValue={searchValue}
                        handleSearchChange={setSearchValue}
                        placeholder={'Search user'}
                    />
                </div>
                <div className={styles.applications__Filter}>
                    <div className={styles.item__Filter__Wrap}>
                        <p>Filter by status</p>
                        <Select 
                            value={{ label: changeToTitleCase(statusFilter.replace('_', ' ')), value: statusFilter }}
                            options={[
                                { label: 'All', value: 'All'},
                                { label: 'Pending', value: 'Pending'},
                                { label: 'Guest Pending', value: 'Guest_Pending'},
                                { label: 'Shortlisted', value: 'shortlisted'},
                                { label: 'Selected', value: 'selected'},
                                { label: 'Hired', value: 'hired'},
                                { label: 'Rejected', value: 'Rejected'},
                                { label: 'Leave', value: 'Leave'},
                                { label: 'Removed', value: 'Removed'},
                            ]}
                            onChange={(val) => {
                                    setStatusFilter(val.value);
                                    setCardPagination(0);
                                    setCardIndex(0);
                                }
                            }
                            className={styles.item__Filter}
                        />
                    </div>
                    <div className={styles.item__Filter__Wrap}>
                        <p>Filter by project</p>
                        <Select 
                            options={
                                projectsLoaded && projectsAdded[0] && projectsAdded[0]?.project_list ?
                                    [
                                        ...projectsAdded[0]?.project_list?.sort((a, b) => a.localeCompare(b))?.map(project => { return { label: project, value: project }})
                                    ]
                                :
                                []
                            }
                            isMulti={true}
                            onChange={(val) => setProjectAssignedFilter(val.map(item => item.value))}
                            className={styles.item__Filter}
                        />
                    </div>
                    <div className={styles.item__Filter__Wrap}>
                        <p>Filter by category</p>
                        <Select 
                            options={
                                [
                                    ...JOB_APPLICATION_CATEGORIES.map(category => {  return { label: category, value: category } }) 
                                ]
                            }
                            isMulti={true}
                            onChange={(val) => setCurrentApplicationCategory(val.map(item => item.value))}
                            className={styles.item__Filter}
                        />
                    </div>
                </div>
                <div className={styles.applications__Wrap}>
                    {
                        !applicationsLoaded ? <div 
                            style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                width: '100%',
                            }}
                        >
                            <LoadingSpinner width={'1.5rem'} height={'1.5rem'} />
                            <p>Loading applications...</p>
                        </div>
                        :
                        React.Children.toArray(
                            applications
                            ?.filter(application => {
                                if (currentApplicationCategory.length < 1) return true
                                return currentApplicationCategory.includes(application.job_category)
                            })
                            .filter(application => {
                                if (statusFilter === 'All') return true
                                return application.status === statusFilter
                            })
                            .filter(application => {
                                if (projectAssignedFilter.length < 1) return true
                                return Array.isArray(application.project) && application.project.find(item => projectAssignedFilter.includes(item))
                            })
                            .filter(application => {
                                if (searchValue.length < 1) return true
                                return application?.applicant?.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
                            })
                            ?.slice(cardGroupNumber, cardGroupNumber + 8)
                            .map(application => {
                                return <FullApplicationCardItem
                                    application={application} 
                                    activeStatus={application.status === candidateStatuses.ONBOARDING}
                                />
                            })
                        )
                    }
                </div>
                <div className='JobsChanger_containter'>
                    <button
                        onClick={() =>
                            decrementStepPagination()
                        }
                    >
                        <IoIosArrowBack />
                    </button>

                    {createArrayWithLength(
                        Math.ceil(
                            applications
                            ?.filter(application => {
                                if (currentApplicationCategory.length < 1) return true
                                return currentApplicationCategory.includes(application.job_category)
                            })
                            .filter(application => {
                                if (statusFilter === 'All') return true
                                return application.status === statusFilter
                            })
                            .filter(application => {
                                if (projectAssignedFilter.length < 1) return true
                                return Array.isArray(application.project) && application.project.find(item => projectAssignedFilter.includes(item))
                            })
                            .filter(application => {
                                if (searchValue.length < 1) return true
                                return application?.applicant?.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
                            })?.length / 8
                        )
                    )
                    .slice(
                        cardPagination,
                        cardPagination + 8
                    )
                    .map((s, index) => (
                        <button
                        className={s !== cardIndex ? "active" : "desactive"}
                        onClick={() => {
                            setCardGroupNumber(index * 8);
                            setCardIndex(index);
                        }}
                        key={`${s}_button`}
                        >
                        {s + 1}
                        </button>
                    ))}

                    <button
                        onClick={() =>
                            incrementStepPagination(
                                8,
                                Math.ceil(
                                    applications
                                    ?.filter(application => {
                                        if (currentApplicationCategory.length < 1) return true
                                        return currentApplicationCategory.includes(application.job_category)
                                    })
                                    .filter(application => {
                                        if (statusFilter === 'All') return true
                                        return application.status === statusFilter
                                    })
                                    .filter(application => {
                                        if (projectAssignedFilter.length < 1) return true
                                        return Array.isArray(application.project) && application.project.find(item => projectAssignedFilter.includes(item))
                                    })
                                    .filter(application => {
                                        if (searchValue.length < 1) return true
                                        return application?.applicant?.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
                                    })?.length / 8
                                )
                            )
                        }
                    >
                        <IoIosArrowForward />
                    </button>
                </div>
            </div>
        </StaffJobLandingLayout>
    </>
}

export default HrAllApplicationsScreen;