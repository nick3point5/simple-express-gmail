import express from 'express'
import cors from 'cors'

import path from 'path'
import { fileURLToPath } from 'url'

import { sendMail } from './controllers/sendMail.js'

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
	.get('/', (req, res) => {
		res.sendFile(__dirname + '/views/index.html')
	})
	.post('/', sendMail)
