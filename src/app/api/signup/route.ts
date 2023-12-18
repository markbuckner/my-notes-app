import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return new NextResponse('Method not allowed', { status: 405 });
    }

    const { email, password, captchaToken } = await req.json();
    console.log({ email, password, captchaToken });
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    // Perform CAPTCHA verification
    const captchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${secretKey}&response=${captchaToken}`,
    });
    const captchaData = await captchaResponse.json();
    console.log({ captchaData });

    if (!captchaData.success) {
        return new NextResponse(JSON.stringify({ message: 'CAPTCHA verification failed' }), { status: 400 });
    }

    // Proceed with Supabase user creation
    const cookieStore = cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    )
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
        return new NextResponse(JSON.stringify({ message: error.message }), { status: 400 });
    }
    console.log(`User ${email} created successfully`);
    return new NextResponse(JSON.stringify({ message: 'User created successfully' }), { status: 200 });
}
