import React from "react";
import { BiPlus } from "react-icons/bi";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
const Navbar = ({
  title,
  removeButton,
  color,
  noButtonBack,
  addTeamTask,
  addTeamTaskTitle,
  handleAddTeamTaskFunction,
  adminTeams,
  fontWeight,
}) => {
  const navigate = useNavigate();
  return (
    <nav className="create-new-team-header">
      <div>
        <div>
          {noButtonBack ? null : (
            <button className="back" onClick={() => navigate(-1)}>
              <MdOutlineArrowBackIosNew />
            </button>
          )}
          {title !== undefined && (
            <h1 style={{ 
              color: color ? color : "#000", 
              fontFamily: "Poppins, 'sans-serif", 
              fontWeight: fontWeight ? fontWeight : 'bold' 
            }}>
              {title}
            </h1>
          )}
        </div>
        {!removeButton && (
          <NavLink
            className="create-new-team-btn"
            to={
              adminTeams
                ? "/teams/create-new-team/"
                : "/create-task/create-new-team/"
            }
          >
            <BiPlus /> <span>Create New</span>
          </NavLink>
        )}
        {addTeamTask && (
          <button
            className="create-new-team-btn"
            style={{ fontWeight: 600, textAlign: "center" }}
            onClick={handleAddTeamTaskFunction}
          >
            <BiPlus style={{ fontWeight: 600, fontSize: "20px" }} />{" "}
            <span>{addTeamTaskTitle}</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
