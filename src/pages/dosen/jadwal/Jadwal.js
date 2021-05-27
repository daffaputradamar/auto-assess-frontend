import { faChevronDown, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, FormGroup, Input, Label, Row, UncontrolledCollapse } from 'reactstrap';
import DataTable from '../../../components/datatable';
import Spinner from '../../../components/spinner';
import { BEARER_TOKEN, ENDPOINT_BACKEND } from '../../../config';
import { capitalizeFirstLetter } from '../../../lib/capitalizeWord';
import { getFormattedDate } from '../../../lib/getFormattedDate';
import { DateRange } from 'react-date-range';
import Select from 'react-select';

const INITIAL_STATE = {
    start_date: "",
    finish_date: "",
    start_time: "",
    finish_time: "",
    type: "",
    container: "",
    description: ""
}

function Jadwal() {
    const [isFormShown, setIsFormShown] = useState(false)
    const [scheduleForm, setScheduleForm] = useState(INITIAL_STATE)
    const [loading, setLoading] = useState(true)
    const [classes, setClasses] = useState()
    const [selectedClass, setSelectedClass] = useState(null)

    const [classesInput, setClassesInput] = useState([])
    const [selectedClassInput, setSelectedClassInput] = useState([])

    const handleChangeSelect = (e) => {
        setSelectedClassInput(Array.isArray(e) ? e.map(x => x.value) : []);
    }

    const [containers, setContainers] = useState([])

    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: null,
            key: 'selection'
        }
    ]);

    useEffect(() => {
        setLoading(true)
        getClasses()
            .then((kelas) => {
                setClassesInput(kelas.map(val => {
                    return {
                        value: val.id,
                        label: val.name
                    }
                }))
                setClasses(kelas)
            })
        getContainers()
            .then(containers => {
                setContainers(containers)
            })
        getSchedules()
            .then(() => {
                setLoading(false)
            })
    }, [])

    const filterData = () => {
        const { startDate, endDate } = dateRange[0]
        let params = {
            startDate,
            endDate
        }
        if (selectedClass) {
            params = {
                ...params,
                kelas: selectedClass
            }
        }
        getSchedules(params)
    }

    const getSchedules = (params = null) => {
        let parameters = {}

        if (params) {
            if (params.kelas) {
                parameters = {
                    ...parameters,
                    kelas: params.kelas
                }
            }

            if (params.startDate) {
                parameters = {
                    ...parameters,
                    startDate: params.startDate
                }
            }

            if (params.endDate) {
                parameters = {
                    ...parameters,
                    endDate: params.endDate
                }
            }

        }


        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/schedules`, {
                headers: { ...BEARER_TOKEN },
                params: parameters
            })
                .then(({ data }) => {
                    setDatatable({
                        ...datatable,
                        rows: data.data.map(val => {
                            return {
                                id: val.id,
                                description: val.description,
                                class: val.class.name,
                                container: val.container.description,
                                type: capitalizeFirstLetter(val.type),
                                date: <div><b>{getFormattedDate(val.start_date)}</b> - <b>{getFormattedDate(val.finish_date)}</b></div>,
                                time: <div><b>{val.start_time}</b> - <b>{val.finish_time}</b></div>,
                            }
                        })
                    })
                    resolve(true)
                })
                .catch(err => reject(err))
        })
    }

    const getClasses = () => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/classes`, {
                headers: { ...BEARER_TOKEN }
            })
                .then(({ data }) => {
                    resolve(data.data)
                })
                .catch(err => reject(false))
        })
    }

    const getContainers = () => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/containers`, { headers: { ...BEARER_TOKEN } })
                .then(({ data }) => {
                    resolve(data.data)
                })
                .catch(err => reject(err))
        })
    }

    const [datatable, setDatatable] = React.useState({
        columns: [
            {
                label: "Keterangan",
                field: "description",
                width: 270,
            },
            {
                label: "Kelas",
                field: "class",
                width: 200,
            },
            {
                label: "Paket Soal",
                field: "container",
                width: 200,
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
            {
                label: "Waktu",
                field: "time",
                sort: "disabled",
                width: 100,
            },
            {
                label: "",
                field: "action",
                sort: "disabled",
                width: 100,
            },
        ],
        rows: [
            {
                description: "Latihan 1",
                class: "TI-4C",
                container: "Latihan 1",
                data: "08-02-2021 - 09-02-2021",
                time: "10:00:00 - 12:00:00",
                action: <Button outline color="danger">
                    <FontAwesomeIcon
                        icon={faTrashAlt}
                    />
                </Button>
            },
            {
                description: "Kuis 1",
                class: "TI-4C",
                container: "Kuis 1",
                start_date: "10-02-2021",
                finish_date: "01-02-2021",
                start_time: "11:00:00",
                finish_time: "12:00:00",
                action: <Button outline color="danger">
                    <FontAwesomeIcon
                        icon={faTrashAlt}
                    />
                </Button>
            },
        ],
    });


    const submitForm = (e) => {
        e.preventDefault()
        let submittedForm = { ...scheduleForm };
        submittedForm.classes = selectedClassInput
        axios.post(`${ENDPOINT_BACKEND}/schedules`, submittedForm, { headers: { ...BEARER_TOKEN } })
            .then(() => {
                setLoading(true)
                getSchedules()
                    .then(() => {
                        setScheduleForm(INITIAL_STATE)
                        setSelectedClassInput([])
                        setIsFormShown(false)
                        setLoading(false)
                    })
            })
    }


    return (
        <Container>
            <h4 className="mb-4">Jadwal</h4>
            <div className="text-right">
                <Button color="info" outline onClick={e => setIsFormShown(!isFormShown)} className="mb-4">Tambah Jadwal</Button>
            </div>
            {isFormShown && (<div className="mt-4">
                <Form onSubmit={submitForm}>
                    <FormGroup>
                        <Label for="description">Keterangan</Label>
                        <Input type="text" id="description" name="description" placeholder="UAS 1, Latihan 1, ..." value={scheduleForm.description} onChange={e => setScheduleForm({ ...scheduleForm, [e.target.name]: e.target.value })} />
                    </FormGroup>
                    <Row form>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="start_date">Tanggal Mulai</Label>
                                <Input type="date" id="start_date" name="start_date" value={scheduleForm.start_date} onChange={e => setScheduleForm({ ...scheduleForm, [e.target.name]: e.target.value })} />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="finish_date">Tanggal Selesai</Label>
                                <Input type="date" id="finish_date" name="finish_date" value={scheduleForm.finish_date} onChange={e => setScheduleForm({ ...scheduleForm, [e.target.name]: e.target.value })} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row form>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="start_time">Waktu Mulai</Label>
                                <Input type="time" id="start_time" name="start_time" value={scheduleForm.start_time} onChange={e => setScheduleForm({ ...scheduleForm, [e.target.name]: e.target.value })} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="type">Tipe Jadwal</Label>
                                <Input type="select" name="type" id="type" defaultValue={'DEFAULT'} onChange={e => setScheduleForm({ ...scheduleForm, [e.target.name]: e.target.value })}>
                                    <option value="DEFAULT" disabled hidden>Pilih...</option>
                                    <option value="latihan">Latihan</option>
                                    <option value="ujian">Ujian</option>
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for="container_id">Paket Soal</Label>
                                <Input type="select" name="container_id" id="container_id" defaultValue={'DEFAULT'} onChange={e => setScheduleForm({ ...scheduleForm, [e.target.name]: e.target.value })}>
                                    <option value="DEFAULT" disabled hidden>Pilih...</option>
                                    {containers.map(container => {
                                        return <option value={container.id}>{container.description}</option>
                                    })}
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="finish_time">Waktu Selesai</Label>
                                <Input type="time" id="finish_time" name="finish_time" value={scheduleForm.finish_time} onChange={e => setScheduleForm({ ...scheduleForm, [e.target.name]: e.target.value })} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <FormGroup>
                        <Label> Kelas </Label>
                        <Select
                            // defaultValue={[colourOptions[2], colourOptions[3]]}
                            isMulti
                            isClearable
                            name="classes"
                            options={classesInput}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            value={classesInput.filter(obj => selectedClassInput.includes(obj.value))}
                            onChange={handleChangeSelect}
                            placeholder="Masukkan nama Kelas"
                        />
                    </FormGroup>
                    <div className="text-right">
                        <Button type="submit" className="purple-button">Simpan</Button>
                    </div>
                </Form>
                <hr />
            </div>)}
            {loading ? <Spinner /> : <div>
                <h5>Filter Data</h5>
                <Row className="align-items-start">
                    <Col>
                        <FormGroup>
                            <Label for="class">Kelas</Label>
                            <Input type="select" name="class" id="class" value={selectedClass} defaultValue={'DEFAULT'} onChange={e => setSelectedClass(e.target.value)}>
                                <option value="DEFAULT" disabled hidden>Pilih...</option>
                                {
                                    classes.map(val => <option key={val.id} value={val.id}>{val.name}</option>)
                                }
                            </Input>
                        </FormGroup>
                        <Button color="info" outline className="mb-3" onClick={filterData}>Cari</Button>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Button id="daterangeToggler" color="white">Pilih Jangka Waktu <FontAwesomeIcon icon={faChevronDown} className="mr-2" /></Button>
                            <UncontrolledCollapse toggler="#daterangeToggler" className="mt-3">
                                <DateRange
                                    editableDateInputs={false}
                                    onChange={item => setDateRange([item.selection])}
                                    moveRangeOnFirstSelection={false}
                                    ranges={dateRange}
                                />
                            </UncontrolledCollapse>
                        </FormGroup>
                    </Col>
                    <Col>
                    </Col>
                </Row>
                <div className="mt-4">
                    <DataTable datatable={datatable} />
                </div>
            </div>}
        </Container>
    );
}

export default Jadwal
