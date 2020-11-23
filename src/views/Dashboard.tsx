import React from 'react';
import OrAdmin from '../auth/OrAdmin';

export default function Dashboard() {
  const role = 'guest';
  return <OrAdmin role={role}>ds</OrAdmin>;
}
