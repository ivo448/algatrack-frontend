/**
 * Configuración de la API para Algatrack
 * 1. Intenta leer VITE_API_BASE_URL (Configurado en Vercel/Render).
 * 2. Si no existe, asume que estamos en local y usa 'http://localhost:5000'.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Función genérica para manejar peticiones Fetch
 * @param {string} endpoint - La ruta de la API (ej: '/api/login')
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
 * @param {object} data - Datos para enviar en el cuerpo (JSON)
 * @returns {Promise<object>} - La respuesta de la API
 */
async function apiFetch(endpoint, method = 'GET', data = null) {
    const url = `${BASE_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
    };

    const config = {
        method: method,
        headers: headers,
        credentials: 'include', // Vital para mantener la sesión (cookies)
    };

    if (data) {
        config.body = JSON.stringify(data);
    }else{
        // Para métodos como DELETE que no deben tener body
        if(method === 'DELETE' || method === 'GET'){
            delete config.body;
        }
    }

    try {
        const response = await fetch(url, config);

            // Manejo de Errores HTTP (400, 401, 403, 500)
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ 
                error: response.statusText, 
                message: `Error ${response.status}: No se pudo conectar con el servidor.` 
            }));
            const err = new Error(errorData.message || errorData.error);
            // Adjuntamos metadata útil (status y cuerpo) para que los consumidores puedan tomar decisiones
            err.status = response.status;
            err.data = errorData;
            throw err;
        }

        // 204 No Content (Ej: Logout exitoso)
        if (response.status === 204) return {};

        return await response.json();
    } catch (error) {
        console.error(`Error en API (${endpoint}):`, error);
        throw error; 
    }
}

// =========================================================
// SERVICIOS DE ACCESO PÚBLICO Y PRIVADO
// =========================================================

export const authService = {
    login: (usuario, contrasena) => apiFetch('/api/login', 'POST', { usuario, contrasena }),
    logout: () => apiFetch('/api/logout', 'POST'),
    // checkSession: () => apiFetch('/api/me', 'GET'), // Útil si implementas persistencia de sesión al recargar
};

export const dashboardService = {
    getDashboard: () => apiFetch('/api/dashboard', 'GET'),
};

export const simulacionService = {
    runSimulacion: (cantidad, fecha) => apiFetch('/api/simulacion', 'POST', { cantidad, fecha }),
};

export const configService = {
    getEconomicos: () => apiFetch('/api/config/sistema', 'GET'),
    updateEconomicos: (listaParams) => apiFetch('/api/config/sistema', 'PUT', listaParams),
    getEstaciones: () => apiFetch('/api/config/estaciones', 'GET'),
    updateEstacion: (estacionData) => apiFetch('/api/config/estaciones', 'PUT', estacionData)
};

export const calendarioService = {
    getEventos: () => apiFetch('/api/calendario', 'GET'),
};

export const lotesService = {
    getLotes: () => apiFetch('/api/lotes', 'GET'),
    crearLote: (lote) => apiFetch('/api/lotes', 'POST', lote),
    actualizarLote: (id, lote) => apiFetch(`/api/lotes/${id}`, 'PUT', lote),
    eliminarLote: (id) => apiFetch(`/api/lotes/${id}`, 'DELETE'),
    cosecharLote: (id) => apiFetch(`/api/lotes/${id}/cosechar`, 'PUT'),
};

export const pedidosService = {
    getPedidos: () => apiFetch('/api/pedidos', 'GET'),
    crearPedido: (pedido) => apiFetch('/api/pedidos', 'POST', pedido),
    actualizarEstado: (id, estado) => apiFetch(`/api/pedidos/${id}`, 'PATCH', { estado }),
    // Endpoint tradicional en este proyecto para cambiar solo estado
    actualizarEstadoPedido: (id, estado) => apiFetch(`/api/pedidos/${id}/estado`, 'PUT', { estado }),
    eliminarPedido: (id) => apiFetch(`/api/pedidos/${id}`, 'DELETE'),
};

export const clientesService = {
    getClientes: () => apiFetch('/api/clientes', 'GET'),
    crearCliente: (cliente) => apiFetch('/api/clientes', 'POST', cliente),
    eliminarCliente: (id) => apiFetch(`/api/clientes/${id}`, 'DELETE'),
};

export const usuariosService = {
    getUsuarios: () => apiFetch('/api/usuarios', 'GET'),
    crearUsuario: (usuario) => apiFetch('/api/usuarios', 'POST', usuario),
    actualizarUsuario: (id, usuario) => apiFetch(`/api/usuarios/${id}`, 'PUT', usuario),
    eliminarUsuario: (id) => apiFetch(`/api/usuarios/${id}`, 'DELETE'),
};