import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Button, Col, Container, FormGroup, Input, Label, Row } from 'reactstrap';
import DataTable from '../../../components/datatable';
import Spinner from '../../../components/spinner';
import { BEARER_TOKEN, ENDPOINT_BACKEND } from '../../../config';

function NilaiMhs() {
    const [loading, setLoading] = useState(false)

    const [classes, setClasses] = useState([])
    const [selectedClass, setSelectedClass] = useState()

    const [schedules, setSchedules] = useState([])
    const [selectedSchedule, setSelectedSchedule] = useState()

    useEffect(() => {
        setLoading(true)
        getClasses()
            .then(data => {
                setClasses(data)
                setLoading(false)
            })
    }, [])

    const getClasses = () => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/classes`, { headers: { ...BEARER_TOKEN } })
                .then(({ data }) => {
                    resolve(data.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    const getSchedules = (classId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/schedules/class/${classId}`, { headers: { ...BEARER_TOKEN } })
                .then(({ data }) => {
                    resolve(data.data)
                })
                .catch(err => reject(err))
        })
    }

    const onChangeClasses = (id) => {
        setSelectedClass(id)
        setSelectedSchedule('DEFAULT')
        getSchedules(id)
            .then((data) => {
                setSchedules(data)
            })
    }

    const getScores = () => {
        setLoading(true)
        axios.get(`${ENDPOINT_BACKEND}/scores/kelas/${selectedClass}/jadwal/${selectedSchedule}`, { headers: { ...BEARER_TOKEN } })
            .then(({ data }) => {
                setDatatable({
                    ...datatable,
                    rows: data.data.map(score => {
                        return {
                            nim: score.Student.nim,
                            name: score.Student.name,
                            score: score.score,
                            action: <Link to={`/nilaimhs/${score.Student.id}/schedule/${selectedSchedule}`}>
                                <Button size="sm" outline>Lihat Detail</Button>
                            </Link>
                        }
                    })
                })
                setLoading(false)
            })
    }

    const [datatable, setDatatable] = React.useState({
        columns: [
            {
                label: "NIM",
                field: "nim",
                width: 150,
                attributes: {
                    "aria-controls": "DataTable",
                    "aria-label": "Nim",
                },
            },
            {
                label: "Nama",
                field: "name",
                width: 250,
            },
            {
                label: "Nilai",
                field: "score",
                sort: "desc",
                width: 100,
            },
            {
                label: "",
                field: "action",
                width: 100,
            },
        ],
        rows: [
            // {
            //     nim: "1741720017",
            //     name: "Daffa",
            //     score: 100,
            //     action: <Link to="/nilaimhs/1/1">
            //         <Button>Lihat Detail</Button>
            //     </Link>
            // },
            // {
            //     nim: "1740172001",
            //     name: "Akbar",
            //     score: 90,
            //     action: <Link to="/nilaimhs/1/2">
            //         <Button>Lihat Detail</Button>
            //     </Link>
            // },
        ],
    });

    return (
        <Container>
            <h4 className="mb-4">Nilai Mahasiswa</h4>
            {loading ? <Spinner /> : <div>
                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="class">Pilih Kelas</Label>
                            <Input type="select" name="class" id="class" value={selectedClass} defaultValue={'DEFAULT'} onChange={e => onChangeClasses(e.target.value)}>
                                <option value="DEFAULT" disabled hidden>Pilih...</option>
                                {classes.map(val => <option value={val.id}>{val.name}</option>)}
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="schedule">Pilih Jadwal</Label>
                            <Input type="select" name="schedule" id="schedule" value={selectedSchedule} defaultValue={'DEFAULT'} onChange={e => setSelectedSchedule(e.target.value)}>
                                <option value="DEFAULT" disabled hidden>Pilih...</option>
                                {schedules.map(val => <option value={val.id}>{val.description}</option>)}
                            </Input>
                        </FormGroup>
                        <div className="text-right">
                            <Button className="purple-button" onClick={getScores}>Cari</Button>
                        </div>
                    </Col>
                </Row>
                <DataTable datatable={datatable} />
            </div>}

        </Container>
    );
}

export default NilaiMhs
