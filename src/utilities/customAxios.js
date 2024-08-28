// utils/customAxios.js
import axios from 'axios';

const customAxios = axios.create({
  baseURL: 'https://cors-anywhere.herokuapp.com/http://41.211.108.123:4053/apiasac/pooltpv/api/save/',
  headers: {
    'Content-Type': 'application/json',
  },
  method: 'get', // Default method
});

// Add a request interceptor to handle the GET request with a body
customAxios.interceptors.request.use(config => {
  if (config.method.toLowerCase() === 'get' && config.data) {
    // Customize the adapter to include the body
    config.adapter = async (config) => {
      return new Promise((resolve, reject) => {
        const { data, headers, method, url } = config;

        const xhr = new XMLHttpRequest();
        xhr.open(method.toUpperCase(), url, true);

        Object.keys(headers).forEach(key => {
          xhr.setRequestHeader(key, headers[key]);
        });

        xhr.onload = () => {
          resolve({
            data: JSON.parse(xhr.responseText),
            status: xhr.status,
            statusText: xhr.statusText,
            headers: xhr.getAllResponseHeaders(),
            config,
            request: xhr,
          });
        };

        xhr.onerror = () => {
          reject(new Error('Network Error'));
        };

        xhr.send(data ? JSON.stringify(data) : null);
      });
    };
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default customAxios;
