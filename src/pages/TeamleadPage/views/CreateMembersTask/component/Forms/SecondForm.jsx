import React  ,{useEffect} from 'react'
import { useValues } from '../../context/Values'
import axios from 'axios'
import { useState } from 'react';
// import Checkbox from '../Checkbox';
import { initialState } from '../../context/Values';
import { useCurrentUserContext } from '../../../../../../contexts/CurrentUserContext';
import { toast } from 'react-toastify';
import Checkbox from '../Checkbox';
import { EditTeam } from '../../../../../../services/createMembersTasks';
const SecondForm = ({}) => {
  const { currentUser } = useCurrentUserContext();
  const {data ,setdata} = useValues() ; 
  const [task , settask] = useState({choosed:false , value:""});
  const [choosedTeam , setChoosedTeam] = useState({choosed:false , value:"",id:null})
  const [loading ,setloading] = useState(false) ; 
  const {individual_task , team_task} = data ;
  const [teams ,setteams] = useState([]) ; 
  const [projectname , setprojectname] = useState("") ; 
  const [singlemembertask ,setsinglemembertask] =useState("") ;
     
            const handleCheckboxChange = (event) => {
                        const value = event.target.value;
                        if (event.target.checked) {
                                    setdata({...data , selected_members:[...data.selected_members , value]});
                        } else {
                                    setdata({...data ,selected_members:data.selected_members.filter((box) => box !== value)});
                        }
                      };
                      const handleCheckboxChange2 = (event) => {
                        const value = event.target.value;
                        if (event.target.checked) {
                                    setdata({...data , selected_members:[ value]});
                        } else {
                                    setdata({...data ,selected_members:[]});
                        }
                      };
                      const changeTeamName = (e) =>{
                        console.log({...data , team_name:e.target.value}) ; 
                        setdata({...data , team_name:e.target.value}) ; 
                      }
            useEffect(()=>{
              console.log({id:choosedTeam.id})
              if(choosedTeam.value){
              console.log("PLEASE BRO WORK 1")
                console.log({choosedValue:data.TeamsSelected.find(v => v.team_name === choosedTeam.value).members})
                setdata({...data , membersEditTeam:[...data.TeamsSelected.find(v => v.team_name === choosedTeam.value).members]})
              }
            },[choosedTeam])


            const createSingleMemberTask = () => {
              console.log("ala said : applicant:",data.selected_members[0])
              axios.post("https://100098.pythonanywhere.com/task_management/create_task/",{
              project:[projectname] ,
              applicant:data.selected_members[0] ,
              task:singlemembertask,
              task_added_by:currentUser.userinfo.username,
              company_id: currentUser.portfolio_info[0].org_id,
              data_type:currentUser.portfolio_info[0].data_type , 
              task_created_date: new Date().toString() , 
            })
            .then(resp => {
              console.log(resp) ; 
              setdata({...initialState , RESP_INDV_TASK:"Response" ,TeamsSelected:data.TeamsSelected}) ; 
              toast("task created ")

            })
            .catch(err => {
              console.log(err)
            })
            }

            // patcg
            const patchTeam = () => {
              const id = data.TeamsSelected.find(m => m.team_name === choosedTeam.value)["id"] 
              const teamName = data.TeamsSelected.find(m => m.team_name === choosedTeam.value)["team_name"] 
              EditTeam(choosedTeam.id,{ "team_name":teamName ,
              "members":data?.membersEditTeam})
              .then(resp => {console.log(resp); toast(`members of team ${teamName} is updated !`) ; setdata({...initialState ,RESP_INDV_TASK:"Response", TeamsSelected:data.TeamsSelected })}) 
              .catch(err => {console.log(err);console.log({team:data?.membersEditTeam})})
          }
                      if(loading)return <h1>Loading...</h1>
  return (
    <div>   
            {
                        ( team_task) ? 
                        <>
                        {
                          (!task.choosed) ? <>
                          <button onClick={()=>{settask({choosed:true , value:"new Team"})}}>Create a new Team</button>
                          <button onClick={()=>{settask({choosed:true , value:"existing Team"})}}>Use an existing Team</button>

                          </> :
                          <>
                          {
                            (task.value === "new Team") ? 
                            <>
                             {data.memebers.map((member , i) => 
                                                <label>
                                                <input
                                                  type="checkbox"
                                                  value={member}
                                                  onChange={handleCheckboxChange}
                                                />
                                                {member}
                                              </label>
                                  )}
                              <br />
                              <input type="text" placeholder='' onChange={changeTeamName}  />
                            
                            </>
                            :
                            <>
                            {
                              !choosedTeam.choosed ? 
                              
                              data.TeamsSelected.map(v => <>
                                <button onClick={()=>setChoosedTeam({choosed:true , value:v.team_name ,id:v._id})}>{v.team_name}</button> <br />
                              </>) 
                              : 
                              <>
                              <h1>{choosedTeam.value}</h1>
                                {data.memebers.map((member , i) => 
                                                <>
                                              
                                              <Checkbox choosedTeamValue={choosedTeam.value} membersEditTeam={data.membersEditTeam} Member={member} key={i} />
                                              </>
                                
                                  )}
                                  {
                                    <>
                                    <br />
                                    <button onClick={()=>{patchTeam()}}>{"edit"}</button>
                                    </>
                                  }
                              </>
                            }
                            </>
                          }
                          </>
                        }
                          <br />

                  
                             </>       
                        :
                        <>
                    {data.memebers.map((member , i) => 
                                            <label>
                                            <input
                                              type="radio"
                                              value={member}
                                              onChange={handleCheckboxChange2}
                                              checked={member === data.selected_members[0]}
                                            />
                                            {member}
                                          </label>
                                )}
                                <input type="text"  placeholder='project name' value={projectname} onChange={e => setprojectname(e.target.value)}/>
                                {/* 
  const [singlemembertask ,setsinglemembertask] =useState("") ;   
                                 */}
                                <input type="text"  placeholder='task name'  value={singlemembertask} onChange={e => setsinglemembertask(e.target.value)}/>

                        <button onClick={(projectname && singlemembertask) ? createSingleMemberTask : alert("all inputs are required!")}>add Task for single member</button>
                                   </>
            }
            {/* asdasdasd */}
    </div>
  )
}

export default SecondForm