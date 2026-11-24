import React from 'react';
import WorkerLayout from '../../components/worker/WorkerLayout';
import MessageCenter from '../../components/messages/MessageCenter';

export default function WorkerMessages() {
  return (
    <WorkerLayout>
      <div className="space-y-4">
        <div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-brand-primary">
            Job & Field Communications
          </h1>
          <p className="text-xs sm:text-sm text-brand-secondary mt-1">
            Direct real-time chat with clients and cooperative field engineering supervisors for active dispatches.
          </p>
        </div>

        <MessageCenter role="worker" />
      </div>
    </WorkerLayout>
  );
}
