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

    const getEndTime = (time) => {
        const inputDate = new Date(time);
        const addedTime = 40 * 60000; // 40 phút * 60 giây/phút * 1000 mili giây/giây
        const timezoneOffset = 7 * 60; // Lấy độ lệch của múi giờ theo số phút, ví dụ -7 giờ thì độ lệch sẽ là -7*60=-420
        const adjustedDate = new Date(inputDate.getTime() + addedTime + timezoneOffset * 60000); // Sử dụng getTime để lấy ra số mili giây của thời điểm
        return (adjustedDate.toISOString().replace("T", " ").replace(".000Z", ""));

    }
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
                        start: item.time.replace("T", " "),
                        end: getEndTime(item.time),
                        id: item.bookingId,
                        // color: item.status == "done" ? "#198754"
                        //     : item.status == "wait" ? "#0d6efd" : "#f5222d",

                        color: item.status == "done" ? "#0CCE6B"
                            : item.status == "wait" ? "#0d6efd" : "#f5222d",
                    })
                ))
                setData(schedules)
                console.log(schedules)
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
                                height={"80vh"}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Calendar