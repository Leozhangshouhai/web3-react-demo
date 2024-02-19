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
import "./index.less";

// 1. Get projectID at https://cloud.walletconnect.com
const projectId = "otTTT123...";
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
  const [uri, setUri] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const connectWallet = useCallback(() => {
    if (!client) return;
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
          console.log('uri-------',uri)
        }
      });
  }, [client]);
  useEffect(() => {
    AuthClient.init({
      relayUrl:"wss://relay.walletconnect.com",
      projectId:projectId!,
      metadata: {
        name: "react-dapp-auth",
        description: "React Example Dapp for Auth",
        url: window.location.host,
        icons: [],
      },
    })
      .then((authClient) => {
        setClient(authClient);
        setHasInitialized(true);
      })
      .catch(console.error);
  }, []);
  useEffect(() => {
    async function handleOpenModal() {
      if (uri) {
        await web3Modal.openModal({
          uri,
          standaloneChains: ["eip155:1"],
        });
      }
    }
    handleOpenModal();
  }, [uri]);
  const [view, changeView] = useState<"default" | "qr" | "signedIn">("default");
  useEffect(() => {
    if (address) {
      web3Modal.closeModal();
      changeView("signedIn");
    }
  }, [address, changeView]);

  
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
