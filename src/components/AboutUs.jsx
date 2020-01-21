import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

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
  paperHead: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: 480
  },
  footer: {
    position: "absolute",
    alignItems: "center",
    bottom: theme.spacing.unit * 2
  },
  heart: {
    color: "Red",
    fontSize: 20
  }
});

class AboutUs extends Component {
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Paper className={classes.paperHead} elevation={1}>
            <Typography variant="h5" component="h3">
              About BK
            </Typography>
            <Typography component="p">
              Bahee-Khaata is an App for bookkeeping of your day-to-day expenses
              easily on your finger tips designed exclusive for Millennials.
            </Typography>
          </Paper>
          <p className={classes.footer}>
            Made with<span className={classes.heart}> &hearts; </span>in India.
            <br />
            (Beta v1.0) By{" "}
            <a
              href="https://www.linkedin.com/in/yogeshjain96/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              Ontrooo.
            </a>
          </p>
        </main>
      </React.Fragment>
    );
  }
}
AboutUs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AboutUs);
