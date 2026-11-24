import React from 'react';
import SupervisorLayout from '../../components/supervisor/SupervisorLayout';
import MessageCenter from '../../components/messages/MessageCenter';

export default function SupervisorMessages() {
  return (
    <SupervisorLayout>
      <div className="space-y-4">
        <div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-brand-primary">
            Supervisory Channel Coordination
          </h1>
          <p className="text-xs sm:text-sm text-brand-secondary mt-1">
            Real-time direct liaison with homeowners, trade artisans, and regional cooperative dispatch units.
          </p>
        </div>

        <MessageCenter role="supervisor" />
      </div>
    </SupervisorLayout>
  );
}
