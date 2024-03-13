import SearchBar from "../../components/SearchBar/SearchBar";
import { TbBellRinging } from "react-icons/tb";
import { BsFillChatTextFill } from "react-icons/bs";
import { HiOutlineUserCircle } from "react-icons/hi";
import logo from "../../assets/images/landing-logo.png";
import "./style.css";
import { Link, useLocation } from "react-router-dom";
import NewSideNavigationBar from "../../components/SideNavigationBar/NewSideNavigationBar";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import TitleNavigationBar from "../../components/TitleNavigationBar/TitleNavigationBar";
import {
  afterSelectionLinks,
  loggedInCandidateNavLinks,
} from "../../pages/CandidatePage/utils/afterSelectionLinks";
import { dowellLoginUrl } from "../../services/axios";
import { useMediaQuery } from "@mui/material";
import { useCurrentUserContext } from "../../contexts/CurrentUserContext";
import { teamManagementProductName } from "../../utils/utils";
import { testingRoles } from "../../utils/testingRoles";
import useCheckCurrentAuthStatus from "../../hooks/useCheckCurrentAuthStatus";
import AuthOverlay from "../../components/AuthOverlay/AuthOverlay";
import { getDaysDifferenceBetweenDates } from "../../helpers/helpers";
import { MdOutlineWorkHistory } from "react-icons/md";

const JobLandingLayout = ({
  children,
  user,
  afterSelection,
  hideSideNavigation,
  hideSearch,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const isLargeScreen = useMediaQuery("(min-width: 992px)");
  const [screenTitle, setScreenTitle] = useState("Work logs");
  const location = useLocation();
  const {
    currentUser,
    currentAuthSessionExpired,
    setCurrentAuthSessionExpired,
    currentUserHiredApplications,
    setCurrentUserHiredApplications,
    currentUserHiredApplicationsLoaded,
    setCurrentUserHiredApplicationsLoaded,
  } = useCurrentUserContext();
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [linkCopy, setLinkCopy] = useState(afterSelectionLinks);

  useCheckCurrentAuthStatus(currentUser, setCurrentAuthSessionExpired);

  useEffect(() => {
    if (!currentUserHiredApplicationsLoaded) {
      try {
        const savedHiredApplications = JSON.parse(sessionStorage.getItem("user-hired-applications"));
        
        setCurrentUserHiredApplications(savedHiredApplications);
        setCurrentUserHiredApplicationsLoaded(true);

      } catch (error) {
        console.log("No 'user-hired-applications' saved in session storage");
      }
    }

    console.log(currentUserHiredApplicationsLoaded, currentUserHiredApplications);
    // if (currentUserHiredApplications.find(app => getDaysDifferenceBetweenDates(app.onboarded_on, new Date()) > 180)) {
    //   setLinkCopy([...afterSelectionLinks, {
    //     text: "Internal Job Apply",
    //     icon: <MdOutlineWorkHistory />,
    //     linkAddress: "/internal-job-apply?type=Group_Lead",
    //   }])
    // }
  }, [currentUserHiredApplicationsLoaded])

  useEffect(() => {
    if (location.pathname.includes("teams")) return setScreenTitle("Teams");
    if (location.pathname.includes("user")) return setScreenTitle("Profile");
    if (location.pathname.includes("team-screen-member"))
      return setScreenTitle("");
    if (location.pathname.includes("work-log-request"))
      return setScreenTitle("Work log requests");
    if (location.pathname.includes("invoice")) return setScreenTitle("");
    if (location.pathname.includes("internal-job-apply")) return setScreenTitle("Internal Job Application");

    setScreenTitle("Work logs");
  }, [location]);

  useEffect(() => {
    if (!currentUser) return;

    const teamManagementProduct = currentUser?.portfolio_info?.find(
      (portfolio) => portfolio.product === teamManagementProductName
    );

    if (
      (currentUser.settings_for_profile_info &&
        currentUser.settings_for_profile_info?.profile_info[
          currentUser.settings_for_profile_info?.profile_info?.length - 1
        ]?.Role === testingRoles.superAdminRole) ||
      currentUser?.isSuperAdmin
    )
      return setIsSuperUser(true);

    if (!teamManagementProduct || teamManagementProduct.member_type !== "owner")
      return setIsSuperUser(false);

    setIsSuperUser(true);
  }, [currentUser]);

  const handleChatIconClick = () => toast.info("Still in development");

  const handleLogin = (e) => {
    e.preventDefault();
    window.location.href =
      dowellLoginUrl + window.location.hash.replace("#", "");
  };

  return (
    <>
      {currentAuthSessionExpired && <AuthOverlay />}
      <nav>
        <div className="jobs__Layout__Navigation__Container">
          {isLargeScreen && (
            <Link to={"/"} className="jobs__Layout__Link__Item">
              <img src={logo} alt={"dowell logo"} />
            </Link>
          )}
          {afterSelection ? (
            <TitleNavigationBar title={screenTitle} hideBackBtn={true} />
          ) : hideSearch ? (
            <></>
          ) : (
            <SearchBar
              placeholder={"Search for job/project"}
              searchValue={searchValue}
              handleSearchChange={setSearchValue}
            />
          )}
          {user && (
            <div className="jobs__Layout__Icons__Container">
              {!afterSelection && (
                <Link to={"/alerts"}>
                  <TbBellRinging className="icon" />
                </Link>
              )}
              <Link to={"/user"}>
                {currentUser.userinfo.profile_img ? (
                  <img
                    src={currentUser.userinfo.profile_img}
                    alt="#"
                    style={{
                      width: "30px",
                      borderRadius: "50%",
                      height: "30px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <HiOutlineUserCircle className="icon" />
                )}
              </Link>
            </div>
          )}
          {
            !user && <div></div>
            // <button onClick={handleLogin} className="jobs__Landing__Layout__Login__Btn">
            //     Login
            // </button>
          }
          <hr />
        </div>
      </nav>
      <main>
        <div className="jobs__Layout__Content__Container">
          {!hideSideNavigation && user && (
            <NewSideNavigationBar
              links={
                afterSelection ? linkCopy : loggedInCandidateNavLinks
              }
              superUser={isSuperUser}
            />
          )}
          <div className="jobs__Layout__Content">{children}</div>
          {/* {!afterSelection && <BsFillChatTextFill className="chat__With__CS__Icon" onClick={handleChatIconClick} /> } */}
        </div>
      </main>
    </>
  );
};

export default JobLandingLayout;
