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
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: "30%",
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
    with: '20%',
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

function ServiceType() {
  const [types, setTypes] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [form] = Form.useForm()
  const [formEdit] = Form.useForm()
  const [key, setKey] = useState("")
  const [description, setDescription] = useState()
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  const [wait, setWait] = useState(false)
  const [edit, setEdit] = useState()

  useEffect(() => {
    fetchData(page, 10, key)

  }, [page])

  const fetchData = async (page = 1, pageSize = 10, key = "", sortBy = "id") => {
    setLoading(true)
    const res = await axios.get("https://localhost:7125/api/service/type")
    setTotal(res?.data?.total)
    console.log(res.data.data)
    const data = []
    res.data.data.map((item, index) => (
      data.push({
        key: index,
        id: (
          <>
            <div>
              {item?.id}
            </div>
          </>
        ),
        name: (
          <>
            <div>
              {item?.name}
            </div>
          </>
        ),
        function: (
          <>
            <EditTwoTone
              style={{ fontSize: 18, color: "blue", marginLeft: 12, cursor: "pointer" }}
              onClick={() => handleShowEdit(item)}
            />
            <Popconfirm title="Are you sure to delete this type"
              onConfirm={() => handleDeleteType(item?.id)}
            >
              <DeleteOutlined
                style={{ fontSize: 18, color: "red", marginLeft: 12, cursor: "pointer" }}
              />
            </Popconfirm>
          </>
        ),
      })
    ))

    setTypes(data)
    setLoading(false)
  }

  const handleDeleteType = async (id) => {
    var res = await axios.delete("https://localhost:7125/api/service/type/" + id)
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
    fetchData(page, 10, key)
  }

  const handleOk = async () => {
    setWait(true)
    var a = form.getFieldValue()
    try {
      var res = await axios.post(`https://localhost:7125/api/service/type?name=${a.name}`)
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

  const handleShowEdit = (item) => {
    formEdit.setFieldsValue({
      name: item.name
    })
    setEdit(item)
  }

  const handleUpdate = async () => {
    setWait(true)
    var a = formEdit.getFieldValue()

    try {
      var res = await axios.put(`https://localhost:7125/api/service/type/${edit?.id}?name=${a.name}`)
      console.log(res)
      if (res?.data?.code == 200) {
        setEdit()
        toast.success("Cập nhật thành công", {
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
              title="Types list"
              extra={
                <>
                  <Space direction="horizontal">
                    {/* <div className="search-container">
                      <div className="search-input-container">
                        <input type="text" className="search-input" placeholder="Search" onChange={(e) => setKey(e.target.value)} />
                      </div>
                      <div className="search-button-container" style={{ color: "#fff" }}>
                        <button className="search-button" onClick={handleSearch}>
                          <SearchOutlined />
                        </button>
                      </div>
                    </div> */}
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
                  dataSource={types}
                  pagination={false}
                  loading={loading}
                  className="ant-border-space"
                />
              </div>
            </Card>
            <Pagination defaultCurrent={1} total={total} onChange={(page) => setPage(page)} style={{ textAlign: "center" }} />
          </Col>
        </Row>

        <Modal title="Form create service type" open={isModalOpen}
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
          >
            <Form.Item name="name" label="Name"
              rules={[{ required: true },
              {
                type: 'string',
              },]}
            >
              <Input></Input>
            </Form.Item>
          </Form>
        </Modal>

        <Modal title="Edit service type" open={edit ? true : false}
          onOk={() => {
            formEdit.validateFields().then(() => {
              handleUpdate()
            });
          }}
          onCancel={() => setEdit()} visible={edit}
          width={800}
        >
          <Form
            form={formEdit}
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            layout="vertical"
          >
            <Form.Item name="name" label="Name"
              rules={[{ required: true },
              {
                type: 'string',
              },]}
            >
              <Input name='name'></Input>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
}

export default ServiceType