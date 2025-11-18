import axios from 'axios';

export class AuthService {
    async login({email, password}) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, { email, password }, { withCredentials: true });
            return response.data;
        } catch (error) {
            if(error.response && error.response.data) {
                throw error.response.data;
            }
            else {
                throw { message: 'Network error, please try again after some time.' };
            }
        }
    }

    async logout() {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    async getCurrentUser() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, { withCredentials: true });
            return response.data;
        } catch (error) {
            if(error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }
}

const authService = new AuthService();
export default authService;