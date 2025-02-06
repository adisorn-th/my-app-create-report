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