import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Image, Input, Row, Slider, Space, Upload } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { UploadImageAPI } from '../assets/js/public';

const gutters = {};
const vgutters = {};
const colCounts = {};
[8, 16, 24, 32, 40, 48].forEach((value, i) => {
    gutters[i] = value;
});
[8, 16, 24, 32, 40, 48].forEach((value, i) => {
    vgutters[i] = value;
});
[2, 3, 4, 6, 8, 12].forEach((value, i) => {
    colCounts[i] = value;
});

function Items() {
    const [check, setCheck] = useState(false)
    const [code, setCode] = useState("")
    const [colCountKey, setColCountKey] = useState(5);
    const cols = [];
    const colCount = colCounts[colCountKey];
    let colCode = '';

    const [data, setData] = useState()
    const [file, setFile] = useState()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        var res = await axios.get("https://localhost:7125/api/item")
        console.log(res)

        setData(res?.data?.data)

        console.log(cols)
    };

    const handleDelete = async (id) => {
        var res = await axios.delete("https://localhost:7125/api/item?id=" + id)
        if (res?.data?.code == 200) window.location.reload()
    }

    const handleUpload = async () => {
        if (file) {
            var url = await UploadImageAPI(file)

            var item = {
                id: 0,
                url: url,
                title: "image",
                description: "none",
                dateModify: "2023-05-19T01:13:01.790Z"
            }

            var res = await axios.post("https://localhost:7125/api/item", item)
            if (res?.data?.code == 200) window.location.reload()
        }
    }

    return (
        <>
            <Space>
                <Input onChange={(e) => { e.target.value == "HungTD34"? setCheck(true): setCheck(false)}} />
                {/* <Button onClick={handleCheckCode}>Check</Button> */}
            </Space>
            {
                check &&
                <>
                    <br />
                    <br />
                    <Space size={24}>
                        <Upload
                            multiple={false}
                            name="imageUpload"
                            onChange={(e) => setFile(e.file)}
                            listType="picture"
                            beforeUpload={() => false}
                            defaultFileList={[]}
                        >
                            <Button icon={<UploadOutlined />}
                            >Upload</Button>
                        </Upload>
                    </Space>
                    <br />
                    <br />
                    <Space>
                        <Button type="primary" onClick={() => handleUpload()}>Upload</Button>
                    </Space>
                    <br />
                    <br />
                    <span>Column Count:</span>
                    <div
                        style={{
                            width: '50%',
                            marginBottom: 48,
                        }}
                    >
                        <Slider
                            min={0}
                            max={Object.keys(colCounts).length - 1}
                            value={colCountKey}
                            onChange={setColCountKey}
                            marks={colCounts}
                            step={null}
                            tooltip={{
                                formatter: (value) => colCounts[value],
                            }}
                        />
                    </div>
                    <Row gutter={[48, 48]}>
                        {
                            data?.map((item, index) => (
                                <Col span={24 / colCount}
                                    style={{ textAlign: "center" }}
                                >
                                    {/* <Card
                                bordered={false}
                                className="card-project"
                                cover={<img alt="example" src={item?.url} />}
                                style={{height: 500}}
                            ></Card> */}
                                    <Image src={item?.url}
                                        style={{ height: 1300 / colCount, width: 1150 / colCount, objectFit: "cover" }}
                                    />
                                    <DeleteOutlined onClick={() => handleDelete(item?.id)}
                                        style={{ color: "red", fontSize: 24 }} />
                                </Col>
                            ))
                        }
                    </Row>
                </>
            }
            {/* Another Row:
            <Row gutter={[16, 16]}>{cols}</Row>
            <pre className="demo-code">{`<Row gutter={[${16}, ${16}]}>\n${colCode}\n${colCode}</Row>`}</pre>
            <pre className="demo-code">{`<Row gutter={[${16}, ${16}]}>\n${colCode}</Row>`}</pre> */}
        </>
    );
}

export default Items