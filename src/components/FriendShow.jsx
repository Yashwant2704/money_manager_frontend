import React from "react";
import { Show, SimpleShowLayout, TextField, NumberField } from "react-admin";

const FriendShow = (props) => {
  const TransactionSummary = ({ record }) => {
    if (!record || !record.transactions) return null;
    const count = record.transactions.length;
    const totalAmount = record.transactions.reduce((sum, txn) => sum + txn.amount, 0);
    return (
      <div>
        <strong>Transaction Count:</strong> {count}<br />
        <strong>Total Transaction Amount:</strong> {totalAmount}
      </div>
    );
  };

  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="name" />
        <TextField source="mail" /> {/* if mail is friend mail */}
        <TextField source="user.email" label="User Email" /> {/* nested user email */}
        <NumberField source="balance" />
        <TransactionSummary />
      </SimpleShowLayout>
    </Show>
  );
};

export default FriendShow;
