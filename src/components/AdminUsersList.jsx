import React from 'react';
import { 
  List, 
  Datagrid, 
  TextField, 
  ArrayField, 
  SingleFieldList, 
  ChipField,
  Button,
  useNotify,
  FunctionField
} from 'react-admin';
import { Person } from '@mui/icons-material';
import impersonationService from '../impersonationService';

const ImpersonateButton = ({ record }) => {
  const notify = useNotify();
  
  const handleImpersonate = async () => {
    console.log('Impersonate button clicked for:', record);
    
    try {
      await impersonationService.impersonateUser(record.id);
      
      notify(`Now impersonating ${record.email}`, 'success');
      
      // Redirect to main user app (not admin) after successful impersonation
      setTimeout(() => {
        window.location.href = '/'; // Redirect to main app root
        // Or if your main app is at a different route:
        // window.location.href = '/dashboard';
        // window.location.href = '/app';
      }, 1000);
    } catch (error) {
      console.error('Impersonation error:', error);
      notify(`Failed to impersonate user: ${error.message}`, 'error');
    }
  };

  return (
    <Button
      onClick={handleImpersonate}
      label="Impersonate"
      variant="outlined"
      size="small"
      sx={{ minWidth: 'auto', px: 1 }}
    >
      <Person fontSize="small" sx={{ mr: 0.5 }} />
    </Button>
  );
};

export const AdminUsersList = props => (
  <List {...props} title="Users Management" perPage={25}>
    <Datagrid bulkActionButtons={false}>
      <TextField source="email" />
      <TextField source="name" />
      <ArrayField source="friends" label="Friends">
        <SingleFieldList>
          <ChipField source="name" size="small" />
        </SingleFieldList>
      </ArrayField>
      <FunctionField
        label="Friends Count"
        render={record => record.friends ? record.friends.length : 0}
      />
      <FunctionField
        label="Action"
        render={record => <ImpersonateButton record={record} />}
      />
    </Datagrid>
  </List>
);
