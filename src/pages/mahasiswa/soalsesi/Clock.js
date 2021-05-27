import React from 'react'
import Countdown from 'react-countdown';

function Clock({ date }) {
    // const renderer = ({ hours, minutes, seconds, completed }) => {
    //     if (completed) {
    //         return "Finished"
    //     } else {
    //         // Render a countdown
    //         return <span>{hours} : {minutes} : {seconds}</span>;
    //     }
    // };

    return (
        <Countdown
            daysInHours
            date={date}
        // renderer={renderer}
        />
    )
}

export default Clock
