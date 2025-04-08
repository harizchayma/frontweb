import React, { useEffect, useState, useContext, useMemo } from "react";
import { Avatar, Box, IconButton, Typography, Skeleton } from "@mui/material";
import { tokens } from "../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  DashboardOutlined,
  MenuOutlined,
  PeopleAltOutlined,
  DirectionsCar,
  PersonOutline,
  InfoOutlined,
  CategoryOutlined,
  AssignmentTurnedInOutlined,
  PaymentOutlined,
  BusinessCenter,
} from "@mui/icons-material";
import BookOnlineIcon from '@mui/icons-material/BookOnline';

import logo from "../../../assets/images/nom.png";
import { ToggledContext } from "../../../App";
import Item from "./Item";
import Add from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../context/AuthContext";
const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const { role } = useAuth();

  const [openBaseInfo, setOpenBaseInfo] = useState(false);
  const [openBusinessManagement, setOpenBusinessManagement] = useState(false);
  const [openUtilisateur, setOpenUtilisateur] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUserName(`${userData.nom} ${userData.prenom}`); // Use nom and prenom
      setUserRole(userData.role || "Utilisateur");
      const userId = userData.id; // Use id from the user object
      if (userId) fetchUserData(userId); // Correct function name
    }
  }, []);

  const fetchUserData = async (userId) => { // Correct function name
    try {
      const response = await fetch(`http://localhost:7001/users/${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user image: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (data.data && data.data.image) {
        setUserImage(data.data.image);
      } else {
        console.log("User  image not found for user ID:", userId);
      }
    } catch (error) {
      console.error("Error fetching user image:", error);
    }
  };

  useEffect(() => {
    if (userImage) {
      try {
        let blob;

        if (userImage.type === "Buffer") {
          const uint8Array = new Uint8Array(userImage.data);
          blob = new Blob([uint8Array], { type: "image/jpeg" });
        } else if (typeof userImage === "string" && userImage.startsWith("data:image")) {
          const base64Data = userImage.split(",")[1];
          const byteCharacters = atob(base64Data);
          const byteArrays = [];
          for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
          }
          blob = new Blob(byteArrays, { type: "image/jpeg" });
        } else {
          console.error("Image format not supported:", userImage);
          return;
        }

        if (blob) {
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
          return () => {
            URL.revokeObjectURL(url);
          };
        }
      } catch (error) {
        console.error("Error creating image URL:", error);
      }
    }
  }, [userImage]);

  const menuItemStyles = useMemo(
    () => ({
      button: {
        ":hover": {
          color: "#f7f8fc",
          background: "rgba(134, 141, 251, 0.2)",
          transition: ".4s ease",
        },
        fontSize: "1rem",
        padding: "10px 20px",
        borderRadius: "8px",
      },
    }),
    []
  );

  const menuItems = [
    {
      title: "Information de base",
      icon: <InfoOutlined />,
      items: [
        { title: "Clients", path: "/client", icon: <PeopleAltOutlined /> },
        { title: "Véhicules", path: "/vehicules", icon: <DirectionsCar /> },
        { title: "Catégories", path: "/categorie", icon: <CategoryOutlined /> },
      ],
    },
    {
      title: "Gestion de métier",
      icon: <BusinessCenter />,
      items: [
        { title: "Contrats", path: "/contrat", icon: <AssignmentTurnedInOutlined /> },
    { title: "Chauffeurs", path: "/chauffeur", icon: <PersonOutline /> },
    { title: "Avances", path: "/avance", icon: <PaymentOutlined /> },
    { title: "Réservations", path: "/reservation", icon: <BookOnlineIcon /> },


      ],
    },
    {
      title: "Gestion de Utilisateur",
      icon: <PersonOutline />,
      items: [{ title: "Utilisateur", path: "/Utilisateur", icon: <Add /> }],
    },
  ];

  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      rootStyles={{
        border: 0,
        height: "100vh",
        width: collapsed ? "60px" : "200px",
        transition: "width 0.3s ease",
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      <Menu menuItemStyles={menuItemStyles}>
        <MenuItem
          rootStyles={{ margin: "10px 0 35px 0", color: colors.gray[100] }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {!collapsed && (
              <Box display="flex" alignItems="center" gap="3px">
                <img
                  style={{ width: "150px", height: "150px",marginTop: "20px", marginBottom: 5 }}
                  src={logo}
                  alt="Logo"
                />
              </Box>
            )}
            <IconButton
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Ouvrir la barre latérale" : "Fermer la barre latérale"}
            >
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>

        <Box sx={{ textAlign: "center", marginBottom: 3 }}>
          <Avatar
            src={imageUrl || "/fallback_user.png"}
            alt={userName || "User "}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/fallback_user.png"; // Fallback image
            }}
            sx={{ width: 100, height: 100, margin: "0 auto" }}
          />
          <Typography variant="subtitle1" fontWeight="bold" color="#302855" fontSize={"0.9rem"}>
            {userRole || <Skeleton width={80} />}
          </Typography>
          <Typography variant="body2" fontWeight="bold" color="#52a9ffd2" fontSize={"1rem"}>
            {userName || <Skeleton width={120} />}
          </Typography>
        </Box>

        <Box mb={2} pl={collapsed ? undefined : "1%"}>
  {menuItems.map((section, index) => (
    <React.Fragment key={index}>
      {/* Conditional rendering for Gestion de Utilisateur */}
      {!(section.title === "Gestion de Utilisateur" && role !== "Admin") && (
        <>
          <MenuItem
            onClick={() => {
              if (section.title === "Information de base") {
                setOpenBaseInfo(!openBaseInfo);
              } else if (section.title === "Gestion de métier") {
                setOpenBusinessManagement(!openBusinessManagement);
              } else {
                setOpenUtilisateur(!openUtilisateur);
              }
            }}
            icon={section.icon}
            rootStyles={{
              color: "#382ebf",
              borderRadius: "8px",
              padding: "5px 5px",
              fontWeight: "bold",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: "#75c7f687",
              },
            }}
          >
            {section.title}
          </MenuItem>
          {(section.title === "Information de base" && openBaseInfo) ||
          (section.title === "Gestion de métier" && openBusinessManagement) ||
          (section.title === "Gestion de Utilisateur" && openUtilisateur) ? (
            section.items.map((item, index) => (
              <Item key={index} title={item.title} path={item.path} icon={item.icon} />
            ))
          ) : null}
        </>
      )}
    </React.Fragment>
  ))}
</Box>

      </Menu>
    </Sidebar>
  );
};

export default SideBar;