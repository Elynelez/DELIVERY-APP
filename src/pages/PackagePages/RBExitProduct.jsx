import React, { useState, useEffect } from "react";
import { Spin } from "antd"
import { ExitElements } from "../Controllers/Modals/InventoryModals";

const RBExitProduct = ({rangeItems, setRangeItems}) => {
    const [loading, setLoading] = useState(false)
    // const [rangeItems, setRangeItems] = useState([]);
    const API_URL = "https://script.google.com/macros/s/AKfycbwRsm3LpadEdArAsn2UlLS8EuU8JUETg0QAFCEna-RJ_9_YxSBByfog7eCwkqshAKVe/exec";
    const setReloadData = (value) => {
        console.log(value)
    }

    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    };

    const loadRange = async () => {
        setLoading(true);
        console.log("generación nueva de datos")
        try {
            const parsedData = await fetchData(API_URL);
            setRangeItems(parsedData);
            localStorage.setItem("cacheRangeItems", JSON.stringify(parsedData));
        } finally {
            setLoading(false);
        }
    };

    const loadRangeAndUpdateHourly = async () => {
       
        const lastUpdateTimestamp = localStorage.getItem("lastUpdateTimestamp");

        const currentTimestamp = new Date().getTime();

        const oneHourInMilliseconds = 60 * 60 * 1000; 
        const shouldUpdate = !lastUpdateTimestamp || (currentTimestamp - lastUpdateTimestamp) >= oneHourInMilliseconds;

        if (shouldUpdate) {
            await loadRange();
            
            localStorage.setItem("lastUpdateTimestamp", currentTimestamp);
        }

        setInterval(async () => {
            await loadRange();
        }, oneHourInMilliseconds);
    };

    useEffect(() => {
        (async () => {
            await loadRangeAndUpdateHourly();
        })();
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