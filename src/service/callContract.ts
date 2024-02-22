declare const window: any;
import Web3 from "web3";
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { projectId ,metadata,messageKey} from "@/constants/env"
import abiJson from "@/constants/chatExchangeAbi.json"
import { message } from 'antd';
export async function initProvider (){
  
  const provider = await EthereumProvider.init({
    projectId: projectId, // required
    metadata,
    chains: [1], // required
    showQrModal: true // requires @walletconnect/modal
  })
  message.success({
    content: '初始化成功...',
    duration: 1
  });
  // successCallBack&&successCallBack()
  window.$$provider=provider;
  // localStorage.setItem('provider', JSON.stringify(provider))
  // localStorage.setItem('web3', JSON.stringify(web3))
  return provider;
}
export async function initWeb3Connect(){
  let  provider=null;
  if(window.$$provider){
     provider= window.$$provider
  }else{
    provider =initProvider()
  }
 
  await provider.connect();
  const result:any = await provider.request({ method: 'eth_requestAccounts' })
  const web3 = new Web3(provider);
  window.$$web3=web3;
  window.userAddress =result[0];
  return  {address:result[0],web3}
}

export async function signSignature(account:any) {
 
  if(!window.$$web3) return message.info('请先授权钱包签名');
  const address =account || window.userAddress  || '';
  console.log('-------999999999999999999--------',address)
  if(!address) return ;
  const web3=window.$$web3;
    const result =await  web3.eth.personal.sign(messageKey, address, "").catch(err=>{
      return err
    })
    console.log('------resultresultresult-------',result);
    if(`${result}`.includes('error')){
      message.error('result')
      return '';
    }
    return result ;
  }

export function callContractMethod() {
 
  if(!window.$$web3) return message.info('请先授权钱包签名');;

  const web3=window.$$web3;
  const contractAddress = "0xcDa00144876799df1d538A307866Bc03c4E79Ef7";

  // 6. 创建合约实例
  const contract = new web3.eth.Contract(abiJson.abi, contractAddress);
  return contract
  // 7. 调用合约的方法
  // 假设合约有一个名为 'someMethod' 的方法，你可以这样调用它：






  
}

