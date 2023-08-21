import React from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { generateReport } from "../../../../services/adminServices";
import { useEffect } from "react";
import { useState } from "react";
import "./style.scss";
// chart.js
import {
  Chart as ChartJs,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
// don
import { Doughnut, Bar } from "react-chartjs-2";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
// register chart.js
ChartJs.register(ArcElement, Tooltip, Legend);

ChartJs.register(ArcElement, BarElement, CategoryScale, LinearScale);
const AdminReports = ({ subAdminView }) => {
  // states
  const [selectOptions, setSelectOptions] = useState("");
  const [data, setdata] = useState({});
  const [loading, setLoading] = useState(false);
  const [firstDate, setFirstDate] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [showCustomTimeModal, setShowCustomTimeModal] = useState(false);
  // handle functions
  const handleSelectOptionsFunction = (e) => {
    setSelectOptions(e.target.value);
    if (e.target.value === "custom_time") {
      setShowCustomTimeModal(true);
    } else {
      setShowCustomTimeModal(false);
    }
  };
  const closeModal = () => {
    setShowCustomTimeModal(false);
  };
  const handleSubmitDate = (start_date, end_date) => {
    setLoading(true);
    const data = {
      start_date,
      end_date,
    };
    generateReport(data)
      .then((resp) => {
        setLoading(false);
        console.log(resp.data.response);
        setdata(resp.data.response);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  //   useEffect
  useEffect(() => {
    setLoading(true);
    const data = {
      start_date: formatDateFromMilliseconds(new Date().getTime()),
      end_date: formatDateFromMilliseconds(
        new Date().getTime() - 7 * 24 * 60 * 60 * 1000
      ),
    };
    generateReport(data)
      .then((resp) => {
        setLoading(false);
        console.log(resp.data.response);
        setdata(resp.data.response);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  console.log(data.hiring_rate)
  if (loading)
    return (
      <StaffJobLandingLayout
        adminView={true}
        adminAlternativePageActive={true}
        pageTitle={"Reports"}
        subAdminView={subAdminView}
      >
        <LoadingSpinner />
      </StaffJobLandingLayout>
    );
  return (
    <StaffJobLandingLayout
      adminView={true}
      adminAlternativePageActive={true}
      pageTitle={"Reports"}
      subAdminView={subAdminView}
      hideSideBar={showCustomTimeModal}
    >
      <div className="reports__container">
        <div className="reports__container_header">
          <div>
            <p>Get insights into your organizations</p>
            <select
              className="select_time_tage"
              onChange={handleSelectOptionsFunction}
              defaultValue={""}
            >
              <option value="" disabled> select time</option>
              <option value="last_7_days">last 7 days</option>
              <option value="custom_time">custom time</option>
            </select>
          </div>
        </div>
        <div className="graphs">
          <div style={{ marginBottom: 20 }} className="graph__Item">
            <h6>jobs</h6>
            <div style={{ width: 400, height: 300 }}>
              <Doughnut
                data={{
                  labels: ["active jobs", "inactive jobs"],
                  datasets: [
                    {
                      label: "Poll",
                      data: [
                        data.number_active_jobs,
                        data.number_inactive_jobs,
                      ],
                      backgroundColor: ["#005734", "#D3D3D3"],
                      borderColor: ["#005734", "#D3D3D3"],
                    },
                  ],
                }}
              ></Doughnut>
            </div>
          </div>
          <div className="graph__Item">
            <h6>applications</h6>
            <div className="application">
              <div style={{ width: 400, height: 300 }}>
                <Doughnut
                  data={{
                    labels: [
                      "job applications",
                      "no job applications from start date to end date",
                    ],
                    datasets: [
                      {
                        label: "Poll",
                        data: [
                          data.job_applications,
                          data.nojob_applications_from_start_date_to_end_date,
                        ],
                        backgroundColor: ["#D3D3D3", "#005734"],
                        borderColor: ["#D3D3D3", "#005734"],
                      },
                    ],
                  }}
                ></Doughnut>
              </div>
              {/* <div>hiring rate:{data.hiring_rate}</div> */}
              <div style={{ width: 400, height: 300 }}>
                <Doughnut
                  data={{
                    labels: [
                      "hiring rate",
                      "hiring total",
                    ],
                    datasets: [
                      {
                        label: "Poll",
                        data: [
                          extractNumber(data.hiring_rate),
                          100,
                        ],
                        backgroundColor: ["#D3D3D3", "#005734"],
                        borderColor: ["#D3D3D3", "#005734"],
                      },
                    ],
                  }}
                ></Doughnut>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 20 }} className="graph__Item">
            <h6>candidates</h6>
            <div className="candidates_graph">
              <div style={{ width: 400, height: 300 }}>
                <Doughnut
                  data={{
                    labels: [
                      "hired candidates",
                      "rejected candidates",
                      "probationary candidates",
                      "rehire andidates",
                      "selected candidates",
                    ],
                    datasets: [
                      {
                        label: "Poll",
                        data: [
                          data.hired_candidates,
                          data.rejected_candidates,
                          data.probationary_candidates,
                          data.rehire_candidates,
                          data.selected_candidates,
                        ],
                        backgroundColor: [
                          "#005734",
                          "red",
                          "black",
                          "yellow",
                          "pink",
                          "blue",
                        ],
                        borderColor: [
                          "#005734",
                          "red",
                          "black",
                          "yellow",
                          "pink",
                          "blue",
                        ],
                      },
                    ],
                  }}
                ></Doughnut>
              </div>

              <div style={{ width: 400, height: 300 }}>
                <Bar
                  data={{
                    labels: [
                      "hired candidates",
                      "rejected candidates",
                      "probationary candidates",
                      "rehire andidates",
                      "selected candidates",
                    ],
                    datasets: [
                      {
                        label: "Poll",
                        data: [
                          data.hired_candidates,
                          data.rejected_candidates,
                          data.probationary_candidates,
                          data.rehire_candidates,
                          data.selected_candidates,
                        ],
                        backgroundColor: [
                          "#005734",
                          "red",
                          "black",
                          "yellow",
                          "pink",
                          "blue",
                        ],
                        borderColor: [
                          "#005734",
                          "red",
                          "black",
                          "yellow",
                          "pink",
                          "blue",
                        ],
                      },
                    ],
                  }}
                ></Bar>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 20 }} className="graph__Item">
            <h6>Teams and tasks</h6>
            <div style={{ width: 400, height: 300 }}>
              <Bar
                data={{
                  labels: ["Teams", "team tasks", "individual tasks"],
                  datasets: [
                    {
                      label: ["Teams", "team tasks", "individual tasks"],
                      data: [data.teams, data.team_tasks, data.tasks],
                      backgroundColor: ["#D3D3D3", "#005734", "black"],
                      borderColor: ["#D3D3D3", "#005734", "black"],
                    },
                  ],
                }}
              ></Bar>
            </div>
          </div>
          <div className="job_applications graph__Item">
            <h6>applications</h6>
            <div>
              <div>
                <div style={{ width: 400, height: 300 }}>
                  <Doughnut
                    data={{
                      labels: ["tasks completed on time", "tasks"],
                      datasets: [
                        {
                          label: "Poll",
                          data: [data.tasks_completed_on_time, data.tasks],
                          backgroundColor: ["#D3D3D3", "#005734"],
                          borderColor: ["#D3D3D3", "#005734"],
                        },
                      ],
                    }}
                  ></Doughnut>
                </div>
              </div>
              <div>
                <div style={{ width: 400, height: 300 }}>
                  <Doughnut
                    data={{
                      labels: ["team tasks completed", "tasks"],
                      datasets: [
                        {
                          label: "Poll",
                          data: [data.team_tasks_completed, data.tasks],
                          backgroundColor: ["#D3D3D3", "#005734"],
                          borderColor: ["#D3D3D3", "#005734"],
                        },
                      ],
                    }}
                  ></Doughnut>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showCustomTimeModal && (
        <FormDatePopup
          firstDate={firstDate}
          lastDate={lastDate}
          setFirstDate={setFirstDate}
          setLastDate={setLastDate}
          handleSubmitDate={handleSubmitDate}
          closeModal={closeModal}
        />
      )}
    </StaffJobLandingLayout>
  );
};
const FormDatePopup = ({
  setFirstDate,
  setLastDate,
  firstDate,
  lastDate,
  handleSubmitDate,
  closeModal,
}) => {
  const handleFormSubmit = () => {
    if (firstDate && lastDate) {
      if (firstDate && lastDate) {
        handleSubmitDate(formatDateAndTime(firstDate), formatDateAndTime(lastDate));
        closeModal();
      } else {
        toast.error("the first or last date are not valid");
        console.log({firstDate, lastDate,isValidDatefirstDate:isValidDate(firstDate),isValidDateLastDate:isValidDate(lastDate) })
      }
    } else {
      toast.error("there is no first date or last date in ");
    }
  };
  return (
    <div className="overlay">
      <div className="form_date_popup_container">
        <div className="closebutton" onClick={() => closeModal()}>
          <AiOutlineClose />
        </div>
        <label htmlFor="first_date">Start Date</label>
        <input
          type="date"
          id="first_date"
          placeholder="mm/dd/yy"
          onChange={(e) => setFirstDate(e.target.value)}
        />
        <label htmlFor="first_date">End Date</label>
        <input
          type="date"
          id="first_date"
          placeholder="mm/dd/yy"
          onChange={(e) => setLastDate(e.target.value)}
        />
        <button onClick={handleFormSubmit}>Get</button>
      </div>
    </div>
  );
};
export default AdminReports;
function formatDateFromMilliseconds(milliseconds) {
  const dateObj = new Date(milliseconds);
  // comment
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}
function formatDateAndTime(inputDate) {
  const dateObj = new Date(inputDate);

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');

  const formattedDateAndTime = `${month}/${day}/${year} 00:00:00`;
  return formattedDateAndTime;
}
function isValidDate(inputDate) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const dateRegex =
    /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/(19\d\d|20\d\d|2023)$/;
  if (!dateRegex.test(inputDate)) {
    return false;
  }
  const [month, day, year] = inputDate.split("/").map(Number);
  if (month < 1 || month > 12) {
    return false;
  }
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return false;
  }
  if (year !== currentYear && year !== currentYear - 1) {
    return false;
  }
  return true;
}

function extractNumber(inputString) {
  if(inputString === undefined) return 0
  const cleanedString = inputString.replace('%', '').trim();
  const number = parseFloat(cleanedString).toFixed(2);
  return parseFloat(number);}