import walletIcon from "@/assets/wallet.png";
import bgWhole from "@/assets/banner-2-whole.png";
import downAr from "@/assets/down.png";
import ethIcon from "@/assets/eth.png";
import chatIcon from "@/assets/chat.png";
import TabBar from "@/components/tabbar";
import { useHistory } from "react-router-dom";
  import WalletConnect from "@walletconnect/client";


  import QRCodeModal from "@walletconnect/qrcode-modal";

import "./index.less";

export default function Home() {
  const history = useHistory();

  const connectWallet = async () => {
    console.log('33333----333')
    // 初始化WalletConnectProvider
    let connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
    })
    console.log('33333----333connectorconnector',connector)
    connector.on("connect", (error, payload) => {
      // 链接
      if (error) {
        throw error;
      }

      // Get provided accounts and chainId
      console.log('connecpayloadpayloadpayloadpayloadpayloadpayloadpayload')
      console.log(payload)
      // address = ...

      // Tip localstorage will add walletconnect
    });

    connector.on("session_update", (error, payload) => {
      // 更新
      if (error) {
        throw error;
      }

      // Get updated accounts and chainId
      console.log('session_updatesession_updatesession_updatesession_updatesession_updatesession_updatesession_update')
      console.log(payload)
    });

    connector.on("session_request", (error, payload) => {
      // 请求
      if (error) {
        throw error;
      }

      // Get updated accounts and chainId
      console.log('session_requestsession_requestsession_requestsession_requestsession_request')
      console.log(payload)
    });

    connector.on("wc_sessionRequest", (error, payload) => {
      if (error) {
        throw error;
      }

      // Get updated accounts and chainId
      console.log('wc_sessionRequestwc_sessionRequestwc_sessionRequestwc_sessionRequestwc_sessionRequest')
      console.log(payload)
    });

    connector.on("wc_sessionUpdate", (error, payload) => {
      if (error) {
        throw error;
      }

      // Get updated accounts and chainId
      console.log('wc_sessionUpdatewc_sessionUpdatewc_sessionUpdatewc_sessionUpdatewc_sessionUpdate')
      console.log(payload)
    });

    connector.on("call_request", (error, payload) => {
      if (error) {
        throw error;
      }

      // Get updated accounts and chainId
      console.log('call_request')
      console.log(payload)
    });

    connector.on("disconnect", (error, payload) => {
      // 断开
      if (error) {
        throw error;
      }

      // Delete connector
      console.log('Delete connector')
      console.log(payload)
    });
    // 触发链接
    if (!connector.connected) {
      // create new session
      await connector.createSession();
    }

  };
  const connectWallet2= async()=>{
    const bridge = "https://bridge.walletconnect.org";
    console.log('3333222223bridgebridge---',bridge)
    // create new connector
    const connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });

    console.log('3333331119999999999-',connector)
    // check if already connected
    if (!connector.connected) {
      // create new session
      await connector.createSession();
    }
  }
  
  return (
    <div className="home-box">
      <div className="top-box">
        <div className="header-box">
          <span className="title"> HOME</span>
          <span className="wallet-box" onClick={() => { connectWallet() }}>
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
            <div className="btn-box">查看K线</div>
          </div>
          <div
            className="banner-box-2"
            onClick={() => {
              history.push("/task");
            }}
          >
            <img src={bgWhole} alt="" className="bg" />
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
            <div className="desc">Chat</div>
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
            <div className="desc">Etherium</div>
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
