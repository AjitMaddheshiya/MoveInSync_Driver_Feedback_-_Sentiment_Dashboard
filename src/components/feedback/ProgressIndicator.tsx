import './ProgressIndicator.css';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  titles: string[];
}

export default function ProgressIndicator({ currentStep, totalSteps, titles }: ProgressIndicatorProps) {
  return (
    <div className="progress-indicator">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>
      <div className="progress-steps">
        {titles.map((title, index) => (
          <div 
            key={index} 
            className={`progress-step ${index <= currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
          >
            <div className="progress-step-number">
              {index < currentStep ? '✓' : index + 1}
            </div>
            <div className="progress-step-title">{title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
