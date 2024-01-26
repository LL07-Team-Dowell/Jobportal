import React from "react";
import StaffJobLandingLayout from "../../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { PageUnderConstruction } from "../../../../UnderConstructionPage/ConstructionPage";
import Calendar from "react-calendar";
import './style.css';
import { getSettingUserProject } from "../../../../../services/hrServices";
import { useCurrentUserContext } from "../../../../../contexts/CurrentUserContext";
import { useState, useEffect } from "react";
import { formatDateForAPI } from "../../../../../helpers/helpers";
import { getAllOnBoardedCandidate } from "../../../../../services/candidateServices";
import Avatar from "react-avatar";
import LoadingSpinner from "../../../../../components/LoadingSpinner/LoadingSpinner";
import { FaCircleCheck } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { getAllEvents } from "../../../../../services/hrServices";
import { addAttendance } from "../../../../../services/hrServices";
import { toast } from "react-toastify";

const AttendanceUpdatePage = () => {
    const navigate = useNavigate();
    const { currentUser } = useCurrentUserContext();
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [usersInSelectedProject, setUsersInSelectedProject] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [attendanceStates, setAttendanceStates] = useState([]);
    const [eventNames, setEventNames] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState("");
    const [usersPresent, setUsersPresent] = useState([]);
    const [usersAbsent, setUsersAbsent] = useState([]);
    const [isAttendanceUpdated, setIsAttendanceUpdated] = useState(false);
    // const [isPresent, setIsPresent] = useState(false);
    // const companyId = "6385c0f18eca0fb652c94561";

    const today = new Date();
    const mondayOfThisWeek = today.getDay() === 0 ?
        new Date(new Date(today.setDate(today.getDate() - 6)).setHours(0, 0, 0, 0))
        :
        new Date(new Date(today.setDate(today.getDate() - today.getDay() + 1)).setHours(0, 0, 0, 0));
    const sundayOfNextWeek = new Date(new Date().setDate(mondayOfThisWeek.getDate() + 6));

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = (await getSettingUserProject()).data;
                const companyProjects = data.filter(
                    (project) =>
                        project.company_id === currentUser?.portfolio_info[0]?.org_id &&
                        project.data_type === currentUser?.portfolio_info[0]?.data_type
                ).reverse();
                if (companyProjects.length > 0) {
                    const projectList = companyProjects[0].project_list || [];
                    setProjects(projectList);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, []);

    const dataForFetchingEvents = {
        company_id: currentUser?.portfolio_info[0].org_id,
    }

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = (await getAllEvents(dataForFetchingEvents)).data.data;
                const eventNamesList = data.map(event => event.event_name);
                setEventNames(eventNamesList);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        setIsLoading(true);
        setAttendanceStates([]);
        setUsersInSelectedProject([]);
        setUsersPresent([]);
        // currentUser?.portfolio_info[0].org_id
        getAllOnBoardedCandidate(currentUser?.portfolio_info[0].org_id).then(res => {
            const onboardingCandidates = res?.data?.response?.data;
            const hiredCandidates = onboardingCandidates.filter(candidate => candidate.status === 'hired');

            const candidatesInSelectedProject = hiredCandidates.filter(candidate =>
                candidate.project && candidate.project.includes(selectedProject)
            );

            const options = candidatesInSelectedProject.map(candidate => candidate.applicant);
            setUsersInSelectedProject(options);
            setUsersAbsent(options);
            setIsLoading(false);
            // console.log(">>>>>>>>>>>>>>>>", options.length);
        }).catch(err => {
            console.log('onboarded failed to load');
        })
    }, [selectedProject]);

    const handleProjectChange = async (event) => {
        const projectId = event.target.value;
        setSelectedProject(projectId);
    };

    const handleDateChange = (date) => {
        // console.log(">>>>>>>>>>>>>>>>",formatDateForAPI(date));
        setSelectedDate(formatDateForAPI(date));
    };

    const handleAttendanceChange = (index) => {
        const updatedAttendanceStates = [...attendanceStates];
        updatedAttendanceStates[index] = !updatedAttendanceStates[index];
        setAttendanceStates(updatedAttendanceStates);

        const user = usersInSelectedProject[index];
        if (updatedAttendanceStates[index]) {
            setUsersPresent(prevUsers => [...prevUsers, user]);
            setUsersAbsent(prevUsers => prevUsers.filter(u => u !== user));
        } else {
            setUsersAbsent(prevUsers => [...prevUsers, user]);
            setUsersPresent(prevUsers => prevUsers.filter(u => u !== user));
        }
    };

    const dataToPost = {
        "user_present": usersPresent,
        "user_absent": usersAbsent,
        "date_taken": selectedDate,
        "company_id": currentUser?.portfolio_info[0]?.org_id,
        "meeting": selectedEvent,
        "project": selectedProject,
        "data_type": "Real_Data",
    }
    const handleUpdateClick = async () => {
        if (!selectedDate) {
            return toast.warn('Please select the date');
        } else if (!selectedEvent) {
            return toast.warn('Please select an event ');
        } else {
            setIsAttendanceUpdated(true);
        }
        await addAttendance(dataToPost)
            .then(() => {
                toast.success('Attendance Updated Successfully');
            })
            .catch((error) => {
                toast.error('Unable to update Attendance');
            });
        setIsAttendanceUpdated(false);
    };
    // console.log("dataaaa>>>>>>>", dataToPost);
    return (
        <StaffJobLandingLayout
            hrView={true}
            hideSearchBar={true}
            pageTitle={'Attendance'}
        >
            <div className="att_title"><div className="back_icon" onClick={() => navigate(-1)}><IoChevronBack /></div><h3>Update Attendance</h3></div>
            <div className="upd_att_wrap">
                <div className="att_upd_calendar">
                    <div className="upd_calendar">
                        <p>Select Date:</p>
                        <Calendar minDate={mondayOfThisWeek} maxDate={sundayOfNextWeek} onChange={handleDateChange} className="react-calendar" />
                    </div>
                </div>
                <div className="att_upd_candidates">
                    <div className="att_upd_input">
                        <div className="att_upd_select">
                            <label>
                                <span>Event</span>
                                <select
                                    value={selectedEvent}
                                    onChange={(e) => setSelectedEvent(e.target.value)}
                                >
                                    <option value="">Select an Event</option>
                                    {
                                        eventNames.map((event, index) => (
                                            <option key={index} value={event}>
                                                {event}
                                            </option>
                                        ))}
                                </select>
                            </label>
                        </div>
                        <div className="att_upd_select">
                            <label>
                                <span>Project</span>
                                <select
                                    value={selectedProject}
                                    onChange={handleProjectChange}
                                >
                                    <option value="">Select a Project</option>
                                    {
                                        projects.map((project, index) => (
                                            <option key={index} value={project}>
                                                {project}
                                            </option>
                                        ))}
                                </select>
                            </label>
                        </div>
                    </div>
                    {
                        (isLoading && projects.length !== 0) ? (
                            <div className="loading_users">
                                <p>Crunching user(s):</p>
                                <LoadingSpinner width={"1.2rem"} height={"1.2rem"} />
                            </div>
                        ) : usersInSelectedProject.length === 0 ? (
                            selectedProject ? (
                                <div className="loading_users">
                                    <p>{`No user(s) found in ${selectedProject}`}</p>
                                </div>
                            ) : (
                                <></>
                            )
                        ) :
                            <>

                                {
                                    usersInSelectedProject.length > 0 &&
                                    (
                                        <>
                                            <div className="update_att">
                                                <p>Candidates in selected project:</p>
                                                <button onClick={handleUpdateClick}>{isAttendanceUpdated ? <><LoadingSpinner width={"1rem"} height={"1rem"} /></> : <>Update</>}</button>
                                            </div>
                                            <div className="user_boxes">
                                                {usersInSelectedProject.map((user, index) => (
                                                    <div key={index} className="user_box">
                                                        <div className="mark_att" onClick={() => handleAttendanceChange(index)}>
                                                            {attendanceStates[index] ? <FaCircleCheck className="present" /> : <MdCancel className="absent" />}
                                                        </div>
                                                        <Avatar
                                                            name={user[0]}
                                                            round={true}
                                                            size='6rem'
                                                            color="#005734"
                                                        />
                                                        <h6>{user}</h6>
                                                        <b>{selectedProject}</b>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )
                                }
                            </>
                    }
                </div>
            </div>
        </StaffJobLandingLayout>
    );
}
export default AttendanceUpdatePage;