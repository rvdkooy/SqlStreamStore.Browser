import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
  <AppBar position="absolute" >
    <Toolbar>
      <IconButton edge="start" color="inherit" aria-label="menu" component={Link} to="/">
        <HomeIcon /> 
      </IconButton>
      <Typography variant="h6">
        SqlStreamStore browser
      </Typography>
    </Toolbar>
  </AppBar >);
}

export default Header;
