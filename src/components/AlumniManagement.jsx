import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiStar, FiX, FiMoreVertical } from 'react-icons/fi';
import { getApiUrl } from '../config/api';
import LoadingScreen from './LoadingScreen';
import PageTransition from './PageTransition';

const Container = styled.div`
  padding: 2rem;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  font-size: 2rem;
`;

const AddButton = styled(motion.button)`
  background: linear-gradient(45deg, #6c63ff, #2A0845);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
`;

const AlumniGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const AlumniCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const AlumniImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
`;

const AlumniName = styled.h3`
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const AlumniTitle = styled.p`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const AlumniCompany = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Stat = styled.div`
  text-align: center;
`;

const StatLabel = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  margin-bottom: 0.2rem;
`;

const StatValue = styled.p`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const ActionButton = styled(motion.button)`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const ActionMenu = styled(motion.div)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(42, 8, 69, 0.95);
  padding: 2rem;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  z-index: 1001;
  max-height: 90vh;
  overflow-y: auto;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  
  /* Ensure modal stays in viewport */
  @media (max-height: 800px) {
    top: 0;
    transform: translate(-50%, 0);
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
  }
  
  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 4px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
  overflow-y: auto;
  
  /* Add padding to ensure last input is visible */
  padding-bottom: 2rem;
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ModalTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
`;

const CloseButton = styled(motion.button)`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
`;

const HelperText = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const DeleteConfirmation = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  z-index: 1000;

  h3 {
    margin-bottom: 1rem;
    color: #ff6b6b;
  }

  p {
    margin-bottom: 2rem;
    color: rgba(255, 255, 255, 0.8);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const ConfirmButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  background: #ff6b6b;
  color: white;
`;

const CancelButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: white;
  cursor: pointer;
`;

// Add new styled components for pagination
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 0.5rem;
`;

const PageButton = styled(motion.button)`
  background: ${props => props.active ? 'rgba(108, 99, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#6c63ff' : 'white'};
  border: 1px solid ${props => props.active ? '#6c63ff' : 'rgba(255, 255, 255, 0.2)'};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: rgba(108, 99, 255, 0.15);
  }
`;

