import { Component } from "@odoo/owl";
import { Env } from "@odoo/owl/dist/types/component/component";
import { APIBridge, getApi } from "../../common/utils";

const api = getApi(window);

export interface Environment extends Env {
  api: APIBridge;
}

export const env: Environment = Object.assign({}, Component.env, { api });
