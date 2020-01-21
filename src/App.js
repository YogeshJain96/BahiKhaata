import React, { Component } from "react";

import firebase from "firebase/app";
import "firebase/auth";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import Welcome from "./components/Welcome";
import DebitList from "./components/DebitList";
import DebitListAll from "./components/DebitListAll";
import CreditList from "./components/CreditList";
import Budget from "./components/BudgetCmp";
import Insights from "./components/InsightsCmp";
import Savings from "./components/Savings";
//import Investments from "./components/Investments";
import Report from "./components/ExportReport";
import About from "./components/AboutUs";
import Error from "./components/Error";

import CssBaseline from "@material-ui/core/CssBaseline";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_uid: "NA",
      user_displayName: "NA",
      isAuthed: false,
      user: {}
    };
  }

  componentDidMount() {
    this.authListner();
    console.log("Did Mount app.js");
  }

  authListner() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <BrowserRouter>
          <React.Fragment>
            <CssBaseline />
            <NavBar />

            {!this.state.user ? (
              <Switch>
                <Route path="/" component={Login} />
                <Route component={Error} />
              </Switch>
            ) : (
              <Switch>
                <Route path="/" component={Welcome} exact />
                <Route path="/Login" component={Login} />
                <Route path="/Welcome" component={Welcome} />
                <Route path="/Expenses" component={DebitList} />
                <Route path="/AllExpenses" component={DebitListAll} />
                <Route path="/Incomes" component={CreditList} />
                <Route path="/Budget" component={Budget} />
                <Route path="/Insights" component={Insights} />
                <Route path="/Savings" component={Savings} />
                <Route path="/Report" component={Report} />
                {/* <Route
                  path="/Investments"
                  render={props => (
                    <Investments {...props} uid={this.state.user_uid} />
                  )}
                /> */}
                <Route path="/About" component={About} />
                <Route component={Error} />
              </Switch>
            )}
          </React.Fragment>
        </BrowserRouter>
      </div>
    );
  }
}
App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
