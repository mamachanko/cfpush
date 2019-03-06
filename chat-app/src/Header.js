import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";

export default () =>
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
    </AppBar>;
