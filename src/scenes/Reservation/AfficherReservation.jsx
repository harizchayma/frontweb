import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person"; // For client name
import DateRangeIcon from "@mui/icons-material/DateRange"; // For dates
import TimelapseIcon from "@mui/icons-material/Timelapse"; // For duration
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // For price
import DescriptionIcon from "@mui/icons-material/Description"; // For description
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'; // For immatriculation
import CheckIcon from "@mui/icons-material/Check"; // For accepted
import ClearIcon from "@mui/icons-material/Clear"; // For rejected

function AfficherReservation({ open, handleClose, selectedReservation, handleAccept, handleReject }) {

  const handleAcceptClick = () => {
    if (handleAccept && selectedReservation) {
        handleAccept(selectedReservation);
    }
    handleClose();
};

const handleRejectClick = () => {
    if (handleReject && selectedReservation) {
        handleReject(selectedReservation);
    }
    handleClose();
};

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          padding: "0px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          handleClose();
        }
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        sx={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center",
          color: "#d21919",
          marginBottom: 2,
        }}
      >
        Détails de la Réservation
      </DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        {selectedReservation && (
          <Box>
            {/* Informations Générales Section */}
            <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, mb: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#1976d2", mb: 1 }}
                >
                  Informations Générales
                </Typography>
                <Grid container spacing={1.4}>
                  {[
                    {
                      label: "Numéro d'immatriculation", 
                      value: selectedReservation.num_immatriculation,
                      icon: <ConfirmationNumberIcon sx={{ color: "#1976d2" }} />,
                    },
                    {
                      label: "Nom et Prénom (FR)", 
                      value: selectedReservation.clientName,
                      icon: <PersonIcon sx={{ color: "#1976d2" }} />,
                    },
                    {
                      label: "CIN client",
                      value: selectedReservation.cin_client,
                      icon: <DescriptionIcon sx={{ color: "#1976d2" }} />,
                    },
                  ].map((item, index) => (
                    <Grid item xs={6} key={index} display="flex" alignItems="center">
                      {item.icon}
                      <Typography 
                        variant="body1"
                        sx={{ fontWeight: "bold", color: "#0f0e0e", marginLeft: 1 }}
                      >
                        {item.label}:
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ color: "#555", marginLeft: 1, fontWeight: item.label === "Numéro d'immatriculation:" ? "bold" : "normal" }}
                      >
                        {item.value || "Non spécifié"}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Informations de Réservation Section */}
            <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, mb: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#1976d2", mb: 1 }}
                >
                  Informations de Réservation
                </Typography>
                <Grid container spacing={1.4}>
                  {[
                    {
                      label: "Date de Début", 
                      value: selectedReservation.Date_debut,
                      icon: <DateRangeIcon sx={{ color: "#1976d2" }} />,
                    },
                    {
                      label: "Heure de Début", 
                      value: selectedReservation.Heure_debut,
                      icon: <TimelapseIcon sx={{ color: "#1976d2" }} />,
                    },
                    {
                      label: "Date de Fin", 
                      value: selectedReservation.Date_retour,
                      icon: <DateRangeIcon sx={{ color: "#1976d2" }} />,
                    },
                    {
                      label: "Heure de Fin", 
                      value: selectedReservation.Heure_retour,
                      icon: <TimelapseIcon sx={{ color: "#1976d2" }} />,
                    },
                    {
                      label: "Durée de la Réservation", 
                      value: selectedReservation.Duree_location,
                      icon: <TimelapseIcon sx={{ color: "#1976d2" }} />,
                    },
                    {
                      label: "Prix total", 
                      value: selectedReservation.Prix_total,
                      icon: <AttachMoneyIcon sx={{ color: "#1976d2" }} />,
                    },
                  ].map((item, index) => (
                    <Grid item xs={6} key={index} display="flex" alignItems="center">
                      {item.icon}
                      <Typography 
                        variant="body1" 
                        sx={{ fontWeight: "bold", color: "#333", marginLeft: 1 }}
                      >
                        {item.label}:
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ color: "#983b3b", marginLeft: 1, fontWeight: item.label === "Date de Début:" || item.label === "Date de Fin:" ? "normal" : "bold" }}
                      >
                        {item.value || ""}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => handleAccept(selectedReservation)}
          variant="contained"
          sx={{
            bgcolor: "#4caf50",
            color: "white",
            fontWeight: "bold",
            '&:hover': { bgcolor: "#388e3c" },
            marginLeft: 1,
          }}
          startIcon={<CheckIcon />}
        >
          Accepter
        </Button>
        <Button
          onClick={() => handleReject(selectedReservation)}
          variant="contained"
          sx={{
            bgcolor: "#f44336",
            color: "white",
            fontWeight: "bold",
            '&:hover': { bgcolor: "#d32f2f" },
            marginLeft: 4,
          }}
          startIcon={<ClearIcon />}
        >
          Refuser
        </Button>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            bgcolor: "#1976d2",
            color: "#fff",
            fontWeight: "bold",
            marginLeft: 1,
            '&:hover': { bgcolor: "#1565c0" },
          }}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AfficherReservation;