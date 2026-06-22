import axios from "axios";

const API_URL = "http://localhost:3000/api/rituals";

const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`
});

export const getRituals = async () => {
    try {
        const response = await axios.get(API_URL, {
            headers: getAuthHeader()
        });

        return response.data;
    } catch (err) {
        console.error("Error getting rituals", err);
        throw err;
    }
};

export const postRituals = async (title: string) => {
    try {
        const response = await axios.post(
            API_URL,
            { title },
            {
                headers: getAuthHeader()
            }
        );

        return response.data;
    } catch (err) {
        console.error("Error creating ritual", err);
        throw err;
    }
};

export const deleteRituals = async (ritualId: string) => {
    try {
        const response = await axios.delete(
            `${API_URL}/${ritualId}`,
            {
                headers: getAuthHeader()
            }
        );

        return response.data;
    } catch (err) {
        console.error("Error deleting ritual", err);
        throw err;
    }
};

export const changeActiveRitual = async (
    ritualId: string,
    isActive: boolean
) => {
    try {
        const response = await axios.patch(
            `${API_URL}/${ritualId}/active`,
            { isActive },
            {
                headers: getAuthHeader()
            }
        );

        return response.data;
    } catch (err) {
        console.error("Error updating ritual", err);
        throw err;
    }
};