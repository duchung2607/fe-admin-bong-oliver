import { Card, Col, Input, Row, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player';

function Videos() {
    const [check, setCheck] = useState(false)
    const [url, setUrl] = useState('')
    const src = "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4";
    const [codes, setCodes] = useState(["2268880", "700885"])
    const [urls, setUrls] = useState(
        [
            "https://javhd.ai/category/beauty-4/",
            "https://javhd.ai/mat-cua-em-that-dam-dang-khi-bu-cu-2831.html",
            "https://javhd.ai/s2mbd-047-thu-ky-hang-ngon-va-cam-bay-cua-sep-ai-uehara-2825.html",
            "https://javhd.ai/",
            "https://javhd.shop/",
            "minami azawa gán nợ",
            "https://motchill.tv/xem-phim/ngoi-sao-khieu-dam-tap-full-9805_119790.html"
        ])
    const [code, setCode] = useState()

    useEffect(() => {

    }, [code])

    return (
        <>
            <Row gutter={[24, 0]}>
                <Col xs="24" xl={24}>
                    <Card>
                        <Input placeholder='' onChange={(e) => { e.target.value == "HungTD34"? setCheck(true): setCheck(false) }}></Input>
                        <br />
                        <br />
                        {
                            check &&
                            <>
                                <Input placeholder='Input url of video' onChange={(e) => setUrl(e.target.value)}></Input>
                                <br />
                                <br />

                                {/* <ReactPlayer
                                    width="auto"
                                    height={"100%"}
                                    url={url}
                                    controls
                                /> */}
                                <Select placeholder="Please choose code" onChange={(e) => setCode(e)} style={{ width: "100%" }}>
                                    {
                                        codes.map((code, index) => (
                                            <Select.Option value={code}>{code}</Select.Option>
                                        ))
                                    }
                                    <Select.Option value={false}>None</Select.Option>
                                </Select>
                                {
                                    code &&
                                    <iframe width="100%" height="480" src={"https://www.porntrex.com/embed/" + code} frameborder="0"
                                        allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen>
                                    </iframe>
                                }
                                <br />
                                <br />

                                <Select placeholder="Please choose code" onChange={(e) => setUrl(e)} style={{ width: "100%" }}>
                                    {
                                        urls.map((urlx, index) => (
                                            <Select.Option value={urlx}>{urlx}</Select.Option>
                                        ))
                                    }
                                    <Select.Option value={false}>None</Select.Option>
                                </Select>

                                {
                                    url && <iframe width="100%" height="600" src={url} frameborder="0"
                                        allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen>
                                    </iframe>
                                }
                                {/* <iframe width="400" height="300" src={url} frameborder="0"
                                        allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen>
                                    </iframe> */}
                                    {/* <iframe src="https://www.google.com/webhp?igu=1"></iframe> */}
                            </>
                        }


                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default Videos