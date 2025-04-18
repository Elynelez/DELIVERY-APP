// import React, { useState, useEffect } from "react";
// import { Spin } from "antd"
// import { ExitElementsServer } from "../../../controllers/Modals/InventoryModals";
// import axios from "axios";

// const CashProduct = ({ ordersData, setOrdersData, rangeItems, socket, receiveOrders, URL_SERVER }) => {
//     const [loading, setLoading] = useState(false)
//     const [ordersExits, setOrdersExits] = useState([])
//     const [allValues, setAllValues] = useState(() => {
//         const savedData = JSON.parse(localStorage.getItem("exitData"))

//         return savedData && savedData.projects ?
//             savedData.projects.flatMap(obj => {
//                 return Array.from({ length: obj.quantity_currently }, () => obj.sku);
//             }) : []
//     });

//     useEffect(() => {
//         socket.on('getPendings', (pendings) => {
//             try {
//                 console.log(pendings)
//                 setOrdersData(pendings);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error handling loadOrders event:', error);
//             }
//         });

//         socket.on('dataOrderExit', obj => {
//             try {
//                 receiveOrders(obj);
//             } catch (error) {
//                 console.error('Error handling dataOrder event:', error);
//             }
//         })

//         return () => {
//             socket.off('dataOrderExit')
//         }
//     }, [socket])

//     useEffect(() => {
//         axios.get(URL_SERVER + "/inventory/exits")
//             .then((resp) => {
//                 const exits = resp.data

//                 setOrdersExits(exits)
//             })
//     }, [])

//     return (
//         <div className="container py-5">
//             {loading ? (
//                 <div className="text-center">
//                     <Spin tip="Cargando datos..." />
//                 </div>
//             ) : (
//                 <div className="container-main-RB">
//                     <div className="container-RBTable">
//                     </div>
//                     <ExitElementsServer
//                         pendingData={ordersData}
//                         setPendingData={setOrdersData}
//                         ordersExits={ordersExits}
//                         prev={allValues}
//                         rangeItems={rangeItems}
//                         setLoading={setLoading}
//                         nameButton={"Repetir Operación"}
//                         platformStatus={true}
//                         valueOrder={""}
//                         cash={true}
//                         socket={socket}
//                         receiveOrders={receiveOrders}
//                         URL_SERVER={URL_SERVER}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// }

// export default CashProduct
import React, { useState, useEffect } from "react";
import { Spin } from "antd"
import { ExitElementsServer } from "../../../controllers/Modals/InventoryModals";

const CashProduct = ({ ordersData, setOrdersData, rangeItems, socket, receiveOrders, URL_SERVER }) => {
    const [loading, setLoading] = useState(false)
    const [allValues, setAllValues] = useState(() => {
        const savedData = JSON.parse(localStorage.getItem("exitData"))

        return savedData && savedData.projects? 
        savedData.projects.flatMap(obj => {
            return Array.from({ length: obj.quantity_currently }, () => obj.sku);
        }) : []
    });

    useEffect(() => {

        socket.on('getExits', (loadedOrders) => {
            try {
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
                    <ExitElementsServer
                        pendingData={ordersData}
                        setPendingData={setOrdersData}
                        prev={allValues}
                        rangeItems={rangeItems}
                        setLoading={setLoading}
                        nameButton={"Repetir Operación"}
                        platformStatus={false}
                        valueOrder={""}
                        cash={true}
                        socket={socket}
                        receiveOrders={receiveOrders}
                        URL_SERVER={URL_SERVER}
                    />
                </div>
            )}
        </div>
    );
}

export default CashProduct