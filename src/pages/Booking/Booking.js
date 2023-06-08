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
  InputNumber,
  Select,
  Form,
  Input,
  Modal,
  DatePicker,
} from "antd";

import { DeleteOutlined, EditTwoTone, SearchOutlined, FileAddOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import axios from "axios";
import { useEffect, useState } from "react";
import TextArea from "antd/lib/input/TextArea";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Loading";

const { Title } = Typography;
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: "20%",
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
    key: "description",
    width: "30%",
  },

  {
    title: "STATUS",
    key: "status",
    dataIndex: "status",
    width: "10%",
  },

  {
    title: "PRICE",
    key: "price",
    dataIndex: "price",
    width: "10%",
  },
  {
    title: "DATE",
    key: "date",
    dataIndex: "date",
    width: "15%",
  },
  {
    title: "TIME",
    key: "time",
    dataIndex: "time",
    width: "15%",
  },
  {
    title: "FUNCTION",
    key: "function",
    dataIndex: "function",
    with: '10%',
  },
];

const times = ['08:00:00', '08:40:00', '09:20:00', '10:00:00', '10:40:00', '11:20:00', '12:00:00',
  '12:40:00', '13:20:00', '14:00:00', '14:40:00', '15:20:00', '16:00:00', '16:40:00',
  '17:20:00', '18:00:00', '18:40:00', '19:20:00', '20:00:00']

function Booking() {
  const history = useHistory()
  const [bokings, setBooking] = useState([])
  const [services, setService] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [key, setKey] = useState("")
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [wait, setWait] = useState(false)

  useEffect(() => {
    fetchData(page, 10, key)

  }, [page])

  const fetchData = async (page = 1, pageSize = 10, key = "", sortBy = "id") => {
    setLoading(true)

    console.log(key)
    const res = await axios.get("https://localhost:7125/api/booking?page=" + page + "&pageSize=" + pageSize + "&key=" + key + "&sortBy=" + sortBy)
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
        description: (
          <>
            <div className="author-info">
              <Title level={5}>{item?.description}</Title>
              {/* <p>Developer</p> */}
            </div>
          </>
        ),

        status: (
          <>
            {
              item?.status == "wait" ?
                <Button type="default" className="tag-primary">
                  WAIT
                </Button>
                :
                <Button type="primary" className="tag-primary">
                  DONE
                </Button>
            }
          </>
        ),
        price: (
          <>
            <div>
              {item?.price}
            </div>
          </>
        ),
        date: (
          <>
            <div className="ant-employed">
              <span>{item?.time?.slice(0, 10)}</span>
              {/* <span>{item?.time?.slice(11, 19)}</span> */}
            </div>
          </>
        ),
        time: (
          <>
            <div className="ant-employed">
              {/* <span>{item?.time?.slice(0, 10)}</span> */}
              <span>{item?.time?.slice(11, 19)}</span>
            </div>
          </>
        ),
        function: (
          <>
            <EditTwoTone
              style={{ fontSize: 18, color: "blue", marginLeft: 12, cursor: "pointer" }}
              onClick={() => history.push("booking/" + item?.id)}
            />
            <Popconfirm title="Are you sure to delete this booking"
              onConfirm={() => handleDeleteBooking(item?.id)}>
              <DeleteOutlined
                style={{ fontSize: 18, color: "red", marginLeft: 12, cursor: "pointer" }}
              />
            </Popconfirm>
          </>
        ),
      })
    ))

    const res2 = await axios.get("https://localhost:7125/api/service?page=1&pageSize=1000&key=&sortBy=id")
    setService(res2?.data?.data)
    setBooking(data)
    setLoading(false)
  }

  const handleOk = async () => {
    setWait(true)
    var a = form.getFieldValue()

    // console.log(a)
    var booking = {
      time: a.date.toJSON().slice(0, 10) + 'T' + a.time,
      description: a.description,
      status: a.status,
      userId: a.userId,
      stylistId: a.stylistId,
      serviceIds: a.serviceIds
    }

    console.log(booking)

    try {
      var res = await axios.post("https://localhost:7125/api/booking/create", booking)
      console.log(res)
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
      // console.log(e)
      toast.error(e.response.data.message, {
        position: toast.POSITION.TOP_RIGHT
      })
    }
    setWait(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDeleteBooking = async (id) => {
    var res = await axios.delete("https://localhost:7125/api/booking/" + id)
    console.log(res.data)
    if (res?.data?.code == 200) {
      toast.success("Xóa thành công", {
        position: toast.POSITION.TOP_RIGHT
      })
      setTimeout(() => {
        window.location.reload()
      }, 2000);
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSearch = () => {
    setPage(1)
    fetchData(page, 10, key)
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
              title="Booking list"
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
                  dataSource={bokings}
                  pagination={false}
                  loading={loading}
                  className="ant-border-space"
                />
              </div>
            </Card>
            <Pagination defaultCurrent={1} total={total} onChange={(page) => setPage(page)} style={{ textAlign: "center" }} />
          </Col>
        </Row>

        <Modal title="Form create service" open={isModalOpen}
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
                  label="Stylist (Please enter the correct stylist id)"
                  name="stylistId"
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
            <Row gutter={[24, 0]} >
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
                    // defaultValue={moment(formData.startTime, 'DD/MM/YYYY HH:mm')}
                    format={'DD/MM/YYYY'}
                    // disabledDate={(current) => current.isBefore(moment())}
                    onChange={(e) => console.log(e.toJSON().slice(0, 10))}
                    style={{
                      height: "auto",
                      borderRadius: "6px",
                      fontSize: "14px",
                      padding: "8px",
                      width: "100%"
                    }}
                  />
                  {/* <DatePicker name='date' format="yyyy-MM-DD hh:mm:ss" style={{ width: '100%' }} /> */}
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
            </Row>
            <Form.Item
              label="Services"
              name="serviceIds"
              rules={[{ required: true }]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{
                  width: '100%',
                }}

                placeholder="Please select at least one service"
              >
                {
                  services?.map((service, index) => (
                    <Select.Option value={service?.id}>{service?.name}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select>
                <Select.Option value='wait'>Wait</Select.Option>
                <Select.Option value='done'>Done</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Description" name="description"
              rules={[{ required: true }]}>
              <TextArea rows={4} name='description' />
            </Form.Item>

          </Form>
        </Modal>
      </div>
    </>
  );
}

export default Booking;
