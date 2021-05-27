import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { Button, Col, Container, FormGroup, Input, Label, Row } from 'reactstrap';
import ButtonKembali from '../../../../components/buttonkembali';
import ReactTable from '../../../../components/reacttable/ReactTable';
import Spinner from '../../../../components/spinner';
import { BEARER_TOKEN, ENDPOINT_BACKEND } from '../../../../config';

function SoalPaketDetailAdd(props) {
    const { id } = useParams()
    const [selectedRows, setSelectedRows] = useState({});

    const [caseStudies, setCaseStudies] = useState([])
    const [selectedCaseStudy, setSelectedCaseStudy] = useState('DEFAULT')
    const [dosen, setDosen] = useState([])
    const [selectedDosen, setSelectedDosen] = useState('DEFAULT')

    const [loading, setLoading] = useState(true)
    const [questions, setQuestions] = useState([])

    useEffect(() => {
        setLoading(true)
        getQuestions(id)
            .then(() => {
                setLoading(false)
            })
        getCaseStudies()
            .then(data => setCaseStudies(data))
        getDosen()
            .then(data => setDosen(data))
    }, [])

    const getQuestions = (id, params = null) => {
        let parameters = {}

        if (params) {
            if (params.dosen) {
                parameters = {
                    ...parameters,
                    dosen: params.dosen
                }
            }

            if (params.case_study) {
                parameters = {
                    ...parameters,
                    case_study: params.case_study
                }
            }

        }

        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/questions/containers/${id}`, {
                headers: { ...BEARER_TOKEN },
                params: parameters
            })
                .then(({ data }) => {
                    setQuestions(data.data.map(question => {
                        return {
                            id: question.id,
                            text: <span dangerouslySetInnerHTML={{ __html: question.text }}></span>,
                            answer: question.answer,
                            study_case: question.CaseStudy.name,
                            user_name: question.User.name
                        }
                    }))
                    resolve(true)
                })
                .catch(err => reject(err))
        })
    }

    const getCaseStudies = () => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/casestudies`, { headers: { ...BEARER_TOKEN } })
                .then(({ data }) => {
                    resolve(data.data)
                })
                .catch(err => reject(err))
        })
    }

    const getDosen = () => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/users`, { headers: { ...BEARER_TOKEN } })
                .then(({ data }) => {
                    resolve(data.data)
                })
                .catch(err => reject(err))
        })
    }

    const filterData = () => {
        let params
        if (selectedCaseStudy) {
            params = {
                ...params,
                case_study: selectedCaseStudy
            }
        }

        if (selectedDosen) {
            params = {
                ...params,
                dosen: selectedDosen
            }
        }

        setLoading(true)
        getQuestions(id, params)
            .then(() => {
                setLoading(false)
            })
    }

    const columns = [
        {
            Header: "ID",
            accessor: "id",
        },
        {
            Header: "Teks Soal",
            accessor: "text",
        },
        {
            Header: "Jawaban",
            accessor: "answer",
        },
        {
            Header: "Studi Kasus",
            accessor: "study_case",
        },
        {
            Header: "Dibuat Oleh",
            accessor: "user_name",
        },
    ]

    const submitForm = (e) => {
        e.preventDefault()
        const data = {
            questions: selectedRows.map(d => d.original.id)
        }
        axios.put(`${ENDPOINT_BACKEND}/containers/${id}/add`, data, { headers: { ...BEARER_TOKEN } })
            .then(() => {
                props.history.push(`/paketsoal/${id}`)
            })
    }


    return (<Container>
        <div className="mb-4">
            <ButtonKembali history={props.history} />
        </div>
        <div className="text-right mt-4 mb-3">
            <Button className="purple-button" onClick={submitForm}>Simpan</Button>
        </div>

        {
            loading ? <Spinner /> : <div>
                <Row className="align-items-start">
                    <Col>
                        <FormGroup>
                            <Label for="case_study">Studi Kasus</Label>
                            <Input type="select" name="case_study" id="case_study" value={selectedCaseStudy} onChange={e => setSelectedCaseStudy(e.target.value)}>
                                <option value="DEFAULT" disabled hidden>Pilih...</option>
                                {
                                    caseStudies.map(val => <option key={val.id} value={val.id}>{val.name}</option>)
                                }
                            </Input>
                        </FormGroup>
                        <Button color="info" outline className="mb-3" onClick={filterData}>Cari</Button>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="dosen">Dibuat Oleh</Label>
                            <Input type="select" name="dosen" id="dosen" value={selectedDosen} onChange={e => setSelectedDosen(e.target.value)}>
                                <option value="DEFAULT" disabled hidden>Pilih...</option>
                                {
                                    dosen.map(val => <option key={val.id} value={val.id}>{val.name}</option>)
                                }
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>
                <ReactTable columns={columns} data={questions} setSelectedRows={setSelectedRows} />
            </div>
        }
    </Container>)
}

export default SoalPaketDetailAdd
