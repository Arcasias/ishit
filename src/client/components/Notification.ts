import { Component, tags } from "@odoo/owl";

const { xml: html } = tags;

export class NotificationManager extends Component {
  static template = html`
    <div class="notification-manager">
      <div
        t-if="notificationManager.value"
        class="notification slide-right alert alert-success"
        role="alert"
        t-ref="notification"
        t-esc="notificationManager.value"
      ></div>
    </div>`;
}
