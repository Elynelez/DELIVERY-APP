import React, { useState, useEffect } from "react";
import { Spin } from "antd"
import { ExitElements } from "../Controllers/Modals/InventoryModals";

const RBExitProduct = () => {
    const [loading, setLoading] = useState(true)
    const [rangeItems, setRangeItems] = useState([]);
    const setReloadData = (value) => {
        console.log(value)
    }

    useEffect(() => {
        setLoading(true);
        fetch("https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec")
            .then(response => response.json())
            .then(parsedData => {
                setRangeItems(parsedData)
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="container py-5">
            {loading ? (
                <div className="text-center">
                    <Spin tip="Cargando datos..." />
                </div>
            ) : (
                <div className="container-main-RB">
                    <div className="container-RBTable">
                    </div>
                    <ExitElements
                        prev={[]}
                        rangeItems={rangeItems}
                        setLoading={setLoading}
                        nameButton={"Repetir Operación"}
                        platformStatus={false}
                        urlFetch={"https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec?exit"}
                        valueOrder={""}
                        cells={[]}
                        cash={true}
                        setReloadData={setReloadData}
                    />
                </div>
            )}
        </div>
    );
}

export default RBExitProduct