import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';

const centerPages = ['Home', 'Cars', 'My Bookings', 'About'];
const settings = ['Profile', 'Logout'];

function ResponsiveAppBar({ store }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const isLoggedIn = localStorage.getItem("un") && localStorage.getItem("un") !== "null";

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (event) => {
    let targetPage = event.currentTarget.getAttribute("cp");
    if (targetPage === 'My Bookings') targetPage = 'Profile';
    
    if (targetPage) {
      store.dispatch({ type: "page", data: targetPage });
    }
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (setting) => {
    if (setting === 'Logout') {
      localStorage.setItem("un", "null");
      localStorage.setItem("role", 0);
      localStorage.setItem("cl", JSON.stringify([]));
      localStorage.setItem("count", 0);
      store.dispatch({ type: "page", data: "Signin" });
    } else if (setting === 'Profile') {
      store.dispatch({ type: "page", data: "Profile" });
    }
    setAnchorElUser(null);
  };

  const cartClick = () => {
    store.dispatch({ "type": "page", "data": "Cartpage" });
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: 'var(--bg-surface)', 
        boxShadow: 'var(--shadow-nav)',
        borderBottom: '1px solid var(--border-color)',
        top: 0,
        zIndex: 1100
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: '70px', display: 'flex', justifyContent: 'space-between' }}>
          
          {/* LEFT: LOGO */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DirectionsCarFilledIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'var(--accent)', fontSize: '2rem' }} />
            <Typography
              variant="h6"
              noWrap
              onClick={() => store.dispatch({ type: "page", data: "Home" })}
              sx={{
                mr: 4,
                display: { xs: 'none', md: 'flex' },
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                letterSpacing: '.05rem',
                color: 'var(--text-main)',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': { color: 'var(--accent)' }
              }}
            >
              AUTO ELITE
            </Typography>

            {/* MOBILE NAV ICON */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton size="large" onClick={handleOpenNavMenu} sx={{ color: 'var(--text-main)' }}>
                <MenuIcon />
              </IconButton>
              <Menu 
                anchorEl={anchorElNav} 
                open={Boolean(anchorElNav)} 
                onClose={() => setAnchorElNav(null)}
                PaperProps={{
                  sx: { bgcolor: 'var(--bg-surface)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }
                }}
              >
                {centerPages.map((page) => (
                  <MenuItem key={page} cp={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center" sx={{ fontFamily: "var(--font-body)", color: 'var(--text-main)' }}>{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* MOBILE LOGO */}
            <DirectionsCarFilledIcon sx={{ display: { xs: 'flex', md: 'none' }, ml: 2, mr: 1, color: 'var(--accent)' }} />
            <Typography
              variant="h6"
              noWrap
              onClick={() => store.dispatch({ type: "page", data: "Home" })}
              sx={{
                display: { xs: 'flex', md: 'none' },
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                color: 'var(--text-main)',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              AUTO ELITE
            </Typography>
          </Box>

          {/* CENTER: NAV LINKS */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, justifyContent: 'center', gap: 3 }}>
            {centerPages.map((page) => (
              <Button
                key={page}
                cp={page}
                onClick={handleCloseNavMenu}
                sx={{ 
                  my: 2, 
                  color: 'var(--text-muted)', 
                  display: 'block', 
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': { color: 'var(--text-main)' }
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* RIGHT: AUTH BUTTONS OR PROFILE */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {!isLoggedIn ? (
              <>
                <Button 
                  onClick={() => store.dispatch({ type: "page", data: "Signin" })}
                  sx={{ 
                    color: 'var(--text-main)', 
                    fontFamily: 'var(--font-body)', 
                    fontWeight: 600, 
                    textTransform: 'none',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Log In
                </Button>
                <button 
                  className="saas-btn-primary hover-scale"
                  onClick={() => store.dispatch({ type: "page", data: "Signup" })}
                  style={{ width: 'auto', padding: '10px 24px', fontSize: '1rem' }}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={cartClick} sx={{ color: 'var(--text-main)' }}>
                  <Badge badgeContent={localStorage.getItem("count") || 0} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
                <Tooltip title="User Settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, border: '2px solid var(--accent)' }}>
                    <Avatar alt={localStorage.getItem("un") || 'User'} src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={() => setAnchorElUser(null)}
                  PaperProps={{
                    sx: {
                      bgcolor: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'var(--shadow-md)',
                      minWidth: '150px'
                    }
                  }}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                      <Typography textAlign="center" fontWeight={500} color={setting === 'Logout' ? "var(--danger)" : "var(--text-main)"}>
                        {setting}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
