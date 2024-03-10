import home0 from "@/assets/home-0.png"
import home1 from "@/assets/home-1.png"
import task0 from "@/assets/task-0.png"
import task1 from "@/assets/task-1.png"
import { useTranslation } from 'react-i18next';
import "./index.less"
import { useHistory,useLocation } from 'react-router-dom'
export default function tabBar(){
  const { t } = useTranslation()
  const history = useHistory();
  const location =useLocation();
  const isActiveTask =!! (location.pathname && location.pathname.includes('task'));
  console.log('location--',location)
  return  (
    <div className="tabbar-container">
    <div className="bar-box">
      <div className={`left item ${ isActiveTask ?'':'item-active'}`}  onClick={() => { history.push('/home') }} >  
      <img src={  isActiveTask ? home0 :home1} alt="" />
        <div className="name">{t('首页')}</div>
      </div>
      <div className={`right item ${ !isActiveTask ?'':'item-active'}`}  onClick={() => { history.push('/task') }}> 
        <img src={ isActiveTask ? task1 :task0} alt="" />
        <div className="name">{t('任务')}</div>
       </div>
    </div>
    </div>
  )
}