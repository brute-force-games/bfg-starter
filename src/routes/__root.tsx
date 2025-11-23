import { Outlet, createRootRoute, Scripts, useRouter } from '@tanstack/react-router'
import { SiteHostingProvider } from '@bfg-engine/hooks/site-hosting'
import { BfgStarterGameHosting } from '../bfg-starter-hosting'
import { Container, Paper, Typography, Button, Stack, Box } from '@bfg-engine'
import { Inspector } from 'tinybase/ui-react-inspector'
import { Provider } from 'tinybase/ui-react'
import { playerProfileStore } from '@bfg-engine/tb-store/player-profile-store'
// import { hostedGamesStore } from '@bfg-engine/tb-store/hosted-games-store'
import { hostedLobbiesStore } from '@bfg-engine/tb-store/hosted-lobbies-store'
import { appSettingsStore } from '@bfg-engine/tb-store/app-settings-store'
import { useAppSettings } from '@bfg-engine/hooks/stores/use-my-app-settings-store'
import { gameArchivesStore } from '../../modules/bfg-engine/src/tb-store/games-archives-store'
// import { gameActionsStore } from '@bfg-engine/tb-store/hosted-game-actions-store'
import React from 'react'

// Workspace root path - configured via VITE_WORKSPACE_ROOT environment variable
// Set this in .env or .env.local file as an absolute path
// Example: VITE_WORKSPACE_ROOT=/Users/ajb/Projects/brute-force-games/bfg-starter
// This value is resolved at build time by vite.config.ts
// Relative paths are not supported - must be an absolute path
declare const __WORKSPACE_ROOT__: string;
const WORKSPACE_ROOT_RESOLVED = typeof __WORKSPACE_ROOT__ !== 'undefined' 
  ? __WORKSPACE_ROOT__ 
  : (import.meta.env.VITE_WORKSPACE_ROOT_RESOLVED as string | undefined);
if (!WORKSPACE_ROOT_RESOLVED) {
  throw new Error('WORKSPACE_ROOT is not defined. This should be set at build time by vite.config.ts. Check that VITE_WORKSPACE_ROOT is set in your .env file as an absolute path. Relative paths are not supported.');
}
if (!WORKSPACE_ROOT_RESOLVED.startsWith('/')) {
  throw new Error(`WORKSPACE_ROOT must be an absolute path (starting with /), but got: ${WORKSPACE_ROOT_RESOLVED}. Relative paths are not supported.`);
}
const WORKSPACE_ROOT = WORKSPACE_ROOT_RESOLVED;
console.log('WORKSPACE_ROOT resolved to:', WORKSPACE_ROOT);

/**
 * Parses a stack trace line and converts file locations to clickable links.
 * Matches patterns like:
 * - file.tsx:123:45
 * - file.tsx:123
 * - /path/to/file.tsx:123:45
 * - (file.tsx:123:45)
 */
