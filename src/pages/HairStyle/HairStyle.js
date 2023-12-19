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
    Pagination,
    Popconfirm,
    Space,
    Form,
    Input,
    InputNumber,
    Select,
    Modal,
} from "antd";

import { DeleteOutlined, EditTwoTone, SearchOutlined, FileAddOutlined, UploadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import axios from "axios";
import { useEffect, useState } from "react";
import TextArea from "antd/lib/input/TextArea";
import { UploadImageAPI } from '../../assets/js/public.js'
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Loading.js";
import ReactQuill from "react-quill";

const { Title } = Typography;

// const formProps = {
//   name: "file",
//   action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
//   headers: {
//     authorization: "authorization-text",
//   },
//   onChange(info) {
//     if (info.file.price !== "uploading") {
//       console.log(info.file, info.fileList);
//     }
//     if (info.file.price === "done") {
//       message.success(`${info.file.name} file uploaded successfully`);
//     } else if (info.file.price === "error") {
//       message.error(`${info.file.name} file upload failed.`);
//     }
//   },
// };
// table code start
const columns = [
    {
        title: "NAME",
        dataIndex: "name",
        key: "name",
        width: "30%",
    },
    {
        title: "SORT DES",
        dataIndex: "sortDes",
        key: "sortDes",
        width: "30%",
    },

    {
        title: "TYPE",
        key: "type",
        dataIndex: "type",
        width: "30%",
    },
    {
        title: "FUNCTION",
        key: "function",
        dataIndex: "function",
        with: '10%',
    },
];

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
        ['link', 'image'],
    ],
};

function HairStyle() {
    const [hairs, setHair] = useState([])
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [form] = Form.useForm()
    const [key, setKey] = useState("")
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const [wait, setWait] = useState(false)

    useEffect(() => {
        fetchData(page, 10, key)
    }, [page])

    const fetchData = async (page = 1, pageSize = 10, key = "") => {
        console.log(key)
        setLoading(true)
        const res = await axios.get(`https://localhost:7125/api/hair?page=${page}&pageSize=${pageSize}&key=${key}`)
        //const res = await axios.get("https://localhost:7125/api/service?page=" + page + "&pageSize=" + pageSize + "&key=" + key + "&sortBy=" + sortBy)
        setTotal(res?.data?.total)
        const data = []
        res.data.data.map((item, index) => (
            data.push({
                key: index,
                name: (
                    <>
                        <Avatar.Group>
                            <Avatar
                                className="shape-avatar"
                                shape="square"
                                size={40}
                                src={item?.image}
                            ></Avatar>
                            <div className="avatar-info">
                                <Title level={5}>{item?.name}</Title>
                            </div>
                        </Avatar.Group>{" "}
                    </>
                ),
                sortDes: (
                    <>
                        <div className="author-info">
                            <Title level={5} style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                width: "200px"
                            }}>{item?.sortDes}</Title>
                            {/* <p>Developer</p> */}
                        </div>
                    </>
                ),

                type: (
                    <>
                        <div>
                            {item?.type ? "Nam" : "Nữ"}
                        </div>
                    </>
                ),
                function: (
                    <>
                        <EditTwoTone
                            style={{ fontSize: 18, color: "blue", marginLeft: 12, cursor: "pointer" }}
                            onClick={() => history.push("hair-style/" + item?.id)}
                        />
                        <Popconfirm title="Are you sure to delete this hair style"
                            onConfirm={() => handleDeleteHairStyle(item?.id)}>
                            <DeleteOutlined
                                style={{ fontSize: 18, color: "red", marginLeft: 12, cursor: "pointer" }}
                            />
                        </Popconfirm>
                    </>
                ),
            })
        ))

        setHair(data)
        setLoading(false)
    }

    const handleDeleteHairStyle = async (id) => {
        var res = await axios.delete(`https://localhost:7125/api/hair/${id}`)
        console.log(res.data)
        if (res?.data?.code == 200) {
            toast.success("Xóa thành công", {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        }
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleSearch = () => {
        fetchData(page, 10, key)
    }

    const handleOk = async () => {
        setWait(true)
        var a = form.getFieldValue()

        const url = await UploadImageAPI(a.image.file)

        var hairStyle = {
            name: a.name,
            image: url,
            type: a.type,
            sortDes: a.sortDes,
            description: a.description,
        }

        console.log(hairStyle);
        // console.log(typeof(a.type));

        try {
            var res = await axios.post("https://localhost:7125/api/hair", hairStyle)
            console.log(res)
            if (res?.data?.code == 200) {
                setIsModalOpen(false);
                toast.success("Thêm thành công", {
                    position: toast.POSITION.TOP_RIGHT
                })
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            }
        } catch (e) {
            toast.error(e.response.data.message, {
                position: toast.POSITION.TOP_RIGHT
            })
        }
        setWait(false)
    }

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {
                wait && <Loading />
            }
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title="Services list"
                            extra={
                                <>
                                    <Space direction="horizontal">
                                        <div className="search-container">
                                            <div className="search-input-container">
                                                <input type="text" className="search-input" placeholder="Search" onChange={(e) => setKey(e.target.value)} />
                                            </div>
                                            <div className="search-button-container" style={{ color: "#fff" }}>
                                                <button className="search-button" onClick={handleSearch}>
                                                    <SearchOutlined />
                                                    {/* <i className="fas fa-search" /> */}
                                                </button>
                                            </div>
                                        </div>
                                        <Button type="primary" onClick={showModal}>
                                            <FileAddOutlined style={{ fontSize: 18 }} />
                                            Add
                                        </Button>
                                    </Space>
                                </>
                            }
                        >
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={hairs}
                                    pagination={{
                                        position: ["bottomCenter"],
                                        current: page,
                                        total: total,
                                        showSizeChanger: false,
                                        onChange: (page) => {
                                            setPage(page);
                                        }
                                    }}
                                    loading={loading}
                                    className="ant-border-space"
                                />
                            </div>
                        </Card>
                        {/* <Pagination defaultCurrent={1} total={total} onChange={(page) => setPage(page)} style={{ textAlign: "center" }} /> */}
                    </Col>
                </Row>

                <Modal title="Form create hair style" open={isModalOpen}
                    onOk={() => {
                        form.validateFields().then(() => {
                            handleOk()
                        });
                    }}
                    onCancel={handleCancel} visible={isModalOpen}
                    width={800}
                >
                    <Form
                        form={form}
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        layout="vertical"
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
                                },
                            ]}
                        >
                            <Input name="name" />
                        </Form.Item>

                        <Form.Item name="image" label="Image"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Upload
                                multiple={false}
                                name="image"
                                listType="picture"
                                beforeUpload={() => false}
                                defaultFileList={[]}
                            >
                                <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
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
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    type: "string",
                                }
                            ]}
                        >
                            {/* <InputNumber name="sortDes" style={{ width: "100%", height: "40px", borderRadius: "6px" }} /> */}
                            <Input name="sortDes" />
                        </Form.Item>

                        <Form.Item name="description" label="Description"
                            rules={[{ required: true },
                            {
                                type: 'string',
                            },]}
                        >
                            <ReactQuill theme="snow" modules={modules} />
                            {/* <TextArea name="description" rows={4} /> */}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </>
    );
}

export default HairStyle