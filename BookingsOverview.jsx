import React, { useState } from 'react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import ActiveBookings from './ActiveBookings';
import BookingHistory from './BookingHistory';

export default function BookingsOverview() {
  // Renders Active Bookings by default
  return <ActiveBookings />;
}
