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
import CreditForm from "./CreditForm";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import Salary from "@material-ui/icons/WorkTwoTone";
import Home from "@material-ui/icons/HomeTwoTone";
import SideBiz from "@material-ui/icons/DeviceHubTwoTone";

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
  },
  subHead: {
    margin: 0
  }
});

class CreditList extends Component {
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
      .child("Credit")
      .orderByChild("date")
      .on("child_added", snap => {
        previousEntries.push({
          id: snap.key,
          selectedDate: snap.val().date,
          creditAmount: snap.val().amount,
          creditType: snap.val().type,
          creditMode: snap.val().mode,
          remarks: snap.val().remarks
        });

        this.setState({
          values: previousEntries
        });
      });

    this.app
      .database()
      .ref(this.state.user_uid)
      .child("Credit")
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
      .child("Credit")
      .child(abc)
      .remove();
  };

  renderIcon(param) {
    switch (param) {
      case "Salary":
        return <Salary />;
      case "Home":
        return <Home />;
      case "SideBiz":
        return <SideBiz />;
      default:
        return <SideBiz />;
    }
  }
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <CreditForm />
          {/* <p>Hi, {this.state.user_displayName}</p> */}
          <List className={classes.root}>
            <ListSubheader
              className={classes.subHead}
            >{`Incomes`}</ListSubheader>
            {this.state.values.reverse().map(n => (
              <React.Fragment key={n.id}>
                <ListItem alignItems="flex-start">
                  <ListItemIcon>{this.renderIcon(n.creditType)}</ListItemIcon>
                  <ListItemText
                    primary={n.creditAmount}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          {n.creditType + " — "}
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
      </React.Fragment>
    );
  }
}
CreditList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CreditList);
