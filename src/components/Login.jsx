import React, { Component } from "react";
import logo from "../logo.svg";
import withFirebaseAuth from "react-with-firebase-auth";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import { DB_CONFIG } from "../config/Auth";

import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const firebaseApp = firebase.initializeApp(DB_CONFIG);

class Login extends Component {
  constructor(props) {
    super(props);
    this.app = !firebase.apps.length
      ? firebase.initializeApp(DB_CONFIG)
      : firebase.app();

    this.database = this.app.database();
    this.state = {
      remarks: "NA",
      userid: "0"
    };
  }

  render() {
    const { user, signOut, signInWithGoogle } = this.props;
    user ? console.log(user.uid) : console.log("Login");
    return (
      <React.Fragment>
        <main>
          <h1>.</h1>
          <Card
            style={{
              margin: 25
            }}
          >
            <CardContent>
              {user ? (
                <Avatar alt="Avtar" src={user.photoURL} />
              ) : (
                <Avatar alt="logo" src={logo} />
              )}
              <Typography variant="h5" component="h2">
                {user ? "Welcome, " + user.displayName : "Please sign in."}
              </Typography>
              {/* <Typography color="textSecondary">
                {user ? user.uid : ""}
              </Typography> */}
            </CardContent>
            <CardActions>
              {user ? (
                <Button size="medium" color="primary" onClick={signOut}>
                  Sign out
                </Button>
              ) : (
                <Button
                  size="medium"
                  color="primary"
                  onClick={signInWithGoogle}
                >
                  Sign in with Google
                </Button>
              )}
            </CardActions>
          </Card>
        </main>
      </React.Fragment>
    );
  }
}

const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider()
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth
})(Login);
