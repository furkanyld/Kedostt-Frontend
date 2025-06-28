import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from "react-dom/client";
import App from "./App"; 
import { BrowserRouter as Router } from "react-router-dom";
import './index.css';
import './Styles/style.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <App />
  </Router>
);
