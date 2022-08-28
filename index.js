import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import path from 'path'
import { fileURLToPath } from 'url'

import { sendMail } from './controllers/sendMail.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000

app.listen(PORT, () => {
	console.log(`running on http://localhost:${PORT}`)
})

app
	.use(express.urlencoded({ extended: false }))
	.use(express.json())
	.use(cors())
	.use(express.static('views'))
	.get('/', (req, res) => {
		res.sendFile('index.html', {root: path.join(__dirname, 'views')})
	})
	.post('/', sendMail)
