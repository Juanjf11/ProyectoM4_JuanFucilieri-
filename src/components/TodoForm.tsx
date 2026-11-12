import { useState, type FormEvent } from 'react';
import type { CreateTaskInput } from '../types/task';

interface TodoFormProps {
  onCreateTask: (input: CreateTaskInput) => Promise<boolean>;
}

export const TodoForm = ({ onCreateTask }: TodoFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setValidationError('El título de la tarea es obligatorio.');
      return;
    }

    setIsSubmitting(true);
    const success = await onCreateTask({
      title: trimmedTitle,
      description: description.trim(),
    });

    if (success) {
      setTitle('');
      setDescription('');
    }
    setIsSubmitting(false);
  };

  return (
    <div
      style={{
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid #334155',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
      }}
    >
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#f8fafc' }}>
        Nueva Tarea
      </h2>

      {validationError && (
        <div
          role="alert"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            padding: '0.6rem 0.9rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontSize: '0.875rem',
          }}
        >
          {validationError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="task-title"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.4rem',
              color: '#cbd5e1',
            }}
          >
            Título <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="Ej: Comprar insumos o revisar PR"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.65rem 0.9rem',
              backgroundColor: '#0f172a',
              border: '1px solid #475569',
              borderRadius: '6px',
              color: '#f8fafc',
              fontSize: '0.95rem',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="task-description"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.4rem',
              color: '#cbd5e1',
            }}
          >
            Descripción (opcional)
          </label>
          <textarea
            id="task-description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalles adicionales sobre la tarea..."
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.65rem 0.9rem',
              backgroundColor: '#0f172a',
              border: '1px solid #475569',
              borderRadius: '6px',
              color: '#f8fafc',
              fontSize: '0.95rem',
              boxSizing: 'border-box',
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '0.65rem 1.25rem',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1,
            transition: 'background-color 0.2s',
          }}
        >
          {isSubmitting ? 'Guardando...' : '+ Agregar Tarea'}
        </button>
      </form>
    </div>
  );
};

export default TodoForm;
