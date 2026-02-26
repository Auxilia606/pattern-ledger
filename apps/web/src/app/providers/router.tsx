import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { LoginPage } from "../../pages/login";

const rootRoute = createRootRoute();

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
});

const routeTree = rootRoute.addChildren([loginRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
