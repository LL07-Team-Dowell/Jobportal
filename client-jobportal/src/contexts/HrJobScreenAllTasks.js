import { createContext, useContext, useState } from "react";
const HrJobScreenAllTasksContext = createContext();
export const useHrJobScreenAllTasksContext = () => {
            return useContext(HrJobScreenAllTasksContext);
}
export const HrJobScreenAllTasksContextProvider = ({ children }) => {
            const [ allTasks, setAllTasks ] = useState([]);


            return (
            <HrJobScreenAllTasksContext.Provider value={{ allTasks, setAllTasks }}>
            {children}
            </HrJobScreenAllTasksContext.Provider>
            )
}
