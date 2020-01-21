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
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import DebitForm from "./DebitForm";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import DeleteIcon2 from "@material-ui/icons/DeleteForeverTwoTone";
import Food from "@material-ui/icons/RestaurantTwoTone";
import Shopping from "@material-ui/icons/ShoppingCartTwoTone";
import Travel from "@material-ui/icons/DirectionsCarTwoTone";
import Health from "@material-ui/icons/LocalHospitalTwoTone";
import Accomodation from "@material-ui/icons/HomeTwoTone";
import Entertainment from "@material-ui/icons/MovieFilterTwoTone";

// import ExpansionPanel from "@material-ui/core/ExpansionPanel";
// import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
// import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";

const ExpansionPanel = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0
    },
    "&:before": {
      display: "none"
    },
    "&$expanded": {
      margin: "auto"
    }
  },
  expanded: {}
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    //borderBottom: "1px solid rgba(0, 0, 0, .125)",
    minHeight: 56,
    "&$expanded": {
      minHeight: 56
    }
  },
  content: {
    "&$expanded": {
      margin: "12px 0"
    }
  },
  expanded: {}
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing.unit * 1
  }
}))(MuiExpansionPanelDetails);

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
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
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
      isToggleOn: false,
      expanded: null,
      allDates: [],
      upToDate: new Date()
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
    this.getAllDates();
    const previousEntries = this.state.values;
    // DataSnapshot
    this.app
      .database()
      .ref(this.state.user_uid)
      .child("Debit")
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
    let yr = d.getFullYear() + "";

    let newdf =
      padd[d.getDay()] +
      " — " +
      padm[d.getMonth()] +
      " " +
      pad(d.getDate()) +
      " '" +
      yr.substr(yr.length - 2, yr.length);
    return newdf;
  }
  delToogle = () => {
    this.setState(function(prevState) {
      return { isToggleOn: !prevState.isToggleOn };
    });
  };
  handleExpChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };
  getAllDates = () => {
    const allDate = this.state.allDates;
    let nowM30 = new Date();
    nowM30.setDate(nowM30.getDate() - 30);
    for (let d = new Date(); d >= nowM30; d.setDate(d.getDate() - 1)) {
      allDate.push(this.formatDate(new Date(d)));
    }
    this.setState({ allDates: allDate });
    this.setState({ upToDate: nowM30 });
  };
  getAllDatesFrom = fd => {
    const allDate = this.state.allDates;
    let nowM30 = new Date(fd);
    nowM30.setDate(nowM30.getDate() - 30);
    for (let d = new Date(fd); d >= nowM30; d.setDate(d.getDate() - 1)) {
      allDate.push(this.formatDate(new Date(d)));
    }
    this.setState({ allDates: allDate });
    //console.log("fd..1." + fd);
  };
  handleMore = () => {
    console.log("Loading More.." + this.state.upToDate);
    const d = this.state.upToDate;
    d.setDate(d.getDate() - 1);
    this.getAllDatesFrom(d);
    d.setDate(d.getDate() - 30);
    this.setState({ upToDate: d });
  };
  render() {
    const { classes } = this.props;
    const { expanded } = this.state;
    return (
      <React.Fragment>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <DebitForm uid={this.state.user_uid} />
          {/* <p>Hi, {this.state.user_displayName}</p> */}
          {/* <ExpansionPanel className={classes.root}>
            <ExpansionPanelSummary
              expandIcon={
                <IconButton aria-label="DeleteToggle" onClick={this.delToogle}>
                  {this.state.isToggleOn ? <DeleteIcon2 /> : <DeleteIcon />}
                </IconButton>
              }
            >
              <Typography variant="h6" className={classes.secondaryHeading}>
                Expenses
              </Typography>
            </ExpansionPanelSummary>
          </ExpansionPanel> */}

          <List className={classes.root}>
            <ListSubheader className={classes.subHead}>
              {`Expenses By Date`}

              <ListItemSecondaryAction>
                <Link to="/AllExpenses" style={{ textDecoration: "none" }}>
                  ShowAll
                </Link>
                <IconButton aria-label="DeleteToggle" onClick={this.delToogle}>
                  {this.state.isToggleOn ? <DeleteIcon2 /> : <DeleteIcon />}
                </IconButton>
              </ListItemSecondaryAction>
            </ListSubheader>

            {this.state.allDates.map(n => (
              <React.Fragment key={n}>
                <ExpansionPanel
                  className={classes.root}
                  expanded={expanded === n}
                  onChange={this.handleExpChange(n)}
                >
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.secondaryHeading}>
                      {n}
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <List className={classes.root}>
                      {this.state.values.map(nd =>
                        this.formatDate(nd.selectedDate) === n ? (
                          <React.Fragment key={nd.id}>
                            <ListItem alignItems="flex-start">
                              <ListItemIcon>
                                {this.renderIcon(nd.dbtType)}
                              </ListItemIcon>
                              <ListItemText
                                primary={"Rs. " + nd.dbtAmount}
                                secondary={
                                  nd.dbtType + " — " + nd.remarks
                                  // + " — " +
                                  //this.formatDate(nd.selectedDate)
                                }
                              />

                              {this.state.isToggleOn ? (
                                <ListItemSecondaryAction>
                                  <IconButton
                                    aria-label="Delete"
                                    onClick={this.removeEntry(nd.id)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              ) : (
                                ""
                              )}
                            </ListItem>
                          </React.Fragment>
                        ) : (
                          ""
                        )
                      )}
                    </List>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </React.Fragment>
            ))}
            <Divider />
            <ListItem>
              <Button
                variant="contained"
                size="medium"
                color="primary"
                onClick={this.handleMore}
              >
                Load More
              </Button>
            </ListItem>
          </List>

          {/* <ExpansionPanelSummary
            expandIcon={
              <IconButton aria-label="More" onClick={this.handleMore}>
                <Food />
              </IconButton>
            }
          >
            <Typography variant="h6" className={classes.secondaryHeading}>
              More..
            </Typography>
          </ExpansionPanelSummary> */}
        </main>
      </React.Fragment>
    );
  }
}
DebitList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DebitList);
