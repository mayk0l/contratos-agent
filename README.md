# 🧾 Contratos Agent - Generador de Contratos Chilenos con IA

Un asistente legal inteligente desarrollado con React y Node.js que utiliza modelos de IA para generar contratos legales válidos según la legislación chilena. El sistema guía al usuario a través de un chat conversacional para recopilar la información necesaria y produce contratos profesionales y personalizados.

## 🔥 Características

- **Chat Conversacional**: Interfaz intuitiva tipo WhatsApp para generar contratos
- **IA Especializada**: Modelos específicos entrenados en legislación chilena  
- **Validación Automática**: Verifica que todos los datos necesarios estén presentes
- **Contratos Profesionales**: Genera documentos formales y legalmente válidos
- **Respuesta Enfocada**: El agente se mantiene estrictamente en el dominio legal

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** + Express
- **OpenRouter AI** (Mistral & Mixtral models)
- **CORS** para comunicación cross-origin
- **dotenv** para manejo de variables de entorno

### Frontend  
- **React 19** + TypeScript
- **Vite** para build y desarrollo
- **TailwindCSS** para estilos
- **React Markdown** para renderizar contratos

### Deploy
- **Frontend**: Vercel (con configuración optimizada)
- **Backend**: Local con ngrok para exposición pública

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v18+)
- Cuenta en [OpenRouter](https://openrouter.ai) para obtener API key
- ngrok instalado para exposición del backend

### 1. Clonar el repositorio
```bash
git clone https://github.com/mayk0l/contratos-agent.git
cd contratos-agent
```

### 2. Configurar Backend
```bash
cd backend
npm install

# Crear archivo .env con tu API key
echo "OPENROUTER_API_KEY=tu_api_key_aqui" > .env

# Iniciar servidor
node index.js
```

### 3. Configurar Frontend  
```bash
cd frontend
npm install

# Crear archivo .env con la URL del backend
echo "VITE_BACKEND_URL=http://localhost:3000" > .env

# Para desarrollo
npm run dev

# Para build de producción
npm run build
```

### 4. Exposer Backend con ngrok
```bash
# En otra terminal
ngrok http 3000
```

## 🌐 Deploy en Vercel

1. **Fork** el repositorio en GitHub
2. **Conecta** tu cuenta de Vercel con GitHub
3. **Configura** el proyecto:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Agrega** variable de entorno:
   - `VITE_BACKEND_URL`: URL pública de tu backend (ngrok o servidor)

## 📋 Uso del Sistema

1. **Inicia** tanto backend como frontend
2. **Abre** la aplicación en el navegador
3. **Describe** el contrato que necesitas en lenguaje natural
4. **Responde** las preguntas del asistente sobre:
   - Tipo de contrato
   - Proveedor/Empresa
   - Cliente
   - Monto
   - Fecha
5. **Recibe** tu contrato generado profesionalmente

### Ejemplo de Conversación
```
Usuario: "Necesito un contrato de servicios de desarrollo web"

Asistente: "Perfecto, te ayudo con un contrato de servicios de desarrollo web. 
¿Podrías indicarme el nombre de la empresa proveedora?"

Usuario: "TechSolutions SpA"

Asistente: "¿Y cuál es el nombre del cliente que recibirá los servicios?"
...
```

## 🧪 Funcionalidades para Probar

- **Generación de contratos**: Servicios, compraventa, arriendo, etc.
- **Validación de datos**: El sistema pide información faltante
- **Enfoque especializado**: Prueba preguntar algo fuera del tema legal
- **Formato chileno**: Los contratos siguen la legislación local

## 🔧 Estructura del Proyecto

```
contratos-agent/
├── backend/
│   ├── index.js          # Servidor Express con endpoints de IA
│   ├── package.json      # Dependencias del backend
│   └── .env             # API keys (no incluido en repo)
├── frontend/
│   ├── src/
│   │   ├── components/   # ChatInput, ChatMessage
│   │   ├── pages/       # ChatPage principal
│   │   └── main.tsx     # Entry point React
│   ├── vercel.json      # Configuración para Vercel
│   ├── vite.config.js   # Configuración de Vite
│   └── .env            # Variables de entorno (no incluido)
└── README.md
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

[MIT](LICENSE)

---

**Desarrollado en Chile 🇨🇱** | Para consultas: [GitHub Issues](https://github.com/mayk0l/contratos-agent/issues)

