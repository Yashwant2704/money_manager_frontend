import { useState } from 'react';
import axios from 'axios';
import './AddFriendForm.css';

function AddFriendForm({ refresh }) {
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return alert('Enter friend name');
    axios.post(`${import.meta.env.VITE_API_BASE}/friends/add`, { name })
      .then(() => {
        setName('');
        refresh();
      }).catch(err => console.error(err));
  };

  return (
    <div className="add-friend-form">
      <h2>Add Friend</h2>
      <input
        type="text"
        value={name}
        placeholder="Friend's Name"
        className="input-field"
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleAdd}>Add Friend</button>
    </div>
  );
}

export default AddFriendForm;
