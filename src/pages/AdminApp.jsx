import React from 'react';
import { Admin, Resource } from 'react-admin';
import dataProvider from '../dataProvider';
import { AdminFriendsList } from '../components/AdminFriendsList';
import { AdminUsersList } from '../components/AdminUsersList';
import FriendShow from '../components/FriendShow';
import FriendEdit from '../components/FriendEdit';
import impersonationService from '../impersonationService';

const AdminApp = () => {
  // Add padding when impersonating to account for banner
  const appStyle = {
    paddingTop: impersonationService.isImpersonating() ? '48px' : '0',
    minHeight: '100vh'
  };

  return (
    <div style={appStyle}>
      <Admin dataProvider={dataProvider} basename="/admin">
        <Resource name="friends" list={AdminFriendsList} show={FriendShow} edit={FriendEdit} />
        <Resource name="users" list={AdminUsersList} />
      </Admin>
    </div>
  );
};

export default AdminApp;
