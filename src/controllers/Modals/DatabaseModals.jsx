import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Spin, message, Select, Checkbox, InputNumber, Row, Col } from 'antd';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const ActivePauseModal = ({ data, loading, setLoading, statusColorMap, URL_SERVER }) => {
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleUpdateStatus = async (e) => {
        Modal.confirm({
            title: '¿Seguro que quieres realizar este cambio?',
            content: 'Esta acción no se puede deshacer.',
            onOk: async () => {
                message.info('unos momentos')
                setVisible(false)
                setLoading(true);
                fetch(`${URL_SERVER}/database/publication/${e.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(e)
                })
                    .then(response => response.json())
                    .then(data => {
                        message.success('Cargado exitosamente');
                        setLoading(false)
                    })
                    .catch(error => {
                        console.error('Error changing row:', error);
                        message.info('no se pudo completar la operación')
                    });
            },
        });
    };

    return (
        <div>
            <Button onClick={showModal}>Activar y Pausar</Button>
            <Modal open={visible} title="Publicaciones" onCancel={handleCancel} footer={null}>
                <Spin spinning={loading}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Status</TableCell>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Código</TableCell>
                                    <TableCell>Variante</TableCell>
                                    <TableCell>Acción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.publicaciones.map((obj) => (
                                    <TableRow key={obj.id}>
                                        <TableCell>
                                            <div className={`w-2 h-2 mt-1 ${statusColorMap(obj)} rounded-full`} />
                                        </TableCell>
                                        <TableCell>{obj.plataforma}</TableCell>
                                        <TableCell>{obj.codigo}</TableCell>
                                        <TableCell>{obj.variante}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleUpdateStatus({ active: !obj.active, id: obj.id })}>
                                                {obj.active ? 'Desactivar' : 'Activar'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Spin>
            </Modal>
        </div>
    );
};

const AddPublicationModal = ({ data, loading, setLoading, platforms, URL_SERVER }) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [options, setOptions] = useState([]);

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    useEffect(() => {
        setOptions(platforms.map((item) => ({ value: item.id, label: item.nombre })));
    }, [platforms]);

    const onFinish = async (e) => {
        const payload = {
            ...e,
            marcaNombre: null,
            producto: data.producto_id,
        };

        Modal.confirm({
            title: '¿Seguro que quieres crear esta publicación?',
            content: 'Esta acción no se puede deshacer.',
            onOk: () => {
                message.info('unos momentos')
                setVisible(false)
                setLoading(true);
                fetch(`${URL_SERVER}/database/publication`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                })
                    .then(response => response.json())
                    .then(data => {
                        message.success('Cargado exitosamente');
                        setLoading(false)
                    })
                    .catch(error => {
                        console.error('Error changing row:', error);
                        message.info('no se pudo completar la operación')
                    });
            },
        });
    };

    return (
        <div>
            <Button onClick={showModal}>Agregar Publicación</Button>
            <Modal
                open={visible}
                title="Formulario de creación"
                onCancel={handleCancel}
                footer={null}
            >
                <Spin spinning={loading}>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        layout="vertical"
                        initialValues={{
                            fijo: false,
                            active: false,
                            medellin: null,
                            full: false,
                            variante: null
                        }}
                    >
                        <Form.Item label="Plataforma" name="plataforma" rules={[{ required: true, message: 'Ingresa la plataforma' }]}>
                            <Select options={options} style={{ width: 140 }} />
                        </Form.Item>
                        <Form.Item label="Fijo" name="fijo" valuePropName="checked">
                            <Checkbox />
                        </Form.Item>
                        <Form.Item label="Código" name="codigo" rules={[{ required: true, message: 'Ingresa el código' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Activo" name="active" valuePropName="checked">
                            <Checkbox />
                        </Form.Item>
                        <Form.Item label="Variante" name="variante">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Medellín" name="medellin" valuePropName="checked">
                            <Checkbox />
                        </Form.Item>
                        <Form.Item label="Precio" name="precio">
                            <InputNumber min={0} style={{ width: 140 }} />
                        </Form.Item>
                        <Form.Item label="Descuento (%)" name="descuento" rules={[{ required: true, message: 'Ingresa el descuento' }]}>
                            <InputNumber min={0} max={100} style={{ width: 140 }} />
                        </Form.Item>
                        <Form.Item label="Unidades de venta" name="unidades_venta" rules={[{ required: true, message: 'Ingresa las unidades' }]}>
                            <InputNumber min={1} max={99} />
                        </Form.Item>
                        <Form.Item label="Full" name="full" valuePropName="checked">
                            <Checkbox />
                        </Form.Item>
                        <div className='grid grid-cols-2 pt-2 gap-12 place-content-center px-16'>
                            <Button onClick={handleCancel}>Cancelar</Button>
                            <Button type="primary" htmlType="submit">Enviar</Button>
                        </div>
                    </Form>
                </Spin>
            </Modal>
        </div>
    );
};

const AddSkuModal = ({ data, loading, setLoading, URL_SERVER }) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const onFinish = async (e) => {
        Modal.confirm({
            title: '¿Seguro que quieres agregar este sku?',
            content: 'Esta acción no se puede deshacer.',
            onOk: () => {
                message.info('unos momentos')
                setVisible(false)
                setLoading(true);
                fetch(`${URL_SERVER}/database/sku/${data.producto_id}`, {
                    redirect: "follow",
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sku: e.sku.toUpperCase() })
                })
                    .then(response => response.json())
                    .then(data => {
                        message.success('Cargado exitosamente');
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error('Error changing row:', error);
                        message.info('no se pudo completar la operación')
                    });
            },
        });
    };

    return (
        <div>
            <Button onClick={showModal}>Agregar Sku</Button>
            <Modal
                open={visible}
                title="Actualizar"
                onCancel={handleCancel}
                footer={null}
            >
                <Spin spinning={loading}>
                    <Form form={form} onFinish={onFinish} layout="vertical">
                        <Form.Item
                            label="Sku"
                            name="sku"
                            labelAlign="left"
                            rules={[{ required: true, message: 'Ingresa el sku' }]}
                        >
                            <Input onChange={() => setDisabled(false)} />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" disabled={disabled}>Enviar</Button>
                    </Form>
                </Spin>
            </Modal>
        </div>
    );
};

const DeletePublicationModal = ({ data, loading, setLoading, statusColorMap, URL_SERVER }) => {
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleUpdateStatus = async (e) => {
        Modal.confirm({
            title: '¿Seguro que quieres eliminar esta publicación?',
            content: 'Esta acción no se puede deshacer.',
            onOk: () => {
                message.info('unos momentos')
                setVisible(false)
                setLoading(true)
                fetch(`${URL_SERVER}/database/publication/${e.id}`, {
                    method: 'DELETE',
                })
                    .then(response => response.json())
                    .then(data => {
                        message.success('Contenido borrado exitosamente');
                        setLoading(false)
                    })
                    .catch(error => {
                        console.error('Error changing row:', error);
                        message.info('no se pudo completar la operación')
                    });
            },
        });
    };

    return (
        <div>
            <Button onClick={showModal}>Eliminar Publicación</Button>
            <Modal
                open={visible}
                title="Publicaciones"
                onCancel={handleCancel}
                footer={null}
            >
                <Spin spinning={loading}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Status</TableCell>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Código</TableCell>
                                    <TableCell>Variante</TableCell>
                                    <TableCell>Acción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.publicaciones.map((obj) => (
                                    <TableRow key={obj.id}>
                                        <TableCell>
                                            <div className={`w-2 h-2 mt-1 ${statusColorMap(obj)} rounded-full`} />
                                        </TableCell>
                                        <TableCell>{obj.plataforma}</TableCell>
                                        <TableCell>{obj.codigo}</TableCell>
                                        <TableCell>{obj.variante}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleUpdateStatus({ id: obj.id })}>
                                                Eliminar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Spin>
            </Modal>
        </div>
    );
};

const DeleteSkuModal = ({ data, loading, setLoading, URL_SERVER }) => {
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleDeleteSku = async (e) => {
        Modal.confirm({
            title: '¿Seguro que quieres eliminar esta publicación?',
            content: 'Esta acción no se puede deshacer.',
            onOk: () => {
                message.info('unos momentos')
                setVisible(false)
                setLoading(true)
                fetch(`${URL_SERVER}/database/sku/${data.producto_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ sku: e })
                })
                    .then(response => response.json())
                    .then(data => {
                        message.success('Contenido borrado exitosamente');
                        setLoading(false)
                    })
                    .catch(error => {
                        console.error('Error changing row:', error);
                        message.info('no se pudo completar la operación')
                    });
            },
        });
    };

    return (
        <div>
            <Button onClick={showModal}>Eliminar Sku</Button>
            <Modal
                open={visible}
                title="Skus"
                onCancel={handleCancel}
                footer={null}
            >
                <Spin spinning={loading}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Código</TableCell>
                                    <TableCell>Acción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.skus.map((sku) => (
                                    <TableRow key={sku}>
                                        <TableCell>{sku}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleDeleteSku(sku)}>
                                                Eliminar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Spin>
            </Modal>
        </div>
    );
};

