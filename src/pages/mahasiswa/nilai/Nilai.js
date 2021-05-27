import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Col, Container, FormGroup, Input, Label, Row, Button } from 'reactstrap';
import DataTable from '../../../components/datatable';
import Spinner from '../../../components/spinner';
import { BEARER_TOKEN, ENDPOINT_BACKEND } from '../../../config';
import { getFormattedDate } from '../../../lib/getFormattedDate';

function Nilai() {
    const [loading, setLoading] = useState(true)
    const [kelas, setKelas] = useState([])
    const [selectedClass, setSelectedClass] = useState(null)

    useEffect(() => {
        getScores()
            .then(() => {
                getClasses()
                    .then(newKelas => {
                        setKelas(newKelas)
                        setLoading(false)
                    })
            })
    }, [])

    const getScores = (kelas = null) => {
        let params = {}
        if (kelas) {
            params = {
                kelas
            }
        }
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/scores/student`, {
                headers: { ...BEARER_TOKEN },
                params
            })
                .then(({ data }) => {
                    setDatatable({
                        ...datatable,
                        rows: data.data.map(score => {
                            return {
                                class: score.className,
                                schedule: score.schedule,
                                score: score.score,
                                start_date: getFormattedDate(score.start_date)
                            }
                        })
                    })
                    resolve(true)
                })
                .catch(err => reject(false))
        })
    }

    const getClasses = () => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/classes/students`, {
                headers: { ...BEARER_TOKEN }
            })
                .then(({ data }) => {
                    resolve(data.data)
                })
                .catch(err => reject(false))
        })
    }

    const [datatable, setDatatable] = React.useState({
        columns: [
            {
                label: "Kelas",
                field: "class",
                width: 150,
                attributes: {
                    "aria-controls": "DataTable",
                    "aria-label": "Kelas",
                },
            },
            {
                label: "Jadwal",
                field: "schedule",
                width: 250,
            },
            {
                label: "Tgl Mulai",
                field: "start_date",
                sort: "desc",
                width: 100,
            },
            {
                label: "Nilai",
                field: "score",
                width: 100,
            },
        ],
        rows: [
            {
                class: "TI-4C",
                schedule: "Latihan 1",
                score: 100,
                start_date: "12-02-2021"
            },
            {
                class: "TI-4C",
                schedule: "Kuis 1",
                score: 100,
                start_date: "21-02-2021"
            },
        ],
    });

    return (
        <Container>
            <h4 className="mb-4">Nilai Mahasiswa</h4>
            {loading ? <Spinner /> :
                <div>
                    <Row className="align-items-center">
                        <Col md="6">
                            <FormGroup>
                                <Label for="class">Pilih Kelas</Label>
                                <Input type="select" name="class" id="class" value={selectedClass} defaultValue={'DEFAULT'} onChange={e => setSelectedClass(e.target.value)}>
                                    <option value="DEFAULT" disabled hidden>Pilih...</option>
                                    {
                                        kelas.map(val => <option key={val.id} value={val.id}>{val.name}</option>)
                                    }
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col>
                            <Button color="info" outline className="mt-3" onClick={e => getScores(selectedClass)}>Cari</Button>
                        </Col>
                    </Row>
                    <DataTable datatable={datatable} />
                </div>
            }
        </Container>
    );
}

export default Nilai
