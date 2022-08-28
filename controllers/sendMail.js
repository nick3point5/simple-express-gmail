import { google } from 'googleapis'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const googleId = process.env.GMAIL_ID
const googleSecret = process.env.GMAIL_SECRET
const refreshToken = process.env.REFRESH_TOKEN
const redirectURI = process.env.REDIRECT_URI

const oathClient = new google.auth.OAuth2(googleId, googleSecret, redirectURI)

oathClient.setCredentials({ refresh_token: refreshToken })

export const sendMail = async (req, res, next) => {
	try {
		const { email, time } = req.body
		const date = new Date(time)

		const accessToken = await oathClient.getAccessToken()
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: process.env.GMAIL_USERNAME,
				clientId: googleId,
				clientSecret: googleSecret,
				refreshToken: refreshToken,
				accessToken: accessToken,
			},
		})

		const options = {
			from: `example node mailer <${process.env.GMAIL_USERNAME}>`,
			to: email,
			subject: `test`,
			text: `email sent from ${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date
				.getMinutes()
				.toString()
				.padStart(2, '0')}`,
			html: `
				<p>
					email sent from ${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date
				.getMinutes()
				.toString()
				.padStart(2, '0')}
				</p>
			`,
			envelope: {
				from: process.env.GMAIL_USERNAME,
				to: email,
			},
		}

		await transporter.sendMail(options, (error) => {
			if (error) {
				console.log(error)
				res
					.json({
						status: 'Failure',
					})
					.status(400)
			} else {
				console.log('Success')
				res.json({
					status: 'Success',
				})
			}
		})
	} catch (error) {
		console.log(error)
		next(error)
	}
}
