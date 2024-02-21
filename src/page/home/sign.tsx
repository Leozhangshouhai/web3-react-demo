// import WalletConnectProvider from "@walletconnect/web3-provider";
// import Web3 from "web3";

// 1. 初始化 WalletConnect Provider
import SignClient from "@walletconnect/sign-client";
import { useCallback, useEffect, useState } from "react";
// import { hideLoading, showLoading } from "@/service/loading";
import { projectId, metadata, relayUrl } from "@/constants/env";
import { Web3Modal } from "@web3modal/standalone";
import { ethers } from "ethers";
import axiosInstance from "@/service";
import { message } from 'antd';
import { useAppSelector, useAppDispatch } from '@/store/hook';
export default function Sign() {
  const web3Modal = new Web3Modal({
    projectId,
    walletConnectVersion: 2,
  });
  const getUserInfo = async()=>{
   const result= await axiosInstance.get('/chatCoin/getUserInfo').catch(e=>{
    console.log('----eeeeeeee---',e)
   });
   console.log('-----1--------',result);
  }
  message.loading('Action in progress..',0);
  setTimeout(()=>{
    message.destroy()
  },3000)
  getUserInfo();
  // const [signClient, setSignClient] = useState<SignClient | null>();
  // useEffect(() => {
  //   // showLoading();
  //   SignClient.init({
  //     projectId,
  //     // optional parameters
  //     relayUrl,
  //     metadata,
  //   })
  //     .then((signClient) => {
  //       console.log("----222----authClient-----", signClient);
  //       setSignClient(signClient);
  //     })
  //     .catch(console.error);
  // }, []);
  // const signAction =async () => {
  //   console.log("---9993333updatedSession");
  //   if (!signClient) return;
  //   try {
  //     const { uri, approval } = await signClient.connect({
  //       // Optionally: pass a known prior pairing (e.g. from `signClient.core.pairing.getPairings()`) to skip the `uri` step.
  //       // pairingTopic: "pairing?.topic",
  //       // Provide the namespaces and chains (e.g. `eip155` for EVM-based chains) we want to use in this session.
  //       requiredNamespaces: {
  //         eip155: {
  //           methods: [
  //             "eth_sendTransaction",
  //             "eth_signTransaction",
  //             "eth_sign",
  //             "personal_sign",
  //             "eth_signTypedData",
  //           ],
  //           chains: ["eip155:1"],
  //           events: ["chainChanged", "accountsChanged"],
  //         },
  //       },
  //     });

  //     // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
  //     if (uri) {
  //       console.log("3333----3333", uri);
  //       await web3Modal.openModal({
  //         uri,
  //       });
  //       // walletConnectModal.openModal({ uri })
  //       // Await session approval from the wallet.
  //       const session = await approval();
  //       // Handle the returned session (e.g. update UI to "connected" state).
  //       // * You will need to create this function *
  //       console.log("session-----", session);
  //       const accounts = session.namespaces.eip155.accounts;
  //       const hexMessage = ethers.hexlify(ethers.toUtf8Bytes("hello world"));
  //       console.log("hexMessage=-----", hexMessage);
  //       const account = accounts[0];
  //       const result = await signClient.request({
  //         topic: session.topic,
  //         chainId: "eip155:1",
  //         request: {
  //           method: "personal_sign",
  //           params: [hexMessage, account],
  //         },
  //       });

  //       console.log("000--0000", result);
  //       // onSessionConnect(session)
  //       // Close the QRCode modal in case it was open.
  //       web3Modal.closeModal();
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }

  // }
    // useEffect(()=>{
    //   signAction()
    // }
    //   , [signClient]);

  // function connectWallet(client) {
  //   const session = await client.connect({
  //     requiredNamespaces: {
  //       eip155: {
  //         chains: ["eip155:1"], // 这里的 "eip155:1" 表示 Ethereum 主网
  //         methods: ["eth_sendTransaction", "personal_sign", "eth_signTypedData"],
  //         events: ["chainChanged", "accountsChanged"],
  //       },
  //     },
  //   });
  //   return session;
  // }

  return <div>sig2n</div>;
}
