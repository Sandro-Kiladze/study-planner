import React, { useMemo } from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import { Assignment } from '../../../../shared/src/types/Assignment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface CalendarViewProps {
  assignments: Assignment[];
  onSelectAssignment?: (assignment: Assignment) => void;
}

interface CalendarEvent extends Event {
  assignment: Assignment;
}

const CalendarView: React.FC<CalendarViewProps> = ({ assignments, onSelectAssignment }) => {
  const events: CalendarEvent[] = useMemo(() => {
    return assignments.map(assignment => ({
      id: assignment.id,
      title: assignment.title,
      start: new Date(assignment.dueDate),
      end: new Date(assignment.dueDate),
      assignment: assignment,
      resource: assignment
    }));
  }, [assignments]);

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#007bff';
    
    switch (event.assignment.priority) {
      case 'high':
        backgroundColor = '#dc3545';
        break;
      case 'medium':
        backgroundColor = '#ffc107';
        break;
      case 'low':
        backgroundColor = '#28a745';
        break;
    }

    if (event.assignment.status === 'completed') {
      backgroundColor = '#6c757d';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: event.assignment.status === 'completed' ? 0.6 : 1,
        color: 'white',
        border: 'none',
        fontSize: '12px'
      }
    };
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    if (onSelectAssignment) {
      onSelectAssignment(event.assignment);
    }
  };

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
        views={['month', 'week', 'day']}
        defaultView="month"
        popup={true}
        tooltipAccessor={(event: CalendarEvent) => 
          `${event.assignment.title} - ${event.assignment.status}`
        }
      />
    </div>
  );
};

export default CalendarView;