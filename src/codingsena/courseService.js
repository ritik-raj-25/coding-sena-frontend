import axios from "axios";

export class CourseService {
    async getAllActiveCourses(pageNumber, pageSize, sortBy, sortDir) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/batches`, {
                withCredentials: true,
                params: {pageNumber, pageSize, sortBy, sortDir}
            })
            return response.data;
        } catch(error) {
            if(error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async searchCourseByName(keyword, sortBy, sortDir, pageNumber, pageSize) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/batches/search`, {
                withCredentials: true,
                params: {keyword, sortBy, sortDir, pageNumber, pageSize}
            })
            return response.data;
        } catch(error) {
            if(error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async getCourseById(courseId) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/batches/${courseId}`, {
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
}

const courseService = new CourseService();
export default courseService;