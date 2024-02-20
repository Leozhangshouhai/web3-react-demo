import React from "react";
import { useEffect, useState } from "react";
import "./index.less"
import TabBar from "@/components/tabbar"
import bg from "@/assets/task-bg.png"
import bgLeft from "@/assets/task-bg-left.png"
import Xicon from "@/assets/xicon.png"
import { useHistory } from 'react-router-dom'
import moment from 'moment';

export default function Home() {
  const history = useHistory();
  const [tableData, setTableData] = useState([
    { text:  moment().format('MM-DD'), index: 0 },
    { text: moment().add(1,'days').format('MM-DD'), index: 1 },
    { text: moment().add(2,'days').format('MM-DD'), index: 2 },
    { text: moment().add(3,'days').format('MM-DD'), index: 3 },
    { text: moment().add(4,'days').format('MM-DD'), index: 4 }, { text: moment().add(5,'days').format('MM-DD'), index: 5 }
    , { text: moment().add(6,'days').format('MM-DD'), index: 6 }, { text: moment().add(7,'days').format('MM-DD'), index: 7 }
  ]);
  const [mediaList, setMediaList] = useState([
    { title: '推特一', desc: '关注指定推特，可获得19Chat',status:0 },
    
  
  ]);

  return (<div className="task-box">
  <div className="top-box">
    <div className="bg-box">
      <div className="header">
        <img src={bgLeft} alt=""  onClick={()=>{history.push("/home")}} />
        <h3 className="name"> 任务中心</h3>
        <span className="bank"></span>
      </div>
    </div>

  </div>
  <div className="bottom-box border-r">
    <div className="sign-box">
      <div className="sign-box-top  border-r">
        <div className="day-box">
          <span>连续签到  <b>0</b> 天</span>
          <span className="btn">签到</span>
        </div>
        <div className="action-box">
          {
            tableData.map((item: { text: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined; }, index: number) => {
              return <div className='item-box' >
                <div className={index == 1 ? 'item-outer item-outer-active' : 'item-outer'}>
                  <div className="item">+1 </div>
                </div>
                <div className="des">{item.text}</div>

              </div>
            })

          }


        </div>
      </div>
      <div className="sign-box-bottom  border-r">
        <div className="sub-title"> 任务二</div>
        <div className="task-line-box">
          {
            mediaList.map((item: { title: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined; desc: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined; })=>{
              return    <div className="line-item">
              <div className="left">
                <img src={Xicon} alt="" />
              </div>
              <div className="middle">
                <div className="title">{item.title}</div>
                <div className="desc">{item.desc}</div>
                 </div>
              <div className="right">
                去完成 </div>
            </div>
            })
          }
       
        </div>
      </div>
    </div>

  </div>
  <TabBar></TabBar>
</div>)
}
