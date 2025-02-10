import axios from 'axios';
const API = 'https://api-h-series.telecorp.co.th/api'
export const POSTnoAUTH = async (URL: any, data: any) => {
    return axios({
        method: 'POST',
        url: `${API}${URL}`,
        data: data,
        headers: {
            'Content-Type': 'application/json'
        },
    }).then((result) => {
        return result.data

    }).catch(err => {
        console.log(err);
        return { error: err, message: err?.response?.data?.message || "" }
    });
}
export const CreatePost = async (data: { detail: string }) => {
    try {
        const response = await fetch("/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        return await response.json(); // แปลงเป็น JSON
    } catch (error: any) {
        console.error("Error creating post:", error);
        return { success: false, error: error.message };
    }
}