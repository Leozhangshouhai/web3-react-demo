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
import { projectId, metadata, relayUrl, messageKey } from "@/constants/env"
import SignClient from "@walletconnect/sign-client"
import axiosInstance from "@/service";
import { userinfoApi, tokenPriceApi } from "@/service/api"
import "./index.less";
import { message } from 'antd';
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


  const info = () => {
    console.log('333-----1231')
    message.info('Hello, Ant Design!');
  };
  const [client, setClient] = useState<AuthClient | null>();
  const [hasInitialized, setHasInitialized] = useState(false);
  const [clickWalletIng, setClickWalletIng] = useState(false);
  const [ethNumber, setEthNumber] = useState<string | number>(0);
  const [chatNumber, setChatNumber] = useState<string | number>(0);
  const [coefficient, setCoefficient] = useState<string | number>(0)
  const [userInfo, setUserInfo] = useState(  window.userInfo|| {})
  const [uri, setUri] = useState<string>("");
  const [address, setAddress] = useState<string>(window.userAddress || '');
  const [signClient, setSignClient] = useState<SignClient | null>();
  //  初始化链接钱包
  useEffect(() => {
    // showLoading();
    // message.loading({
    //   content: '钱包初始化...',
    //   key: 'init111',
    //   duration: 0
    // })
    setClickWalletIng(true)
    SignClient.init({
      projectId,
      // optional parameters
      relayUrl,
      metadata,
    })
      .then((signClient) => {
        setSignClient(signClient);
        message.destroy()
        message.success({
          content: '初始化成功...',
          duration: 1
        });
        setClickWalletIng(false)

      })
      .catch(console.error);
  }, []);

  const getUserInfo = async () => {
    const result = await axiosInstance.get(userinfoApi).catch(e => {
      console.log('----eeeeeeee333---', e)
    });
    console.log('----eeeeeeee333--resultresult-', result)
    window.userInfo = result.data;
    setUserInfo(result.data)
    localStorage.setItem('userInfo', JSON.stringify(result.data))
  }
  const getTokenPrice = async()=>{
    const result = await axiosInstance.get(tokenPriceApi).catch(e => {
      console.log('----eeeeeeee333---', e)
    });
    console.log('----eeegetTokenPricegetTokenPriceeeeee333---', result)
    setCoefficient(result?.data?.unitPrice)
  }
  useEffect(()=>{
    console.log('----eeeeeeee333-3333333--')
    getTokenPrice()
  },[userInfo])
  const changeValueBy = (value: any, isUSDT = false) => {
    isUSDT ? setChatNumber(Number(value / coefficient ).toFixed(4)) : setEthNumber(Number(value * coefficient).toFixed(4))
  }
  const signAction = async () => {
    if (!signClient) return;
    try {
      const { uri, approval } = await signClient.connect({
        // Optionally: pass a known prior pairing (e.g. from `signClient.core.pairing.getPairings()`) to skip the `uri` step.
        // pairingTopic: "pairing?.topic",
        // Provide the namespaces and chains (e.g. `eip155` for EVM-based chains) we want to use in this session.
        requiredNamespaces: {
          eip155: {
            methods: [
              "eth_sendTransaction",
              "eth_signTransaction",
              "eth_sign",
              "personal_sign",
              "eth_signTypedData",
            ],
            chains: ["eip155:1"],
            events: ["chainChanged", "accountsChanged"],
          },
        },
      });
      // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
      if (uri) {
        await web3Modal.openModal({
          uri,
        });

        const session = await approval();
        // Handle the returned session (e.g. update UI to "connected" state).
        // * You will need to create this function *
        console.log("session-----", session);
        const accounts = session.namespaces.eip155.accounts;
        const account = accounts[0];
        setAddress(account);
        window.userAddress = account;
        const result: any = await signClient.request({
          topic: session.topic,
          chainId: "eip155:1",
          request: {
            method: "personal_sign",
            params: [messageKey, account],
          },
        });
        localStorage.setItem('signature', result)
        message.success('签名成功')
        getUserInfo();
        getTokenPrice();
        web3Modal.closeModal();
      }
    } catch (e) {
      console.error(e);
    }

  }

  // const connectWallet = useCallback(() => {
  //   if(clickWalletIng)return
  //   if (!client) return;

  //   setClickWalletIng(true)
  //   client
  //     .request({
  //       aud: window.location.href,
  //       domain: window.location.hostname.split(".").slice(-2).join("."),
  //       chainId: "eip155:1",
  //       type: "eip4361",
  //       nonce: generateNonce(),
  //       statement: "Sign in with wallet.",
  //     })
  //     .then(({ uri }) => {
  //       if (uri) {
  //         console.log('uri-------',uri);
  //         setUri(uri)
  //       }
  //     });
  // }, [client]);
  // useEffect(() => {
  //   AuthClient.init({
  //     relayUrl,
  //     projectId:projectId!,
  //     metadata,
  //   })
  //     .then((authClient) => {
  //       console.log('----2223333333---------',authClient)
  //       setClient(authClient);
  //     })
  //     .catch(console.error);
  // }, []);
  // useEffect(() => {
  //   async function handleOpenModal() {
  //     if (uri) {
  //       console.log('uriuriuri-----',uri)
  //       await web3Modal.openModal({
  //         uri,
  //         standaloneChains: ["eip155:1"],
  //       });
  //       setClickWalletIng(false)
  //     }
  //   }
  //   handleOpenModal();
  // }, [uri]);
  // const [view, changeView] = useState<"default" | "qr" | "signedIn">("default");
  // useEffect(() => {
  //     console.log('addressaddressaddress',address)
  //   if (address) {
  //     window.userAddress=address
  //     web3Modal.closeModal();
  //     changeView("signedIn");
  //   }
  // }, [address, changeView]);
  // useEffect(() => {
  //   if (!client) return;
  //   client.on("auth_response", ({ params }) => {
  //     if ("code" in params) {
  //       console.error(params);
  //       return web3Modal.closeModal();
  //     }
  //     if ("error" in params) {
  //       console.error(params.error);
  //       if ("message" in params.error) {
  //         // toast({
  //         //   status: "error",
  //         //   title: params.error.message,
  //         // });
  //       }
  //       return web3Modal.closeModal();
  //     }
  //     // toast({
  //     //   status: "success",
  //     //   title: "Auth request successfully approved",
  //     //   colorScheme: "whatsapp",
  //     // });
  //     console.log('paramsparamsparams', params)
  //     setAddress(params.result.p.iss.split(":")[4]);
  //   });
  // }, [client]);


  return (
    <div className="home-box">
      <div className="top-box">
        <div className="header-box">
          <span className="title" onClick={info}>
            签名HOME</span>
          <span className={`wallet-box  ${clickWalletIng ? ' isConnecting' : ''}`} onClick={() => {
            if (!address) {
              signAction()
            }
          }}>
            <img
              draggable="false"
              className="left-icon"
              src={walletIcon}
              alt=""
            />
            <span className="text">{address ? `${address.slice(0, 4)}....${address.slice(-4)}` : 'login'}</span>
          </span>
        </div>
        <div className="banner-box">
          <div className="banner-box-1">
            <div className="des">当前价格</div>
            <div className="price">1U = { Number(coefficient).toFixed(2)} CHAT</div>
            <div className="btn-box">查看K线</div>
          </div>
          <div
            className="banner-box-2"
            onClick={() => {
              history.push("/task");
            }}
          >
            <img src={bgWhole} alt="" className="bg" />

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
              {/* <img src={downAr} alt="" className="icon-down" /> */}
            </div>
            <div className="desc">Chat</div>
          </div>
          <div className="right">
            <input
              className="value"
              value={chatNumber}
              onChange={(e) => {
                setChatNumber(e.target.value);
                changeValueBy(e.target.value, false)
              }
              }
              type="text"
            />
          </div>
        </div>
        <div className="icon-item-box no-bottom">
          <img src={ethIcon} alt="" className="left-icon" />
          <div className="middle-box">
            <div className="name">
              <span>USDT</span>
              {/* <img src={downAr} alt="" className="icon-down" /> */}
            </div>
            <div className="desc">USDT</div>
          </div>
          <div className="right">
            <input
              className="value"
              value={ethNumber}
              onChange={(e) => {
                setEthNumber(e.target.value)
                changeValueBy(e.target.value, true)
              }}
              type="text"
            />

          </div>
        </div>

        <div className="footer-box">
          <div className="footer-btn">兑换</div>
        </div>
      </div>

      <TabBar></TabBar>
    </div>
  );
}
