import axios from 'axios'

const apiCall = ({url, data, method}) =>
    new Promise((resolve, reject) => {
        try {
            console.log("url=" + url + " data=" + JSON.stringify(data) + " method="+ method);
            resolve(
                client({url, data, method})
            );
            // console.log(`Mocked '${url}' - ${method || "GET"}`);
            // console.log("response: ", mocks[url][method || "GET"]);
        } catch (err) {
            reject(new Error(err));
        }
    });

export const client = axios.create({
  baseURL: 'http://localhost:8080/'
});

export default apiCall;
