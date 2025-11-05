import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';

import Sidebar from './sidebar';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { PrimarySearchAppBar } from './appBar';


const drawerWidth = 240;

const DrawerLayout = (props) => {
  // -----------------------------------------------------------
  
      const { window,children } = props;
      const [mobileOpen, setMobileOpen] = React.useState(false);
      const [isClosing, setIsClosing] = React.useState(false);
  
      const handleDrawerClose = () => {
          setIsClosing(true);
          setMobileOpen(false);
      };
  
      const handleDrawerTransitionEnd = () => {
          setIsClosing(false);
      };
  
      const handleDrawerToggle = () => {
          if (!isClosing) {
              setMobileOpen(!mobileOpen);
          }
      };
      // ------------------------------------------------------
    const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* ---------------- AppBar ---------------- */}
     
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar style={{ width: '100%' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <PrimarySearchAppBar />
        </Toolbar>
      </AppBar>

      {/* ---------------- Drawer ---------------- */}
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <Sidebar/>
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
         <Sidebar/>
        </Drawer>
      </Box>

      {/* ---------------- Main Content ---------------- */}
      <Box component="main"  sx={{ flexGrow: 1,  width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        {children}
      </Box>
    </Box>
  );
};

export default DrawerLayout;
