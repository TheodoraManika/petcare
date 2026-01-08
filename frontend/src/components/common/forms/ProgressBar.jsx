import React from 'react';
import { Check } from 'lucide-react';
import './ProgressBar.css';

const ProgressBar = ({ steps, currentStep }) => {
  return (
    <div className="progress-bar">
      <div className="progress-bar__container">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          
          return (
            <React.Fragment key={stepNumber}>
              <div className="progress-bar__step">
                <div 
                  className={`progress-bar__circle ${
                    isCompleted ? 'progress-bar__circle--completed' : ''
                  } ${
                    isActive ? 'progress-bar__circle--active' : ''
                  }`}
                >
                  {isCompleted ? (
                    <Check size={20} />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="progress-bar__label-container">
                  <span 
                    className={`progress-bar__label ${
                      isActive ? 'progress-bar__label--active' : ''
                    }`}
                  >
                    {step.label}
                  </span>
                  {step.sublabel && (
                    <span className="progress-bar__sublabel">{step.sublabel}</span>
                  )}
                </div>
              </div>
              
              {stepNumber < steps.length && (
                <div 
                  className={`progress-bar__line ${
                    isCompleted ? 'progress-bar__line--completed' : ''
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
