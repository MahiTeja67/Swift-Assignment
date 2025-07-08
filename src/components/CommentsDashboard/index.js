import { Component } from 'react';
import { RxCaretSort } from "react-icons/rx";
import { FaChevronUp,FaChevronDown  } from "react-icons/fa";
import {FiSearch} from 'react-icons/fi'
import './index.css';

class CommentsDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allComments: [],
      filteredComments: [],
      displayedComments: [],
      loading: true,
      error: null,
      currentPage: 1,
      pageSize: 10,
      searchTerm: '',
      sortColumn: '',
      sortDirection: 'none',
      pageSizeOptions: [10, 50, 100]
    };
  }

  componentDidMount() {
    this.loadInitialStateFromLocalStorage();
    this.fetchCommentsData();
  }

  loadInitialStateFromLocalStorage = () => {
    const storedPage = localStorage.getItem('currentPage');
    const storedPageSize = localStorage.getItem('pageSize');
    const storedSearchTerm = localStorage.getItem('searchTerm');
    const storedSortColumn = localStorage.getItem('sortColumn');
    const storedSortDirection = localStorage.getItem('sortDirection');

    this.setState({
      currentPage: storedPage ? parseInt(storedPage, 10) : 1,
      pageSize: storedPageSize ? parseInt(storedPageSize, 10) : 10,
      searchTerm: storedSearchTerm || '',
      sortColumn: storedSortColumn || '',
      sortDirection: storedSortDirection || 'none'
    });
  };

  saveStateToLocalStorage = () => {
    localStorage.setItem('currentPage', this.state.currentPage);
    localStorage.setItem('pageSize', this.state.pageSize);
    localStorage.setItem('searchTerm', this.state.searchTerm);
    localStorage.setItem('sortColumn', this.state.sortColumn);
    localStorage.setItem('sortDirection', this.state.sortDirection);
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentPage !== this.state.currentPage ||
        prevState.pageSize !== this.state.pageSize ||
        prevState.searchTerm !== this.state.searchTerm ||
        prevState.sortColumn !== this.state.sortColumn ||
        prevState.sortDirection !== this.state.sortDirection) {
      this.saveStateToLocalStorage();
    }

    if (prevState.allComments !== this.state.allComments ||
        prevState.searchTerm !== this.state.searchTerm ||
        prevState.sortColumn !== this.state.sortColumn ||
        prevState.sortDirection !== this.state.sortDirection ||
        prevState.currentPage !== this.state.currentPage ||
        prevState.pageSize !== this.state.pageSize) {
      this.applyFiltersAndPagination();
    }
  }

  fetchCommentsData = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/comments');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const comments = await response.json();
      this.setState({
        allComments: comments,
        loading: false,
      }, () => {
        this.applyFiltersAndPagination();
      });
    } catch (error) {
      console.error("Error fetching comments data:", error);
      this.setState({
        error: `Failed to load comments data: ${error.message}`,
        loading: false,
      });
    }
  };

  applyFiltersAndPagination = () => {
    let currentComments = [...this.state.allComments];

    if (this.state.searchTerm) {
      const lowerCaseSearchTerm = this.state.searchTerm.toLowerCase();
      currentComments = currentComments.filter(comment =>
        (comment.name && comment.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (comment.email && comment.email.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (comment.phone && comment.phone.toString().toLowerCase().includes(lowerCaseSearchTerm))
      );
    }
    this.setState({ filteredComments: currentComments });

    if (this.state.sortColumn && this.state.sortDirection !== 'none') {
      const { sortColumn, sortDirection } = this.state;
      currentComments.sort((a, b) => {
        let valA = a[sortColumn];
        let valB = b[sortColumn];

        if (sortColumn === 'postId') {
          valA = parseInt(valA, 10);
          valB = parseInt(valB, 10);
        } else {
          valA = String(valA).toLowerCase();
          valB = String(valB).toLowerCase();
        }

        if (valA < valB) {
          return sortDirection === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
          return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    const { currentPage, pageSize } = this.state;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const displayedComments = currentComments.slice(startIndex, endIndex);

    this.setState({
      displayedComments: displayedComments
    });
  };

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber }, this.applyFiltersAndPagination);
  };

  handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    this.setState({ pageSize: newSize, currentPage: 1 }, this.applyFiltersAndPagination);
  };

  handleSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value, currentPage: 1 }, this.applyFiltersAndPagination);
  };

  handleSortClick = (column) => {
    let newSortDirection = 'asc';
    let newSortColumn = column;

    if (this.state.sortColumn === column) {
      if (this.state.sortDirection === 'asc') {
        newSortDirection = 'desc';
      } else if (this.state.sortDirection === 'desc') {
        newSortDirection = 'none';
        newSortColumn = '';
      } else {
        newSortDirection = 'asc';
      }
    } else {
      newSortDirection = 'asc';
    }
    this.setState({
      sortColumn: newSortColumn,
      sortDirection: newSortDirection,
      currentPage: 1
    }, this.applyFiltersAndPagination);
  };

  render() {
    const { loading, error, displayedComments, filteredComments, currentPage, pageSize, searchTerm, sortColumn, sortDirection, pageSizeOptions } = this.state;
    const totalItems = filteredComments.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    if (loading) {
      return (
        <div className="comments-dashboard">
          <p>Loading comments...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="comments-dashboard error">
          <p>{error}</p>
        </div>
      );
    }

    return (
      <div className="comments-dashboard">
        <div className="dashboard-controls">
          <div className="sort-controls">
            <button
              className={`sort-button ${sortColumn === 'postId' ? sortDirection : ''}`}
              onClick={() => this.handleSortClick('postId')}
            >
              Sort Post ID
              {sortDirection === 'none'||sortColumn === 'name' || sortColumn === 'email'? <RxCaretSort className='sort-icon' />:''}
              {sortColumn === 'postId' && sortDirection === 'asc' && <FaChevronUp className='sorting-icon' />}
              {sortColumn === 'postId' && sortDirection === 'desc' && <FaChevronDown className='sorting-icon' />}
            </button>
            <button
              className={`sort-button ${sortColumn === 'name' ? sortDirection : ''}`}
              onClick={() => this.handleSortClick('name')}
            >
              Sort Name 
              {sortDirection === 'none'||sortColumn === 'postId' || sortColumn === 'email'? <RxCaretSort className='sort-icon' />:''}
              {sortColumn === 'name' && sortDirection === 'asc' && <FaChevronUp className='sorting-icon' />}
              {sortColumn === 'name' && sortDirection === 'desc' && <FaChevronDown className='sorting-icon' />}
            </button>
            <button
              className={`sort-button ${sortColumn === 'email' ? sortDirection : ''}`}
              onClick={() => this.handleSortClick('email')}
            >
              Sort Email 
              {sortDirection === 'none'||sortColumn === 'name' || sortColumn === 'postId'? <RxCaretSort className='sort-icon' />:''}
              {sortColumn === 'email' && sortDirection === 'asc' && <FaChevronUp className='sorting-icon' />}
              {sortColumn === 'email' && sortDirection === 'desc' && <FaChevronDown className='sorting-icon' />}
            </button>
          </div>
          <div className='search-input-container'>
            <FiSearch className='search-logo' />
            <input
            type="text"
            placeholder="Search name, email, comment"
            value={searchTerm}
            onChange={this.handleSearchChange}
            className="search-input"
          />
          </div>
        </div>

        <div className="data-grid-container">
          <table className="comments-table">
            <thead>
              <tr>
                <th>Post ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {displayedComments.length > 0 ? (
                displayedComments.map(comment => (
                  <tr key={comment.id}>
                    <td>{comment.postId}</td>
                    <td>{comment.name}</td>
                    <td>{comment.email}</td>
                    <td>{comment.body}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No comments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-controls">
          {totalItems > 0 && (
            <span className="item-count">
              {startItem}-{endItem} of {totalItems} items
            </span>
          )}
          <button
            onClick={() => this.handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button page-nav-button"
          >
            &lt;
          </button>
          <span className="current-page-display">
            {currentPage}
          </span>
          <button
            onClick={() => this.handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="pagination-button page-nav-button"
          >
            &gt;
          </button>

          <select id="pageSizeSelect" value={pageSize} onChange={this.handlePageSizeChange} className="page-size-select">
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>{option} / Page</option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}

export default CommentsDashboard;