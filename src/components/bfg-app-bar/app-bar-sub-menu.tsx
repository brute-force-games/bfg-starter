import { useState } from "react";
import { Menu } from "@mui/material";
import { Typography } from "@mui/material";
import { MenuItem } from "@mui/material";
import { SubMenu } from "./app-bar-menu";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';


interface IMwAppBarSubMenuProps {
  menuItem: SubMenu;
  areSubmenusOpen: boolean;
  handleOpenSubmenu: () => void;
  handleMenuClose: () => void;
}

export const DbkAppBarSubMenu = ({ menuItem, areSubmenusOpen, handleOpenSubmenu, handleMenuClose }: IMwAppBarSubMenuProps) => {

  const [submenuAnchorEl, setSubmenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleSubmenuOpen = (event: React.MouseEvent<HTMLElement>) => {

    console.log('handleSubmenuOpen', event.currentTarget);
    setSubmenuAnchorEl(event.currentTarget);
    handleOpenSubmenu();
  };

  const handleSubmenuClose = () => {
    setSubmenuAnchorEl(null);
  };

  const toggleSubmenu = (event: React.MouseEvent<HTMLElement>) => {
    if (submenuAnchorEl) {
      handleSubmenuClose();
    } else {
      handleSubmenuOpen(event);
    }
  }

  return (
    <MenuItem
      key={menuItem.title}
      onClick={toggleSubmenu}
      onMouseLeave={handleSubmenuClose}
      sx={{ display: 'flex', alignItems: 'center' }}
    >
      
      <Typography sx={{ textAlign: 'center', display: 'flex', alignItems: 'center' }}>{menuItem.title} <ArrowRightIcon /></Typography>
      {areSubmenusOpen && (
        <Menu
          anchorEl={submenuAnchorEl}
          open={Boolean(submenuAnchorEl)}
          onClose={handleSubmenuClose}
          anchorOrigin={{ 
            vertical: 'top', 
            horizontal: 'left' 
          }}
          transformOrigin={{ 
            vertical: 'top', 
            horizontal: 'right' 
          }}
          MenuListProps={{
            onMouseLeave: handleSubmenuClose,          
        }}
        >
        {
          menuItem.subMenuItems.map((subMenuItem) => (
            <MenuItem
              key={subMenuItem.title}
              onClick={async () => {
                if (subMenuItem.type === 'sub-menu-action') {
                  await subMenuItem.action();
                }
                handleMenuClose();
              }}
            >
              <Typography sx={{ textAlign: 'center' }}>{subMenuItem.title}</Typography>
            </MenuItem>
          ))
        }
      </Menu>
      )}
    </MenuItem>
  )
}
