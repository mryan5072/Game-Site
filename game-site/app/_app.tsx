import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Add your meta tags here */}
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          {/* Add other links or scripts if needed */}
        </Head>
        <body>
          <Main /> {/* This is where the main app will be rendered */}
          <NextScript /> {/* This includes Next.js scripts */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;