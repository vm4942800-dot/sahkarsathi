import React from 'react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import MessageCenter from '../../components/messages/MessageCenter';

export default function CustomerMessages() {
  return (
    <CustomerLayout title="Direct Project Messages">
      <div className="space-y-4">
        <div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-brand-primary">
            Direct Project Messages
          </h1>
          <p className="text-xs sm:text-sm text-brand-secondary mt-1">
            Real-time, escrow-protected coordination with your assigned service technicians and regional supervisors.
          </p>
        </div>

        <MessageCenter role="customer" />
      </div>
    </CustomerLayout>
  );
}
