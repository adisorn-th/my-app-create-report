import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* เพิ่ม Google Fonts สำหรับฟอนต์ที่ต้องการ */}
          <link
            href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&family=Raleway:wght@400;700&family=Montserrat:wght@400;700&family=Lato:wght@400;700&family=Rubik:wght@400;700&family=Roboto:wght@400;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;