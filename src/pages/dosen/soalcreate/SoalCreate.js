import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, FormText, Input, Label } from 'reactstrap';
import DataTable from '../../../components/datatable';
import Select from 'react-select';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { BEARER_TOKEN, ENDPOINT_BACKEND } from '../../../config';
import Spinner from '../../../components/spinner';


const INITIAL_STATE = {
    text: "",
    answer: "",
    answer_pic: "",
    case_study: "",
}

function SoalCreate() {
    const [isFormShown, setIsFormShown] = useState(false)
    const [questionForm, setQuestionForm] = useState(INITIAL_STATE)
    const [selectedTables, setSelectedTables] = useState([])
    const [loading, setLoading] = useState(true)

    const [caseStudies, setCaseStudies] = useState([])
    // const [tables, setTables] = useState([
    //     { value: "user", label: "User" },
    //     { value: "mahasiswa", label: "Mahasiswa" }
    // ])
    const [tables, setTables] = useState([])

    useEffect(() => {
        setLoading(true)
        getSoal()
            .then(() => {
                setLoading(false)
                getCaseStudies()
            })
    }, [])

    const getCaseStudies = () => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/casestudies`, {
                headers: { ...BEARER_TOKEN }
            })
                .then(({ data }) => {
                    setCaseStudies(data.data)
                    resolve(true)
                })
                .catch(err => reject(err))
        })
    }

    const getTables = (id) => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/caseStudies/${id}`, {
                headers: { ...BEARER_TOKEN }
            })
                .then(({ data }) => {
                    setTables(Object.keys(data.data.tables).map(key => {
                        return {
                            value: key,
                            label: key
                        }
                    }))
                })
        })
    }

    const getSoal = () => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/questions`, {
                headers: { ...BEARER_TOKEN }
            })
                .then(({ data }) => {
                    setDatatable({
                        ...datatable,
                        rows: data.data.map(val => {
                            return {
                                id: val.id,
                                text: <span dangerouslySetInnerHTML={{ __html: val.text }}></span>,
                                answer: val.answer,
                                case_study: val.CaseStudy.name,
                                user_name: val.User.name,
                                action: <Link to={`/soaldetail/${val.id}`}>
                                    <Button outline size="sm">Lihat Detail</Button>
                                </Link>
                            }
                        })
                    })
                    resolve(true)
                })
                .catch(err => reject(err))
        })
    }

    const onChangeCaseStudy = (e) => {
        setTables([])
        setSelectedTables([])
        setQuestionForm({ ...questionForm, [e.target.name]: e.target.value })
        getTables(e.target.value)
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
                field: "case_study",
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
                case_study: "Kampus",
                user_name: "Dosen1",
                action: <Link to="/soaldetail/1">
                    <Button>Lihat Detail</Button>
                </Link>
            },
            {
                id: 2,
                text: "Tampilkan nama matakuliah yang diikuti oleh mahasiswa dengan nama depan Hilal",
                answer: `SELECT nama_matkul FROM tb_mahasiswa m JOIN tb_jadwal j on m.NIM = j.NIM JOIN tb_matkul mk ON j.id_matkul = mk.id_matkul WHERE m.nama_depan = 'Hilal'`,
                case_study: "Kampus",
                user_name: "Dosen1",
                action: <Link to="/soaldetail/1">
                    <Button>Lihat Detail</Button>
                </Link>
            }
        ],
    });

    const handleChangeSelect = (e) => {
        setSelectedTables(Array.isArray(e) ? e.map(x => x.value) : []);
    }

    const handleEditorChange = (content, editor) => {
        setQuestionForm({ ...questionForm, text: content })
    }

    const submitForm = (e) => {
        e.preventDefault()
        const data = new FormData()
        Object.keys(questionForm).forEach(key => {
            data.append(key, questionForm[key])
        })
        data.append('tables', selectedTables.join(','))
        axios.post(`${ENDPOINT_BACKEND}/questions`, data, {
            headers: { ...BEARER_TOKEN }
        })
            .then(res => {
                console.log(res.statusText)
            })
            .catch(err => console.log(err))
            .finally(() => {
                setQuestionForm(INITIAL_STATE)
                setSelectedTables([])
                setIsFormShown(false)
                setLoading(true)
                getSoal()
                    .then(() => setLoading(false))
            })
            .catch(err => console.log(err))
    }

    return (
        <Container>
            <h4 className="mb-4">Kelas</h4>
            <div className="text-right">
                <Button color="info" outline onClick={e => setIsFormShown(!isFormShown)} className="mb-4">Tambah Soal</Button>
            </div>
            {isFormShown && (<div className="mt-4">
                <Form onSubmit={submitForm}>
                    <FormGroup>
                        <Label for="text">Teks Soal</Label>
                        <Editor
                            apiKey="b8t1klp9vk4ghizmb2nikd9vdp3x4l46r57glcya41u3avmn"
                            init={{
                                height: 250,
                                menubar: false,
                                plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount'
                                ],
                                toolbar:
                                    'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                            }}
                            onEditorChange={handleEditorChange}
                        />
                        {/* <Input type="textarea" id="text" name="text" placeholder="Tampilkan ..." value={questionForm.text} onChange={e => setQuestionForm({ ...questionForm, [e.target.name]: e.target.value })} /> */}
                    </FormGroup>
                    <FormGroup>
                        <Label for="answer">Query Kunci</Label>
                        <Input type="textarea" id="answer" name="answer" placeholder="SELECT ..." value={questionForm.answer} onChange={e => setQuestionForm({ ...questionForm, [e.target.name]: e.target.value })} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="answer_pic">Gambar Jawaban</Label>
                        <Input type="file" name="answer_pic" id="answer_pic" onChange={e => setQuestionForm({ ...questionForm, [e.target.name]: e.target.files[0] })} />
                        <FormText color="muted">
                            Hasil screenshot dari tabel yang dihasilkan
                        </FormText>
                    </FormGroup>
                    <FormGroup>
                        <Label for="case_study">Pilih Studi Kasus</Label>
                        <Input type="select" name="case_study" id="case_study" defaultValue={'DEFAULT'} onChange={onChangeCaseStudy}>
                            <option value="DEFAULT" disabled hidden>Pilih...</option>
                            {
                                caseStudies.map(val => <OptionDropdown key={val.id} id={val.id} name={val.name} username={val.User.name} />)
                            }
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label> Tabel Yang Digunakan </Label>
                        <Select
                            // defaultValue={[colourOptions[2], colourOptions[3]]}
                            isMulti
                            isClearable
                            name="tables"
                            options={tables}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            value={tables.filter(obj => selectedTables.includes(obj.value))}
                            onChange={handleChangeSelect}
                            placeholder="Table yang digunakan"
                        />
                    </FormGroup>
                    <div className="text-right">
                        <Button type="submit" className="purple-button">Simpan</Button>
                    </div>
                </Form>
            </div>)}
            { loading ? <Spinner /> : <DataTable datatable={datatable} />}
        </Container>
    )
}

function OptionDropdown(props) {
    return (
        <option value={props.id}>{props.name} - {props.username}</option>
    )
}

export default SoalCreate
