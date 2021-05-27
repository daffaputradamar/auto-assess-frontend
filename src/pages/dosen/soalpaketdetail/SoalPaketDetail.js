import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap'
import ButtonKembali from '../../../components/buttonkembali/ButtonKembali'
import DataTable from '../../../components/datatable';
import Spinner from '../../../components/spinner';
import { BEARER_TOKEN, ENDPOINT_BACKEND } from '../../../config';

const INITIAL_STATE = {
    create: "",
    insert: ""
}

function SoalPaketDetail(props) {
    const { id } = useParams()
    const [isFormShown, setIsFormShown] = useState(false)
    const [tableForm, setTableForm] = useState(INITIAL_STATE)
    const [container, setContainer] = useState(null)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getDetailContainers(id)
            .then(() => {
                setLoading(false)
            })
    }, [])

    const getDetailContainers = (id) => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/containers/${id}`, { headers: { ...BEARER_TOKEN } })
                .then(({ data }) => {
                    setContainer(data.data)
                    const questions = data.data.questions
                    setDatatable({
                        ...datatable,
                        rows: questions.map(question => {
                            return {
                                id: question.id,
                                text: <span dangerouslySetInnerHTML={{ __html: question.text }}></span>,
                                answer: question.answer,
                                study_case: question.CaseStudy.name,
                                user_name: question.User.name,
                                action: <Button outline size="sm" color="danger" onClick={e => deleteQuestion(id, question.id)}>
                                    <FontAwesomeIcon
                                        icon={faTrashAlt}
                                    />
                                </Button>
                            }
                        })
                    })
                    resolve(true)
                })
                .catch(err => reject(err))
        })
    }

    const deleteQuestion = (id, questionId) => {
        axios.put(`${ENDPOINT_BACKEND}/containers/${id}/remove/${questionId}`, {}, { headers: { ...BEARER_TOKEN } })
            .then(() => {
                setLoading(true)
                getDetailContainers(id)
                    .then(() => {
                        setLoading(false)
                    })
            })
    }

    const deleteContainer = (id) => {
        axios.delete(`${ENDPOINT_BACKEND}/containers/${id}`, { headers: { ...BEARER_TOKEN } })
            .then(() => {
                props.history.push('/paketsoal')
            })
    }

    const [datatable, setDatatable] = useState({
        columns: [
            {
                label: "ID",
                field: "id",
                width: 100,
                attributes: {
                    "aria-controls": "DataTable",
                    "aria-label": "ID",
                },
            },
            {
                label: "Teks Soal",
                field: "text",
                width: 500,
            },
            {
                label: "Jawaban",
                field: "answer",
                width: 500,
            },
            {
                label: "Studi Kasus",
                field: "study_case",
                width: 300,
            },
            {
                label: "Dibuat Oleh",
                field: "user_name",
                width: 300,
            },
            {
                label: "",
                field: "action",
                width: 200,
            },
        ],
        rows: [
            {
                id: 1,
                text: "Tampilkan nama matakuliah yang diikuti oleh mahasiswa dengan nama depan Hilal",
                answer: `SELECT nama_matkul FROM tb_mahasiswa m JOIN tb_jadwal j on m.NIM = j.NIM JOIN tb_matkul mk ON j.id_matkul = mk.id_matkul WHERE m.nama_depan = 'Hilal'`,
                study_case: "Kampus",
                user_name: "Dosen1",
                action: <Button outline color="danger">
                    <FontAwesomeIcon
                        icon={faTrashAlt}
                    />
                </Button>
            },
            {
                id: 2,
                text: "Tampilkan nama matakuliah yang diikuti oleh mahasiswa dengan nama depan Hilal",
                answer: `SELECT nama_matkul FROM tb_mahasiswa m JOIN tb_jadwal j on m.NIM = j.NIM JOIN tb_matkul mk ON j.id_matkul = mk.id_matkul WHERE m.nama_depan = 'Hilal'`,
                study_case: "Kampus",
                user_name: "Dosen1",
                action: <Button outline color="danger">
                    <FontAwesomeIcon
                        icon={faTrashAlt}
                    />
                </Button>
            }
        ],
    });

    const submitForm = (e) => {
        e.preventDefault()
        console.log(tableForm)
        setTableForm(INITIAL_STATE)
        setIsFormShown(false)
    }

    return (
        <Container>
            <div className="mb-4">
                <ButtonKembali history={props.history} />
            </div>
            {loading ? <Spinner /> : <div>

                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-4">{container.description}</h4>
                    <Button outline color="danger" onClick={e => deleteContainer(id)} >
                        <FontAwesomeIcon
                            icon={faTrashAlt}
                        />
                    </Button>
                </div>
                <div className="text-right mt-5 mb-4">
                    <Link to={`/paketsoal/${id}/add`}><Button color="info" outline onClick={e => setIsFormShown(!isFormShown)}>Tambah Soal</Button></Link>
                </div>
                {isFormShown && (<div className="mt-4">
                    <Form onSubmit={submitForm}>
                        <FormGroup>
                            <Label for="create">Query Create Table</Label>
                            <Input type="textarea" id="create" name="create" placeholder="CREATE TABLE ..." value={tableForm.name} onChange={e => setTableForm({ ...tableForm, [e.target.name]: e.target.value })} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="insert">Query Insert Data</Label>
                            <Input type="textarea" id="insert" name="insert" placeholder="INSERT INTO ..." value={tableForm.db_name} onChange={e => setTableForm({ ...tableForm, [e.target.name]: e.target.value })} />
                        </FormGroup>
                        <div className="text-right">
                            <Button type="submit" className="purple-button">Simpan</Button>
                        </div>
                    </Form>
                </div>)}
                <DataTable datatable={datatable} />
            </div>}

        </Container>
    )
}

export default SoalPaketDetail
