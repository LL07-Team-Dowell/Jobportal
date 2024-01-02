import { useNavigate } from "react-router-dom";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import styles from "./styles.module.css";
import { IoIosArrowBack } from "react-icons/io";
import React, { useEffect, useState } from "react";
import { formatDateForAPI } from "../../../../helpers/helpers";
import { IoFilterOutline } from "react-icons/io5";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { getAllCompanyUserSubProject, getWeeklyAgenda, getWorkLogsAddedUnderSubproject } from "../../../../services/commonServices";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { toast } from "react-toastify";
import { getSettingUserProject } from "../../../../services/hrServices";


const AdminAgendaPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useCurrentUserContext();

    const [agendaDetails, setAgendaDetails] = useState({
        "project": '',
        "sub_project": '',
        "week_start": formatDateForAPI(new Date()),
        "week_end": formatDateForAPI(new Date(new Date().setDate(new Date().getDate() + 7))),
    })
    const [projectsAssignedToLead, setProjectsAssignedToLead] = useState([]);
    const [allSubprojects, setAllSubprojects] = useState([]);
    const [subprojectsForProject, setSubprojectForProject] = useState([]);
    const [apiLimits, setApiLimits] = useState({
        start: 0,
        end: 50,
    })
    const [loading, setLoading] = useState(false);
    const [agendasFetchedPreviously, setAgendasFetchedPreviously] = useState(false);
    const [agendasFetched, setAgendasFetched] = useState([]);
    const [taskDetailsForPeriod, setTaskDetailsForPeriod] = useState([]);

    const handleAgendaDetailUpdate = (keyToUpdate, newVal) => {
        setAgendaDetails((prevDetails) => {
            return {
                ...prevDetails,
                [keyToUpdate]: newVal,
            }
        })
    }

    const calculateHours = (logsPassed) => {
        const hourGapBetweenLogs = logsPassed.map(log => {
            const [startTime, endTime] = [new Date(`${log.task_created_date} ${log.start_time}`), new Date(`${log.task_created_date} ${log.end_time}`)]
            if (startTime == 'Invalid Date' || endTime == 'Invalid Date') return 0

            const diffInMs = Math.abs(endTime - startTime);
            return diffInMs / (1000 * 60 * 60);
        });

        const totalHours = Number(hourGapBetweenLogs.reduce((x, y) => x + y, 0)).toFixed(2)
        return totalHours
    }

    useEffect(() => {
        getAllCompanyUserSubProject(currentUser.portfolio_info[0].org_id, currentUser.portfolio_info[0].data_type).then(res => {
            setAllSubprojects(res.reverse());
        }).catch(err => {
            console.log(err);
        })

    }, [])

    useEffect(() => {
        getSettingUserProject().then((res) => {
            const projectsGotten = res.data
                ?.filter(
                    (project) =>
                        project?.data_type === currentUser.portfolio_info[0].data_type &&
                        project?.company_id === currentUser.portfolio_info[0].org_id &&
                        project.project_list &&
                        project.project_list.every(
                            (listing) => typeof listing === "string"
                        )
                )
                ?.reverse()
            setProjectsAssignedToLead(projectsGotten);
        }).catch(err => {
            console.log('err fetching projects for project lead: ', err?.response?.data);
        })
    }, [])

    useEffect(() => {
        if (agendaDetails.project.length < 1) return setSubprojectForProject([]);

        const matchingSubprojectsForProject = allSubprojects.find(
            (item) => item.parent_project === agendaDetails.project
        )?.sub_project_list;

        if (!matchingSubprojectsForProject) return setSubprojectForProject([]);
        setSubprojectForProject(matchingSubprojectsForProject)

    }, [agendaDetails.project])

    const handleTrackAgenda = async (increaseLimits = false) => {
        if (loading) return

        if (agendaDetails.project.length < 1) return toast.info('Please select a project')
        if (agendaDetails.sub_project.length < 1) return toast.info('Please select a subproject')
        if (agendaDetails.week_start > agendaDetails.week_end) return toast.info('The start date of your agenda must be less than its end date')

        const differenceBetweenWeekStartAndEnd = (new Date(agendaDetails.week_end).getTime() - new Date(agendaDetails.week_start).getTime()) / (1000 * 60 * 60 * 24);
        if (differenceBetweenWeekStartAndEnd !== 7) return toast.info('The difference between the start and end date of your agenda must be exactly 7 days')

        const copyOfApiLimits = { ...apiLimits };

        if (increaseLimits) {
            copyOfApiLimits.start = apiLimits.end;
            copyOfApiLimits.end = apiLimits.end + 20;
        }

        setApiLimits(copyOfApiLimits);
        setLoading(true);

        try {
            const res = await Promise.all([
                getWeeklyAgenda(copyOfApiLimits.start, copyOfApiLimits.end, agendaDetails.sub_project.replaceAll(' ', '-'), agendaDetails.project, {}),
                getWorkLogsAddedUnderSubproject(
                    currentUser.portfolio_info[0].org_id,
                    agendaDetails.project,
                    agendaDetails.sub_project,
                    {
                        start_date: agendaDetails.week_start,
                        end_date: agendaDetails.week_end
                    }
                )
            ])

            setTaskDetailsForPeriod(res[1]?.data?.task_details);

            const currentAgendasFetched = agendasFetched.slice();
            const updatedAgendasListing = [
                ...new Map(
                    [
                        ...res[0].data.response
                            .filter(item =>
                                item.week_start === agendaDetails.week_start &&
                                item.week_end === agendaDetails.week_end &&
                                item.timeline
                            ),
                        ...currentAgendasFetched,
                    ].map((agenda) => [agenda._id, agenda])
                ).values()
            ]

            setAgendasFetched(updatedAgendasListing);
            setLoading(false);
            setAgendasFetchedPreviously(true);

            toast.success(res[0].data.message);
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error('Failed to get weekly agenda, please try again later')
        }
    }

    return <>
        <StaffJobLandingLayout
            adminView={true}
            newSidebarDesign={true}
            adminAlternativePageActive={true}
            pageTitle={'Agenda'}
        >
            <div className={styles.wrapper}>

                <p className={styles.hairline}>
                    <IoIosArrowBack
                        cursor={'pointer'}
                        onClick={() => navigate(-1)}
                    />
                    <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(-1)}
                    >
                        View
                    </span>
                    <span>
                        /
                    </span>
                    <span className={styles.active__Item}>Track Weekly Agenda</span>
                </p>
                <div className={styles.custom_hr}></div>
                <p className={styles.track__Agenda__Title}>Track your weekly agenda's</p>
                <div className={styles.agenda__Mid__Content}>
                    <label>
                        <span>Project</span>
                        <div className={styles.select__item}>
                            <IoFilterOutline />
                            <select
                                value={agendaDetails.project}
                                onChange={({ target }) => handleAgendaDetailUpdate('project', target.value)}
                                defaultValue={''}
                            >
                                <option value={''} disabled>Select project</option>
                                {projectsAssignedToLead.map(item => (
                                    item.project_list.map(project => (
                                        <option key={project} value={project}>{project}</option>
                                    ))
                                ))}
                            </select>
                        </div>
                    </label>
                    <label>
                        <span>Subproject</span>
                        <div className={styles.select__item}>
                            <IoFilterOutline />
                            <select
                                value={agendaDetails.sub_project}
                                onChange={({ target }) => handleAgendaDetailUpdate('sub_project', target.value)}
                                defaultValue={''}
                            >
                                <option value={''} disabled>Select subproject</option>
                                {
                                    React.Children.toArray(subprojectsForProject.map(item => {
                                        return <option value={item}>{item}</option>
                                    }))
                                }
                            </select>
                        </div>
                    </label>
                    <label>
                        <span>Start Date - End Date</span>
                        <div className={styles.select__item}>
                            {/* <BsCalendar2Date /> */}
                            <div className={styles.date__Select}>
                                <input
                                    type="date"
                                    className={styles.date__Input}
                                    value={agendaDetails.week_start}
                                    name="week_start"
                                    onChange={({ target }) => handleAgendaDetailUpdate(target.name, target.value)}
                                />
                                <span>-</span>
                                <input
                                    type="date"
                                    className={styles.date__Input}
                                    value={agendaDetails.week_end}
                                    name="week_end"
                                    onChange={({ target }) => handleAgendaDetailUpdate(target.name, target.value)}
                                />
                            </div>
                        </div>
                    </label>

                    <button
                        className={styles.track__Btn}
                        onClick={() => handleTrackAgenda()}
                        disabled={loading ? true : false}
                    >
                        {
                            loading ?
                                <LoadingSpinner width={'1.3rem'} height={'1.3rem'} color={'#fff'} />
                                :
                                'Track'
                        }
                    </button>
                </div>
                {
                    agendasFetchedPreviously &&
                    <div className={styles.load__More__Wrap}>
                        <span>Did not find agenda you are looking for?</span>
                        <button
                            className={`${styles.track__Btn} ${styles.load__Btn}`}
                            onClick={() => handleTrackAgenda(true)}
                            disabled={loading ? true : false}
                        >
                            {
                                loading ?
                                    <LoadingSpinner width={'1.3rem'} height={'1.3rem'} color={'#fff'} />
                                    :
                                    'Load more'
                            }
                        </button>
                    </div>
                }

                <div className={styles.track__Agendas__Wrap}>
                    {
                        React.Children.toArray(agendasFetched.map(agenda => {
                            const timelinesTodayOrBeforeToday = agenda.timeline.filter(item => new Date(item.timeline_start) <= new Date('2023-11-25')).length;
                            const allTimelines = agenda.timeline.length;

                            const timelinesReached = Number((timelinesTodayOrBeforeToday / allTimelines) * 100).toFixed();
                            const timeLineRemaining = 100 - timelinesReached;

                            return <div className={styles.track__Agenda__Item__Wrap}>
                                <div className={styles.progress__Wrap}>
                                    <div className={styles.active}>
                                        <div className={styles.inner__Marker}></div>
                                    </div>
                                    <div className={styles.progress}>
                                        <div className={styles.active__Progress} style={{ height: `${timelinesReached}%` }}></div>
                                        <div style={{ height: `${timeLineRemaining}%` }}></div>
                                    </div>
                                    <div className={styles.inactive}>
                                        <div className={styles.inner__Marker}></div>
                                    </div>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <div className={styles.track__Agenda__Item}>
                                        <div>
                                            <p className={styles.date__Title}>
                                                {new Date(agenda.week_start).getDate()} {new Date(agenda.week_start).toLocaleString('en-us', { month: 'short' })}, {`${new Date(agenda.week_start).getFullYear()}`.slice(-2)}
                                            </p>
                                            <p className={styles.stat__Subtitle}>Start</p>
                                        </div>
                                        <div>
                                            <p className={styles.item__Title}>{agenda.agenda_title}</p>
                                            <p className={styles.item__Subtitle}>{agenda.sub_project} . 0/{agenda.total_time} hrs</p>
                                        </div>
                                    </div>
                                    {
                                        React.Children.toArray(agenda.timeline.map(item => {
                                            return <>
                                                <div className={styles.track__Agenda__Item}>
                                                    <div>
                                                        <p className={styles.item__Date__Title}>
                                                            {new Date(item.timeline_start).getDate()} {new Date(item.timeline_start).toLocaleString('en-us', { month: 'short' })} - {new Date(item.timeline_end).getDate()} {new Date(item.timeline_end).toLocaleString('en-us', { month: 'short' })}
                                                        </p>
                                                        <p className={styles.stat__Subtitle}>
                                                            {
                                                                item.timeline_start === formatDateForAPI(new Date()) ? <>
                                                                    <span className={styles.agenda__in__Progress}>In progress</span>
                                                                </>
                                                                    :
                                                                    new Date(item.timeline_start) < new Date() ? <>
                                                                        <span className={styles.agenda__To__Do}>To do</span>
                                                                    </>
                                                                        :
                                                                        calculateHours(
                                                                            taskDetailsForPeriod
                                                                                .filter(
                                                                                    log =>
                                                                                        log.task_created_date === item.timeline_start ||
                                                                                        log.task_created_date === item.timeline_end
                                                                                )
                                                                        ) <= item.hours ?
                                                                            <>
                                                                                <span className={styles.agenda__On__time}>On time</span>
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <span className={styles.agenda__Overdue}>Over Due</span>
                                                                            </>
                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className={styles.subtask__Item}>{item.subtask}</p>
                                                        <p className={styles.item__Subtitle}>{agenda.agenda_title}</p>
                                                    </div>
                                                </div>
                                            </>
                                        }))
                                    }
                                    <div className={styles.track__Agenda__Item}>
                                        <div>
                                            <p className={styles.date__Title}>
                                                {new Date(agenda.week_end).getDate()} {new Date(agenda.week_end).toLocaleString('en-us', { month: 'short' })}, {`${new Date(agenda.week_end).getFullYear()}`.slice(-2)}
                                            </p>
                                            <p className={styles.stat__Subtitle}>End</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }))
                    }
                </div>
            </div>
        </StaffJobLandingLayout>
    </>
}

export default AdminAgendaPage;