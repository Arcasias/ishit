import { Component } from "@odoo/owl";
import { Env } from "@odoo/owl/dist/types/component/component";
import { APIBridge } from "../../common/utils";

const { electron } = window as any;
const api: APIBridge = electron ?? { send() {}, on(): any {} };
const isDesktop = Boolean(electron);

export interface Environment extends Env {
  api: APIBridge;
  isDesktop: boolean;
}

export const env: Environment = Object.assign({}, Component.env, {
  api,
  isDesktop,
});
