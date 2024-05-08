import React, { useState } from 'react';
import DataTableGrid from "../../controllers/Tables/DataGridPro";

const CSVReader = ({ API_URL }) => {
    const [csvData, setCsvData] = useState([]);

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const text = event.target.result;
            const data = parseCSV(text);
            setCsvData(data);
        };

        reader.readAsText(file);
    };

    const parseCSV = (text) => {
        console.log(text)
        const rows = text.split('\n').map(row => row.split(','))
        const data = rows.slice(1).map(row => {
            const obj = {};
            row.forEach((cell, index) => {
                obj[rows[0][index].replace(/[^a-zA-Z]/g, '')] = cell
            });
            return obj;
        }).filter(obj => obj.Estado != "")

        fetch(API_URL + "platforms/rappi", {
            redirect: "follow",
            method: 'POST',
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(resp => {
                console.log(resp)
            })
            .catch(error => {
                console.error('Error cancelling order:', error);
            });

        console.log(data)
        return data;
    };

    const columns = [
        { headerName: 'EAN', field: "EAN", flex: 1 },
        { headerName: 'Ciudad', field: "Ciudad", flex: 1 },
        { headerName: 'Email', field: "Email", flex: 1 },
        { headerName: 'Estado', field: "Estado", flex: 1 },
        { headerName: 'ID', field: "IDdelaorden", flex: 1 }
    ]

    return (
        <div>
            <h2>CSV Reader</h2>
            <input type="file" accept=".csv" onChange={handleFileInputChange} />
            <div>
                <h3>CSV Data:</h3>
                <DataTableGrid
                    key={csvData.length}
                    columns={columns}
                    data={csvData.map((obj, index) => { return { ...obj, id: index } })}
                />
            </div>
        </div>
    );
};

export default CSVReader;