import * as React from 'react'
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider, createWeb3ReactRoot } from "@web3-react/core";
import Web3ReactManager from "@/components/Web3ReactManager/index";
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
// @ts-ignore
import cn from "./languages/cn.js";
// @ts-ignore
import en from './languages/en.js';
// @ts-ignore
import hangugeo from './languages/hangugeo.js';

import { NetworkContextName } from "@/config";

import Home from "@/page/home/Home";
import Account from "@/page/account/Account";
import Sign from "@/page/home/sign";

export function getLibrary(provider: any): Web3Provider {
    const library = new Web3Provider(provider);
    library.pollingInterval = 15000;
    return library;
}
const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

i18next.init({
    interpolation: { escapeValue: false },  // React already does escaping
    lng: 'en',  // default language
    resources: {
      en: {
        translation: en,
      },
      hangugeo: {
        translation: hangugeo,
      },
      cn: {
        translation: cn,
      },
    },
  });
function App() {
    return (
        <I18nextProvider i18n={i18next}>
            <Web3ReactProvider getLibrary={getLibrary}>
                <Web3ProviderNetwork getLibrary={getLibrary}>
                    <Router>
                        <Web3ReactManager>
                        <Switch>
                        <div className="container">
                            <Route path="/" exact component={Home} />
                            <Route path="/home" exact component={Home} />
                            <Route path="/sign" exact component={Sign} />
                            
                            <Route path="/task" exact component={Account} />
                        </div>
                            
                        </Switch>
                        </Web3ReactManager>
                    </Router>
                </Web3ProviderNetwork>
                {/* <Message></Message> */}
            </Web3ReactProvider>
        </I18nextProvider>
        
      
    );
}

export default App;
