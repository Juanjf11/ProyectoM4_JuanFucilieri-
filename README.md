# Gestor Estrategico de Tareas

SPA de gestion de tareas con autenticacion y persistencia en la nube. Proyecto integrador del modulo 4.

**URL de produccion:** https://TU-URL.vercel.app

## Funcionalidades
- Registro e inicio de sesion con email y contraseña, y con Google
- Rutas privadas: no se pueden ver las tareas sin iniciar sesion
- CRUD de tareas (crear, listar, editar, completar, eliminar) en Cloud Firestore
- Actualizacion de la interfaz en tiempo real
- Cada usuario solo puede ver sus propias tareas

## Stack
React + TypeScript (Vite), Firebase Auth + Firestore, react-router-dom, deploy en Vercel.

## Estructura
- `src/pages`: vistas (Login, Register, Tasks)
- `src/components`: TodoForm, TodoList, TodoItem
- `src/services`: integracion con Firebase (auth y tareas)
- `src/context` y `src/hooks`: sesion (AuthProvider, useAuth) y useTasks
- `src/routes`: router y ProtectedRoute
- `src/types`: tipos compartidos

## Instalacion
1. Instalar dependencias: `npm install`
2. Copiar `.env.example` a `.env` y completar los valores
3. Levantar el proyecto: `npm run dev`

## Variables de entorno
`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.
El archivo `.env` no se sube al repositorio; `.env.example` sirve de plantilla.

## Decisiones arquitectonicas
- Firebase como BaaS: Auth para usuarios y Firestore para los datos.
- Servicios separados de los componentes.
- Sesion compartida con un contexto (`AuthProvider`) y el hook `useAuth`.
- `ProtectedRoute` bloquea las rutas privadas y espera a que se resuelva la sesion.
- Reglas de Firestore: cada tarea guarda `userId` y solo su dueño puede leerla, editarla o borrarla.
- La consulta filtra por `userId` y el orden se hace en el cliente para no necesitar un indice compuesto.
- `vercel.json` redirige todas las rutas a `index.html` para que recargar `/tasks` no de 404.

## Despliegue
Vercel, con las variables de entorno cargadas en el panel y el dominio agregado en los dominios autorizados de Firebase.

## Pendiente
- Envio de email con resumen de tareas (AWS SES desde una Vercel Function): no llegue a implementarlo.
- Tests con Vitest y React Testing Library.
- Filtros de tareas (credito extra).

## Uso de la IA en el proceso
Use el agente de Antigravity para generar codigo y un asistente de chat para guiar el orden de los pasos y revisar los resultados.

**Prompts principales**
1. Estructura inicial: pedi crear las carpetas y los archivos de entorno, acotando que trabaje solo dentro de `gestor-tareas`, que no toque nada mas y que explique que hizo.
2. Autenticacion: pedi servicio de auth, contexto, hook, ruta protegida y paginas de login y registro, nombrando los archivos y pidiendo que explique la estructura antes de escribir codigo.
3. CRUD: pedi tipos, servicio con `onSnapshot`, hook y componentes, indicando que ordene en el cliente para evitar un indice compuesto.

**Donde fue mas efectiva**
- Para generar la estructura y el codigo repetitivo (formularios, hooks, servicios) con tipado.
- Para explicarme conceptos que no conocia (anotaciones de tipo, `filter`, `onAuthStateChanged`).
- Para depurar: la app mostraba un error generico; en la consola del navegador aparecio `CONFIGURATION_NOT_FOUND`, que indicaba que faltaba habilitar Authentication en Firebase.

**Patrones y buenas practicas que descubri**
- Pedir el objetivo, nombrar los archivos y acotar el alcance ("no toques nada mas").
- Pedir que explique la estructura antes de escribir codigo y leer el plan antes de aprobar.
- Revisar los cambios (Review) y probar a mano, sin confiar solo en que compile.
- Mantener las credenciales en `.env`, con `.env.example` sin valores reales, y verificar con `git status` antes de cada commit.
.
.
.
Entrego autenticacion con Firebase, CRUD en Firestore, deploy en Vercel y README. Quedaron pendientes el envio de email con AWS SES, los tests y las imagenes del uso de la IA, que no llegue a implementar.
Si es posible, los completo en los proximos dias. Gracias.
