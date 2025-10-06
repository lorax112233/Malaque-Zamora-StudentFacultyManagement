import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import Login from "./components/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Students from "./pages/Students.jsx";
import Faculty from "./pages/Faculty.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";
import Profile from "./pages/Profile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import StatCard from "./components/StatCard.jsx";

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
