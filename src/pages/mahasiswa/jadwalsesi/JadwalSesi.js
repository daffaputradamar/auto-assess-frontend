import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container } from "reactstrap";
import { AuthContext } from "../../../App";
import Spinner from "../../../components/spinner";
import { BEARER_TOKEN, ENDPOINT_BACKEND } from "../../../config";
import { capitalizeFirstLetter } from "../../../lib/capitalizeWord";
import { getFormattedDate } from "../../../lib/getFormattedDate";
import TableSesi from "./TabelSesi";

function JadwalSesi(props) {
    const [loading, setLoading] = useState(false)

    const getSchedulesStudent = () => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/schedules/students`, {
                headers: { ...BEARER_TOKEN }
            })
                .then(res => resolve(res.data.data))
                .catch(err => reject(err))
        })
    }

    const createSession = (scheduleId) => {
        axios.post(`${ENDPOINT_BACKEND}/sessions`, {
            schedule: scheduleId
        }, {
            headers: { ...BEARER_TOKEN }
        })
            .then(res => {
                props.history.push(`/soalsesi/${res.data.data.id}`)
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        setLoading(true)
        getSchedulesStudent()
            .then(data => {
                setLoading(false)
                setDatatable({
                    ...datatable,
                    rows: data.map(val => {
                        return {
                            id: val.id,
                            description: val.description,
                            type: capitalizeFirstLetter(val.type),
                            date: <div><b>{getFormattedDate(val.start_date)}</b> - <b>{getFormattedDate(val.finish_date)}</b></div>,
                            // finish_date: getFormattedDate(val.finish_date),
                            time: <div><b>{val.start_time}</b> - <b>{val.finish_time}</b></div>,
                            // finish_time: val.finish_time,
                            action: <Button className="purple-button" onClick={e => createSession(val.id)}>Kerjakan</Button>
                        }
                    })
                })
            })
    }, [])


    const [datatable, setDatatable] = useState({
        columns: [
            {
                label: "Id",
                field: "id",
                width: 50,
                attributes: {
                    "aria-controls": "DataTable",
                    "aria-label": "Id",
                },
            },
            {
                label: "Keterangan",
                field: "description",
                width: 270,
            },
            {
                label: "Tipe",
                field: "type",
                width: 200,
            },
            {
                label: "Tanggal",
                field: "date",
                sort: "disabled",
                width: 100,
            },
            // {
            //     label: "Tgl Selesai",
            //     field: "finish_date",
            //     sort: "disabled",
            //     width: 100,
            // },
            {
                label: "Waktu",
                field: "time",
                sort: "disabled",
                width: 100,
            },
            // {
            //     label: "Waktu Selesai",
            //     field: "finish_time",
            //     sort: "disabled",
            //     width: 100,
            // },
            {
                label: "",
                field: "action",
                sort: "disabled",
                width: 100,
            },
        ],
        rows: [
            {
                id: 1,
                description: "Latihan 1",
                type: "Latihan",
                start_date: "08-02-2021",
                finish_date: "09-02-2021",
                start_time: "10:00:00",
                finish_time: "12:00:00",
                action: <Link to="/soalsesi/1">
                    <Button className="purple-button">Kerjakan</Button>
                </Link>,
            },
            {
                id: 2,
                description: "Kuis 1",
                type: "Kuis",
                start_date: "10-02-2021",
                finish_date: "01-02-2021",
                start_time: "11:00:00",
                finish_time: "12:00:00",
                action: <Link to="/soalsesi/2">
                    <Button className="purple-button">Kerjakan</Button>
                </Link>,
            },
        ],
    });

    return (
        <Container>
            <h4 className="mb-4">Jadwal Sesi</h4>
            {loading ? <Spinner /> : <div>
                <TableSesi datatable={datatable} />
            </div>}
        </Container>
    );
}

export default JadwalSesi;
