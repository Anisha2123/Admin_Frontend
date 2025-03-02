import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiUsers, FiBook, FiSettings, FiLogOut, FiGrid } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import AlumniManagement from '../components/AlumniManagement';
import LoadingScreen from '../components/LoadingScreen';
import PageTransition from '../components/PageTransition';
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";



import pdfWorker from "/pdf.worker.min.js?url";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;



const PageContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px;
  background: linear-gradient(135deg, #2A0845 0%, #1B1464 100%);
  color: white;
  width: 100%;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  position: fixed;
  inset: 0;
`;

const ContentWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 2rem 6rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: calc(100vh - 80px);

  @media (max-width: 768px) {
    padding: 2rem 3rem;
  }
`;

const FiltersSection = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  cursor: pointer;

  option {
    background: #2A0845;
    color: white;
  }
`;

const PdfList = styled.div`
  margin-top: 2rem;
`;

const PdfCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  margin-bottom: 0.8rem;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DashboardContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #2A0845 0%, #1B1464 100%);
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 250px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.h1`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const MenuItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  color: white;
  cursor: pointer;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  transition: background 0.3s ease;
  
  ${props => props.active && `
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  `}

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    margin-right: 0.8rem;
  }
`;

const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('https://res.cloudinary.com/dqt4zammn/image/upload/b_rgb:290846/v1739207877/work-concept-illustration_knzqlh.png') no-repeat center center;
    background-size: cover;
    opacity: 0.1;
    z-index: -1;
  }
`;

const subjectsMapping = {
  'cs': {
    '6': ['spm', 'da', 'ml', 'cc', 'cd'],
    '4': ['coa', 'os', 'sbms', 'afl', 'pdc', 'wt']
  }
};

const Button = styled.button`
  background: #4CAF50; /* Green */
  color: white;
  padding: 0.8rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  width: 100px; /* Set a fixed width for consistency */

  &:hover {
    background: #45a049; /* Darker green */
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const InputField = styled.input`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: border 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border: 1px solid rgba(255, 255, 255, 0.5);
    outline: none; /* Remove default outline */
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  }
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  // background: rgba(255, 255, 255, 0.1);
  // border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  // transition: border 0.3s ease, box-shadow 0.3s ease;
  margin-right: 1rem; /* Space between input and button */

  &:focus {
    border: 1px solid rgba(255, 255, 255, 0.5);
    outline: none; /* Remove default outline */
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  }
`;

const UploadButton = styled.button`
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #C70039, #FF5733);
  color: rgb(229, 227, 232);
  padding: 0.8rem 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: auto;
  margin-top: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background: linear-gradient(135deg,rgb(64, 153, 57),rgb(105, 172, 17));
    color: rgb(241, 229, 229);
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('alumni');
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const [editingPdf, setEditingPdf] = useState(null);

  const [newPdfName, setNewPdfName] = useState("");
  
  // const [selectedPdf, setSelectedPdf] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };
  const handleFileChange = (e) => {
    setSelectedPdf(e.target.files[0]);
  };
  
  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!selectedPdf || !pdfName) {
      alert("Please select a file and enter a name before uploading.");
      return;
    }
    if (!selectedPdf || !selectedBranch || !selectedSemester || !selectedCategory) {
      console.error("Missing required fields!");
      return;
    }
  
    const formData = new FormData();

    formData.append("branch", selectedBranch);
    formData.append("semester", selectedSemester);
    formData.append("category", selectedCategory);
    formData.append("subject", selectedSubject);
    formData.append("pdfName", pdfName.endsWith(".pdf") ? pdfName : pdfName + ".pdf"); // Ensure .pdf extension
    formData.append("pdf", selectedPdf);  // Must match backend field name



    console.log("📂 FormData Entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    console.log("📂 Selected File:", selectedPdf);
    console.log("📂 File Type:", selectedPdf?.type);
    console.log("📂 File Name:", selectedPdf?.name);

  
    try {
      const response = await axios.post(
        // "http://localhost:3001/api/resources/upload",
        "https://api.kiitwallah.live/api/resources/upload",
        formData,
        {
          // headers: { "Content-Type": "multipart/form-data" },
          "Accept": "application/json"
        }
      );
      console.log("✅ File uploaded successfully:", response.data);
      // alert("File uploaded successfully!");
      setPdfName("");  // ✅ Reset the text field
      setSelectedPdf(null); // ✅ Clear the selected file
      document.getElementById("fileInput").value = ""; // ✅ Reset file input
      fetchPdfs(); // Refresh the list
    } catch (error) {
      console.error("❌ Error uploading file:", error);
      alert("Error uploading file. Check console for details.");
    }
  };

