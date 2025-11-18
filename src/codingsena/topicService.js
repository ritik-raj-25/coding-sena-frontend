import axios from "axios";

export class TopicService {

    async getTopicsByCourseId(courseId) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/topics/batches/${courseId}`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            if(error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' }; 
        }
    }

    async addTopic({name, courseId}) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/topics/batches/${courseId}`, 
                { name },
                { withCredentials: true}
            );
            return response.data;
        } catch (error) {
            if(error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' }; 
        }
    }

    async updateTopic(topicId, courseId, {name}) {
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/topics/${topicId}/batches/${courseId}/update`, 
                {name},
                {withCredentials: true}
            );
            return response.data;
        } catch(error) {
            if(error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' }; 
        }
    }

    async deleteTopic(topicId, courseId) {
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/topics/${topicId}/batches/${courseId}/remove`,
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

const topicService = new TopicService();
export default topicService;