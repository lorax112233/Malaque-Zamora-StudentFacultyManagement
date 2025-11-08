import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function ProtectedRoute({ children, ...rest }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  return (
    <Route
      {...rest}
      render={({ location }) =>
        token && user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
