import Axios from 'axios';
// import { showLoading, hideLoading } from './loading'
import { message } from 'antd';
// @ts-ignore  
import Qs from 'qs'
import { showMessage } from '@/store/globalSlice';
import { store } from '@/store'

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
  switch (error?.response?.status) {
    case 401:
     
      break;
    case 502:
      store.dispatch(showMessage('System is updating, please refresh and try again later'));
    default:
      break;
  }
  return Promise.reject(error)
})

export default axiosInstance;
