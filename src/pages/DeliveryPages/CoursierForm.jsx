import { useState, useEffect } from "react";
import { Form, Select, Input, Upload, Button, Spin } from "antd";

const { Option } = Select;

const FormDelivery = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [isHidden, setIsHidden] = useState(false);
  const [imageObject, setImageObject] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    google.script.run
      .withSuccessHandler((res) => {
        console.log(res);
        setOrders(res);
        setLoading(false);
      })
      .getPending();
  }, []);

  const getBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.file.originFileObj);
    reader.onload = () => {
      file.file.status = "done";
      setImageObject((img) => [{ name: file.file.name, img: reader.result }, ...(img || [])]);
    };
    reader.onerror = (error) => console.error("Error:", error);
  };

  const changeStatus = (id) => {
    const req = orders.find((obj) => obj.id == id);
    setIsHidden(req?.order?.transactions?.condition.includes("PAGO"));
  };

  const handleSubmit = (status) => {
    setLoading(true);
    form
      .validateFields()
      .then((values) => {
        values.image = imageObject;
        values.status = status;

        google.script.run
          .withSuccessHandler(() => {
            setOrders(orders.filter((obj) => obj.id != values.order));
            console.log("Upload successful:", values);
            form.resetFields();
            setLoading(false);
          })
          .withFailureHandler((error) => console.error("Upload failed:", error))
          .postDelivery(values);
      })
      .catch((error) => console.log("Error en la validación", error));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="w-full max-w-md mx-auto py-5">
        {loading ? (
          <div className="text-center">
            <Spin tip="Cargando datos..." />
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-md p-4">
            <h1 className="text-xl font-bold text-center mb-4">
              INDUSTRIAS <span className="text-blue-600">DUCOR</span>
            </h1>
            <Form form={form} layout="vertical">
              <Form.Item
                label="Pedido"
                name="order"
                rules={[{ required: true }]}
              >
                <Select onChange={changeStatus} className="w-full">
                  <Option value="" disabled selected hidden>
                    Seleccionar
                  </Option>
                  {orders.map((obj, index) => (
                    <Option value={obj.id} key={index}>
                      {obj.order.customer.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {!isHidden && (
                <Form.Item
                  label="Medio de pago"
                  name="method"
                  rules={[{ required: true }]}
                >
                  <Select className="w-full">
                    <Option value="" disabled selected hidden>
                      Seleccionar
                    </Option>
                    <Option value="TRANSFERENCIA ANDREA">TRANSFERENCIA ANDREA</Option>
                    <Option value="TRANSFERENCIA NICOLAS">TRANSFERENCIA NICOLAS</Option>
                    <Option value="TRANSFERENCIA MENSAJERO">TRANSFERENCIA MENSAJERO</Option>
                    <Option value="MERCADOPAGO">MERCADOPAGO</Option>
                    <Option value="EFECTIVO">EFECTIVO</Option>
                  </Select>
                </Form.Item>
              )}

              <Form.Item label="Observaciones" name="notation">
                <Input className="w-full" placeholder="Escriba aquí..." />
              </Form.Item>

              <Form.Item label="Imagen" name="image">
                <Upload className="w-full" onChange={getBase64} fileList={imageObject}>
                  <Button>Click to Upload</Button>
                </Upload>
              </Form.Item>

              <div className="flex justify-between space-x-2">
                <Button
                  className="w-full bg-blue-600 text-white"
                  type="button"
                  onClick={() => handleSubmit("ENTREGADO")}
                >
                  ENTREGADO
                </Button>
                <Button
                  className="w-full bg-yellow-500 text-white"
                  type="button"
                  onClick={() => handleSubmit("PENDIENTE")}
                >
                  REPROGRAMADO
                </Button>
                <Button
                  className="w-full bg-red-500 text-white"
                  type="button"
                  onClick={() => handleSubmit("ANULADO")}
                >
                  CANCELADO
                </Button>
              </div>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormDelivery;
