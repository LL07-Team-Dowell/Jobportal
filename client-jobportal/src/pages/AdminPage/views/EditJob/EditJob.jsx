import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AiFillCloseCircle } from 'react-icons/ai';
import { AiFillPlusCircle } from 'react-icons/ai';
import { BsFillBookmarkFill } from 'react-icons/bs';
import { IoIosArrowBack } from "react-icons/io";
import "./EditJob.css";
import Loading from '../../../../components/LoadingSpinner/LoadingSpinner';
import StaffJobLandingLayout from '../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { MdArrowBackIos } from 'react-icons/md';
import { useJobContext } from '../../../../contexts/Jobs';


function EditJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [updateLoading, setUpdateLoading] = useState(false)
  // console.log(updateLoading)
  const [formData, setFormData] = useState({
    job_title: '',
    skills: '',
    job_category: '',
    type_of_job: '',
    is_active: '',
    payment: '',
    description: '',
    time_interval: '',
    general_terms: [],
    technical_specification: [],
    payment_terms: [],
    workflow_terms: [],
    other_info: [],
  });
  // console.log(formData.is_active);
  // console.log(formData);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 10000)
  }, []);

  const { jobs, setJobs } = useJobContext();
  const { id } = useParams();
  const singleJob = jobs?.filter(job => job["_id"] === id)[0];
  const { payment_terms, company_id, created_by, created_on, data_type, description, document_id, eventId, general_terms, is_active, job_category, job_number, job_title, other_info, payment, qualification, skills, technical_specification, time_interval, type_of_job, workflow_terms, _id } = singleJob;
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const response = await fetch('https://100098.pythonanywhere.com/admin_management/get_jobs/', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ "company_id": "100098" }),
  //       });
  //       const data = await response.json();
  //       setFormData(data.response.data[0]);
  //     } catch (e) {
  //       setError(e);
  //     }

  //     setLoading(false)
  //   }

  //   fetchData();
  // }, []);


  const [selectedOption, setSelectedOption] = useState(job_category);
  const [typeofOption, setTypeofOption] = useState(type_of_job)
  useEffect(() => {
    const formDataUpdates = {};
    switch (true) {
      case general_terms.length > 0:
        formDataUpdates.general_terms = general_terms;
        break;
      case technical_specification.length > 0:
        formDataUpdates.technical_specification = technical_specification;
        break;
      case payment_terms.length > 0:
        formDataUpdates.payment_terms = payment_terms;
        break;
      case workflow_terms.length > 0:
        formDataUpdates.workflow_terms = workflow_terms;
        break;
      case other_info.length > 0:
        formDataUpdates.other_info = other_info;
        break;
      default:
        break;
    }
    setFormData(prevState => ({
      ...prevState,
      ...formDataUpdates
    }));

  }, [general_terms, payment_terms, technical_specification, other_info, workflow_terms]);

  console.log(general_terms.length);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handltTypeOfOption = (e) => {
    setTypeofOption(e.target.value);
  }

  const toggleJobStatus = () => {
    setFormData({
      ...formData,
      is_active: formData.is_active === 'true' ? 'false' : 'true',
    });
  };

  const handleRemoveGeneralTerms = (index) => {
    const newItems = [...formData.general_terms];
    const filterItems = newItems.filter((currElm, ind) => ind !== index)
    setFormData({ ...formData, general_terms: [...filterItems] })
  }

  const handleRemoveSpecificationTerms = (index) => {
    const newItems = [...formData.technical_specification];
    const filterItems = newItems.filter((currElm, ind) => ind !== index)
    setFormData({ ...formData, technical_specification: [...filterItems] })
  }

  const handleRemovePaymentTerms = (index) => {
    const newItems = [...formData.payment_terms];
    const filterItems = newItems.filter((currElm, ind) => ind !== index)
    setFormData({ ...formData, payment_terms: [...filterItems] })
  }

  const handleRemoveWorkflow = (index) => {
    const newItems = [...formData.workflow_terms];
    const filterItems = newItems.filter((currElm, ind) => ind !== index)
    setFormData({ ...formData, workflow_terms: [...filterItems] })
  }

  const handleRemoveOthers = (index) => {
    const newItems = [...formData.other_info];
    const filterItems = newItems.filter((currElm, ind) => ind !== index)
    setFormData({ ...formData, other_info: [...filterItems] })
  }

  const handleChangeInTermsArray = (valueEntered, termsKey, indexPassed) => {
    setFormData((prevValue) => {
      const copyOfPrevValueObj = { ...prevValue }
      // take a copy
      const copyOfArray = copyOfPrevValueObj[termsKey].slice()
      // modification made to the copy
      copyOfArray[indexPassed] = valueEntered;

      copyOfPrevValueObj[termsKey] = copyOfArray

      return copyOfPrevValueObj
    })
  }

  const handleAddTerm = (termsKey) => {
    // console.log(termsKey);
    setFormData((prevValue) => {
      const copyOfPrevValueObj = { ...prevValue }

      // take a copy
      const copyOfArray = copyOfPrevValueObj[termsKey]?.slice()

      // making modifications to the copy
      copyOfArray?.push("")

      copyOfPrevValueObj[termsKey] = copyOfArray

      return copyOfPrevValueObj
    })
  }


  const handleSubmit = (event) => {
    setLoading(true);
    try {
      fetch('https://100098.pythonanywhere.com/admin_management/update_jobs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setLoading(false)
        });
    } catch (e) {
      setError(e)
    }
  };

  return (
    <> {loading ? <Loading /> :
      <StaffJobLandingLayout adminView={true}
        adminAlternativePageActive={true}
        pageTitle={"Edit  Job"}
        showAnotherBtn={true}
        btnIcon={<MdArrowBackIos size="1.5rem" />}
        handleNavIcon={() => navigate(-1)}
      >
        <Wrapper>
          <div className="container edit__page_Admin__T">
            {/* <div className="back__button">
              <Link to={"/"}>
                <IoIosArrowBack />
              </Link>
            </div>

            <div className="main__titles">
              <h2>Edit Job</h2>
              <h3>Project Management <span style={{ "fontWeight": "400" }}>- UX Living Lab</span> </h3>
            </div> */}


            <div className="job__details">
              <div className="job__detail__title">
                <h3>Job Details</h3>
              </div>

              <form onSubmit={handleSubmit}>
                <div className='input__data'>
                  <label htmlFor="job_title">Name of Job</label>
                  <input
                    type="text"
                    id="job_title"
                    name="job_title"
                    // placeholder='UI Design'
                    defaultValue={job_title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='input__data'>
                  <label htmlFor="skills">Skills</label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    // placeholder='Figma, XD'
                    defaultValue={skills}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='input__data'>
                  <label htmlFor="job_category">Job Category</label>
                  <div className="input__data__row">
                    <div className="data">
                      <input type="radio"
                        id="freelancer"
                        name="options"
                        value="Freelancer"
                        checked={selectedOption === 'Freelancer'}
                        onChange={handleOptionChange}
                      />
                      <label htmlFor="freelancer">Freelancer</label>
                    </div>

                    <div className="data">
                      <input
                        type="radio"
                        id="employe"
                        name="options"
                        value="Employee"
                        checked={selectedOption === 'Employee'}
                        onChange={handleOptionChange}
                      />
                      <label htmlFor="employe">Employee</label>
                    </div>

                    <div className="data">
                      <input
                        type="radio"
                        id="internship"
                        name="options"
                        value="Internship"
                        checked={selectedOption === 'Internship'}
                        onChange={handleOptionChange}
                      />
                      <label htmlFor="internship">Internship</label>
                    </div>

                    <div className="data">
                      <input
                        type="radio"
                        id="research associate"
                        name="options"
                        value="Research Associate"
                        checked={selectedOption === 'Research Associate'}
                        onChange={handleOptionChange}
                      />
                      <label htmlFor="research associate">Research Associate</label>
                    </div>
                  </div>
                </div>


                {selectedOption.length < 1 ? (
                  <></>
                ) : selectedOption === "Freelancer" ? (
                  <>
                    <div className='input__data'>
                      <label htmlFor="job_category">Type of Job</label>
                    </div>
                    <div className="type_of_job">

                      <div className="data">
                        <input
                          type="radio"
                          id="time"
                          name="Task based"
                          value="Task based"
                          checked={typeofOption === 'Task based'}
                          onChange={handltTypeOfOption}
                        />
                        <label htmlFor="employe">Task Based</label>
                      </div>

                      <div className="data">
                        <input
                          type="radio"
                          id="task"
                          name="Time based"
                          value="Time based"
                          checked={typeofOption === 'Time based'}
                          onChange={handltTypeOfOption}
                        />
                        <label htmlFor="employe">Time Based</label>
                      </div>

                    </div>
                  </>
                ) : selectedOption === "Internship" ? (
                  <>
                    <div className='input__data'>
                      <label htmlFor="job_category">Type of Job</label>
                    </div>
                    <div className="type_of_job">
                      <div className="data">
                        <input
                          type="radio"
                          id="Full time"
                          name="Full time"
                          value="Full time"
                          checked={typeofOption === 'Full time'}
                          onChange={handltTypeOfOption}
                        />
                        <label htmlFor="internship">Full Time</label>
                      </div>
                      <div className="data">
                        <input
                          type="radio"
                          id="Full time"
                          name="Part time"
                          value="Part time"
                          checked={typeofOption === 'Part time'}
                          onChange={handltTypeOfOption}
                        />
                        <label htmlFor="employe">Part Time</label>
                      </div>

                    </div>
                  </>
                ) : selectedOption === "Employee" ? (
                  <>
                    <div className='input__data'>
                      <label htmlFor="job_category">Type of Job</label>
                    </div>
                    <div className="type_of_job">
                      <div className="data">
                        <input
                          type="radio"
                          id="Full time"
                          name="Full time"
                          value="Full time"
                          checked={typeofOption === 'Full time'}
                          onChange={handltTypeOfOption}
                        />
                        <label htmlFor="employe">Full Time</label>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                <div className='input__data'>
                  <label htmlFor="skills">Time Period</label>
                  <input
                    type="text"
                    id="time_interval"
                    name="time_interval"
                    // placeholder='1 Week'
                    value={time_interval}
                    onChange={handleInputChange}
                  />
                </div>

                <div className='input__data__row'>
                  <label>State of Job</label>
                  <div className="data">
                    {/* <input type="checkbox" id="check1" className="toggle" onClick={toggleJobStatus} />
                  <label htmlFor="check1"></label> */}
                    {/* <label htmlFor="jobStatus">{formData.is_active === 'true' ? "Active" : "Inactive"}</label> */}

                    <input
                      className="active_checkbox"
                      type="checkbox"
                      name={"is_active"}
                      checked={is_active}
                      onChange={toggleJobStatus}
                      required
                    />
                  </div>

                </div>
                <div className='input__data'>
                  <label htmlFor="payment">Payment</label>
                  <input
                    type="text"
                    id="payment"
                    name="payment"
                    // placeholder='30$'
                    defaultValue={payment}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='input__data'>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    // placeholder='1. Setting goals and developing plans for business and revenue growth. Researching, planning, and implementing new target market initiatives.'
                    defaultValue={description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="gernaral__term">
                  <label>General Terms</label>
                  <div className="general__items">
                    {
                      React.Children.toArray(formData.general_terms?.map((x, i) => {
                        return <div className="item">
                          <p> <input value={x} placeholder="genaral term" onChange={(e) => handleChangeInTermsArray(e.target.value, "general_terms", i)} /> </p>
                          <AiFillCloseCircle onClick={() => { handleRemoveGeneralTerms(i) }} />
                        </div>
                      }))
                    }
                  </div>

                  <div className="add__item">
                    <AiFillPlusCircle onClick={() => handleAddTerm("general_terms")} />
                    <label>Add General Terms</label>
                  </div>
                </div>


                <div className="gernaral__term">
                  <label>Technical Specifications</label>
                  <div className="general__items">
                    {
                      React.Children.toArray(formData.technical_specification?.map((x, i) => {
                        return <div className='item'>
                          <p> <input value={x} placeholder="specification term" onChange={(e) => handleChangeInTermsArray(e.target.value, "technical_specification", i)} /> </p>
                          <AiFillCloseCircle onClick={() => { handleRemoveSpecificationTerms(i) }} />
                        </div>
                      }))
                    }
                  </div>
                  <div className="add__item">
                    <AiFillPlusCircle onClick={() => handleAddTerm("technical_specification")} />
                    <label>Add Specifications</label>
                  </div>
                </div>



                <div className="gernaral__term">
                  <label>Payment Term</label>
                  <div className="general__items">
                    {
                      React.Children.toArray(formData.payment_terms?.map((x, i) => {
                        return <div className='item'>
                          <p> <input value={x} placeholder="payment term" onChange={(e) => handleChangeInTermsArray(e.target.value, "payment_terms", i)} /> </p>
                          <AiFillCloseCircle onClick={() => { handleRemovePaymentTerms(i) }} />
                        </div>
                      }))
                    }
                  </div>
                  <div className="add__item">
                    <AiFillPlusCircle onClick={() => handleAddTerm("payment_terms")} />
                    <label>Add Payment Terms</label>
                  </div>
                </div>

                <div className="gernaral__term">
                  <label>Workflow</label>
                  <div className="general__items">
                    {
                      React.Children.toArray(formData.workflow_terms?.map((x, i) => {
                        return <div className='item'>
                          <p><input value={x} placeholder="workflow" onChange={(e) => handleChangeInTermsArray(e.target.value, "workflow_terms", i)} /> </p>
                          <AiFillCloseCircle onClick={() => { handleRemoveWorkflow(i) }} />
                        </div>
                      }))
                    }
                  </div>
                  <div className="add__item">
                    <AiFillPlusCircle onClick={() => handleAddTerm("workflow_terms")} />
                    <label>Add Workflow</label>
                  </div>
                </div>

                <div className="gernaral__term">
                  <label>Others</label>
                  <div className="general__items">
                    {
                      React.Children.toArray(formData.other_info?.map((x, i) => {
                        return <div className='item'>
                          <p><input value={x} placeholder="others" onChange={(e) => handleChangeInTermsArray(e.target.value, "other_info", i)} /> </p>
                          <AiFillCloseCircle onClick={() => { handleRemoveOthers(i) }} />
                        </div>
                      }))
                    }
                  </div>
                  <div className="add__item">
                    <AiFillPlusCircle onClick={() => handleAddTerm("other_info")} />
                    <label>Add Others</label>
                  </div>
                </div>
                <button type="submit" className="save__button" disabled={updateLoading}>
                  {updateLoading ? "Save..." : "Save"}<BsFillBookmarkFill />
                </button>
              </form>
            </div>
          </div>
        </Wrapper>
      </StaffJobLandingLayout>
    }
    </>
  )
}

const Wrapper = styled.section`
  .container{
    width: 1300px;
    margin: auto;
    background: #ffff;
    padding-bottom: 10rem;
    .back__button {
      position: absolute;
      top: 20px;
      left: 50px;
      color:black;
      background-color: #f3f8f5;
      font-size: 20px;
      margin: 1rem 0 0 1rem;
      padding: 0.1rem 0.4rem;
      padding-top: 8px;
      border-radius: 0.5rem;
      border: none;
      box-shadow: inset 0px 1.7px 8px rgba(0, 0, 0, 0.16);
      cursor: pointer;
    }
   
    .type_of_job{
      padding: 0;
    }

    .type_of_job label{
      padding: 0 0.4rem;
      font-size: 0.8rem;
      font-weight: 400;
    }

    .main__titles{
        padding-top: 70px;
        padding: 70px 0px 20px 20px;
        h2{
            color: #005734;
            font-weight: 800;
            font-size: 32px;
            letter-spacing: 0.05em;
            display: flex;
            align-items: center;
        }

        h3{
            font-size: 1rem;
            font-weight: 600;
            color: #7c7c7c;
        }
    }
    
    .job__details{
        background-color: #F3F8F4;
        padding: 40px 35px;
        border-radius: 10px;
        width: 85%;
        margin: auto;
        
        .job__detail__title{
            background-color:#005734;
            color: #fff;
            padding: 1.4rem 0 1.4rem 2.4rem;
            border-radius: 1rem 1rem 0 0;
            margin: 0;

            h3{
              color:#fff;
              margin-bottom: 0;
              font-size: 1.2rem;
              font-weight: 600;
            }
        }

        form{
            padding:10px 40px;
            background-color:#fff;

            .input__data {
                display:flex;
                flex-direction: column;
                padding: 10px 0;

                label{
                    padding-bottom:4px;
                    color: #005734;
                    font-weight: 600;
                    font-size: 1rem;
                    padding: 0.6rem 0;
                }

                input {
                  padding: 1.1rem 1.1rem 1.1rem 2rem;                    border-radius: 10px;
                    border: 1px solid #005734;
                }

                textarea#description {
                    height: 258px;
                    padding: 15px;
                    border-radius: 10px;
                    border: 1px solid #005734;
                    font-family: 'poppins';
                }
            }

            .input__data__row{
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                label{
                    color: #005734;
                    font-weight: 600;
                    padding: 8px 0;
                    font-size: 0.8rem;
                }

                .data{    
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    input[type="radio"] {
                        color: #005734;
                        cursor: pointer;
                    }
                      
                }

                .data label{
                    font-weight:400;
                    margin-left:10px;
                    font-size: 0.8rem;
                    color: #000;
                }
            }

            .item{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding:10px 0;
                position: relative;
                
                p{
                    font-weight: 300;
                    color: #7E7E7E;
                    font-size: 14px;
                    display: flex;
                    width: 90%;

                    input{
                      width: 750px;
                      border: none;
                      color: #7E7E7E;
                      font-size: 14px;
                    }
                }
                svg {
                    color: #B8B8B8;
                    position: absolute;
                    right: 0;
                }                

            }

            .gernaral__term{
                padding-bottom:4px;
                color: #005734;
                font-weight: 600;
            }


            .add__item {
                text-align: right;
                padding: 10px 0;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                cursor: pointer;

                label{
                    color: #000;
                }

                svg {
                    font-size: 40px;
                    margin-right:10px;
                }
            }

           .save__button{
                display: flex;
                align-items: center;
                background-color: #005734;
                border: none;
                padding: 10px 50px;
                color: #fff;
                font-size: 20px;
                border-radius: 10px;
                cursor: pointer;
                svg{
                    color: #fff;
                    margin-left: 10px;
                }
           }

           button.save__button:hover {
            box-shadow: 0 0px 26px 5px #005734;
            transition: 0.3s ease-in-out;
        }

        }
    }     
    }

    @media only screen and (max-width: 1300px){
        .container{
           width: 95%; 
        }
    }

    @media only screen and (max-width: 900px){
      .item{
        p{
          input{
          }
        }
      }
    }
  `

export default EditJob;



