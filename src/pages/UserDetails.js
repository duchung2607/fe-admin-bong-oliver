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
} from "antd";

import axios from "axios";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import moment from "moment";
import { UploadOutlined } from "@ant-design/icons";
import { UploadImageAPI } from "../assets/js/public";
import Loading from "../components/Loading/Loading";
import { toast } from "react-toastify";
const { Title } = Typography;

function UserDetails() {
    const history = useHistory()
    const [imageURL, setImageURL] = useState(false);
    const [form] = Form.useForm()
    const [formWalet] = Form.useForm()
    const [formData, setFormData] = useState({})
    const params = useParams()
    const [wait, setWait] = useState(false)

    useEffect(() => {
        fecthData(params.username)
    }, [])

    const fecthData = async (username) => {
        var res = await axios.get("https://localhost:7125/api/users/" + username)

        form.setFieldsValue({
            name: res?.data?.data?.name,
            email: res?.data?.data?.email,
            phone: res?.data?.data?.phone,
            rank: res?.data?.data?.rank,
            role: res?.data?.data?.role?.name,
            gender: res?.data?.data?.gender,
            avatar: res?.data?.data?.avatar
        })

        formWalet.setFieldsValue({
            money: res?.data?.data?.walet.money
        })

        setFormData(res?.data?.data)
    }

    const onFinish = async (values) => {
        setWait(true)
        var url
        if (values.imageUpload)
            url = await UploadImageAPI(values.imageUpload.file)

        const user = {
            name: values.name,
            phone: values.phone,
            email: values.email,
            gender: values.gender,
            avatar: values.imageUpload ? url : values.avatar
        }

        console.log(user)

        try {
            var res = await axios.put("https://localhost:7125/api/users/" + params?.username, user)
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

    const onUpdateMoney = async (values) => {
        var res = await axios.put("https://localhost:7125/api/users/walet/" + params?.username + "?money=" + values.money)
        console.log(res?.data)
        if (res?.data?.code == 200) window.location.reload()
    }

    return (
        <>
            {
                wait && <Loading />
            }
            <Row gutter={[24, 0]}>
                <Col xs={24} md={16} className="mb-24">
                    <Card
                        bordered={false}
                        title={<h6 className="font-semibold m-0">User Information</h6>}
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
                            <Form.Item name="name" label="Name"
                                rules={[
                                    {
                                        required: true,
                                    },
                                    {
                                        type: 'string',
                                        min: 6,
                                    },
                                ]}
                            >
                                <Input name="name" />
                            </Form.Item>
                            <Form.Item name="email" label="Email">
                                <Input name="email" disabled />
                            </Form.Item>
                            <Form.Item label="Phone" name="phone"
                                rules={[{ required: true },
                                {
                                    type: 'string',
                                    len: 10
                                }]}
                            >
                                <Input name="phone" />
                            </Form.Item>

                            <Form.Item label="Rank" name="rank"
                                rules={[{ required: true }]}
                            >
                                <Input style={{ width: "100%" }} name="rank" disabled />
                            </Form.Item>
                            <Form.Item label="Role" name="role">
                                <Input disabled />
                            </Form.Item>
                            <Form.Item label="Gender" name="gender"
                                rules={[{ required: true }]}
                            >
                                <Radio.Group name="gender" >
                                    <Radio value={true}> Male </Radio>
                                    <Radio value={false}> FeMale </Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item label="Avatar" name="avatar"
                                rules={[{ required: true }]}
                            >
                                <Input name="avatar" disabled />
                            </Form.Item>

                            <Form.Item name='imageUpload'>
                                <Upload
                                    multiple={false}
                                    name="imageUpload"
                                    listType="picture"
                                    beforeUpload={() => false}
                                    defaultFileList={[]}
                                >
                                    <Button icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item style={{ textAlign: "center" }}>
                                <Button onClick={()=>history.goBack()} type="default" style={{ marginRight: "10px" }}>Back</Button>
                                <Button htmlType="submit" type="primary" style={{ marginLeft: "10px" }}>Save</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                <Col span={24} md={8}>
                    <Row gutter={[24, 0]}>
                        <Col xs={24} className="mb-24">
                            <Card
                                bordered={false}
                                title={<h6 className="font-semibold m-0">Avatar</h6>}
                                className="header-solid h-full"
                                bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                            >
                                <Row gutter={[24, 24]} style={{ textAlign: "center" }}>
                                    <Col span={24} md={24}>
                                        <Image
                                            width={200}
                                            height={200}
                                            src={formData?.avatar}
                                            style={{ objectFit: "cover" }}
                                        />
                                        <div className="avatar-info">
                                            <Title level={1} style={{ marginBottom: "0" }}>{formData?.name}</Title>
                                            <p>{formData?.email}</p>
                                        </div>
                                    </Col>
                                </Row>

                            </Card>
                        </Col>
                        {/* </Row> */}
                        {/* <Row gutter={[24, 0]}> */}
                        <Col xs={24} className="mb-24">
                            <Card
                                bordered={false}
                                title={<h6 className="font-semibold m-0">Walet Info</h6>}
                                className="header-solid h-full"
                                bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                            >
                                <Form
                                    form={formWalet}
                                    labelCol={{
                                        span: 4,
                                    }}
                                    wrapperCol={{
                                        span: 24,
                                    }}
                                    layout="vertical"
                                    onFinish={onUpdateMoney}
                                >
                                    <Form.Item label="Money" name="money"
                                        rules={[
                                            {
                                                required: true,
                                            }
                                        ]}>
                                        <InputNumber name='money' style={{ width: "100%", height: "40px", borderRadius: "6px" }} />
                                    </Form.Item>
                                    <Form.Item style={{ textAlign: "center" }}>
                                        <Button htmlType="submit" type="primary">Save</Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}

export default UserDetails;
