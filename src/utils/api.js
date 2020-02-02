import axios from 'axios'

const apiCall = ({url, data, method}) =>
    new Promise((resolve, reject) => {
        try {
            console.log("url=" + url + " data=" + JSON.stringify(data) + " method="+ method);
            resolve(
                client({url, data, method})
            );
        } catch (err) {
            reject(new Error(err));
        }
    });

export const client = axios.create({
  baseURL: process.env.VUE_APP_API_URL
});

export default apiCall;
