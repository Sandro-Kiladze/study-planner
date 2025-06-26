import { useState, useCallback } from 'react';
import { Assignment, CreateAssignmentRequest, UpdateAssignmentRequest } from '../../../shared/src';
import { assignmentService, AssignmentFilters } from '../services/assignmentService';
import { useApi } from './useApi';

export function useAssignments(filters?: AssignmentFilters) {
  const [optimisticUpdates, setOptimisticUpdates] = useState<Assignment[]>([]);
  
  const apiCall = useCallback(() => assignmentService.getAssignments(filters), [filters]);
  const { data, loading, error, refetch } = useApi<Assignment[]>(apiCall, [filters]);

  const assignments = data || [];
  const displayAssignments = [...assignments, ...optimisticUpdates];

  const createAssignment = async (assignmentData: CreateAssignmentRequest): Promise<Assignment> => {
    try {
      const newAssignment = await assignmentService.createAssignment(assignmentData);
      await refetch();
      return newAssignment;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create assignment');
    }
  };

  const updateAssignment = async (id: string, updates: UpdateAssignmentRequest): Promise<Assignment> => {
    try {
      const updatedAssignment = await assignmentService.updateAssignment(id, updates);
      await refetch();
      return updatedAssignment;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update assignment');
    }
  };

  const deleteAssignment = async (id: string): Promise<void> => {
    try {
      await assignmentService.deleteAssignment(id);
      await refetch();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete assignment');
    }
  };

  return {
    assignments: displayAssignments,
    loading,
    error,
    refetch,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}