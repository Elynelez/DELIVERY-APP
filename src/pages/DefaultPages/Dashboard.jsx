import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { PieChart, Pie, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';



const Dashboard = ({ ordersData, setOrdersData, socket, receiveOrders }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        socket.on('loadOrdersExits', (loadedOrders) => {
            try {
                console.log('loadOrders event received:', loadedOrders);
                setOrdersData(loadedOrders);
                setLoading(false);
            } catch (error) {
                console.error('Error handling loadOrders event:', error);
            }
        });

        socket.on('dataOrderExit', obj => {
            try {
                console.log('dataOrder event received:', obj);
                receiveOrders(obj);
            } catch (error) {
                console.error('Error handling dataOrder event:', error);
            }
        })

        return () => {
            socket.off('dataOrderExit')
        }
    }, [])

    const filterDataByHourAndDay = (date, startHour, endHour, email1, email2) => {
        var filteredData = ordersData.filter(obj => {

            var objDate = obj.date_generate.slice(0, 10);

            return objDate === date;
        }).filter(obj => (obj.packing.user == email1 || obj.packing.user == email2))

        var finalFilteredData = filteredData.filter(obj => {

            var objHour = new Date(obj.date_generate_ISO).getUTCHours() - 5

            return objHour >= startHour && objHour <= endHour;
        });

        return finalFilteredData
    }

    var today = new Date()

    let data = []

    for (var i = 0; i < 15; i++) {
        var date = new Date(today);
        date.setDate(today.getDate() - i);
        var real_date = date.toISOString().slice(0, 10);

        data.push({
            date: real_date,
            name: real_date.replace("2024-", ""),
            packing_top: {
                interval8_9: filterDataByHourAndDay(real_date, 8, 9, "pbello.inducor@gmail.com", "aforero.inducor@gmail.com").length,
                interval9_10: filterDataByHourAndDay(real_date, 9, 10, "pbello.inducor@gmail.com", "aforero.inducor@gmail.com").length,
                interval10_11: filterDataByHourAndDay(real_date, 10, 11, "pbello.inducor@gmail.com", "aforero.inducor@gmail.com").length,
                interval11_12: filterDataByHourAndDay(real_date, 11, 12, "pbello.inducor@gmail.com", "aforero.inducor@gmail.com").length,
                interval12_13: filterDataByHourAndDay(real_date, 12, 13, "pbello.inducor@gmail.com", "aforero.inducor@gmail.com").length,
                interval13_14: filterDataByHourAndDay(real_date, 13, 14, "pbello.inducor@gmail.com", "aforero.inducor@gmail.com").length,
                interval14_15: filterDataByHourAndDay(real_date, 14, 15, "pbello.inducor@gmail.com", "aforero.inducor@gmail.com").length,
                interval15_16: filterDataByHourAndDay(real_date, 15, 16, "pbello.inducor@gmail.com", "aforero.inducor@gmail.com").length,
                interval16_17: filterDataByHourAndDay(real_date, 16, 17, "pbello.inducor@gmail.com", "aforero.inducor@gmail.com").length,
                interval17_18: filterDataByHourAndDay(real_date, 17, 18, "pbello.inducor@gmail.com", "aforero.inducor@gmail.com").length,
                interval18_19: filterDataByHourAndDay(real_date, 18, 19, "pbello.inducor@gmail.com", "aforero.inducor@gmail.com").length,
                interval19_20: filterDataByHourAndDay(real_date, 19, 20, "pbello.inducor@gmail.com", "aforero.inducor@gmail.com").length
            },
            packing_top_total: filterDataByHourAndDay(real_date, 7, 21, "pbello.inducor@gmail.com", "aforero.inducor@gmail.com").length,
            packing_bottom: {
                interval8_9: filterDataByHourAndDay(real_date, 8, 9, "empaque.inducor@gmail.com", "empaque.inducor@gmail.com").length,
                interval9_10: filterDataByHourAndDay(real_date, 9, 10, "empaque.inducor@gmail.com", "empaque.inducor@gmail.com").length,
                interval10_11: filterDataByHourAndDay(real_date, 10, 11, "empaque.inducor@gmail.com", "empaque.inducor@gmail.com").length,
                interval11_12: filterDataByHourAndDay(real_date, 11, 12, "empaque.inducor@gmail.com", "empaque.inducor@gmail.com").length,
                interval12_13: filterDataByHourAndDay(real_date, 12, 13, "empaque.inducor@gmail.com", "empaque.inducor@gmail.com").length,
                interval13_14: filterDataByHourAndDay(real_date, 13, 14, "empaque.inducor@gmail.com", "empaque.inducor@gmail.com").length,
                interval14_15: filterDataByHourAndDay(real_date, 14, 15, "empaque.inducor@gmail.com", "empaque.inducor@gmail.com").length,
                interval15_16: filterDataByHourAndDay(real_date, 15, 16, "empaque.inducor@gmail.com", "empaque.inducor@gmail.com").length,
                interval16_17: filterDataByHourAndDay(real_date, 16, 17, "empaque.inducor@gmail.com", "empaque.inducor@gmail.com").length,
                interval17_18: filterDataByHourAndDay(real_date, 17, 18, "empaque.inducor@gmail.com", "empaque.inducor@gmail.com").length,
                interval18_19: filterDataByHourAndDay(real_date, 18, 19, "empaque.inducor@gmail.com", "empaque.inducor@gmail.com").length,
                interval19_20: filterDataByHourAndDay(real_date, 19, 20, "empaque.inducor@gmail.com", "empaque.inducor@gmail.com").length
            },
            packing_bottom_total: filterDataByHourAndDay(real_date, 7, 21, "empaque.inducor@gmail.com", "empaque.inducor@gmail.com").length,
        });
    }

    console.log(data)

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
                    {/* <div className="main-cards">
                        <div className="card">
                            <div className="card-inner">
                                <h3>MENSAJERIA</h3>
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
                    </div> */}
                    <table>
                        <thead>
                            <th>Hora</th>
                            {data.map(obj => (<th>
                                {obj.name}
                            </th>))}
                        </thead>
                        <tbody>
                            <tr>
                                <td>8-9 a.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_top.interval8_9}
                                </td>))}
                            </tr>
                            <tr>
                                <td>9-10 a.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_top.interval9_10}
                                </td>))}
                            </tr>
                            <tr>
                                <td>10-11 a.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_top.interval10_11}
                                </td>))}
                            </tr>
                            <tr>
                                <td>11-12 a.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_top.interval11_12}
                                </td>))}
                            </tr>
                            <tr>
                                <td>12-13 p.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_top.interval12_13}
                                </td>))}
                            </tr>
                            <tr>
                                <td>13-14 p.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_top.interval13_14}
                                </td>))}
                            </tr>
                            <tr>
                                <td>14-15 p.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_top.interval14_15}
                                </td>))}
                            </tr>
                            <tr>
                                <td>15-16 p.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_top.interval15_16}
                                </td>))}
                            </tr>
                            <tr>
                                <td>16-17 p.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_top.interval16_17}
                                </td>))}
                            </tr>
                            <tr>
                                <td>17-18 p.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_top.interval17_18}
                                </td>))}
                            </tr>
                            <tr>
                                <td>18-19 p.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_top.interval18_19}
                                </td>))}
                            </tr>
                            <tr>
                                <td>19-20 p.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_top.interval19_20}
                                </td>))}
                            </tr>
                        </tbody>
                    </table>
                    <table>
                        <thead>
                            <th>Hora</th>
                            {data.map(obj => (<th>
                                {obj.name}
                            </th>))}
                        </thead>
                        <tbody>
                            <tr>
                                <td>8-9 a.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_bottom.interval8_9}
                                </td>))}
                            </tr>
                            <tr>
                                <td>9-10 a.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_bottom.interval9_10}
                                </td>))}
                            </tr>
                            <tr>
                                <td>10-11 a.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_bottom.interval10_11}
                                </td>))}
                            </tr>
                            <tr>
                                <td>11-12 a.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_bottom.interval11_12}
                                </td>))}
                            </tr>
                            <tr>
                                <td>12-13 p.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_bottom.interval12_13}
                                </td>))}
                            </tr>
                            <tr>
                                <td>13-14 p.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_bottom.interval13_14}
                                </td>))}
                            </tr>
                            <tr>
                                <td>14-15 p.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_bottom.interval14_15}
                                </td>))}
                            </tr>
                            <tr>
                                <td>15-16 p.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_bottom.interval15_16}
                                </td>))}
                            </tr>
                            <tr>
                                <td>16-17 p.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_bottom.interval16_17}
                                </td>))}
                            </tr>
                            <tr>
                                <td>17-18 p.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_bottom.interval17_18}
                                </td>))}
                            </tr>
                            <tr>
                                <td>18-19 p.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_bottom.interval18_19}
                                </td>))}
                            </tr>
                            <tr>
                                <td>19-20 p.m</td>
                                {data.map(obj => (<td>
                                    {obj.packing_bottom.interval19_20}
                                </td>))}
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        {/* <BarChart
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
                        </BarChart> */}
                        <LineChart
                            width={800}
                            height={300}
                            data={data}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 10,
                                bottom: 20
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                name="packing arrriba"
                                type="monotone"
                                dataKey="packing_top_total"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                            />
                            <Line
                                name="packing abajo"
                                type="monotone"
                                dataKey="packing_bottom_total"
                                stroke="#82ca9d"
                            />
                        </LineChart>
                    </div>
                </main>
            )}
        </div>
    );
};

export default Dashboard;