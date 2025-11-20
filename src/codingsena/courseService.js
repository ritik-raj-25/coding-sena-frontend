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

    async createCourse({batchName, validity, startDate, endDate, price, discount, coverPic, curriculum}) {
        try {
            const formData = new FormData();
            formData.append("batchCreateDto", 
                new Blob([JSON.stringify({batchName, validity, startDate, endDate, price, discount})], {"type" : "application/json"})
            );

            if(coverPic && coverPic[0]) {
                formData.append("coverPic", coverPic[0]);
            }

            if(curriculum && curriculum[0]) {
                formData.append("curriculum", curriculum[0]);
            }

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/batches`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });
            return response.data;
        } catch(error) {
            if(error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async getAllCoursesForAdmin(pageNumber, pageSize, sortBy, sortDir) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/batches`, {
                withCredentials: true,
                params: {pageNumber, pageSize, sortBy, sortDir}
            });
            return response.data;
        } catch(error) {
            if(error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async deleteCourse(courseId) {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/batches/de-activate/${courseId}`, {}, {
                withCredentials: true
            });
            return response.data;
        } catch(error) {
            if(error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }
    async restoreCourse(courseId) {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/batches/activate/${courseId}`, {}, {
                withCredentials: true
            });
            return response.data;
        } catch(error) {
            if(error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async updateCourse(courseId, {batchName, validity, startDate, endDate, price, discount, coverPic, curriculum}) {
        try {
            const formData = new FormData();
            formData.append("batchUpdateDto", 
                new Blob([JSON.stringify({batchName, validity, startDate, endDate, price, discount})], {"type" : "application/json"})
            );

            if(coverPic && coverPic[0]) {
                formData.append("coverPic", coverPic[0]);
            }

            if(curriculum && curriculum[0]) {
                formData.append("curriculum", curriculum[0]);
            }

            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/batches/${courseId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });
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