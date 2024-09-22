import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

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
        const {name, value, checked} = e.target;

        setPreferences((prevPreferences) => {
            const newValue = checked
                ? [...prevPreferences[name], value]
                : prevPreferences[name].filter((item) => item !== value);

            return {...prevPreferences, [name]: newValue};
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            axios.defaults.headers.common['X-XSRF-TOKEN'] = Cookies.get('XSRF-TOKEN');
            await axios.post('http://localhost:8080/api/user/preferences', preferences);
            setMessage('Preferences saved successfully!');
        } catch (err) {
            setMessage('Error saving preferences.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">

            <form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-primary fw-bold">Set Your News Preferences</h2>
                    <button type="submit" className="btn btn-primary px-4 py-2 fw-bold" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>
                {message && <p className="mt-3">{message}</p>}
                <div className="row mb-4">
                    <div className="col-md-4">
                        <h5 className="fw-bold text-secondary">Preferred Sources</h5>
                        <div className="form-check">
                            {availableSources.map((source, index) => (
                                <div key={index} className="mb-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={source}
                                        id={source}
                                        name="preferred_sources"
                                        checked={preferences.preferred_sources.includes(source)}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor={source}>
                                        {source}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-md-4">
                        <h5 className="fw-bold text-secondary">Preferred Categories</h5>
                        <div className="form-check">
                            {availableCategories.map((category, index) => (
                                <div key={index} className="mb-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={category}
                                        id={category}
                                        name="preferred_categories"
                                        checked={preferences.preferred_categories.includes(category)}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor={category}>
                                        {category}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-md-4">
                        <h5 className="fw-bold text-secondary">Preferred Authors</h5>
                        <div className="form-check">
                            {availableAuthors.map((author, index) => (
                                <div key={index} className="mb-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={author}
                                        id={author}
                                        name="preferred_authors"
                                        checked={preferences.preferred_authors.includes(author)}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor={author}>
                                        {author}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Preferences;
