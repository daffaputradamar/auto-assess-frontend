import React, { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom";
import { Button, Col, Container, ModalBody, ModalFooter, ModalHeader, Row, Modal, Label, Input } from "reactstrap";
import TabelSoal from "./TabelSoal";
import ButtonKembali from '../../../components/buttonkembali';
import axios from 'axios';
import { BEARER_TOKEN, ENDPOINT_BACKEND } from '../../../config';
import Countdown from '../../../components/countdown/Countdown';
import Spinner from '../../../components/spinner';

function SoalSesiTest(props) {
    const { id } = useParams()
    const [loading, setLoading] = useState(false)

    const [name, setName] = useState(localStorage.getItem("name") || "")
    const [questions, setQuestions] = useState(JSON.parse(localStorage.getItem("questions")) || [])
    const [answeredQuestions, setAnsweredQuestions] = useState(JSON.parse(localStorage.getItem("answeredQuestions")) || [])

    const [isFinished, setIsFinished] = useState(false)

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const showModal = () => setModal(true)

    const getQuestions = () => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/test`)
                .then(res => resolve(res.data[0]))
                .catch(err => reject(err))
        })
    }

    const submitSession = () => {
        axios.post(`${ENDPOINT_BACKEND}/sessions`, {
            name: localStorage.getItem("name")
        }, {
            headers: { ...BEARER_TOKEN }
        })
            .then(res => setIsFinished(true))
            .catch(err => console.log(err))
    }


    useEffect(() => {
        if (!name) {
            showModal()
        }
        setLoading(true)

        if (questions.length === 0 && answeredQuestions.length === 0) {
            getQuestions()
                .then(data => {
                    const questionsFromAPI = (data.questions) ? data.questions : []

                    setQuestions(questionsFromAPI)
                    localStorage.setItem("questions", JSON.stringify(questionsFromAPI))

                    populateDatatable(questionsFromAPI)
                    setLoading(false)
                })
                .catch(err => console.log(err))
        } else {
            const filteredQuestions = questions.filter(question => !answeredQuestions.includes(question.id))
            console.log(filteredQuestions)
            populateDatatable(filteredQuestions)
            setLoading(false)
        }

    }, [])

    const populateDatatable = (data) => {
        setDatatable({
            ...datatable,
            rows: data.map(question => {
                return {
                    question: <span dangerouslySetInnerHTML={{ __html: question.text }}></span>,
                    action: <Link to={{
                        pathname: `/soaltest/${question.id}`,
                        state: {
                            session: id
                        }
                    }}>
                        <Button className="purple-button">Kerjakan</Button>
                    </Link>,
                }
            })
        })
    }

    const resetTest = () => {
        localStorage.removeItem("name")
        localStorage.removeItem("questions")
        localStorage.removeItem("answeredQuestions")
        window.location.reload()
    }

    const [datatable, setDatatable] = useState({
        columns: [
            {
                label: "Teks Soal",
                field: "question",
                width: 300,
                attributes: {
                    "aria-controls": "DataTable",
                    "aria-label": "question",
                },
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
                id: 1,
                question: "Tampilkan nama matakuliah, jumlah jadwal dan ruangan dari matakuliah dengan jumlah jadwal paling sedikit",
                type: "Latihan",
                action: <Link to="/soal/1">
                    <Button className="purple-button">Kerjakan</Button>
                </Link>,
            },
            {
                id: 2,
                question: "Tampilkan NIM, gabungan nama depan dan nama belakang (dipisah spasi) dan jumlah jadwal dari masing-masing mahasiswa",
                action: <Link to="/soal/2">
                    <Button className="purple-button">Kerjakan</Button>
                </Link>,
            },
        ],
    });

    return (
        <Container className="mt-5">
            {loading ? <Spinner /> : (datatable.rows.length !== 0) ?
                <TabelSoal datatable={datatable} />
                : <div>
                    <h4>Terima Kasih, <b>{name}</b></h4>
                    <div className="d-flex align-items-center justify-content-center">
                        <img className="img-fluid" src="/thx_gif.gif" alt="gif terima kasih" />
                    </div>
                    <h6><b>Mau Ulangi Lagi?</b> <Button color="link" onClick={e => resetTest()}>Klik Disini</Button></h6>
                </div>
            }

            <Modal isOpen={modal} toggle={toggle} backdrop="static">
                <ModalBody>
                    <Label for="name">Nama</Label>
                    <Input type="text" value={name} onChange={e => setName(e.target.value)} />
                </ModalBody>
                <ModalFooter>
                    <Button className="purple-button" onClick={e => {
                        if (name !== "") {
                            localStorage.setItem("name", name)
                            toggle()
                        }
                    }}>Selesai</Button>
                </ModalFooter>
            </Modal>
        </Container >
    )
}

export default SoalSesiTest
