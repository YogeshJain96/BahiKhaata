import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import { DB_CONFIG } from "../config/Auth";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

import Dialog from "@material-ui/core/Dialog";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import Radio from "@material-ui/core/Radio";

import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";
import Salary from "@material-ui/icons/WorkTwoTone";
import Home from "@material-ui/icons/HomeTwoTone";
import SideBiz from "@material-ui/icons/DeviceHubTwoTone";

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
  },
  appBar: {
    position: "relative"
  },
  flex: {
    flex: 1
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  fab: {
    zIndex: 10,
    position: "absolute",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  },
  chip: {
    margin: theme.spacing.unit
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class FullScreenDialog extends React.Component {
  constructor(props) {
    super(props);
    this.app = !firebase.apps.length
      ? firebase.initializeApp(DB_CONFIG)
      : firebase.app();

    this.database = this.app.database();

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
      uid: "NA",
      open: false,
      selectedDate: cDate,
      creditAmount: 0,
      creditType: "Salary",
      creditMode: "online",
      remarks: "NA",
      values: []
    };
  }

  componentDidMount() {
    var user = firebase.auth().currentUser;

    if (user) {
      console.log(user.displayName);

      this.setState({
        uid: user.uid
      });
    } else {
      console.log(" No user is signed in Creditform.");

      this.setState({
        uid: "NA"
      });
    }
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  handleSave = () => {
    this.database
      .ref(this.state.uid)
      .child("Credit")
      .push()
      .set({
        date: this.state.selectedDate,
        amount: this.state.creditAmount,
        type: this.state.creditType,
        mode: this.state.creditMode,
        remarks: this.state.remarks
      });
    this.setState({ open: false });
  };
  handleDbtAmt = event => {
    this.setState({ creditAmount: event.target.value });
  };

  handlecreditMode = event => {
    this.setState({ creditMode: event.target.value });
  };

  handleRemarks = event => {
    this.setState({ remarks: event.target.value });
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Fab
          color="primary"
          aria-label="Add"
          className={classes.fab}
          onClick={this.handleClickOpen}
        >
          <AddIcon />
        </Fab>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                onClick={this.handleClose}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>
                Add Incomes
              </Typography>
              <IconButton
                color="inherit"
                onClick={this.handleSave}
                aria-label="Save"
              >
                <SaveIcon />
                Save
              </IconButton>
            </Toolbar>
          </AppBar>
          <React.Fragment>
            <main className={classes.content}>
              <Grid container spacing={24}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="date"
                    label="Date"
                    type="date"
                    defaultValue={this.state.selectedDate}
                    InputLabelProps={{
                      shrink: true
                    }}
                    onChange={e => {
                      this.setState({ selectedDate: e.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="dbtAmt"
                    label="Amount"
                    type="number"
                    onChange={this.handleDbtAmt}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    id="remarks"
                    label="Description"
                    type="text"
                    onChange={this.handleRemarks}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Chip
                    className={classes.chip}
                    avatar={
                      <Avatar>
                        <Salary />
                      </Avatar>
                    }
                    color={
                      this.state.creditType === "Salary" ? "primary" : "default"
                    }
                    label="Salary"
                    onClick={e => {
                      this.setState({
                        creditType: "Salary"
                      });
                    }}
                  />
                  <Chip
                    className={classes.chip}
                    avatar={
                      <Avatar>
                        <Home />
                      </Avatar>
                    }
                    label="Home"
                    color={
                      this.state.creditType === "Home" ? "primary" : "default"
                    }
                    onClick={e => {
                      this.setState({
                        creditType: "Home"
                      });
                    }}
                  />
                  <Chip
                    className={classes.chip}
                    avatar={
                      <Avatar>
                        <SideBiz />
                      </Avatar>
                    }
                    label="SideBiz"
                    color={
                      this.state.creditType === "SideBiz"
                        ? "primary"
                        : "default"
                    }
                    onClick={e => {
                      this.setState({
                        creditType: "SideBiz"
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  Credit Mode
                  <Radio
                    id="online"
                    checked={this.state.creditMode === "online"}
                    onChange={this.handlecreditMode}
                    value="online"
                    name="creditMode"
                  />
                  Online
                  <Radio
                    id="cash"
                    checked={this.state.creditMode === "cash"}
                    onChange={this.handlecreditMode}
                    value="cash"
                    name="creditMode"
                  />
                  Cash
                </Grid>
              </Grid>
            </main>
          </React.Fragment>
        </Dialog>
      </div>
    );
  }
}

FullScreenDialog.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FullScreenDialog);
