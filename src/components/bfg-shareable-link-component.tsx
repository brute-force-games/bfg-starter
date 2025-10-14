import { Alert, Box, CheckCircle, ContentCopy, IconButton, InputAdornment, Link as LinkIcon, OpenInNew, Paper, Stack, TextField, Typography } from "@bfg-engine"
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
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            }}
            title="Open in new window"
          >
            <OpenInNew />
          </IconButton>
          <IconButton
            onClick={copyToClipboard}
            style={{
              backgroundColor: copySuccess ? '#4caf50' : 'rgba(0, 0, 0, 0.04)',
              color: copySuccess ? 'white' : 'inherit',
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
            readOnly
            style={{ fontFamily: 'monospace' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon style={{ color: '#666' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        {copySuccess && (
          <Alert severity="success" style={{ marginTop: '8px' }}>
            Link copied to clipboard!
          </Alert>
        )}
      </Box>
    );
  }

  return (
    <Paper elevation={2} style={{ padding: '24px', marginBottom: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
      <Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            onClick={openInNewWindow}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
            }}
            title="Open in new window"
          >
            <OpenInNew />
          </IconButton>
          <IconButton
            onClick={copyToClipboard}
            style={{
              backgroundColor: copySuccess ? '#4caf50' : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
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
            readOnly
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontFamily: 'monospace',
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        {copySuccess && (
          <Alert severity="success" style={{ marginTop: '8px', backgroundColor: 'rgba(76, 175, 80, 0.2)' }}>
            Link copied to clipboard!
          </Alert>
        )}
      </Box>
    </Paper>
  )
}