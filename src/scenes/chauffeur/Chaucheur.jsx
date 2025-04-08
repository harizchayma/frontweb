import React, { useState, useEffect } from "react";
import { Box, Snackbar, Alert, Button, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Edit, Visibility, Delete } from "@mui/icons-material";
import axios from "axios";
import { Header } from "../../components";
import AfficheChauffeur from "./AfficheChauffeur";
import ModifieChauffeur from "./ModifieChauffeur";
import AjouteChauffeur from "./AjouteChauffeur";
import { useAuth } from "../context/AuthContext";
import { frFR } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import GridToolbarCustom from "../../components/GridToolbarCustom"
const Chauffeur = () => {
  const [data, setData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedChauffeur, setSelectedChauffeur] = useState(null);
  const { role } = useAuth();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const customColors = role === "Admin" 
  ? { background: "#3c90f0", hover: "#2a3eb1", tableHeader: "#6da5ee" } // Admin colors
  : { background: "#a0d3e8", hover: "#7ab8d9", tableHeader: "#bcccdf" }; // User colorss
  useEffect(() => {
    fetchChauffeurs();
  }, []);

  const fetchChauffeurs = async () => {
    try {
      const response = await axios.get("http://localhost:7001/chauffeur");
      setData(response.data.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des chauffeurs", error);
      setSnackbarMessage("Erreur lors de la récupération des chauffeurs");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleView = (chauffeur) => {
    setSelectedChauffeur(chauffeur);
    setViewDialogOpen(true);
  };

  const handleEdit = (chauffeur) => {
    setSelectedChauffeur(chauffeur);
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    setAddDialogOpen(true);
  };

  const handleSupremeAction = async (id) => {
    try {
      await axios.delete(`http://localhost:7001/chauffeur/${id}`);
      fetchChauffeurs(); // Refresh the list after deletion
      setSnackbarMessage("Chauffeur supprimé avec succès");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Erreur lors de la suppression du chauffeur");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedChauffeur(null);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedChauffeur(null);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };

  const columns = [
    { field: "Numero_contrat", headerName: "Numero Contrat", width: 150 },
    { field: "nom_fr", headerName: "Nom", width: 150 },
    { field: "prenom_fr", headerName: "Prenom", width: 150 },
    { field: "num_tel", headerName: "Telephone", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box display="flex">
          <Tooltip title="Voir les détails">
            <IconButton
              sx={{ color: "#3d59d5", marginRight: 1 }}
              onClick={() => handleView(params.row)}
              color="primary"
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          {role === "Admin" && (
            <>
              <Tooltip title="Modifier">
                <IconButton
                  sx={{ color: "#3db351", marginRight: 1 }}
                  onClick={() => handleEdit(params.row)}
                  color="secondary"
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Supprimer">
                <IconButton
                  sx={{ color: "error.main", marginRight: 1 }}
                  onClick={() => handleSupremeAction(params.row.id_chauffeur)}
                  color="warning"
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ padding: "20px" }}>
      <Header title="Chauffeurs" />
      {role === "Admin" && (
        <Button
          variant="contained"
          onClick={handleAdd}
          sx={{
            backgroundColor: "#3c90f0",
            color: "white",
            fontSize: "0.875rem",
            padding: "10px 20px",
            borderRadius: "20px",
            marginBottom: "20px",
            "&:hover": {
              backgroundColor: "#2a3eb1",
            },
          }}
        >
          Ajouter chauffeur
        </Button>
      )}
      <Box
        sx={{
          height: "60vh",
          width: "75%",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          marginBottom: "20px",
          
        }}
      >
<DataGrid
  rows={data}
  columns={columns}
  getRowId={(row) => row.id_chauffeur}
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
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: customColors.tableHeader,
      borderBottom: "none",
    },
    "& .MuiDataGrid-footerContainer": {
      backgroundColor: customColors.tableHeader,
      borderTop: "none",
    },
  }}
/>

      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <AfficheChauffeur
        open={viewDialogOpen}
        handleClose={handleCloseViewDialog}
        selectedChauffeur={selectedChauffeur}
      />

      <ModifieChauffeur
        open={editDialogOpen}
        handleClose={handleCloseEditDialog}
        chauffeur={selectedChauffeur}
        setChauffeur={setSelectedChauffeur}
        handleUpdateChauffeur={fetchChauffeurs}
      />

      <AjouteChauffeur
        open={addDialogOpen}
        handleClose={handleCloseAddDialog}
        newChauffeur={{}}
        setNewChauffeur={() => {}}
        handleAddChauffeur={() => {
          fetchChauffeurs();
          handleCloseAddDialog();
        }}
      />
    </Box>
  );
};

export default Chauffeur;
