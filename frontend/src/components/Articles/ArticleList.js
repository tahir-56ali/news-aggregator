import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const ArticleList = () => {
    const defaultImage = 'https://via.placeholder.com/300x200?text=No+Image';
    const { user } = useAuth();  // Check if the user is logged in
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [prevPageUrl, setPrevPageUrl] = useState(null);
    const [searchParams, setSearchParams] = useState({
        keyword: '',
        category: '',
        source: '',
        author: '',
        date: '',
        page: 1, // Set default page as 1
    });
    const [formState, setFormState] = useState({
        keyword: '',
        category: '',
        source: '',
        author: '',
        date: '',
        page: 1,
    });
    const [availableSources, setAvailableSources] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [availableAuthors, setavailableAuthors] = useState([]);

    const fetchArticles = useCallback(async (page = 1, params) => {
        setLoading(true);
        setError(null);

        try {
            let response;

            // Fetch personalized news if user is logged in
            if (user) {
                response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/articles/personalized`, {
                    params: { ...params, page }, // Include the current page in the request
                });
            } else {
                response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/articles`, {
                    params: { ...params, page }, // Include the current page in the request
                });
            }

            setArticles(response.data.data);
            setTotalPages(response.data.last_page);
            setCurrentPage(response.data.current_page);
            setNextPageUrl(response.data.next_page_url);
            setPrevPageUrl(response.data.prev_page_url);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching articles. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    const fetchOptions = async () => {
        let sources;
        let categories;
        let authors;

        // Fetch user's sources, categories and authors
        if (user) {
            sources = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/sources`);
            categories = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/categories`);
            authors = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/authors`);
        } else {
            sources = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/sources`);
            categories = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/categories`);
            authors = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/authors`);
        }

        setAvailableSources(sources.data);
        setAvailableCategories(categories.data);
        setavailableAuthors(authors.data);
    };

    useEffect(() => {
        fetchArticles(currentPage, searchParams); // Fetch articles on component load or page change
        fetchOptions();
    }, [currentPage, fetchArticles, searchParams, fetchOptions]);

    const handlePageChange = (url) => {
        if (url) {
            const page = new URLSearchParams(new URL(url).search).get('page');
            setSearchParams((prevParams) => ({ ...prevParams, page: Number(page) })); // Update the page in searchParams
            setCurrentPage(Number(page));
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page when searching
        setSearchParams(formState);  // Update searchParams when Search button is clicked
        fetchArticles(1, formState); // Fetch articles with the updated search params from the first page
    };

    // Handle Clear Filters
    const handleClear = () => {
        // Clear filters in searchParams and reset the current page
        const clearedParams = {
            keyword: '',
            category: '',
            source: '',
            author: '',
            date: '',
            page: 1
        };

        // Set cleared filters and update the page
        setFormState(clearedParams);  // Clear the form inputs
        setSearchParams(clearedParams);
        setCurrentPage(1);

        // Fetch articles without filters by passing the clearedParams directly
        fetchArticles(1, clearedParams);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState({ ...formState, [name]: value });  // Update formState
    };

    // Pagination logic to show limited number of pages
    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        const half = Math.floor(maxPagesToShow / 2);

        let startPage = Math.max(1, currentPage - half);
        let endPage = Math.min(totalPages, currentPage + half);

        if (currentPage - half <= 0) {
            endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        }

        if (totalPages - currentPage < half) {
            startPage = Math.max(1, totalPages - maxPagesToShow + 1);
        }

        if (startPage > 1) {
            pageNumbers.push(<li key="start-ellipsis" className="page-item disabled"><span className="page-link">...</span></li>);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => fetchArticles(i, searchParams)}>
                        {i}
                    </button>
                </li>
            );
        }

        if (endPage < totalPages) {
            pageNumbers.push(<li key="end-ellipsis" className="page-item disabled"><span className="page-link">...</span></li>);
        }

        return pageNumbers;
    };

    return (
        <div>
            <div className="card mb-4 p-4 shadow-sm">
                <h2 className="text-center mb-4">Search Articles</h2>
                <form onSubmit={handleSearch}>
                    <div className="row">
                        <div className="col-md-2 col-sm-6">
                            <label htmlFor="keyword" className="form-label">Keyword</label>
                            <input
                                type="text"
                                className="form-control"
                                id="keyword"
                                name="keyword"
                                value={formState.keyword}
                                onChange={handleChange}
                                placeholder="Search by keyword"
                            />
                        </div>
                        <div className="col-md-2 col-sm-6">
                            <label htmlFor="category" className="form-label">Category</label>
                            <select
                                className="form-control"
                                id="category"
                                name="category"
                                value={formState.category}
                                onChange={handleChange}
                            >
                                <option value="">Select Category</option>
                                {Array.isArray(availableCategories) && availableCategories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2 col-sm-6">
                            <label htmlFor="source" className="form-label">Source</label>
                            <select
                                className="form-control"
                                id="source"
                                name="source"
                                value={formState.source}
                                onChange={handleChange}
                            >
                                <option value="">Select Source</option>
                                {Array.isArray(availableSources) && availableSources.map((source) => (
                                    <option key={source} value={source}>
                                        {source}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2 col-sm-6">
                            <label htmlFor="author" className="form-label">Author</label>
                            <select
                                className="form-control"
                                id="author"
                                name="author"
                                value={formState.author}
                                onChange={handleChange}
                            >
                                <option value="">Select Author</option>
                                {Array.isArray(availableAuthors) && availableAuthors.map((author) => (
                                    <option key={author} value={author}>
                                        {author}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2 col-sm-6">
                            <label htmlFor="date" className="form-label">Published Date</label>
                            <input
                                type="date"
                                className="form-control"
                                id="date"
                                name="date"
                                value={formState.date}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-12 d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary me-2">
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={handleClear}>
                                Clear
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {error && <p className="text-danger text-center">{error}</p>}

            <div className="row">
                {loading && <p>Loading articles...</p>}
                {articles.length > 0 ? (
                    articles.map((article) => (
                        <div className="col-12 col-md-4 mb-3" key={article.id}>
                            <div className="card h-100">
                                <img
                                    src={article.image_url || defaultImage}
                                    className="card-img-top img-fluid"
                                    alt={article.title}
                                    onError={(e) => { e.target.src = defaultImage; }}  // Handle broken images
                                    loading="lazy"  // Lazy loading for better performance
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{article.title}</h5>
                                    <p className="card-text">
                                        <small className="text-muted">By: {article.author}</small><br />
                                        <small className="text-muted">Category: {article.category}</small>
                                    </p>
                                    <p className="card-text">
                                        <small
                                            className="text-muted">{article.source} | {new Date(article.published_at).toLocaleDateString()}</small>
                                    </p>
                                    <a href={article.article_url} target="_blank" rel="noopener noreferrer"
                                       className="btn btn-primary mt-auto">
                                        Read More
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No articles found.</p>
                )}
            </div>

            {/* Pagination Controls */}
            <nav>
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${prevPageUrl ? '' : 'disabled'}`}>
                        <button className="page-link" onClick={() => handlePageChange(prevPageUrl)}>
                            Previous
                        </button>
                    </li>
                    {renderPageNumbers()} {/* Render limited number of page numbers */}
                    <li className={`page-item ${nextPageUrl ? '' : 'disabled'}`}>
                        <button className="page-link" onClick={() => handlePageChange(nextPageUrl)}>
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default ArticleList;
