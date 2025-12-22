/**
 * Configuración de la API para Algatrack
 * * NOTA: 
 * En desarrollo (localhost), VITE_API_BASE_URL es 'http://localhost:5000'
 * En Vercel (Producción), se inyectará la URL de Render.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Función genérica para manejar peticiones Fetch
 * @param {string} endpoint - La ruta de la API (ej: '/api/login')
 * @param {string} method - Método HTTP (GET, POST, etc.)
 * @param {object} data - Datos para enviar en el cuerpo (solo para POST/PUT)
 * @returns {Promise<object>} - La respuesta de la API
 */
async function apiFetch(endpoint, method = 'GET', data = null) {
    const url = `${BASE_URL}${endpoint}`;
    
    // Configuración de la cabecera
    const headers = {
        'Content-Type': 'application/json',
    };

    // Configuración de la petición
    const config = {
        method: method,
        headers: headers,
        // IMPORTANTE: Envía y acepta cookies de sesión para la autenticación
        credentials: 'include', 
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, config);

        // Si la respuesta no es OK (ej: 401 Unauthorized, 500 Internal Error)
        if (!response.ok) {
            // Intentar leer el JSON de error del backend (si existe)
            const errorData = await response.json().catch(() => ({ 
                error: response.statusText, 
                message: `Error ${response.status} en la API.` 
            }));

            // Lanza un error con la información útil
            throw new Error(errorData.message || errorData.error);
        }

        // Si la respuesta es 204 No Content (ej: Logout exitoso), devuelve un objeto vacío
        if (response.status === 204) {
            return {};
        }

        // Retorna el cuerpo de la respuesta como JSON
        return await response.json();
    } catch (error) {
        console.error('API Fetch Error:', error);
        // Propaga el error para que el componente React lo maneje
        throw error; 
    }
}

// =========================================================
// Funciones de Acceso Público (Endpoints específicos)
// =========================================================

export const authService = {
    login: (usuario, contrasena) => apiFetch('/api/login', 'POST', { usuario, contrasena }),
    logout: () => apiFetch('/api/logout', 'POST'),
};

export const dashboardService = {
    getDashboard: () => apiFetch('/api/dashboard', 'GET'),
};

export const simulacionService = {
    // Envía la cantidad y fecha para el cálculo ATP
    runSimulacion: (cantidad, fecha) => apiFetch('/api/simulacion', 'POST', { cantidad, fecha }),
};