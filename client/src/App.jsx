import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null); // Tracks logged-in user
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login/register
  
  // Auth Form State
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });

  // Item Form State
  const [itemForm, setItemForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    type: 'lost',
    contactInfo: ''
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/items');
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const handleItemChange = (e) => {
    setItemForm({ ...itemForm, [e.target.name]: e.target.value });
  };

  // Handle Register / Login Submission
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? 'register' : 'login';
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, authForm);
      alert(isRegistering ? 'Registration successful! Please login.' : 'Logged in successfully!');
      if (!isRegistering) {
        setUser(res.data.user || authForm.email);
      }
      setIsRegistering(false);
      setAuthForm({ name: '', email: '', password: '' });
    } catch (err) {
      console.error("Auth error:", err);
      alert(err.response?.data?.message || 'Authentication failed');
    }
  };

  // Handle Post Item Submission
  const handleItemSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/items/add', itemForm);
      alert('Item posted successfully!');
      setItemForm({ title: '', description: '', category: '', location: '', type: 'lost', contactInfo: '' });
      fetchItems();
    } catch (err) {
      console.error("Error posting item:", err);
      alert('Failed to post item');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1>Campus Lost & Found Portal</h1>

      {/* Authentication Section */}
      {!user ? (
        <div style={{ background: '#eef2f7', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2>{isRegistering ? 'Register New Account' : 'Login'}</h2>
          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {isRegistering && (
              <input type="text" name="name" placeholder="Full Name" value={authForm.name} onChange={handleAuthChange} required style={{ padding: '8px' }} />
            )}
            <input type="email" name="email" placeholder="Email Address" value={authForm.email} onChange={handleAuthChange} required style={{ padding: '8px' }} />
            <input type="password" name="password" placeholder="Password" value={authForm.password} onChange={handleAuthChange} required style={{ padding: '8px' }} />
            
            <button type="submit" style={{ background: '#28a745', color: 'white', padding: '10px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
              {isRegistering ? 'Register' : 'Login'}
            </button>
          </form>
          <p style={{ marginTop: '10px', cursor: 'pointer', color: '#007bff' }} onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Already have an account? Login here' : "Don't have an account? Register here"}
          </p>
        </div>
      ) : (
        <div style={{ background: '#d4edda', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <p>Welcome, <strong>{user}</strong>! <button onClick={() => setUser(null)} style={{ marginLeft: '10px', padding: '5px 10px' }}>Logout</button></p>
        </div>
      )}

      {/* Form to Post Item */}
      <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Report Lost or Found Item</h2>
        <form onSubmit={handleItemSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" name="title" placeholder="Item Title" value={itemForm.title} onChange={handleItemChange} required style={{ padding: '8px' }} />
          <input type="text" name="description" placeholder="Description" value={itemForm.description} onChange={handleItemChange} required style={{ padding: '8px' }} />
          <input type="text" name="category" placeholder="Category (e.g. Electronics, Books)" value={itemForm.category} onChange={handleItemChange} required style={{ padding: '8px' }} />
          <input type="text" name="location" placeholder="Location" value={itemForm.location} onChange={handleItemChange} required style={{ padding: '8px' }} />
          <select name="type" value={itemForm.type} onChange={handleItemChange} style={{ padding: '8px' }}>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          <input type="text" name="contactInfo" placeholder="Contact Info (Email/Phone)" value={itemForm.contactInfo} onChange={handleItemChange} required style={{ padding: '8px' }} />
          <button type="submit" style={{ background: '#007bff', color: 'white', padding: '10px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Post Item</button>
        </form>
      </div>

      {/* List of Items */}
      <h2>Lost & Found Feed</h2>
      {items.length === 0 ? (
        <p>No items reported yet.</p>
      ) : (
        items.map((item) => (
          <div key={item._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '10px', background: item.type === 'lost' ? '#fff0f0' : '#f0fff0' }}>
            <h3>{item.title} ({item.type.toUpperCase()})</h3>
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Category:</strong> {item.category} | <strong>Location:</strong> {item.location}</p>
            <p><strong>Contact:</strong> {item.contactInfo}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;

