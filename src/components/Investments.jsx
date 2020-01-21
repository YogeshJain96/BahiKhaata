import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import firebase from "firebase/app";
import "firebase/auth";

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

class Investments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_uid: "",
      user_displayName: ""
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
      console.log(" No user is signed in inv.");

      this.setState({
        user_uid: "NA",
        user_displayName: "NA"
      });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <h1>Investments</h1>
          <p>Hi, {this.state.user_displayName}</p>
          <p> You have made no Investments yet.</p>
          <p>{this.state.user_uid}</p>
          <p>{this.props.uid}</p>
        </main>
      </React.Fragment>
    );
  }
}
Investments.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Investments);
