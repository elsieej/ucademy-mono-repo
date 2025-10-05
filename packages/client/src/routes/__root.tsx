import { config } from '@/constants/config'
import ErrorComponent from '@/features/shared/components/error.component'
import NotFoundComponent from '@/features/shared/components/not-found.component'
import type { AuthState } from '@/providers/auth.provider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

type RouterContext = {
  auth: AuthState
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      {config.MODE === 'development' ? (
        <>
          <TanStackRouterDevtools />
          <ReactQueryDevtools />
        </>
      ) : null}
    </>
  ),
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
})
