import { Component, hooks, tags } from "@odoo/owl";

const { xml: html, css } = tags;
const { useExternalListener, useRef, useState } = hooks;

export interface DropdownItem {
  id: string;
  value: string;
  badge?: string | null;
}

interface DropdownProps {
  title: string;
  items: [string, string][];
  large: boolean;
}

export default class DropdownComponent extends Component<DropdownProps> {
  //---------------------------------------------------------------------------
  // TEMPLATE
  //---------------------------------------------------------------------------
  static template = html`
    <div class="props.items dropdown">
      <button
        type="button"
        class="btn btn-outline-primary"
        t-att-class="{'btn-lg': props.large}"
        t-on-click="state.show = !state.show"
        t-on-keydown="onButtonKeydown"
        t-esc="props.title"
        t-ref="main-button"
      ></button>
      <div t-if="state.show" class="dropdown-menu">
        <a
          t-foreach="props.items"
          t-as="item"
          t-key="item.id"
          href="#"
          class="dropdown-item"
          t-on-click="trigger('select', item)"
          t-on-keydown="onItemKeydown(item)"
        >
          <span class="item-value">
            <t t-esc="item.value" />
            <span
              t-if="item.badge"
              class="badge badge-pill border border-primary text-primary ml-2"
              t-esc="item.badge"
            ></span>
          </span>
          <span class="item-controls ml-2">
            <span
              class="remove-item dropdown-action"
              t-on-click.stop="trigger('remove', item)"
            >
              <i class="fas fa-times text-secondary"></i>
            </span>
          </span>
        </a>
        <div class="dropdown-divider"></div>
        <div t-if="state.promptClear" class="dropdown-item">
          <button
            class="dropdown-action btn text-success"
            t-on-click.stop="trigger('clear')"
          >
            <i class="fas fa-check"></i>
          </button>
          <button
            class="dropdown-action btn text-danger"
            t-on-click.stop="state.promptClear = false"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <button
          t-else=""
          class="dropdown-item dropdown-action btn text-danger"
          t-on-click.stop="state.promptClear = true"
          t-on-keydown="onItemKeydown(null)"
        >
          Clear <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  `;

  //---------------------------------------------------------------------------
  // TEMPLATE
  //---------------------------------------------------------------------------
  static style = css`
    .dropdown-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `;

  private buttonRef = useRef("main-button");
  private state = useState({
    show: <boolean>false,
    promptClear: <boolean>false,
  });

  //---------------------------------------------------------------------------
  // LIFECYCLE
  //---------------------------------------------------------------------------

  constructor() {
    super(...arguments);
    useExternalListener(window, "click", this.onWindowClick, true);
    useExternalListener(window, "keydown", this.onWindowKeydown, true);
  }

  //---------------------------------------------------------------------------
  // Private
  //---------------------------------------------------------------------------

  private focusNext(el: HTMLElement): void {
    let next = el.nextSibling as HTMLElement;
    while (next?.classList.contains("dropdown-divider")) {
      next = next.nextSibling as HTMLElement;
    }
    if (next?.classList.contains("dropdown-item")) {
      next.focus();
    }
  }

  private focusPrevious(el: HTMLElement): void {
    let previous = el.previousSibling as HTMLElement;
    while (previous?.classList.contains("dropdown-divider")) {
      previous = previous.previousSibling as HTMLElement;
    }
    if (previous?.classList.contains("dropdown-item")) {
      previous.focus();
    } else {
      this.buttonRef.el!.focus();
    }
  }

  private onButtonKeydown({ key }: KeyboardEvent): void {
    if (key === "ArrowDown") {
      const firstElement = this.el!.querySelector<HTMLElement>(
        ".dropdown-item"
      );
      firstElement?.focus();
    }
  }

  private onItemKeydown(item: DropdownItem | null, ev: KeyboardEvent): void {
    const target = ev.target as HTMLElement;
    switch (ev.key) {
      case "ArrowUp": {
        return this.focusPrevious(target);
      }
      case "ArrowDown": {
        return this.focusNext(target);
      }
      case "Delete": {
        if (item) {
          this.focusPrevious(target);
          this.trigger("remove", item);
        }
        return;
      }
    }
  }

  private onWindowClick(ev: MouseEvent): void {
    const target = ev.target as HTMLElement;
    if (!target.closest(".dropdown-action")) {
      this.state.show = false;
    }
  }

  private onWindowKeydown({ key }: KeyboardEvent): void {
    if (key === "Escape") this.state.show = false;
  }
}
