import { SendOutlined } from '@ant-design/icons'
import { Card, Col, Input, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { sendMessage, useChat, useUser } from '../../firebase/chat'
import axios from 'axios'

function Chat() {
    const [message, setMessage] = useState('')
    const users = useUser()
    const [user, setUser] = useState()
    const [currentUser, setCurrentUser] = useState()

    const messages = useChat(currentUser?.id ? currentUser.id : 0)

    const handleSendMessage = () => {
        if (currentUser && message != '') {
            sendMessage(1, currentUser.id, message)
            setMessage('')
        }
    }
    return (
        <>
            <div className='main-chat'>
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card>
                            <div className='chat-box'
                                style={{
                                    border: "1px solid",
                                    borderRadius: "10px"
                                }}>
                                <Row>
                                    <Col md={8} style={{
                                        borderRight: "1px solid"
                                    }}>
                                        <div className='list-user'>
                                            <div className='search' style={{
                                                height: "44px",
                                                borderBottom: "1px solid rgba(193, 193, 193, 0.7)",
                                            }}>
                                                {/* <Input placeholder='Tìm kiếm'></Input> */}
                                            </div>
                                            <div style={{
                                                // padding: "5px 10px"
                                            }}>
                                                {
                                                    users.map((user, index) => (
                                                        <div className='user' onClick={() => setCurrentUser(user)} style={{
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            padding: "5px 5px",
                                                            // borderBottom: "1px solid rgba(193, 193, 193, 0.7)",
                                                            backgroundColor: user.id == currentUser?.id && "rgb(218, 218, 218)",
                                                            borderRadius: user.id == currentUser?.id && "5px",
                                                            margin: "5px 5px"
                                                            
                                                        }}>
                                                            <img style={{
                                                                height: "40px",
                                                                width: "40px",
                                                                borderRadius: "50%",
                                                                marginRight: "5px"
                                                            }} src={user.avatar}></img>
                                                            <div style={{
                                                                display: "flex",
                                                                flexDirection: "column"
                                                            }}>
                                                                <span style={{ fontWeight: "600" }}>
                                                                    {user.name}
                                                                </span>
                                                                <span style={{
                                                                    color: "rgba(133, 133, 133, 0.7)",
                                                                    overflow: "hidden",
                                                                    whiteSpace: "nowrap",
                                                                    textOverflow : "ellipsis",
                                                                    width: "150px"
                                                                
                                                                }}>
                                                                    {user?.currentChat}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={16}>
                                        <div className='chat' style={{
                                            height: "700px",
                                            display: "flex",
                                            flexDirection: "column"

                                        }}>
                                            <div className='header-chat'
                                                style={{
                                                    height: "50px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    padding: "0px 10px",
                                                    borderBottom: "1px solid rgba(193, 193, 193, 0.7)",
                                                    fontWeight: "600"
                                                }}>
                                                {
                                                    currentUser?.name
                                                }
                                            </div>
                                            <div className='content-chat'
                                                style={{
                                                    height: "100%",
                                                    padding: "10px",
                                                    overflowY: "scroll"
                                                    // backgroundColor: "#fc3"
                                                }}>
                                                {
                                                    messages.map((message, index) => (
                                                        <div className='message' style={{
                                                            marginBottom: "20px"
                                                        }}>
                                                            {
                                                                message.sender == 1 ?
                                                                    <>
                                                                        <div className='info-message' style={{
                                                                            display: "flex",
                                                                            justifyContent: "right"
                                                                        }}>
                                                                            {/* <img className='avatar' src={logo}></img> */}
                                                                            Admin
                                                                        </div>
                                                                        <div className='text-message'
                                                                            style={{
                                                                                borderRadius: "10px 00px 10px 10px",
                                                                                backgroundColor: "#1890ff",
                                                                                padding: "10px",
                                                                                color: "#fff"
                                                                            }}>
                                                                            {message.message}
                                                                        </div>
                                                                    </> :
                                                                    <>
                                                                        <div className='info-message' style={{
                                                                            display: "flex",
                                                                            justifyContent: "left"
                                                                        }}>
                                                                            {
                                                                                currentUser?.name}
                                                                            {/* {sessionStorage.getItem('token') ? jwtDecode(sessionStorage.getItem('token')).fullname : ""} */}
                                                                            {/* <img className='avatar' src={sessionStorage.getItem('token') ? jwtDecode(sessionStorage.getItem('token')).avatar : ""}></img> */}
                                                                        </div>
                                                                        <div className='text-message'
                                                                            style={{
                                                                                borderRadius: "0px 10px 10px 10px",
                                                                                backgroundColor: "#dadada",
                                                                                padding: "10px"
                                                                            }}>
                                                                            {message.message}
                                                                        </div>
                                                                    </>
                                                            }
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <div className='footer-chat'
                                                style={{
                                                    height: "50px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    padding: "0px 10px",
                                                    borderTop: "1px solid rgba(193, 193, 193, 0.7)"
                                                }}>
                                                <input
                                                    placeholder='Write some messsage ...'
                                                    style={{
                                                        border: "none",
                                                        // borderRadius: "50%",
                                                        outline: "none",
                                                        width: "100%"
                                                    }}
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                />
                                                <SendOutlined onClick={handleSendMessage} style={{
                                                    color: (currentUser&&message!='') && "#1890ff"
                                                }} />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Chat