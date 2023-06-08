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
  Form,
  Modal,
  Input,
  InputNumber,
  Select,
  Space,
} from "antd";

import { DeleteOutlined, EditTwoTone, SearchOutlined, FileAddOutlined, UploadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import axios from "axios";
import { useEffect, useState } from "react";
import TextArea from "antd/lib/input/TextArea";
import { UploadImageAPI } from "../../assets/js/public";

const { Title } = Typography;

const columns = [
  {
    title: "NAME",
    dataIndex: "name",
    key: "name",
    width: "30%",
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
    key: "description",
    width: "30%",
  },

  {
    title: "PRICE",
    key: "price",
    dataIndex: "price",
    width: "10%",
  },
  {
    title: "PRODUCT TYPE",
    key: "productType",
    dataIndex: "productType",
    width: "10%",
  },
  {
    title: "FUNCTION",
    key: "function",
    dataIndex: "function",
    with: '10%',
  },
];

function Product() {
  const [products, setProduct] = useState([])
  const [productType, setProductype] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [key, setKey] = useState("")
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchData(page, 10, key)
    getProductTypes()

  }, [page])

  const getProductTypes = async () => {
    var res = await axios.get("https://localhost:7125/api/product/type")
    if (res?.data?.code == 200) setProductype(res?.data?.data)
  }

  const fetchData = async (page = 1, pageSize = 10, key = "", sortBy = "id") => {
    setLoading(true)
    const res = await axios.get("https://localhost:7125/api/product?page=" + page + "&pageSize=" + pageSize + "&key=" + key + "&sortBy=" + sortBy)
    setTotal(res?.data?.total)
    console.log(res.data)
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
                <p>{item?.price}</p>
              </div>
            </Avatar.Group>{" "}
          </>
        ),
        description: (
          // style={{overflow:'hidden', textOverflow:'ellipsis'}}
          <>
            <div className="author-info" >
              {/* <Title level={5}>{item?.description}</Title> */}
              {/* <p>Developer</p> */}
            </div>
          </>
        ),

        price: (
          <>
            <div>
              {item?.price}
            </div>
          </>
        ),
        productType: (
          <>
            <div className="ant-employed">
              <span>{item?.productTypeId}</span>
            </div>
          </>
        ),
        function: (
          <>
            <EditTwoTone
              style={{ fontSize: 18, color: "blue", marginLeft: 12, cursor: "pointer" }}
              onClick={() => history.push("product/" + item?.id)}
            />
            <Popconfirm title="Are you sure to delete this service"
              onConfirm={() => handleDeleteProduct(item?.id)}>
              <DeleteOutlined
                style={{ fontSize: 18, color: "red", marginLeft: 12, cursor: "pointer" }}
              />
            </Popconfirm>
          </>
        ),
      })
    ))

    setProduct(data)
    setTotal(res?.data?.total)
    setLoading(false)
  }

  const handleDeleteProduct = async (id) => {
    var res = await axios.delete("https://localhost:7125/api/product/" + id)
    console.log(res.data)
    if (res?.data?.code == 200) window.location = "/product"
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSearch = () => {
    fetchData(page, 10, key)
  }

  const handleOk = async () => {
    var a = form.getFieldValue()

    const url = await UploadImageAPI(a.image.file)

    var product = {
      id: 0,
      name: a.name,
      image: url,
      description: a.description,
      price: a.price,
      productTypeId: a.productTypeId
    }

    var res = await axios.post("https://localhost:7125/api/product", product)
    console.log(res)
    if (res?.data?.code == 200) {
      setIsModalOpen(false);
      window.location.reload()
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          {/* <Col>
            <Button type='link' danger>Add</Button>
            <Link to='products/create' style={{textAlign:'right'}}>
              Add
            </Link>
          </Col> */}
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Product list"
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
                  dataSource={products}
                  pagination={false}
                  loading={loading}
                  className="ant-border-space"
                />
              </div>
            </Card>
            <Pagination defaultCurrent={1} total={total} onChange={(page) => setPage(page)} style={{ textAlign: "center" }} />
          </Col>
        </Row>

        <Modal title="Form create product" open={isModalOpen}
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
              <Col span={24} md={24}>
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
              </Col>
            </Row>

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

            <Form.Item name="description" label="Description"
              rules={[{ required: true },
              {
                type: 'string',
              },]}
            >
              <TextArea name="description" rows={4} />
            </Form.Item>

            <Row gutter={[24, 0]} >
              <Col span={24} md={12}>
                <Form.Item name="price" label="Price"
                  rules={[
                    {
                      required: true,
                    }
                  ]}
                >
                  <InputNumber name="price" style={{ width: "100%", height: "40px", borderRadius: "6px" }} />
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <Form.Item label="Product Type" name="productTypeId"
                  rules={[{ required: true }]}
                >
                  <Select>
                    {
                      productType?.map((type, index) => (
                        <Select.Option value={type?.id}>{type.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </>
  );
}

export default Product;
