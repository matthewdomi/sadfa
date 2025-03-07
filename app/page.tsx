// pages/index.js
import Head from 'next/head';
import BulkSender from '../components/BulkSender';

export default function Home() {
  return (
    <div>
      <Head>
        <title>WhatsApp Bulk Sender</title>
        <meta name="description" content="Send bulk messages on WhatsApp" />
      </Head>
      <main>
        <BulkSender />
      </main>
    </div>
  );
}