//   try {
//     const response = await fetch("http://localhost:3001/api/resources/upload", {
//         method: "POST",
//         body: formData,
//     });
//     const data = await response.json();
//     if (response.ok) {
//         console.log("Upload successful:", data);
//         setUploadedPDFs([...uploadedPDFs, data.file]); // Update UI
//     } else {
//         console.error("Upload failed:", data.message);
//     }
// } catch (error) {
//     console.error("Error uploading PDF:", error);
// }
// };

  
  
  

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    // Update subjects based on selected branch and semester
    if (selectedBranch && selectedSemester) {
      setSubjects(subjectsMapping[selectedBranch][selectedSemester] || []);
    } else {
      setSubjects([]);
    }
  }, [selectedBranch, selectedSemester]);

  useEffect(() => {
    if (selectedBranch && selectedSemester && selectedCategory && selectedSubject) {
      fetchPdfs(); // Fetch PDFs when filters change
    }
  }, [selectedBranch, selectedSemester, selectedCategory, selectedSubject]);

  const fetchPdfs = async () => {
    try {
      const response = await axios.get("https://api.kiitwallah.live/api/resources/pdfs", {
        // const response = await axios.get("http://localhost:3001/api/resources/pdfs", {
        params: { 
          branch: selectedBranch, 
          semester: selectedSemester, 
          category: selectedCategory, 
          subject: selectedSubject 
        }
      });
      setPdfs(response.data.pdfs || []); // Set PDFs from response
      setSelectedPdf(null); // Reset selected PDF when new data is fetched
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    }
  };
  const handleDelete = async (pdfName) => {
    const confirmDelete = window.confirm(`Are you sure you want to permanently delete ${pdfName}?`);
    if (!confirmDelete) return;
  
    try {
      // await axios.delete("http://localhost:3001/api/resources/delete", {
        await axios.delete("https://api.kiitwallah.live/api/resources/delete", {
        params: { 
          pdfName, 
          branch: selectedBranch, 
          semester: selectedSemester, 
          category: selectedCategory, 
          subject: selectedSubject
        }
      });
      // alert("PDF deleted successfully");
      fetchPdfs(); // Refresh the list
    } catch (error) {
      console.error("Error deleting PDF:", error);
    }
  };
  
  const handleEdit = (pdfName) => {
    setEditingPdf(pdfName);
    setNewPdfName(pdfName); // Pre-fill with existing name
  };
  const handleSaveEdit = async (oldName) => {
    try {
      // await axios.put("http://localhost:3001/api/resources/rename", { 
        await axios.put("https://api.kiitwallah.live/api/resources/rename", {
        oldName, 
        newName: newPdfName, 
        branch: selectedBranch, 
        semester: selectedSemester, 
        category: selectedCategory, 
        subject: selectedSubject
      });
      // alert("PDF renamed successfully");
      setEditingPdf(null);
      fetchPdfs(); // Refresh list
    } catch (error) {
      console.error("Error renaming PDF:", error);
    }
};



  const renderContent = () => {
    switch (activeSection) {
      case 'alumni':
        return <AlumniManagement />;
      case 'users':
        return <div>Users Management</div>;
      case 'resources':
        return (
          <>
            <FiltersSection>
              <FilterGroup>
                <FilterLabel>Branch</FilterLabel>
                <Select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
                  <option value="">Select Branch</option>
                  <option value="cs">Computer Science</option>
                </Select>
              </FilterGroup>
              <FilterGroup>
                <FilterLabel>Semester</FilterLabel>
                <Select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                  <option value="">Select Semester</option>
                  <option value="6">Semester 6</option>
                  <option value="4">Semester 4</option>
                </Select>
              </FilterGroup>
              <FilterGroup>
                <FilterLabel>Category</FilterLabel>
                <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="">Select Category</option>
                  <option value="notes">Notes</option>
                  <option value="pyq">PYQ</option>
                </Select>
              </FilterGroup>
              <FilterGroup>
                <FilterLabel>Subject</FilterLabel>
                <Select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>{subject.toUpperCase()}</option>
                  ))}
                </Select>
              </FilterGroup>
              <FilterGroup>
                <FilterLabel>PDF Name</FilterLabel>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                  <InputField
                    type="text"
                    placeholder="Enter PDF name"
                    value={pdfName}
                    onChange={(e) => setPdfName(e.target.value)}
                  />
                  <FileInput
                  id="fileInput"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      console.log("📂 File selected:", e.target.files[0]); // Debugging log
                      setSelectedPdf(e.target.files[0]);
                    }}
                  />
                </div>
                <UploadButton onClick={handleFileUpload}>
                  Upload PDF
                </UploadButton>
              </FilterGroup>
            </FiltersSection>

            <PdfList>
              {pdfs.map((pdf, index) => (
                <PdfCard key={index}>
                  {editingPdf === pdf.name ? (
                    <>
                      <InputField
                        type="text"
                        value={newPdfName}
                        onChange={(e) => setNewPdfName(e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button onClick={() => handleSaveEdit(pdf.name)}>Save</Button>
                        <Button onClick={() => setEditingPdf(null)} style={{ background: '#f44336' }}>Cancel</Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span onClick={() => openPdf(`https://api.kiitwallah.live/api/resources${pdf.url}`)}>
                        {pdf.name}
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button onClick={() => handleEdit(pdf.name)}>Edit</Button>
                        <Button onClick={() => handleDelete(pdf.name)} style={{ background: '#f44336' }}>Delete</Button>
                      </div>
                    </>
                  )}
                </PdfCard>
              ))}
            </PdfList>

            {/* 📄 PDF Preview Modal */}
            {showModal && selectedPdf && (
              <div style={{ width: "80%", margin: "20px auto" }}>
                <Document file={selectedPdf} onLoadSuccess={onDocumentLoadSuccess}>
                  {Array.from(new Array(numPages), (_, index) => (
                    <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                  ))}
                </Document>
                <button onClick={() => setShowModal(false)}>Close</button>
              </div>
            )}
          </>
        );
      case 'settings':
        return <div>Settings</div>;
      default:
        return <AlumniManagement />;
    }
  };

  const openPdf = (url) => {
    setSelectedPdf(url);
    setShowModal(true);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <PageTransition isLoading={loading}>
      <LoadingScreen message="Loading dashboard" />
      <DashboardContainer>
        <Sidebar>
          <Logo>KIITWALLAH Admin</Logo>
          
          <MenuItem
            active={activeSection === 'alumni'}
            onClick={() => setActiveSection('alumni')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiGrid />
            Alumni Nexus
          </MenuItem>

          <MenuItem
            active={activeSection === 'users'}
            onClick={() => setActiveSection('users')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiUsers />
            Users
          </MenuItem>

          <MenuItem
            active={activeSection === 'resources'}
            onClick={() => setActiveSection('resources')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiBook />
            Resources
          </MenuItem>

          <MenuItem
            active={activeSection === 'settings'}
            onClick={() => setActiveSection('settings')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiSettings />
            Settings
          </MenuItem>

          <MenuItem
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ marginTop: 'auto' }}
          >
            <FiLogOut />
            Logout
          </MenuItem>
        </Sidebar>

        <MainContent>
          {renderContent()}
        </MainContent>
      </DashboardContainer>
    </PageTransition>
  );
};

export default AdminDashboard; 