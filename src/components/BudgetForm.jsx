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

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";

import MonthBudget from "@material-ui/icons/DateRange";
import Food from "@material-ui/icons/Restaurant";
import Shopping from "@material-ui/icons/ShoppingCartTwoTone";
import Travel from "@material-ui/icons/DirectionsCarTwoTone";
import Health from "@material-ui/icons/LocalHospitalTwoTone";
import Accomodation from "@material-ui/icons/HomeTwoTone";
import Entertainment from "@material-ui/icons/MovieFilterTwoTone";

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

    this.state = {
      uid: "NA",
      open: false,
      month: "NA",
      fAmt: 0,
      aAmt: 0,
      sAmt: 0,
      hAmt: 0,
      eAmt: 0,
      tAmt: 0,
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
      console.log(" No user is signed in Budgetform.");

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
      .child("Budget")
      .push()
      .set({
        month: this.state.month,
        food: this.state.fAmt,
        travel: this.state.tAmt,
        accomodation: this.state.aAmt,
        health: this.state.hAmt,
        entertainment: this.state.eAmt,
        shopping: this.state.sAmt
      });
    this.setState({ open: false });
  };

  handleMonth = event => {
    this.setState({ month: event.target.value });
  };

  handleFAmt = event => {
    this.setState({ fAmt: event.target.value });
  };
  handleTAmt = event => {
    this.setState({ tAmt: event.target.value });
  };
  handleSAmt = event => {
    this.setState({ sAmt: event.target.value });
  };
  handleAAmt = event => {
    this.setState({ aAmt: event.target.value });
  };
  handleHAmt = event => {
    this.setState({ hAmt: event.target.value });
  };
  handleEAmt = event => {
    this.setState({ eAmt: event.target.value });
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
                Add Budget
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
                  <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                      <MonthBudget />
                    </Grid>
                    <Grid item>
                      <TextField
                        label="Month"
                        placeholder="Jan'19"
                        type="text"
                        onChange={this.handleMonth}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                      <Accomodation />
                    </Grid>
                    <Grid item>
                      <TextField
                        label="Accomodation"
                        type="number"
                        onChange={this.handleAAmt}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                      <Food />
                    </Grid>
                    <Grid item>
                      <TextField
                        label="Food"
                        type="number"
                        onChange={this.handleFAmt}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                      <Travel />
                    </Grid>
                    <Grid item>
                      <TextField
                        label="Travel"
                        type="number"
                        onChange={this.handleTAmt}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                      <Shopping />
                    </Grid>
                    <Grid item>
                      <TextField
                        label="Shopping"
                        type="number"
                        onChange={this.handleSAmt}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                      <Health />
                    </Grid>
                    <Grid item>
                      <TextField
                        label="Health"
                        type="number"
                        onChange={this.handleHAmt}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                      <Entertainment />
                    </Grid>
                    <Grid item>
                      <TextField
                        label="Entertainment"
                        type="number"
                        onChange={this.handleEAmt}
                      />
                    </Grid>
                  </Grid>
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
