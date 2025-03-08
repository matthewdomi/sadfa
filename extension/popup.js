document.getElementById('file-upload').addEventListener('change', handleFileUpload);
document.getElementById('add-contacts').addEventListener('click', addManualContacts);
document.getElementById('send-messages').addEventListener('click', handleSendMessages);

let contacts = [];
let message = '';

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        showError('Please upload a valid Excel file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        contacts = jsonData.map(row => row[0]).filter(contact => contact);
        updateContactsList();
        clearError();
    };

    reader.readAsArrayBuffer(file);
}

function addManualContacts() {
    const manualContact = document.getElementById('manual-contact').value;
    const newContacts = manualContact.split(',').map(contact => contact.trim()).filter(contact => contact);
    contacts = [...contacts, ...newContacts];
    updateContactsList();
    document.getElementById('manual-contact').value = ''; // Clear input
}

function handleSendMessages() {
    message = document.getElementById('message').value;
    if (contacts.length === 0) {
        showError('No contacts to send messages to. Please upload a file or enter contacts.');
        return;
    }
    if (!message) {
        showError('Please enter a message to send.');
        return;
    }

    contacts.forEach(contact => {
        const url = `https://web.whatsapp.com/send?phone=${contact}&text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    });
    clearError();
}

function updateContactsList() {
    const contactsList = document.getElementById('contacts-list');
    contactsList.innerHTML = '';

    document.getElementById('send-messages').addEventListener('click', handleSendMessages);
}

function handleSendMessages() {
    // Your existing code for handling messages...

    // After sending messages, you can open WhatsApp Web
    chrome.runtime.sendMessage({ action: "openWhatsApp" }, (response) => {
        console.log(response.status); // Optional: Log the response
    });
}