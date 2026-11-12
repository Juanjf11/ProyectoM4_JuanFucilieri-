import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../services/authService';

export const Tasks = () => {
  const { user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setError(null);
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cerrar sesión');
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <header
        style={{
          borderBottom: '1px solid #334155',
          backgroundColor: '#1e293b',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>
            Gestor de Tareas
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
            Sesión iniciada como: <strong style={{ color: '#60a5fa' }}>{user?.email}</strong>
          </p>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: isLoggingOut ? 'not-allowed' : 'pointer',
            opacity: isLoggingOut ? 0.7 : 1,
          }}
        >
          {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
        </button>
      </header>

      <main style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1.5rem' }}>
        {error && (
          <div
            role="alert"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '3rem',
              marginBottom: '1rem',
            }}
          >
            📋
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Panel de Tareas (Placeholder)
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
            La autenticación fue configurada exitosamente con Firebase Auth. Aquí se integrará el CRUD de tareas.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Tasks;
