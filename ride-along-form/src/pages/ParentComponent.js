// src/components/ParentComponent.js

import React, { useState } from 'react';
import Page1 from '../pages/page1';
import Page2 from '../pages/page2';
import RiderAssessment from './RiderAssessment'; 
import VehicleAssessment from './VehicleAssessment';
import VehicleDetails from './VehicleDetails';
import ReviewPage from './ReviewPage'; // Import the ReviewPage component

const ParentComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    hq: '',
    name: '',
    team: '',
    lineMan: '',
    vehicleAssessment: {},
    riderAssessment: {},  // Add riderAssessment here
    vehicleDetails: {},
  });

  const handleFormChange = (page, name, value) => {
    if (['date', 'hq', 'name', 'team', 'lineMan'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [page]: {
          ...prev[page],
          [name]: value,
        },
      }));
    }
  };

  const goToNextPage = () => {
    if (currentPage === 1 && (formData.date && formData.hq && formData.name && formData.team && formData.lineMan)) {
      setCurrentPage(currentPage + 1);
    } else if (currentPage === 2) {
      setCurrentPage(currentPage + 1);
    } else if (currentPage === 3) {
      setCurrentPage(currentPage + 1);  // Go to RiderAssessment
    } else if (currentPage === 4) {
      setCurrentPage(currentPage + 1);  // Go to VehicleDetails
    } else if (currentPage === 5) {
      setCurrentPage(currentPage + 1);  // Go to ReviewPage
    }
  };

  const goToPreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handlePreview = () => {
    setCurrentPage(6); // Navigate to ReviewPage
  };

  return (
    <div>
      {currentPage === 1 && <Page1 onNext={() => setCurrentPage(2)} />}
      {currentPage === 2 && <Page2 onNext={() => setCurrentPage(3)} onPrevious={() => setCurrentPage(1)} />}
      {currentPage === 3 && (
        <VehicleAssessment 
          formData={formData} 
          handleFormChange={handleFormChange} 
          onNext={() => setCurrentPage(4)}  // Link to RiderAssessment
          onPreview={handlePreview} // Link to ReviewPage
          onPrevious={goToPreviousPage} 
        />
      )}
      {currentPage === 4 && (
        <RiderAssessment 
          formData={formData} 
          handleFormChange={handleFormChange} 
          onNext={() => setCurrentPage(5)} 
          onPrevious={() => setCurrentPage(3)}  // Link back to VehicleAssessment
        />
      )}
      {currentPage === 5 && (
        <VehicleDetails
          formData={formData}
          handleFormChange={handleFormChange}
          onNext={goToNextPage}
          onPrevious={() => setCurrentPage(4)} // Link back to RiderAssessment
        />
      )}
      {currentPage === 6 && (
        <ReviewPage
          formData={formData}
          onPrevious={() => setCurrentPage(5)} // Link back to VehicleDetails
        />
      )}
    </div>
  );
};

export default ParentComponent;
