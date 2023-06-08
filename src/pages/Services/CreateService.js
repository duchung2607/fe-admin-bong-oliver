import {
    Row,
    Col,
    Card,
    Radio,
    Table,
    Upload,
    message,
    Progress,
    Button,
    Avatar,
    Typography,
} from "antd";

import axios from "axios";
import { useEffect, useState } from "react";

import { PlusOutlined } from '@ant-design/icons';
import {
    Cascader,
    Checkbox,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Select,
    Switch,
    TreeSelect,
} from 'antd';
import { Link, useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
// import { useNavigate } from "react-router-dom/cjs/react-router-dom.min";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

function CreateService() {
    const onChange = (e) => console.log(`radio checked:${e.target.value}`);
    // const navigate = useNavigate()
    const history = useHistory()
    const params = useParams()
    const [types, setTypes] = useState([])
    const [data, setData] = useState({
        id: 0,
        image: ""
    })

    useEffect(() => {
        fetchData()
        console.log(params)
    }, [])

    const fetchData = async () => {
        var res = await axios.get("https://localhost:7125/api/service/type")
        setTypes(res.data.data)
    }

    const handleCreateService = async () => {
        console.log(data)
        var res = await axios.post(
            "https://localhost:7125/api/service/",
            data,
            {
                // "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                "Content-Type": "application/json"
            })
        if(res?.data?.code == 200) 
        history.push("/services")
    }

    const handleChange = (e) => {
        if (e.target)
            setData({ ...data, [e.target.name]: e.target.value });
        else setData({ ...data, ["price"]: e })
    }

    const handleChangeType = (e) => {
        setData({ ...data, ["serviceTypeId"]: parseInt(e) })
    }

    const handleUploadImage = async (e) => {

    }

    return (
        <>
            <Card>
                <Form
                    labelCol={{
                        span: 24,
                    }}
                    wrapperCol={{
                        span: 24,
                    }}
                    layout="horizontal"
                    disabled={false}
                // style={{
                //     maxWidth: 800,
                // }}
                >
                    <Form.Item label="Name">
                        <Input name="name" onChange={(e) => handleChange(e)} />
                    </Form.Item>
                    <Form.Item label="Type">
                        <Select onChange={(e) => handleChangeType(e)}>
                            {
                                types?.map((type, index) => (
                                    <Select.Option value={type?.id}>{type?.name}</Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="Price">
                        <InputNumber style={{ width: "100%" }} name='price' onChange={(e) => handleChange(e)} />
                    </Form.Item>
                    <Form.Item label="Description">
                        <TextArea rows={4} name='description' onChange={(e) => handleChange(e)} />
                    </Form.Item>
                    <Form.Item label="Image" valuePropName="fileList" getValueFromEvent={normFile}>
                        <Upload action="/upload.do" listType="picture-card">
                            <div>
                                <PlusOutlined />
                                <div
                                    style={{
                                        marginTop: 8,
                                    }}
                                >
                                    Select
                                </div>
                            </div>
                        </Upload>
                    </Form.Item>
                    <Form.Item style={{ textAlign: "center" }}>
                        <Link to='/services'>
                            <Button type="default">Back</Button>
                        </Link>
                        <Button type="primary" onClick={handleCreateService} htmlType="submit">Create</Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
}

export default CreateService;
