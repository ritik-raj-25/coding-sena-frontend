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
}

const skillService = new SkillService();
export default skillService;
