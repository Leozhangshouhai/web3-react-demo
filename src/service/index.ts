import Axios from 'axios';
// import { showLoading, hideLoading } from './loading'
import { message } from 'antd';
// @ts-ignore  
import Qs from 'qs'

let baseURL='';
let loadingKey="loadingKey"
  // if (import.meta.env.VITE_ENV != 'development') {
  //   baseURL = '';
  // }
const axiosInstance = Axios.create({
  baseURL,
  timeout: 30000
})

axiosInstance.interceptors.request.use((config: any) => {
  message.loading({
    content:'loading...',
    key:loadingKey,
    duration:0
  });

  if( localStorage.getItem('signature')){
    config.headers['signature'] = localStorage.getItem('signature');
  }
  config.headers['type'] = '0';
  config.headers['Content-Type'] = "application/json;charset=utf-8";

  if (config.method === 'get' && config.params) {
    const params = Qs.stringify(config.params, { arrayFormat: 'brackets', allowDots: true });
    config.url = `${config.url}?${params}`;
    config.params = null;
  }
  return config;
}, error => {
  return Promise.reject(error)
})


axiosInstance.interceptors.response.use(response => {
  message.destroy(loadingKey);
  return response.data;
}, error => {
  message.destroy(loadingKey)
 
  return Promise.reject(error)
})

export default axiosInstance;
