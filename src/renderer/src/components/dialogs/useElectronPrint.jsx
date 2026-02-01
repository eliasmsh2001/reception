import { useReactToPrint } from 'react-to-print'
import { useCallback } from 'react'

export const useElectronPrint = () => {
  const printWithElectron = useCallback((content, options = {}) => {
    return new Promise((resolve, reject) => {
      if (!window.electronAPI) {
        // Fallback to browser print if not in Electron
        reject(new Error('Not in Electron environment'))
        return
      }

      // Get the HTML content from the ref
      const printContent = content.current
      if (!printContent) {
        reject(new Error('No content to print'))
        return
      }

      // Create a temporary iframe to isolate print styles
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      document.body.appendChild(iframe)

      const printDocument = iframe.contentWindow.document

      // Write the content to the iframe
      printDocument.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print</title>
            <style>
              ${options.styles || ''}
              @media print {
                body { margin: 0; }
                ${options.printStyles || ''}
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `)
      printDocument.close()

      // Use Electron's silent printing
      window.electronAPI
        .printToPrinter({
          silent: true,
          printBackground: true,
          color: true,
          ...options.printOptions
        })
        .then((result) => {
          // Clean up
          document.body.removeChild(iframe)

          if (result.success) {
            resolve()
          } else {
            reject(new Error(result.error || 'Print failed'))
          }
        })
        .catch((error) => {
          document.body.removeChild(iframe)
          reject(error)
        })
    })
  }, [])

  return printWithElectron
}
