declare const window: any;
import Web3 from "web3";
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { projectId ,metadata,messageKey,mainEthChainsIdTest,G_USDT,Op_Contract_Address} from "@/constants/env"
import contractAbi from "@/constants/chatExchangeAbi.json"
import UsdtAbi from "@/constants/erc20.json"
import { message } from 'antd';
import exp from "constants";
// import { useTranslation } from 'react-i18next';

export async function initProvider (t:Function){
  // const { t, } = useTranslation();
  const provider = await EthereumProvider.init({
    projectId: projectId, // required
    metadata,
    chains: [mainEthChainsIdTest], // required
    showQrModal: true // requires @walletconnect/modal
  })
  message.success({
    content: `${t('初始化成功')}...`,
    duration: 1
  });
  // successCallBack&&successCallBack()
  window.$$provider=provider;
  // localStorage.setItem('provider', JSON.stringify(provider))
  // localStorage.setItem('web3', JSON.stringify(web3))
  return provider;
}
export async function initWeb3Connect(t: Function){
  let  provider=null;
  if(window.$$provider){
     provider= window.$$provider
  }else{
    provider =initProvider(t)
  }
  // wallet_switchEthereumChain
 
  let connectResult=  await provider.connect().catch(()=>{

    return false;
  });

  // if(!connectResult){
  //   const result2:any = await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '5' }], });  
  //   console.log('result2---',result2)
  // }

  const result:any = await provider.request({ method: 'eth_requestAccounts' })
  const web3 = new Web3(provider);
  const id= await web3.eth.getChainId();
  

  console.log('-------getChainIdgetChainId--------',id)
  window.$$web3=web3;
  window.userAddress =result[0];
  return  {address:result[0],web3}
}

export async function signSignature(account:any, t:Function) {
 
  if(!window.$$web3) return message.info(t('请先授权钱包签名'));
  const address =account || window.userAddress  || '';
  if(!address) return ;
  const web3=window.$$web3;
  const result =await  web3.eth.personal.sign(messageKey, address, "").catch(()=>{
      message.error('result')
      return ''
    })
    console.log('------resultresultresult-------',result);
 
    return result ;
  }

export function callContractMethod(t: Function) {
 
  if(!window.$$web3) return message.info(t('请先授权钱包签名'));

  const web3=window.$$web3;
  const contractAddress = Op_Contract_Address;

  // 6. 创建合约实例
  const contract = new web3.eth.Contract(contractAbi.abi, contractAddress);
  return contract
  // 7. 调用合约的方法
  // 假设合约有一个名为 'someMethod' 的方法，你可以这样调用它：
  
}
export function ercTokenContractInstance (t: Function){
  if(!window.$$web3) return message.info(t('请先授权钱包签名'));
  const web3=window.$$web3;
  const tokenContract = new web3.eth.Contract(
    UsdtAbi.abi,
    G_USDT
  )
  return tokenContract
}

