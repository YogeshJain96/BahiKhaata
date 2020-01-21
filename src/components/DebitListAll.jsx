import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import { DB_CONFIG } from "../config/Auth";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { Link } from "react-router-dom";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import DebitForm from "./DebitForm";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteIcon2 from "@material-ui/icons/DeleteForeverTwoTone";
import Food from "@material-ui/icons/RestaurantTwoTone";
import Shopping from "@material-ui/icons/ShoppingCartTwoTone";
import Travel from "@material-ui/icons/DirectionsCarTwoTone";
import Health from "@material-ui/icons/LocalHospitalTwoTone";
import Accomodation from "@material-ui/icons/HomeTwoTone";
import Entertainment from "@material-ui/icons/MovieFilterTwoTone";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: "80vh"
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

class DebitList extends Component {
  constructor(props) {
    super(props);
    this.app = !firebase.apps.length
      ? firebase.initializeApp(DB_CONFIG)
      : firebase.app();

    this.state = {
      user_uid: "NA",
      user_displayName: "",
      values: [],
      isToggleOn: false
    };
  }
  componentWillMount() {
    var user = firebase.auth().currentUser;

    if (user) {
      console.log(user.uid + "Expenses");

      this.setState({
        user_uid: user.uid,
        user_displayName: user.displayName
      });
    } else {
      console.log(" No user is signed in Expenses.");

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
      .child("Debit")
      .orderByChild("date")
      .on("child_added", snap => {
        previousEntries.push({
          id: snap.key,
          selectedDate: snap.val().date,
          dbtAmount: snap.val().amount,
          dbtType: snap.val().type,
          dbtMode: snap.val().mode,
          remarks: snap.val().remarks
        });

        this.setState({
          values: previousEntries
        });
      });

    this.app
      .database()
      .ref(this.state.user_uid)
      .child("Debit")
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
      .child("Debit")
      .child(abc)
      .remove();
  };
  renderIcon(param) {
    switch (param) {
      case "Food":
        return <Food />;
      case "Travel":
        return <Travel />;
      case "Shopping":
        return <Shopping />;
      case "Entertainment":
        return <Entertainment />;
      case "Health":
        return <Health />;
      case "Accomodation":
        return <Accomodation />;
      default:
        return <Shopping />;
    }
  }
  formatDate(param) {
    function pad(s) {
      return s < 10 ? "0" + s : s;
    }
    let padm = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec"
    ];
    let padd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let d = new Date(param);
    let newdf =
      pad(d.getDate()) +
      " " +
      padm[d.getMonth()] +
      " " +
      d.getFullYear() +
      " — " +
      padd[d.getDay()];
    return newdf;
  }
  delToogle = () => {
    this.setState(function(prevState) {
      return { isToggleOn: !prevState.isToggleOn };
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <DebitForm uid={this.state.user_uid} />
          {/* <p>Hi, {this.state.user_displayName}</p> */}
          <List className={classes.root}>
            <ListSubheader className={classes.subHead}>
              {`All Expenses`}
              <ListItemSecondaryAction>
                <Link to="/Expenses" style={{ textDecoration: "none" }}>
                  ShowByDate
                </Link>
                <IconButton aria-label="DeleteToggle" onClick={this.delToogle}>
                  {this.state.isToggleOn ? <DeleteIcon2 /> : <DeleteIcon />}
                </IconButton>
              </ListItemSecondaryAction>
            </ListSubheader>

            {this.state.values.reverse().map(n => (
              <React.Fragment key={n.id}>
                <ListItem alignItems="flex-start">
                  <ListItemIcon>{this.renderIcon(n.dbtType)}</ListItemIcon>
                  <ListItemText
                    primary={n.dbtAmount}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          {n.dbtType + " — "}
                        </Typography>
                        {n.remarks + " — " + this.formatDate(n.selectedDate)}
                      </React.Fragment>
                    }
                  />
                  {this.state.isToggleOn ? (
                    <ListItemSecondaryAction>
                      <IconButton
                        aria-label="Delete"
                        onClick={this.removeEntry(n.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  ) : (
                    ""
                  )}
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
DebitList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DebitList);
