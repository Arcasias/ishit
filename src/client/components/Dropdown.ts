import { Component, hooks, tags } from "@odoo/owl";
import { Environment } from "../classes/Environment";

const { xml: html, css } = tags;
const { useExternalListener, useRef, useState } = hooks;

export interface DropdownItem {
  id: string;
  value: string;
  badge?: string | null;
}

interface DropdownProps {
  title: string;
  items: DropdownItem[];
  small?: boolean;
  deletable?: boolean;
}

export class Dropdown extends Component<DropdownProps, Environment> {
  //---------------------------------------------------------------------------
  // PROPS / COMPONENTS
  //---------------------------------------------------------------------------
  static props = {
    title: String,
    items: {
      type: Array,
      element: {
        id: String,
        value: String,
        badge: { type: String, optional: true },
      },
    },
    small: { type: Boolean, optional: true },
    deletable: { type: Boolean, optional: true },
  };

  //---------------------------------------------------------------------------
  // TEMPLATE
  //---------------------------------------------------------------------------
  static template = html`
    <div class="dropdown">
      <button
        class="dropdown-button btn"
        t-att-class="props.small ? 'badge border border-primary text-primary' : 'btn-outline-primary'"
        t-on-click="toggle()"
        t-on-keydown="onButtonKeydown"
        t-ref="main-button"
      >
        <t t-esc="props.title" />
        <i
          t-attf-class="fas fa-caret-{{ state.show ? 'up' : 'down' }} ms-2"
        ></i>
      </button>
      <ul t-if="state.show" class="dropdown-menu">
        <a
          t-foreach="props.items"
          t-as="item"
          t-key="item.id"
          href="#"
          class="dropdown-item"
          t-on-click="onSelect(item)"
          t-on-keydown="onItemKeydown(item)"
        >
          <span class="item-value">
            <t t-esc="item.value" />
            <span
              t-if="item.badge"
              class="badge rounded-pill border border-primary text-primary ms-2"
              t-esc="item.badge"
            ></span>
          </span>
          <span t-if="props.deletable" class="item-controls ms-2">
            <span
              class="remove-item dropdown-action"
              t-on-click.stop="trigger('remove', item)"
            >
              <i class="fas fa-times text-secondary"></i>
            </span>
          </span>
        </a>
        <t t-if="props.deletable">
          <div class="dropdown-divider"></div>
          <div t-if="state.promptClear" class="dropdown-item">
            <button
              class="dropdown-action btn btn-sm text-success"
              t-on-click.stop="trigger('clear')"
            >
              Yes
              <i class="fas fa-check ms-2"></i>
            </button>
            <button
              class="dropdown-action btn btn-sm text-danger"
              t-on-click.stop="state.promptClear = false"
            >
              No
              <i class="fas fa-times ms-2"></i>
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
        </t>
      </ul>
    </div>
  `;

  //---------------------------------------------------------------------------
  // TEMPLATE
  //---------------------------------------------------------------------------
  static style = css`
    .dropdown-button {
      display: flex;
      align-items: center;
    }

    .dropdown-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `;

  buttonRef = useRef("main-button");
  state = useState({
    show: <boolean>false,
    promptClear: <boolean>false,
  });

  //---------------------------------------------------------------------------
  // LIFECYCLE
  //---------------------------------------------------------------------------

  setup() {
    useExternalListener(window, "click", this.onWindowClick);
    useExternalListener(window, "keydown", this.onWindowKeydown);
  }

  //---------------------------------------------------------------------------
  // Private
  //---------------------------------------------------------------------------

  close(): void {
    this.state.show = false;
    this.state.promptClear = false;
  }

  focusNext(el: HTMLElement): void {
    let next = el.nextSibling as HTMLElement;
    while (next?.classList.contains("dropdown-divider")) {
      next = next.nextSibling as HTMLElement;
    }
    if (next?.classList.contains("dropdown-item")) {
      next.focus();
    }
  }

  focusPrevious(el: HTMLElement): void {
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

  onButtonKeydown({ key }: KeyboardEvent): void {
    switch (key) {
      case "ArrowDown": {
        this.el!.querySelector<HTMLElement>(".dropdown-item")?.focus();
        return;
      }
    }
  }

  onItemKeydown(item: DropdownItem | null, ev: KeyboardEvent): void {
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

  onSelect(item: DropdownItem): void {
    this.trigger("select", item);
    this.close();
  }

  onWindowClick(ev: MouseEvent): void {
    if (!this.el?.contains(ev.target as HTMLElement)) {
      this.close();
    }
  }

  onWindowKeydown({ key }: KeyboardEvent): void {
    if (key === "Escape") {
      this.close();
    }
  }

  open(): void {
    this.state.show = true;
  }

  toggle(): void {
    this.state.show ? this.close() : this.open();
  }
}
