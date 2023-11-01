import { LinearProgress } from '@mui/material'
import Box from '@mui/material/Box'
import * as React from 'react'

export default function LoadingBar() {
  return (
    <Box sx={{ width: '100%', color: 'primary' }}>
      <LinearProgress />
    </Box>
  )
}
