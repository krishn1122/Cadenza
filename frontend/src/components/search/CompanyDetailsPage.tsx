import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import './CompanyDetailsPage.scss';
import { companyService } from '../../services/company';
import { authService } from '../../services/auth';
import { getCompanyImageUrl, getFallbackImageUrl } from '../../utils/imageUtils';

interface CompanyDetails {
  id: number;
  name: string;
  verified: boolean;
  logo: string;
  description: string;
  theme: string;
  website: string;
  yearFounded: string;
  employees: string;
  stage: string;
  keyContact: string;
  financing: string;
  investors: string;
  teamScore: string;
  tractionScore: string;
  notes: string;
}

const CompanyDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
  const [editableCompany, setEditableCompany] = useState<CompanyDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if the current user is an admin
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setIsAdmin(currentUser?.is_admin || false);
  }, []);
  
  // Fetch company details from API when component mounts
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!id) {
        setError('Company ID is missing');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const companyData = await companyService.getCompanyById(parseInt(id));
        
        // Map API data to CompanyDetails interface
        setCompanyDetails({
          id: companyData.id,
          name: companyData.name,
          verified: companyData.verified,
          logo: getCompanyImageUrl(companyData.id),
          description: companyData.description,
          theme: companyData.category, // Map category to theme
          website: companyData.website || 'Not specified',
          yearFounded: companyData.founded_year?.toString() || 'Not specified',
          employees: companyData.employee_count || 'Not specified',
          stage: companyData.stage || 'Not specified',
          keyContact: 'Not specified', // This field might not be in the API data
          financing: companyData.funding_stage || 'Not specified',
          investors: companyData.investor_information || 'Not specified',
          teamScore: '85', // Placeholder - API might not have this field
          tractionScore: companyData.tractionScore?.toString() || 'Not available',
          notes: companyData.notes || 'No notes available'
        });
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching company details:', err);
        setError('Failed to load company details. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchCompanyDetails();
  }, [id]); // Re-fetch when ID changes
  
  const handleBack = () => {
    // Always return to company tab for consistency
    const lastActiveTab = 'company';
    console.log('Navigating back to company tab');
    
    // Navigate back to search page with the company tab parameter
    navigate(`/search?tab=${lastActiveTab}`);
  };
  
  const handleReject = () => {
    if (isEditing) {
      // Cancel editing mode and revert changes
      setIsEditing(false);
      setEditableCompany(companyDetails);
      setSaveStatus(null);
    } else {
      // Regular reject behavior
      if (companyDetails) {
        console.log('Rejected company:', companyDetails.id);
      }
      // Always navigate to company tab for consistency
      const lastActiveTab = 'company';
      console.log('Navigating to company tab');
      navigate(`/search?tab=${lastActiveTab}`);
    }
  };
  
  const handleAccept = async () => {
    if (isEditing && editableCompany && companyDetails) {
      try {
        setSaveStatus('saving');
        // Save the updated company data to the database
        await companyService.updateCompany(editableCompany.id, {
          name: editableCompany.name,
          description: editableCompany.description,
          category: editableCompany.theme, // Map theme back to category
          website: editableCompany.website === 'Not specified' ? undefined : editableCompany.website,
          founded_year: editableCompany.yearFounded === 'Not specified' ? undefined : parseInt(editableCompany.yearFounded),
          employee_count: editableCompany.employees === 'Not specified' ? undefined : editableCompany.employees,
          stage: editableCompany.stage === 'Not specified' ? undefined : editableCompany.stage,
          funding_stage: editableCompany.financing === 'Not specified' ? undefined : editableCompany.financing,
          investor_information: editableCompany.investors === 'Not specified' ? undefined : editableCompany.investors,
          tractionScore: editableCompany.tractionScore === 'Not available' ? undefined : parseInt(editableCompany.tractionScore),
          notes: editableCompany.notes === 'No notes available' ? undefined : editableCompany.notes
        });
        
        // Update the company details with the response from the server
        setCompanyDetails({
          ...editableCompany,
          // Update any server-generated fields if needed
        });
        
        setIsEditing(false);
        setSaveStatus('saved');
        
        // Show success message for 2 seconds before navigating
        setTimeout(() => {
          navigate('/search');
        }, 2000);
      } catch (err) {
        console.error('Error updating company:', err);
        setSaveStatus('error');
      }
    } else {
      // Regular accept behavior
      if (companyDetails) {
        console.log('Accepted company:', companyDetails.id);
      }
      navigate('/search');
    }
  };
  
  const handleEdit = () => {
    if (companyDetails) {
      console.log('Edit company:', companyDetails.id);
      // Set up editable copy of company details
      setEditableCompany({...companyDetails});
      setIsEditing(true);
    }
  };
  
  return (
    <MainLayout activePage="search">
      <div className="company-details-page">
        <div className="back-button-container">
          <button className="back-button" onClick={handleBack}>
            <i className="bi bi-arrow-left"></i> Back
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading company details...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-message">
            <i className="bi bi-exclamation-triangle"></i>
            <p>{error}</p>
            <button className="retry-button" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        )}
        
        {!isLoading && !error && companyDetails && (
          <>
            <div className="company-header">
              <div className="company-logo">
                <img 
                  src={companyDetails.logo} 
                  alt={`${companyDetails.name} logo`} 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = getFallbackImageUrl(companyDetails.name, 'company', companyDetails.id);
                  }}
                />
              </div>
              <div className="company-info">
                <div className="company-name">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editableCompany?.name || ''}
                      onChange={(e) => setEditableCompany(prev => prev ? {...prev, name: e.target.value} : null)}
                      style={{ fontSize: '1.5em', fontWeight: 'bold', width: '100%', marginBottom: '5px' }}
                    />
                  ) : (
                    <h2>{companyDetails.name}</h2>
                  )}
                  {companyDetails.verified && (
                    <span className="verified-badge">
                      <i className="bi bi-patch-check-fill"></i> Verified
                    </span>
                  )}
                </div>
                <div className="company-description">
                  {isEditing ? (
                    <textarea
                      value={editableCompany?.description || ''}
                      onChange={(e) => setEditableCompany(prev => prev ? {...prev, description: e.target.value} : null)}
                      rows={3}
                      style={{ width: '100%', padding: '8px' }}
                    />
                  ) : (
                    <p>{companyDetails.description}</p>
                  )}
                </div>
              </div>
              <div className="company-actions">
                {!isEditing && isAdmin && (
                  <button className="edit-button" onClick={handleEdit}>
                    <i className="bi bi-pencil"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="company-details-section">
              <div className="company-details-grid">
                <div className="detail-item">
                  <div className="detail-label">Theme</div>
                  {isEditing ? (
                    <div className="detail-value">
                      <input 
                        type="text" 
                        value={editableCompany?.theme || ''} 
                        onChange={(e) => setEditableCompany(prev => prev ? {...prev, theme: e.target.value} : null)}
                      />
                    </div>
                  ) : (
                    <div className="detail-value">{companyDetails.theme}</div>
                  )}
                </div>
                <div className="detail-item">
                  <div className="detail-label">Website</div>
                  {isEditing ? (
                    <div className="detail-value">
                      <input 
                        type="text" 
                        value={editableCompany?.website || ''} 
                        onChange={(e) => setEditableCompany(prev => prev ? {...prev, website: e.target.value} : null)}
                      />
                    </div>
                  ) : (
                    <div className="detail-value">{companyDetails.website}</div>
                  )}
                </div>
                <div className="detail-item">
                  <div className="detail-label">Founded</div>
                  {isEditing ? (
                    <div className="detail-value">
                      <input 
                        type="text" 
                        value={editableCompany?.yearFounded || ''} 
                        onChange={(e) => setEditableCompany(prev => prev ? {...prev, yearFounded: e.target.value} : null)}
                      />
                    </div>
                  ) : (
                    <div className="detail-value">{companyDetails.yearFounded}</div>
                  )}
                </div>
                <div className="detail-item">
                  <div className="detail-label">Employees</div>
                  {isEditing ? (
                    <div className="detail-value">
                      <input 
                        type="text" 
                        value={editableCompany?.employees || ''} 
                        onChange={(e) => setEditableCompany(prev => prev ? {...prev, employees: e.target.value} : null)}
                      />
                    </div>
                  ) : (
                    <div className="detail-value">{companyDetails.employees}</div>
                  )}
                </div>
                <div className="detail-item">
                  <div className="detail-label">Stage</div>
                  {isEditing ? (
                    <div className="detail-value">
                      <input 
                        type="text" 
                        value={editableCompany?.stage || ''} 
                        onChange={(e) => setEditableCompany(prev => prev ? {...prev, stage: e.target.value} : null)}
                      />
                    </div>
                  ) : (
                    <div className="detail-value">{companyDetails.stage}</div>
                  )}
                </div>
                <div className="detail-item">
                  <div className="detail-label">Key Contact</div>
                  {isEditing ? (
                    <div className="detail-value">
                      <input 
                        type="text" 
                        value={editableCompany?.keyContact || ''} 
                        onChange={(e) => setEditableCompany(prev => prev ? {...prev, keyContact: e.target.value} : null)}
                      />
                    </div>
                  ) : (
                    <div className="detail-value">{companyDetails.keyContact}</div>
                  )}
                </div>
                <div className="detail-item">
                  <div className="detail-label">Financing</div>
                  {isEditing ? (
                    <div className="detail-value">
                      <input 
                        type="text" 
                        value={editableCompany?.financing || ''} 
                        onChange={(e) => setEditableCompany(prev => prev ? {...prev, financing: e.target.value} : null)}
                      />
                    </div>
                  ) : (
                    <div className="detail-value">{companyDetails.financing}</div>
                  )}
                </div>
                <div className="detail-item">
                  <div className="detail-label">Investors</div>
                  {isEditing ? (
                    <div className="detail-value">
                      <input 
                        type="text" 
                        value={editableCompany?.investors || ''} 
                        onChange={(e) => setEditableCompany(prev => prev ? {...prev, investors: e.target.value} : null)}
                      />
                    </div>
                  ) : (
                    <div className="detail-value">{companyDetails.investors}</div>
                  )}
                </div>
                <div className="detail-item">
                  <div className="detail-label">Team Score</div>
                  {isEditing ? (
                    <div className="detail-value">
                      <input 
                        type="text" 
                        value={editableCompany?.teamScore || ''} 
                        onChange={(e) => setEditableCompany(prev => prev ? {...prev, teamScore: e.target.value} : null)}
                      />
                    </div>
                  ) : (
                    <div className="detail-value">{companyDetails.teamScore}</div>
                  )}
                </div>
                <div className="detail-item">
                  <div className="detail-label">Traction Score</div>
                  {isEditing ? (
                    <div className="detail-value">
                      <input 
                        type="text" 
                        value={editableCompany?.tractionScore || ''} 
                        onChange={(e) => setEditableCompany(prev => prev ? {...prev, tractionScore: e.target.value} : null)}
                      />
                    </div>
                  ) : (
                    <div className="detail-value">{companyDetails.tractionScore}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="notes-section">
              <h3>Notes</h3>
              {isEditing ? (
                <textarea
                  value={editableCompany?.notes || ''}
                  onChange={(e) => setEditableCompany(prev => prev ? {...prev, notes: e.target.value} : null)}
                  rows={4}
                  style={{ width: '100%', padding: '8px' }}
                />
              ) : (
                <p>{companyDetails.notes}</p>
              )}
            </div>

            <div className="action-buttons">
              {isAdmin && (
                <div className="company-actions">
                  <button className="reject-button" onClick={handleReject}>
                    {isEditing ? 'Cancel' : 'Reject'}
                  </button>
                  <button className="accept-button" onClick={handleAccept} disabled={saveStatus === 'saving'}>
                    {isEditing ? (saveStatus === 'saving' ? 'Saving...' : 'Save Changes') : 'Accept'}
                  </button>
                </div>
              )}
              {saveStatus === 'saved' && (
                <div className="save-status success">
                  <i className="bi bi-check-circle"></i> Changes saved successfully!
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="save-status error">
                  <i className="bi bi-exclamation-triangle"></i> Failed to save changes. Please try again.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default CompanyDetailsPage;