const EditProductModal = ({ data, loading, setLoading, URL_SERVER }) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const onFinish = async (e) => {
        Modal.confirm({
            title: '¿Seguro que quieres actualizar este producto?',
            content: 'Esta acción no se puede deshacer.',
            onOk: () => {
                message.info('unos momentos')
                setVisible(false)
                setLoading(true)
                fetch(`${URL_SERVER}/database/product/edit/${data.producto_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        imagen: e.imagen,
                        nombre: e.nombre,
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        message.success('Contenido actualizado exitosamente');
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error('Error changing row:', error);
                        message.info('no se pudo completar la operación')
                    });
            },
        });
    };

    return (
        <div>
            <Button onClick={showModal}>Editar Producto</Button>
            <Modal
                open={visible}
                title="Actualizar"
                onCancel={handleCancel}
                footer={null}
            >
                <Spin spinning={loading}>
                    <Form form={form} onFinish={onFinish} layout="vertical">
                        <Form.Item
                            label='Nombre Producto'
                            name="nombre"
                            rules={[{ required: true, message: 'Ingresa el nombre del producto' }]}
                            className='mt-6'
                            initialValue={data.nombre}
                        >
                            <Input />
                        </Form.Item>
                        <div>
                            <Form.Item
                                label="Url de la imagen"
                                name="imagen"
                                rules={[{ required: true, message: 'Ingresa la imagen del producto' }]}
                                initialValue={data.url_imagen}
                            >
                                <Input />
                            </Form.Item>
                            {data.url_imagen && (
                                <div className='flex flex-col justify-center items-center w-full h-full mb-6'>
                                    <h2 className='text-center'>Previsualización de la imagen:</h2>
                                    <img
                                        src={data.url_imagen}
                                        alt="Previsualización de la imagen"
                                        className="max-w-full max-h-[300px] mt-4"
                                    />
                                </div>
                            )}
                        </div>
                        <div className='grid grid-cols-2 pt-2 gap-12 place-content-center px-16'>
                            <Button onClick={handleCancel}>Cancelar</Button>
                            <Button type="primary" htmlType="submit">Actualizar</Button>
                        </div>
                    </Form>
                </Spin>
            </Modal>
        </div>
    );
};

const FixProductModal = ({ data, loading, setLoading, URL_SERVER }) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const onFinish = async (e) => {
        Modal.confirm({
            title: '¿Seguro que quieres fijar este producto?',
            content: 'Esta acción no se puede deshacer.',
            onOk: () => {
                message.info('unos momentos')
                setVisible(false)
                setLoading(true)
                fetch(`${URL_SERVER}/database/fix`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        datos: [
                            {
                                id: data.producto_id,
                                sku: data.skus[0],
                                cantidad: Number(e.cantidad),
                            },
                        ],
                    }),
                })
                    .then(response => response.json())
                    .then(data => {
                        message.success('Contenido ajustado exitosamente');
                        setLoading(false)
                    })
                    .catch(error => {
                        console.error('Error changing row:', error);
                        message.info('no se pudo completar la operación')
                    });
            },
        });
    };

    return (
        <div>
            <Button onClick={showModal}>Fijar Producto</Button>
            <Modal
                open={visible}
                title="Fijar"
                onCancel={handleCancel}
                footer={null}
            >
                <Spin spinning={loading}>
                    <Form form={form} onFinish={onFinish} layout="vertical">
                        <Form.Item
                            label="Nombre Producto"
                            name="nombre"
                            className="mt-6"
                            initialValue={data.nombre}
                        >
                            <Input readOnly />
                        </Form.Item>
                        <Form.Item
                            label="Cantidad"
                            name="cantidad"
                            rules={[{ required: true, message: 'Ingresa la cantidad del producto' }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <div className="grid grid-cols-2 pt-2 gap-12 place-content-center px-16">
                            <Button onClick={handleCancel}>Cancelar</Button>
                            <Button type="primary" htmlType="submit">
                                Fijar
                            </Button>
                        </div>
                    </Form>
                </Spin>
            </Modal>
        </div>
    );
};

const UnfixProductModal = ({ data, loading, setLoading, URL_SERVER }) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const onFinish = async () => {
        Modal.confirm({
            title: '¿Seguro que quieres desfijar este producto?',
            content: 'Esta acción no se puede deshacer.',
            onOk: async () => {
                message.info('unos momentos')
                setVisible(false)
                setLoading(true)
                fetch(`${URL_SERVER}/database/unfix`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        datos: [
                            {
                                id: data.producto_id,
                                sku: data.skus[0],
                                cantidad: 0,
                            },
                        ],
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        message.success('Contenido desfijado exitosamente');
                        setLoading(false)
                    })
                    .catch(error => {
                        console.error('Error changing row:', error);
                        message.info('no se pudo completar la operación')
                    });
            }
        });
    };

    return (
        <div>
            <Button onClick={showModal}>Desfijar Producto</Button>
            <Modal open={visible} title="Desfijar" onCancel={handleCancel} footer={null}>
                <Spin spinning={loading}>
                    <Form form={form} onFinish={onFinish} layout="vertical">
                        <Form.Item label="Nombre Producto" name="nombre" className="mt-6" initialValue={data.nombre}>
                            <Input readOnly />
                        </Form.Item>
                        <div className="grid grid-cols-2 pt-2 gap-12 place-content-center px-16">
                            <Button onClick={handleCancel}>Cancelar</Button>
                            <Button type="primary" htmlType="submit">
                                Desfijar
                            </Button>
                        </div>
                    </Form>
                </Spin>
            </Modal>
        </div>
    );
};

const CreateProductModal = ({ data, setReloadData, URL_SERVER, colors }) => {
    const [form] = Form.useForm();
    const [formKit, setFormKit] = useState(false);
    const [visible, setVisible] = useState(false);
    const [imagen, setImagen] = useState(undefined);

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleChange = (value) => {
        setFormKit(value === 2);
    };

    const handleChangeImagen = (e) => {
        setImagen(e.target.value);
    };

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
        },
        wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 20, offset: 0 },
        },
    };

    const confirmAndSubmit = async (url, payload, successMessage) => {
        Modal.confirm({
            title: '¿Seguro que quieres realizar esta acción?',
            content: 'Esta acción no se puede deshacer.',
            onOk: async () => {
                message.info('unos momentos')
                setVisible(false)
                setReloadData(true)
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                    .then(response => response.json())
                    .then(data => {
                        message.success(successMessage);
                        setReloadData(false)
                    })
                    .catch(error => {
                        console.error('Error changing row:', error);
                        message.info('no se pudo completar la operación')
                    });
            },
        });
    };

    const onFinish = async (e) => {
        const payload = { ...e };

        if (formKit) {
            payload.productos = e.productos.map((skuProducto) => {
                const producto = data.find((obj) => obj.skus.includes(skuProducto));
                return producto ? producto.producto_id : skuProducto;
            });

            payload.marcaNombre = e.marca;
            ['sku', 'tipo', 'marca'].forEach((key) => delete payload[key]);

            await confirmAndSubmit(`${URL_SERVER}/database/kit`, payload, 'Kit creado exitosamente');
        } else {
            payload.marcaNombre = e.marca;
            ['tipo', 'marca', 'productos'].forEach((key) => delete payload[key]);

            await confirmAndSubmit(`${URL_SERVER}/database/product`, payload, 'Producto creado exitosamente');
        }
    };

    return (
        <div>
            <Button
                type='primary'
                style={{ backgroundColor: colors.blueAccent[1000] }}
                onClick={showModal}
            >
                Crear Producto
            </Button>
            <Modal open={visible} title="Crear" onCancel={handleCancel} footer={null}>
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Form.Item label="tipo" name="tipo" rules={[{ required: true }]}>
                        <Select
                            style={{ width: 100 }}
                            options={[{ value: 1, label: 'producto' }, { value: 2, label: 'kit' }]}
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label={formKit ? 'Nombre del kit' : 'Nombre del producto'} name="nombre" rules={[{ required: true, message: 'Ingresa el nombre' }]}>
                        <Input />
                    </Form.Item>
                    <div className='flex gap-24 ml-2'>
                        <Form.Item label="marca" name="marca" style={{ width: 200 }} rules={[{ required: true, message: 'Ingresa la marca' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Sku" name="sku" style={{ width: 200 }} rules={[{ required: true, message: 'Ingresa el SKU' }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <Form.Item label="Url de la imagen" name="imagen" rules={[{ required: true, message: 'Ingresa la imagen del producto' }]}>
                        <Input onChange={handleChangeImagen} />
                    </Form.Item>
                    {imagen && (
                        <div className='flex flex-col justify-center items-center w-full h-full mb-6'>
                            <h2 className='text-center'>Previsualización de la imagen:</h2>
                            <img src={imagen} alt="Previsualización" className="max-w-full max-h-[300px] mt-4" />
                        </div>
                    )}
                    {formKit && (
                        <div className='flex flex-col justify-center items-center border-4 mb-6 pt-6'>
                            <Form.List name='productos'>
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field) => (
                                            <Form.Item {...formItemLayout} key={field.key}>
                                                <Form.Item {...field} rules={[{ required: true, whitespace: true, message: 'Ingresar el sku o eliminar este campo' }]}>
                                                    <Input placeholder='Sku del producto' style={{ width: '130%' }} />
                                                </Form.Item>
                                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                                            </Form.Item>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} style={{ width: '100%' }}>Agregar Sku</Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </div>
                    )}
                    <div className='grid grid-cols-2 pt-2 gap-12 place-content-center px-16'>
                        <Button onClick={handleCancel}>Cancelar</Button>
                        <Button type="primary" htmlType="submit">Crear</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

const UpdateStockModal = ({ data, setReloadData, URL_SERVER, colors }) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const onFinish = async (e) => {
        const ids = e.projects
            .map((obj) => {
                const match = obj.nombre.match(/id:(\d+)/);
                return match ? parseInt(match[1], 10) : null;
            })
            .filter((id) => id !== null);

        try {
            Modal.confirm({
                title: '¿Seguro que quieres actualizar el stock de estos productos?',
                content: 'Esta acción no se puede deshacer.',
                onOk: () => {
                    message.info('unos momentos')
                    setVisible(false)
                    setReloadData(true)
                    fetch(`${URL_SERVER}/database/update/stock`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ ids })
                    })
                        .then(response => response.json())
                        .then(data => {
                            message.success('Contenido actualizado exitosamente');
                            setReloadData(false);
                        })
                        .catch(error => {
                            console.error('Error changing row:', error);
                            message.info('no se pudo completar la operación')
                        });
                },
            });
        } catch (err) {
            console.error('Error en la solicitud:', err);
            message.error('No se pudo realizar la solicitud');
        }
    };

    return (
        <div>
            <Button
                type='primary'
                style={{ backgroundColor: colors.blueAccent[1000] }}
                onClick={showModal}
            >
                Actualizar stock
            </Button>
            <Modal open={visible} title="Actualizar stock" onCancel={handleCancel} footer={null}>
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Form.List name="projects">
                        {(fields, { add, remove }) => (
                            <>
                                <Form.Item>
                                    <Button className="button-add-form" style={{ backgroundColor: "#4cceac" }} onClick={add}>
                                        Agregar
                                    </Button>
                                </Form.Item>
                                <div className="limit-group-form">
                                    {fields.map((field, index) => (
                                        <Row gutter={[12, 16]} key={index}>
                                            <Col span={16}>
                                                <Form.Item
                                                    {...field}
                                                    label={<label style={{ color: "#4cceac" }}>Nombre</label>}
                                                    name={[index, "nombre"]}
                                                    rules={[{ required: true }]}
                                                >
                                                    <Select
                                                        className="input-info-form"
                                                        style={{ borderBottom: "1px solid #055160" }}
                                                        showSearch
                                                        placeholder="Selecciona un producto"
                                                    >
                                                        {data.map((obj) => (
                                                            <Select.Option
                                                                key={obj.producto_id}
                                                                value={`${obj.nombre} ${obj.skus} id:${obj.producto_id}`}
                                                            >
                                                                {obj.nombre} - {obj.skus}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Button danger onClick={() => remove(index)}>
                                                    Eliminar
                                                </Button>
                                            </Col>
                                        </Row>
                                    ))}
                                </div>
                            </>
                        )}
                    </Form.List>
                    <div className="grid grid-cols-2 pt-2 gap-12 place-content-center px-16">
                        <Button onClick={handleCancel}>Cancelar</Button>
                        <Button type="primary" htmlType="submit">
                            Actualizar
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export { ActivePauseModal, AddPublicationModal, AddSkuModal, CreateProductModal, DeletePublicationModal, DeleteSkuModal, EditProductModal, FixProductModal, UnfixProductModal, UpdateStockModal };