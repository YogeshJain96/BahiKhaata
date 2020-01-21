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
import Food from "@material-ui/icons/RestaurantTwoTone";
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

    this.state = {
      uid: "NA",
      open: false,
      selectedDate: cDate,
      dbtAmount: 0,
      dbtType: "Food",
      dbtMode: "online",
      remarks: "NA"
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
      console.log(" No user is signed in dbtform.");

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
      .child("Debit")
      .push()
      .set({
        date: this.state.selectedDate,
        amount: this.state.dbtAmount,
        type: this.state.dbtType,
        mode: this.state.dbtMode,
        remarks: this.state.remarks
      });
    this.setState({ open: false });
  };
  handleDbtAmt = event => {
    this.setState({ dbtAmount: event.target.value });
  };

  handleDbtMode = event => {
    this.setState({ dbtMode: event.target.value });
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
                Add Expenses
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
                        <Food />
                      </Avatar>
                    }
                    color={
                      this.state.dbtType === "Food" ? "primary" : "default"
                    }
                    label="Food"
                    onClick={e => {
                      this.setState({
                        dbtType: "Food"
                      });
                    }}
                  />
                  <Chip
                    className={classes.chip}
                    avatar={
                      <Avatar>
                        <Travel />
                      </Avatar>
                    }
                    label="Travel"
                    color={
                      this.state.dbtType === "Travel" ? "primary" : "default"
                    }
                    onClick={e => {
                      this.setState({
                        dbtType: "Travel"
                      });
                    }}
                  />
                  <Chip
                    className={classes.chip}
                    avatar={
                      <Avatar>
                        <Shopping />
                      </Avatar>
                    }
                    label="Shopping"
                    color={
                      this.state.dbtType === "Shopping" ? "primary" : "default"
                    }
                    onClick={e => {
                      this.setState({
                        dbtType: "Shopping"
                      });
                    }}
                  />
                  <Chip
                    className={classes.chip}
                    avatar={
                      <Avatar>
                        <Entertainment />
                      </Avatar>
                    }
                    label="Entertainment"
                    color={
                      this.state.dbtType === "Entertainment"
                        ? "primary"
                        : "default"
                    }
                    onClick={e => {
                      this.setState({
                        dbtType: "Entertainment"
                      });
                    }}
                  />
                  <Chip
                    className={classes.chip}
                    avatar={
                      <Avatar>
                        <Health />
                      </Avatar>
                    }
                    label="Health"
                    color={
                      this.state.dbtType === "Health" ? "primary" : "default"
                    }
                    onClick={e => {
                      this.setState({
                        dbtType: "Health"
                      });
                    }}
                  />
                  <Chip
                    className={classes.chip}
                    avatar={
                      <Avatar>
                        <Accomodation />
                      </Avatar>
                    }
                    label="Accomodation"
                    color={
                      this.state.dbtType === "Accomodation"
                        ? "primary"
                        : "default"
                    }
                    onClick={e => {
                      this.setState({
                        dbtType: "Accomodation"
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  Debit Mode
                  <Radio
                    id="online"
                    checked={this.state.dbtMode === "online"}
                    onChange={this.handleDbtMode}
                    value="online"
                    name="dbtMode"
                  />
                  Online
                  <Radio
                    id="cash"
                    checked={this.state.dbtMode === "cash"}
                    onChange={this.handleDbtMode}
                    value="cash"
                    name="dbtMode"
                  />
                  Cash
                </Grid>
                {/* <Fab
                  variant="extended"
                  color="primary"
                  onClick={this.handleSave}
                  aria-label="Save"
                >
                  <SaveIcon /> Save
                </Fab> */}
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
