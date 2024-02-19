import walletIcon from "@/assets/wallet.png";
import bgWhole from "@/assets/banner-2-whole.png"
import downAr from "@/assets/down.png"
import ethIcon from "@/assets/eth.png"
import chatIcon from "@/assets/chat.png"
import TabBar from "@/components/tabbar"
// import { useNavigate } from 'react-router-dom';
import "./index.less";

export default function Home() {
  // const Navigate = useNavigate();
  return (
    <div className="home-box">
     <div className="top-box">
     <div className="header-box">
        <span className="title"> HOME</span>
        <span className="wallet-box">
          <img
            draggable="false"
            className="left-icon"
            src={walletIcon}
            alt=""
          />
          <span className="text">login</span>
        </span>
      </div>
      <div className="banner-box">
        <div className="banner-box-1">
          <div className="des">当前价格</div>
          <div className="price">1U = 7.12CHAT</div>
          <div className="btn-box">
            查看K线
          </div>
        </div>
        <div className="banner-box-2">
          <img src={bgWhole} alt="" className="bg"  />
          {/* <img src="" alt=""  className="left-1"/>
              <span>做任务免费领取Chat</span>
              <img src="" alt="" className="right-1" /> */}
        </div>
      </div>
      <div className="body-box">
        <div className="sub-title">购买代币</div>
       
       

      </div>
     </div>
     
      <div className="icons-box">
          <div className="icon-item-box">
            <img src={chatIcon} alt="" className="left-icon" />
            <div className="middle-box">
              <div className="name">
                <span>Chat</span>
                <img src={downAr} alt="" className="icon-down" />
              </div>
              <div className="desc">
                Chat
              </div>

            </div>
            <div className="right">12,000</div>
          </div>
          <div className="icon-item-box no-bottom">
            <img src={ethIcon} alt="" className="left-icon" />
            <div className="middle-box">
              <div className="name">
                <span>ETH</span>
                <img src={downAr} alt="" className="icon-down" />
              </div>
              <div className="desc">
                Etherium
              </div>

            </div>
            <div className="right">0.001502</div>
          </div>

          <div className="footer-box">
        <div className="footer-btn">兑换</div>
      </div>


        </div>
   
      <TabBar></TabBar>

    </div>
  );
}
