import { Card, Col, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading/Loading'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import axios from 'axios'

function Calendar() {
    const [wait, setWait] = useState(false)
    const [data, setData] = useState()
    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = async () => {
        setWait(true)
        try {
            var res = await axios.get("https://localhost:7125/api/booking/calendar")
            if (res?.data?.code == 200) {
                console.log(res?.data?.data)
                const schedules = []
                res?.data?.data?.map((item, index) => (
                    schedules.push({
                        title: "Lịch hẹn #" + item.bookingId,
                        date: item.time.replace("T", " "),
                        id: item.bookingId,
                        color: item.status == "done" ? "#198754"
                            : item.status == "wait" ?"#f5222d" : "#0d6efd",
                    })
                ))
                setData(schedules)
            }
        } catch (e) { }
        setWait(false)
    }

    const handleClick = (e) => {
        window.location = `booking/${e.event._def.publicId}`
    }
    return (
        <>
            {
                wait && <Loading />
            }
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card>
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin]}
                                initialView="timeGridWeek"
                                headerToolbar={{
                                    start: "today prev,next",
                                    center: "title",
                                    end: "dayGridMonth,timeGridWeek,timeGridDay"
                                }}
                                events={
                                    data
                                }
                                // eventColor='red'
                                eventClick={(e) => handleClick(e)}
                                height={"78vh"}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Calendar