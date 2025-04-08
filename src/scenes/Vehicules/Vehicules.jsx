import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, Snackbar, Alert, Dialog, DialogTitle, DialogActions, DialogContent, IconButton,Tooltip  } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { tokens } from "../../theme";
import { Header } from "../../components";
import AjouteVehicule from "./AjouteVehicule";
import AfficherVehicule from "./AfficherVehicule";
import ModifieVehicule from "./ModifieVehicule";
import { useAuth } from "../context/AuthContext";
import Visibility from "@mui/icons-material/Visibility";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import { frFR } from "@mui/x-data-grid";
import GridToolbarCustom from "../../components/GridToolbarCustom"
const Vehicules = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { role } = useAuth();
  const customColors = role === "Admin" 
  ? { background: "#3c90f0", hover: "#2a3eb1", tableHeader: "#6da5ee" } // Admin colors
  : { background: "#a0d3e8", hover: "#7ab8d9", tableHeader: "#bcccdf" }; // User colorss
  const initialVehicleState = () => ({
    num_immatriculation: "",
    marque: "",
    modele: "",
    id_categorie: "",
    n_serie_du_type: "",
    type_commercial: "",
    carrosserie: "",
    energie: "",
    puissance_fiscale: "",
    nbr_places: "",
    cylindree: "",
    num_certificat: "",
    lieu_certificat: "",
    date_certificat: "",
    prix_jour: "",
  });

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newVehicle, setNewVehicle] = useState(initialVehicleState());
  const [vehicleToEdit, setVehicleToEdit] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openEdit, setOpenEdit] = useState(false);
  const [categories, setCategories] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchData();
    }
  }, [categories]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:7001/vehicules");
      const vehicles = response.data.data;

      const vehiclesWithCategories = vehicles.map(vehicle => {
        const category = categories.find(cat => cat.id_categorie === vehicle.id_categorie);
        return {
          ...vehicle,
          catégorie: category ? category.catégorie : "Inconnu",
        };
      });

      setData(vehiclesWithCategories);
    } catch (error) {
      console.error("Erreur lors de la récupération des véhicules", error);
      setSnackbarMessage("Erreur lors de la récupération des véhicules");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const fetchCategories = async () => {
    try {
        const response = await axios.get("http://localhost:7001/categorie");
        console.log("Fetched Categories:", response.data.data); // Add this line
        setCategories(response.data.data);
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories", error);
        setSnackbarMessage("Erreur lors de la récupération des catégories");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
    }
};

const handleAddVehicle = async () => {
  try {
      console.log("Adding Vehicle:", newVehicle); // Add this line
      const response = await axios.post('http://localhost:7001/vehicules', newVehicle);
      setData((prevData) => [...prevData, response.data]);
      setSnackbarMessage("Véhicule ajouté avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      handleAddClose();
  } catch (error) {
      console.error("Erreur lors de l'ajout du véhicule:", error);
      setSnackbarMessage("Erreur lors de l'ajout du véhicule");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
  }
};
  const handleAddOpen = () => setOpenAddDialog(true);
  const handleAddClose = () => {
    setOpenAddDialog(false);
    setNewVehicle(initialVehicleState());
  };

  const handleOpen = (vehicle) => {
    setSelectedVehicle(vehicle);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVehicle(null);
  };

  const handleEdit = (vehicle) => {
    setVehicleToEdit(vehicle);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setVehicleToEdit(null);
  };

  const handleUpdateVehicle = async () => {
    if (!vehicleToEdit) {
      console.error("Aucun véhicule à mettre à jour");
      setSnackbarMessage("Aucun véhicule à mettre à jour");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.put(`http://localhost:7001/vehicules/${vehicleToEdit.num_immatriculation}`, vehicleToEdit);
      const updatedVehicle = response.data.data;
      setData((prevData) =>
        prevData.map((vehicle) =>
          vehicle.num_immatriculation === updatedVehicle.num_immatriculation ? updatedVehicle : vehicle
        )
      );
      setSnackbarMessage("Véhicule modifié avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      handleCloseEdit();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du véhicule", error);
      setSnackbarMessage("Erreur lors de la mise à jour du véhicule");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (numImmatriculation) => {
    try {
      await axios.delete(`http://localhost:7001/vehicules/${numImmatriculation}`);
      setData((prevData) => prevData.filter((vehicle) => vehicle.num_immatriculation !== numImmatriculation));
      setSnackbarMessage("Véhicule supprimé avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erreur lors de la suppression du véhicule", error);
      setSnackbarMessage("Erreur lors de la suppression du véhicule");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleOpenDeleteDialog = (vehicle) => {
    setSelectedVehicle(vehicle);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedVehicle(null);
  };

  const confirmDelete = () => {
    if (selectedVehicle) {
      handleDelete(selectedVehicle.num_immatriculation);
    }
    handleCloseDeleteDialog();
  };

  const columns = [
    { field: "num_immatriculation", headerName: "Numéro Immatriculation", width: 180 },
    { field: "marque", headerName: "Marque", width: 150 },
    { field: "modele", headerName: "Modele", width: 150 },
    { field: "catégorie", headerName: "Catégorie", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <Box display="flex" justifyContent="space-between">
           <Tooltip title="Voir">
          <IconButton sx={{ color: "#3d59d5", marginRight: 2  }} onClick={() => handleOpen(params.row)}>
            <Visibility />
          </IconButton></Tooltip>
          {role === "Admin" && (
            <>
            <Tooltip title="Modifier">
              <IconButton sx={{ color: "#3db351" , marginRight: 2 }} onClick={() => handleEdit(params.row)}>
                <Edit />
              </IconButton>
              </Tooltip>
               <Tooltip title="Supprimer">
              <IconButton sx={{ color: "error.main" , marginRight: 2 }} onClick={() => handleOpenDeleteDialog(params.row)}>
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
    <Box sx={{ padding: '20px' }}>
      <Header title="Véhicules" />
      {role === "Admin" && (
        <Button variant="contained"
          sx={{
            backgroundColor: "#3c90f0",
            color: "white",
            fontSize: '0.875rem',
            padding: '10px 20px',
            borderRadius: '20px',
            marginBottom: '20px',
            '&:hover': {
              backgroundColor: "#2a3eb1",
            },
          }}
          onClick={handleAddOpen}
        >
          Ajouter un Véhicule
        </Button>
      )}
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
          getRowId={(row) => row.num_immatriculation}
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

      <AfficherVehicule open={open} handleClose={handleClose} selectedVehicle={selectedVehicle} />
      <AjouteVehicule
        open={openAddDialog}
        handleClose={handleAddClose}
        newVehicle={newVehicle}
        setNewVehicle={setNewVehicle}
        categories={categories}
        handleAddVehicle={handleAddVehicle}
      />
      <ModifieVehicule
        open={openEdit}
        handleClose={handleCloseEdit}
        vehicle={vehicleToEdit}
        setVehicle={setVehicleToEdit}
        handleUpdateVehicle={handleUpdateVehicle}
        categories={categories}
      />
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} sx={{ '& .MuiDialog-paper': { padding: '20px', borderRadius: '8px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: colors.redAccent[500] }}>Confirmation de suppression</DialogTitle>
        <DialogContent>
          <p>Êtes-vous sûr de vouloir supprimer ce véhicule ?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary" variant="outlined" sx={{ borderRadius: '20px' }}>
            Annuler
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" sx={{ borderRadius: '20px' }}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Vehicules;