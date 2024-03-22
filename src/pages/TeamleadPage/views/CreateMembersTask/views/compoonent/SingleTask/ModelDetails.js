import { useMediaQuery } from '@mui/material';
import { AirlineSeatFlat } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { editTeamTask } from '../../../../../../../services/teamleadServices';
import { arrayToObject, objectToArray } from './helper/arrayToObject';
import { useCurrentUserContext } from '../../../../../../../contexts/CurrentUserContext';
import { AiTwotoneEdit } from 'react-icons/ai';
import './SingleTask.scss';
import Select from 'react-select';
import LoadingSpinner from '../../../../../../../components/LoadingSpinner/LoadingSpinner';

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 7px 29px 0 rgba(100, 100, 111, 0.2);
  width: 450px;
  position: relative;
  `;

export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: black;
`;
export const EditButton = styled.button`
position: absolute;
top: 20px;
right: 50px;
background-color: transparent;
border: none;
cursor: pointer;
font-size: 18px;
color: black;
`;

const ModalDetails = ({ 
    taskname, 
    status, 
    memberassign, 
    onClose, 
    description, 
    subtasks, 
    taskId, 
    data, 
    setTasks, 
    date, 
    teamOwner, 
    completeTaskFunction, 
    teamMembers,
}) => {
    const [subTasks, setSubTask] = useState(objectToArray(subtasks));
    const [edit, setEdit] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const initialData = { taskname, description, assignee: memberassign, subtasks: objectToArray(subtasks) }
    const [editData, setEditData] = useState({ taskname, description, assignee: memberassign, subtasks: objectToArray(subtasks) })
    const [checkedSubtask, setCheckedSubtask] = useState([]);
    const isSmallScreen = useMediaQuery('(max-width: 767px)');
    const { currentUser } = useCurrentUserContext();
    const [ subtasksBeingEdited, setSubtasksBeingEdited ] = useState([]);

    const EditFunction = () => {
        if (editData.assignee.length < 1) return toast.info('Please select at least one assignee');

        const DATA = {
            ...data,
            title: editData.taskname,
            description: editData.description,
            assignee: editData.assignee,
            due_date: date,
            subtasks: arrayToObject(editData.subtasks),
        }

        setEditLoading(true);

        editTeamTask(taskId, DATA)
            .then(resp => {
                toast.success('task updated successfully');
                setTasks(tasks => tasks.map(task => task._id === taskId ? DATA : task));
                setEdit(false);
                setEditLoading(false);
            })
            .catch(err => {
                toast.error("something went wrong");
                setEditLoading(false);
            })
    }

    const cancelEdit = () => {
        setEditData(initialData);
        setEdit(false)
    }

    const editSubtaskStatus = (name, value) => {
        setSubtasksBeingEdited((prev) => {
            return [
                ...prev, 
                name
            ]
        })

        const newData = {
            ...data,
            subtasks: {
                ...arrayToObject(subTasks),
                [name]: !value
            }
        }

        editTeamTask(taskId, newData)
            .then(() => {
                setSubTask(subTasks.map(t => t.name === name ? { name, value: !t.value } : t))
                setTasks(previousTask => previousTask.map(t => t._id === taskId ? {
                    ...t, subtasks: {
                        ...arrayToObject(subTasks),
                        [name]: !value
                    }
                } : t
                ))
                toast.success(`Successfully updated status of subtask: '${name}'`);
                setSubtasksBeingEdited(subtasksBeingEdited.filter(item => item !== name));
            })
            .catch(err => {
                toast.error(err.message)
                setSubtasksBeingEdited(subtasksBeingEdited.filter(item => item !== name));
            })
    }
    
    useEffect(() => {
        if (subtasks !== undefined && Object.keys(subtasks).length > 0) {
            setCheckedSubtask(subTasks.filter(s => s.value === true).map(s => s.name))
            if (subTasks.filter(s => s.value === true).map(s => s.name).length === editData.subtasks.length) {
                completeTaskFunction()
            } else {
                console.log(subTasks.filter(s => s.value === true).map(s => s.name).length, editData.length)
            }
        }
    }, [subTasks])

    return (
        <ModalContainer>
            <ModalContent style={{
                width: isSmallScreen ? '90%' : '450px',
                maxHeight: '75%',
                overflowY: 'auto',
            }}>
                <h3 style={{
                    fontSize: '1.5rem',
                    fontFamily: 'Poppins, sans-serif',
                    letterSpacing: '0.03em',
                    color: '#005734'
                }}>
                    {
                        isSmallScreen ? 
                            'View Details' 
                        :
                        'View Team Task Details'
                    }
                </h3>

                <div>
                    <h4>Task</h4>
                    {
                        edit ?
                            <input placeholder='edit task name' value={editData.taskname} onChange={e => setEditData({ ...editData, taskname: e.target.value })} className='input' />
                            :
                            <p style={{ fontSize: '0.8rem' }}>{editData.taskname}</p>
                    }
                </div>
                <br />
                {
                    subTasks.length > 0 ?
                        <>
                            <div className='subTasks'>
                                <h4>Subtasks</h4>
                                {
                                    editData.subtasks.map((t, ind) => <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        {
                                            teamOwner === currentUser.userinfo.username && (
                                                edit
                                                    ?
                                                    <input
                                                        className='input'
                                                        value={t.name}
                                                        onChange={(e) => {
                                                            setEditData({
                                                                ...editData,
                                                                subtasks: editData.subtasks.map((v, indx) =>
                                                                    indx === ind
                                                                        ?
                                                                        { ...v, name: e.target.value }
                                                                        :
                                                                        v
                                                                )
                                                            })
                                                        }}
                                                    />
                                                    :
                                                    <>
                                                        <input
                                                            type="checkbox"
                                                            value={t.name}
                                                            key={t.name}
                                                            onChange={() => editSubtaskStatus(t.name, t.value)}
                                                            name={t.name}
                                                            checked={checkedSubtask.includes(t.name)}
                                                            disabled={subtasksBeingEdited.includes(t.name) ? true : false}
                                                        />
                                                        <p>
                                                            {
                                                                subtasksBeingEdited.includes(t.name) ?
                                                                    'Updating....'
                                                                :
                                                                t.name
                                                            }
                                                        </p>
                                                    </>

                                            )
                                        }
                                    </div>)
                                }
                            </div>
                            <br />
                        </>
                        :
                        null
                }
                <div>
                    <h4>Description</h4>
                    {
                        edit ?
                            <input placeholder='edit task description' onChange={e => setEditData({ ...editData, description: e.target.value })} className='input' value={editData.description} />
                            :
                            <p style={{ fontSize: '0.8rem', whiteSpace: 'pre-line' }}>{editData.description}</p>
                    }
                </div>
                <br />
                <div>
                    <h4>Status</h4>
                    <p style={{ fontSize: '0.8rem' }}>{status ? 'Completed' : 'In Progress'}</p>
                </div>
                <div>

                </div>
                <br />
                <div>
                    <h4>{`Member${memberassign?.length > 1 ? 's' : ''} Assigned`}</h4>
                    {
                        edit ?
                        <Select 
                            value={editData.assignee.map(assignee => {
                                return {
                                    label: assignee,
                                    value: assignee,
                                }
                            })}
                            onChange={(val) => setEditData({
                                ...editData,
                                assignee: val.map(item => item.value),
                            })}
                            options={teamMembers.map(member => {
                                return {
                                    label: member,
                                    value: member,
                                }
                            })}
                            isMulti={true}
                            className='member__Asign__Team'
                            placeholder={'Select team members'}
                        /> 
                        :
                        <>
                            {memberassign?.map((membur, index) => {
                                // Assuming membur is a string with first and last name separated by a space
                                const nameParts = membur.split(' ');
                                const firstName = nameParts[0];
                                // You can customize the size and style of the avatar using props of the Avatar component
                                return <Avatar key={index} name={firstName} size="40" round />;
                            })}
                        </>
                    }
                </div>
                {
                    date && typeof date != 'Invalid Date' && <>
                        <br />
                        <div>
                            <h4>Due Date</h4>
                            <p style={{ fontSize: '0.8rem' }}>{new Date(date).toDateString()}</p>
                        </div>
                    </>
                }
                {
                    edit
                    &&
                    <div style={{ margin: '0 0 0 auto', width: 'fit-content', display: 'flex', alignItems: 'center' }}>
                        <button style={{
                            marginRight: '10px',
                            width: '90px',
                            padding: '7px 4px',
                            borderRadius: '5px',
                            outline: 'none',
                            border: 'none',
                            fontWeight: 500,
                            backgroundColor: '#9a9a9a',
                            color: 'white',
                            cursor: 'pointer',
                            fontFamily: 'Poppins'
                        }}
                            onClick={cancelEdit}
                            disabled={editLoading}
                        >Cancel</button>
                        <button
                            style={{
                                width: '90px',
                                padding: '7px 4px',
                                borderRadius: '5px',
                                outline: 'none',
                                border: 'none',
                                fontWeight: 500,
                                backgroundColor: '#005734',
                                color: 'white',
                                cursor: 'pointer',
                                fontFamily: 'Poppins'
                            }}
                            onClick={EditFunction}
                            disabled={editLoading}
                        >
                            {
                                editLoading ?
                                    <>
                                        <LoadingSpinner 
                                            color={'#fff'} 
                                            width={'1rem'}
                                            height={'1rem'}
                                        /> 
                                    </>
                                :
                                'Edit'
                            }
                        </button>
                    </div>
                }
                <CloseButton onClick={onClose}>
                    <FaTimes />
                </CloseButton>
                {
                    teamOwner === currentUser?.userinfo?.username && <>
                        <EditButton onClick={() => { setEdit(true) }}>
                            <AiTwotoneEdit />
                        </EditButton>
                    </>
                }
            </ModalContent>
        </ModalContainer>
    );
};

export default ModalDetails;
