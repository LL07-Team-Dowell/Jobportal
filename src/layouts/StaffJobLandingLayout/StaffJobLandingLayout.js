import { HiOutlineUserCircle } from "react-icons/hi";
import logo from "../../assets/images/landing-logo.png";
import "./style.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import NewSideNavigationBar from "../../components/SideNavigationBar/NewSideNavigationBar";
import { Link } from "react-router-dom";
import { hrNavigationLinks } from "../../pages/HrPage/views/hrNavigationLinks";
import { accountNavigationLinks } from "../../pages/AccountPage/accountNavigationLinks";
import { teamleadNavigationLinks } from "../../pages/TeamleadPage/teamleadNavigationLinks";
import { AiOutlinePlus } from "react-icons/ai";
import { useMediaQuery } from "@mui/material";
import {
  adminNavigationLinks,
  subAdminNavigationLinks,
} from "../../pages/AdminPage/views/adminNavigationLinks";
import ProgressTracker from "../../pages/AdminPage/views/Landingpage/component/progressTracker";
import BlurBackground from "../../pages/AdminPage/views/Landingpage/component/blur";
import { useCurrentUserContext } from "../../contexts/CurrentUserContext";
import { useEffect, useState } from "react";
import { teamManagementProductName } from "../../utils/utils";
import { hr } from "date-fns/locale";
import { IoShareSocial } from "react-icons/io5";
import ShareJobModal from "../../components/ShareJobModal/ShareJobModal";
import PublicAccountConfigurationModal from "../../pages/HrPage/component/PublicAccountConfigurationModal/PublicAccountConfigurationModal";
import { testingRoles } from "../../utils/testingRoles";

const StaffJobLandingLayout = ({
  children,
  hrView,
  accountView,
  teamleadView,
  runExtraFunctionOnNavItemClick,
  hideSideBar,
  adminView,
  searchValue,
  setSearchValue,
  handleNavIconClick,
  adminAlternativePageActive,
  pageTitle,
  hideTitleBar,
  showAnotherBtn,
  btnIcon,
  handleNavIcon,
  subAdminView,
  searchPlaceHolder,
  showLoadingOverlay,
  modelDurationInSec,
  hideSearchBar,
  showShareModalForJob,
  jobLinkToShareObj,
  handleCloseShareJobModal,
  showPublicAccountConfigurationModal,
  handleClosePublicAccountConfigurationModal,
  handlePublicAccountConfigurationModalBtnClick,
  publicAccountConfigurationBtnDisabled,
  publicAccountDetailState,
  handleChangeInPublicAccountState,
  searchTeam
}) => {
  const isLargeScreen = useMediaQuery("(min-width: 992px)");
  const { currentUser } = useCurrentUserContext();
  const [isSuperUser, setIsSuperUser] = useState(false);

  useEffect(() => {
    const teamManagementProduct = currentUser?.portfolio_info?.find(
      (portfolio) => portfolio.product === teamManagementProductName
    );

    if (
      (
        currentUser.settings_for_profile_info && 
        currentUser.settings_for_profile_info.profile_info[0].Role === testingRoles.superAdminRole
      ) ||
      (
        currentUser.isSuperAdmin
      )
    ) return setIsSuperUser(true); 

    if (!teamManagementProduct || teamManagementProduct.member_type !== "owner")
      return setIsSuperUser(false);

    setIsSuperUser(true);
  }, [currentUser]);

  return (
    <>
      <nav style={{ display: hideTitleBar ? "none" : "block" }}>
        <div
          className={`staff__Jobs__Layout__Navigation__Container ${
            adminView ? "admin" : ""
          }`}
        >
          {!adminView && isLargeScreen && (
            <Link to={"/"} className="jobs__Layout__Link__Item">
              <img src={logo} alt={"dowell logo"} />
            </Link>
          )}
          {adminView ? (
            adminAlternativePageActive ? (
              <div
                className="admin__View__Title__Container"
                onClick={handleNavIconClick ? handleNavIconClick : () => {}}
              >
                {showAnotherBtn ? (
                  <>
                    <div
                      className="add__Icon__Container"
                      onClick={handleNavIcon}
                    >
                      {btnIcon}
                    </div>
                  </>
                ) : (
                  <></>
                )}
                {pageTitle ? <h2>{pageTitle}</h2> : <></>}
              </div>
            ) : (
              <div
                className="admin__View__Title__Container"
                onClick={handleNavIconClick ? handleNavIconClick : () => {}}
              >
                <div className="add__Icon__Container">
                  <AiOutlinePlus />
                </div>
                {isLargeScreen && <h2>All Jobs</h2>}
              </div>
            )
          ) : (
            <></>
          )}
          {/*adminView ? "Search by skill, job" : "Search for job/applicant";*/}
          {adminView && adminAlternativePageActive ? (
            <></>
          ) : (
            hideSearchBar ?
            <></> :
            <SearchBar
              placeholder={
                searchTeam ?
                'Search for Team'
                :
                adminView
                  ? "Search by skill, job"
                  : `Search for job/${searchPlaceHolder}`
              }
              searchValue={searchValue}
              handleSearchChange={setSearchValue}
            />
          )}
          {hideTitleBar ? (
            <></>
          ) : (
            <>
              <div className="jobs__Layout__Icons__Container">
                <Link to={"/user"}>
                  <HiOutlineUserCircle className="icon" />
                </Link>
              </div>
              <hr />
            </>
          )}
        </div>
      </nav>
      <main>
        <div
          className={`staff__Jobs__Layout__Content__Container ${
            accountView ? "account" : ""
          }`}
        >
          {!hideSideBar && (
            <NewSideNavigationBar
              className={hideTitleBar ? "full__Height" : ""}
              links={
                hrView
                  ? hrNavigationLinks
                  : accountView
                  ? accountNavigationLinks
                  : teamleadView
                  ? teamleadNavigationLinks
                  : adminView
                  ? subAdminView
                    ? subAdminNavigationLinks
                    : adminNavigationLinks
                  : []
              }
              runExtraFunctionOnNavItemClick={runExtraFunctionOnNavItemClick}
              superUser={isSuperUser}
            />
          )}
          {showLoadingOverlay && (
            <BlurBackground>
              <ProgressTracker durationInSec={modelDurationInSec} />
            </BlurBackground>
          )}
          
          {
            adminView && showShareModalForJob && 
            <ShareJobModal
              linkToShareObj={jobLinkToShareObj}
              handleCloseModal={
                handleCloseShareJobModal && typeof handleCloseShareJobModal === 'function' ?
                () => handleCloseShareJobModal()
                :
                () => {}
              }
            />
          }

          {
            hrView && showPublicAccountConfigurationModal &&
            <PublicAccountConfigurationModal 
              handleCloseModal={handleClosePublicAccountConfigurationModal}
              handleBtnClick={handlePublicAccountConfigurationModalBtnClick}
              btnDisabled={publicAccountConfigurationBtnDisabled}
              details={publicAccountDetailState}
              handeDetailChange={handleChangeInPublicAccountState}
            />
          }

          <div
            className={`jobs__Layout__Content ${
              adminView ? "full__Width" : ""
            }`}
          >
            {children}
          </div>
        </div>
      </main>
    </>
  );
};

export default StaffJobLandingLayout;
