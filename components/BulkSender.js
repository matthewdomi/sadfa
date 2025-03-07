'use client'
// components/BulkSender.js
import { useState } from 'react';
import * as XLSX from 'xlsx';

const BulkSender = () => {
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      
      const extractedContacts = jsonData.map(row => row[0]); // Assuming contacts are in the first column
      setContacts(extractedContacts);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSendMessages = () => {
    contacts.forEach(contact => {
      const url = `https://web.whatsapp.com/send?phone=${contact}&text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    });
  };

  return (
    <div>
      <h2>WhatsApp Bulk Sender</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <textarea
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessages}>Send Messages</button>
      <h3>Contacts:</h3>
      <ul>
        {contacts.map((contact, index) => (
          <li key={index}>{contact}</li>
        ))}
      </ul>
    </div>
  );
};

export default BulkSender;