declare const window: any;
import walletIcon from "@/assets/wallet.png";
import bgWhole from "@/assets/banner-bg.png";
import arrow from "@/assets/arrow-down.svg";
import frame from "@/assets/Frame.svg";
import ethIcon from "@/assets/eth.png";
import chatIcon from "@/assets/chat.png";
import TabBar from "@/components/tabbar";
import { useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';
// import AuthClient, { generateNonce } from "@walletconnect/auth-client";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "@/service";
import { userinfoApi, tokenPriceApi, transInfoApi } from "@/service/api"
import "./index.less";
import { message } from 'antd';
import { Op_Contract_Address } from "@/constants/env"
import { callContractMethod, initProvider, initWeb3Connect, signSignature, ercTokenContractInstance } from "@/service/callContract"
// 1. Get projectID at https://cloud.walletconnect.com
// 项目ID

const Language = [
  {
    key: "en",
    value: "English",
  },
  {
    key: "hangugeo",
    value: "한국어",
  },
  {
    key: "cn",
    value: "中文",
  },
]

export default function Home() {
  const { t, i18n } = useTranslation();
  const history = useHistory();

  const [clickWalletIng, setClickWalletIng] = useState(false);
  const [usdtNumber, setUsdtNumber] = useState(0);
  const [chatNumber, setChatNumber] = useState(0);
  const [coefficient, setCoefficient] = useState(0)
  const [userInfo, setUserInfo] = useState(window.userInfo || {})
  const [address, setAddress] = useState<string>(window.userAddress || '');
  const [webContractInstance, setWebContractInstance] = useState<any>()
  const initFn = async () => {
    setClickWalletIng(!(!!window.$$provider))
    await initProvider(t);
    setClickWalletIng(false)

  }
  //  初始化链接钱包
  useEffect(() => {
    initFn();
  }, []);

  const getUserInfo = async () => {
    const result: any = await axiosInstance.get(userinfoApi).catch(e => {
      console.log('----eeeeeeee333---', e)
    });
    console.log('----eeeeeeee333--resultresult-', result)
    window.userInfo = result.data;
    setUserInfo(result.data)
    localStorage.setItem('userInfo', JSON.stringify(result.data))
  }
  const getTransInfo = async () => {
    const result = await axiosInstance.post(transInfoApi, {
      num: chatNumber
    }).catch(e => {
      console.log("-----3-33333", result)
    })
    if (!result) return null
    return result;
  }
  const getTokenPrice = async () => {
    const result = await axiosInstance.get(tokenPriceApi).catch(e => {
      console.log('----eeeeeeee333---', e)
    });
    console.log('----eeegetTokenPricegetTokenPriceeeeee333---', result)
    setCoefficient(result?.data?.unitPrice)
  }
  useEffect(() => {
    console.log('----eeeeeeee333-3333333--')
    getTokenPrice()
  }, [])
  const changeValueBy = (value: any, isUSDT = false) => {
    isUSDT ? setChatNumber(+Number(value / coefficient).toFixed(4)) : setUsdtNumber(+Number(value * coefficient).toFixed(4))
  }
  //  签名[]
  const signAction = async () => {
    const { address, web3 } = await initWeb3Connect(t);
    setWebContractInstance({
      contractInstance: callContractMethod(t),
      tokenContractInstance: ercTokenContractInstance(t),
      web3
    })

    const signature = await signSignature(address, t);
    console.log('signaturesignature', signature)
    if (signature) {
      setAddress(address);
      localStorage.setItem('signature', signature)
      message.success(t('签名成功'));
      getUserInfo();
    }

  }
  const exchangeChatCoin = async () => {
    const result: any = await getTransInfo();
    const { num, signature, timestamp, totalPrice, unitPrice } = result.data;
    console.log("22--", signature)
    // webContractInstance.web3.utils.toWei('3400', 'ether')
    await webContractInstance.tokenContractInstance.methods.approve(Op_Contract_Address, totalPrice).send({ from: address })

     if( webContractInstance.contractInstance){
      message.loading(t('等待钱包确认'))
      webContractInstance.contractInstance.methods.exchange(num, unitPrice, totalPrice, timestamp, Buffer.from(signature, 'hex')).send({ from: address })
      .then(function (result: any) {
        console.log("方法调用结果：", result);
        message.success(t('兑换成功'))
      })
      .catch(function (error: any) {
        console.error("调用方法时出错：", error);
        message.error(error)
      });
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


  const [ toggle, setToggle ] = useState(false)
  const changeLanguage = (lng: string) => {
    console.log(lng)
    i18n.changeLanguage(lng);
  };

  return (
    <div className="home-box">
      <div className="top-box">
        <div className="header-box">
          <span className="title" >
           {t('签名HOME')}
          </span>
          <span className="wallet-box language" onClick={() => {
            setToggle(!toggle)
          }}>
            <img
              draggable="false"
              className="left-icon"
              src={frame}
              alt=""
            />
            <img
              draggable="false"
              className={`left-icon arrow-icon ${toggle ? 'arrow-icon-up': ''}`}
              src={arrow}
              alt=""
            />
            {
              toggle ?  <div className="lang-box">
                {
                  Language.map(item => <div key={item.key} onClick={() => changeLanguage(item.key)}>{item.value}</div>)
                }
              </div> : null
            }
          </span>
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
            <div className="des">{t('当前价格') }</div>
            <div className="price">1U = {Number(1 / coefficient).toFixed(4)} CHAT</div>
            <div className="btn-box">{t('查看K线')}</div>
          </div>
          <div
            className="banner-box-2"
            onClick={() => {
              history.push("/task");
            }}
          >
            <img src={bgWhole} alt="" className="bg" />
            <div className="banner-tips">{t('做任务免费领取Chat')}</div>
          </div>
        </div>
        <div className="body-box">
          <div className="sub-title">{t('购买代币')}</div>
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
                setChatNumber(+e.target.value);
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
              value={usdtNumber}
              onChange={(e) => {
                setUsdtNumber(+e.target.value)
                changeValueBy(e.target.value, true)
              }}
              type="text"
            />

          </div>
        </div>

        <div className="footer-box">
          {
            (chatNumber > 0 && usdtNumber > 0) ? <div className="footer-btn" onClick={
              exchangeChatCoin
            }>{t('兑换')}</div> : <div className="footer-btn disabled">{t('兑换')}</div>
          }


        </div>
      </div>

      <TabBar></TabBar>
    </div>
  );
}
