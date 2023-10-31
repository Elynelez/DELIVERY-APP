import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import CircularProgress, {
    circularProgressClasses,
    CircularProgressProps,
} from '@mui/material/CircularProgress';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import React from "react";
import { Input, Form } from "antd"

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));

function FacebookCircularProgress(props) {
    return (
        <Box sx={{ position: 'relative' }}>
            <CircularProgress
                variant="determinate"
                sx={{
                    color: (theme) =>
                        theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                }}
                size={40}
                thickness={4}
                {...props}
                value={100}
            />
            <CircularProgress
                variant="indeterminate"
                disableShrink
                sx={{
                    color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                    animationDuration: '550ms',
                    position: 'absolute',
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: 'round',
                    },
                }}
                size={40}
                thickness={4}
                {...props}
            />
        </Box>
    );
}

const SellerForm = (props) => {
    const [form] = Form.useForm();
    const allProducts = props.allProducts

    console.log(allProducts)

    return (
        <>
            <FacebookCircularProgress />
            <br />
            <BorderLinearProgress variant="determinate" value={-180} />
            {allProducts.map(product => (
                <p>{product.code}</p>
            ))}
            <Form form={form}>
                <Form.Item
                    name="order_id"
                    label="richimc"
                >
                    <Input readOnly />
                </Form.Item>
            </Form>
        </>
    );
};

export default SellerForm;