const parseStackTraceLine = (line: string): React.ReactNode[] => {
  // Pattern to match file paths with line and optional column numbers
  // Matches: file.tsx:123:45, file.tsx:123, (file.tsx:123:45), etc.
  // Also matches file paths in URLs like http://localhost:62776/src/file.tsx:23:9
  // Handles query parameters: file.tsx?t=123:44:11
  // The pattern requires the file path to start with a letter, dot, or slash (not a number)
  // This avoids matching port numbers (like 62776) from URLs
  // We use a negative lookbehind to ensure we don't match the port number part of URLs
  // Updated to handle query parameters (?t=...) that may appear before line numbers in Vite stack traces
  const fileLocationPattern = /(?<!https?:\/\/[^:]*:)([a-zA-Z./][\w./-]*\.(tsx?|jsx?|ts|js))(?:\?[^:]*)?:(\d+)(?::(\d+))?/g
  
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match
  
  while ((match = fileLocationPattern.exec(line)) !== null) {
    // Debug logging
    console.log('Matched file path:', match[1], 'WORKSPACE_ROOT:', WORKSPACE_ROOT)
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(line.substring(lastIndex, match.index))
    }
    
    const filePath = match[1]
    // match[2] is the file extension (tsx, jsx, ts, js)
    // Note: We use a non-capturing group for query params, so indices remain the same
    const lineNumber = match[3]
    const columnNumber = match[4] || '1'
    
    // Resolve to absolute path
    let absolutePath = filePath
    if (!filePath.startsWith('/')) {
      // Relative path - resolve from workspace root
      if (!WORKSPACE_ROOT || !WORKSPACE_ROOT.startsWith('/')) {
        // Skip if workspace root is not set or not absolute
        console.warn('Skipping link creation - WORKSPACE_ROOT not set or not absolute:', WORKSPACE_ROOT)
        parts.push(match[0])
        lastIndex = fileLocationPattern.lastIndex
        continue
      }
      // Ensure workspace root doesn't end with / and file path doesn't start with /
      const cleanWorkspaceRoot = WORKSPACE_ROOT.replace(/\/+$/, '')
      const cleanFilePath = filePath.replace(/^\/+/, '')
      absolutePath = `${cleanWorkspaceRoot}/${cleanFilePath}`
    } else {
      // Absolute path - could be from a URL (e.g., /src/routes/__root.tsx from http://localhost:62776/src/routes/__root.tsx)
      // If it starts with / but is not a full filesystem path, resolve it relative to workspace root
      if (!absolutePath.startsWith(WORKSPACE_ROOT)) {
        // This is likely a web path, resolve it relative to workspace root
        const cleanWorkspaceRoot = WORKSPACE_ROOT.replace(/\/+$/, '')
        const cleanFilePath = filePath.replace(/^\/+/, '')
        absolutePath = `${cleanWorkspaceRoot}/${cleanFilePath}`
      }
    }
    
    // Skip creating link if path is invalid (looks like a URL or malformed)
    if (absolutePath.includes('://') || absolutePath.startsWith('./')) {
      console.warn('Skipping link creation - invalid path:', absolutePath)
      parts.push(match[0])
      lastIndex = fileLocationPattern.lastIndex
      continue
    }
    
    // Create cursor:// link to open files in Cursor IDE
    // Ensure absolutePath doesn't start with / to avoid double slashes
    const cleanAbsolutePath = absolutePath.startsWith('/') ? absolutePath.slice(1) : absolutePath
    const cursorUrl = `cursor://file/${cleanAbsolutePath}:${lineNumber}:${columnNumber}`
    console.log('Creating link:', cursorUrl, 'for match:', match[0])
    
    parts.push(
      <a
        key={match.index}
        href={cursorUrl}
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault()
          window.location.href = cursorUrl
        }}
        style={{
          color: '#0066cc',
          textDecoration: 'underline',
          cursor: 'pointer'
        }}
      >
        {match[0]}
      </a>
    )
    
    lastIndex = fileLocationPattern.lastIndex
  }
  
  // Add remaining text
  if (lastIndex < line.length) {
    parts.push(line.substring(lastIndex))
  }
  
  return parts.length > 0 ? parts : [line]
}

/**
 * Renders a stack trace with clickable file locations
 */
const renderStackTrace = (stack: string): React.ReactNode => {
  const lines = stack.split('\n')
  
  return (
    <Box component="pre" style={{ 
      marginTop: '8px',
      fontSize: '0.75rem',
      color: '#666',
      overflow: 'auto',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      fontFamily: 'monospace'
    }}>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {parseStackTraceLine(line)}
          {index < lines.length - 1 && '\n'}
        </React.Fragment>
      ))}
    </Box>
  )
}

export const RootErrorComponent = ({ error }: { error: Error }) => {
  const router = useRouter()
  
  return (
    <Container maxWidth="md" style={{ padding: '32px' }}>
      <Paper elevation={2} style={{ 
        backgroundColor: '#fee',
        border: '2px solid #c00',
        padding: '24px'
      }}>
        <Stack spacing={2}>
          <Typography variant="h4" color="error" style={{ marginTop: 0 }}>
            Something went wrong
          </Typography>
          
          <Paper elevation={1} style={{ padding: '16px', backgroundColor: '#fff' }}>
            <Typography variant="body1" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              Error:
            </Typography>
            <Box component="pre" style={{ 
              marginTop: '8px',
              overflow: 'auto',
              fontSize: '0.9rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {error.message}
            </Box>
            {error.stack && (
              <Box component="details" style={{ marginTop: '16px' }}>
                <Box component="summary" style={{ 
                  cursor: 'pointer', 
                  color: '#666'
                }}>
                  Stack trace
                </Box>
                {renderStackTrace(error.stack)}
              </Box>
            )}
          </Paper>
          
          <Stack direction="row" spacing={2}>
            <Button
              onClick={() => router.navigate({ to: '/' })}
              variant="contained"
              color="primary"
            >
              Go Home
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="contained"
              color="secondary"
            >
              Reload Page
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  )
}

export const RootComponent = () => {
  const appSettings = useAppSettings();

  return (
    <>
      <SiteHostingProvider
        siteHosting={BfgStarterGameHosting}
      >
        <Outlet />
        <Provider store={playerProfileStore} storesById={{
          playerProfiles: playerProfileStore,
          // hostedGames: hostedGamesStore,
          gameArchives: gameArchivesStore,
          hostedLobbies: hostedLobbiesStore,
          appSettings: appSettingsStore,
          // gameActions: gameActionsStore,
        }}>
          {appSettings.debugSettingShowTinybaseInspector && <Inspector />}
        </Provider>
      </SiteHostingProvider>
      <Scripts />
    </>
  )
}


export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Brute Force Games',
      },
    ],
  }),
  component: RootComponent,
  errorComponent: RootErrorComponent,
})
