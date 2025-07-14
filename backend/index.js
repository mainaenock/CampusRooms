import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDb from './config/db.js'
import regRoutes from './routes/regRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config()


const app = express()
app.use(express.json())
app.use(cors())
// Serve uploads directory
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3000

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log('server listening from port: ', PORT)
    })
})

app.use('/cr/reg', regRoutes)
app.use('/api/listings', listingRoutes)
app.use('/api/admin', adminRoutes)