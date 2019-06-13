import { IMPORT } from '@things-factory/import-base'
import { html, LitElement } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { store } from '@things-factory/shell'

class ImportContextUi extends connect(store)(LitElement) {
  static get properties() {
    return {
      importUi: String
    }
  }
  render() {
    return html`
      <section>
        <h2>ImportUi</h2>
      </section>
    `
  }

  stateChanged(state) {
    this.importUi = state.importUi.state_main
  }
}

window.customElements.define('import-context-ui', ImportContextUi)
