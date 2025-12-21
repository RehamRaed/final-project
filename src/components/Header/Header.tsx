'use client';
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState,useRef } from "react";
import { CourseSearchResult, fetchCourses } from '@/lib/search';
import SearchResults from './SearchResults';
import { supabase } from '@/lib/supabase/client';
import { useNotifications } from '@/context/NotificationsContext';
import { CheckSquare, LogOut, User } from 'lucide-react';
import LogoutConfirmModal from './LogoutConfirmModal';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: { marginLeft: theme.spacing(3), width: 'auto' },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: { width: '20ch' },
  },
}));

interface HeaderProps {
  currentRoadmapId?: string | null;
}


export default function Header({currentRoadmapId}: HeaderProps) {
  const { notifications, removeNotifcation } = useNotifications();
  const searchRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [res, setRes] = useState<CourseSearchResult[]>([]);
  const router = useRouter();

  const [profileAnchorEl, setProfileAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState<null | HTMLElement>(null);

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const isProfileMenuOpen = Boolean(profileAnchorEl);
  const isNotificationMenuOpen = Boolean(notificationAnchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [userInfo, setUserInfo] = useState<{
    avatarUrl: string | null;
    initials: string | null;
    currentRoadmapId?: string | null;
  }>({
    avatarUrl: null,
    initials: null,
    currentRoadmapId: null
  });
  // handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setRes([]); // close search results
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);


  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("avatar_url, full_name, current_roadmap_id")
          .eq("id", user.id)
          .single();

        const avatarUrl = data?.avatar_url || null;
        let initials = null;
        if (data?.full_name) {
          const names = data.full_name.trim().split(" ");
          if (names.length === 1) {
            initials = names[0].charAt(0).toUpperCase();
          } else if (names.length > 1) {
            initials =
              (names[0].charAt(0) +
                names[names.length - 1].charAt(0)).toUpperCase();
          }
        }
        setUserInfo({
          avatarUrl,
          initials,
          currentRoadmapId: data?.current_roadmap_id
        });
      }
    });
  }, []);
    
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (!query) {
      setRes([]);
      return;
    }
    const courses = await fetchCourses({ query });
    setRes(courses);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleNotifcationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setProfileAnchorEl(null);
    setNotificationAnchorEl(null);
    setMobileMoreAnchorEl(null);
  };

  const handleProfileRedirect = () => {
    handleMenuClose();
    router.push('/profile');
  };

  
  const handleMyTasks = () => {
    handleMenuClose();
    router.push("/tasklist");
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    setConfirmLogoutOpen(true);
    await supabase.auth.signOut();
    handleMenuClose();
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      // clear server-side cookies first
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
      // clear client session store as well
      await supabase.auth.signOut().catch(() => {});
      // navigate with full reload to ensure client state and cache are cleared
      setTimeout(() => {
        try {
          window.location.href = '/login';
        } catch {
          router.replace('/login');
        }
      }, 300);
    } catch (e) {
      console.error(e);
      setIsLoggingOut(false);
    }
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMenuClose}
      MenuListProps={{
        sx: {
          paddingTop: 0,
          paddingBottom: 0,
        },
      }}
    >
      <div
        className="h-full bg-bg text-text-primary"
      >
        <MenuItem 
          onClick={handleProfileRedirect}
          className="w-full text-left px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors"
        >
          <User size={18} className="text-text-primary" />
          Profile
        </MenuItem>

        <MenuItem 
        onClick={handleMyTasks}
        className="w-full text-left px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-100"
        >
          <CheckSquare size={18} className="text-text-primary" />
          My Tasks
        </MenuItem>
        <MenuItem 
          onClick={handleLogout} 
          sx={{ color: 'error.main' }}
          className="w-full text-left px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-100"
        >
          <LogOut size={18}/>
          Logout
        </MenuItem>
      </div>
    </Menu>
  );
  const menuId = 'primary-search-account-menu';
  const renderProfile = (
    <Menu
      anchorEl={profileAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id="profile-menu"
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isProfileMenuOpen}
      onClose={handleMenuClose}
      style={{top:"35px"}}
      MenuListProps={{
        sx: {
          paddingTop: 0,
          paddingBottom: 0,
        },
      }}
    >
      <div
        className="h-full bg-bg text-text-primary"
      >
      <MenuItem 
        onClick={handleProfileRedirect}
        className="w-full text-left px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors"
      >
        <User size={18} className="text-text-primary" />
        Profile
      </MenuItem>

      <MenuItem 
       onClick={handleMyTasks}
       className="w-full text-left px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-100"
      >
        <CheckSquare size={18} className="text-text-primary" />
        My Tasks
      </MenuItem>
      <MenuItem 
        onClick={handleLogout} 
        sx={{ color: 'error.main' }}
        className="w-full text-left px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-100"
      >
        <LogOut size={18}/>
        Logout
      </MenuItem>
      </div>
    </Menu>
  );

  const renderNotification = (
    <Menu
      anchorEl={notificationAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id="notification-menu"
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isNotificationMenuOpen}
      onClose={handleMenuClose}
      style={{top:"35px"}}
      MenuListProps={{
        sx: {
          paddingTop: 0,
          paddingBottom: 0,
        },
      }}
    >
      <div
        className="h-full bg-bg text-text-primary"
      >
        {(notifications.length === 0) &&
          <MenuItem>No new notifications</MenuItem>
        }
        {notifications.map((notification, index) => (
          <MenuItem onClick={() => removeNotifcation(index)} key={index}>{notification}</MenuItem>
        ))}
      </div>
      
    </Menu>
  );

  return (<>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Link href="/dashboard" passHref>
            <Typography
              variant="h6"
              noWrap
              sx={{ display: { xs: 'none', sm: 'block' }, color: 'white', cursor: 'pointer' }}
            >
              StudyMATE
            </Typography>
          </Link>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder={searchQuery} onChange={handleSearch} />
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton 
              size="large" 
              color="inherit"
              aria-haspopup="true"
              onClick={handleNotifcationMenuOpen}
            >
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton 
              size="large" 
              color="inherit"
              aria-haspopup="true"
              onClick={handleNotifcationMenuOpen}
            >
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {res.length > 0 && (
        <div
          ref={searchRef}
          className="
            absolute top-12 left-2 
            sm:left-4 
            md:left-37.5
            w-75
            bg-bg rounded-md shadow-xl 
            max-h-96 overflow-auto 
            z-50 p-4
          "
        >
          <SearchResults res={res} />
        </div>
      )}
      {renderProfile}
      {renderNotification}
      {renderMobileMenu}
    </Box>
    <LogoutConfirmModal
        open={confirmLogoutOpen}
        loading={isLoggingOut}
        onClose={() => setConfirmLogoutOpen(false)} 
        onConfirm={handleLogoutConfirm}
      />
      </>
  );
}