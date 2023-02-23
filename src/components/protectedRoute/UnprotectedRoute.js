import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Store } from '../Store';

export default function UnprotectedRoute({ children }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return userInfo ? (userInfo.account_type==="admin")?(<Navigate to="/admin/home" />):(<Navigate to="/shopOwner/shops" />):children
}