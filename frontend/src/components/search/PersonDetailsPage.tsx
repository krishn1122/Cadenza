import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import './PersonDetailsPage.scss';
import { personService } from '../../services/person';
import { getFallbackImageUrl, getPersonImageUrl } from '../../utils/imageUtils';
import { authService } from '../../services/auth';

interface PersonDetails {
  id: number;
  name: string;
  verified: boolean;
  logo: string;
  description: string;
  theme: string;
  company: string;
  currentPosition: string;
  linkedin: string;
  contacts: string;
  reviewStatus: string;
  notes: string;
}

const PersonDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [personDetails, setPersonDetails] = useState<PersonDetails | null>(null);
  const [editablePerson, setEditablePerson] = useState<PersonDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if the current user is an admin
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setIsAdmin(currentUser?.is_admin || false);
    
    // Ensure we're setting the tab to 'people' for when navigating back
    sessionStorage.setItem('lastActiveTab', 'people');
  }, []);
  
  // Fetch person details from API when component mounts
  useEffect(() => {
    const fetchPersonDetails = async () => {
      if (!id) {
        setError('Person ID is missing');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const personData = await personService.getPersonById(parseInt(id));
        // Use type assertion to allow flexible mapping
        const data = personData as any;
        
        // Map API data to PersonDetails interface
        setPersonDetails({
          id: data.id,
          name: data.name,
          verified: data.verified || false,
          logo: getPersonImageUrl(data.id),
          description: data.description || 'No bio available',
          theme: data.expertise || 'Not specified',
          company: data.company || 'Not specified',
          currentPosition: data.position || 'Not specified',
          linkedin: data.linkedin || 'Not specified',
          contacts: data.email || 'Not specified',
          reviewStatus: data.status || 'Pending',
          notes: data.notes || 'No notes available'
        });
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching person details:', err);
        setError('Failed to load person details. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchPersonDetails();
  }, [id]); // Re-fetch when ID changes
  
  const handleBack = () => {
    // Get the previously active tab from session storage
    // const lastActiveTab = sessionStorage.getItem('lastActiveTab') || 'people';
    const lastActiveTab = 'people';
    console.log('Last active tab:', lastActiveTab);
    
    // Navigate back to search page with the correct tab query parameter
    navigate(`/search?tab=${lastActiveTab}`);
  };
  
  const handleReject = () => {
    if (isEditing) {
      // Cancel editing mode and revert changes
      setIsEditing(false);
      setEditablePerson(personDetails);
      setSaveStatus(null);
    } else {
      // Regular reject behavior
      if (personDetails) {
        console.log('Rejected person:', personDetails.id);
      }
      // Get the previously active tab from session storage
      // const lastActiveTab = sessionStorage.getItem('lastActiveTab') || 'people';
      const lastActiveTab = 'people';
      navigate(`/search?tab=${lastActiveTab}`);
    }
  };
  
  const handleAccept = async () => {
    if (isEditing && editablePerson && personDetails) {
      try {
        setSaveStatus('saving');
        // Save the updated person data to the database
        await personService.updatePerson(editablePerson.id, {
          name: editablePerson.name,
          description: editablePerson.description !== 'No bio available' ? editablePerson.description : undefined,
          category: editablePerson.theme !== 'Not specified' ? editablePerson.theme : undefined, // Map theme to category
          company: editablePerson.company !== 'Not specified' ? editablePerson.company : undefined,
          position: editablePerson.currentPosition !== 'Not specified' ? editablePerson.currentPosition : undefined,
          linkedin: editablePerson.linkedin !== 'Not specified' ? editablePerson.linkedin : undefined,
          email: editablePerson.contacts !== 'Not specified' ? editablePerson.contacts : undefined,
          // Combine notes and reviewStatus since there's no direct status property in the Person interface
          notes: (editablePerson.reviewStatus !== 'Pending' || editablePerson.notes !== 'No notes available') ? 
            `${editablePerson.reviewStatus !== 'Pending' ? `Status: ${editablePerson.reviewStatus}` : ''}${
              (editablePerson.reviewStatus !== 'Pending' && editablePerson.notes !== 'No notes available') ? ' | ' : ''
            }${editablePerson.notes !== 'No notes available' ? editablePerson.notes : ''}`.trim() : undefined
        });
        
        // Update the person details with the edited values
        setPersonDetails({
          ...editablePerson
        });
        
        setIsEditing(false);
        setSaveStatus('saved');
        
        // Show success message for 2 seconds before navigating
        setTimeout(() => {
          navigate('/search');
        }, 2000);
      } catch (err) {
        console.error('Error updating person:', err);
        setSaveStatus('error');
      }
    } else {
      // Regular accept behavior
      if (personDetails) {
        console.log('Accepted person:', personDetails.id);
      }
      navigate('/search');
    }
  };
  
  const handleEdit = () => {
    if (personDetails) {
      console.log('Edit person:', personDetails.id);
      // Set up editable copy of person details
      setEditablePerson({...personDetails});
      setIsEditing(true);
    }
  };
  
  return (
    <MainLayout activePage="search">
      <div className="person-details-page">
        <div className="back-button-container">
          <button className="back-button" onClick={handleBack}>
            <i className="bi bi-arrow-left"></i> Back
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading person details...</p>
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
        
        {!isLoading && !error && personDetails && (
          <>
            <div className="person-header">
              <div className="person-logo">
                <img 
                  src={personDetails.logo} 
                  alt={`${personDetails.name} logo`} 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = getFallbackImageUrl(personDetails.name, 'person', personDetails.id);
                  }}
                />
              </div>
              
              <div className="person-title-section">
                <div className="person-title-container">
                  {isEditing ? (
                    <input
                      type="text"
                      className="edit-name-input"
                      value={editablePerson?.name || ''}
                      onChange={(e) => setEditablePerson(prev => prev ? {...prev, name: e.target.value} : null)}
                    />
                  ) : (
                    <h1 className="person-name">{personDetails.name}</h1>
                  )}
                  {personDetails.verified && (
                    <span className="verified-badge">
                      <i className="bi bi-patch-check-fill"></i>
                    </span>
                  )}
                </div>
                
                {!isEditing && isAdmin && (
                  <button className="edit-button" onClick={handleEdit}>
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                )}
              </div>
            </div>
            
            <div className="person-content">
              <div className="person-description">
                <h3>Description</h3>
                {isEditing ? (
                  <textarea
                    value={editablePerson?.description || ''}
                    onChange={(e) => setEditablePerson(prev => prev ? {...prev, description: e.target.value} : null)}
                    rows={4}
                    className="edit-description-input"
                  />
                ) : (
                  <p>{personDetails.description}</p>
                )}
              </div>
              
              <div className="person-details-grid">
                <div className="details-row">
                  <div className="details-label">Theme</div>
                  <div className="details-value">:</div>
                  {isEditing ? (
                    <div className="details-content edit-mode">
                      <input
                        type="text"
                        value={editablePerson?.theme || ''}
                        onChange={(e) => setEditablePerson(prev => prev ? {...prev, theme: e.target.value} : null)}
                      />
                    </div>
                  ) : (
                    <div className="details-content">{personDetails.theme}</div>
                  )}
                </div>
                
                <div className="details-row">
                  <div className="details-label">Company</div>
                  <div className="details-value">:</div>
                  {isEditing ? (
                    <div className="details-content edit-mode">
                      <input
                        type="text"
                        value={editablePerson?.company || ''}
                        onChange={(e) => setEditablePerson(prev => prev ? {...prev, company: e.target.value} : null)}
                      />
                    </div>
                  ) : (
                    <div className="details-content">{personDetails.company}</div>
                  )}
                </div>
                
                <div className="details-row">
                  <div className="details-label">Current Position</div>
                  <div className="details-value">:</div>
                  {isEditing ? (
                    <div className="details-content edit-mode">
                      <input
                        type="text"
                        value={editablePerson?.currentPosition || ''}
                        onChange={(e) => setEditablePerson(prev => prev ? {...prev, currentPosition: e.target.value} : null)}
                      />
                    </div>
                  ) : (
                    <div className="details-content">{personDetails.currentPosition}</div>
                  )}
                </div>
                
                <div className="details-row">
                  <div className="details-label">LinkedIn</div>
                  <div className="details-value">:</div>
                  {isEditing ? (
                    <div className="details-content edit-mode">
                      <input
                        type="text"
                        value={editablePerson?.linkedin || ''}
                        onChange={(e) => setEditablePerson(prev => prev ? {...prev, linkedin: e.target.value} : null)}
                      />
                    </div>
                  ) : (
                    <div className="details-content">{personDetails.linkedin}</div>
                  )}
                </div>
                
                <div className="details-row">
                  <div className="details-label">Contacts</div>
                  <div className="details-value">:</div>
                  {isEditing ? (
                    <div className="details-content edit-mode">
                      <input
                        type="text"
                        value={editablePerson?.contacts || ''}
                        onChange={(e) => setEditablePerson(prev => prev ? {...prev, contacts: e.target.value} : null)}
                      />
                    </div>
                  ) : (
                    <div className="details-content">{personDetails.contacts}</div>
                  )}
                </div>
                
                <div className="details-row">
                  <div className="details-label">Review Status</div>
                  <div className="details-value">:</div>
                  {isEditing ? (
                    <div className="details-content edit-mode">
                      <input
                        type="text"
                        value={editablePerson?.reviewStatus || ''}
                        onChange={(e) => setEditablePerson(prev => prev ? {...prev, reviewStatus: e.target.value} : null)}
                      />
                    </div>
                  ) : (
                    <div className="details-content">{personDetails.reviewStatus}</div>
                  )}
                </div>
              </div>
              
              <div className="person-notes">
                <h3>Notes:</h3>
                {isEditing ? (
                  <textarea
                    value={editablePerson?.notes || ''}
                    onChange={(e) => setEditablePerson(prev => prev ? {...prev, notes: e.target.value} : null)}
                    rows={4}
                    className="edit-notes-input"
                  />
                ) : (
                  <p>{personDetails.notes}</p>
                )}
              </div>
              
              <div className="person-actions">
                {isAdmin && (
                  <>
                    <button className="reject-button" onClick={handleReject}>
                      {isEditing ? 'Cancel' : 'Reject'}
                    </button>
                    <button className="accept-button" onClick={handleAccept} disabled={saveStatus === 'saving'}>
                      {isEditing ? (saveStatus === 'saving' ? 'Saving...' : 'Save Changes') : 'Accept'}
                    </button>
                  </>
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
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default PersonDetailsPage;
