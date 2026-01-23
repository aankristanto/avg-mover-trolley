import React from 'react';
import './operationDayCard.css';

const OperationDayCard = ({
  data,
  layout = 'horizontal', // 'vertical' | 'horizontal'
  showTitle = false,
  showEndTime = false,
  showEmptyTolerance = false,
  showLineTolerance = false,
  showPackingTolerance = false,
}) => {
  if (!data) return null;

  const formatTime = (timeStr) => {
    if (!timeStr) return '–';
    return timeStr.slice(0, 5);
  };

  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const dayName = dayNames[data.DAY] || `Hari ${data.DAY}`;

  const timeItems = [
    { label: 'Start Time', value: formatTime(data.START_TIME), show: true },
    { label: 'End Time', value: formatTime(data.END_TIME), show: showEndTime },
    { label: 'Empty trolley MAX', value: formatTime(data.EMPTY_TOLERANCE), show: showEmptyTolerance },
    { label: 'Line MAX', value: formatTime(data.LINE_TOLERANCE), show: showLineTolerance },
    { label: 'Packing MAX', value: formatTime(data.PACKING_TOLERANCE), show: showPackingTolerance },
  ].filter(item => item.show);

  return (
    <div className="operation-day-wrapper">
      {showTitle && <h2 className="operation-day-section-title">Operation Day</h2>}
      <div className={`operation-day-card operation-day-card--${layout}`}>
        <div className="operation-day-header">
          <h3 className="operation-day-title">{dayName}</h3>
          {data.NOTE && <p className="operation-day-note">{data.NOTE}</p>}
        </div>

        <div className={`operation-day-times operation-day-times--${layout}`}>
          {timeItems.map((item, index) => (
            <div key={index} className="operation-day-time-item">
              <span className="operation-day-label">{item.label}</span>
              <span className="operation-day-value">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OperationDayCard;