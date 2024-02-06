import React, { useState, useEffect } from "react";
import { Spin } from "antd"
import { ExitElements, ExitElementsServer } from "../Controllers/Modals/InventoryModals";

const RBExitProduct = ({ pendingData, setPendingData, rangeItems, socket, receiveOrders }) => {
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        socket.on('loadOrders', (loadedOrders) => {
            try {
                console.log('loadOrders event received:', loadedOrders);
                setPendingData(loadedOrders);
                setLoading(false);
            } catch (error) {
                console.error('Error handling loadOrders event:', error);
            }
        });

        socket.on('dataOrder', obj => {
            try {
                console.log('dataOrder event received:', obj);
                receiveOrders(obj);
            } catch (error) {
                console.error('Error handling dataOrder event:', error);
            }
        })

        return () => {
            socket.off('dataOrder')
        }
    }, [])

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
                    {/* <ExitElements
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
                    /> */}
                    <ExitElementsServer
                        pendingData={pendingData}
                        setPendingData={setPendingData}
                        prev={[]}
                        rangeItems={rangeItems}
                        setLoading={setLoading}
                        nameButton={"Repetir Operación"}
                        platformStatus={false}
                        valueOrder={""}
                        cash={true}
                        socket={socket}
                        receiveOrders={receiveOrders}
                    />
                </div>
            )}
        </div>
    );
}

export default RBExitProduct