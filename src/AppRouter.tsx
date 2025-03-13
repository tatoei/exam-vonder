import { Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import DashboardPage from "./pages/dashboard/page";
import Login from "./pages/login/page";
import App from "./App";
import Dashboard from "./pages/Dashboard";


interface RouteType {
  path: string;
  element: React.ReactElement;
  children?: RouteType[];
  index?: boolean;
  noLayout?: boolean;
}

const routes: RouteType[] = [
  // {
  //   path: "",
  //   element: <Navigate to="/Login" />,
  //   index: true,
  // },
  {
    path: "/",
    element: <Dashboard />,
    children: [],
  },
  {
    path: "/Dashboard",
    element: <DashboardPage />,
    children: [],
  },
  {
    path: "/Login",
    element: <Login />,
    children: [],
  },
];

const wrapWithLayout = (element: React.ReactElement, noLayout?: boolean) => {
  if (noLayout) {
    return element;
  }
  return element;
};

export const AppRouter = () => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={
            <Suspense fallback={<div>Loading...</div>}>
              {route.element.type === Navigate
                ? route.element
                : wrapWithLayout(route.element, route.noLayout)}
            </Suspense>
          }
        >
          {route.children?.map((childRoute, childIndex) => (
            <Route
              key={childIndex}
              path={childRoute.path}
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  {childRoute.element.type === Navigate
                    ? childRoute.element
                    : wrapWithLayout(childRoute.element, childRoute.noLayout)}
                </Suspense>
              }
              index={childRoute.index}
            />
          ))}
        </Route>
      ))}
    </Routes>


  );
};



