import { pb } from './pocketbase';

export function isAuthenticated(): boolean {
  return pb.authStore.isValid;
}

export function getAuthToken(): string | null {
  return pb.authStore.token;
}

export function getAuthUser() {
  return pb.authStore.record;
}

export function logout(): void {
  pb.authStore.clear();
}

export async function checkAuth(): Promise<boolean> {
  if (!pb.authStore.isValid) {
    return false;
  }

  try {
    // Verificar que el token siga siendo válido
    await pb.collection('_superusers').authRefresh();
    return true;
  } catch (error) {
    pb.authStore.clear();
    return false;
  }
}
