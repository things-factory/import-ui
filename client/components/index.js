export * from './import-pop-up'
import { i18next } from '@things-factory/i18n-base'
import { openPopup } from '@things-factory/layout-base'
import { html } from 'lit-element'

export function openImportPopUp(records, config, importHandler) {
  if (!records || !config || !importHandler || typeof importHandler !== 'function') {
    throw new Error('Invalid parameter to open up import dialog')
  }

  openPopup(
    html`
      <import-pop-up .records="${records}" .config="${config}" .importHandler="${importHandler}"></import-pop-up>
    `,
    {
      backdrop: true,
      size: 'large',
      title: i18next.t('title.import')
    }
  )
}
