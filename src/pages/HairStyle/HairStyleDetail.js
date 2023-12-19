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
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
const { Title } = Typography;

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
        ['link', 'image'],
    ],
};
function HairStyleDetail() {
    const history = useHistory()
    const [imageURL, setImageURL] = useState(false);
    const [form] = Form.useForm()
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false);
    const params = useParams()
    const [wait, setWait] = useState(false)

    useEffect(() => {
        fecthData(params.id)
    }, [])

    const fecthData = async (id) => {
        var res = await axios.get("https://localhost:7125/api/hair/" + id)

        form.setFieldsValue({
            name: res?.data?.data?.name,
            image: res?.data?.data?.image,
            type: res?.data?.data?.type,
            sortDes: res?.data?.data?.sortDes,
            description: res?.data?.data?.description,
        })

        setFormData(res?.data?.data)
    }

    const onFinish = async (values) => {
        setWait(true)
        try {
            var url
            if (values.imageUpload)
                url = await UploadImageAPI(values.imageUpload.file)

            const hairstyle = {
                name: values.name,
                image: url? url : values.image,
                type: values.type,
                sortDes: values.sortDes,
                description: values.description,
            }

            var res = await axios.put("https://localhost:7125/api/hair/" + params?.id, hairstyle)
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
                        title={<h6 className="font-semibold m-0">Hair style Information</h6>}
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
                        >
                            <Form.Item name="name" label="Name"
                                rules={[{ required: true }, { type: 'string' },]}
                            >
                                <Input name="name" />
                            </Form.Item>

                            <Form.Item label="Type" name="type"
                                rules={[{ required: true }]}
                            >
                                <Select>
                                    <Select.Option value={true}>Nam</Select.Option>
                                    <Select.Option value={false}>Nữ</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item name="sortDes" label="Sort Description"
                                rules={[{ required: true }, { type: 'string' },]}
                            >
                                <Input name="sortDes" />
                            </Form.Item>

                            <Form.Item name="description" label="Description"
                                rules={[{ required: true }, { type: 'string' },]}
                            >
                                <ReactQuill theme="snow" modules={modules} />
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

                            <Form.Item style={{ textAlign: "center" }}>
                                <Button onClick={() => history.goBack()} type="default" style={{ marginRight: "10px" }}>Back</Button>
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
                    </Row>
                </Col>
            </Row>
        </>
    );
}

export default HairStyleDetail