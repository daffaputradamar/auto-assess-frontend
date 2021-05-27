import React, { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom";
import { Button, Col, Container, ModalBody, ModalFooter, ModalHeader, Row, Modal } from "reactstrap";
import TabelSoal from "./TabelSoal";
import ButtonKembali from '../../../components/buttonkembali';
import axios from 'axios';
import { BEARER_TOKEN, ENDPOINT_BACKEND } from '../../../config';
import Countdown from '../../../components/countdown/Countdown';
import Spinner from '../../../components/spinner';

function SoalSesi(props) {
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [scheduleDate, setScheduleDate] = useState(new Date())

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const showModal = () => setModal(true)

    const getQuestions = () => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/sessions/${id}`, {
                headers: { ...BEARER_TOKEN }
            })
                .then(res => resolve(res.data))
                .catch(err => reject(err))
        })
    }

    const submitSession = () => {
        axios.post(`${ENDPOINT_BACKEND}/sessions/${id}`, {}, {
            headers: { ...BEARER_TOKEN }
        })
            .then(res => props.history.push('/jadwalsesi'))
            .catch(err => console.log(err))
    }


    useEffect(() => {
        setLoading(true)
        getQuestions()
            .then(({ data }) => {
                setScheduleDate(new Date(`${data.Schedule.finish_date} ${data.Schedule.finish_time}`))
                const questions = (data.Schedule.Container) ? data.Schedule.Container.questions : []
                setDatatable({
                    ...datatable,
                    rows: questions.map(question => {
                        return {
                            question: <span dangerouslySetInnerHTML={{ __html: question.text }}></span>,
                            action: <Link to={{
                                pathname: `/soal/${question.id}`,
                                state: {
                                    session: id
                                }
                            }}>
                                <Button className="purple-button">Kerjakan</Button>
                            </Link>,
                        }
                    })
                })
                setLoading(false)
            })
            .catch(err => console.log(err))
    }, [])

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
        <Container>
            {loading ? <Spinner /> : <div>
                <Row className="mb-4">
                    <Col lg="9" md="6">
                        <ButtonKembali history={props.history} />
                    </Col>
                    {/* <Col className="d-flex justify-content-between align-items-center">
                    <div>Time Left : </div>
                    <div className="text-right">
                        <strong><Clock date={new Date(2021, 1, 20).getTime()} /></strong>
                    </div>
                </Col> */}
                    <Countdown schedule={scheduleDate} showModal={showModal} />
                </Row>
                <TabelSoal datatable={datatable} />
                <div className="text-right mt-2">
                    <Button color="info" size="lg" onClick={submitSession}>Selesaikan Sesi</Button>
                </div>
            </div>}

            <Modal isOpen={modal} toggle={toggle} backdrop="static">
                <ModalHeader>Pemberitahuan</ModalHeader>
                <ModalBody>
                    Waktu Habis, Selesaikan sesi sekarang juga
        </ModalBody>
                <ModalFooter>
                    <Button color="info" onClick={submitSession}>Selesaikan Sesi</Button>
                </ModalFooter>
            </Modal>
        </Container >
    )
}

export default SoalSesi
