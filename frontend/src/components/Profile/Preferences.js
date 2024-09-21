import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Preferences = () => {
    const [preferences, setPreferences] = useState({
        preferred_sources: [],
        preferred_categories: [],
        preferred_authors: [],
    });

    const [availableSources, setAvailableSources] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [availableAuthors, setAvailableAuthors] = useState([]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch available options for sources, categories, and authors
        const fetchOptions = async () => {
            const sources = await axios.get('http://localhost:8080/api/sources');
            const categories = await axios.get('http://localhost:8080/api/categories');
            const authors = await axios.get('http://localhost:8080/api/authors');

            setAvailableSources(sources.data);
            setAvailableCategories(categories.data);
            setAvailableAuthors(authors.data);
        };

        const fetchPreferences = async () => {
            const response = await axios.get('http://localhost:8080/api/user/preferences');
            setPreferences(response.data);
        };

        fetchOptions();
        fetchPreferences();
    }, []);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;

        setPreferences((prevPreferences) => {
            const newValue = checked
                ? [...prevPreferences[name], value]
                : prevPreferences[name].filter((item) => item !== value);

            return { ...prevPreferences, [name]: newValue };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/user/preferences', preferences);
            setMessage('Preferences saved successfully!');
        } catch (err) {
            setMessage('Error saving preferences.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Set Your News Preferences</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Preferred Sources</label>
                    {availableSources.map((source) => (
                        <div key={source} className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={source}
                                name="preferred_sources"
                                value={source}
                                checked={preferences.preferred_sources.includes(source)}
                                onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor={source}>
                                {source}
                            </label>
                        </div>
                    ))}
                </div>

                <div className="form-group">
                    <label>Preferred Categories</label>
                    {availableCategories.map((category) => (
                        <div key={category} className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={category}
                                name="preferred_categories"
                                value={category}
                                checked={preferences.preferred_categories.includes(category)}
                                onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor={category}>
                                {category}
                            </label>
                        </div>
                    ))}
                </div>

                <div className="form-group">
                    <label>Preferred Authors</label>
                    {availableAuthors.map((author) => (
                        <div key={author} className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={author}
                                name="preferred_authors"
                                value={author}
                                checked={preferences.preferred_authors.includes(author)}
                                onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor={author}>
                                {author}
                            </label>
                        </div>
                    ))}
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Preferences'}
                </button>
            </form>

            {message && <p className="mt-3">{message}</p>}
        </div>
    );
};

export default Preferences;
