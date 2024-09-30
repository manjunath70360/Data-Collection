import React, { useState } from 'react';
import axios from 'axios';
import './App.css';  

const App = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/users/create', {
        name,
        address,
      });

      setResponseMessage(response.data.message);
      setName('');
      setAddress('');
    } catch (error) {
      setResponseMessage('Error: Unable to submit data');
      console.error(error);
    }
  };

  const clearResponseMessage = () => {
    setResponseMessage('');
  };

  return (
    <div className="form-container">
      <h2 className="form-title">User Address Form</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => {setName(e.target.value);clearResponseMessage()}}
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <textarea
            className="form-textarea"
            value={address}
            onChange={(e) => {setAddress(e.target.value); clearResponseMessage()}}
            placeholder="Enter your address"
            required
          />
        </div>
        <button type="submit" className="form-button">Submit</button>
      </form>
      {responseMessage && <p className="response-message">{responseMessage}</p>}
    </div>
  );
};

export default App;
