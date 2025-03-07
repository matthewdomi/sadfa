'use client'; // This is necessary for Next.js 13+ to indicate client-side rendering
import { useState } from 'react';
import * as XLSX from 'xlsx';
import './BulkSender.css'; // Import the CSS file for styles

const BulkSender = () => {
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [manualContact, setManualContact] = useState(''); // State for manual contact input

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setError('Please upload a valid Excel file.');
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      
      const extractedContacts = jsonData.map(row => row[0]).filter(contact => contact); // Filter out empty contacts
      setContacts(extractedContacts);
      setError(''); // Clear any previous errors
    };

    reader.readAsArrayBuffer(file);
  };

  const handleManualContactChange = (event) => {
    setManualContact(event.target.value); // Update manual contact input
  };

  const addManualContacts = () => {
    const newContacts = manualContact.split(',').map(contact => contact.trim()).filter(contact => contact);
    setContacts(prevContacts => [...prevContacts, ...newContacts]); // Add new contacts to the existing list
    setManualContact(''); // Clear the input field
  };

  const handleSendMessages = () => {
    if (contacts.length === 0) {
      setError('No contacts to send messages to. Please upload a file or enter contacts.');
      return;
    }
    if (!message) {
      setError('Please enter a message to send.');
      return;
    }

    contacts.forEach(contact => {
      const url = `https://web.whatsapp.com/send?phone=${contact}&text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    });
    setError(''); // Clear any previous errors
  };

  return (
    <div className="bulk-sender-container">
      <h2>WhatsApp Bulk Sender</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      
      <textarea
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      
      <input
        type="text"
        placeholder="Add contacts manually (comma separated)"
        value={manualContact}
        onChange={handleManualContactChange}
      />
      <button onClick={addManualContacts}>Add Contacts</button>
      
      <button onClick={handleSendMessages}>Send Messages</button>
      {error && <p className="error-message">{error}</p>} {/* Display error messages */}
      
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