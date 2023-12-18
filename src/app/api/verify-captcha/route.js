// app/api/verify-captcha/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { token } = req.body;
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    console.log(req.body)
    const googleResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await googleResponse.json();
    console.log(data)
    return NextResponse.json({ success: data.success });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
