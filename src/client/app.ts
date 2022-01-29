import { Component, config } from "@odoo/owl";
import { env } from "./services/Environment";
import { Root } from "./components/App";

Component.env = env;

if (env.api.isDev) {
  config.mode = "dev";
}

const app = new Root();
app.mount(document.body);
