import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  mockSupervisor,
  mockProjects,
  mockAssignments,
  mockCustomerRequests,
  mockSupervisorPayments,
  mockReportsData
} from '../data/supervisorMockData';

export const projectService = {
  /**
   * Fetch projects for supervisor
   */
  async getProjects(supervisorId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('projects')
        .select('*, project_tasks(*)')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) return mockProjects;
      return data;
    }
    return mockProjects;
  },

  /**
   * Get single project
   */
  async getProjectById(projectId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('projects')
        .select('*, project_tasks(*)')
        .eq('id', projectId)
        .single();

      if (error || !data) {
        return mockProjects.find((p) => p.id === projectId) || mockProjects[0];
      }
      return data;
    }
    return mockProjects.find((p) => p.id === projectId) || mockProjects[0];
  },

  /**
   * Create a new project
   */
  async createProject(project) {
    const projectCode = `PRJ-2026-${Math.floor(100 + Math.random() * 900)}`;

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          project_code: projectCode,
          project_name: project.projectName,
          description: project.description,
          supervisor_id: project.supervisorId,
          customer_ref: project.customerRef,
          general_location: project.generalLocation,
          start_date: project.startDate,
          expected_completion_date: project.expectedCompletionDate,
          status: project.status || 'planning',
          total_budget: parseFloat(project.totalBudget?.replace(/[^0-9.]/g, '') || '0'),
        })
        .select()
        .single();

      if (error) {
        console.warn('Project creation fallback:', error.message);
        return { ...project, id: projectCode };
      }
      return data;
    }
    return { ...project, id: projectCode };
  },

  /**
   * Update task progress
   */
  async updateTask(taskId, updates) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('project_tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
    return { id: taskId, ...updates };
  },

  /**
   * Add task
   */
  async addTask(projectId, task) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('project_tasks')
        .insert({
          project_id: projectId,
          task_name: task.name,
          assigned_worker_name: task.worker,
          due_date: task.dueDate,
          status: 'pending',
          progress_percentage: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
    return { id: `TSK-${Date.now()}`, ...task };
  },

  /**
   * Customer intake requests
   */
  async getCustomerRequests() {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('status', 'requested');

      if (error || !data || data.length === 0) return mockCustomerRequests;
      return data;
    }
    return mockCustomerRequests;
  },

  /**
   * Supervisor payment audit records
   */
  async getPaymentRecords() {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('payment_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) return mockSupervisorPayments;
      return data;
    }
    return mockSupervisorPayments;
  },

  /**
   * Reports analytics
   */
  async getReports() {
    return mockReportsData;
  },
};
