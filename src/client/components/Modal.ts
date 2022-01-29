import { Component, tags } from "@odoo/owl";
import { useAnimation } from "../services/animation";
import { Environment } from "../services/Environment";

interface ModalManagerProps {
  title: string;
  Main: Component;
  Footer: Component;
  onClose?: (...args: any) => any;
}

const { xml: html } = tags;

export const makeModalManager = () => {
  let modal: ModalManagerProps | false = false;
  return {
    get modal() {
      return modal;
    },
    display(props: ModalManagerProps) {
      if (modal) {
        this.close();
      }
      modal = props;
    },
    close() {
      if (!modal) {
        return;
      }
      if (modal.onClose) {
        modal.onClose();
      }
      modal = false;
    },
  };
};

export class ModalManager extends Component<ModalManagerProps, Environment> {
  static template = html`
    <div class="modal-manager">
      <t t-if="env.modal and animationManager.value">
        <div class="modal-backdrop" />
        <div class="modal" tabindex="-1" role="dialog">
          <div class="modal-dialog slide-top" role="document" t-ref="slider">
            <div class="modal-content">
              <header class="modal-header">
                <h5 class="modal-title" t-out="env.modal.title" />
                <button
                  type="button"
                  class="btn btn-sm"
                  t-on-click="env.modal.close"
                >
                  <i class="fas fa-times" />
                </button>
              </header>
              <main class="modal-body">
                <t t-component="env.modal.Main" />
              </main>
              <footer class="modal-footer">
                <t t-component="env.modal.Footer" />
                <button
                  type="button"
                  class="btn btn-primary"
                  t-on-click="env.modal.close"
                >
                  Ok
                </button>
              </footer>
            </div>
          </div>
        </div>
      </t>
    </div>
  `;

  animationManager = useAnimation("slider", "slide-top");
}
