import { useEffect, useState } from "react";

import {
    Row,
    Col,
    Card,
    Button,
    Radio,
    Switch,
    Upload,
    message,
    Form,
    Input,
    DatePicker,
    Select,
    Image,
    Typography,
    Popconfirm,
    InputNumber,
    Table,
} from "antd";

import axios from "axios";
import { Redirect, useHistory, useParams, Link } from "react-router-dom/cjs/react-router-dom.min";
import moment from "moment";
import TextArea from "antd/lib/input/TextArea";
import { EyeOutlined, UploadOutlined } from "@ant-design/icons";
import { UploadImageAPI } from "../../assets/js/public";
import Loading from "../../components/Loading/Loading";
import { toast } from "react-toastify";
const { Title } = Typography;

const columns = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: "20%",
    },
    {
        title: "NAME",
        dataIndex: "name",
        key: "name",
        width: "50%",
    },
    {
        title: "FUNCTION",
        key: "function",
        dataIndex: "function",
        with: '10%',
    },
];

function BookingDetails() {
    const history = useHistory()
    const [form] = Form.useForm()
    const [formData, setFormData] = useState({})
    const [data, setData] = useState()
    const params = useParams()
    const [wait, setWait] = useState(false)

    useEffect(() => {
        fecthData(params.id)
    }, [])

    const fecthData = async (id) => {
        setWait(true)
        try {
            var res = await axios.get("https://localhost:7125/api/booking/" + id)

            form.setFieldsValue({
                description: res?.data?.data?.description,
                status: res?.data?.data?.status,
                time: res?.data?.data?.time,
                usernameUser: res?.data?.data?.usernameUser,
                usernameStylist: res?.data?.data?.usernameStylist,
                serviceBookingDTOs: res?.data?.data?.serviceBookingDTOs,
                price: res?.data?.data?.price,
            })
            const data = []
            res.data.data.serviceBookingDTOs.map((item, index) => (
                data.push({
                    key: index,
                    id: (
                        <>
                            <p>
                                {item?.id}
                            </p>
                        </>
                    ),
                    name: (
                        <>
                            <div className="author-info">
                                <Title level={5}>{item?.name}</Title>
                                {/* <p>Developer</p> */}
                            </div>
                        </>
                    ),
                    function: (
                        <>
                            <Link to={"/services/" + item?.id} >
                                <EyeOutlined
                                    style={{ fontSize: 18, color: "blue", marginLeft: 12, cursor: "pointer" }}
                                // onClick={() => history.push("service/" + item?.id)}
                                />
                            </Link>
                            {/* <Popconfirm title="Are you sure to delete this booking"
                    onConfirm={() => handleDeleteBooking(item?.id)}>
                    <DeleteOutlined
                      style={{ fontSize: 18, color: "red", marginLeft: 12, cursor: "pointer" }}
                    />
                  </Popconfirm> */}
                        </>
                    ),
                })
            ))
            setData(data)
        } catch (e) { }
        setWait(false)
    }

    const onFinish = async (values) => {
        setWait(true)
        try {
            const booking = {
                description: values.description,
                price: values.price,
                time: values.time,
                status: values.status
            }
            console.log(booking)
            var res = await axios.put("https://localhost:7125/api/booking/" + params?.id, booking)
            console.log(res)
            if (res?.data?.code == 200) {
                toast.success("Cập nhật thành công", {
                    position: toast.POSITION.TOP_RIGHT
                })
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            }
        } catch (e) {
            toast.error("Cập nhật thất bại", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
        setWait(false)
    }

    return (
        <>
            {
                wait && <Loading />
            }
            <Row gutter={[24, 0]}>
                <Col xs={24} md={24} className="mb-24">

                    <Card
                        bordered={false}
                        title={<h6 className="font-semibold m-0">Booking Information</h6>}
                        className="header-solid h-full card-profile-information"
                        // extra={<Button type="link">{pencil}</Button>}
                        bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                    >
                        <Form
                            form={form}
                            labelCol={{
                                span: 4,
                            }}
                            wrapperCol={{
                                span: 24,
                            }}
                            layout="vertical"
                            onFinish={onFinish}
                        // disabled={componentDisabled}
                        // style={{
                        //     maxWidth: 600,
                        // }}
                        >
                            <Row gutter={[24, 0]} >
                                <Col span={24} md={12}>
                                    <Form.Item
                                        label="User"
                                        name="usernameUser"
                                    >
                                        <Input style={{ width: '100%' }} name='usernameUser' disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={12}>

                                    <Form.Item
                                        label="Stylist"
                                        name="usernameStylist"
                                    >
                                        <Input style={{ width: '100%' }} name='usernameStylist' disabled />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* <Row gutter={[24, 0]} >
                                <Col span={24} md={12}>
                                    <Form.Item
                                        label="Date"
                                        name="date"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            name="date"
                                            format={'DD/MM/YYYY'}
                                            onChange={(e) => console.log(e.toJSON().slice(0, 10))}
                                            style={{
                                                height: "auto",
                                                borderRadius: "6px",
                                                fontSize: "14px",
                                                padding: "8px",
                                                width: "100%"
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={12}>
                                    <Form.Item
                                        label="Time"
                                        name="time"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <Select>
                                            {
                                                times?.map((time, index) => (
                                                    <Select.Option value={time}>{time}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row> */}

                            <Form.Item name="time" label="Time"
                                rules={[{ required: true }, { type: 'string' },]}
                            >
                                <Input name="time" disabled />
                            </Form.Item>

                            <Form.Item name="description" label="Description"
                                rules={[{ required: true }, { type: 'string' },]}
                            >
                                <TextArea name="description" />
                            </Form.Item>

                            <Form.Item name="status" label="Status"
                                rules={[{ required: true }]}
                            >
                                <Select>
                                    <Select.Option name="status" value={"wait"}>Wait</Select.Option>
                                    <Select.Option name="status" value={"done"}>Done</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item name="price" label="Price"
                                rules={[{ required: true }]}
                            >
                                <Input name="price" style={{ width: "100%", height: "40px", borderRadius: "6px" }} disabled />
                            </Form.Item>

                            {/* <Form.Item name="serviceType" label="Service Type"
                                rules={[{ required: true }, { type: 'string' },]}
                            >
                                <Input name="serviceType" disabled />
                            </Form.Item> */}

                            <Form.Item style={{ textAlign: "center" }}>
                                <Button onClick={() => history.goBack()} type="default" style={{ marginRight: "10px" }}>Back</Button>
                                <Button htmlType="submit" type="primary" style={{ marginLeft: "10px" }}>Save</Button>
                            </Form.Item>
                        </Form>

                        {/* <Table
                            columns={columns}
                            dataSource={data}
                            pagination={false}
                            // loading={loading}
                            className="ant-border-space"
                        /> */}
                    </Card>


                </Col>
                <Col xs={24} md={24} className="mb-24">
                    <Card
                        bordered={false}
                        title={<h6 className="font-semibold m-0">List Services</h6>}
                        className="header-solid h-full card-profile-information"
                        // extra={<Button type="link">{pencil}</Button>}
                        bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                    >
                        <Table
                            columns={columns}
                            dataSource={data}
                            pagination={false}
                            // loading={loading}
                            className="ant-border-space"
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default BookingDetails;