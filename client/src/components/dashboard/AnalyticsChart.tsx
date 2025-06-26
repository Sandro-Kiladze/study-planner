import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Assignment } from '../../../../shared/src/types/Assignment';
import { format, subDays, eachDayOfInterval } from 'date-fns';

interface AnalyticsChartProps {
  assignments: Assignment[];
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ assignments }) => {
  // Generate data for the last 7 days
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  });

  const chartData = last7Days.map(date => {
    const dayAssignments = assignments.filter(assignment => 
      format(new Date(assignment.createdAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    
    const dayCompletions = assignments.filter(assignment => 
      assignment.status === 'completed' &&
      format(new Date(assignment.updatedAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );

    return {
      date: format(date, 'MMM dd'),
      created: dayAssignments.length,
      completed: dayCompletions.length
    };
  });

  return (
    <div className="dashboard-widget analytics-widget">
      <div className="widget-header">
        <h3>Weekly Activity</h3>
      </div>
      <div className="widget-content">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="created" 
              stroke="#007bff" 
              name="Created" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="completed" 
              stroke="#28a745" 
              name="Completed" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;