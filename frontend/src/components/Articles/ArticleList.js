import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ArticleList = () => {
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
        date: '',
        page: 1, // Set default page as 1
    });

    const fetchArticles = async (page = 1) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('http://localhost:8080/api/articles', {
                params: { ...searchParams, page }, // Include the current page in the request
            });
            setArticles(response.data.data);
            setTotalPages(response.data.last_page);
            setCurrentPage(response.data.current_page);
            setNextPageUrl(response.data.next_page_url);
            setPrevPageUrl(response.data.prev_page_url);
        } catch (err) {
            setError('Error fetching articles. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles(currentPage); // Fetch articles on component load or page change
    }, [currentPage]);

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
        fetchArticles(1); // Fetch articles with the updated search params from the first page
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchParams({ ...searchParams, [name]: value });
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
                    <button className="page-link" onClick={() => fetchArticles(i)}>
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
                        <div className="col-md-3 mb-3">
                            <label htmlFor="keyword" className="form-label">Keyword</label>
                            <input
                                type="text"
                                className="form-control"
                                id="keyword"
                                name="keyword"
                                value={searchParams.keyword}
                                onChange={handleChange}
                                placeholder="Search by keyword"
                            />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label htmlFor="category" className="form-label">Category</label>
                            <input
                                type="text"
                                className="form-control"
                                id="category"
                                name="category"
                                value={searchParams.category}
                                onChange={handleChange}
                                placeholder="Search by category"
                            />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label htmlFor="source" className="form-label">Source</label>
                            <input
                                type="text"
                                className="form-control"
                                id="source"
                                name="source"
                                value={searchParams.source}
                                onChange={handleChange}
                                placeholder="Search by source"
                            />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label htmlFor="date" className="form-label">Date</label>
                            <input
                                type="date"
                                className="form-control"
                                id="date"
                                name="date"
                                value={searchParams.date}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary px-4 py-2">
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </form>
            </div>

            {error && <p className="text-danger text-center">{error}</p>}

            <div className="row">
                {loading ? (
                    <p>Loading articles...</p>
                ) : articles.length > 0 ? (
                    articles.map((article) => (
                        <div className="col-12 col-md-4 mb-3" key={article.id}>
                            <div className="card h-100">
                                {article.image_url && (
                                    <img src={article.image_url} className="card-img-top img-fluid"
                                         alt={article.title}/>
                                )}
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
