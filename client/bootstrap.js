import { store } from '@things-factory/shell'
import { html } from 'lit-html'
import '@material/mwc-button/mwc-button'
import { APPEND_CONTEXT_TOOL, TOOL_POSITION } from '@things-factory/layout-base'
import { IMPORT } from '@things-factory/import-base'

function onFileChanged(event) {
  const fileObj = event.currentTarget.files[0]
  const extension = fileObj.name.split('.').pop()

  const reader = new FileReader()

  // Ready The Event For When A File Gets Selected
  reader.onload = function(e) {
    const data = e.target.result
    const state = store.getState()

    store.dispatch({
      type: IMPORT,
      importable: {
        extension,
        ...state.route.context.importable
      },
      data
    })
  }

  // Tell JS To Start Reading The File.. You could delay this if desired
  reader.readAsBinaryString(fileObj)
}

function uploadFile() {
  const state = store.getState()
  if (!state.importing || !state.importing.extensions || Object.keys(state.importing.extensions).length === 0) return

  const fileTypes = Object.keys(state.importing.extensions).map(fileType => `.${fileType}`)
  const fileUpload = document.createElement('input')
  fileUpload.setAttribute('type', 'file')
  fileUpload.setAttribute('accept', fileTypes)
  fileUpload.hidden = true
  fileUpload.addEventListener('change', onFileChanged)
  document.body.appendChild(fileUpload)
  fileUpload.click()
}

export default function bootstrap() {
  import('./components/import-context-ui')
  store.dispatch({
    type: APPEND_CONTEXT_TOOL,
    tool: {
      position: TOOL_POSITION.REAR_END,
      template: html`
        <mwc-button
          style="margin:auto 0;"
          @click="${() => {
            uploadFile()
          }}"
          >import</mwc-button
        >
      `,
      context: 'importable'
    }
  })
}
