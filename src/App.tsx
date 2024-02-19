import * as React from 'react'
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider, createWeb3ReactRoot } from "@web3-react/core";
import Web3ReactManager from "@/components/Web3ReactManager/index";

import { NetworkContextName } from "@/config";
// import { ChakraProvider } from '@chakra-ui/react'
import Home from "@/page/home/Home";
import Account from "@/page/account/Account";
export function getLibrary(provider: any): Web3Provider {
    const library = new Web3Provider(provider);
    library.pollingInterval = 15000;
    return library;
}
const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

function App() {
    return (
      // <ChakraProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ProviderNetwork getLibrary={getLibrary}>
                <Router>
                    <Web3ReactManager>
                    <Switch>
                      <div className="container">
                        <Route path="/" exact component={Home} />
                        <Route path="/home" exact component={Home} />
                        <Route path="/task" exact component={Account} />
                      </div>
                        
                      </Switch>
                    </Web3ReactManager>
                </Router>
            </Web3ProviderNetwork>
        </Web3ReactProvider>
        // </ChakraProvider>
    );
}

export default App;
