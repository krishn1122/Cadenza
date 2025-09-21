import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import { useNavigate, useLocation } from 'react-router-dom';
import './SearchPage.scss';
import { companyService, Company } from '../../services/company';
import { personService, Person } from '../../services/person';
import { authService } from '../../services/auth';
import { getCompanyImageUrl, getPersonImageUrl, getFallbackImageUrl } from '../../utils/imageUtils';
import verifiedBadge from '../../../public/assets/images/verified-icon.png';
// We'll convert both Company and Person objects to this common interface for display
interface SearchResult {
  id: number;
  name: string;
  verified: boolean;
  logo: string; // Use logo for companies, avatar for people
  category: string;
  location: string;
  description: string;
  stage?: string;
  type: 'company' | 'person';
}

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // queryParams will be re-evaluated if location.search changes, used in useEffect

  // Helper to get the tab from the URL
  const getTabFromUrl = (): 'people' | 'company' => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get('tab');
    if (tab === 'people') return 'people';
    return 'company';
  };
  const activeTab = getTabFromUrl(); // Always derive from URL

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // Initialize isAdmin to null to signify it's not yet determined
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
  // Effect to determine isAdmin status on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    const adminStatus = currentUser?.is_admin || false;
    setIsAdmin(adminStatus);
    console.log('isAdmin determined:', adminStatus);
  }, []); // Runs once on mount
  
  // Effect to ensure only admins can access the people tab
  useEffect(() => {
    if (isAdmin === null) return;
    if (activeTab === 'people' && !isAdmin) {
      navigate('?tab=company', { replace: true });
    }
    if ((activeTab !== 'people' && activeTab !== 'company') || !location.search.includes('tab=')) {
      // If tab param is missing or invalid, set to default
      navigate(`?tab=${isAdmin ? 'people' : 'company'}`, { replace: true });
    }
  }, [isAdmin, activeTab, navigate, location.search]);

  // Function to map API data to common SearchResult interface
  const mapCompaniesToSearchResults = (companies: Company[]): SearchResult[] => {
    return companies.map(company => ({
      id: company.id,
      name: company.name,
      verified: company.verified,
      logo: getCompanyImageUrl(company.id),
      category: company.category,
      location: company.location,
      description: company.description,
      stage: company.stage,
      type: 'company'
    }));
  };
  
  const mapPeopleToSearchResults = (people: Person[]): SearchResult[] => {
    return people.map(person => ({
      id: person.id,
      name: person.name,
      verified: person.verified,
      logo: getPersonImageUrl(person.id),
      category: person.category,
      location: person.location,
      description: person.description,
      type: 'person'
    }));
  };
  
  // Load data when component mounts, when tab changes, or when search params change
  useEffect(() => {
    fetchData();
  }, [activeTab, currentPage, rowsPerPage]);
  
  // Function to fetch data based on active tab
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (activeTab === 'company') {
        const response = await companyService.searchCompanies(
          searchQuery,
          currentPage,
          rowsPerPage
        );
        setSearchResults(mapCompaniesToSearchResults(response.data));
        setTotalPages(response.pagination.totalPages);
      } else {
        const response = await personService.searchPeople(
          searchQuery,
          currentPage,
          rowsPerPage
        );
        setSearchResults(mapPeopleToSearchResults(response.data));
        setTotalPages(response.pagination.totalPages);
      }
    } catch (err) {
      setError('Failed to fetch search results. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset to first page when performing a new search
    setCurrentPage(1);
    // Trigger search with the current query
    fetchData();
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Data will be fetched automatically via useEffect
  };
  
  const handleEdit = (id: number) => {
    console.log('Edit item with ID:', id);
    // Handle edit functionality
  };
  
  const handleResultClick = (result: SearchResult) => {
    // Store current tab in sessionStorage to restore it when navigating back
    sessionStorage.setItem('lastActiveTab', activeTab);
    
    if (result.type === 'person') {
      navigate(`/person/${result.id}`);
    } else if (result.type === 'company') {
      navigate(`/company/${result.id}`);
    }
  };
  
  return (
    <MainLayout activePage="search">
      <div className="search-page">
        <h1 className="search-title">Search</h1>
        
        <div className="search-tabs">
          {isAdmin && (
            <button 
              className={`tab-btn ${activeTab === 'people' ? 'active' : ''}`}
              onClick={() => {
                // Only navigate if the tab is not already active and URL needs update
                if (location.search !== '?tab=people') {
                  navigate('?tab=people', { replace: true });
                }
              }}
            >
              People
            </button>
          )}
          <button 
            className={`tab-btn ${activeTab === 'company' ? 'active' : ''}`}
            onClick={() => {
              // Only navigate if the tab is not already active and URL needs update
              if (location.search !== '?tab=company') {
                navigate('?tab=company', { replace: true });
              }
            }}
          >
            Company
          </button>
        </div>
        
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-container">
            <input
              type="text"
              className="search-input"
              placeholder="AI Search Query"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              <i className="bi bi-search"></i>
            </button>
          </div>
        </form>
        
        <div className="search-context">
          (Dataset Name) - e.g. LinkedinLP Tracker
        </div>
        
        {/* Loading and Error States */}
        {isLoading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading {activeTab === 'people' ? 'people' : 'companies'}...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <i className="bi bi-exclamation-triangle"></i>
            <p>{error}</p>
          </div>
        )}
        
        {/* Empty state */}
        {!isLoading && !error && searchResults.length === 0 && (
          <div className="empty-state">
            <p>No {activeTab === 'people' ? 'people' : 'companies'} found matching your search criteria.</p>
          </div>
        )}
        
        {/* Search Results */}
        <div className="search-results">
          {!isLoading && !error && searchResults.map(result => (
            <div 
              key={result.id} 
              className={`search-result-card ${result.type === 'person' ? 'person-card' : 'company-card'}`}
              onClick={() => handleResultClick(result)}
            >
              <div className="result-left">
                <div className="result-logo">
                  <img 
                    src={result.logo} 
                    alt={`${result.name} logo`} 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = getFallbackImageUrl(result.name, result.type);
                    }}
                  />
                </div>
              </div>
              <div className="result-content">
                <div className="result-header">
                  <div className="result-name-container">
                    <h3 className="result-name">{result.name}</h3>
                    {result.verified && (
                      <span className="verified-badge">
                        <img src={verifiedBadge} alt="Verified Badge" />
                      </span>
                    )}
                  </div>
                  {isAdmin && (
                    <button 
                      className="edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(result.id);
                      }}
                    >
                      <i className="bi bi-pencil"></i> Edit
                    </button>
                  )}
                </div>
                <div className="result-details">
                  <span className="result-location">{result.location}</span>
                </div>
                <p className="result-description">{result.description}</p>
                {result.stage && <div className="result-stage">{result.stage}</div>}
              </div>
            </div>
          ))}
        </div>
        
        <div className="pagination">
          <button className="page-nav prev" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            <i className="bi bi-chevron-left"></i>
          </button>
          
          {[1, 2, '...', 9, 10].map((page, index) => (
            <button
              key={index}
              className={`page-number ${currentPage === page ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}
          <button className="page-nav next" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            <i className="bi bi-chevron-right"></i>
          </button>
          <div className="rows-per-page">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage.toString()}
              onChange={(e) => {
                setRowsPerPage(Number((e.target as HTMLSelectElement).value));
                setCurrentPage(1); // Reset to first page when changing rows per page
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SearchPage;
