import { cookies } from 'next/headers';
import PocketBase from 'pocketbase';
import { POCKETBASE_URL } from './pocketbase';

/**
 * Helper para cargar la autenticación desde las cookies del servidor
 * SOLO usar en Server Components y Server Actions
 */
export async function loadAuthFromCookies() {
  const pb = new PocketBase(POCKETBASE_URL);
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('pb_auth');
  
  if (authCookie?.value) {
    try {
      const authData = JSON.parse(authCookie.value);
      pb.authStore.save(authData.token, authData.model);
    } catch (e) {
      console.error('Error loading auth from cookie:', e);
    }
  }
  
  return pb;
}
