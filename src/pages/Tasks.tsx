import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { logout } from '../services/authService';
import { TodoForm } from '../components/TodoForm';
import { TodoList } from '../components/TodoList';

export const Tasks = () => {
  const { user } = useAuth();
  const {
    tasks,
    loading,
    error,
    clearError,
    handleCreateTask,
    handleUpdateTask,
    handleToggleTask,
    handleDeleteTask,
  } = useTasks();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
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
      {/* Barra superior */}
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
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>
            Gestor de Tareas
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
            Usuario: <strong style={{ color: '#60a5fa' }}>{user?.email}</strong>
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
            transition: 'background-color 0.2s',
          }}
        >
          {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
        </button>
      </header>

      {/* Contenido principal */}
      <main
        style={{
          maxWidth: '720px',
          margin: '2rem auto',
          padding: '0 1.5rem',
        }}
      >
        {/* Banner de error */}
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
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.9rem',
            }}
          >
            <span>{error}</span>
            <button
              onClick={clearError}
              style={{
                background: 'none',
                border: 'none',
                color: '#fca5a5',
                cursor: 'pointer',
                fontWeight: 'bold',
                padding: '0.2rem 0.5rem',
                fontSize: '1rem',
              }}
              title="Cerrar aviso"
            >
              ✕
            </button>
          </div>
        )}

        {/* Formulario de creación */}
        <TodoForm onCreateTask={handleCreateTask} />

        {/* Estado de carga o listado de tareas */}
        {loading ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem 0',
              gap: '0.75rem',
            }}
          >
            <div
              role="status"
              aria-label="Cargando tareas"
              style={{
                width: '36px',
                height: '36px',
                border: '3px solid #334155',
                borderTopColor: '#3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <style>
              {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
            </style>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
              Sincronizando tareas en tiempo real...
            </p>
          </div>
        ) : (
          <TodoList
            tasks={tasks}
            onToggle={handleToggleTask}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        )}
      </main>
    </div>
  );
};

export default Tasks;
