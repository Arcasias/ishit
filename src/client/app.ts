import { Component } from "@odoo/owl";
import { env } from "./classes/Environment";
import App from "./components/App";

Component.env = env;

const app = new App();
app.mount(document.body);
