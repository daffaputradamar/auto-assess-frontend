import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ENDPOINT_BACKEND } from '../../config'

function Countdown({ schedule, showModal }) {
    const [serverTime, setServerTime] = useState(new Date())
    const [timeLeft, setTimeLeft] = useState({
        hours: 99,
        minutes: 99,
        seconds: 99
    });
    const [loading, setLoading] = useState(false)

    const calculateTimeLeft = (now, future) => {
        let difference = +new Date(future) - +now;
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60))),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }

        return timeLeft;

    }

    useEffect(() => {
        axios.get(`${ENDPOINT_BACKEND}/current_timestamps`)
            .then(({ data }) => {
                setServerTime(data)
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft(new Date(), schedule));
        }, 1000);

        return () => clearTimeout(timer);
    })

    const timerComponents = [];
    Object.keys(timeLeft).forEach((interval, index) => {
        if (!timeLeft[interval]) {
            return;
        }
        timerComponents.push(
            <span key={index}>
                {timeLeft[interval]}
                {(index !== Object.keys(timeLeft).length - 1) ? ":" : ""}
            </span>
        );
    });

    if (!timerComponents.length) {
        showModal()
    }

    return (
        <div>
            Time Left: <b>{timerComponents.length ? timerComponents : "Waktu Habis"}</b>
        </div>
    )
}

export default Countdown
