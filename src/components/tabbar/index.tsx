import home0 from "@/assets/home-0.png"
import home1 from "@/assets/home-1.png"
import task0 from "@/assets/task-0.png"
import task1 from "@/assets/task-1.png"
import "./index.less"
export default function tabBar(){
  return  (
    <div className="tabbar-container">
    <div className="bar-box">
      <div className="left item">  
      <img src={home0} alt="" />
        <div className="name">首页</div>
      </div>
      <div className="right item"> 
        <img src={task0} alt="" />
        <div className="name">  任务</div>
       </div>
    </div>
    </div>
  )
}