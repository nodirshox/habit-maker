import Typography, { TypographyProps } from '@mui/material/Typography';
import * as React from 'react'

export default function Footer(props: TypographyProps) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright '}
      {new Date().getFullYear()}
    </Typography>
  )
}
