import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { verificationStages, mockWorker } from '../data/workerMockData';

export const verificationService = {
  /**
   * Fetch current verification status and stages
   */
  async getStatus(workerId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('worker_verifications')
        .select('*')
        .eq('worker_id', workerId)
        .single();

      if (error || !data) {
        return {
          currentStage: mockWorker.verificationStage,
          status: mockWorker.verificationStatus,
          stages: verificationStages,
        };
      }
      return {
        currentStage: data.current_stage,
        status: data.status,
        stages: verificationStages,
      };
    }
    return {
      currentStage: mockWorker.verificationStage,
      status: mockWorker.verificationStatus,
      stages: verificationStages,
    };
  },

  /**
   * Upload verification document securely to private storage bucket
   */
  async uploadDocument(workerId, file, documentType) {
    if (isSupabaseConfigured()) {
      const filePath = `workers/${workerId}/${Date.now()}_${file.name}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('worker-verification-docs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (storageError) throw storageError;

      // Save record in worker_documents table
      const { data, error } = await supabase
        .from('worker_documents')
        .insert({
          worker_id: workerId,
          document_type: documentType,
          storage_path: storageData.path,
          is_verified: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    // Local simulation fallback
    return {
      id: `doc-${Date.now()}`,
      document_type: documentType,
      storage_path: `local_simulated/${file.name}`,
      is_verified: false,
      created_at: new Date().toISOString(),
    };
  },

  /**
   * Supervisory officer review
   */
  async reviewVerification(workerId, reviewerId, status, reviewNotes) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('worker_verifications')
        .update({
          status,
          current_stage: status === 'approved' ? 5 : 3,
          reviewer_id: reviewerId,
          review_notes: reviewNotes,
          reviewed_at: new Date().toISOString(),
        })
        .eq('worker_id', workerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
    return { workerId, status, currentStage: status === 'approved' ? 5 : 3 };
  },

  /**
   * Get worker digital ID card
   */
  async getWorkerIdCard(workerId) {
    return {
      cardCode: mockWorker.id,
      workerName: mockWorker.name,
      role: mockWorker.role,
      avatar: mockWorker.avatar,
      badgeLevel: mockWorker.badgeLevel,
      cooperativeUnit: mockWorker.cooperativeUnit,
      issueDate: '15 Mar 2024',
      expiryDate: '31 Mar 2027',
      isApproved: mockWorker.verificationStatus === 'Approved',
    };
  },
};
