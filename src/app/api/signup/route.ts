import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type SignupPayload = {
  name: string
  email: string
  industry: string
  jobTitle: string
  organisation: string
  phone: string
  interest?: string
  agree?: boolean
}

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    throw new Error("Missing Supabase env NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }
  return createClient(url, anonKey, { auth: { persistSession: false } })
}

async function sendConfirmationEmail(params: { to: string; name: string }) {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.EMAIL_FROM || "no-reply@yourdomain.com"
  const brand = process.env.BRAND_NAME || "Our Product"
  if (!apiKey) {
    // Silently skip email if not configured
    return
  }
  const subject = `Thanks for signing up for ${brand}!`
  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6;">
      <h2>Thanks for signing up, ${params.name || "there"}!</h2>
      <p>We're excited to keep you updated on ${brand}. You'll receive product updates at this email.</p>
      <p style="color:#888">If this wasn't you, you can ignore this email.</p>
    </div>
  `
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: params.to,
      subject,
      html,
    }),
  })
    .then(() => {})
    .catch(() => {})
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SignupPayload
    const { name, email, industry, jobTitle, organisation, phone, interest } = body
    if (!name || !email || !industry || !jobTitle || !organisation || !phone) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // Ensure table name matches guidance provided to the user
    const table = "prelaunch_signups"

    // Check for existing email to return a friendly 409
    const { data: existing, error: existingError } = await supabase
      .from(table)
      .select("id")
      .eq("email", email)
      .maybeSingle()
    if (existingError) {
      return NextResponse.json({ message: existingError.message }, { status: 500 })
    }
    if (existing) {
      return NextResponse.json({ message: "Email already signed up" }, { status: 409 })
    }

    // Insert row
    const { error: insertError } = await supabase.from(table).insert({
      name,
      email,
      industry,
      job_title: jobTitle,
      organisation,
      phone,
      interest,
    })
    if (insertError) {
      // If unique constraint exists, translate to 409
      if ((insertError as any)?.code === "23505") {
        return NextResponse.json({ message: "Email already signed up" }, { status: 409 })
      }
      return NextResponse.json({ message: insertError.message }, { status: 500 })
    }

    // Fire-and-forget confirmation email
    sendConfirmationEmail({ to: email, name }).catch(() => {})

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Unexpected error" }, { status: 500 })
  }
}


