'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import { pb } from '@/lib/pocketbase';
import { isAuthenticated } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Redirigir si ya está autenticado
    if (isAuthenticated()) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      
      if (pb.authStore.isValid) {
        // Guardar el token en cookies para que funcione en Server Components
        await fetch('/api/auth/set-cookie', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: authData.token,
            model: authData.record,
          }),
        });
        
        router.push('/admin/dashboard');
      }
    } catch (err: unknown) {
      console.error('Error de autenticación:', err);
      setError('Credenciales inválidas. Por favor, verifica tu correo y contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#F8F3ED] via-[#D9C3A3] to-[#D6A77A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-[#D9C3A3] rounded-lg shadow-xl p-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-linear-to-br from-[#5A1E02] to-[#8B3C10] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaUser className="w-10 h-10 text-[#F8F3ED]" />
            </div>
            <h1 className="text-3xl font-bold text-[#5A1E02] mb-2">
              Panel de Administración
            </h1>
            <p className="text-[#4A3B31]/70 text-sm">
              Salinas Yuyay - Archivo Cultural
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="alert bg-[#B63A1B]/10 border border-[#B63A1B]/30 text-[#B63A1B] text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <span>{error}</span>
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text text-[#4A3B31] font-medium">Correo electrónico</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="w-4 h-4 text-[#8B3C10]" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@salinas.ec"
                  className="input input-bordered w-full pl-10 bg-[#F8F3ED] border-[#D9C3A3] focus:border-[#5A1E02] focus:outline-none text-[#4A3B31]"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-[#4A3B31] font-medium">Contraseña</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="w-4 h-4 text-[#8B3C10]" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10 bg-[#F8F3ED] border-[#D9C3A3] focus:border-[#5A1E02] focus:outline-none text-[#4A3B31]"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn w-full bg-[#5A1E02] hover:bg-[#8B3C10] text-white border-none gap-2 transition-all disabled:bg-[#4A3B31]/50"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <FaSignInAlt className="w-4 h-4" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-[#D9C3A3]">
            <p className="text-sm text-[#4A3B31]/60">
              Sistema de Archivo e Información de Salinas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
