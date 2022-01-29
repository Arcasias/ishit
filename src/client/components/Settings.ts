import { Component, tags } from "@odoo/owl";
import { Environment } from "../services/Environment";

interface ConfigItem {
  key: string;
  text: string;
  type: "text" | "number" | "checkbox" | "range";
  min?: number;
  max?: number;
  defaultValue?: any;
  apiEventKey?: string;
  format: (value: string) => any;
}

const { xml: html } = tags;

const configItems: { [key: string]: ConfigItem } = {
  downloadPath: {
    key: "downloadPath",
    text: "Download path",
    type: "text",
    defaultValue: null,
    apiEventKey: "set-download-path",
    format: (val: string) => val.replace(/['"]+/g, "").trim(),
  },
  tolerance: {
    key: "tolerance",
    text: "Default background removal tolerance",
    type: "range",
    defaultValue: 20,
    min: 1,
    max: 255,
    format: (val: string) => Number(val),
  },
  radius: {
    key: "radius",
    text: "Default brush radius",
    type: "range",
    defaultValue: 50,
    min: 1,
    max: 200,
    format: (val: string) => Number(val),
  },
};

export class Settings extends Component<{}, Environment> {
  static template = html` <div class="modal-backdrop"></div>
    <div class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog slide-top" role="document" t-ref="settings">
        <div class="modal-content">
          <header class="modal-header">
            <h5 class="modal-title">Settings</h5>
            <button type="button" class="btn btn-sm" t-on-click="props.onClose">
              <i class="fas fa-times"></i>
            </button>
          </header>
          <main class="modal-body">
            <div
              t-foreach="filteredConfigItems"
              t-as="item"
              t-key="item.key"
              t-att-class="{ 'mb-3': !item_last, 'form-check': item.type === 'checkbox' }"
              t-on-change="configSet(item.key)"
            >
              <label
                t-att-for="item.key"
                t-attf-class="form{{ item.type === 'checkbox' ? '-check' : '' }}-label"
                t-esc="item.text"
              ></label>
              <input
                t-if="item.type === 'checkbox'"
                t-att-id="item.key"
                type="checkbox"
                class="form-check-input"
                t-att-checked="configGet(item.key)"
              />
              <input
                t-elif="item.type === 'range'"
                type="range"
                class="form-range h-100"
                t-att-min="item.min"
                t-att-max="item.max"
                step="1"
                t-att-value="configGet(item.key)"
              />
              <input
                t-else=""
                t-att-type="item.type"
                class="form-control"
                t-att-value="configGet(item.key)"
              />
            </div>
          </main>
          <footer class="modal-footer">
            <span class="form-text text-muted fst-italic me-auto">
              Changes are saved automatically
            </span>
            <button
              type="button"
              class="btn btn-primary"
              t-on-click="closeSettings"
            >
              Ok
            </button>
          </footer>
        </div>
      </div>
    </div>`;

  filteredConfigItems = Object.values(configItems).filter(
    (item) => this.env.isDesktop || !item.apiEventKey
  );

  setup() {
    if (this.env.isDesktop) {
      for (const item of Object.values(configItems)) {
        if (item.apiEventKey) {
          const value = this.configGet(item.key);
          if (value !== null) {
            this.env.api.send(item.apiEventKey, value);
          }
        }
      }
    }
  }

  configGet(configKey: string): any {
    const { format, key, defaultValue } = configItems[configKey];
    return format(this.env.config.get(key, defaultValue));
  }

  configSet(itemKey: string, ev: Event): void {
    const item = configItems[itemKey]!;
    const input = ev.target as any;
    const prop = item.type === "checkbox" ? "checked" : "value";
    input[prop] = item.format(input[prop]);
    this.env.config.set(item.key, input[prop]);
    if (item.apiEventKey) {
      this.env.api.send(item.apiEventKey, input[prop]);
    }
  }
}
