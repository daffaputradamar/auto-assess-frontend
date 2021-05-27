import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Container } from 'reactstrap'
import ButtonKembali from '../../../../components/buttonkembali'
import Spinner from '../../../../components/spinner'
import { BEARER_TOKEN, ENDPOINT_BACKEND } from '../../../../config'
import CollapseQuestion from './CollapseQuestion'

function NilaiDetail(props) {
    const { mhs, jadwal } = useParams()
    const [loading, setLoading] = useState(true)
    const [detail, setDetail] = useState()

    useEffect(() => {
        setLoading(true)
        getDetailScores(mhs, jadwal)
            .then(questions => {
                console.log(questions)
                setDetail({
                    student: questions.student,
                    schedule: questions.schedule
                })
                const answerDetail = questions.answer.map(question => {
                    return {
                        question: question.text,
                        questionKey: question.answer,
                        answer: question.SessionStudentAnswers.map(answer => {
                            return {
                                isEqual: answer.is_equal,
                                text: answer.answer,
                                type: answer.type
                            }
                        })
                    }
                })
                setData(answerDetail)
                setLoading(false)
            })
    }, [])

    const getDetailScores = (studentId, scheduleId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/scores/mhs/${studentId}/jadwal/${scheduleId}`, { headers: { ...BEARER_TOKEN } })
                .then(({ data }) => {
                    resolve(data.data)
                })
                .catch(err => reject(data.data))
        })
    }

    const [data, setData] = useState([])
    return (
        <Container>
            <div className="mb-4">
                <ButtonKembali history={props.history} />
            </div>
            {
                loading ? <Spinner /> : <div>
                    <h5>Detail Nilai</h5>
                    <hr />
                    <div className="d-flex align-items-center mb-3">
                        <h6 className="mr-3">Nama Mahasiswa: <b>{detail.student.name}</b></h6>
                        <h6>Jadwal: <b>{detail.schedule.description}</b></h6>
                    </div>
                    <CollapseQuestion data={data} />
                </div>
            }
        </Container>
    )
}

export default NilaiDetail
