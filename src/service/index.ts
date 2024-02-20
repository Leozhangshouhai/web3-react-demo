import Axios from 'axios';
import { showLoading, hideLoading } from './loading'
import Qs from 'qs'
import { showMessage } from '@/store/globalSlice';
import { store } from '@/store'

let baseURL='https://sepolia.optimism.io/';
  // if (import.meta.env.VITE_ENV != 'development') {
  //   baseURL = '';
  // }
const axiosInstance = Axios.create({
  baseURL,
  timeout: 30000
})

axiosInstance.interceptors.request.use((config: any) => {
  showLoading();
  let activeAccount: string = localStorage.getItem('ACTIVEACCOUNT') || '';
  let SESSION = JSON.parse(localStorage.getItem('SESSION') || '{}');
  if (activeAccount && SESSION[activeAccount]) {
    config.headers['signature'] = SESSION[activeAccount];
    if(config.url.includes('api2')){
      config['data'] = true
      config.headers['Content-Type'] = "application/json;charset=utf-8";
    }
  }
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
  hideLoading();
  return response.data;
}, error => {
  hideLoading()
  switch (error.response.status) {
    case 401:
      const activeAccount = localStorage.getItem('ACTIVEACCOUNT');
      let SESSION = JSON.parse(localStorage.getItem('SESSION') || '{}');
      if (activeAccount && SESSION[activeAccount]) {
        delete SESSION[activeAccount];
        localStorage.setItem('SESSION', JSON.stringify(SESSION));
        window.location.reload();
      }
      break;
    case 502:
      store.dispatch(showMessage('System is updating, please refresh and try again later'));
    default:
      break;
  }
  return Promise.reject(error)
})

export default axiosInstance;
