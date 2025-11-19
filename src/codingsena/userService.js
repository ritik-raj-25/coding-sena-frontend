import axios from 'axios';

export class UserService {
    async registerUser({ name, email, dob, location, college, password, nickName, skills, profilePic }) {
        try {
            // Create FormData for multipart/form-data
            const formData = new FormData();
            
            // Append JSON data as Blob
            formData.append(
                "userDetails",
                new Blob([JSON.stringify({ name, email, dob, location, college, password, nickName, skills })], { type: "application/json" })
            );

            // Append file if provided
            if (profilePic && profilePic[0]) {
                formData.append("profilePic", profilePic[0]);
            }

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });

            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }
    
    async updateUserProfile({ name, dob, location, college, password, nickName, skills, profilePic }) {
        try {
            const formData = new FormData();

            formData.append(
                "userDetails",
                new Blob([JSON.stringify({name, dob, location, college, password, nickName, skills, profilePic})], {"type" : "application/json"})
            )
            
            if (profilePic && profilePic[0]) {
                formData.append("profilePic", profilePic[0]);
            }

            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/users`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });

            return response.data;
        }
        catch (error) {
            if(error.response && error.response.data) {
                console.log(error.response.data);
                console.log(error);
                
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }
    
    async getUserProfile() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async deactivateAccount() {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/users/de-activate`, {}, {
                withCredentials: true
            })
            return response.data;
        }catch(error) {
            if(error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async restoreAccount({email, password}) {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/users/activate`, {email, password}, {
                withCredentials: true
            });
            return response.data;
        }catch(error) {
            if(error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async verifyEmail(token) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify`, {
                params: { token },
                withCredentials: true
            });
            return response.data;
        }catch (error) {
            if(error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
        
    }
    async resendVerificationEmail({email}) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/token`,
                {email},
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            if(error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }
}

const userService = new UserService();
export default userService;