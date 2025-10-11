import { List, Datagrid, TextField, EmailField, NumberField } from 'react-admin';

export const AdminFriendsList = props => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="mail" />
      <NumberField source="balance" />
      {/* Add/remove fields as you wish */}
    </Datagrid>
  </List>
);
