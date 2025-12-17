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
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState,useRef } from "react";
import { fetchCourses } from '@/lib/search';
import SearchResults from './SearchResults';
import { supabase } from '@/lib/supabase/client';
import { User } from 'next-auth';
import { useNotifications } from '@/context/NotificationsContext';

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


interface Course {
  id: string;
  title: string;
  description: string;
  donePercentage: number;
}

export default function Header({currentRoadmapId}: HeaderProps) {
  const { notifications, removeNotifcation } = useNotifications();
  const searchRef = useRef<HTMLDivElement>(null);

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
  
  const [searchQuery, setSearchQuery] = useState('');
  const [res, setRes] = useState<Course[]>([]);
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const roadmapId = searchParams.get('id');

  const [profileAnchorEl, setProfileAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState<null | HTMLElement>(null);

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

  const [currentRoadmap, setCurrentRoadmap] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  
  const isProfileMenuOpen = Boolean(profileAnchorEl);
  const isNotificationMenuOpen = Boolean(notificationAnchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  
  useEffect(() => {
      const loadUserAndRoadmap = async () => {
        const { supabase } = await import("@/lib/supabase/client");
  
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
  
        setUser(user);
  
        const { data: profile } = await supabase
          .from("profiles")
          .select("current_roadmap_id, roadmaps(*)")
          .eq("id", user.id)
          .single();
  
        if (profile?.roadmaps) {
          setCurrentRoadmap(profile.roadmaps);
        }
      };
  
      loadUserAndRoadmap();
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

  
  const handleMyCourses = () => {
    handleMenuClose();
    router.push(`/roadmaps/${roadmapId}/courses`);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    handleMenuClose();
    router.push('/auth/login');
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
    >
      <MenuItem onClick={handleProfileRedirect}>
        <p>Profile</p>
      </MenuItem>
      <MenuItem onClick={handleMyCourses}>
        <p>My Courses</p>
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <p style={{ color: 'red' }}>Logout</p>
      </MenuItem>
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
    >
      <MenuItem onClick={handleProfileRedirect}>Profile</MenuItem>
      <MenuItem onClick={handleMyCourses}>My Courses</MenuItem>
      <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
        Logout
      </MenuItem>
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
    >
      {(notifications.length === 0) &&
        <MenuItem>No new notifications</MenuItem>
      }
      {notifications.map((notification, index) => (
        <MenuItem onClick={() => removeNotifcation(index)} key={index}>{notification}</MenuItem>
      ))}
      
      
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Link href="/student" passHref>
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
        className="mt-1 bg-white shadow-md max-h-96 overflow-auto z-50 rounded w-[300px] ml-[150px] p-4"
      >
        <SearchResults
          res={res}
        />
      </div>
      )}
      {renderProfile}
      {renderNotification}
      {renderMobileMenu}
    </Box>
  );
}