import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Switch,
  Tooltip
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { Header } from "../../components";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";
import AfficherUtilisateur from "./AfficherUtilisateur";
import AjouteUtilisateur from "./AjouteUtilisateur";
import ModifieUtilisateur from "./ModifieUtilisateur";
import ModifieLogin from "./ModifieLogin";
import axios from "axios";
import { frFR } from "@mui/x-data-grid";
import GridToolbarCustom from "../../components/GridToolbarCustom"
const Utilisateur = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openDetails, setOpenDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Fetch user data
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:7001/users");
      if (!response.ok) {
        throw new Error("Error fetching utilisateurs");
      }
      const result = await response.json();
      if (Array.isArray(result.data)) {
        setData(result.data);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddClose = () => {
    setOpenAddDialog(false);
    fetchData();
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    fetchData();
  };

  const handleLoginClose = () => {
    setOpenLoginDialog(false);
    fetchData();
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      const response = await axios.delete(
        `http://localhost:7001/users/${selectedUser.id}`
      );

      if (response.status === 200) {
        setSnackbarMessage("Utilisateur supprimé avec succès");
        setSnackbarSeverity("success");
      } else {
        throw new Error("Erreur lors de la suppression de l'utilisateur");
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
      setOpenDeleteDialog(false);
      fetchData();
    }
  };

  const handleEditOpen = (user) => {
    setUserToEdit(user);
    setOpenEdit(true);
  };

  const handleViewOpen = (user) => {
    setSelectedUser(user);
    setOpenDetails(true);
  };

  const handleDetailsClose = () => {
    setOpenDetails(false);
    setSelectedUser(null);
  };

  const handleToggleActive = async (user) => {
    // Normalize etat for consistency
    const newStatus = user.etat === "1" || user.etat === true ? "0" : "1";
    console.log("Toggling status for user ID:", user.id, "to:", newStatus);

    try {
        const response = await axios.put(`http://localhost:7001/users/${user.id}/etat`, { etat: newStatus });
        console.log("User status updated:", response.data);

        // Update local state immediately to reflect the change
        setData((prevData) =>
            prevData.map((u) =>
                u.id === user.id ? { ...u, etat: newStatus } : u
            )
        );

        setSnackbarMessage("Statut mis à jour avec succès");
        setSnackbarSeverity("success");
    } catch (error) {
        console.error("Error updating status:", error.response ? error.response.data.message : error.message);
        setSnackbarMessage("Échec de la mise à jour");
        setSnackbarSeverity("error");
    } finally {
        setSnackbarOpen(true);
    }
};


const columns = [
  { field: "nom", headerName: "Nom", width: 130 },
  { field: "prenom", headerName: "Prénom", width: 130 },
  { field: "mail", headerName: "Email", width: 200 },
  { field: "role", headerName: "Rôle", width: 100 },
  {
    field: "etat",
    headerName: "Actif",
    width: 80,
    renderCell: (params) => {
      // Normalize etat: Convert "true"/"false" to "1"/"0"
      const etat =
        params.row.etat === true
          ? "1"
          : params.row.etat === false
            ? "0"
            : params.row.etat;
      const isActive = etat === "1";
      console.log(
        "Rendering Switch for user ID:",
        params.row.id,
        "Normalized Etat:",
        etat,
        "Is Active:",
        isActive
      );

      return (
        <Tooltip title={isActive ? "Désactiver l'utilisateur" : "Activer l'utilisateur"}>
          <Switch
            checked={isActive}
            onChange={() => handleToggleActive(params.row)} // Pass the row to update
            color="primary"
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "green", // Green when active
                transform: "translateX(20px)", // Move thumb to the right
              },
              "& .MuiSwitch-switchBase": {
                color: "red", // Red when inactive
              },
              "& .MuiSwitch-track": {
                backgroundColor: isActive ? "green" : "red", // Green/red track
                transition: "background-color 0.3s ease",
              },
            }}
          />
        </Tooltip>
      );
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 250, // Increased width to accommodate all tooltips
    renderCell: (params) => (
      <Box display="flex" justifyContent="space-between">
        <Tooltip title="Voir les détails">
          <IconButton
            sx={{ color: "#3d59d5", marginRight: 1 }}
            onClick={() => handleViewOpen(params.row)}
          >
            <Visibility />
          </IconButton>
        </Tooltip>
        <Tooltip title="Modifier l'utilisateur">
          <IconButton
            sx={{ color: "#3db351", marginRight: 1 }}
            onClick={() => handleEditOpen(params.row)}
          >
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title="Modifier les informations de connexion">
          <IconButton
            sx={{ color: "#FFCA28", marginRight: 1 }}
            onClick={() => {
              setSelectedUser(params.row);
              setOpenLoginDialog(true); // Open login modification dialog
            }}
          >
            <KeyIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Supprimer l'utilisateur">
          <IconButton
            sx={{ color: "error.main" }}
            onClick={() => {
              setSelectedUser(params.row);
              setOpenDeleteDialog(true); // Open delete confirmation dialog
            }}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  },
];

  return (
    <Box sx={{ padding: "20px" }}>
      <Header title="Utilisateurs" />
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#3c90f0",
          color: "white",
          fontSize: "0.875rem",
          padding: "10px 20px",
          borderRadius: "20px",
          marginBottom: "20px",
          "&:hover": { backgroundColor: "#2a3eb1" },
        }}
        onClick={() => setOpenAddDialog(true)}
      >
        Ajouter un Utilisateur
      </Button>
      <Box
        sx={{
          height: "60vh",
          width: "80%",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          marginBottom: "20px",
          "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { border: "none" },
            "& .name-column--cell": { color: colors.greenAccent[300] },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#6da5ee",
              borderBottom: "none", 
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: "#6da5ee",
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
            "& .MuiDataGrid-iconSeparator": {
              color: colors.primary[100],
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.gray[100]} !important`,
            },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.id}
          components={{
            Toolbar: GridToolbarCustom, // Custom toolbar
          }}
          localeText={{
            ...frFR.components.MuiDataGrid.defaultProps.localeText, // French default localization
          }}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          checkboxSelection
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { border: "none" },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#6da5ee",
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: "#f1f1f1",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: "#6da5ee",
            },
          }}
        />
      </Box>
      <AfficherUtilisateur
        open={openDetails}
        handleClose={handleDetailsClose}
        selectedUser={selectedUser}
      />
      <AjouteUtilisateur open={openAddDialog} handleClose={handleAddClose} />
      <ModifieUtilisateur
        open={openEdit}
        user={userToEdit}
        onClose={handleCloseEdit}
      />
      <ModifieLogin
        open={openLoginDialog}
        handleClose={handleLoginClose}
        userId={selectedUser ? selectedUser.id : null}
        currentLogin={selectedUser ? selectedUser.login : ""}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        sx={{ "& .MuiDialog-paper": { padding: "20px", borderRadius: "8px" } }}
      >
        <DialogTitle sx={{ fontWeight: "bold", color: colors.redAccent[500] }}>
          Confirmation de suppression
        </DialogTitle>
        <DialogContent>
          <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            color="primary"
            variant="outlined"
            sx={{ borderRadius: "20px" }}
          >
            Annuler
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            sx={{ borderRadius: "20px" }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Utilisateur;
