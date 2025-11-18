import axios from "axios";

export class EnrollmentService {
    async enrollStudentInCourse(courseId) { 
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/enrollments/learners/initiate/${courseId}`, {}, {
                withCredentials: true,
            })
            return response.data;
        } catch(error) {
            if(error.response && error.response.data) {
                throw error.response.data;
            }   
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async getEnrolledCourses() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/enrollments/learners`, {
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

    async getTrainerCourses() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/enrollments/trainers`, {
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

    async isBatchTrainer(batchId) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/enrollments/trainers/batches/${batchId}/is-trainer`, {
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
}

const enrollmentService = new EnrollmentService();
export default enrollmentService;