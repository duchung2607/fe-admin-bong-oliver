import { Avatar, Button, Image } from 'antd'
import axios, { Axios } from 'axios';
import React, { useState } from 'react'
import { UploadImageAPI } from '../assets/js/public';
// import UploadImageAPI from '../assets/js/public.js'

function UploadFile() {
    const [file, setFile] = useState()
    const [url, setUrl] = useState()
    const Upload = async () =>{
        var url = await UploadImageAPI(file)
        console.log(url)
        setUrl(url)

        // var res = await axios.get("https://api.cloudinary.com/v1_1/drk74xnef/")
        // console.log(res)
    }
    return (
        <>
            <input type="file" onChange={(e) => setFile(e.target.files[0])}></input>
            <Button onClick={Upload}>Upload</Button>

            <Image src={url}></Image>

            <Avatar src={url}/>
        </>
    )
}

export default UploadFile;