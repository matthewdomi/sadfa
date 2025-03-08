'use client'; // This is necessary for Next.js 13+ to indicate client-side rendering
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import './BulkSender.css'; // Import the CSS file for styles

const BulkSender = () => {
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [manualContact, setManualContact] = useState(''); // State for manual contact input
  const [images, setImages] = useState([]); // State for uploaded images
  const [imagePreviews, setImagePreviews] = useState([]); // State for image preview URLs

  // Load data from localStorage when the component mounts
  useEffect(() => {
    const savedContacts = localStorage.getItem('contacts');
    const savedMessage = localStorage.getItem('message');
    const savedImagePreviews = JSON.parse(localStorage.getItem('imagePreviews'));

    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
    if (savedMessage) {
      setMessage(savedMessage);
    }
    if (savedImagePreviews) {
      setImagePreviews(savedImagePreviews); // Load image previews directly
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
    localStorage.setItem('message', message);
    localStorage.setItem('imagePreviews', JSON.stringify(imagePreviews)); // Save image previews
  }, [contacts, message, imagePreviews]);

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

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = [];
    const newImagePreviews = [];

    files.forEach(file => {
      if (file) {
        newImages.push(file);
        const previewUrl = URL.createObjectURL(file);
        newImagePreviews.push(previewUrl); // Set the preview URL
      }
    });

    setImages(prevImages => [...prevImages, ...newImages]); // Add new images to the existing list
    setImagePreviews(prevPreviews => [...prevPreviews, ...newImagePreviews]); // Add new previews
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

    // Provide instructions for sending the images
    if (images.length > 0) {
      alert(`Please manually send the uploaded images after sending the message.`);
    }

    setError(''); // Clear any previous errors
  };

  const handleDeleteImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index)); // Remove the image from the array
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index)); // Remove the preview from the array
  };

  return (
    <div className="bulk-sender-container">
      <h2>WhatsApp Bulk Sender</h2>
      
      {/* Image Upload Section */}
      <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
        {imagePreviews.map((preview, index) => (
          <div key={index} style={{ position: 'relative', margin: '5px' }}>
            <img src={preview} alt={`Image Preview ${index + 1}`} style={{ width: '100px', height: '100px', borderRadius: '5px' }} />
            <button onClick={() => handleDeleteImage(index)} style={{ position: 'absolute', top: '0', right: '0', background: 'red', color: 'white'}} > delete</button>
      </div>
        ))}


      </div>
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