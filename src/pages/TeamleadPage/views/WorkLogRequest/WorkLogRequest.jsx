import React, { useEffect, useReducer } from "react";
import "./style.scss";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import JobLandingLayout from "../../../../layouts/CandidateJobLandingLayout/LandingLayout";
import { useGetAllUpdateTask } from "../../../CandidatePage/views/WorkLogRequest/hook/useGetAllUpdateTask";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Buttons from "../../../CandidatePage/views/WorkLogRequest/component/Buttons";
import { useState } from "react";
import Card from "../../../CandidatePage/views/WorkLogRequest/component/Card";
import { useNavigate } from "react-router-dom";
import {
  approveLogRequest,
  denyLogRequest,
  getAllUpdateTask,
} from "../../../../services/taskUpdateServices";
import { toast } from "react-toastify";
import LittleLoading from "../../../CandidatePage/views/ResearchAssociatePage/littleLoading";

const WorkLogRequest = ({ cardData }) => {
  const { currentUser } = useCurrentUserContext();
  const [loading, setLoading] = useState(false);
  const [approveRequestbtn, setApproveRequestBtn] = useState(false);
  const [data, setData] = useState([]);
  const [approve, setApprove] = useState([]);
  const [deny, setDeny] = useState([]);
  const [pendingApproval, setPendingApproval] = useState([]);
  const { error } = useGetAllUpdateTask(currentUser);
  const [reducerReuest, forceUpdate] = useReducer((x) => x + 1, 0);
  const [reducerRequest, forceUpdateRequest] = useReducer((x) => x + 1, 0);
  const navigate = useNavigate();
  // asdsad

  useEffect(() => {
    setLoading(true);

    getAllUpdateTask(currentUser.portfolio_info[0].org_id)
      .then((response) => {
        // console.log(response.data.response.data);
        const request = response?.data?.response?.data;
        const sortedRequest = request.filter(
          (applicant) =>
            applicant?.company_id === currentUser.portfolio_info[0].org_id
        );
        setData(sortedRequest);

        const approveRequest = sortedRequest?.filter(
          (element) =>
            element.approved === true && element.request_denied === false
        );

        const denyRequest = sortedRequest?.filter(
          (element) =>
            element.approved === false && element.request_denied === true
        );

        const pendingApprovalRequest = sortedRequest?.filter(
          (element) =>
            element.approved === false && element.request_denied === false
        );

        setApprove(approveRequest);
        setDeny(denyRequest);
        setPendingApproval(pendingApprovalRequest);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, [reducerReuest, reducerRequest]);

  const approveRequest = (element) => {
    setApproveRequestBtn(true);
    approveLogRequest(element._id, {
      approved_by: currentUser.userinfo.username,
    })
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          setApproveRequestBtn(false);
          toast.success("Approved");
          forceUpdateRequest();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const denyRequest = () => {
    denyLogRequest();
  };

  if (error) return <h1>{error}</h1>;

  if (loading) return <LoadingSpinner />;
  return (
    <div className="work__log__request">
      <div className="cards">
        {cardData === "Pending approval" && (
          <>
            {React.Children.toArray(
              pendingApproval.map((element) => (
                <div className="card__work__log__request" key={element._id}>
                  <h2>{element.username}</h2>
                  <p>
                    Date of request:{" "}
                    {new Date(element.update_task_date).toDateString()}
                  </p>
                  <p>Request reason: {element.update_reason}</p>
                  <div className="request__action__btn">
                    {approveRequestbtn ? (
                      <LittleLoading />
                    ) : (
                      <button
                        className="req__act__btn "
                        onClick={() =>
                          approveRequest(element, {
                            cardData: "Approved",
                          })
                        }
                      >
                        Approve
                      </button>
                    )}
                    <button
                      className="req__act__btn deny"
                      onClick={() => denyRequest()}
                    >
                      Deny
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {cardData === "Approved" && (
          <>
            {React.Children.toArray(
              approve.map((element) => (
                <div className="card__work__log__request" key={element._id}>
                  <h2>{element.username}</h2>
                  <p>
                    Date of request:{" "}
                    {new Date(element.update_task_date).toDateString()}
                  </p>
                  <p>Request reason: {element.update_reason}</p>
                </div>
              ))
            )}
          </>
        )}

        {cardData === "Denied" && (
          <>
            {React.Children.toArray(
              deny.map((element) => (
                <div className="card__work__log__request" key={element._id}>
                  <h2>{element.username}</h2>
                  <p>
                    Date of request:{" "}
                    {new Date(element.update_task_date).toDateString()}
                  </p>
                  <p>Request reason: {element.update_reason}</p>
                  <p>Reason for denial: {element.reason_for_denial}</p>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WorkLogRequest;
