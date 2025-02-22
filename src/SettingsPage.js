import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SettingsPage.css'; // Import the CSS file

const SettingsPage = ({ auth0Id }) => {
    const [settings, setSettings] = useState({
        showSongs: true,
        showEvents: true,
        showContact: true,
        contactLink: ''
    });

    // Fetch current settings when the component mounts
    useEffect(() => {
        if (auth0Id) {
            axios.get(`http://localhost:5001/api/user/profile?auth0Id=${auth0Id}`)
                .then(response => {
                    const userSettings = response.data.settings || {};
                    setSettings({
                        showSongs: userSettings.showSongs !== undefined ? userSettings.showSongs : true,
                        showEvents: userSettings.showEvents !== undefined ? userSettings.showEvents : true,
                        showContact: userSettings.showContact !== undefined ? userSettings.showContact : true,
                        contactLink: userSettings.contactLink || ''
                    });
                })
                .catch(error => console.error('Error fetching settings:', error));
        }
    }, [auth0Id]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5001/api/user/settings', {
            auth0Id: auth0Id,
            settings: settings
        })
        .then(response => {
            alert('Settings updated successfully!');
            window.location.reload();  // Refresh the page to reflect changes
        })
        .catch(error => {
            console.error('Error updating settings:', error);
            alert('Failed to update settings. Check the console for details.');
        });
    };

    return (
        <div className="settings-container">
            <h2>Settings</h2>
            <form onSubmit={handleSubmit} className="settings-form">
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            name="showSongs"
                            checked={settings.showSongs}
                            onChange={handleChange}
                        />
                        Show Songs
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            name="showEvents"
                            checked={settings.showEvents}
                            onChange={handleChange}
                        />
                        Show Events
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            name="showContact"
                            checked={settings.showContact}
                            onChange={handleChange}
                        />
                        Show Contact Link
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Contact Link:
                        <input
                            type="text"
                            name="contactLink"
                            value={settings.contactLink}
                            onChange={handleChange}
                            placeholder="Enter your contact link"
                        />
                    </label>
                </div>
                <button type="submit" className="save-button">Save Settings</button>
            </form>
        </div>
    );
};

export default SettingsPage;