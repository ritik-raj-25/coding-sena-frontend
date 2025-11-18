import axios from "axios";

class TestService {

    async getAllActiveTestsByBatchId(batchId) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tests/batches/${batchId}/active`, {
                withCredentials: true,
            })
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async getRemainingAttemptsByTestId(testId) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/attempts/tests/${testId}/remaining-attempts`, {
                withCredentials: true,
            })
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async getTestById(testId) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tests/${testId}`, {
                withCredentials: true,
            })
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async getAllAttemptsByTestId(testId) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/attempts/tests/${testId}`, {
                withCredentials: true,
            })
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async startTest(testId) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/attempts/start/tests/${testId}`, {}, {
                withCredentials: true,
            })
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async submitTestAttempt(attemptId) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/attempts/submit/tests/${attemptId}`, {}, {
                withCredentials: true,
            })
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async saveMCQAnswer(attemptId, mcqId, { selectedOption }) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/attempts/${attemptId}/mcqs/${mcqId}/save`,
                { selectedOption },
                { withCredentials: true }
            )
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async getMCQsByTestId(testId) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/mcqs/tests/${testId}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async generateMCQsForTest(testId, payload) {
        try {
            const params = {
                noOfMCQs: payload.numberOfMCQs,
                topics: payload.topics,
            };

            if (payload.userInstructionMessage?.trim()) {
                params.userInstructionMessage = payload.userInstructionMessage;
            }

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/mcqs/generate-mcqs/tests/${testId}`,
                {},
                {
                    params,            
                    withCredentials: true
                }
            );

            return response.data;

        } catch (error) {
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }


    async getAiSuggestions(attemptId) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/attempts/${attemptId}/ai-suggestion`, { withCredentials: true });
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async getAllTestsByBatchId(batchId) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tests/batches/${batchId}`, {
                withCredentials: true,
            })
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async deleteTest(testId) {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/tests/${testId}/soft-delete`, {
                withCredentials: true,
            })
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async updateTest(testId, payload) {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/tests/${testId}/update`,
                payload,
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

    async addTest(batchId, payload) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/tests/batches/${batchId}`,
                payload,
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

    async getAllMCQsOfTestAdminAndTrainer(testId) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/mcqs/tests/${testId}/admin-trainer`, {
                withCredentials: true,
            })
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: 'Network error, please try again after some time.' };
        }
    }

    async updateMCQ(mcqId, payload) {
        try {
            const response = await axios.patch(`/api/mcqs/${mcqId}`,
                payload,
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

    async getTestReport(testId) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/attempts/tests/${testId}/report`, {
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

const testService = new TestService();
export default testService;