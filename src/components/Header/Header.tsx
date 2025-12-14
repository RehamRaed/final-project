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
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import TuneIcon from '@mui/icons-material/Tune';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from "react";
import { fetchCourses } from '@/lib/search';
import SearchResults from './SearchResults';

// === Styled Components ===
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

interface Tag{
  id:string,
  name: string
}

interface HeaderProps {
  tags: Tag[] | null;
}

interface Course {
  course_id: string;
  title: string;
  description: string;
  donePercentage: number;
}

export default function Header({tags}: HeaderProps) {

  const [searchQuery, setSearchQuery] = useState('');
  // const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [res, setRes] = useState<Course[]>([]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)

    const query = e.target.value;
    setSearchQuery(query);
    if (!query) {
      console.log(query)
      setRes([]);
      return;
    }
    try {
      const courses = await fetchCourses({
        query: query,
        // tags: selectedTags,
      });
      console.log('Filtered courses:', courses);
      setRes(courses);
    } catch (err) {
      console.error(err);
    }
  };
  // {console.log(tags)}
  const router = useRouter();
  const searchParams = useSearchParams();

  // ناخد الـ roadmapId من الرابط (student page)
  const roadmapId = searchParams.get('id');

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // === Handlers ===
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleProfileRedirect = () => {
    handleMenuClose();
    router.push('/profile');
  };

  const handleMyCourses = () => {
    handleMenuClose();
    if (!roadmapId) return;
    router.push(`/roadmaps/${roadmapId}/courses`);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  // === Menus ===
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfileRedirect}>Profile</MenuItem>
      <MenuItem onClick={handleMyCourses}>My Courses</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileRedirect}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      <MenuItem onClick={handleMyCourses}>
        <p>My Courses</p>
      </MenuItem>
    </Menu>
  );

  // === Render Header ===
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton size="large" edge="start" color="inherit" aria-label="open drawer" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton> */}

          <Link href="/student" passHref>
            <Typography
              variant="h6"
              noWrap
              sx={{
                display: { xs: 'none', sm: 'block' },
                textDecoration: 'none',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              StudyMATE
            </Typography>
          </Link>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder={searchQuery} onChange={handleSearch} inputProps={{ 'aria-label': 'search' }} />
          </Search>
          {/* <SearchResults res={res ?? []}/> */}
{/* 
          <IconButton size="large" edge="start" color="inherit" aria-label="filter" sx={{ mr: 2 }}>
            <TuneIcon />
          </IconButton> */}

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
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
              aria-label="show more"
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
        <div className="mt-1 bg-white shadow-md max-h-96 overflow-auto z-50 rounded w-[300px] ml-[150px] p-4">
          <SearchResults res={res} />
        </div>
      )}

      {renderMobileMenu}
      {renderMenu}
    </Box>
    
  );
}
