import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import MessageBox from '../layout/MessageBox';
import { Store } from '../../Store';

export default function AdminProtectedRoute({ children }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return userInfo ? (userInfo.role === "admin"?(children):<MessageBox variant={"danger"}>Restricted</MessageBox>) : <Navigate to="//" />;
}