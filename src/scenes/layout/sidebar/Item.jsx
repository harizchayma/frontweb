import { MenuItem } from "react-pro-sidebar"; 
import { Link, useLocation } from "react-router-dom";

const Item = ({ title, path, icon }) => {
  const location = useLocation();

  return (
    <MenuItem
      component={<Link to={path} />}
      icon={
        <span style={{ fontSize: "0.5 rem" }}>
          {icon}
        </span>
      }
      rootStyles={{
        borderRadius: "8px",  
        padding: "3px 5px",
        margin: "5px 20px",
        color: location.pathname === path ? '#f5f6f9' : '#070809',
        backgroundColor: location.pathname === path ? '#80bff2' : 'transparent',
        transition: "background-color 0.3s ease",
        '&:hover': {
          backgroundColor: '#7db8eff4', 
          borderRadius: "10px",
        },
      }}
    >
      {title}
    </MenuItem>
  );
};

export default Item;