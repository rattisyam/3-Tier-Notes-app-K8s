import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || '/api/items';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch items');
      const data = await response.json();
      setItems(data);
      setError('');
    } catch (err) {
      setError('Error loading items: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) throw new Error('Failed to create item');

      setName('');
      setDescription('');
      setError('');
      fetchItems();
    } catch (err) {
      setError('Error creating item: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete item');

      setError('');
      fetchItems();
    } catch (err) {
      setError('Error deleting item: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 3-Tier Kubernetes Application</h1>
        <p>React + Spring Boot + PostgreSQL</p>
      </header>

      <main className="container">
        {error && <div className="error">{error}</div>}

        <section className="form-section">
          <h2>Add New Item</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                rows="3"
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Add Item'}
            </button>
          </form>
        </section>

        <section className="items-section">
          <h2>Items ({items.length})</h2>
          {loading && items.length === 0 ? (
            <p>Loading...</p>
          ) : items.length === 0 ? (
            <p className="empty">No items yet. Add one above!</p>
          ) : (
            <div className="items-grid">
              {items.map((item) => (
                <div key={item.id} className="item-card">
                  <h3>{item.name}</h3>
                  <p>{item.description || 'No description'}</p>
                  <div className="item-footer">
                    <small>ID: {item.id}</small>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={loading}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
