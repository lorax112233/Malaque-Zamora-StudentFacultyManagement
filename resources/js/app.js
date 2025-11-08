import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Layout from "./components/Layout";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Faculty from "./pages/Faculty";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/login" component={Login} />

      <ProtectedRoute path="/" exact>
        <Layout>
          <Dashboard />
        </Layout>
      </ProtectedRoute>

      <ProtectedRoute path="/students">
        <Layout>
          <Students />
        </Layout>
      </ProtectedRoute>

      <ProtectedRoute path="/faculty">
        <Layout>
          <Faculty />
        </Layout>
      </ProtectedRoute>

      <ProtectedRoute path="/reports">
        <Layout>
          <Reports />
        </Layout>
      </ProtectedRoute>

      <ProtectedRoute path="/settings">
        <Layout>
          <Settings />
        </Layout>
      </ProtectedRoute>

      <ProtectedRoute path="/profile">
        <Layout>
          <Profile />
        </Layout>
      </ProtectedRoute>
    </Switch>
  </Router>,
  document.getElementById("app")
);
