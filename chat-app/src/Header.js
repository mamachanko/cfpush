import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = () => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px 4px'
    }
});

const Header = ({classes}) =>
    <AppBar position="static"
            className={classes.root}>
        <Typography variant="h6"
                    color="inherit">
            {'Cloud Foundry Tutorial Chat'}
        </Typography>
    </AppBar>;

export default withStyles(styles)(Header);
