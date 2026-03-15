# Los Martes No Hay Luna — Despliegue en Vercel

## Estructura del proyecto

```
/
├── api/
│   └── chat.js          ← Función serverless (GPT-4o mini)
├── img/
│   ├── LMHHL_logo_2026.svg
│   ├── LMHHL_logo_2026_BLANCO.svg
│   ├── sheila-hero.png
│   ├── sheila-about.png
│   ├── sheila-standing.png
│   ├── sheila-trabajando.png
│   ├── sheila-estrategia.png
│   ├── sheila-ia.png
│   ├── sheila-consultoria.png
│   └── sheila-diagnostico.png
├── index.html
├── servicios-agencia.html
├── ia-para-empresas.html
├── sheila-aguilar.html
├── blog.html
├── contacto.html
├── sesion-gratuita.html
├── consultoria-estrategica.html
├── gracias.html
├── widget-consultora.js
└── vercel.json
```

## Pasos para desplegar

### 1. Crear el proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com) y crea una cuenta (gratis)
2. Haz clic en **"Add New Project"**
3. Elige **"Import Git Repository"** o **"Upload"** si subes directo
4. Si usas GitHub: conecta tu repositorio `losmartesnohaylunaweb`

### 2. Añadir la variable de entorno (API key de OpenAI)

**MUY IMPORTANTE — nunca pegues la key en el código**

1. En tu proyecto Vercel ve a **Settings → Environment Variables**
2. Añade:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** `sk-...` (tu API key de OpenAI)
   - **Environment:** Production, Preview, Development (marca los tres)
3. Haz clic en **Save**

### 3. Desplegar

Si conectaste GitHub: cada push a `main` redespliega automáticamente.
Si subes manual: arrastra la carpeta del proyecto a Vercel.

### 4. (Opcional) Conectar tu dominio

1. Ve a **Settings → Domains**
2. Añade `losmartesnohayluna.com`
3. Vercel te da las instrucciones DNS para apuntar tu dominio

## Funcionamiento del widget

- El visitante ve un botón flotante en la esquina inferior derecha
- Al hacer clic, se abre un chat con la imagen de Sheila
- Las preguntas y respuestas van a `/api/chat` (función serverless)
- La función llama a OpenAI GPT-4o mini con tu API key (guardada en Vercel, nunca expuesta)
- Después de 3 respuestas, aparece un CTA para reservar sesión gratuita

## Costes estimados

- **Vercel:** Gratis (plan Hobby) para este uso
- **OpenAI GPT-4o mini:** ~0,0002€ por mensaje. Con 100 conversaciones/mes de 6 mensajes cada una = ~0,12€/mes
