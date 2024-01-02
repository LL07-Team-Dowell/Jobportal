import React, { useState, useEffect } from "react";
import "./Add.scss";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { MdArrowBackIos } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AiOutlineArrowLeft,
  AiOutlineBarChart,
  AiOutlineClose,
  AiOutlineLink,
  AiOutlinePlusCircle,
  AiOutlineSearch,
  AiOutlineTeam,
} from "react-icons/ai";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { FaTimes } from "react-icons/fa";
import { BsPlus } from "react-icons/bs";
import { toast } from "react-toastify";
import {
  dowellProjects,
  teamManagementProductName,
} from "../../../../utils/utils";
import { useJobContext } from "../../../../contexts/Jobs";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import {
  adminAddSettingUserProject,
  adminEditSettingUserProject,
  createNewSettingUserSubProject,
  editSettingUserSubProject,
  getSettingUserSubProject,
} from "../../../../services/adminServices";
import { getSettingUserProject } from "../../../../services/hrServices";
import { getUserInfoFromLoginAPI } from "../../../../services/authServices";
import { testingRoles } from "../../../../utils/testingRoles";
import Overlay from "../../../../components/Overlay";

const Add = () => {
  const { currentUser, setCurrentUser } = useCurrentUserContext();
  const navigate = useNavigate();
  const [showProjectsPop, setShowProjectsPop] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isProductLink, setIsProductLink] = useState(false);
  const [showSubProjectsPop, setShowSubProjectsPop] = useState(false);
  const [isReportLink, setIsReportLink] = useState(false);
  const [updatedUserDataLoading, setUpdatedUserDataLoading] = useState(false);
  const { state } = useLocation();
  const jobLinkToShareObj = {
    product_url: window.location.origin + "/Jobportal/#/",
    job_company_id: currentUser?.portfolio_info[0]?.org_id,
    company_data_type: currentUser?.portfolio_info[0]?.data_type,
  };

  const showProjectPopup = () => {
    setShowProjectsPop(true);
  };
  const unshowProjectPopup = () => {
    setShowProjectsPop(false);
  };
  const {
    projectsLoading,
    projectsLoaded,
    setProjectsLoaded,
    setProjectsLoading,
    setProjectsAdded,
    projectsAdded,
    setSubProjectsAdded,
    subProjectsLoaded,
    setSubProjectsLoaded,
    subProjectsLoading,
    setSubProjectsLoading,
  } = useJobContext();

  useEffect(() => {
    if (state && state.showProject && state?.showProject === true) {
      setShowProjectsPop(true);

      // RESET STATE TO PREVENT PROJECT MODAL FROM POPPING UP AFTER EVERY RELOAD
      window.history.replaceState({}, "/Jobportal/#/add");
    }

    if (!projectsLoaded) {
      getSettingUserProject()
        .then((res) => {
          setProjectsLoading(false);
          setProjectsLoaded(true);

          const projectsGotten = res.data
            ?.filter(
              (project) =>
                project?.data_type ===
                  currentUser.portfolio_info[0].data_type &&
                project?.company_id === currentUser.portfolio_info[0].org_id &&
                project.project_list &&
                project.project_list.every(
                  (listing) => typeof listing === "string"
                )
            )
            ?.reverse();

          if (projectsGotten.length < 1) return;

          setProjectsAdded(projectsGotten);
        })
        .catch((err) => {
          console.log(err);
          setProjectsLoading(false);
        });
    }

    if (!subProjectsLoaded) {
      getSettingUserSubProject()
        .then((res) => {
          setSubProjectsLoading(false);
          setSubProjectsLoaded(true);

          setSubProjectsAdded(
            res.data?.data
              ?.filter(
                (item) =>
                  item.company_id === currentUser.portfolio_info[0].org_id &&
                    item.data_type === currentUser.portfolio_info[0].data_type
              )
              .reverse()
          );
        })
        .catch((err) => {
          console.log(err);
          setSubProjectsLoading(false);
        });
    }

    if (currentUser?.userportfolio?.length > 0) return;

    const currentSessionId = sessionStorage.getItem("session_id");

    if (!currentSessionId) return;
    const teamManagementProduct = currentUser?.portfolio_info.find(
      (item) =>
        item.product === teamManagementProductName &&
        item.member_type === "owner"
    );
    if (!teamManagementProduct) return;

    if (
      (currentUser.settings_for_profile_info &&
        currentUser.settings_for_profile_info.profile_info[
          currentUser.settings_for_profile_info.profile_info.length - 1
        ].Role === testingRoles.superAdminRole) ||
      currentUser.isSuperAdmin
    )
      return;

    const dataToPost = {
      session_id: currentSessionId,
      product: teamManagementProduct.product,
    };

    setUpdatedUserDataLoading(true);

    getUserInfoFromLoginAPI(dataToPost)
      .then((res) => {
        setCurrentUser(res.data);
        console.log(res.data.portfolio_info[0].data_type);
        setUpdatedUserDataLoading(false);
      })
      .catch((err) => {
        console.log("Failed to get user details from login API");
        console.log(err.response ? err.response.data : err.message);
        setUpdatedUserDataLoading(false);
      });
  }, []);

  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setIsProductLink(false);
    setIsReportLink(false);
  };

  return (
    <StaffJobLandingLayout
      adminView={true}
      adminAlternativePageActive={true}
      hideTitleBar={false}
      pageTitle={"Add Item"}
      showAnotherBtn={true}
      btnIcon={<MdArrowBackIos size='1.5rem' />}
      handleNavIcon={() => navigate(-1)}
      hideSideBar={showProjectsPop || showSubProjectsPop}
      showShareModalForJob={showShareModal}
      jobLinkToShareObj={jobLinkToShareObj}
      handleCloseShareJobModal={handleCloseShareModal}
      isProductLink={isProductLink}
      isReportLink={isReportLink}
      newSidebarDesign={true}
    >
      <div className='new__task__container'>
        {/* <h1 style={{ color: "#005734", fontSize: "1.6rem" }}>Add New Item</h1> */}
        <div
          style={{
            position: "relative",
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
            paddingBottom: "12rem",
          }}
        >
          <div
            style={{ marginTop: 30, maxWidth: "18rem" }}
            className='Create_Team'
            onClick={() => navigate("/add-job")}
          >
            <div>
              <div>
                <AiOutlinePlusCircle
                  className='icon'
                  style={{ fontSize: "2rem" }}
                />
              </div>
              <h4>Add Job</h4>
              <p style={{ fontSize: "0.8rem" }}>
                Create simple jobs for people to apply to join your amazing
                organization
              </p>
            </div>
          </div>
          <div
            style={{ marginTop: 30, maxWidth: "18rem" }}
            className='Create_Team'
            onClick={projectsLoading ? () => {} : () => showProjectPopup()}
          >
            <div>
              <div>
                <AiOutlinePlusCircle
                  className='icon'
                  style={{ fontSize: "2rem" }}
                />
              </div>
              <h4>
                {projectsAdded[0]?.project_list
                  ? "Edit Project"
                  : "Add Project"}
              </h4>
              {projectsLoading ? (
                <div
                  style={{
                    margin: "1rem auto",
                    width: "max-content",
                    backgroundColor: "#fff",
                  }}
                >
                  <LoadingSpinner />
                </div>
              ) : (
                <p style={{ fontSize: "0.8rem" }}>
                  {projectsAdded[0]?.project_list
                    ? "View projects that have been implemented throughout your organization"
                    : "Add projects that would be implemented throughout your organization"}
                </p>
              )}
            </div>
          </div>
          <div
            style={{ marginTop: 30, maxWidth: "18rem" }}
            className='Create_Team'
            onClick={() => {
              setShowSubProjectsPop(true);
            }}
          >
            <div>
              <div>
                <AiOutlinePlusCircle
                  className='icon'
                  style={{ fontSize: "2rem" }}
                />
              </div>
              <h4>Add/Edit subprojects</h4>
              {subProjectsLoading ? (
                <div
                  style={{
                    margin: "1rem auto",
                    width: "max-content",
                    backgroundColor: "#fff",
                  }}
                >
                  <LoadingSpinner />
                </div>
              ) : (
                <p style={{ fontSize: "0.8rem" }}>
                  Simplify projects in your organization by splitting each one
                  into subprojects
                </p>
              )}
            </div>
          </div>
          <div
            style={{ marginTop: 30, maxWidth: "18rem" }}
            className='Create_Team'
            onClick={() => navigate("/teams/create-new-team/")}
          >
            <div>
              <div>
                <AiOutlineTeam className='icon' style={{ fontSize: "2rem" }} />
              </div>
              <h4>Add team</h4>
              <p style={{ fontSize: "0.8rem" }}>
                Bring everyone together and get to work. Work together in a team
                to increase productivity.
              </p>
            </div>
          </div>
          <div
            style={{ marginTop: 30, maxWidth: "18rem" }}
            className='Create_Team'
            onClick={() => {
              setShowShareModal(true);
              setIsProductLink(true);
            }}
          >
            <div>
              <div>
                <AiOutlineLink className='icon' style={{ fontSize: "2rem" }} />
              </div>
              <h4>Create product link</h4>
              <p style={{ fontSize: "0.8rem" }}>
                Create a product link for users to view open jobs in your
                amazing organization.
              </p>
            </div>
          </div>
          <div
            style={{ marginTop: 30, maxWidth: "18rem" }}
            className='Create_Team'
            onClick={
              updatedUserDataLoading
                ? () => {}
                : () => {
                    setShowShareModal(true);
                    setIsReportLink(true);
                  }
            }
          >
            <div>
              <div>
                <AiOutlineBarChart
                  className='icon'
                  style={{ fontSize: "2rem" }}
                />
              </div>
              <h4>Create report link</h4>
              {updatedUserDataLoading ? (
                <div
                  style={{
                    margin: "1rem auto",
                    width: "max-content",
                    backgroundColor: "#fff",
                  }}
                >
                  <LoadingSpinner />
                </div>
              ) : (
                <p style={{ fontSize: "0.8rem" }}>
                  Create a public report link for anyone to view specific
                  insights about your organization.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {showProjectsPop && (
        <AddProjectPopup unshowProjectPopup={unshowProjectPopup} />
      )}
      {showSubProjectsPop && (
        <AddSubProjectPopup
          unshowProjectPopup={() => setShowSubProjectsPop(false)}
        />
      )}
    </StaffJobLandingLayout>
  );
};

export default Add;

const AddProjectPopup = ({ projects, unshowProjectPopup }) => {
  const { currentUser } = useCurrentUserContext();
  const [query, setquery] = useState("");
  const [inputProjects, setInputProjects] = useState([]);
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const { projectsAdded, setProjectsAdded } = useJobContext();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [modal, setModal] = useState(false);
  const [projectName, setProjectName] = useState(undefined);
  const [inactiveProjects, setInactiveProjects] = useState([]);
  const inactiveProjectFunction = (projectName) => {
    setInputProjects(
      inputProjects.filter((f) => f !== projectName.trim() && f !== projectName)
    );
    setInactiveProjects([...inactiveProjects, projectName]);
    closeModal();
  };
  const openModal = (projectName) => {
    setProjectName(projectName);
    setModal(true);
  };
  const closeModal = () => {
    setProjectName(undefined);
    setModal(false);
  };
  const removeInactiveProjects = (projectName) => {
    setInactiveProjects(inactiveProjects.filter((f) => f !== projectName));
    setDisplayedProjects([
      { _id: crypto.randomUUID(), project_name: projectName.trim() },
      ...displayedProjects,
    ]);
  };
  useEffect(() => {
    const projectsToDisplay = dowellProjects
      .filter(
        (project) =>
          !projectsAdded[0]?.project_list.includes(project.project_name)
      )
      .sort((a, b) => a.project_name.localeCompare(b.project_name));
    setDisplayedProjects(projectsToDisplay);
    
    if (projectsAdded[0]?.inactive_project_list && Array.isArray(projectsAdded[0]?.inactive_project_list)) {
      setInactiveProjects(projectsAdded[0]?.inactive_project_list);
    }

    setInputProjects(
      Array.isArray(projectsAdded[0]?.project_list)
        ? projectsAdded[0]?.project_list.sort((a, b) => a.localeCompare(b))
        : []
    );
  }, []);

  // functions
  const removeProject = (projectName) => {
    setInputProjects(
      inputProjects.filter((f) => f !== projectName.trim() && f !== projectName)
    );

    const projectExistsInBank = dowellProjects.find(
      (p) => p.project_name === projectName.trim()
    );
    if (!projectExistsInBank) return;

    const currentDisplayedProjects = displayedProjects.slice();
    const projectAmongDisplayedProjects = currentDisplayedProjects.find(
      (project) => project.project_name === projectName.trim()
    );
    if (projectAmongDisplayedProjects) return;

    setDisplayedProjects([
      { _id: crypto.randomUUID(), project_name: projectName.trim() },
      ...displayedProjects,
    ]);
    closeModal();
  };

  const AddedProject = (projectName) => {
    const projectAlreadyInList = inputProjects.find(
      (project) =>
        project.toLocaleLowerCase() === projectName.trim().toLocaleLowerCase()
    );
    if (projectAlreadyInList)
      return toast.info("You have already added this project");
    setInputProjects([...inputProjects, projectName.trim()]);
    setDisplayedProjects(
      displayedProjects?.filter((f) => f.project_name !== projectName.trim())
    );

    setquery("");
  };

  const postSettinguserproject = async () => {
    if (inputProjects.length > 0) {
      setBtnDisabled(true);

      const data = {
        company_id: currentUser?.portfolio_info[0].org_id,
        data_type: currentUser.portfolio_info[0].data_type,
        project_list: inputProjects,
        inactive_project_list: inactiveProjects,
      };

      if (projectsAdded[0]?.project_list) {
        try {
          const response = (
            await adminEditSettingUserProject(projectsAdded[0]?.id, data)
          ).data;
          // console.log(response);
          unshowProjectPopup();
          setProjectsAdded([{ ...data, id: response?.id }]);
          toast.success("Projects successfully updated");
        } catch (error) {
          console.log(error);
          setBtnDisabled(false);
          toast.error("Something went wrong while trying to update projects");
        }
        return;
      }

      adminAddSettingUserProject(data)
        .then((resp) => {
          console.log(resp);
          unshowProjectPopup();
          setProjectsAdded([{ ...data, id: resp.data.id }]);
          toast.success("Projects successfully added");
        })
        .catch((err) => {
          console.log(err);
          setBtnDisabled(false);
          toast.error("Something went wrong while trying to add projects");
        });
    } else {
      toast.info("Please add a project");
      setBtnDisabled(false);
    }
  };

  return (
    <div className='overlay'>
      <div className='Project_Popup'>
        <AiOutlineClose
          fontSize={"small"}
          style={{
            display: "block",
            margin: "0 0 0 auto",
            cursor: "pointer",
            fontSize: "1rem",
          }}
          onClick={unshowProjectPopup}
        />
        <h2
          style={{
            marginBottom: 15,
            color: "#005734",
            letterSpacing: "0.03em",
          }}
        >
          Select Projects{" "}
        </h2>
        <h3 style={{ marginBottom: '0.4rem '}}>Active Projects</h3>
        <div className='added-members-input'>
          {React.Children.toArray(
            inputProjects?.map((v) => (
              <div
                // key={v.id}
                style={{ cursor: "pointer" }}
                onClick={() => openModal(v)}
              >
                <p>{v}</p>
                <FaTimes fontSize={"small"} />
              </div>
            ))
          )}
          <input
            type='text'
            placeholder='Search project'
            value={query}
            onChange={(e) => setquery(e.target.value)}
          />
        </div>
        <br />
        <h3 style={{ marginBottom: '0.4rem '}}>Inactive Projects</h3>
        <div className='added-members-input'>
          {React.Children.toArray(
            inactiveProjects?.map((v) => (
              <div
                // key={v.id}
                style={{ cursor: "pointer" }}
                onClick={() => removeInactiveProjects(v)}
              >
                <p>{v}</p>
                <FaTimes fontSize={"small"} />
              </div>
            ))
          )}
          {/* <input
            type='text'
            placeholder='Search project'
            value={query}
            onChange={(e) => setquery(e.target.value)}
          /> */}
        </div>
        <br />
        <label htmlFor='task_name'>Add Projects</label>
        <div className='members'>
          {displayedProjects?.filter((f) =>
            f?.project_name
              ?.replaceAll(" ", "")
              .toLocaleLowerCase()
              .includes(query.toLocaleLowerCase().replaceAll(" ", ""))
          ).length > 0 ? (
            displayedProjects
              ?.filter((f) =>
                f?.project_name
                  ?.replaceAll(" ", "")
                  .toLocaleLowerCase()
                  .includes(query.toLocaleLowerCase().replaceAll(" ", ""))
              )
              ?.map((element) => (
                <div
                  className='single-member'
                  style={{ cursor: "pointer" }}
                  onClick={() => AddedProject(element?.project_name)}
                >
                  <p>{element?.project_name}</p>
                  <BsPlus />
                </div>
              ))
          ) : (
            <>
              <h5 className='not__Found__Header'>
                No project found matching {query}
              </h5>
              <div
                className='add__Anyway__Item'
                onClick={() => AddedProject(query)}
              >
                <span>Add {query} anyway?</span>
              </div>
            </>
          )}
        </div>
        <button
          disabled={btnDisabled}
          className='add__Project__Btn'
          onClick={postSettinguserproject}
        >
          {btnDisabled ? (
            <LoadingSpinner color={"#fff"} width={"1.1rem"} height={"1.1rem"} />
          ) : projectsAdded[0] ? (
            "Update"
          ) : (
            "Add Project"
          )}
        </button>
      </div>
      {modal && (
        <Modal
          showModal={modal}
          project={projectName}
          removeFunction={removeProject}
          inActiveFunction={inactiveProjectFunction}
        />
      )}
    </div>
  );
};

const AddSubProjectPopup = ({ projects, unshowProjectPopup }) => {
  const { currentUser } = useCurrentUserContext();
  const [query, setquery] = useState("");
  const [inputProjects, setInputProjects] = useState([]);
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const { projectsAdded, subProjectsAdded, setSubProjectsAdded } =
    useJobContext();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newSubProject, setNewSubProject] = useState("");

  // functions
  const removeProject = (projectName) => {
    setInputProjects(
      inputProjects.filter((f) => f !== projectName.trim() && f !== projectName)
    );
  };

  const AddedProject = (projectName) => {
    if (!projectName || projectName.length < 1) return;
    const projectAlreadyInList = inputProjects.find(
      (project) =>
        project.toLocaleLowerCase() === projectName.trim().toLocaleLowerCase()
    );
    if (projectAlreadyInList)
      return toast.info("You have already added this sub project");
    setInputProjects([...inputProjects, projectName.trim()]);
    setNewSubProject("");
  };

  const handleSelectProject = (project) => {
    setShowSetup(true);
    setSelectedProject(project);
    const foundList = subProjectsAdded.find(
      (item) => item.parent_project === project
    )?.sub_project_list;
    if (!foundList) return;
    setInputProjects(foundList.sort((a, b) => a.localeCompare(b)));
  };

  const handleUnselectProject = () => {
    setShowSetup(false);
    setSelectedProject(null);
    setInputProjects([]);
  };

  const postSettinguserproject = async () => {
    const existingSubsForProject = subProjectsAdded.find(
      (item) => item.parent_project === selectedProject
    );
    const existingSubsForProjectIndex = subProjectsAdded.findIndex(
      (item) => item.parent_project === selectedProject
    );

    if (inputProjects.length > 0) {
      setBtnDisabled(true);

      const data = {
        company_id: currentUser?.portfolio_info[0].org_id,
        data_type: currentUser.portfolio_info[0].data_type,
        sub_project_list: inputProjects,
        parent_project: selectedProject,
      };

      if (existingSubsForProject) {
        try {
          const response = (
            await editSettingUserSubProject(existingSubsForProject?.id, data)
          ).data;
          const currentSubProjects = subProjectsAdded.slice();
          currentSubProjects[existingSubsForProjectIndex] = {
            ...data,
            id: existingSubsForProject?.id,
          };
          unshowProjectPopup();
          setSubProjectsAdded(currentSubProjects);
          toast.success("Sub projects successfully updated");
        } catch (error) {
          console.log(error);
          setBtnDisabled(false);
          toast.error(
            "Something went wrong while trying to update sub projects"
          );
        }
        return;
      }

      createNewSettingUserSubProject(data)
        .then((resp) => {
          console.log(resp);
          unshowProjectPopup();
          const currentSubProjects = subProjectsAdded.slice();
          setSubProjectsAdded([...currentSubProjects, { ...resp?.data }]);
          toast.success("Sub projects successfully added");
        })
        .catch((err) => {
          console.log(err);
          setBtnDisabled(false);
          toast.error("Something went wrong while trying to add sub projects");
        });
    } else {
      toast.info("Please add a sub project");
      setBtnDisabled(false);
    }
  };

  return (
    <div className='overlay'>
      <div className='Project_Popup' style={{ minHeight: "100px" }}>
        <AiOutlineClose
          fontSize={"small"}
          style={{
            display: "block",
            margin: "0 0 0 auto",
            cursor: "pointer",
            fontSize: "1rem",
          }}
          onClick={unshowProjectPopup}
        />
        {showSetup && (
          <AiOutlineArrowLeft
            style={{ cursor: "pointer" }}
            onClick={handleUnselectProject}
          />
        )}
        <h2
          style={{
            marginBottom: 15,
            color: "#005734",
            letterSpacing: "0.03em",
          }}
        >
          {showSetup
            ? `Add subprojects for ${selectedProject}`
            : "Select Project"}
          {!showSetup && (
            <p className='select__Fr__Sub__Project'>Select a project first</p>
          )}
        </h2>
        {showSetup ? (
          <>
            {inputProjects?.length < 1 ? (
              <></>
            ) : (
              <>
                <div className='added-members-input'>
                  {React.Children.toArray(
                    inputProjects?.map((v) => (
                      <div
                        // key={v.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => removeProject(v)}
                      >
                        <p>{v}</p>
                        <FaTimes fontSize={"small"} />
                      </div>
                    ))
                  )}
                </div>
                <br />
              </>
            )}
            <label htmlFor='task_name'>Add sub projects</label>
            <div className='members'>
              {
                <div className='subProject__Select__Wrapper'>
                  <input
                    placeholder='New subproject'
                    value={newSubProject}
                    onChange={({ target }) => setNewSubProject(target.value)}
                  />
                  <button>
                    <AiOutlinePlusCircle
                      style={{ cursor: "pointer" }}
                      onClick={() => AddedProject(newSubProject)}
                    />
                  </button>
                </div>
              }
            </div>
            <button
              disabled={btnDisabled}
              className='add__Project__Btn'
              onClick={postSettinguserproject}
            >
              {btnDisabled ? (
                <LoadingSpinner
                  color={"#fff"}
                  width={"1.1rem"}
                  height={"1.1rem"}
                />
              ) : subProjectsAdded.find(
                  (project) => project.parent_project === selectedProject
                ) ? (
                "Update"
              ) : (
                "Add"
              )}
            </button>
          </>
        ) : (
          <>
            <div className='serach__Proje__Sub'>
              <AiOutlineSearch />
              <input
                type='text'
                placeholder='Search project'
                value={query}
                onChange={(e) => setquery(e.target.value)}
              />
            </div>

            <ul className='project__Listing__Sub'>
              {query.length > 0 ? (
                projectsAdded[0]?.project_list
                  .sort((a, b) => a.localeCompare(b))
                  .filter((project) =>
                    project
                      .replaceAll(" ", "")
                      .toLocaleLowerCase()
                      .includes(query.toLocaleLowerCase().replaceAll(" ", ""))
                  ).length < 1 ? (
                  <p>No projects found matching {query}</p>
                ) : (
                  React.Children.toArray(
                    projectsAdded[0]?.project_list
                      .sort((a, b) => a.localeCompare(b))
                      .filter((project) =>
                        project
                          .replaceAll(" ", "")
                          .toLocaleLowerCase()
                          .includes(
                            query.toLocaleLowerCase().replaceAll(" ", "")
                          )
                      )
                      .map((project) => {
                        return (
                          <li onClick={() => handleSelectProject(project)}>
                            {project}
                          </li>
                        );
                      })
                  )
                )
              ) : (
                React.Children.toArray(
                  projectsAdded[0]?.project_list
                    .sort((a, b) => a.localeCompare(b))
                    .map((project) => {
                      return (
                        <li onClick={() => handleSelectProject(project)}>
                          {project}
                        </li>
                      );
                    })
                )
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

const Modal = ({ project, removeFunction, inActiveFunction, showModal }) => {
  return (
    <Overlay className={'remove__Overlay'}>
      <div className='modal'>
        <p>Do you want to remove this project or render it inactive?</p>
        <div>
          <button onClick={() => removeFunction(project)}>Remove</button>
          <button onClick={() => inActiveFunction(project)}>Make inactive</button>
        </div>
      </div>
    </Overlay>
  );
};
