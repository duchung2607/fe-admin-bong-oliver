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
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
} from "antd";

import { DeleteOutlined, EditTwoTone, SearchOutlined, ToTopOutlined, UploadOutlined, UserAddOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";


import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Search from "antd/lib/transfer/search";
import moment from "moment";
import { UploadImageAPI } from "../assets/js/public";
import { toast } from 'react-toastify'
import Loading from "../components/Loading/Loading";

const { Title } = Typography;

// const formProps = {
//   name: "file",
//   action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
//   headers: {
//     authorization: "authorization-text",
//   },
//   onChange(info) {
//     if (info.file.status !== "uploading") {
//       console.log(info.file, info.fileList);
//     }
//     if (info.file.status === "done") {
//       message.success(`${info.file.name} file uploaded successfully`);
//     } else if (info.file.status === "error") {
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
    width: "32%",
  },
  {
    title: "ROLE",
    dataIndex: "role",
    key: "role",
  },

  {
    title: "STATUS",
    key: "status",
    dataIndex: "status",
  },
  {
    title: "CREATED",
    key: "created",
    dataIndex: "created",
  },
  {
    title: "ACTIONS",
    key: "actions",
    dataIndex: "actions",
  },
];

function Users() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const history = useHistory()
  const [users, setUser] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [key, setKey] = useState("")
  const [wait, setWait] = useState(false)

  useEffect(() => {
    fetchData(page, 10, key)
  }, [page])

  const fetchData = async (page = 1, pageSize = 10, key = "", sortBy = "id") => {
    setLoading(true)
    const res = await axios.get("https://localhost:7125/api/users?page=" + page + "&pageSize=" + pageSize + "&key=" + key + "&sortBy=" + sortBy)
    console.log(res.data.data)
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
                src={item?.avatar}
              ></Avatar>
              <div className="avatar-info">
                <Title level={5}>{item?.name}</Title>
                <p>{item?.email}</p>
              </div>
            </Avatar.Group>{" "}
          </>
        ),
        role: (
          <>
            <div className="author-info">
              <Title level={5}>{item?.role.name}</Title>
              {/* <p>Developer</p> */}
            </div>
          </>
        ),

        status: (
          <>
            {
              item?.isDelete ?
                <Button type="danger" className="tag-primary">
                  DENINE
                </Button>
                :
                <Button type="primary" className="tag-primary">
                  ACTIVE
                </Button>
            }
            {/* <Button className="tag-badge">{item?.isDelete ? "DENINE" : "ACTIVE"}</Button> */}
          </>
        ),
        created: (
          <>
            {item?.create?.slice(0, 10)}
          </>
        ),
        actions: (
          <>
            <EditTwoTone
              style={{ fontSize: 18, color: "blue", marginLeft: 12, cursor: "pointer" }}
              onClick={() => history.push("users/" + item?.username)}
            />
            <Popconfirm title="Are you sure to delete this service"
              onConfirm={() => handleDeleteUser(item?.username)}>
              <DeleteOutlined
                style={{ fontSize: 18, color: "red", marginLeft: 12, cursor: "pointer" }}
              />
            </Popconfirm>
          </>
        ),
      })
    ))

    setUser(data)
    setTotal(res?.data?.total)
    setLoading(false)
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    setWait(true)
    var a = form.getFieldValue()

    const url = await UploadImageAPI(a.avatar.file)

    var user = {
      username: a.username,
      name: a.name,
      avatar: url,
      phone: a.phone,
      email: a.email,
      password: a.password,
      gender: a.gender,
      roleId: a.roleId,
      waletDTO: {
        id: 0,
        money: a.walet
      }
    }
    console.log(user)

    try {
      var res = await axios.post("https://localhost:7125/api/users/create", user)
      console.log(res)
      if (res?.data?.code == 200) {
        setIsModalOpen(false);
        toast.success("Thêm thành công", {
          position: toast.POSITION.TOP_RIGHT
        })
        setTimeout(() => {
          // window.location.reload()
          fetchData(page, 10, key)
        }, 2000);
      }
    } catch (e) {
      // console.log(e)
      toast.error(e.response.data.message, {
        position: toast.POSITION.TOP_RIGHT
      })
    }
    setWait(false)
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDeleteUser = async (username) => {
    var res = await axios.delete("https://localhost:7125/api/users/" + username)
    console.log(res.data)
    if (res.data.code == 200) {
      toast.success("Xóa thành công", {
        position: toast.POSITION.TOP_RIGHT
      })
      fetchData()
    }
  }

  const handleSearch = () => {
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
            {/* <Button>Add</Button> */}
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="User list"
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
                      <UserAddOutlined style={{ fontSize: 18 }} />
                      Add
                    </Button>
                  </Space>
                </>
              }
            >
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={users}
                  pagination={false}
                  loading={loading}
                  className="ant-border-space"
                />
              </div>
            </Card>
            <Pagination defaultCurrent={1} total={total} onChange={(page) => setPage(page)} style={{ textAlign: "center" }} />
          </Col>
        </Row>
        <Modal title="Form create user" open={isModalOpen}
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
            <Row gutter={[24, 0]} >
              <Col span={24} md={12}>
                <Form.Item name="username" label="Username"
                  rules={[
                    {
                      required: true,
                    },
                    {
                      type: 'string',
                      min: 6,
                      max: 32
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
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
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="avatar" label="Avatar"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Upload
                multiple={false}
                listType="picture"
                beforeUpload={() => false}
                defaultFileList={[]}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
              {/* <Input name="avatar" /> */}
            </Form.Item>

            <Form.Item name="email" label="Email"
              rules={[{ required: true },
              {
                type: 'email',
              },]}
            >
              <Input />
            </Form.Item>

            <Row gutter={[24, 0]} >
              <Col span={24} md={12}>
                <Form.Item name="phone" label="Phone"
                  rules={[
                    {
                      required: true,
                    },
                    {
                      type: 'string',
                      min: 6,
                      max: 32
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <Form.Item name="password" label="Password"
                  rules={[
                    {
                      required: true,
                    },
                    {
                      type: 'string',
                      min: 6
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 0]} >
              <Col span={24} md={12}>
                <Form.Item label="Role" name="roleId"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Select.Option value="1">Admin</Select.Option>
                    <Select.Option value="2">Stylist</Select.Option>
                    <Select.Option value="3">User</Select.Option>
                    <Select.Option value="5">Guest</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <Form.Item label="Walet" name="walet"
                  rules={[
                    { required: true },
                    {
                      type: 'number',
                      min: 0
                    }
                  ]}
                >
                  <InputNumber style={{ width: "100%", height: "40px", borderRadius: "6px" }} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Gender" name="gender"
              rules={[{ required: true }]}
            >
              <Radio.Group name="gender" >
                <Radio value={true}> Male </Radio>
                <Radio value={false}> FeMale </Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
}

export default Users;
