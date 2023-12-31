import { AiFillCheckCircle, AiOutlineArrowRight } from "react-icons/ai";
import { changeToTitleCase, formatDateAndTime, getDaysDifferenceFromPresentDate } from "../../helpers/helpers";
// import { jobKeys } from "../../pages/AdminPage/utils/jobKeys";
import { IoMdTime } from "react-icons/io";
import "./style.css";
import { mutableNewApplicationStateNames } from "../../contexts/NewApplicationContext";
import { BiTimeFive } from "react-icons/bi";
import { IoAlertCircleOutline, IoCheckmarkCircle } from "react-icons/io5";
import { Link } from "react-router-dom";
import { HiOutlineExternalLink } from "react-icons/hi";
import { Tooltip } from "react-tooltip";
import { useState } from "react";
import { useCurrentUserContext } from "../../contexts/CurrentUserContext";
import { useEffect } from "react";
import { FaCircle } from "react-icons/fa";


const JobCard = ({
    job,
    subtitle,
    candidateViewJob,
    disableActionBtn,
    buttonText,
    handleBtnClick,
    showCandidateAppliedJob,
    showCandidateDeclinedJob,
    showCandidateInterview,
    guestUser,
    interviewDetails,
    viewJobApplicationDetails,
    applicationsCount,
    candidateCardView,
    candidateData,
    jobAppliedFor,
    taskView,
    className,
    showOnboardingInfo,
    externalLinkingEnabled,
    externalLink,
    showIndicatorForHR,
}) => {
    // console.log(job);
    const id = crypto.randomUUID();
    const [link, setLink] = useState(null);
    const { currentUser } = useCurrentUserContext();

    useEffect(() => {
        if (
            !taskView ||
            !externalLink ||
            !externalLinkingEnabled
        ) return setLink(null);

        const [
            session_id,
            portfolio_id,
        ] = [
                sessionStorage.getItem('session_id'),
                sessionStorage.getItem('portfolio_id'),
            ]

        if (currentUser?.settings_for_profile_info) return setLink(`${window.location.origin}/Jobportal/#/?session_id=${session_id}&id=${portfolio_id}&redirect_url=${externalLink}`)

        setLink(`${window.location.origin}/Jobportal/#/?session_id=${session_id}&redirect_url=${externalLink}`)

    }, [externalLink, externalLinkingEnabled, taskView])

    return <div className={`job__Card__Container ${className ? className : ''}`}>
        <div className="job__Card__Title__Info">
            {
                link &&
                <>
                    <Link
                        className="external__Link"
                        to={link}
                        target="_blank"
                        rel="noreferrer noopener"
                        data-tooltip-id={id}
                        data-tooltip-content={'Open in new tab'}
                    >
                        <HiOutlineExternalLink />
                    </Link>
                    <Tooltip
                        id={id}
                    />
                </>
            }
            <h2 style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <b>
                    {changeToTitleCase(
                        job ?
                            job.job_title
                            :
                            candidateData ?
                                taskView ?
                                    candidateData.applicantName ?
                                        candidateData.applicantName
                                        :
                                        candidateData.applicant
                                    :
                                    candidateData.applicant
                                :
                                ""
                    )}
                </b>
                {
                    showIndicatorForHR &&
                    <div>
                        <FaCircle color='#005734' size={'0.7rem'} />
                    </div>
                }
            </h2>
            {subtitle && <span className="subtitle__Item"><span>{subtitle}</span><span>- UX Living Lab</span></span>}
        </div>
        {
            candidateViewJob &&
            <div className="job__Details__Info">
                <div className="detail__Item">
                    <span className="dot"></span>
                    <span className="job__Highlight__Item">Duration: </span>
                    <span>{job.time_interval.length > 20 ? job.time_interval.slice(0, 20) + "..." : job.time_interval}</span>
                </div>
                <div className="vertical__Seperator"></div>
                <div className="detail__Item">
                    <span className="dot"></span>
                    <span className="job__Highlight__Item">Skills: </span>
                    <span>{job.skills.length > 18 ? job.skills.slice(0, 18) + "..." : job.skills}</span>
                </div>
                <div className="vertical__Seperator"></div>
                <div className="detail__Item">
                    <span className="dot"></span>
                    <span className="job__Highlight__Item">Pay: </span>
                    <span>
                        {
                            job.payment ?
                                `${job.payment}${job.paymentInterval ? ' / ' + job.paymentInterval : ""}`
                                :
                                "Not specified"
                        }
                    </span>
                </div>
            </div>
        }
        {
            showCandidateAppliedJob &&
            <div className="job__Details__Info mt__5">
                <div className="detail__Item">
                    <IoMdTime className="status__Icon" />
                    {/* <span>Applied {getDaysDifferenceFromPresentDate(job.others[mutableNewApplicationStateNames.others_date_applied])} {getDaysDifferenceFromPresentDate(job.others[mutableNewApplicationStateNames.others_date_applied]) > 1 ? 'days' : 'day'} ago</span> */}
                    <span>Applied {getDaysDifferenceFromPresentDate(candidateData.application_submitted_on)} {getDaysDifferenceFromPresentDate(candidateData.application_submitted_on) > 1 ? 'days' : 'day'} ago</span>
                </div>
                <div className="vertical__Seperator lg"></div>
                <div className="detail__Item">
                    <IoMdTime className="status__Icon" />
                    <span>Application Submitted</span>
                </div>
            </div>
        }
        {
            showCandidateInterview &&
            <div className="job__Details__Info mt__5">
                <div className="detail__Item">
                    <IoMdTime className="status__Icon" />
                    <span>Application Approved</span>
                </div>
                <div className="vertical__Seperator lg"></div>
                <div className="detail__Item">
                    <AiFillCheckCircle className="status__Icon green__Color" />
                    <span className="job__Highlight__Item">{job.status === "Pending" ? "Join discord for interview" : "Application sent to teamlead"}</span>
                    <br />
                    <span>{guestUser ? 'Interview to be scheduled' : `${formatDateAndTime(interviewDetails.application_submitted_on)}`}</span>
                </div>
            </div>
        }
        {
            showCandidateDeclinedJob &&
            <div className="job__Details__Info mt__5">
                <div className="detail__Item">
                    <span className="dot"></span>
                    <span className="job__Highlight__Item">Duration: </span>
                    <span>6 months</span>
                </div>
                <div className="vertical__Seperator lg"></div>
                <div className="detail__Item">
                    <span className="dot"></span>
                    <span className="job__Highlight__Item">Skills: </span>
                    <span>{job.skills.length > 18 ? job.skills.slice(0, 18) + "..." : job.skills}</span>
                </div>
            </div>
        }
        {
            viewJobApplicationDetails &&
            <div className="job__Details__Info">
                <div className="detail__Item">
                    <BiTimeFive className="status__Icon" />
                    <span>Open {getDaysDifferenceFromPresentDate(job.created_on)} {getDaysDifferenceFromPresentDate(job.created_on) ? "days" : "day"} ago</span>
                </div>
                <div className="vertical__Seperator"></div>
                <div className="detail__Item">
                    <IoAlertCircleOutline className="status__Icon" />
                    <span>{applicationsCount ? applicationsCount : 0} applications received</span>
                </div>
            </div>
        }
        {
            candidateCardView && candidateData && !taskView &&
            <div className="job__Details__Info">
                <div className="detail__Item full__Width">
                    <BiTimeFive className="status__Icon" />
                    <span>Applied {getDaysDifferenceFromPresentDate(candidateData.application_submitted_on)} {getDaysDifferenceFromPresentDate(candidateData.application_submitted_on) ? "days" : "day"} ago</span>
                </div>
                <div className="vertical__Seperator"></div>
                <div className="detail__Item full__Width">
                    <IoAlertCircleOutline className="status__Icon" />
                    <span>Applied as {jobAppliedFor ? jobAppliedFor : ""}</span>
                </div>
                {
                    showOnboardingInfo && <>
                        <div className="vertical__Seperator"></div>
                        <div className="detail__Item full__Width">
                            <IoCheckmarkCircle className="status__Icon" />
                            <span>Onboarded {getDaysDifferenceFromPresentDate(candidateData.onboarded_on)} {getDaysDifferenceFromPresentDate(candidateData.onboarded_on) ? "days" : "day"} ago</span>
                        </div>
                    </>
                }
            </div>
        }
        {
            candidateCardView && candidateData && taskView &&
            <div className="job__Details__Info task__View">
                <div className="detail__Item">
                    <span className="job__Highlight__Item">Description: </span>
                    <span>{candidateData.task ? candidateData.task.length > 42 ? candidateData.task.slice(0, 43) + "..." : candidateData.task : "Log"}</span>
                </div>
                <div className="detail__Item">
                    <span className="job__Highlight__Item">Submitted on: </span>
                    <span>{formatDateAndTime(candidateData.task_created_date)}</span>
                </div>
            </div>
        }

        {/* <button disabled={disableActionBtn} className={`cta__Button ${candidateCardView && candidateData ? "rel" : ''}`} onClick={() => handleBtnClick(job ? job : candidateData ? candidateData : null)}>
            <span>{buttonText ? buttonText : "Apply"}</span>
            <AiOutlineArrowRight />
        </button> */}
        <button disabled={disableActionBtn} className={`cta__Button ${candidateCardView && candidateData ? "rel" : ''}`} onClick={() => handleBtnClick(job ? job : candidateData ? candidateData : null)}>
            {
                buttonText === "Discord" ?
                    job.status === "Pending" ? "Discord" : "View"
                    : <span>{buttonText ? buttonText : "Apply"}</span>

            }
            <AiOutlineArrowRight />
        </button>
    </div>

}

export default JobCard;