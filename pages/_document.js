// _document.js
import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
          <script
            async
            defer
            data-website-id="0e366ed0-c658-4496-a1bc-1131393f2d73"
            src="https://tracking.bryanching.net/unagi.js"
          ></script>
        </body>
      </Html>
    )
  }
}
