import React, { useEffect, useState } from "react";
import './style.css';
import { useCurrentUserContext } from "../../../../../contexts/CurrentUserContext";
import { requestToUpdateTask } from "../../../../../services/candidateServices";
import { toast } from "react-toastify";

function RequestTask({ project, updatetaskdate, setShowModal }) {
    const { currentUser } = useCurrentUserContext();
    const [formData, setFormData] = useState({
        company_id: "",
        username: "",
        update_task_date: updatetaskdate,
        portfolio_name: "",
        project: project,
        update_reason: ""
    });
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        setFormData({
            ...formData,
            company_id: currentUser.portfolio_info[0].org_id,
            username: currentUser.portfolio_info[0].username,
            portfolio_name: currentUser.portfolio_info[0].portfolio_name,
        });
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.update_reason) {
            toast.warning("Please enter a reason!")
        } else if (formData.update_reason) {
            setLoading(true);

            try {
                const resp = await requestToUpdateTask(formData);
                console.log("Response Data:", resp);
                setFormData({
                    update_reason: ""
                })
                toast.success("Task request update created successfully!")
                setShowModal(false);
                setLoading(false);
            } catch (error) {
                toast.warning("Failed to add task request");
                setLoading(false);
            }

        }
    };


    return (
        // <Wrappen>
        <div className="update-task">
            <h3>Request to update your task</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Project</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={project}
                        disabled
                    />
                </div>
                <div>
                    <label htmlFor="age">Update Date</label>
                    <input
                        type="text"
                        id="age"
                        name="age"
                        value={updatetaskdate}
                        disabled
                    />
                </div>
                <div>
                    <label htmlFor="description">Reason why you failed to update:</label>
                    <textarea
                        id="description"
                        name="update_reason"
                        value={formData.update_reason}
                        onChange={handleChange}
                        style={{ resize: 'none', padding: "0.2rem 0.5rem" }}
                    >
                    </textarea>
                </div>
                <div className="request-buttons">
                    <button 
                        disabled={loading ? true : false}
                    >
                        Submit
                    </button>
                    <button 
                        className="cancel" 
                        onClick={() => setShowModal(false)} 
                        disabled={loading ? true : false}
                    >
                        Cancel
                    </button>
                </div>
            </form >
        </div >
        // </Wrappen>
    );
}

export default RequestTask;
