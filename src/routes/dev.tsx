import { createFileRoute, Outlet } from '@tanstack/react-router';
import { DevToolsAppBar } from '@bfg-engine/ui/components/app-bars/dev-tools-app-bar';


const DevRoute = () => {
  return (
    <>
      <DevToolsAppBar />
      <Outlet />
    </>
  );
};

export const Route = createFileRoute('/dev')({
  component: DevRoute,
});
