import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Select from 'react-select'
import { Button, Col, Container, Form, FormGroup, Label, Row } from 'reactstrap'
import ButtonKembali from '../../../../components/buttonkembali'
import DataTable from '../../../../components/datatable'
import Spinner from '../../../../components/spinner'
import { BEARER_TOKEN, ENDPOINT_BACKEND } from '../../../../config'

function MhsKelas(props) {
    const { id } = useParams()
    const [isFormShown, setIsFormShown] = useState(false)

    const [loading, setLoading] = useState(true)
    const [classDetail, setClassDetail] = useState(null)

    const [students, setStudents] = useState([])
    const [selectedStudents, setSelectedStudents] = useState([])

    const handleChangeSelect = (e) => {
        setSelectedStudents(Array.isArray(e) ? e.map(x => x.value) : []);
    }

    useEffect(() => {
        setLoading(true)
        getStudents(id)
            .then(() => {
                getStudentsInput(id)
                setLoading(false)
            })
    }, [])

    const getStudents = (id) => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/classes/${id}`, { headers: { ...BEARER_TOKEN } })
                .then(({ data }) => {
                    setClassDetail(data.data)
                    console.log(data.data)
                    setDatatable({
                        ...datatable,
                        rows: data.data.students.map(student => {
                            return {
                                name: student.name,
                                nim: student.nim,
                                action: <Button color="danger" outline size="sm" onClick={e => deleteStudent(student.id)}> <FontAwesomeIcon
                                    icon={faTrashAlt}
                                /></Button>
                            }
                        })
                    })
                    resolve(true)
                })
                .catch(err => reject(false))
        })
    }

    const getStudentsInput = (id) => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/students/classes/${id}`, { headers: { ...BEARER_TOKEN } })
                .then(({ data }) => {
                    setStudents(data.data.map(val => {
                        return {
                            value: val.id,
                            label: val.nim + " - " + val.name
                        }
                    }))
                })
        })
    }

    const deleteStudent = (studentId) => {
        setLoading(true)
        axios.put(`${ENDPOINT_BACKEND}/classes/${id}/remove/${studentId}`, {}, { headers: { ...BEARER_TOKEN } })
            .then(() => {
                getStudents(id)
                    .then(() => {
                        getStudentsInput(id)
                        setLoading(false)
                    })
            })
            .then(() => {
                setLoading(false)
            })
    }

    const deleteClass = (id) => {
        axios.delete(`${ENDPOINT_BACKEND}/classes/${id}`, { headers: { ...BEARER_TOKEN } })
            .then(() => {
                props.history.push('/kelas')
            })
    }

    const [datatable, setDatatable] = useState({
        columns: [
            {
                label: "Nama",
                field: "name",
                width: 300,
                attributes: {
                    "aria-controls": "DataTable",
                    "aria-label": "Nama",
                },
            },
            {
                label: "NIM",
                field: "nim",
                width: 300,
            },
            {
                label: "",
                field: "action",
                width: 100,
            },
        ],
        rows: [
            {
                name: "Daffa",
                nim: "1741720017",
                action: <Button color="danger" outline> <FontAwesomeIcon
                    icon={faTrashAlt}
                /></Button>
            },
            {
                name: "Akbar",
                nim: "1741720018",
                action: <Button color="danger" outline> <FontAwesomeIcon
                    icon={faTrashAlt}
                /></Button>
            },
        ],
    });

    const submitForm = (e) => {
        e.preventDefault()
        const data = {
            students: [...selectedStudents]
        }
        axios.put(`${ENDPOINT_BACKEND}/classes/${id}/add`, data, { headers: { ...BEARER_TOKEN } })
            .then(() => {
                setLoading(true)
                getStudents(id)
                    .then(() => {
                        getStudentsInput(id)
                        setIsFormShown(false)
                        setSelectedStudents([])
                        setLoading(false)
                    })
            })
    }

    return (
        <Container>
            <div className="mb-4">
                <ButtonKembali history={props.history} />
            </div>

            {loading ? <Spinner /> : <div>
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-4">{classDetail.name}</h5>
                    <Button outline color="danger" onClick={e => deleteClass(id)} >
                        <FontAwesomeIcon
                            icon={faTrashAlt}
                        />
                    </Button>
                </div>
                <div className="text-right mt-5">
                    <Button color="info" outline onClick={e => setIsFormShown(!isFormShown)}>Tambah Mahasiswa</Button>
                </div>
                {isFormShown && (<div className="my-4">
                    <Row>
                        <Col md={6}>
                        </Col>
                        <Col>
                            <Form onSubmit={submitForm}>
                                <FormGroup>
                                    <Label> NIM mahasiswa </Label>
                                    <Select
                                        // defaultValue={[colourOptions[2], colourOptions[3]]}
                                        isMulti
                                        isClearable
                                        name="students"
                                        options={students}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        value={students.filter(obj => selectedStudents.includes(obj.value))}
                                        onChange={handleChangeSelect}
                                        placeholder="Masukkan NIM mahasiswa"
                                    />
                                </FormGroup>
                                <div className="text-right">
                                    <Button type="submit" className="purple-button">Simpan</Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </div>)}
                <DataTable datatable={datatable} />
            </div>}
        </Container>
    )
}

export default MhsKelas
