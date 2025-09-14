import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 8080 
dotenv.config()


app.use(cors())
app.use(express.json())



