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
import TextArea from "antd/lib/input/TextArea";
import { UploadOutlined } from "@ant-design/icons";
import { UploadImageAPI } from "../../assets/js/public";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Loading";
const { Title } = Typography;

function ServiceDetails() {
    const history = useHistory()
    const [imageURL, setImageURL] = useState(false);
    const [form] = Form.useForm()
    const [formWalet] = Form.useForm()
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false);
    const params = useParams()
    const [wait, setWait] = useState(false)

    useEffect(() => {
        fecthData(params.id)
    }, [])

    const fecthData = async (id) => {
        var res = await axios.get("https://localhost:7125/api/service/" + id)

        form.setFieldsValue({
            name: res?.data?.data?.name,
            description: res?.data?.data?.description,
            image: res?.data?.data?.image,
            price: res?.data?.data?.price,
            serviceType: res?.data?.data?.serviceTypeDTO?.name
        })

        setFormData(res?.data?.data)
    }

    const onFinish = async (values) => {
        setWait(true)
        try {
            var url
            if (values.imageUpload)
                url = await UploadImageAPI(values.imageUpload.file)

            const service = {
                id: 0,
                name: values.name,
                description: values.description,
                price: values.price,
                image: values.imageUpload ? url : values.image,
                serviceTypeId: formData.serviceTypeDTO.id
            }

            console.log(service)

            var res = await axios.put("https://localhost:7125/api/service/" + params?.id, service)
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
                <Col xs={24} md={16} className="mb-24">
                    <Card
                        bordered={false}
                        title={<h6 className="font-semibold m-0">Service Information</h6>}
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
                                rules={[{ required: true }, { type: 'string' },]}
                            >
                                <Input name="name" />
                            </Form.Item>

                            <Form.Item name="description" label="Description"
                                rules={[{ required: true }, { type: 'string' },]}
                            >
                                <TextArea name="description" />
                            </Form.Item>

                            <Form.Item name="price" label="Price"
                                rules={[{ required: true }]}
                            >
                                <InputNumber name="price" style={{ width: "100%", height: "40px", borderRadius: "6px" }} />
                            </Form.Item>

                            <Form.Item name="image" label="Image"
                                rules={[{ required: true }]}
                            >

                                <Input name="image" disabled />
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

                            <Form.Item name="serviceType" label="Service Type"
                                rules={[{ required: true }, { type: 'string' },]}
                            >
                                <Input name="serviceType" disabled />
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
                                title={<h6 className="font-semibold m-0">Image</h6>}
                                className="header-solid h-full"
                                bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                            >
                                <Row gutter={[24, 24]} style={{ textAlign: "center" }}>
                                    <Col span={24} md={24}>
                                        <Image
                                            width={200}
                                            height={200}
                                            src={formData?.image}
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
                        {/* <Col xs={24} className="mb-24">
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
                        </Col> */}
                    </Row>
                </Col>
            </Row>
        </>
    );
}

export default ServiceDetails
    ;
