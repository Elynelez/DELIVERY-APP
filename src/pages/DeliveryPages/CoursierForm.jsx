import { useState, useEffect } from "react";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { Form, Select, Input, Upload, Button, Spin, message } from "antd";
import axios from "axios";

const { Option } = Select;

const CoursierForm = ({ user, ordersData, setOrdersData, URL_SERVER }) => {
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [reloadData, setReloadData] = useState(true);
  const [methods, setMethods] = useState([])
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [form] = Form.useForm();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        
        const [methodsResp, travelsResp, usersResp] = await Promise.all([
          axios.get(`${URL_SERVER}/delivery/methods`),
          axios.get(`${URL_SERVER}/delivery/travels`),
          axios.get(`${URL_SERVER}/database/users`)
        ]);

        const coursier = usersResp.data.find(obj => obj.email == user.email).name

        const dataWithPos = travelsResp.data.map((obj, index) => ({
          ...obj,
          pos: index + 1
        }));

        const data = dataWithPos.filter(obj => obj.order.shipping_data.coursier == coursier && obj.order.status == "EN RUTA")

        setMethods(methodsResp.data)
        setOrdersData(data);
      } catch (error) {
        console.error("Error fetching data:", error, user.email);
      } finally {
        setLoading(false);
        setReloadData(false);
      }
    };

    getData();
  }, [reloadData]);

  const onFinish = async (e) => {
    setLoading(true)

    const formData = new FormData();

    formData.append("user", user.email);
    formData.append("pos", JSON.parse(e.order).pos)

    Object.keys(e).forEach((key) => {
      if (key === "image" && e.image && e.image.length > 0) {
        formData.append("image", e.image[0].originFileObj);
      } else if (key == "order") {
        formData.append("id", JSON.parse(e.order).id)
      } else {
        formData.append(key, e[key]);
      }
    });

    axios.post(`${URL_SERVER}/delivery/route/${e.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    })
      .then(resp => {
        message.success(resp.data.message);
        form.resetFields();
      })
      .catch(error => {
        message.error("error en el servidor");
      }).finally(() => {
        setTimeout(() => {
          setReloadData(true);
        }, 5000);
      });
  };

  const changeStatus = (obj) => {
    let id = JSON.parse(obj).id
    let data = ordersData.find(obj => obj.id == id);

    if (data && (data.order.transactions.condition.includes("PAGO") || data.order.transactions.condition.includes("CRÉDITO"))) {
      setIsPaid(true);
      form.setFieldsValue({ method: "YA PAGO" });
    } else {
      setIsPaid(false);
      form.setFieldsValue({ method: null });
    }
  };

  return (
    <div className="flex justify-center items-center py-5">
      {loading ? (
        <div className="text-center">
          <Spin tip="Cargando datos..." />
        </div>
      ) : (
        <div className="w-full max-w-lg shadow-md rounded-lg p-6" style={{ backgroundColor: colors.primary[400] }}>
          <h1 className="text-xl font-bold text-center mb-4 text-blue-600" style={{ color: colors.primary[100] }}>
            <span> FORMULARIO ENTREGA </span>
          </h1>
          <div className="flex flex-col gap-4">
            <Form layout="vertical" form={form} onFinish={onFinish}>
              <Form.Item
                label={<label className="block mb-1" style={{ color: colors.primary[100] }}>Pedido</label>}
                name="order"
                labelAlign="left"
                rules={[{ required: true }]}
              >
                <Select
                  onChange={changeStatus}
                  className="input-info-form"
                  style={{ borderBottom: "1px solid gray", color: "red" }}
                  showSearch={true}
                  placeholder="Select an order"
                >
                  <Option value="" disabled selected hidden>
                    Seleccionar
                  </Option>
                  {ordersData.map((obj) => (
                    <Option value={JSON.stringify(obj)} key={obj.id}>
                      {obj.order.customer.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={<label className="block mb-1" style={{ color: colors.primary[100] }}>Método</label>}
                name="method"
                rules={[{ required: true }]}
              >
                {isPaid ? (
                  <Input
                    value="YA PAGO"
                    disabled
                    className="input-info-form"
                    style={{ borderBottom: "1px solid gray", marginLeft: "10px", color: "red" }}
                  />
                ) : (
                  <Select
                    placeholder="selecciona un método"
                    className="input-info-form"
                    style={{ borderBottom: "1px solid gray", marginLeft: "10px" }}
                  >
                    {methods.map(method => (
                      <Option
                        value={method.type}
                        key={method.id}
                      >
                        {method.type}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                label={<label className="block mb-1" style={{ color: colors.primary[100] }}>Observaciones</label>}
                name="notation"
                labelAlign="left"
              >
                <Input
                  className="input-info-form"
                  style={{ borderBottom: "1px solid gray", marginLeft: "10px" }}
                />
              </Form.Item>
              <Form.Item
                label={<label className="block mb-1" style={{ color: colors.primary[100] }}>Imagen</label>}
                name="image"
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
              >
                <Upload beforeUpload={() => false} listType="picture-card" accept="image/*">
                  <Button >Subir</Button>
                </Upload>
              </Form.Item>
              <Form.Item name="status" hidden>
                <Input />
              </Form.Item>
              <div className="flex flex-wrap gap-2">
                <Button
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md"
                  onClick={() => {
                    form.setFieldsValue({ status: "ENTREGADO" });
                    form.submit();
                  }}
                >
                  ENTREGADO
                </Button>
                <Button
                  className="flex-1 bg-yellow-500 text-white py-2 rounded-md"
                  onClick={() => {
                    form.setFieldsValue({ status: "PENDIENTE" });
                    form.submit();
                  }}
                >
                  REPROGRAMADO
                </Button>
                <Button
                  className="flex-1 bg-red-500 text-white py-2 rounded-md"
                  onClick={() => {
                    form.setFieldsValue({ status: "ANULADO" });
                    form.submit();
                  }}
                >
                  CANCELADO
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursierForm;
