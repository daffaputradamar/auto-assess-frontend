import React from "react";
import { MDBDataTableV5 } from "mdbreact";

function DataTable({ datatable }) {
    return (
        <MDBDataTableV5
            responsive
            hover
            entriesOptions={[5, 20, 25]}
            entries={5}
            pagesAmount={4}
            data={datatable}
        />
    );
}

export default DataTable;
