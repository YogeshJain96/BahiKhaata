import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/auth";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import Incomes from "@material-ui/icons/NoteAdd";
import Expenses from "@material-ui/icons/Whatshot";
import Savings from "@material-ui/icons/Save";
import Insights from "@material-ui/icons/Timeline";
import Budget from "@material-ui/icons/DateRange";

const styles = theme => ({
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
  },
  margin: {
    margin: theme.spacing.unit
  },
  fabIcon: {
    marginRight: theme.spacing.unit
  }
});

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_uid: "",
      user_displayName: ""
    };
  }
  componentWillMount() {
    var user = firebase.auth().currentUser;

    if (user) {
      console.log(user.displayName);

      this.setState({
        user_uid: user.uid,
        user_displayName: user.displayName
      });
    } else {
      console.log(" No user is signed in inv.");

      this.setState({
        user_uid: "NA",
        user_displayName: "NA"
      });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <h1>Welcome</h1>
          <p>Hi, {this.state.user_displayName}</p>

          <NavLink to="/Expenses" style={{ textDecoration: "none" }}>
            <Fab
              variant="extended"
              color="primary"
              aria-label="Expenses"
              className={classes.margin}
            >
              <Expenses className={classes.fabIcon} />
              Expenses
            </Fab>
          </NavLink>
          <NavLink to="/Incomes" style={{ textDecoration: "none" }}>
            <Fab
              variant="extended"
              color="primary"
              aria-label="Incomes"
              className={classes.margin}
            >
              <Incomes className={classes.fabIcon} />
              Incomes
            </Fab>
          </NavLink>
          <NavLink to="/Insights" style={{ textDecoration: "none" }}>
            <Fab
              variant="extended"
              color="primary"
              aria-label="Insights"
              className={classes.margin}
            >
              <Insights className={classes.fabIcon} />
              Insights
            </Fab>
          </NavLink>
          <NavLink to="/Budget" style={{ textDecoration: "none" }}>
            <Fab
              variant="extended"
              color="primary"
              aria-label="Budget"
              className={classes.margin}
            >
              <Budget className={classes.fabIcon} />
              Budget
            </Fab>
          </NavLink>
          <NavLink to="/Savings" style={{ textDecoration: "none" }}>
            <Fab
              variant="extended"
              color="primary"
              aria-label="Savings"
              className={classes.margin}
            >
              <Savings className={classes.fabIcon} />
              Savings
            </Fab>
          </NavLink>
        </main>
      </React.Fragment>
    );
  }
}
Welcome.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Welcome);
