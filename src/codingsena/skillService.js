import axios from 'axios';

export class SkillService {
    async getSkills() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/skills`, { withCredentials: true });
            return response.data;
        } catch (err) {
            console.error("Failed to fetch skills", err);
            throw { message: 'Could not fetch skills' };
        }
    }

    async createSkill(skillData) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/skills`, skillData, { withCredentials: true });
            return response.data;
        }
        catch(err) {
            if(err.response && err.response.data) {
                throw err.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }
}

const skillService = new SkillService();
export default skillService;
