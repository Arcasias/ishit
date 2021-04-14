import { Component, tags, useState } from "@odoo/owl";
import { Environment } from "../classes/Environment";

const { xml: html, css } = tags;

interface ImageProps {
  src: string | null;
  alt: string;
}

export default class ImageComponent extends Component<ImageProps, Environment> {
  //---------------------------------------------------------------------------
  // TEMPLATE
  //---------------------------------------------------------------------------
  static template = html`
    <t>
      <img
        t-if="props.src and !state.error"
        class="img-component"
        t-att-src="props.src"
        t-att-alt="props.alt"
        t-on-load.stop.prevent="onLoad"
        t-on-error.stop.prevent="onError"
      />
      <div t-else="" class="img-component not-loaded">
        <i class="far fa-frown"></i>
      </div>
    </t>
  `;

  //---------------------------------------------------------------------------
  // STYLE
  //---------------------------------------------------------------------------
  static style = css`
    .img-component {
      width: 100%;
      height: 100%;
      object-fit: cover;

      &.not-loaded {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8vh;
        color: #484858;
      }
    }
  `;

  //---------------------------------------------------------------------------
  // PROPERTIES
  //---------------------------------------------------------------------------

  private state = useState({
    error: <boolean>false,
    loaded: <boolean>false,
  });

  //---------------------------------------------------------------------------
  // LIFECYCLE
  //---------------------------------------------------------------------------

  public async willUpdateProps(nextProps: ImageProps) {
    if (nextProps.src !== this.props.src) {
      this.state.error = false;
      this.state.loaded = false;
    }
  }

  //---------------------------------------------------------------------------
  // PRIVATE
  //---------------------------------------------------------------------------

  private onError(): void {
    if (this.state.error) return;
    this.state.error = true;
    this.state.loaded = false;
  }

  private onLoad(): void {
    if (this.state.loaded) return;
    this.state.error = false;
    this.state.loaded = true;
    this.trigger("load", ...arguments);
  }
}
