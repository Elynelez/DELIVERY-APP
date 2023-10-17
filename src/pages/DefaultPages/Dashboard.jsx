import React, { useState } from "react";
import { Spin } from "antd";
import { PieChart, Pie, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';



const Dashboard = () => {

    const [loading, setLoading] = useState(true);

    setTimeout(() => {
        setLoading(false)
    }, 8000)

    const data = [
        {
            name: 'Page A',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'Page E',
            uv: 1890,
            pv: 4800,
            amt: 2181,
        },
        {
            name: 'Page F',
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'Page G',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
    ];

    const dataRadio = [
        { name: "Group A", value: 900 },
        { name: "Group B", value: 300 },
        { name: "Group C", value: 300 },
        { name: "Group D", value: 200 },
        { name: "Group E", value: 278 },
        { name: "Group F", value: 189 }
    ];

    return (
        <div>
            {loading ? (
                <Spin tip="Cargando datos...">
                    <div style={{ height: "300px" }} />
                </Spin>
            ) : (
                <main className="main-container">
                    <div className="main-title">
                        <h3>DASHBOARD</h3>
                    </div>
                    <div className="main-cards">
                        <div className="card">
                            <div className="card-inner">
                                <h3>PRODUCTOS</h3>
                                <div>
                                    <PieChart width={400} height={400}>
                                        <Pie
                                            dataKey="value"
                                            startAngle={360}
                                            endAngle={0}
                                            data={dataRadio}
                                            cx={200}
                                            cy={200}
                                            outerRadius={80}
                                            fill="lightgray"
                                            label
                                        />
                                    </PieChart>
                                </div>
                            </div>
                            <h1>300</h1>
                        </div>
                        <div className="card">
                            <div className="card-inner">
                                <h3>INVENTARIO</h3>
                                <div>
                                    <PieChart width={400} height={400}>
                                        <Pie
                                            dataKey="value"
                                            startAngle={360}
                                            endAngle={0}
                                            data={dataRadio}
                                            cx={200}
                                            cy={200}
                                            outerRadius={80}
                                            fill="lightgray"
                                            label
                                        />
                                    </PieChart>
                                </div>
                            </div>
                            <h1>12</h1>
                        </div>
                        <div className="card">
                            <div className="card-inner">
                                <h3>VENDEDORES</h3>
                                <div>
                                    <PieChart width={400} height={400}>
                                        <Pie
                                            dataKey="value"
                                            startAngle={360}
                                            endAngle={0}
                                            data={dataRadio}
                                            cx={200}
                                            cy={200}
                                            outerRadius={80}
                                            fill="lightgray"
                                            label
                                        />
                                    </PieChart>
                                </div>
                            </div>
                            <h1>33</h1>
                        </div>
                        <div className="card">
                            <div className="card-inner">
                                <h3>NOVEDADES</h3>
                                <div>
                                    <PieChart width={400} height={400}>
                                        <Pie
                                            dataKey="value"
                                            startAngle={360}
                                            endAngle={0}
                                            data={dataRadio}
                                            cx={200}
                                            cy={200}
                                            outerRadius={80}
                                            fill="lightgray"
                                            label
                                        />
                                    </PieChart>
                                </div>
                            </div>
                            <h1>42</h1>
                        </div>
                    </div>

                    <div className="charts">
                        <BarChart
                            width={500}
                            height={300}
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="pv" fill="#8884d8" />
                            <Bar dataKey="uv" fill="#82ca9d" />
                        </BarChart>
                        <LineChart
                            width={500}
                            height={300}
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="pv"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                            />
                            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                        </LineChart>
                    </div>
                </main>
            )}
        </div>
    );
};

export default Dashboard;