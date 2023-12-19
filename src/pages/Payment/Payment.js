import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading/Loading'
import { Button, Card, Col, Form, Input, Modal, Popconfirm, Row, Space, Table, Typography } from 'antd'
import { DeleteOutlined, EditTwoTone, FileAddOutlined, SearchOutlined } from '@ant-design/icons'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { toast } from 'react-toastify'
import TextArea from 'antd/lib/input/TextArea'

const { Title } = Typography;
const columns = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: "10%",
    },
    {
        title: "BOOKING",
        dataIndex: "booking",
        key: "booking",
        width: "10%",
    },

    {
        title: "TOTAL",
        key: "total",
        dataIndex: "total",
        width: "20%",
    },

    {
        title: "MODE",
        key: "mode",
        dataIndex: "mode",
        width: "20%",
    },
    {
        title: "TIME",
        key: "time",
        dataIndex: "time",
        width: "30%",
    },
    {
        title: "FUNCTION",
        key: "function",
        dataIndex: "function",
        with: '10%',
    },
];

function Payment() {
    const [loading, setLoading] = useState(true)
    const [wait, setWait] = useState(false)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [payments, setPayments] = useState()

    useEffect(() => (
        fetchData(page, 10)
    ), [page])

    const fetchData = async (page = 1, pageSize = 10) => {
        setLoading(true)

        const res = await axios.get(
            //`https://localhost:7125/api/rate?page=${page}&pageSize=${pageSize}`
            "https://localhost:7125/api/payment"
        )
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
                booking: (
                    <>
                        <div className="author-info">
                            <Title level={5}>
                                <Link to={`booking/${item?.bookingId}`}>
                                    {item?.bookingId}
                                </Link>
                            </Title>
                        </div>
                    </>
                ),

                total: (
                    <>
                        {/* <div className="author-info"> */}
                        {/* <Link to={`services/${item?.service?.id}`}> */}
                        {item?.total}
                        {/* </Link> */}
                        {/* </div> */}
                    </>
                ),
                mode: (
                    <>
                        {
                            item?.mode == "WALET" ?
                                <Button type="primary" className="tag-primary" ghost>
                                    WALET
                                </Button>
                                :
                                <Button type="primary" className="tag-primary">
                                    {item?.mode}
                                </Button>
                        }
                    </>
                ),
                time: (
                    <>
                        <div>
                            {
                                item?.time?.slice(0,10) + "   " + item?.time?.slice(11,19)
                            }
                        </div>
                    </>
                ),
                function: (
                    <>
                        {/* <EditTwoTone
                            style={{ fontSize: 18, color: "blue", marginLeft: 12, cursor: "pointer" }}
                            onClick={() => history.push("rate/" + item?.id)}
                        /> */}
                        <Popconfirm title="Are you sure to delete this payment"
                            onConfirm={() => handleDeleteRate(item?.id)}>
                            <DeleteOutlined
                                style={{ fontSize: 18, color: "red", marginLeft: 12, cursor: "pointer" }}
                            />
                        </Popconfirm>
                    </>
                ),
            })
        ))

        setPayments(data)
        setLoading(false)
    }

    const handleDeleteRate = async (id) => {
        var res = await axios.delete("https://localhost:7125/api/payment/" + id)
        if (res?.data?.code == 200) {
            toast.success("Xóa thành công", {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        }
    }

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
                            title="Payment list"
                            // extra={
                            //     <>
                            //         <Space direction="horizontal">
                            //             <Button type="primary" onClick={showModal}>
                            //                 <FileAddOutlined style={{ fontSize: 18 }} />
                            //                 Add
                            //             </Button>
                            //         </Space>
                            //     </>
                            // }
                        >
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={payments}
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
            </div>
        </>
    )
}

export default Payment