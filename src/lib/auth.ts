import { pb } from "./pocketbase";

export function isAuthenticated(): boolean {
  return pb.authStore.isValid;
}

export function getAuthToken(): string | null {
  return pb.authStore.token;
}

export function getAuthUser() {
  return pb.authStore.record;
}

export async function logout(): Promise<void> {
  pb.authStore.clear();

  // Eliminar también la cookie del servidor
  try {
    await fetch("/api/auth/set-cookie", {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error clearing auth cookie:", error);
  }
}

export async function checkAuth(): Promise<boolean> {
  if (!pb.authStore.isValid) {
    return false;
  }

  try {
    // Verificar que el token siga siendo válido contra la colección de usuarios
    await pb.collection("users").authRefresh();
    return true;
  } catch {
    pb.authStore.clear();
    return false;
  }
}
