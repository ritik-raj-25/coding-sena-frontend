import axios from "axios";

export class StudyMaterialService {
    async getStudyMaterialsByBatchIdAndTopicId(batchId, topicId) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/study-materials/batches/${batchId}/topics/${topicId}`, {
                withCredentials: true,
            })
            return response.data;
        } catch (error) {
            if(error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async deleteStudyMaterial(materialId, batchId) {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/study-materials/${materialId}/batches/${batchId}/remove`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async addStudyMaterial({ title, url, type, topicId, courseId }) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/study-materials/batches/${courseId}/topics/${topicId}`,
                {title, materialType: type, url},
                {withCredentials: true,}
            )
            return response.data;
        } catch(error) {
            if(error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
        
    }

    async updateStudyMaterial(materialId, { title, url, type }) {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/study-materials/${materialId}/update`,
                { title, materialType: type, url },
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
}

const studyMaterialService = new StudyMaterialService();
export default studyMaterialService;