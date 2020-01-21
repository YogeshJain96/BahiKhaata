import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import PieChart from "./PieChart";

import { DB_CONFIG } from "../config/Auth";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";

import Food from "@material-ui/icons/Restaurant";
import Shopping from "@material-ui/icons/ShoppingCart";
import Travel from "@material-ui/icons/DirectionsCar";
import Health from "@material-ui/icons/LocalHospital";
import Accomodation from "@material-ui/icons/Home";
import Entertainment from "@material-ui/icons/MovieFilter";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: 480
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
  button: {
    margin: theme.spacing.unit
  },
  subHead: {
    margin: 0
  }
});
let sum = 0,
  sumF = 0,
  sumA = 0,
  sumE = 0,
  sumH = 0,
  sumS = 0,
  sumT = 0;
class Insights extends Component {
  constructor(props) {
    super(props);
    this.app = !firebase.apps.length
      ? firebase.initializeApp(DB_CONFIG)
      : firebase.app();

    //this.app = firebase.app();
    this.database = this.app
      .database()
      .ref()
      .child("debit");

    let cDate = new Date().getDate();
    //Formatting 2019-04-21
    cDate =
      new Date().getMonth() +
      1 +
      "-" +
      (new Date().getDate() >= 10 ? "" : "0") +
      cDate;
    cDate =
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() >= 10 ? "" : "0") +
      cDate;
    //console.log(cDate);
    // We're going to setup the React state of our component
    this.state = {
      user_uid: "",
      user_displayName: "",
      fromDate: cDate,
      toDate: cDate,
      values: [],
      sum: 0,
      sumF: 0,
      sumA: 0,
      sumE: 0,
      sumH: 0,
      sumS: 0,
      sumT: 0
    };
    sum = 0;
    sumF = 0;
    sumA = 0;
    sumE = 0;
    sumH = 0;
    sumS = 0;
    sumT = 0;
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
      console.log(" No user is signed in Insight.");

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
      .on("child_added", snap => {
        previousEntries.push({
          id: snap.key,
          dbtDate: snap.val().date,
          dbtAmount: snap.val().amount,
          dbtType: snap.val().type
        });

        this.setState({
          values: previousEntries
        });
      });
  }
  componentWillUnmount() {}
  handleSum = (dbtAmt, dbtType, dbtDate) => {
    if (dbtDate >= this.state.fromDate && dbtDate <= this.state.toDate) {
      sum = sum + parseInt(dbtAmt);
      switch (dbtType) {
        case "Food":
          sumF = sumF + parseInt(dbtAmt);
          break;
        case "Travel":
          sumT = sumT + parseInt(dbtAmt);
          break;
        case "Shopping":
          sumS = sumS + parseInt(dbtAmt);
          break;
        case "Entertainment":
          sumE = sumE + parseInt(dbtAmt);
          break;
        case "Health":
          sumH = sumH + parseInt(dbtAmt);
          break;
        case "Accomodation":
          sumA = sumA + parseInt(dbtAmt);
          break;
        default:
          sum = 9999;
      }
    }
  };
  handleSubmit = () => {
    sum = 0;
    sumF = 0;
    sumA = 0;
    sumE = 0;
    sumH = 0;
    sumS = 0;
    sumT = 0;
    this.state.values.map(n =>
      this.handleSum(n.dbtAmount, n.dbtType, n.dbtDate)
    );
    this.setState({
      sum: sum,
      sumF: sumF,
      sumA: sumA,
      sumE: sumE,
      sumH: sumH,
      sumS: sumS,
      sumT: sumT
    });
  };
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <h1>Insights</h1>
          {/* <p>Hi, {this.state.user_displayName}</p> */}
          <Grid container spacing={24}>
            <Grid item xs={8} sm={4}>
              <TextField
                id="fromDate"
                label="From Date"
                type="date"
                defaultValue={this.state.fromDate}
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e => {
                  this.setState({ fromDate: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                id="toDate"
                label="To Date"
                type="date"
                defaultValue={this.state.toDate}
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e => {
                  this.setState({ toDate: e.target.value });
                }}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={this.handleSubmit}
              >
                Get Insights
              </Button>
            </Grid>
            <Grid item xs={16} sm={8}>
              <List className={classes.root}>
                <ListSubheader className={classes.subHead}>
                  {`Expenses in given Period ~ Rs.` + this.state.sum}
                </ListSubheader>

                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <Food />
                  </ListItemIcon>
                  <ListItemText
                    secondary={"Rs." + this.state.sumF + " — Food"}
                  />
                </ListItem>
                <Divider />
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <Travel />
                  </ListItemIcon>
                  <ListItemText
                    secondary={"Rs." + this.state.sumT + " — Travel"}
                  />
                </ListItem>
                <Divider />
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <Shopping />
                  </ListItemIcon>
                  <ListItemText
                    secondary={"Rs." + this.state.sumS + " — Shopping"}
                  />
                </ListItem>
                <Divider />
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <Accomodation />
                  </ListItemIcon>
                  <ListItemText
                    secondary={"Rs." + this.state.sumA + " — Accomodation"}
                  />
                </ListItem>
                <Divider />
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <Health />
                  </ListItemIcon>
                  <ListItemText
                    secondary={"Rs." + this.state.sumH + " — Health"}
                  />
                </ListItem>
                <Divider />
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <Entertainment />
                  </ListItemIcon>
                  <ListItemText
                    secondary={"Rs." + this.state.sumE + " — Entertainment"}
                  />
                </ListItem>
              </List>
              {/* <Button
            variant="contained"
            color="primary"
            className={classes.button}
          >
            See Charts
          </Button> */}
            </Grid>
            <Grid item xs={8} sm={4}>
              <PieChart
                Food={this.state.sumF}
                Accomodation={this.state.sumA}
                Shopping={this.state.sumS}
                Travel={this.state.sumT}
                Health={this.state.sumH}
                Entertainment={this.state.sumE}
              />
            </Grid>
          </Grid>
        </main>
      </React.Fragment>
    );
  }
}
Insights.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Insights);
