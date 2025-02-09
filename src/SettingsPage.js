import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        <form onSubmit={handleSubmit}>
            <label>
                Show Songs:
                <input type="checkbox" name="showSongs" checked={settings.showSongs} onChange={handleChange} />
            </label>
            <label>
                Show Events:
                <input type="checkbox" name="showEvents" checked={settings.showEvents} onChange={handleChange} />
            </label>
            <label>
                Show Contact Link:
                <input type="checkbox" name="showContact" checked={settings.showContact} onChange={handleChange} />
            </label>
            <label>
                Contact Link:
                <input type="text" name="contactLink" value={settings.contactLink} onChange={handleChange} />
            </label>
            <button type="submit">Save Settings</button>
        </form>
    );
};

export default SettingsPage;