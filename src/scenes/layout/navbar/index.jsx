import { Box, IconButton, Typography, useMediaQuery, useTheme, Button } from "@mui/material";
import { tokens, ColorModeContext } from "../../../theme";
import { useContext } from "react";
import { DarkModeOutlined, LightModeOutlined, MenuOutlined } from "@mui/icons-material";
import { ToggledContext } from "../../../App";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { toggled, setToggled } = useContext(ToggledContext);
  const isMdDevices = useMediaQuery("(max-width:768px)");
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
      <Box display="flex" alignItems="center" gap={3}>
        <IconButton
          sx={{ display: isMdDevices ? "flex" : "none" }}
          onClick={() => setToggled(!toggled)}
        >
          <MenuOutlined />
        </IconButton>
        <Typography 
          variant="h1" 
          sx={{ color: "#004aad" }} // Set the color to #5271ff
        >
          Gestion de location des véhicules
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
        </IconButton>
        
        <Button 
          variant="contained" 
          sx={{ backgroundColor: theme.palette.mode === "dark" ? "#f50057" : "#3f51b5", color: "white" }}
          onClick={handleLogout}
        >
          Déconnexion
        </Button>
      </Box>
    </Box>
  );
};

export default Navbar;