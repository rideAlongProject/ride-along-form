import React, {useEffect} from 'react';
import './RiderAssessment.css';
import watermark from '../assets/waterMark.png';
import NavigationSteps from './NavigationSteps';
import ReDark from '../assets/ReDark.png'; // Path to your bike logo

const RiderAssessment = ({ formData, handleFormChange, onNext, onPrevious }) => {
  const questions = [
    "Does the rider have a valid driving license?",
    "Is the rider wearing a helmet?",
    "Is the helmet properly fastened?",
    "Is the rider wearing appropriate footwear?",
    "Is the rider wearing a reflective jacket?",
    "Is the rider fit to drive (e.g., not tired, intoxicated, etc.)?",
    "Does the rider have a valid insurance policy for the vehicle?",
    "Is the rider familiar with the route?",
    "Does the rider have a mobile phone for communication?",
    "Is the rider adhering to traffic rules and signals?",
    "Is the rider aware of vehicle speed limits?",
    "Does the rider know emergency contact numbers in case of accidents?"
  ];

  useEffect(() => {
    // Scroll to top of the page when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e, questionIndex, type) => {
    const { value } = e.target;

    if (type === 'radio') {
      handleFormChange('riderAssessment', `${questionIndex}-answer`, value);
    } else if (type === 'remark') {
      handleFormChange('riderAssessment', `${questionIndex}-remark`, value);
    }
  };

  return (
    <div className="rider-assessment-container">
      <h1 className='main-heading'>TWO WHEELER RIDE ALONG FORM</h1>
      <NavigationSteps currentStep="riderAssessment" />
      <div className="watermark">
        <img src={watermark} alt="Watermark" />
      </div>
      {/* <img src={ReDark} alt="Bike Logo" className="bike-animation" /> */}
      <form>
        {questions.map((question, index) => (
          <div key={index} className="question-container">
            <div className="question-text">
              {question}
            </div>
            <div className="response-container">
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name={`question-${index}-answer`}
                    value="Yes"
                    checked={formData.riderAssessment[`${index}-answer`] === 'Yes' || formData.riderAssessment[`${index}-answer`] === undefined}
                    onChange={(e) => handleChange(e, index, 'radio')}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name={`question-${index}-answer`}
                    value="No"
                    checked={formData.riderAssessment[`${index}-answer`] === 'No'}
                    onChange={(e) => handleChange(e, index, 'radio')}
                  />
                  No
                </label>
              </div>
              <textarea
                name={`remark-${index}`}
                value={formData.riderAssessment[`${index}-remark`] || ''}
                onChange={(e) => handleChange(e, index, 'remark')}
                maxLength="175"
                placeholder="Remark..."
              />
            </div>
          </div>
        ))}

        <div className="button-group">
          <button type="button" onClick={onPrevious} className="btn btn-previous">Previous</button>
          <button type="button" onClick={onNext} className="btn btn-next">Next</button>
        </div>
      </form>
    </div>
  );
};

export default RiderAssessment;
