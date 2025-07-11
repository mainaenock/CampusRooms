import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDb from './config/db.js'
import regRouters from './routes/regRoutes.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 3000

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log('server listening from port: ', PORT)
    })
})

app.use('/cr/reg', regRouters)