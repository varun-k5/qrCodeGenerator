const express=require('express')
const QRcode=require('qrcode')
const validUrl=require('valid-url')
const path = require('path')
const fs = require('fs')

const app=express()
const port=process.env.PORT||3000

app.get('/generateQR', async (req,res)=>{
    try{
        const url=req.query.url

        if(!url||!validUrl.isUri(url)){
            return res.status(400).send('Bad Request: Invalid URL');
        }
      
        const qrCodeImage=await QRcode.toDataURL(url)

        const tempFilePath=path.join(__dirname,'qrcode.png')
        await QRcode.toFile(tempFilePath,url)

        res.send(`
            <img src="${qrCodeImage}" alt="QR code"/>
            <br/>
            <a href="/downloadQR" download="qrcode.png">
            <button>Download</button>
            </a>
        `)

        //Route to serve the QR code image for download
        app.get('/downloadQR',(req,res)=>{
            res.download(tempFilePath,'qrcode.png',(err)=>{
                if(err){
                    console.log(err)
                    res.status(500).send('Error downloading this file')
                }
                //Delete the file after download
                fs.unlinkSync(tempFilePath)
            })
        })
    }
    catch(e){
        console.log(e)
        res.status(500).send('Internal Server Error')
    }
})

app.listen(port,()=>{
    console.log(`Server is set up on port ${port}.`)
})

/*
Usage:
Temporary File Creation: You create a temporary file(on server) to generate and serve a QR code.
File Download: The client downloads the file.
File Deletion: After the download, the server removes the file to keep the system clean.
*/