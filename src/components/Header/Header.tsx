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
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { fetchCourses } from '@/lib/search';
import SearchResults, { CourseSearchResult } from './SearchResults';
import { supabase } from '@/lib/supabase/client';
import { User } from 'next-auth';
import { useNotifications } from '@/context/NotificationsContext';

/* ================== Styles ================== */

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
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
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

/* ================== Types ================== */

interface HeaderProps {
  currentRoadmapId?: string | null;
}

/* ================== Component ================== */

export default function Header({ currentRoadmapId: propRoadmapId }: HeaderProps) {
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const { notifications } = useNotifications();

  const [searchQuery, setSearchQuery] = useState('');
  const [res, setRes] = useState<CourseSearchResult[]>([]);

  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);

  const [currentRoadmapId, setCurrentRoadmapId] = useState<string | null>(
    propRoadmapId || null
  );
  const [user, setUser] = useState<User | null>(null);

  /* ================== Effects ================== */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setRes([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadUserAndRoadmap = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUser(user);

      if (!propRoadmapId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('current_roadmap_id')
          .eq('id', user.id)
          .single();

        if (profile?.current_roadmap_id) {
          setCurrentRoadmapId(profile.current_roadmap_id);
        }
      }
    };

    loadUserAndRoadmap();
  }, [propRoadmapId]);

  /* ================== Handlers ================== */

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

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setProfileAnchorEl(event.currentTarget);

  const handleNotifcationMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setNotificationAnchorEl(event.currentTarget);

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
    if (currentRoadmapId) {
      router.push(`/roadmaps/${currentRoadmapId}/courses`);
    }
  };

  const handleMyTasks = () => {
    handleMenuClose();
    router.push('/tasklist');
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setMobileMoreAnchorEl(event.currentTarget);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    handleMenuClose();
    router.push('/auth/login');
  };

  /* ================== Render ================== */

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Link href="/student" className="no-underline">
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

            <StyledInputBase
              placeholder="Search courses…"
              value={searchQuery}
              onChange={handleSearch}
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton color="inherit" onClick={handleNotifcationMenuOpen}>
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton edge="end" onClick={handleProfileMenuOpen} color="inherit">
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      {res.length > 0 && (
        <div
          ref={searchRef}
          className="mt-1 bg-white shadow-md max-h-96 overflow-auto z-50 rounded w-[300px] ml-[150px] p-4"
        >
          <SearchResults res={res} />
        </div>
      )}
    </Box>
  );
}
