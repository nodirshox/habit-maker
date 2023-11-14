import { Injectable } from '@nestjs/common'
import { createTransport } from 'nodemailer'

@Injectable()
export class EmailService {
  private transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  sendValidationLink = async (email: string, link: string) => {
    return this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Habit Maker',
      html: `<body><p>By pressing the link you will confirm yourself: <a clicktracking="off" href='${link}'>Restore account</a>. The link expires in 2 minutes.</p></body>`,
    })
  }

  sendRegistrationOtp = async (email: string, otp: string) => {
    return this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Habit Maker',
      html: `<body><p>Your OTP: ${otp}</p></body>`,
    })
  }
}
