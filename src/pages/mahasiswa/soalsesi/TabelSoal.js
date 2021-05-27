import React from "react";
import { MDBDataTableV5 } from "mdbreact";

function TableSesi({ datatable }) {
    return (
        <MDBDataTableV5
            responsive
            hover
            entriesOptions={[10, 20, 25]}
            entries={10}
            pagesAmount={4}
            data={datatable}
        />
    );
}

export default TableSesi;
