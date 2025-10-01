import { CheckCircle, ContentCopy, Link as LinkIcon, OpenInNew } from "@mui/icons-material"
import { Alert, Box, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material"
import { useState } from "react";


interface IBfgShareableLinkComponentProps {
  linkLabel: string;
  linkUrl: string;
  variant?: 'gradient' | 'standard';
}

export const BfgShareableLinkComponent = ({ linkLabel, linkUrl, variant = 'gradient' }: IBfgShareableLinkComponentProps) => {

  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(linkUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = linkUrl;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const openInNewWindow = () => {
    window.open(linkUrl, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'standard') {
    return (
      <Box>
        <Typography variant="h6" component="h2" gutterBottom>
          {linkLabel}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            onClick={openInNewWindow}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
              }
            }}
            title="Open in new window"
          >
            <OpenInNew />
          </IconButton>
          <IconButton
            onClick={copyToClipboard}
            sx={{
              backgroundColor: copySuccess ? 'success.main' : 'rgba(0, 0, 0, 0.04)',
              color: copySuccess ? 'white' : 'inherit',
              '&:hover': {
                backgroundColor: copySuccess ? 'success.dark' : 'rgba(0, 0, 0, 0.08)',
              }
            }}
            title="Copy to clipboard"
          >
            {copySuccess ? <CheckCircle /> : <ContentCopy />}
          </IconButton>
          <TextField
            value={linkUrl}
            size="small"
            fullWidth
            variant="outlined"
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              sx: {
                fontFamily: 'monospace',
              }
            }}
          />
        </Stack>
        {copySuccess && (
          <Alert severity="success" sx={{ mt: 1 }}>
            Link copied to clipboard!
          </Alert>
        )}
      </Box>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
      <Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            onClick={openInNewWindow}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }
            }}
            title="Open in new window"
          >
            <OpenInNew />
          </IconButton>
          <IconButton
            onClick={copyToClipboard}
            sx={{
              backgroundColor: copySuccess ? 'success.main' : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '&:hover': {
                backgroundColor: copySuccess ? 'success.dark' : 'rgba(255, 255, 255, 0.2)',
              }
            }}
            title="Copy to clipboard"
          >
            {copySuccess ? <CheckCircle /> : <ContentCopy />}
          </IconButton>
          <TextField
            value={linkUrl}
            size="small"
            fullWidth
            variant="outlined"
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                  fontFamily: 'monospace',
                }
              }
            }}
          />
        </Stack>
        {copySuccess && (
          <Alert severity="success" sx={{ mt: 1, backgroundColor: 'rgba(76, 175, 80, 0.2)' }}>
            Link copied to clipboard!
          </Alert>
        )}
      </Box>
    </Paper>
  )
}