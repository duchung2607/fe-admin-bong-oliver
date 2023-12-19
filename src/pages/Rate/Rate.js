import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading/Loading'
import { Button, Card, Col, Form, Input, Modal, Popconfirm, Row, Space, Table, Typography } from 'antd'
import { DeleteOutlined, EditTwoTone, FileAddOutlined, SearchOutlined } from '@ant-design/icons'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { toast } from 'react-toastify'
import TextArea from 'antd/lib/input/TextArea'
// import Title from 'antd/lib/skeleton/Title'

const { Title } = Typography;
const columns = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: "5%",
    },
    {
        title: "USER",
        dataIndex: "user",
        key: "user",
        width: "20%",
    },

    {
        title: "SERVICE",
        key: "service",
        dataIndex: "service",
        width: "20%",
    },

    {
        title: "RATE",
        key: "rate",
        dataIndex: "rate",
        width: "5%",
    },
    {
        title: "COMMENT",
        key: "comment",
        dataIndex: "comment",
        width: "20%",
    },
    {
        title: "CREATE",
        key: "create",
        dataIndex: "create",
        width: "15%",
    },
    {
        title: "FUNCTION",
        key: "function",
        dataIndex: "function",
        with: '10%',
    },
];

function Rate() {
    const [loading, setLoading] = useState(true)
    const [wait, setWait] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [rates, setRates] = useState()
    const history = useHistory()
    const [form] = Form.useForm()

    useEffect(() => (
        fetchData(page, 10)
    ), [page])

    const fetchData = async (page = 1, pageSize = 10) => {
        setLoading(true)

        const res = await axios.get(`https://localhost:7125/api/rate?page=${page}&pageSize=${pageSize}`)
        setTotal(res?.data?.total)
        console.log(res.data.data)
        const data = []
        res.data.data.map((item, index) => (
            data.push({
                key: index,
                id: (
                    <>
                        <p>
                            {item?.id}
                        </p>
                    </>
                ),
                user: (
                    <>
                        <div className="author-info">
                            <Title level={5}>
                                <Link to={`users/${item?.user?.username}`}>
                                    {item?.user?.name}
                                </Link>
                            </Title>
                        </div>
                    </>
                ),

                service: (
                    <>
                        <div className="author-info">
                            <Link to={`services/${item?.service?.id}`}>
                                {item?.service?.name}
                            </Link>
                        </div>
                    </>
                ),
                rate: (
                    <>
                        <div>
                            {item?.rate}
                        </div>
                    </>
                ),
                comment: (
                    <>
                        <div>
                            {item?.comment}
                        </div>
                    </>
                ),
                create: (
                    <>
                        <div className="ant-employed">
                            <span>{item?.create?.slice(0, 10)}</span>
                            {/* <span>{item?.time?.slice(11, 19)}</span> */}
                        </div>
                    </>
                ),
                function: (
                    <>
                        {/* <EditTwoTone
                            style={{ fontSize: 18, color: "blue", marginLeft: 12, cursor: "pointer" }}
                            onClick={() => history.push("rate/" + item?.id)}
                        /> */}
                        <Popconfirm title="Are you sure to delete this rate"
                            onConfirm={() => handleDeleteRate(item?.id)}>
                            <DeleteOutlined
                                style={{ fontSize: 18, color: "red", marginLeft: 12, cursor: "pointer" }}
                            />
                        </Popconfirm>
                    </>
                ),
            })
        ))

        setRates(data)
        setLoading(false)
    }

    const handleDeleteRate = async (id) => {
        var res = await axios.delete("https://localhost:7125/api/rate/" + id)
        if (res?.data?.code == 200) {
            toast.success("Xóa thành công", {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        }
    }

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleSearch = () => {
        setPage(1)
        fetchData(page, 10)
    }

    const handleOk = async () => {
        setWait(true)
        var a = form.getFieldValue()
        var rate = {
            userId: a.userId,
            serviceId: a.serviceId,
            rate: a.rate,
            comment: a.comment
        }

        console.log(rate)

        try {
            var res = await axios.post(
                "https://localhost:7125/api/rate",
                rate,
                { headers: { "Authorization": `Bearer ${sessionStorage.getItem('token')}` } }
            )
            if (res?.data?.code == 200) {
                setIsModalOpen(false);
                toast.success("Thêm thành công", {
                    position: toast.POSITION.TOP_RIGHT
                })
                setTimeout(() => {
                    window.location.reload()
                }, 2000);
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
                            title="Rates list"
                            extra={
                                <>
                                    <Space direction="horizontal">
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
                                    dataSource={rates}
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
                    </Col>
                </Row>

                <Modal title="Form create rate" open={isModalOpen}
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
                        layout="horizontal"
                        disabled={false}
                    >
                        <Row gutter={[24, 0]} >
                            <Col span={24} md={12}>
                                <Form.Item
                                    label="User (Please enter the correct user id)"
                                    name="userId"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input style={{ width: '100%' }} name='userId' />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={12}>

                                <Form.Item
                                    label="Service (Please enter the correct service id)"
                                    name="serviceId"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input style={{ width: '100%' }} name='stylistId' />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            label="Rate"
                            name="rate"
                            rules={[{ required: true }]}
                        >
                            <Input name='rate'></Input>
                        </Form.Item>

                        <Form.Item label="Comment" name="comment"
                            rules={[{ required: true }]}>
                            <TextArea rows={4} name='comment' />
                        </Form.Item>

                    </Form>
                </Modal>
            </div>
        </>
    )
}

export default Rate