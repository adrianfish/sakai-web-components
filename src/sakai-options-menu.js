import { html, css, LitElement } from "lit-element";
import { createPopper } from "@popperjs/core";
import './sakai-icon.js';

export class SakaiOptionsMenu extends LitElement {

  static get styles() {

    return css`
      ::slotted(div) {
        display: none;
        background-color: var(--sakai-options-menu-background-color, white);
        border-width: var(--sakai-options-menu-border-width, 1px);
        border-style: var(--sakai-options-menu-border-style, solid);
        border-color: var(--sakai-options-menu-border-color, black);
        font-family: var(--sakai-options-menu-font-family, arial, sans-serif);
        padding: 5px;
      }
      #invoker {
        color: var(--sakai-options-menu-invoker-color, white);
        font-size: var(--sakai-options-menu-invoker-size, 24px);
      }
    `;
  }

  static get properties() {

    return {
      placement: String,
    };
  }


  constructor() {

    super();
    this.placement = "right";
  }

  firstUpdated(changed) {

    this.content = this.shadowRoot.querySelector('slot[name="content"]').assignedNodes()[0];
    this.content.addEventListener("keydown", (e) => this._handleEscape(e));

    this.invoker = this.shadowRoot.querySelector("#invoker");
    this.invoker.addEventListener("keydown", (e) => this._handleEscape(e));

    createPopper(this.invoker, this.content,
      {
        placement: this.placement,
        modifiers: [
          { name: 'offset', options: { offset: [0, 8] }},
        ]
      }
    );
  }

  _handleEscape(e) {

    if (this.showing && e.key === "Escape") {
      this.content.style.display = "none";
      this.showing = false;
      this.invoker.focus();
    }
  }

  _toggle() {

    if (this.showing) {
      this.content.style.display = "none";
    } else {
      this.content.style.display = "block";
    }
    this.showing = !this.showing;
  }

  render() {

    return html`
      <a id="invoker" href="javascript:;" @click=${this._toggle}><sakai-icon type="menu" size="small" /></a>
      <slot name="content"></slot>
    `;
  }
}

if (!customElements.get("sakai-options-menu")) {
  customElements.define("sakai-options-menu", SakaiOptionsMenu);
}
