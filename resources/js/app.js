import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Layout from "./components/Layout";

// Pages
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/students" component={Students} />
          {/* Add more routes later */}
        </Switch>
      </Layout>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
