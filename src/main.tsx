import "walletconnect-vite-patch"
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import 'antd/dist/antd.css'; 
import "./index.css";
import WebApp from '@twa-dev/sdk'

WebApp.ready();

ReactDOM.render(<App />, document.getElementById("root"));
