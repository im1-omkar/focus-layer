import axios from "axios";

interface Log {
    ritualId: number;
    date: string;
    score: number;
}

type PostHandlerInterface =
    | {
        ritualId: number;
        date: string;
        score: number;
    }
    | {
        logs: Log[];
    };

export const postLogsHandler = async (
    params: PostHandlerInterface
) => {
    try{
        const token = localStorage.getItem("token");

        const response = await axios.post(
            "http://localhost:3000/api/logs",
            params,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    }
    catch(err){
        if(err instanceof Error){
            console.log(err.message)
            return;
        }
    }
};


export const getActiveLogs = async ()=>{

    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
            "http://localhost:3000/api/logs/active",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log(response.data);
        return response.data;
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
            return;
        }
    }

}

export const getHeatMapLogs = async()=>{

    try{
        const token = localStorage.getItem("token");

        const response = await axios.get(
            "http://localhost:3000/api/logs/heatmap",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log(response.data);
        return response.data;
    }
    catch(err){
        if(err instanceof Error){
            console.log(err.message);
            return;
        }
    }

}