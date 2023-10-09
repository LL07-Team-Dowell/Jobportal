import { FiHome } from "react-icons/fi";
import { GiNotebook } from "react-icons/gi";
import { ImStack } from "react-icons/im";
import { IoCalendarOutline } from "react-icons/io5";

export const hrNavigationLinks = [
    {
        linkAddress: "/",
        icon: <FiHome />,
        text: "Home",
    },
    // {
    //     linkAddress: "/tasks",
    //     icon: <ImStack />,
    //     text: "Work logs"
    // },
    {
        linkAddress: "/hr-training",
        icon: <GiNotebook />,
        text: "Training"
    },
    {
        linkAddress: "/attendance",
        icon: <IoCalendarOutline />,
        text: "Attendance",
    }
]