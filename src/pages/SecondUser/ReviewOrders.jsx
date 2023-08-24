import React, { useState } from "react";
import { Spin } from "antd";

const ReviewOrders = (props) => {
    const [loading, setLoading] = useState(true)

    setTimeout(() => {
        setLoading(false)
    }, 5000)

    return (
        <div>
            {loading ? (
                <Spin tip="Cargando datos..." >
                    <div style={{ height: '300px' }} />
                </Spin >
            ) : (
                props.children
            )}
        </div>
    );
}

export default ReviewOrders