import React, { useState, useEffect } from "react";
import { Spin } from "antd";


const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = useState([]);

    setTimeout(() => {
        setLoading(false)
    }, 8000)

    useEffect(() => {
        fetch("links.json")
            .then((response) => response.json())
            .then((data) => {
                setTableData(data);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <div>
            {loading ? (
                <Spin tip="Cargando datos...">
                    <div style={{ height: "300px" }} />
                </Spin>
            ) : (
                <div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Link</th>
                                <th scope="col">Lugar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row) => (
                                <tr key={row.id}>
                                    <th scope="row">{row.id}</th>
                                    <td>{row.title}</td>
                                    <td><a target="_blank" rel="noreferrer" href={row.body}>ir</a></td>
                                    <td>{row.handle}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Dashboard;