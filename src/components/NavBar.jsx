import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";

import firebase from "firebase/app";
import "firebase/auth";
import Avatar from "@material-ui/core/Avatar";

import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import { NavLink } from "react-router-dom";
import UserIcon from "@material-ui/icons/AccountCircle";
//import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
//import Button from "@material-ui/core/Button";
import Incomes from "@material-ui/icons/NoteAdd";
import Expenses from "@material-ui/icons/Whatshot";
import Savings from "@material-ui/icons/Save";
import Insights from "@material-ui/icons/Timeline";
import Budget from "@material-ui/icons/DateRange";
//import Investments from "@material-ui/icons/WbSunny";
import Report from "@material-ui/icons/WbSunny";
import About from "@material-ui/icons/SentimentVerySatisfied";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  loginButton: {
    marginRight: 0,
    marginLeft: 100,
    color: "#fff"
  },
  avatar: {
    marginRight: 0,
    marginLeft: 80
  },

  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9 + 1
    }
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
  }
});

class MiniDrawer extends React.Component {
  state = {
    open: false,
    user: {}
  };
  componentDidMount() {
    this.authListner();
    console.log("Did Mount app.js");
  }

  authListner() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }
    });
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, theme } = this.props;

    return (
      <React.Fragment>
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: this.state.open
          })}
        >
          <Toolbar disableGutters={!this.state.open}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, {
                [classes.hide]: this.state.open
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              Bahi-Khaata
            </Typography>
            <NavLink to="/Login" style={{ textDecoration: "none" }}>
              {!this.state.user ? (
                <UserIcon className={classes.loginButton} />
              ) : (
                <Avatar
                  className={classes.avatar}
                  alt="Avtar"
                  src={this.state.user.photoURL}
                />
              )}
            </NavLink>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={classNames(classes.drawer, {
            [classes.drawerOpen]: this.state.open,
            [classes.drawerClose]: !this.state.open
          })}
          classes={{
            paper: classNames({
              [classes.drawerOpen]: this.state.open,
              [classes.drawerClose]: !this.state.open
            })
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <List>
            <NavLink to="/Expenses" style={{ textDecoration: "none" }}>
              <ListItem button key="Expenses">
                <ListItemIcon>
                  <Expenses />
                </ListItemIcon>
                <ListItemText primary="Expenses" />
              </ListItem>
            </NavLink>
            <NavLink to="/Incomes" style={{ textDecoration: "none" }}>
              <ListItem button key="Income">
                <ListItemIcon>
                  <Incomes />
                </ListItemIcon>
                <ListItemText primary="Income" />
              </ListItem>
            </NavLink>
            <NavLink to="/Insights" style={{ textDecoration: "none" }}>
              <ListItem button key="Insights">
                <ListItemIcon>
                  <Insights />
                </ListItemIcon>
                <ListItemText primary="Insights" />
              </ListItem>
            </NavLink>
          </List>
          <Divider />
          <List>
            <NavLink to="/Budget" style={{ textDecoration: "none" }}>
              <ListItem button key="Budget">
                <ListItemIcon>
                  <Budget />
                </ListItemIcon>
                <ListItemText primary="Budget" />
              </ListItem>
            </NavLink>
            <NavLink to="/Savings" style={{ textDecoration: "none" }}>
              <ListItem button key="Savings">
                <ListItemIcon>
                  <Savings />
                </ListItemIcon>
                <ListItemText primary="Savings" />
              </ListItem>
            </NavLink>
            <NavLink to="/Report" style={{ textDecoration: "none" }}>
              <ListItem button key="Report">
                <ListItemIcon>
                  <Report />
                </ListItemIcon>
                <ListItemText primary="Report" />
              </ListItem>
            </NavLink>
            {/* <NavLink to="/Investments" style={{ textDecoration: "none" }}>
              <ListItem button key="Investments">
                <ListItemIcon>
                  <Investments />
                </ListItemIcon>
                <ListItemText primary="Investments" />
              </ListItem>
            </NavLink> */}
          </List>
          <Divider />
          <List>
            <NavLink to="/About" style={{ textDecoration: "none" }}>
              <ListItem button key="About">
                <ListItemIcon>
                  <About />
                </ListItemIcon>
                <ListItemText primary="About" />
              </ListItem>
            </NavLink>
          </List>
        </Drawer>
      </React.Fragment>
    );
  }
}

MiniDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(MiniDrawer);
