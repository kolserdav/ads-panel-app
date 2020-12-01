import React from 'react';
import Auth from '../components/Auth';
import * as Types from '../react-app-env';

export default function Offers() {

  return (
    <Auth roles={['user', 'admin']} redirect={true}>
      TODO Offers
    </Auth>
  );
}