import '@material/mwc-button/mwc-button'
import '@things-factory/grist-ui'
import { i18next, localize } from '@things-factory/i18n-base'
import { CustomAlert } from '@things-factory/shell'
import { ScrollbarStyles } from '@things-factory/styles'
import { isMobileDevice } from '@things-factory/utils'
import { css, html, LitElement } from 'lit-element'

class ImportPopUp extends localize(i18next)(LitElement) {
  static get properties() {
    return {
      importHandler: Object,
      config: Object,
      _config: Object,
      records: Array
    }
  }

  static get styles() {
    return [
      ScrollbarStyles,
      css`
        :host {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background-color: white;
        }

        .grist {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow-y: auto;
        }
        data-grist {
          overflow-y: hidden;
          flex: 1;
        }
        h2 {
          padding: var(--subtitle-padding);
          font: var(--subtitle-font);
          color: var(--subtitle-text-color);
          border-bottom: var(--subtitle-border-bottom);
        }
        .button-container {
          display: flex;
          margin-left: auto;
        }
        .button-container > mwc-button {
          padding: 10px;
        }
      `
    ]
  }

  get dataGrist() {
    return this.shadowRoot.querySelector('data-grist')
  }

  render() {
    return html`
      <div class="grist">
        <data-grist .mode=${isMobileDevice() ? 'LIST' : 'GRID'} .config=${this._config}></data-grist>
      </div>

      <div class="button-container">
        <mwc-button
          @click=${async () => {
            const patches = this.getCurrentRecord()
            if (patches.length) {
              const answer = await CustomAlert({
                title: i18next.t('label.import'),
                text: i18next.t('text.are_you_sure'),
                confirmButton: { text: i18next.t('button.import') },
                cancelButton: { text: i18next.t('button.cancel') }
              })

              if (!answer.value) return

              this.importHandler(patches)
            } else {
              CustomAlert({
                title: i18next.t('text.nothing_selected'),
                text: i18next.t('text.there_is_nothing_to_save')
              })
            }
          }}
          >${i18next.t('button.import')}</mwc-button
        >
        <mwc-button @click=${e => history.back()}>${i18next.t('button.cancel')}</mwc-button>
      </div>
    `
  }

  updated(changedProps) {
    if (changedProps.has('config')) {
      const columns = ((this.config && this.config.columns) || []).filter(c => c.type !== 'gutter')

      this._config = {
        ...this.config,
        pagination: { infinite: true },
        columns: [{ type: 'gutter', gutterName: 'row-selector', multiple: true }, ...columns]
      }
    }
  }

  firstUpdated() {
    this.dataGrist.data = {
      records: this.records,
      total: this.records.length
    }
  }

  getCurrentRecord() {
    // 1. Check whether there are selected records
    let selectedRecords = this.dataGrist.selected
    const reg = /__\w+__/
    selectedRecords = selectedRecords.map(record => {
      const tempRecord = { cuFlag: '+' }
      for (let key in record) {
        if (!reg.test(key)) {
          tempRecord[key] = record[key]
        }
      }

      return tempRecord
    })

    return selectedRecords
  }
}

window.customElements.define('import-pop-up', ImportPopUp)
