import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token, model } = await request.json();
    
    if (!token || !model) {
      return NextResponse.json({ error: 'Missing token or model' }, { status: 400 });
    }

    // Crear la cookie de autenticación en el formato que PocketBase espera
    const authData = JSON.stringify({ token, model });
    const cookieStore = await cookies();
    
    cookieStore.set('pb_auth', authData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting auth cookie:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('pb_auth');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting auth cookie:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
