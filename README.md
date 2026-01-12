🚀 Sistema de Gestión ERP - Solución Integral de Negocios
Este es un sistema de planificación de recursos empresariales (ERP) robusto y escalable, desarrollado con tecnologías modernas para optimizar la gestión administrativa, comercial y operativa de empresas. El sistema está diseñado específicamente para el contexto peruano, incluyendo integraciones para facturación y validación de datos.

✨ Características Principales
📊 Gestión Comercial y Ventas
Módulo de Ventas Completo: Creación y administración de proformas, facturas y boletas.

Control de Documentos: Seguimiento detallado de Guías de Remisión y comprobantes de pago.

Condiciones de Pago: Gestión de créditos, plazos y estados de pago.

📦 Inventario y Logística
Control de Almacenes: Gestión multi-almacén con transferencias y control de stock.

Catálogo de Productos: Administración detallada de artículos, unidades de medida y afectaciones de IGV/ISC.

Logística de Envíos: Gestión de vehículos, choferes y tipos de envío para guías de remisión.

👥 Administración y Configuración
Gestión de Clientes: Directorio centralizado con validación de datos (RUC/DNI).

Configuración Multisucursal: Capacidad de gestionar múltiples puntos de venta y series de documentos independientes.

Reportes Avanzados: Generación de reportes de ventas, productos y clientes con exportación a Excel.

🛠️ Stack Tecnológico
Frontend: React con TypeScript para un desarrollo con tipado fuerte y seguro.

Estado Global: Zustand para una gestión de estado ligera y eficiente (Auth, Ventas, Impresiones).

UI Framework: PrimeReact para componentes de interfaz de alta calidad y consistencia.

Estilos: Tailwind CSS para un diseño responsivo y altamente personalizado.

Validaciones: Integración con servicios externos para validación de datos SUNAT.

Herramientas de Soporte: Axios para consumo de APIs, Lucide React para iconografía y librerías especializadas en generación de Excel/PDF.

🏗️ Arquitectura del Proyecto
El proyecto sigue una estructura modular que separa la lógica de negocio de la interfaz de usuario:

Plaintext

src/
├── components/ # Componentes comunes, feedback y modales
├── hooks/ # Hooks personalizados para lógica de datos y formularios
├── modules/ # Módulos core (Ventas, Clientes, Inventario, Configuración)
├── services/ # Capa de API y generadores de documentos (Excel/PDF)
├── stores/ # Stores de Zustand para estado global
├── types/ # Definiciones de modelos y tipos de API
└── utils/ # Utilidades para exportación, cálculos y navegación

🚀 Instalación y Configuración
Clonar el repositorio:

git clone https://github.com/tu-usuario/sistema-de-gestion.git

Instalar dependencias:

npm install

Configurar variables de entorno: Crea un archivo .env basándote en .env.example con las URLs de API correspondientes.

Ejecutar en desarrollo:

npm run dev
