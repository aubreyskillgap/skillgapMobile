import { router } from "expo-router";

const routesHistory: any[] = [];
let activeRoute: any = null;

export class Router {
  static push = (url: any) => {
    // save current route in history
    if (activeRoute) {
      routesHistory.push(activeRoute);
    }

    // update route
    activeRoute = url;

    // navigate app to url
    router.push(activeRoute);
  };

  static back = () => {
    // see if we have history to navigate to
    const prevRoute = routesHistory.pop();
    if (prevRoute) {
      router.push(prevRoute);
      activeRoute = prevRoute;
    }
  };

  static clearHistory = () => {
    routesHistory.length = 0;
  };

  static replaceHistory = (...routes: string[]) => {
    routesHistory.length = 0;
    routes.forEach((route) => routesHistory.push(route));
  };

  currentRoute: any = () => activeRoute;
}
