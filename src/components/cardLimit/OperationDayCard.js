import React from 'react';
import './operationDayCard.css';

const OperationDayCard = ({
  data = [], // array of assignment records
  layout = 'horizontal', // 'vertical' | 'horizontal'
  showTitle = false,
  showEndTime = false,
  showEmptyTolerance = false,
  showLineTolerance = false,
  showPackingTolerance = false,
}) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  const formatTime = (timeStr) => {
    if (!timeStr) return '–';
    return timeStr.slice(0, 5);
  };

  const dayNames = ['', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  const uniqueDays = [...new Set(data.map(item => item.AGV_OPERATION_DAY.DAY))];

  return (
    <div className="operation-day-wrapper">
      {showTitle && <h2 className="operation-day-section-title">Operation Day</h2>}
      
      {uniqueDays.map((day) => {
        const dayItems = data.filter(item => item.AGV_OPERATION_DAY.DAY === day);
        const firstItem = dayItems[0]?.AGV_OPERATION_DAY;
        const dayName = dayNames[day] || `Hari ${day}`;

        return (
          <div key={day} className={`operation-day-card operation-day-card--${layout}`}>
            <div className={`operation-day-shifts operation-day-shifts--${layout}`}>
              <div className="operation-day-header">
              <h3 className="operation-day-title">{dayName}</h3>
              {firstItem?.NOTE && <p className="operation-day-note">{firstItem.NOTE}</p>}
            </div>
              {dayItems.map((item, idx) => {
                const op = item.AGV_OPERATION_DAY;
                const timeItems = [
                  { label: 'Start Time', value: formatTime(op.START_TIME), show: true },
                  { label: 'End Time', value: formatTime(op.END_TIME), show: showEndTime },
                  { label: 'Empty trolley MAX', value: formatTime(op.EMPTY_TOLERANCE), show: showEmptyTolerance },
                  { label: 'Line MAX', value: formatTime(op.LINE_TOLERANCE), show: showLineTolerance },
                  { label: 'Packing MAX', value: formatTime(op.PACKING_TOLERANCE), show: showPackingTolerance },
                ].filter(t => t.show);

                return (
                  <div key={idx} className="operation-day-shift-item">
                    
                    <div className="operation-day-shift-badge">
                      {op.SHIFT || 'Shift'}
                    </div>

                    
                    <div className={`operation-day-times operation-day-times--${layout}`}>
                      {timeItems.map((t, i) => (
                        <div key={i} className="operation-day-time-item">
                          <span className="operation-day-label">{t.label}</span>
                          <span className="operation-day-value">{t.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OperationDayCard;