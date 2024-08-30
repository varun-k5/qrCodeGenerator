const express=require('express')
const QRcode=require('qrcode')
const validUrl=require('valid-url')

const app=express()
const port=process.env.PORT||3000

app.get('/generateQR', async (req,res)=>{
    try{
        const url=req.query.url

        if(!url||!validUrl.isUri(url)){
            return res.status(400).send('Bad Request: Invalid URL');
        }
      
        const qrCodeImage=await QRcode.toDataURL(url)
        res.send(`<img src="${qrCodeImage}" alt="QR code"/>`)
    }
    catch(e){
        console.log(e)
        res.status(500).send('Internal Server Error')
    }
})

app.listen(port,()=>{
    console.log(`Server is set up on port ${port}.`)
})