import React, { useRef } from 'react';
import './ReviewPage.css';
import jsPDF from 'jspdf'; // Library for generating PDFs

const ReviewPage = ({ formData, onNext, onPrevious }) => {
  const reviewRef = useRef(); // Ref to target the review content for printing/PDF

  // Helper functions to handle default values dynamically
  const getAnswer = (sectionData, questionKey, defaultAnswer = "Yes") => {
    return sectionData && sectionData[`${questionKey}-answer`] ? sectionData[`${questionKey}-answer`] : defaultAnswer;
  };

  const getRemark = (sectionData, questionKey) => {
    return sectionData && sectionData[`${questionKey}-remark`] ? sectionData[`${questionKey}-remark`] : "No Remarks";
  };

  const getTextValue = (value, defaultValue = "Not Provided") => {
    return value ? value : defaultValue;
  };

  const submitToGoogleSheets = async (formData) => {
    const url = "https://script.google.com/macros/s/AKfycbwCv_5DzGXhLlOlqx7BPZXDCJNv39sePV5WpKa1LPrJboFBs6ZKw9ivYW2wD7mTnWpz/exec";
    console.log("formData in googleSheets:", formData);

  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(formData), // Send the formData as the body
      });
  
      const result = await response.json();
      console.log("result in google sheets :", result);
      if (result.status === "success") {
        alert("Form submitted successfully to Google Sheets!");
      } else {
        alert("Error submitting form: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };
  

  // Define sections and questions dynamically
  const sections = [
    {
      title: 'Mandatory Information',
      data: formData,
      questions: [
        { label: 'Date', key: 'date' },
        { label: 'HQ', key: 'hq' },
        { label: 'Name', key: 'name' },
        { label: 'Team', key: 'team' },
        { label: 'Line Man', key: 'lineMan' },
        // { label: 'Are you a new joinee?', key: 'newJoinee', defaultAnswer: 'No' }
      ]
    },
    {
      title: 'Vehicle Assessment',
      data: formData.vehicleAssessment,
      questions: [
        "Is the Vehicle Tyre Pressure correct?",
        "How is the treading condition of the tyres?",
        "Is the speedometer functioning properly?",
        "Is the fuel meter functioning properly?",
        "Are both mirrors present? Is it positioned properly as per rider's eye line?",
        "Do the front and rear brakes function properly?",
        "Is the horn functioning properly?",
        "Is the auto/kick starter functioning properly?",
        "Is the vehicle key in good condition? Check for any bend or rust.",
        "How is the seat condition of the vehicle? Is there any damage/cuts?",
        "Is the main stand & side stand functioning properly?",
        "Are the number plates of the vehicle clearly visible?"
      ]
    },
    {
      title: 'Rider Assessment',
      data: formData.riderAssessment,
      questions: [
        "Does the rider use hand signal/indicator while taking a turn?",
        "Does the rider overtake from the correct side?",
        "Does the rider wear shoes with a well-defined heel while riding?",
        "Is the rider sleepy while riding?",
        "Does the rider stop at traffic signals?",
        "Does the rider use a mobile phone while riding?",
        "Does the rider follow legal speed limits?",
        "Is the rider’s sitting posture correct? Check the position of hands, elbows, knees, and thighs.",
        "Does the rider make way for an ambulance?",
        "Is the rider courteous to other road users?",
        "Has the rider attended the Safe Rider Programme? Date:",
        "Does the rider wear an AZ Helmet with the strap buckled?",
        "Is the helmet in good condition?",
        "Does the rider wear an AZ Jacket?",
        "Is the jacket in good condition?"
      ]
    },
    {
      title: 'Vehicle Details',
      data: formData.vehicleDetails,
      questions: [
        { label: 'Primary Vehicle Number', key: 'primaryVehicleNumber' },
        { label: 'Primary Vehicle Manufacturer', key: 'primaryVehicleManufacturer' },
        { label: 'Primary Vehicle Model', key: 'primaryVehicleModel' },
        { label: 'Do you use a secondary vehicle for field of work?', key: 'useSecondaryVehicle', defaultAnswer: 'No' }
      ],
      secondaryQuestions: formData.vehicleDetails && formData.vehicleDetails.useSecondaryVehicle === 'Yes' ? [
        { label: 'Secondary Vehicle Number', key: 'secondaryVehicleNumber' },
        { label: 'Secondary Vehicle Manufacturer', key: 'secondaryVehicleManufacturer' },
        { label: 'Secondary Vehicle Model', key: 'secondaryVehicleModel' }
      ] : [] // Show secondary vehicle questions only if selected
    }
  ];

  // Print functionality
  const handlePrint = () => {
    window.print(); // Use browser's print functionality
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height; // Get page height
    const lineHeight = 10; // Line height for each question
    let yPosition = 10; // Start Y position for content
  
    doc.text("Review Your Submission", 10, yPosition);
    yPosition += lineHeight * 2; // Adding space after the heading
  
    sections.forEach(section => {
      doc.setFontSize(14);
      doc.text(section.title, 10, yPosition);
      yPosition += lineHeight; // Move to the next line
  
      section.questions.forEach((question, index) => {
        if (yPosition > pageHeight - 20) {
          // If content exceeds the page height, add a new page
          doc.addPage();
          yPosition = 10; // Reset Y position for the new page
        }
  
        const questionText = typeof question === 'string' ? question : question.label;
        const answer = getTextValue(section.data[question.key] || getAnswer(section.data, index));
  
        doc.setFontSize(12); // Set font size for content
        doc.text(`${questionText}: ${answer}`, 10, yPosition);
        yPosition += lineHeight; // Move to the next line after each question
      });
  
      // Handle secondary questions for VehicleDetails section if applicable
      if (section.secondaryQuestions) {
        section.secondaryQuestions.forEach(question => {
          if (yPosition > pageHeight - 20) {
            // Add new page if content exceeds the page height
            doc.addPage();
            yPosition = 10; // Reset Y position for the new page
          }
  
          const questionText = question.label;
          const answer = getTextValue(section.data[question.key]);
  
          doc.text(`${questionText}: ${answer}`, 10, yPosition);
          yPosition += lineHeight;
        });
      }
  
      yPosition += lineHeight; // Add extra space between sections
    });
  
    doc.save('review-submission.pdf'); // Save and download the PDF
  };
  

  const handleSubmit = () => {
    // submitToGoogleSheets(formData); 
  
    // Convert formData to a readable format for email body
    const formatFormDataForEmail = (data) => {
      let emailBody = '';
  
      // Format mandatory fields
      emailBody += `Name: ${data.name || 'Not provided'}\n`;
      emailBody += `Date: ${data.date || 'Not provided'}\n`;
      emailBody += `HQ: ${data.hq || 'Not provided'}\n`;
      emailBody += `Team: ${data.team || 'Not provided'}\n`;
      emailBody += `Line Man: ${data.lineMan || 'Not provided'}\n`;
      emailBody += `Are you a new joinee?: ${data.newJoinee || 'No'}\n\n`;
  
      // Format Vehicle Assessment
      emailBody += 'Vehicle Assessment:\n';
      Object.keys(data.vehicleAssessment || {}).forEach((key, index) => {
        emailBody += `Question ${index + 1}: ${data.vehicleAssessment[key]} \n`;
      });
      emailBody += '\n';
  
      // Format Rider Assessment
      emailBody += 'Rider Assessment:\n';
      Object.keys(data.riderAssessment || {}).forEach((key, index) => {
        emailBody += `Question ${index + 1}: ${data.riderAssessment[key]} \n`;
      });
      emailBody += '\n';
  
      // Format Vehicle Details
      emailBody += 'Vehicle Details:\n';
      emailBody += `Primary Vehicle Number: ${data.vehicleDetails?.primaryVehicleNumber || 'Not provided'}\n`;
      emailBody += `Primary Vehicle Manufacturer: ${data.vehicleDetails?.primaryVehicleManufacturer || 'Not provided'}\n`;
      emailBody += `Primary Vehicle Model: ${data.vehicleDetails?.primaryVehicleModel || 'Not provided'}\n`;
      emailBody += `Do you use a secondary vehicle?: ${data.vehicleDetails?.useSecondaryVehicle || 'No'}\n\n`;
  
      if (data.vehicleDetails?.useSecondaryVehicle === 'Yes') {
        emailBody += 'Secondary Vehicle Details:\n';
        emailBody += `Secondary Vehicle Number: ${data.vehicleDetails?.secondaryVehicleNumber || 'Not provided'}\n`;
        emailBody += `Secondary Vehicle Manufacturer: ${data.vehicleDetails?.secondaryVehicleManufacturer || 'Not provided'}\n`;
        emailBody += `Secondary Vehicle Model: ${data.vehicleDetails?.secondaryVehicleModel || 'Not provided'}\n`;
      }
  
      return emailBody;
    };
  
    // Generate readable formData for the email body
    const emailBody = encodeURIComponent(formatFormDataForEmail(formData)); // URL encode the body content
  
    // Proceed with the mailto and PDF submission logic
    const mailToLink = `mailto:akhilxtel@gmail.com?subject=Ride Along Form Submission&body=${emailBody}`;
    window.location.href = mailToLink; // This will open the default email client with the populated body
    onNext();
  };
  

  return (
    <div className="vehicle-assessment-container" ref={reviewRef}>
      <h1 className='main-heading'>Review Your Submission</h1>

      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="section">
          <h2>{section.title}</h2>
          <div className="section-content">
            {section.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="question-answer">
                <div className="question">
                  {typeof question === 'string' ? question : question.label}
                </div>
                <div className="answer">
                  {typeof question === 'string'
                    ? getAnswer(section.data, questionIndex) // For radio button questions
                    : getTextValue(section.data[question.key], question.defaultAnswer)} {/* For text fields */}
                </div>
                {/* Display remarks if it's a radio button question */}
                {typeof question === 'string' && (
                  <div className="remarks">
                    Remarks: {getRemark(section.data, questionIndex)}
                  </div>
                )}
              </div>
            ))}

            {/* Handle secondary vehicle questions conditionally */}
            {section.secondaryQuestions && section.secondaryQuestions.map((question, questionIndex) => (
              <div key={questionIndex} className="question-answer">
                <div className="question">{question.label}</div>
                <div className="answer">
                  {getTextValue(section.data[question.key], 'Not Provided')}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Buttons */}
      <div className="button-group">
        <button onClick={handlePrint} className="btn btn-previous">Print</button>
        <button onClick={handleDownloadPDF} className="btn btn-next">Download as PDF</button>
        <button onClick={handleSubmit} className="btn btn-next">Submit</button>
      </div>
    </div>
  );
};

export default ReviewPage;
