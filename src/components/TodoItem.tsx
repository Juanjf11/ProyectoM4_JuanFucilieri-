import { useState } from 'react';
import type { Task, UpdateTaskInput } from '../types/task';

interface TodoItemProps {
  task: Task;
  onToggle: (taskId: string, currentCompleted: boolean) => Promise<boolean>;
  onUpdate: (taskId: string, input: UpdateTaskInput) => Promise<boolean>;
  onDelete: (taskId: string) => Promise<boolean>;
}

export const TodoItem = ({
  task,
  onToggle,
  onUpdate,
  onDelete,
}: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const handleToggle = async () => {
    setIsToggling(true);
    await onToggle(task.id, task.completed);
    setIsToggling(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la tarea "${task.title}"?`)) {
      setIsDeleting(true);
      await onDelete(task.id);
      setIsDeleting(false);
    }
  };

  const handleStartEditing = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditError(null);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditError(null);
  };

  const handleSaveEdit = async () => {
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      setEditError('El título no puede estar vacío.');
      return;
    }

    setIsSaving(true);
    const success = await onUpdate(task.id, {
      title: trimmedTitle,
      description: editDescription.trim(),
    });

    if (success) {
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  return (
    <li
      style={{
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '10px',
        padding: '1.25rem',
        marginBottom: '0.75rem',
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        opacity: task.completed && !isEditing ? 0.75 : 1,
        transition: 'all 0.2s ease',
      }}
    >
      {isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {editError && (
            <div
              style={{
                color: '#fca5a5',
                fontSize: '0.85rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                padding: '0.4rem 0.6rem',
                borderRadius: '4px',
              }}
            >
              {editError}
            </div>
          )}
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={isSaving}
            placeholder="Título de la tarea"
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: '#0f172a',
              border: '1px solid #475569',
              borderRadius: '6px',
              color: '#f8fafc',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
          <textarea
            rows={2}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            disabled={isSaving}
            placeholder="Descripción de la tarea"
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: '#0f172a',
              border: '1px solid #475569',
              borderRadius: '6px',
              color: '#f8fafc',
              fontSize: '0.9rem',
              outline: 'none',
              resize: 'vertical',
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleCancelEditing}
              disabled={isSaving}
              style={{
                padding: '0.4rem 0.8rem',
                backgroundColor: 'transparent',
                border: '1px solid #64748b',
                borderRadius: '6px',
                color: '#cbd5e1',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              disabled={isSaving}
              style={{
                padding: '0.4rem 0.8rem',
                backgroundColor: '#10b981',
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff',
                fontWeight: '600',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                fontSize: '0.85rem',
              }}
            >
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1 }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggle}
              disabled={isToggling}
              aria-label={`Marcar ${task.title} como ${task.completed ? 'pendiente' : 'completada'}`}
              style={{
                width: '1.25rem',
                height: '1.25rem',
                cursor: isToggling ? 'not-allowed' : 'pointer',
                marginTop: '0.2rem',
                accentColor: '#3b82f6',
              }}
            />
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.05rem',
                  fontWeight: '600',
                  color: task.completed ? '#94a3b8' : '#f8fafc',
                  textDecoration: task.completed ? 'line-through' : 'none',
                  wordBreak: 'break-word',
                }}
              >
                {task.title}
              </h3>
              {task.description && (
                <p
                  style={{
                    margin: '0.4rem 0 0 0',
                    fontSize: '0.9rem',
                    color: '#94a3b8',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {task.description}
                </p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            <button
              type="button"
              onClick={handleStartEditing}
              disabled={isDeleting || isToggling}
              title="Editar tarea"
              style={{
                padding: '0.4rem 0.65rem',
                backgroundColor: '#334155',
                border: 'none',
                borderRadius: '6px',
                color: '#e2e8f0',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              Editar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isToggling}
              title="Eliminar tarea"
              style={{
                padding: '0.4rem 0.65rem',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #ef4444',
                borderRadius: '6px',
                color: '#fca5a5',
                cursor: isDeleting ? 'not-allowed' : 'pointer',
                fontSize: '0.85rem',
              }}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default TodoItem;
