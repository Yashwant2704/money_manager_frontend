import { Edit, SimpleForm, TextInput, NumberInput, ArrayInput, SimpleFormIterator, DateInput } from 'react-admin';

const FriendEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="mail" />
      <NumberInput source="balance" />
      <ArrayInput source="transactions">
        <SimpleFormIterator>
          <NumberInput source="amount" />
          <TextInput source="note" />
          <DateInput source="date" />
          {/* Do NOT include <TextInput source="_id" /> */}
        </SimpleFormIterator>
      </ArrayInput>
      {/* Do NOT include <TextInput source="user" /> */}
    </SimpleForm>
  </Edit>
);

export default FriendEdit;