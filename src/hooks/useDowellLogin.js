import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getUserInfoFromLoginAPI,
  getUserInfoFromPortfolioAPI,
} from "../services/authServices";
import { dowellLoginUrl } from "../services/axios";
import { getSettingUserProfileInfo } from "../services/settingServices";

export default function useDowellLogin(
  updateCurrentUserState,
  updatePageLoading,
  updatePublicUserState,
  updateDetailsForPublicUser,
  updateNoUserDetailFound,
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLocalSessionId = sessionStorage.getItem("session_id");
  const currentLocalPortfolioId = sessionStorage.getItem("portfolio_id");
  const currentLocalUserDetails = sessionStorage.getItem("user");
  const currentPublicSession = sessionStorage.getItem("public_user_session");
  const currentPublicUserDetails = sessionStorage.getItem("public_user");
  const navigate = useNavigate();

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    const portfolio_id = searchParams.get("id");
    const publicView = searchParams.get("view");
    const jobToView = searchParams.get("job_id");
    const jobCompanyId = searchParams.get("job_company_id");
    const jobCompanyDataType = searchParams.get("company_data_type");


    // FOR PUBLIC USERS
    if (currentPublicSession && currentPublicUserDetails) {
      updatePageLoading(false);
      updatePublicUserState(true);
      updateDetailsForPublicUser(JSON.parse(currentPublicUserDetails));

      return
    }

    if (publicView && publicView === 'public' && jobToView && jobCompanyId && jobCompanyDataType) {
      updatePageLoading(false);
      updatePublicUserState(true);

      const publicUserDetails = {
        company_id: jobCompanyId,
        job: jobToView,
        data_type: jobCompanyDataType,
      };

      updateDetailsForPublicUser(publicUserDetails)

      sessionStorage.setItem('public_user_session', true);
      sessionStorage.setItem('public_user', JSON.stringify(publicUserDetails));

      navigate(`/apply/job/${jobToView}`)
      return
    }
  

    // FOR LOGGED IN USERS
    if (!session_id && !portfolio_id) {
      if (currentLocalSessionId && currentLocalPortfolioId) {
        if (currentLocalUserDetails) {
          updateCurrentUserState(JSON.parse(currentLocalUserDetails));
          updatePageLoading(false);
          return
        }
        getUserInfoFromPortfolioAPI({ session_id: currentLocalSessionId })
          .then(async (res) => {
            const currentUserDetails = res.data;

            if (currentUserDetails.message) {
              updateNoUserDetailFound(true);
              updatePageLoading(false);

              return;
            }

            try {
              const settingsResponse = await getSettingUserProfileInfo();
              const settingForCurrentUserOrg = settingsResponse.data
                .reverse()
                .filter(
                  (setting) =>
                    setting.company_id ===
                    currentUserDetails.portfolio_info[0].org_id
                );

              //CHECK IF USER HAS ROLE CONFIGURED
              const userHasRoleConfigured = settingForCurrentUserOrg.find(
                (setting) =>
                  setting.profile_info[0].profile_title ===
                  currentUserDetails.portfolio_info[0].portfolio_name
              );

              //USER DOES NOT HAVE ROLE CONFIGURED
              if (!userHasRoleConfigured) {
                sessionStorage.setItem('user', JSON.stringify(currentUserDetails));
                updateCurrentUserState(currentUserDetails);
                updatePageLoading(false);

                return;
              } else {
                //USER HAS ROLE CONFIGURED
                sessionStorage.setItem('user', JSON.stringify({...currentUserDetails, settings_for_profile_info: userHasRoleConfigured }));
                updateCurrentUserState({
                  ...currentUserDetails,
                  settings_for_profile_info: userHasRoleConfigured,
                });
                updatePageLoading(false);
              }
            } catch (error) {
              sessionStorage.setItem('user', JSON.stringify(currentUserDetails));
              updateCurrentUserState(currentUserDetails);
              updatePageLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
            updatePageLoading(false);
          });
        return;
      }

      if (currentLocalSessionId && !currentLocalPortfolioId) {
        if (currentLocalUserDetails) {
          updateCurrentUserState(JSON.parse(currentLocalUserDetails));
          updatePageLoading(false);
          return
        }
        getUserInfoFromLoginAPI({ session_id: currentLocalSessionId })
          .then(async (res) => {
            const currentUserDetails = res.data;
            
            if (currentUserDetails.message) {
              updateNoUserDetailFound(true);
              updatePageLoading(true);

              return;
            }

            sessionStorage.setItem('user', JSON.stringify(currentUserDetails));
            updateCurrentUserState(currentUserDetails);
            updatePageLoading(false);
          })
          .catch((err) => {
            console.log(err);
            updatePageLoading(false);
          });
        return;
      }

      return (window.location.replace(dowellLoginUrl));
    }

    sessionStorage.setItem("session_id", session_id);

    if (session_id && !portfolio_id) {
      // remove session_id from url
      // window.history.replaceState(
      //   {},
      //   document.title,
      //   "/Jobportal/"
      // );

      if (currentLocalUserDetails) {
        updateCurrentUserState(JSON.parse(currentLocalUserDetails));
        updatePageLoading(false);
        return
      }

      getUserInfoFromLoginAPI({ session_id: session_id })
        .then(async (res) => {
          const currentUserDetails = res.data;

          if (currentUserDetails.message) {
            updateNoUserDetailFound(true);
            updatePageLoading(false);

            return;
          }

          sessionStorage.setItem('user', JSON.stringify(currentUserDetails));
          updateCurrentUserState(currentUserDetails);
          updatePageLoading(false);
        })
        .catch((err) => {
          console.log(err);
          updatePageLoading(false);
        });
      return;
    }

    // remove session_id and id from url
    // window.history.replaceState({}, document.title, "/Jobportal/");

    sessionStorage.setItem("portfolio_id", portfolio_id);

    if (currentLocalUserDetails) {
      updateCurrentUserState(JSON.parse(currentLocalUserDetails));
      updatePageLoading(false);
      return
    }

    getUserInfoFromPortfolioAPI({ session_id: session_id })
      .then(async (res) => {
        const currentUserDetails = res.data;

        if (currentUserDetails.message) {
          updateNoUserDetailFound(true);
          updatePageLoading(false);

          return;
        }
        
        try {
          const settingsResponse = await getSettingUserProfileInfo();
          const settingForCurrentUserOrg = settingsResponse.data
            .reverse()
            .filter(
              (setting) =>
                setting.company_id ===
                currentUserDetails.portfolio_info[0].org_id
            );

          //CHECK IF USER HAS ROLE CONFIGURED
          const userHasRoleConfigured = settingForCurrentUserOrg.find(
            (setting) =>
              setting.profile_info[0].profile_title ===
              currentUserDetails.portfolio_info[0].portfolio_name
          );

          //User Does not have role configured
          if (!userHasRoleConfigured) {
            sessionStorage.setItem('user', JSON.stringify(currentUserDetails));
            updateCurrentUserState(currentUserDetails);
            updatePageLoading(false);

            return;
          } else {
            //User has role configured
            sessionStorage.setItem('user', JSON.stringify({...currentUserDetails, settings_for_profile_info: userHasRoleConfigured}));
            updateCurrentUserState({
              ...currentUserDetails,
              settings_for_profile_info: userHasRoleConfigured,
            });
            updatePageLoading(false);
          }
        } catch (error) {
          sessionStorage.setItem('user', JSON.stringify(currentUserDetails));
          updateCurrentUserState(currentUserDetails);
          updatePageLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        updatePageLoading(false);
      });
  }, []);
}
