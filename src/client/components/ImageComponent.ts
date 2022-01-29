import { Component, tags, hooks } from "@odoo/owl";
import { ajax } from "../../common/utils";
import { Environment } from "../classes/Environment";

const { xml: html, css } = tags;
const { onWillStart, onWillUpdateProps, useState } = hooks;

interface ImageProps {
  src: string | null;
  alt: string;
  preload: boolean;
}

const SRC_FNAME_RE = /.*\/(.*)\.\w+$/;

const getAltFromSrc = (src: string): string => src.match(SRC_FNAME_RE)![1];

export class ImageComponent extends Component<ImageProps, Environment> {
  //---------------------------------------------------------------------------
  // PROPS / COMPONENTS
  //---------------------------------------------------------------------------
  static props = {
    src: String,
    alt: { type: String, optional: true },
    preload: Boolean,
  };
  static defaultProps = {
    preload: true,
  };

  //---------------------------------------------------------------------------
  // TEMPLATE
  //---------------------------------------------------------------------------
  static template = html`
    <div class="img-component" t-att-class="{ 'no-image': !isLoaded }">
      <img
        t-if="isLoaded"
        t-att-src="state.src"
        t-att-alt="alt"
        t-on-load="onLoad"
        t-on-error="onError"
      />
      <i t-elif="state.error" class="far fa-frown"></i>
      <i t-else="" class="fas fa-circle-notch loading"></i>
    </div>
  `;

  //---------------------------------------------------------------------------
  // STYLE
  //---------------------------------------------------------------------------
  static style = css`
    .img-component {
      width: 100%;
      height: 100%;

      &.no-image {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8vh;
        color: #484858;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .loading {
        animation: spin ease-in-out 1s infinite;
      }
    }
  `;

  //---------------------------------------------------------------------------
  // PROPERTIES
  //---------------------------------------------------------------------------

  contentType: string | null = null;
  state = useState({
    error: <boolean>false,
    src: <string | null>(this.props.preload ? null : this.props.src),
  });

  get alt(): string {
    return this.props.alt || getAltFromSrc(this.state.src!);
  }

  get isLoaded(): boolean {
    return Boolean(this.state.src && !this.state.error);
  }

  //---------------------------------------------------------------------------
  // LIFECYCLE
  //---------------------------------------------------------------------------

  setup() {
    onWillStart(() => this.onWillStart())
    onWillUpdateProps((nextProps: ImageProps) => this.onWillUpdateProps(nextProps))
  }

  async onWillStart() {
    if (this.props.src) {
      await this.load(this.props.src);
    }
  }

  async onWillUpdateProps(nextProps: ImageProps) {
    if (nextProps.src !== this.props.src) {
      this.state.error = false;
      this.state.src = nextProps.preload ? null : nextProps.src;
      if (nextProps.src) {
        await this.load(nextProps.src);
      }
    }
  }

  //---------------------------------------------------------------------------
  // PRIVATE
  //---------------------------------------------------------------------------

  async load(url: string) {
    if (this.props.preload) {
      ajax(url, { type: "blob" })
        .then((request) => {
          this.contentType = request.getResponseHeader("content-type");
          this.state.src = url;
        })
        .catch(() => this.onError());
    } else {
      this.state.src = url;
    }
  }

  onError(): void {
    this.state.error = true;
  }

  onLoad(ev: Event): void {
    const img = ev.target as HTMLImageElement;
    this.state.error = false;
    this.trigger("ready", { img, contentType: this.contentType });
  }
}
