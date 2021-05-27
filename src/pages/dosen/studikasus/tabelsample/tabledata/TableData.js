import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Container } from 'reactstrap'
import ButtonKembali from '../../../../../components/buttonkembali'
import DynamicTable from '../../../../../components/dynamictable'
import Spinner from '../../../../../components/spinner'
import { BEARER_TOKEN, ENDPOINT_BACKEND } from '../../../../../config'

function TableData(props) {
    const [loading, setLoading] = useState(true)
    const [tableData, setTableData] = useState([{ "id": 1, "nama": "Daffa", "kelas": "1A", "nim": "1741720017" }, { "id": 2, "nama": "Akbar", "kelas": "2B", "nim": "174172818" }])

    const { id, table } = useParams()

    useEffect(() => {
        setLoading(true)
        getData(id, table)
            .then(() => setLoading(false))
    }, [])

    const getData = (id, table) => {
        return new Promise((resolve, reject) => {
            axios.get(`${ENDPOINT_BACKEND}/casestudies/${id}/data/${table}`, {
                headers: { ...BEARER_TOKEN }
            })
                .then(({ data }) => {
                    console.log(data.data)
                    setTableData(data.data)
                    resolve(true)
                })
                .catch(err => reject(err))
        })
    }

    return (
        <Container>
            <ButtonKembali history={props.history} />
            <hr />
            {loading ? <Spinner /> : <DynamicTable data={tableData} name={table} />}
        </Container>
    )
}

export default TableData
