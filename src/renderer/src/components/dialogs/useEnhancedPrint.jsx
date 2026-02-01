import { useReactToPrint } from 'react-to-print'
import { useCallback } from 'react'

export const useEnhancedPrint = (componentRef, options = {}) => {
  const isElectron = !!window.electronAPI

  const enhancedPrint = useCallback(
    async (printIframe) => {
      if (isElectron) {
        try {
          // Get the printable content
          const content = componentRef.current
          if (!content) {
            throw new Error('No content to print')
          }

          // Create a hidden iframe for printing
          const tempIframe = document.createElement('iframe')
          tempIframe.style.display = 'none'
          document.body.appendChild(tempIframe)

          const iframeDoc = tempIframe.contentWindow.document
          iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print</title>
              <style>
                ${options.styles || ''}
                @media print {
                  ${options.printStyles || ''}
                }
              </style>
            </head>
            <body>
              ${content.innerHTML}
            </body>
          </html>
        `)
          iframeDoc.close()

          // Use Electron's silent print
          const result = await window.electronAPI.printToPrinter({
            silent: true,
            printBackground: true,
            color: true,
            ...options.electronOptions
          })

          // Cleanup
          document.body.removeChild(tempIframe)

          if (!result.success) {
            throw new Error(result.error || 'Print failed')
          }

          return result
        } catch (error) {
          console.error('Electron print failed:', error)
          // Fallback to browser print
          if (printIframe && printIframe.contentWindow) {
            printIframe.contentWindow.print()
          }
          throw error
        }
      } else {
        // Regular browser print
        if (printIframe && printIframe.contentWindow) {
          printIframe.contentWindow.print()
        }
      }
    },
    [isElectron, componentRef, options]
  )

  return useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: options.onBeforeGetContent,
    onAfterPrint: options.onAfterPrint,
    onPrintError: options.onPrintError,
    print: enhancedPrint,
    ...options
  })
}