const PageInfo = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin: 0 1rem;
`;

const AlumniManagement = () => {
  const [alumni, setAlumni] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    imageUrl: '',
    rating: 5,
    hourlyRate: 0
  });
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAlumni, setTotalAlumni] = useState(0);
  const ITEMS_PER_PAGE = 6;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlumni();
  }, [currentPage]);

  const fetchAlumni = async () => {
    try {
      const response = await fetch(`${getApiUrl('adminAlumni')}?page=${currentPage}&limit=${ITEMS_PER_PAGE}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAlumni(data.alumni);
        setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
        setTotalAlumni(data.total);
      }
    } catch (error) {
      console.error('Error fetching alumni:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(getApiUrl('adminAlumni'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setIsModalOpen(false);
        fetchAlumni();
        setFormData({
          name: '',
          title: '',
          company: '',
          imageUrl: '',
          rating: 5,
          hourlyRate: 0
        });
      }
    } catch (error) {
      console.error('Error creating alumni:', error);
    }
  };

  const handleEdit = (alumni) => {
    setSelectedAlumni(alumni);
    setFormData({
      name: alumni.name,
      email: alumni.email,
      title: alumni.title,
      company: alumni.company,
      imageUrl: alumni.imageUrl,
      rating: alumni.rating,
      sessionsCompleted: alumni.sessionsCompleted,
      hourlyRate: alumni.hourlyRate
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${getApiUrl('adminAlumni')}/${selectedAlumni._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setIsModalOpen(false);
        setIsEditing(false);
        setSelectedAlumni(null);
        fetchAlumni();
        setFormData({
          name: '',
          email: '',
          title: '',
          company: '',
          imageUrl: '',
          rating: 5,
          sessionsCompleted: 0,
          hourlyRate: 0
        });
      }
    } catch (error) {
      console.error('Error updating alumni:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${getApiUrl('adminAlumni')}/${selectedAlumni._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        setShowDeleteConfirm(false);
        setSelectedAlumni(null);
        fetchAlumni();
      }
    } catch (error) {
      console.error('Error deleting alumni:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    // Previous button
    buttons.push(
      <PageButton
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ←
      </PageButton>
    );

    // First page
    if (startPage > 1) {
      buttons.push(
        <PageButton
          key={1}
          onClick={() => handlePageChange(1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          1
        </PageButton>
      );
      if (startPage > 2) {
        buttons.push(<span key="dots1">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <PageButton
          key={i}
          active={currentPage === i}
          onClick={() => handlePageChange(i)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {i}
        </PageButton>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="dots2">...</span>);
      }
      buttons.push(
        <PageButton
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {totalPages}
        </PageButton>
      );
    }

    // Next button
    buttons.push(
      <PageButton
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        →
      </PageButton>
    );

    return buttons;
  };

  return (
    <PageTransition isLoading={loading}>
      <LoadingScreen message="Loading alumni data" />
      <Container>
        <Header>
          <Title>Alumni Management</Title>
          <AddButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
          >
            <FiPlus /> Add Alumni
          </AddButton>
        </Header>

        <AlumniGrid>
          {alumni.map((alum) => (
            <AlumniCard
              key={alum._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ActionMenu>
                <ActionButton
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEdit(alum)}
                >
                  <FiEdit2 size={16} />
                </ActionButton>
                <ActionButton
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setSelectedAlumni(alum);
                    setShowDeleteConfirm(true);
                  }}
                >
                  <FiTrash2 size={16} />
                </ActionButton>
              </ActionMenu>
              <AlumniImage src={alum.imageUrl} alt={alum.name} />
              <AlumniName>{alum.name}</AlumniName>
              <AlumniTitle>{alum.title}</AlumniTitle>
              <AlumniCompany>{alum.company}</AlumniCompany>
              <StatsContainer>
                <Stat>
                  <StatLabel>Rating</StatLabel>
                  <StatValue>
                    <FiStar /> {alum.rating}
                  </StatValue>
                </Stat>
                <Stat>
                  <StatLabel>Sessions</StatLabel>
                  <StatValue>{alum.sessionsCompleted}</StatValue>
                </Stat>
                <Stat>
                  <StatLabel>Rate</StatLabel>
                  <StatValue>₹{alum.hourlyRate}/hr</StatValue>
                </Stat>
              </StatsContainer>
            </AlumniCard>
          ))}
        </AlumniGrid>

        {alumni.length > 0 && (
          <PaginationContainer>
            {renderPaginationButtons()}
            <PageInfo>
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, totalAlumni)} of {totalAlumni} alumni
            </PageInfo>
          </PaginationContainer>
        )}

        {isModalOpen && (
          <>
            <Overlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsModalOpen(false)}
            />
            <Modal
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>{isEditing ? 'Edit Alumni' : 'Add New Alumni'}</ModalTitle>
                <CloseButton
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditing(false);
                    setSelectedAlumni(null);
                    setFormData({
                      name: '',
                      email: '',
                      title: '',
                      company: '',
                      imageUrl: '',
                      rating: 5,
                      sessionsCompleted: 0,
                      hourlyRate: 0
                    });
                  }}
                >
                  <FiX size={20} />
                </CloseButton>
              </ModalHeader>
              <ModalContent>
                <Form onSubmit={isEditing ? handleUpdate : handleSubmit}>
                  <FormGroup>
                    <Label>Full Name *</Label>
                    <Input
                      placeholder="e.g., John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                    <HelperText>Enter the alumni's complete name as it should appear on their profile</HelperText>
                  </FormGroup>

                  <FormGroup>
                    <Label>Email Address *</Label>
                    <Input
                      type="email"
                      placeholder="e.g., john.doe@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                    <HelperText>This email will be used for communication but won't be displayed publicly</HelperText>
                  </FormGroup>

                  <FormGroup>
                    <Label>Current Title *</Label>
                    <Input
                      placeholder="e.g., Senior Software Engineer"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                    <HelperText>Current job title or role at their company</HelperText>
                  </FormGroup>

                  <FormGroup>
                    <Label>Company *</Label>
                    <Input
                      placeholder="e.g., Google"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      required
                    />
                    <HelperText>Current company or organization name</HelperText>
                  </FormGroup>

                  <FormGroup>
                    <Label>Profile Image URL *</Label>
                    <Input
                      placeholder="e.g., https://example.com/photo.jpg"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      required
                    />
                    <HelperText>Direct link to a professional headshot (recommended size: 400x400px)</HelperText>
                  </FormGroup>

                  <FormGroup>
                    <Label>Initial Rating *</Label>
                    <Input
                      type="number"
                      placeholder="5.0"
                      value={formData.rating}
                      onChange={(e) => setFormData({...formData, rating: e.target.value})}
                      min="0"
                      max="5"
                      step="0.1"
                      required
                    />
                    <HelperText>Initial rating from 0 to 5 (can be updated based on feedback)</HelperText>
                  </FormGroup>

                  <FormGroup>
                    <Label>Sessions Completed</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.sessionsCompleted}
                      onChange={(e) => setFormData({...formData, sessionsCompleted: e.target.value})}
                      min="0"
                      required
                    />
                    <HelperText>Number of mentoring sessions completed (start with 0 for new alumni)</HelperText>
                  </FormGroup>

                  <FormGroup>
                    <Label>Hourly Rate (₹) *</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 2000"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                      min="0"
                      required
                    />
                    <HelperText>Mentoring session rate per hour in Indian Rupees</HelperText>
                  </FormGroup>

                  <AddButton
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isEditing ? 'Update Alumni' : 'Add Alumni'}
                  </AddButton>
                </Form>
              </ModalContent>
            </Modal>
          </>
        )}

        {showDeleteConfirm && (
          <DeleteConfirmation
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3>Delete Alumni</h3>
            <p>Are you sure you want to delete {selectedAlumni?.name}? This action cannot be undone.</p>
            <ButtonGroup>
              <CancelButton
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedAlumni(null);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </CancelButton>
              <ConfirmButton
                onClick={handleDelete}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Delete
              </ConfirmButton>
            </ButtonGroup>
          </DeleteConfirmation>
        )}
      </Container>
    </PageTransition>
  );
};

export default AlumniManagement; 