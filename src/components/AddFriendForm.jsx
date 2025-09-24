import { useState } from 'react';
import axios from 'axios';
import './AddFriendForm.css';
import { Toaster, toast } from 'react-hot-toast';

function AddFriendForm({ refresh }) {
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');

  const handleAdd = async () => {
    if (!name.trim()) return toast.error('Enter friend name', {
      style: {
        border: '3px solid #bb86fc',
        padding: '16px',
        color: '#bb86fc',
        background: '#272727'
      },
      iconTheme: {
        primary: '#bb86fc',
        secondary: '#272727',
      },
    });
    if (!mail.trim()) return toast.error('Enter friend email', {
      style: {
        border: '3px solid #bb86fc',
        padding: '16px',
        color: '#bb86fc',
        background: '#272727'
      },
      iconTheme: {
        primary: '#bb86fc',
        secondary: '#272727',
      },
    });

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to add a friend.');
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE}/friends/add`,
        { name, mail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setName('');
      setMail('');
      refresh();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        // Optionally redirect to login page here
      } else {
        console.error(err);
        alert('Failed to add friend. Please try again.');
      }
    }
  };

  return (
    <div className="add-friend-form noprint">
      <h2>Add Friend</h2>
      <input
        type="text"
        value={name}
        placeholder="Friend's Name"
        className="input-field"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        value={mail}
        placeholder="Friend's Email"
        className="input-field"
        onChange={(e) => setMail(e.target.value)}
      />
      <button onClick={handleAdd}>Add Friend</button>
    </div>
  );
}

export default AddFriendForm;
