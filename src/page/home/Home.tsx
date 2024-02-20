import walletIcon from "@/assets/wallet.png";
import bgWhole from "@/assets/banner-2-whole.png";
import downAr from "@/assets/down.png";
import ethIcon from "@/assets/eth.png";
import chatIcon from "@/assets/chat.png";
import TabBar from "@/components/tabbar";
import { useHistory } from "react-router-dom";
import AuthClient, { generateNonce } from "@walletconnect/auth-client";
import { useCallback, useEffect, useState } from "react";
import { Web3Modal } from "@web3modal/standalone";
import {projectId,metadata,relayUrl} from "@/constants/env"

import "./index.less";

// 1. Get projectID at https://cloud.walletconnect.com
// 项目ID

if (!projectId) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}


// 2. Configure web3Modal
const web3Modal = new Web3Modal({
  projectId,
  walletConnectVersion: 2,
});
export default function Home() {
  const history = useHistory();

  const [client, setClient] = useState<AuthClient | null>();
  const [hasInitialized, setHasInitialized] = useState(false);
  const [clickWalletIng, setClickWalletIng] = useState(false);
  const [uri, setUri] = useState<string>("");
  const [address, setAddress] = useState<string>(window.userAddress||'');
  const connectWallet = useCallback(() => {
    if(clickWalletIng)return
    if (!client) return;
    
    setClickWalletIng(true)
    client
      .request({
        aud: window.location.href,
        domain: window.location.hostname.split(".").slice(-2).join("."),
        chainId: "eip155:1",
        type: "eip4361",
        nonce: generateNonce(),
        statement: "Sign in with wallet.",
      })
      .then(({ uri }) => {
        if (uri) {
          console.log('uri-------',uri);
          setUri(uri)
        }
      });
  }, [client]);
  useEffect(() => {
    AuthClient.init({
      relayUrl,
      projectId:projectId!,
      metadata,
    })
      .then((authClient) => {
        console.log('----2223333333---------',authClient)
        setClient(authClient);
      })
      .catch(console.error);
  }, []);
  useEffect(() => {
    async function handleOpenModal() {
      if (uri) {
        console.log('uriuriuri-----',uri)
        await web3Modal.openModal({
          uri,
          standaloneChains: ["eip155:1"],
        });
        setClickWalletIng(false)
      }
    }
    handleOpenModal();
  }, [uri]);
  const [view, changeView] = useState<"default" | "qr" | "signedIn">("default");
  useEffect(() => {
      console.log('addressaddressaddress',address)
    if (address) {
      window.userAddress=address
      web3Modal.closeModal();
      changeView("signedIn");
    }
  }, [address, changeView]);
  useEffect(() => {
    if (!client) return;
    client.on("auth_response", ({ params }) => {
      if ("code" in params) {
        console.error(params);
        return web3Modal.closeModal();
      }
      if ("error" in params) {
        console.error(params.error);
        if ("message" in params.error) {
          // toast({
          //   status: "error",
          //   title: params.error.message,
          // });
        }
        return web3Modal.closeModal();
      }
      // toast({
      //   status: "success",
      //   title: "Auth request successfully approved",
      //   colorScheme: "whatsapp",
      // });
      console.log('paramsparamsparams',params)
      setAddress(params.result.p.iss.split(":")[4]);
    });
  }, [client]);

  
  return (
    <div className="home-box">
      <div className="top-box">
        <div className="header-box">
          <span className="title" > 签名HOME</span>
          <span className={`wallet-box  ${clickWalletIng ?' isConnecting' :''}`} onClick={() => { 
            if(!address){
              connectWallet() 
            }
           }}>
            <img
              draggable="false"
              className="left-icon"
              src={walletIcon}
              alt=""
            />
            <span className="text">{ address ?  `${address.slice(0,4)}....${address.slice(-4)}`:'login'}</span>
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
