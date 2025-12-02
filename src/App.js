import { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    text: '',
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const countText = data.sentTo ? ` to ${data.sentTo} recipient(s)` : '';
        setStatus(`Email sent successfully${countText}!`);
        setFormData({ to: '', subject: '', text: '' });
      } else {
        setStatus(`Failed to send email: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setStatus('Failed to send email. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="background-gradient"></div>
      <main className="main-container">
        <div className="form-wrapper">
          <div className="form-header">
            <h2>Nodemailer</h2>
            <p>Send an email to one or many recipients (up to 1000 at once).</p>
          </div>

          <form onSubmit={handleSubmit} className="contact-form" noValidate>
            <div className="input-group">
              <div className="input-field-wrapper">
                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" /><path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" /></svg>
                <textarea
                  id="to"
                  name="to"
                  className="input-field with-icon"
                  value={formData.to}
                  onChange={handleChange}
                  placeholder="Recipient emails (comma or new-line separated, up to 1000)"
                  rows="4"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-field-wrapper">
                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.5 1.5H2.25A2.25 2.25 0 0 0 0 3.75v16.5A2.25 2.25 0 0 0 2.25 22.5h19.5A2.25 2.25 0 0 0 24 20.25V10.5H10.5V1.5Z" /><path d="M13.5 1.5v6.75A2.25 2.25 0 0 0 15.75 10.5h6.75L13.5 1.5Z" /></svg>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="input-field with-icon"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-field-wrapper">
                <textarea
                  id="text"
                  name="text"
                  className="input-field"
                  value={formData.text}
                  onChange={handleChange}
                  placeholder="Your message..."
                  rows="5"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? <div className="loader"></div> : 'Send Message'}
            </button>
          </form>

          {status && (
            <div className={`status-message ${status.includes('successfully') ? 'success' : 'error'}`}>
              {status}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

