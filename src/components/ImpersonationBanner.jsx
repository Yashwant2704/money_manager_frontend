import React from 'react';
import { Box, Alert, Button, Typography } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import impersonationService from '../impersonationService';

const ImpersonationBanner = () => {
  if (!impersonationService.isImpersonating()) {
    return null;
  }

  const impersonatedUser = impersonationService.getImpersonatedUser();

  const handleStopImpersonation = () => {
    impersonationService.stopImpersonation();
  };

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}>
      <Alert 
        severity="warning" 
        sx={{ 
          borderRadius: 0,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={handleStopImpersonation}
            startIcon={<ExitToApp />}
          >
            Stop Impersonation
          </Button>
        }
      >
        <Typography variant="body2">
          <strong>IMPERSONATING:</strong> {impersonatedUser?.email}
        </Typography>
      </Alert>
    </Box>
  );
};

export default ImpersonationBanner;
