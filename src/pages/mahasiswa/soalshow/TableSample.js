import React, { useState } from 'react'
import TableSampleItem from './TableSampleItem'

function TableSample({ tables }) {
    // const [data,] = useState({
    //     A: [{ "id": 1, "nama": "Daffa", "kelas": "1A", "nim": "1741720017" }, { "id": 2, "nama": "Akbar", "kelas": "2B", "nim": "174172818" }],
    //     B: [{ "id": 1, "nama": "Daffa", "kelas": "1A" }, { "id": 2, "nama": "Akbar", "kelas": "2B" }]
    // })

    return (
        Object.keys(tables).map(key => {
            return <TableSampleItem key={key} table={key} data={tables[key]} />
        })
    )
}

export default TableSample
