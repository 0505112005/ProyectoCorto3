const login = async (credentials) => {
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
            credentials: 'include' // This enables sending cookies
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al iniciar sesión');
        }

        if (!data.token) {
            throw new Error('No se recibió el token de autenticación');
        }

        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        return true;
    } catch (error) {
        console.error('Login error:', error);
        throw new Error(error.message || 'Error al iniciar sesión');
    }
};