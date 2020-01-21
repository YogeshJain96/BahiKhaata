import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import { DB_CONFIG } from "../config/Auth";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import SavingsForm from "./SavingsForm";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import Investment from "@material-ui/icons/WbSunnyTwoTone";
import Bank from "@material-ui/icons/AccountBalanceTwoTone";
import Cash from "@material-ui/icons/AccountBalanceWalletTwoTone";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: 480
  },
  inline: {
    display: "inline"
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

class Savings extends Component {
  constructor(props) {
    super(props);
    this.app = !firebase.apps.length
      ? firebase.initializeApp(DB_CONFIG)
      : firebase.app();

    this.state = {
      user_uid: "",
      user_displayName: "",
      values: []
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
      console.log(" No user is signed in Incomes.");

      this.setState({
        user_uid: "NA",
        user_displayName: "NA"
      });
    }
  }
  componentDidMount() {
    const previousEntries = this.state.values;

    // DataSnapshot
    this.app
      .database()
      .ref(this.state.user_uid)
      .child("Savings")
      .orderByChild("date")
      .on("child_added", snap => {
        previousEntries.push({
          id: snap.key,
          selectedDate: snap.val().date,
          savingsAmount: snap.val().amount,
          saveType: snap.val().type,
          remarks: snap.val().remarks
        });

        this.setState({
          values: previousEntries
        });
      });

    this.app
      .database()
      .ref(this.state.user_uid)
      .child("Savings")
      .orderByChild("date")
      .on("child_removed", snap => {
        for (var i = 0; i < previousEntries.length; i++) {
          if (previousEntries[i].id === snap.key) {
            previousEntries.splice(i, 1);
          }
        }

        this.setState({
          values: previousEntries
        });
      });
  }
  componentWillUnmount() {}
  removeEntry = abc => e => {
    //e.preventDefault();
    console.log("removed:" + abc);
    this.app
      .database()
      .ref(this.state.user_uid)
      .child("Savings")
      .child(abc)
      .remove();
  };

  renderIcon(param) {
    switch (param) {
      case "Investment":
        return <Investment />;
      case "Bank":
        return <Bank />;
      case "Cash":
        return <Cash />;
      default:
        return <Bank />;
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <SavingsForm />
        {/* <p>Hi, {this.state.user_displayName}</p> */}
        <List className={classes.root}>
          <ListSubheader className={classes.subHead}>{`Savings`}</ListSubheader>
          {this.state.values.reverse().map(n => (
            <React.Fragment key={n.id}>
              <ListItem alignItems="flex-start">
                <ListItemIcon>{this.renderIcon(n.saveType)}</ListItemIcon>
                <ListItemText
                  primary={n.savingsAmount}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {n.saveType + " — "}
                      </Typography>
                      {n.remarks + " — " + n.selectedDate}
                    </React.Fragment>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    aria-label="Delete"
                    onClick={this.removeEntry(n.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </main>
    );
  }
}
Savings.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Savings);
