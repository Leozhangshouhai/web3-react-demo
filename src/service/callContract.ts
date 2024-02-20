import { showLoading, hideLoading } from "./loading";
import Web3 from "web3";
import { showMessage } from "@/store/globalSlice";
import { store } from "@/store";
import { useWeb3Instance } from "@/hooks/useWeb3Instance";
interface ITx {
  from: string;
  value?: string;
}
interface IContractMethod {
  call: Function;
  send: Function;
}
export const callContract = (method: IContractMethod) => {
  const { web3Instance } = useWeb3Instance();
  const Methods = {
    call: async (tx?: ITx, loading = true) => {
      loading && showLoading();
      const res = await method.call(tx || {}).catch(async (error: any) => {
        if (error.code) {
          if (error.code === -32000) {
            store.dispatch(showMessage("error: Insufficient Token"));
            return false;
          }
          store.dispatch(showMessage(error.message));
          return false;
        }
        const str = error.toString();
        const start = str.indexOf("{");
        if (start != -1) {
          const res = str.substr(start, str.length);
          const obj = JSON.parse(res);
          const errorMessage = obj.message || obj.originalError.message;
          store.dispatch(showMessage(errorMessage));
        } else {
          const res = str.split(":");
          if (
            res[0].includes("Error") &&
            res[1].includes("execution reverted")
          ) {
            store.dispatch(showMessage(res[2]));
          } else {
            store.dispatch(showMessage(error.toString()));
          }
        }
        hideLoading();
        return false;
      });
      hideLoading();
      return res;
    },
    send: async (tx?: ITx) => {
      const callRes = await Methods.call(tx, false);
      if (!callRes) {
        return false;
      }
      web3Instance.setProvider(Web3.givenProvider);
      const res = await method.send(tx || {}).catch(async (error: any) => {
        console.error("send error:" + error);
        if (error.code === 4001) {
          store.dispatch(showMessage(error.message));
          return false;
        }
      });
      return res;
    },
  };
  return Methods;
};
