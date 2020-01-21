import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import { DB_CONFIG } from "../config/Auth";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  root: {
    width: "100%",
    //maxWidth: 360,
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
  },
  table: {
    minWidth: 450
  },
  iframeStyle: {
    width: 0,
    height: 0,
    border: 0
  }
});
let sum = 0,
  sumF = 0,
  sumA = 0,
  sumE = 0,
  sumH = 0,
  sumS = 0,
  sumT = 0;
class ExportReport extends Component {
  constructor(props) {
    super(props);
    this.app = !firebase.apps.length
      ? firebase.initializeApp(DB_CONFIG)
      : firebase.app();

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
    this.state = {
      user_uid: "",
      user_displayName: "",
      values: [],
      filterValues: [],
      fromDate: cDate,
      toDate: cDate,
      showData: false,
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
      console.log(" No user is signed in Export Report.");

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
          dbtType: snap.val().type,
          remarks: snap.val().remarks
        });

        this.setState({
          values: previousEntries
        });
      });
  }
  componentWillUnmount() {}

  handleSubmit = () => {
    this.setState({ showData: true });
    const tempValues = [];
    sum = 0;
    sumF = 0;
    sumA = 0;
    sumE = 0;
    sumH = 0;
    sumS = 0;
    sumT = 0;
    this.state.values.map(n => {
      if (n.dbtDate >= this.state.fromDate && n.dbtDate <= this.state.toDate) {
        tempValues.push({
          id: n.id,
          dbtDate: n.dbtDate,
          dbtAmount: n.dbtAmount,
          dbtType: n.dbtType,
          remarks: n.remarks
        });
        sum = sum + parseInt(n.dbtAmount);
        switch (n.dbtType) {
          case "Food":
            sumF = sumF + parseInt(n.dbtAmount);
            break;
          case "Travel":
            sumT = sumT + parseInt(n.dbtAmount);
            break;
          case "Shopping":
            sumS = sumS + parseInt(n.dbtAmount);
            break;
          case "Entertainment":
            sumE = sumE + parseInt(n.dbtAmount);
            break;
          case "Health":
            sumH = sumH + parseInt(n.dbtAmount);
            break;
          case "Accomodation":
            sumA = sumA + parseInt(n.dbtAmount);
            break;
          default:
            sum = 9999;
        }
      }

      //    this.filterData(n.id, n.dbtAmount, n.dbtType, n.dbtDate, n.remarks);
    });
    this.setState({
      sum: sum,
      sumF: sumF,
      sumA: sumA,
      sumE: sumE,
      sumH: sumH,
      sumS: sumS,
      sumT: sumT,
      filterValues: tempValues
    });
    // console.log(this.state.values);
  };
  //filterData = (idd, dbtAmt, dbtType, dbtDate, remarks) => {};
  handlePrint = () => {
    let content = document.getElementById("printDiv");
    let pri = document.getElementById("printFrame").contentWindow;
    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.close();
    pri.focus();
    pri.print();
  };
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
    let yr = d.getFullYear() + "";

    let newdf =
      pad(d.getDate()) +
      " " +
      padm[d.getMonth()] +
      " '" +
      yr.substr(yr.length - 2, yr.length);
    return newdf;
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <h1>Export Report</h1>
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
                Generate Report
              </Button>
            </Grid>
          </Grid>
          {this.state.showData ? (
            <div>
              <div id="printDiv">
                <h4>
                  Report From {this.formatDate(this.state.fromDate)} To{" "}
                  {this.formatDate(this.state.toDate)}
                </h4>
                <Paper className={classes.root}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell align="right">Date</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Expense Category</TableCell>
                        <TableCell align="right">Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.filterValues.map(nd => (
                        <TableRow key={nd.id}>
                          <TableCell align="right">
                            {this.formatDate(nd.dbtDate)}
                          </TableCell>
                          <TableCell align="right">
                            {" "}
                            Rs.{nd.dbtAmount}
                          </TableCell>
                          <TableCell align="right">{nd.dbtType}</TableCell>
                          <TableCell align="right">{nd.remarks}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
                <p>
                  Total Expenses= Rs.{this.state.sum}
                  <br />
                  -----------------------------------------------------------
                  <br />
                  Rs.{this.state.sumF}— Food
                  <br />
                  Rs.{this.state.sumT} — Travel
                  <br />
                  Rs.{this.state.sumS} — Shopping
                  <br />
                  Rs.{this.state.sumA} — Accomodation
                  <br />
                  Rs.{this.state.sumH} — Health
                  <br />
                  Rs.{this.state.sumE} — Entertainment
                </p>
                {/* <List className={classes.root}>
                    {this.state.filterValues.map(nd => (
                      <React.Fragment key={nd.id}>
                        <ListItem alignItems="flex-start">
                <ListItemIcon>
                 {this.renderIcon(nd.dbtType)}
               </ListItemIcon> 
                          <ListItemText
                            primary={"Rs. " + nd.dbtAmount}
                            secondary={
                              nd.dbtType +
                              " — " +
                              nd.remarks +
                              " — " +
                              nd.dbtDate
                            }
                          />
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List> 
                */}
              </div>
              {/* <button onClick={() => window.print()}>PRINT all</button> */}
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={this.handlePrint}
              >
                Print Report
              </Button>
            </div>
          ) : (
            ""
          )}
          <iframe id="printFrame" className={classes.iframeStyle} />
        </main>
      </React.Fragment>
    );
  }
}
ExportReport.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ExportReport);
