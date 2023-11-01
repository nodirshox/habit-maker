import { Alert, AlertTitle } from '@mui/material'
import * as React from 'react'

interface HttpErrorNotificationProps {
  message: string;
}

export default function HttpErrorNotification(prop: HttpErrorNotificationProps) {
  return (
    <Alert severity="error" sx={{ mt: 2 }}>
      <AlertTitle>Error</AlertTitle>
      {prop.message}
    </Alert>
  )
}
