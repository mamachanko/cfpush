import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

export default () =>
    <Paper elevation={1}
           className={'header'}>
        <AppBar position="static"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 4px'
                }}>
            <Typography variant="h6"
                        color="inherit">
                {'Cloud Foundry Tutorial Chat'}
            </Typography>
        </AppBar>
    </Paper>;
