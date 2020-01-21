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
import IconButton from "@material-ui/core/IconButton";

import Divider from "@material-ui/core/Divider";
import BudgetForm from "./BudgetForm";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";

import Food from "@material-ui/icons/Restaurant";
import Shopping from "@material-ui/icons/ShoppingCart";
import Travel from "@material-ui/icons/DirectionsCar";
import Health from "@material-ui/icons/LocalHospital";
import Accomodation from "@material-ui/icons/Home";
import Entertainment from "@material-ui/icons/MovieFilter";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  }
});

class Budget extends Component {
  constructor(props) {
    super(props);
    this.app = !firebase.apps.length
      ? firebase.initializeApp(DB_CONFIG)
      : firebase.app();

    this.state = {
      user_uid: "",
      user_displayName: "",
      values: [],
      expanded: null
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
      console.log(" No user is signed in Budget.");

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
      .child("Budget")
      .on("child_added", snap => {
        previousEntries.push({
          id: snap.key,
          month: snap.val().month,
          accomodation: snap.val().accomodation,
          food: snap.val().food,
          travel: snap.val().travel,
          health: snap.val().health,
          entertainment: snap.val().entertainment,
          shopping: snap.val().shopping
        });

        this.setState({
          values: previousEntries
        });
      });

    this.app
      .database()
      .ref(this.state.user_uid)
      .child("Budget")
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

  handleExpChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };
  removeEntry = abc => e => {
    //e.preventDefault();
    console.log("removed:" + abc);
    this.app
      .database()
      .ref(this.state.user_uid)
      .child("Budget")
      .child(abc)
      .remove();
  };

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;
    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <BudgetForm />
        {/* <p>Hi, {this.state.user_displayName}</p> */}
        <ExpansionPanel className={classes.root}>
          <ExpansionPanelSummary>
            <Typography variant="h6" className={classes.secondaryHeading}>
              Budget
            </Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel>
        {this.state.values.map(n => (
          <React.Fragment key={n.id}>
            <ExpansionPanel
              className={classes.root}
              expanded={expanded === n.month}
              onChange={this.handleExpChange(n.month)}
            >
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>{n.month}</Typography>
                <Typography className={classes.secondaryHeading}>
                  Total ~ Rs.
                  {parseInt(n.travel) +
                    parseInt(n.food) +
                    parseInt(n.accomodation) +
                    parseInt(n.health) +
                    parseInt(n.shopping) +
                    parseInt(n.entertainment)}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <List className={classes.root}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <Food />
                    </ListItemIcon>
                    <ListItemText secondary={"Rs." + n.food + "  — Food"} />
                  </ListItem>
                  <Divider />
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <Travel />
                    </ListItemIcon>
                    <ListItemText secondary={"Rs." + n.travel + "  — Travel"} />
                  </ListItem>
                  <Divider />
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <Accomodation />
                    </ListItemIcon>
                    <ListItemText
                      secondary={"Rs." + n.accomodation + " — Accomodation"}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <Health />
                    </ListItemIcon>
                    <ListItemText secondary={"Rs." + n.health + " — Health"} />
                  </ListItem>
                  <Divider />
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <Shopping />
                    </ListItemIcon>
                    <ListItemText
                      secondary={"Rs." + n.shopping + " — Shopping"}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <Entertainment />
                    </ListItemIcon>
                    <ListItemText
                      secondary={"Rs." + n.entertainment + " — Entertainment"}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <IconButton
                      aria-label="Delete"
                      style={{ marginLeft: 60 }}
                      onClick={this.removeEntry(n.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                </List>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </React.Fragment>
        ))}
        {/* <List className={classes.root}>
          <ListSubheader className={classes.subHead}>{`Budget`}</ListSubheader>
          {this.state.values.reverse().map(n => (
            <React.Fragment key={n.id}>
              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  <BudgetIcon />
                </ListItemIcon>
                <ListItemText
                  primary={n.BudgetAmount}
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
        </List> */}
      </main>
    );
  }
}
Budget.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Budget);
