import axios from "axios";
import {
  loadProgressBar
} from "axios-progress-bar";

const theUrl = window.location.hostname;
const instance = axios.create({
  withCredentials: true,
  // baseURL: `https://apirekrutmen.sumbiri.com`,
  baseURL: `http://${theUrl}:5005`,
});

instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
}
);

loadProgressBar(undefined, instance);
export default instance;
