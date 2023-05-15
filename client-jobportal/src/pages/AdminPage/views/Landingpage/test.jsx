import { useEffect, useState } from "react";

const Testt = ({ durationInSec }) => {
    const [progressVal, setProgressVal] = useState(0);

    useEffect(() => {

        const interval = setInterval(
            () => setProgressVal((prevVal) => prevVal + 1)
            ,
            (durationInSec * 1000) / 1000
        )

        return (() => {
            clearInterval(interval)
        })
    }, [])

    return <>
        <p>Please wait...</p>
        <progress value={progressVal} max={100}></progress>
    </>
}

export default Testt;
