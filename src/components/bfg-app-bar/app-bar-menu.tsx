import { Divider, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';
import { DbkAppBarSubMenu } from './app-bar-sub-menu';
import { LinkProps } from 'react-router';


export type SubMenuAction = {
  type: 'sub-menu-action';
  title: string;
  action: () => Promise<void>;
}

export type SubMenuLink = {
  type: 'sub-menu-link';
  title: string;
  link: LinkProps;
}

export type SubMenuItem = SubMenuAction | SubMenuLink;

export type SubMenu = {
  type: 'sub-menu';
  title: string;
  subMenuItems: SubMenuItem[];
}

export type MenuAction = {
  type: 'menu-action';
  title: string;
  action: () => Promise<void>;
}

export type MenuLink = {
  type: 'menu-link';
  title: string;
  link: LinkProps;
}

export type MenuDivider = { 
  type: 'menu-divider';
}

export type MenuLabel = {
  type: 'menu-label';
  title: string;
}

export type DbkAppBarMenuItem = MenuAction | MenuLink | SubMenu | MenuDivider | MenuLabel;

interface IDbkAppBarMenuProps {
  anchorElUser: null | HTMLElement;
  userMenuItems: DbkAppBarMenuItem[];
  handleCloseUserMenu: () => void;
}

export const DbkAppBarMenu = ({ anchorElUser, userMenuItems, handleCloseUserMenu }: IDbkAppBarMenuProps) => {

  const [areSubmenusOpen, setAreSubmenusOpen] = useState(false);

  const handleMenuClose = () => {
    handleCloseUserMenu();
    setAreSubmenusOpen(false);
  }

  const handleSubmenusClose = () => {
    setAreSubmenusOpen(false);
  }

  const handleOpenSubmenu = () => {
    setAreSubmenusOpen(true);
  };

  
  return (
    <Menu
      sx={{ mt: '45px' }}
      id="menu-appbar"
      anchorEl={anchorElUser}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorElUser)}
      onClose={handleMenuClose}
      onMouseLeave={handleSubmenusClose}
      MenuListProps={{
        onMouseEnter: handleSubmenusClose,
        onMouseLeave: handleSubmenusClose,
      }}
    >
      {
        userMenuItems.map((menuItem, index) => {
          if (menuItem.type === 'menu-action') {
            return (
              <MenuItem
                key={`action-${menuItem.title}-${index}`}
                onClick={async () => {
                  await menuItem.action();
                  handleMenuClose();
                }}
                onMouseEnter={handleSubmenusClose}
                onMouseLeave={handleSubmenusClose}
              >
                <Typography sx={{ textAlign: 'center' }}>{menuItem.title}</Typography>
              </MenuItem>
            )
          } else if (menuItem.type === 'menu-link') {
            return (
              <a 
                key={`link-${menuItem.title}-${index}`}
                href={menuItem.link.to as string}
              >
                <MenuItem>
                  <Typography sx={{ textAlign: 'center' }}>{menuItem.title}</Typography>
                </MenuItem>
              </a>
            )
          } else if (menuItem.type === 'menu-divider') {
            return (
              <Divider key={index} />
            )
          } else if (menuItem.type === 'menu-label') {
            return (
              <Typography 
                key={index}
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  padding: '10px',
                }}
              >
                {menuItem.title}
              </Typography>
            )
          } else {
            return (
              <DbkAppBarSubMenu
                key={index}
                menuItem={menuItem}
                areSubmenusOpen={areSubmenusOpen}
                handleOpenSubmenu={handleOpenSubmenu}
                handleMenuClose={handleMenuClose}
              />
            )
          }
        })
      }
    </Menu>
  )
}
