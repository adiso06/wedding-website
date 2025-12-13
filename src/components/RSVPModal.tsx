import React, { useState } from 'react';
import './RSVPModal.css';

interface RSVPModalProps {
  onClose: () => void;
}

const RSVPModal: React.FC<RSVPModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attendance: '',
    guests: '1',
    dietaryRestrictions: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would submit to a backend
    console.log('RSVP Submitted:', formData);
    alert('Thank you for your RSVP! A confirmation has been sent to your email.');
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header border-bottom">
          <h2 className="modal-title">SUBSCRIPTION FORM</h2>
          <p className="modal-subtitle">
            Official RSVP · Attendance Confirmation Required
          </p>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="rsvp-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <label className="form-label" htmlFor="name">
              FULL NAME *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="First and Last Name"
            />
          </div>

          <div className="form-section">
            <label className="form-label" htmlFor="email">
              EMAIL ADDRESS *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
            />
          </div>

          <div className="form-section">
            <label className="form-label" htmlFor="attendance">
              ATTENDANCE STATUS *
            </label>
            <select
              id="attendance"
              name="attendance"
              className="form-select"
              required
              value={formData.attendance}
              onChange={handleChange}
            >
              <option value="">Select an option</option>
              <option value="attending">Joyfully Accepts</option>
              <option value="not-attending">Regretfully Declines</option>
            </select>
          </div>

          {formData.attendance === 'attending' && (
            <>
              <div className="form-section">
                <label className="form-label" htmlFor="guests">
                  NUMBER OF GUESTS
                </label>
                <select
                  id="guests"
                  name="guests"
                  className="form-select"
                  value={formData.guests}
                  onChange={handleChange}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                </select>
              </div>

              <div className="form-section">
                <label className="form-label" htmlFor="dietaryRestrictions">
                  DIETARY RESTRICTIONS
                </label>
                <input
                  type="text"
                  id="dietaryRestrictions"
                  name="dietaryRestrictions"
                  className="form-input"
                  value={formData.dietaryRestrictions}
                  onChange={handleChange}
                  placeholder="Vegetarian, vegan, allergies, etc."
                />
              </div>
            </>
          )}

          <div className="form-section">
            <label className="form-label" htmlFor="message">
              MESSAGE TO THE COUPLE
            </label>
            <textarea
              id="message"
              name="message"
              className="form-textarea"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Share your well wishes, song requests, or advice for the newlyweds..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="form-submit">
              SUBMIT RSVP
            </button>
            <button type="button" className="secondary" onClick={onClose}>
              CANCEL
            </button>
          </div>

          <p className="form-note">
            * Required fields · Deadline: August 1st, 2024
          </p>
        </form>
      </div>
    </div>
  );
};

export default RSVPModal;
