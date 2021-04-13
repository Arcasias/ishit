import { Component, tags } from "@odoo/owl";
import { version } from "../../package.min.json";
import { Environment } from "../classes/Environment";

const { xml: html, css } = tags;

export default class WindowControls extends Component<any, Environment> {
  //---------------------------------------------------------------------------
  // TEMPLATE
  //---------------------------------------------------------------------------
  static template = html`
    <nav class="window-controls nav">
      <div class="text-muted ml-2">v${version}</div>
      <ul class="buttons">
        <li>
          <button
            class="btn btn-sm text-secondary"
            t-on-click="env.api.send('window-minimize')"
          >
            <i class="fas fa-minus"></i>
          </button>
        </li>
        <li>
          <button
            class="btn btn-sm text-danger"
            t-on-click="env.api.send('window-close')"
          >
            <i class="fas fa-times"></i>
          </button>
        </li>
      </ul>
    </nav>
  `;

  //---------------------------------------------------------------------------
  // STYLE
  //---------------------------------------------------------------------------
  static style = css`
    .window-controls {
      align-items: center;
      justify-content: space-between;
      background-color: rgba(0, 0, 0, 0.3);
      -webkit-app-region: drag;

      .buttons {
        display: flex;
        margin: 0;
        -webkit-app-region: no-drag;
      }
    }
  `;
}
