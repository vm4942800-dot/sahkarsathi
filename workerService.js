import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  mockWorker,
  mockSkills,
  mockAvailableJobs,
  mockJobRequests,
  mockActiveJobs,
  mockCompletedJobs
} from '../data/workerMockData';

export const workerService = {
  /**
   * Fetch worker profile
   */
  async getProfile(workerId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('worker_profiles')
        .select('*, profiles(*)')
        .eq('profile_id', workerId)
        .single();

      if (error || !data) return mockWorker;
      return {
        ...mockWorker,
        ...data,
        name: data.profiles?.full_name || mockWorker.name,
        email: data.profiles?.email || mockWorker.email,
      };
    }
    return mockWorker;
  },

  /**
   * Update worker profile
   */
  async updateProfile(workerId, updates) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('worker_profiles')
        .update(updates)
        .eq('profile_id', workerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
    return { ...mockWorker, ...updates };
  },

  /**
   * Get skills
   */
  async getSkills(workerId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('worker_skills')
        .select('*')
        .eq('worker_id', workerId);

      if (error || !data || data.length === 0) return mockSkills;
      return data;
    }
    return mockSkills;
  },

  /**
   * Add skill
   */
  async addSkill(workerId, skill) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('worker_skills')
        .insert({
          worker_id: workerId,
          skill_name: skill.name,
          category: skill.category,
          level: skill.level,
          experience: skill.experience,
          is_certified: skill.isCertified,
          certification_name: skill.certificationName,
          description: skill.description,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
    return { id: `skl-${Date.now()}`, ...skill };
  },

  /**
   * Delete skill
   */
  async removeSkill(skillId) {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('worker_skills')
        .delete()
        .eq('id', skillId);

      if (error) throw error;
    }
    return true;
  },

  /**
   * Available Jobs nearby
   */
  async getAvailableJobs() {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('status', 'confirmed');

      if (error || !data || data.length === 0) return mockAvailableJobs;
      return data;
    }
    return mockAvailableJobs;
  },

  /**
   * Worker job requests
   */
  async getJobRequests(workerId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('job_requests')
        .select('*')
        .eq('worker_id', workerId);

      if (error || !data || data.length === 0) return mockJobRequests;
      return data;
    }
    return mockJobRequests;
  },

  /**
   * Respond to job request
   */
  async respondToRequest(requestId, status) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('job_requests')
        .update({ status, responded_at: new Date().toISOString() })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
    return { id: requestId, status };
  },

  /**
   * Active jobs
   */
  async getActiveJobs(workerId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('assigned_worker_id', workerId)
        .in('status', ['assigned', 'in_progress']);

      if (error || !data || data.length === 0) return mockActiveJobs;
      return data;
    }
    return mockActiveJobs;
  },

  /**
   * Completed jobs
   */
  async getCompletedJobs(workerId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('assigned_worker_id', workerId)
        .eq('status', 'completed');

      if (error || !data || data.length === 0) return mockCompletedJobs;
      return data;
    }
    return mockCompletedJobs;
  },
};
