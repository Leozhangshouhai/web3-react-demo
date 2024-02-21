import Web3 from "web3";
// import WalletConnectProvider from "@walletconnect/web3-provider";
import { ABI } from "../utils/ABI"
import { projectId } from "@/constants/env"
import abiJson from "@/constants/chatExchangeAbi.json"
async function connectWallet() {
  // 1. 初始化 WalletConnect 提供者
  // const provider = new WalletConnectProvider({
  //   infuraId: 'ac05dcbf6bd24720b20b79f7290c47e5', // 用你的Infura项目ID替换
  // });

  // 2. 启动提供者连接
  await provider.enable();

  // 3. 创建 web3 实例
  const web3 = new Web3(provider);

  // 4. 获取用户的账户地址
  const accounts = await web3.eth.getAccounts();
  const userAccount = accounts[0]; // 通常是第一个账户

  return { web3, userAccount };
}


export async function callContractMethod(buyInfo = {}) {

  const web3 = new Web3(buyInfo.provider);

  // 5. 定义合约相关信息
  const contractAddress = "0xcDa00144876799df1d538A307866Bc03c4E79Ef7";

  // 6. 创建合约实例
  const contract = new web3.eth.Contract(abiJson.abi, contractAddress);

  // 7. 调用合约的方法
  // 假设合约有一个名为 'someMethod' 的方法，你可以这样调用它：
  contract.methods.exchange(1, 2, 1, 2312312312, Buffer.from("333333", 'hex')).send({ from: "0x77e77e8a57abc9e4b5e9b8174e197b1d13835ae8" })
    .then(function (result) {
      console.log("方法调用结果：", result);
    })
    .catch(function (error) {
      console.error("调用方法时出错：", error);
    });
}

