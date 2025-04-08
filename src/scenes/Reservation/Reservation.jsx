import React, { useEffect, useState } from "react";
import {
  Box,
  useTheme,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { tokens } from "../../theme";
import { Header } from "../../components"; // Adjust the path if needed
import { useAuth } from "../context/AuthContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GridToolbarCustom from "../../components/GridToolbarCustom";
import { frFR } from "@mui/x-data-grid";
import AfficherReservation from "./AfficherReservation"; 
import AjouteContratReseve from "./AjouteContratReseve"; // Import AjouteContratReseve

const Reservations = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { role } = useAuth();
  const customColors = role === "Admin" 
  ? { background: "#3c90f0", hover: "#2a3eb1", tableHeader: "#6da5ee" } // Admin colors
  : { background: "#a0d3e8", hover: "#7ab8d9", tableHeader: "#bcccdf" }; // User colorss
  const [reservations, setReservations] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  
  // State for showing the reservation dialog
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  // State for the AjouteContratReseve dialog
  const [ajouteContratOpen, setAjouteContratOpen] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get("http://localhost:7001/reservation");
      const reservationsData = response.data.data || [];
      const currentDate = new Date();

      for (const reservation of reservationsData) {
        const clientResponse = await axios.get(`http://localhost:7001/client/cin_client?cin_client=${reservation.cin_client}`);
        const clientData = clientResponse.data.data;
        reservation.clientName = clientData ? `${clientData.nom_fr} ${clientData.prenom_fr}` : "Unknown Client";

        const startDate = new Date(reservation.Date_debut);
        if (reservation.action === "en attent" && startDate < currentDate) {
          await handleReject(reservation); // Automatically reject the reservation
        }
      }
      
      setReservations(reservationsData);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setSnackbarMessage("Error fetching reservations.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  const handleDialogOpen = (reservation = null) => {
    setEditingReservation(reservation);
    setDialogOpen(true);
  };

  const handleView = (reservation) => {
    setSelectedReservation(reservation); 
    setShowReservationDialog(true); // Open the view dialog
  };

  const handleDeleteConfirmation = (reservation) => {
    setReservationToDelete(reservation);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!reservationToDelete) return;

    try {
      await axios.delete(`http://localhost:7001/reservation/${reservationToDelete.id}`);
      setSnackbarMessage("Reservation deleted!");
      fetchReservations();
    } catch (error) {
      console.error("Error deleting reservation:", error);
      setSnackbarMessage("Error deleting reservation.");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
    setOpenDeleteDialog(false);
  };

  const handleAccept = async (selectedReservation) => {
    const currentDate = new Date();
    const startDate = new Date(selectedReservation.Date_debut);

    // Check if the action is "en attent" and the start date has passed
    if (selectedReservation.action === "en attent" && startDate < currentDate) {
        await handleReject(selectedReservation); // Automatically reject the reservation
        return;
    }

    if (!selectedReservation.num_immatriculation) {
        setSnackbarMessage("Aucun véhicule sélectionné pour cette réservation.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
    }

    const reservationData = {
        ...selectedReservation,
        Date_debut: selectedReservation.Date_debut,
        Heure_debut: selectedReservation.Heure_debut,
        Date_retour: selectedReservation.Date_retour,
        Heure_retour: selectedReservation.Heure_retour,
        Duree_location: selectedReservation.Duree_location,
        cin_client: selectedReservation.cin_client || '',
    };

    setSelectedReservation(reservationData);
    setAjouteContratOpen(true);
};

const handleReject = async (selectedReservation) => {
  try {
    await axios.patch(
      `http://localhost:7001/reservation/${selectedReservation.id_reservation}/action`,
      { action: "rejecte" }
    );
    await fetchReservations();
    setSnackbarMessage("Réservation refusée !");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  } catch (error) {
    console.error("Erreur lors du refus de la réservation :", error);
    setSnackbarMessage("Erreur lors du refus de la réservation.");
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingReservation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const columns = [
    { field: "clientName", headerName: "Client", width: 150 },
    { field: "num_immatriculation", headerName: "Numero Immatriculation", width: 180 },
    { field: "Duree_location", headerName: "Durée de location", width: 150 },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box display="flex">
          <Tooltip title="Voir les détails">
            <Button onClick={() => handleView(params.row)}>
              <VisibilityIcon sx={{ color: "#3d59d5", marginRight: 1 }} />
            </Button>
          </Tooltip>
          {role === "Admin" && (
            <Tooltip title="Supprimer">
              <Button color="error" onClick={() => handleDeleteConfirmation(params.row)}>
                <DeleteIcon />
              </Button>
            </Tooltip>
          )}
        </Box>
      ),
    },
    {
      field: "etat",
      headerName: "État",
      width: 150,
      renderCell: (params) => {
        let icon, color, text;
        switch (params.row.action) {
          case "accepte":
            icon = <CheckCircleIcon sx={{ color: "green", marginRight: 1 }} />;
            color = "green";
            text = "Acceptée";
            break;
          case "en attent":
            icon = <HourglassEmptyIcon sx={{ color: "orange", marginRight: 1 }} />;
            color = "orange";
            text = "En Attente";
            break;
          case "rejecte":
            icon = <CancelIcon sx={{ color: "red", marginRight: 1 }} />;
            color = "red";
            text = "Rejetée";
            break;
          default:
            icon = null;
            color = "gray";
            text = "Inconnu";
        }
        return (
          <Box sx={{ display: "flex", alignItems: "center" }} onClick={text === "Acceptée" ? () => handleAccept(params.row) : undefined}>
            {icon}
            <Typography variant="body2" sx={{ color: color }}>
              {text}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ padding: "20px" }}>
      <Header title="Réservations" />
     

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
          rows={reservations}
          columns={columns}
          getRowId={(row) => row.id_reservation}
          components={{
            Toolbar: GridToolbarCustom,
          }}
          localeText={{
            ...frFR.components.MuiDataGrid.defaultProps.localeText,
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

      {/* Confirm delete dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this reservation?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Show reservation dialog */}
      <AfficherReservation
        open={showReservationDialog}
        handleClose={() => setShowReservationDialog(false)} // Close the dialog
        selectedReservation={selectedReservation} // Pass the selected reservation
        handleAccept={handleAccept} // Accept reservation event
        handleReject={handleReject} // Reject reservation event
      />
<AjouteContratReseve
    open={ajouteContratOpen}
    handleClose={() => setAjouteContratOpen(false)}
    selectedReservation={selectedReservation}
    activeStep={3} // Ouvrir à l'étape 3
    handleAccept={handleAccept} // Pass the handleAccept function
/>

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
    </Box>
  );
};

export default Reservations;