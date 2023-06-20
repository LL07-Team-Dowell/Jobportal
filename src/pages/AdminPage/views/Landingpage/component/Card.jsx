import React, { useEffect, useState } from "react";
import arrowright from "../assets/arrowright.svg";
import { AiOutlineClockCircle } from "react-icons/ai";
import { CgDanger } from "react-icons/cg";
import { RiEdit2Fill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import "./index.scss";
import axios from "axios";
import LittleLoading from "../../../../CandidatePage/views/ResearchAssociatePage/littleLoading";
import {
  deleteJob,
  getJobsFromAdmin,
  updateJob,
} from "../../../../../services/adminServices";
import { useCurrentUserContext } from "../../../../../contexts/CurrentUserContext";
import { useJobContext } from "../../../../../contexts/Jobs";
import { set } from "date-fns";
const style = {
  fontSize: "1.2rem",
  color: "#7C7C7C",
};
const Card = ({
  company_id,
  created_on,
  job_number,
  skills,
  job_title,
  is_active,
  _id,
  jobs,
  setJobs,
  newly_created,
  setShowOverlay,
}) => {
  const { list } = useJobContext();
  const navigate = useNavigate();

  const { currentUser } = useCurrentUserContext();
  // console.log(currentUser.portfolio_info[0].org_id)
  // console.log({job_number})
  const [number, setnumber] = useState(0);
  useEffect(() => {
    setnumber(list.filter((j) => j.job_number === job_number).length);
  }, [jobs]);
  const date = () => {
    const givenDate = new Date(created_on);
    const timeDiff = new Date().getTime() - givenDate.getTime();
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(timeDiff / 1000 / 60);
    const hours = Math.floor(timeDiff / 1000 / 60 / 60);
    const days = Math.floor(timeDiff / 1000 / 60 / 60 / 24);
    let timeAgo;

    if (days > 0) {
      timeAgo = days + " day(s) ago";
    } else if (hours > 0) {
      timeAgo = hours + " hour(s) ago";
    } else if (minutes > 0) {
      timeAgo = minutes + " minute(s) ago";
    } else {
      timeAgo = seconds + " second(s) ago";
    }
    return timeAgo;
  };
  const [is_activee, setIsActive] = useState(is_active);
  const [loading, setLoading] = useState(false);
  const [deletingLoading, setDeletingLoading] = useState(false);
  const handleDeleteOfJob = async (id) => {
    // console.log("SADASDSADASDSD");
    setDeletingLoading(true);

    try {
      const response = await deleteJob({
        document_id: _id,
      });
      // console.log(response);
      const newJobs = [...jobs];
      const newJob = newJobs.filter((job) => job._id !== id);
      // console.log({ newJob })
      setJobs(newJob);
      setDeletingLoading(false);
    } catch (err) {
      // console.log(err);
      setDeletingLoading(false);
    }
  };

  const handleCheckboxChange = () => {
    setIsActive(!is_activee);
    setLoading(true);
    // console.log({ id: _id, is_activee });

    updateJob({ document_id: _id, is_active: !is_activee })
      .then((response) => {
        // console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const fetchJobsAgain = async (e) => {
    e.preventDefault();

    setShowOverlay(true);

    try {
      const response = await getJobsFromAdmin(
        currentUser.portfolio_info[0].org_id
      );

      const dataGottenFromJobs = response.data.response.data
        .reverse()
        .filter(
          (job) => job.data_type === currentUser.portfolio_info[0].data_type
        );

      setJobs(dataGottenFromJobs);

      const jobToEdit = dataGottenFromJobs.find(
        (job) => job.job_number === job_number
      );

      navigate(`/edit-job/${jobToEdit._id}`);
    } catch (err) {
      console.log(err);
    }

    setShowOverlay(false);
  };

  if (job_title === null) return <></>;
  return (
    <div className="card">
      <div className="card__header">
        <h5>{job_title}</h5>
        <div className="interact__icons">
          {newly_created ? (
            <Link to={`/edit-job/#`} onClick={fetchJobsAgain}>
              <RiEdit2Fill style={{ fontSize: "1.3rem", color: "#000" }} />
            </Link>
          ) : (
            <Link to={`/edit-job/${_id}`}>
              <RiEdit2Fill style={{ fontSize: "1.3rem", color: "#000" }} />
            </Link>
          )}
          {deletingLoading ? (
            <LittleLoading />
          ) : (
            <MdDelete
              style={{ fontSize: "1.3rem", color: "#000" }}
              onClick={() => handleDeleteOfJob(_id)}
              className="delete__icon"
            />
          )}
        </div>
      </div>
      <div className="card__skill">
        <div>
          <h6>Skills:</h6>{" "}
          <span className="skills">
            {skills.length > 20 ? skills.slice(0, 20) + " ..." : skills}
          </span>
        </div>

        {/* <input type="checkbox" id="switch" /><label for="switch">Toggle</label> */}
        {loading ? (
          <LittleLoading />
        ) : (
          <div className="state_of_job">
            <label htmlFor="is_active"></label>
            <input
              className="active_checkbox"
              type="checkbox"
              name={"is_active"}
              checked={is_activee}
              onChange={handleCheckboxChange}
              required
            />
          </div>
        )}
      </div>

      <div className="card__footer">
        <div>
          <p>
            <AiOutlineClockCircle style={style} /> <span>{date()}</span>
          </p>
          <div className="line"></div>
          <p>
            <CgDanger style={style} />
            <span>{number} candidates apply for this</span>
          </p>
        </div>
        <button>
          {newly_created ? (
            <Link to={`/view-job/#`} style={{ color: "white" }} onClick={fetchJobsAgain}>
              <span>View</span>{" "}
              <img src={arrowright} alt="" className="arrow-link" />
            </Link>
          ) : (
            <Link to={`/view-job/${_id}`} style={{ color: "white" }}>
              <span>View</span>{" "}
              <img src={arrowright} alt="" className="arrow-link" />
            </Link>
          )}
        </button>
      </div>
    </div>
  );
};

export default Card;
