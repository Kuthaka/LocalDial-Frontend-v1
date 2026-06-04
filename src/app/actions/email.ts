'use server'

import { Resend } from 'resend'

// Initialize Resend with the API key from your .env.local file
const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Example function to send a custom email using Resend.
 * NOTE: This is for custom emails (like welcome emails or notifications).
 * This does NOT handle your Supabase OTP Auth emails.
 */
export async function sendCustomEmail(to: string, subject: string, htmlContent: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // You must verify your own domain in Resend to change this!
      to: to,
      subject: subject,
      html: htmlContent
    })

    if (error) {
      console.error("Resend Error:", error)
      return { error: error.message }
    }

    return { success: true, data }
  } catch (err) {
    console.error("Unexpected Error sending email:", err)
    return { error: "Failed to send email" }
  }
}
