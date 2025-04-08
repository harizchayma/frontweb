import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  InputAdornment,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Cancel,
  Save,
  CalendarToday,
  MonetizationOn,
  AccountBalance,
  Payment,
  Edit,
  ConfirmationNumber,
} from "@mui/icons-material";
import axios from "axios";

function ModifierAvance({
  open,
  handleClose,
  avanceId,
  onAvanceModifiee,
  numeroAvance,
}) {
  const [avance, setAvance] = useState({
    cin_client: "",
    date: "",
    Numero_contrat: "",
  });

  const [detailAvance, setDetailAvance] = useState({
    id_detailAvance: "",
    Numero_avance: "",
    montant: "",
    banque: "",
    mode_reglement: "",
    echeance: "",
    NumeroPiece: "",
  });

  useEffect(() => {
    const fetchAvanceDetails = async () => {
      if (avanceId) {
        try {
          const response = await axios.get(
            `http://localhost:7001/avance/${avanceId}`
          );
          if (response.status >= 200 && response.status < 300) {
            setAvance(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching avance (GET):", error);
        }
      }
    };

    const fetchDetailAvance = async () => {
      if (numeroAvance) {
        try {
          const response = await axios.get(
            `http://localhost:7001/detailAvance/${numeroAvance}`
          );
          if (response.status >= 200 && response.status < 300) {
            setDetailAvance(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching detail avance:", error);
        }
      }
    };

    fetchAvanceDetails();
    fetchDetailAvance();
  }, [avanceId, numeroAvance]);

  const handleChange = (e) => {
    if (e.target.name in avance) {
      setAvance({ ...avance, [e.target.name]: e.target.value });
    } else {
      setDetailAvance({ ...detailAvance, [e.target.name]: e.target.value });
    }
  };

  const handleAdvanceSubmit = async () => {
    try {
      if (!avanceId) {
        throw new Error("ID d'avance manquant.");
      }

      // Update advance
      await axios.put(`http://localhost:7001/avance/${avanceId}`, avance);
      onAvanceModifiee(avance); // Notify parent of update
      handleClose(); // Close dialog
      console.log("Avance mise à jour.");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'avance :", error.message);
      if (error.response) {
        console.error("Détails de l'erreur du backend :", error.response.data);
        console.error("Code statut HTTP :", error.response.status);
      }
    }
  };

  const handleDetailSubmit = async () => {
    try {
      const detailAvanceId = detailAvance.id_detailAvance;
      if (!detailAvanceId) {
        throw new Error("ID du détail de l'avance manquant.");
      }
  
      // Exclure id_detailAvance des données à mettre à jour
      const { id_detailAvance, ...dataToUpdate } = detailAvance;
  
      // Log the detailAvance object before sending it to the API
      console.log("Détails d'avance à envoyer : ", dataToUpdate);
  
      // Update detail avance
      await axios.put(`http://localhost:7001/detailAvance/${detailAvanceId}`, dataToUpdate);
      console.log("Détails de l'avance mis à jour."); // Log successful update
    } catch (error) {
      console.error("Erreur lors de la mise à jour des détails d'avance :", error.message);
      if (error.response) {
        console.error("Détails de l'erreur du backend :", error.response.data);
        console.error("Code statut HTTP :", error.response.status);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          handleClose();
        }
      }}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "#f5f5f5",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center",
          color: "#d21919",
          marginBottom: 1,
        }}
      >
        <Edit sx={{ mr: 1 }} />
        Modifier Avance {numeroAvance}
      </DialogTitle>
      <DialogContent>
        <Typography
          variant="h5"
          sx={{
            marginBottom: 1,
            fontWeight: "bold",
            textAlign: "center",
            color: "#3949ab",
          }}
        >
          Numéro de Contrat: {avance.Numero_contrat}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            marginBottom: 1,
            fontWeight: "bold",
            textAlign: "center",
            color: "#3949ab",
          }}
        >
          CIN Client: {avance.cin_client}
        </Typography>

        <TextField
          label="Date Avance"
          type="date"
          name="date"
          value={avance.date}
          onChange={handleChange}
          fullWidth
          margin="dense"

          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarToday sx={{ color: "#1976d2" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            marginBottom: "0px",
          }}
        />

        {/* Accordion for detail avance */}
        <Accordion sx={{ marginTop: 1 }}>
          <AccordionSummary
            expandIcon={<Edit />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography>Détails de l'Avance</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              label="Échéance"
              type="date"
              name="echeance"
              value={detailAvance.echeance}
              onChange={handleChange}
              fullWidth
              margin="dense"

              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday sx={{ color: "#1976d2" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Mode de Règlement"
              name="mode_reglement"
              value={detailAvance.mode_reglement}
              onChange={handleChange}
              fullWidth
              margin="dense"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Payment sx={{ color: "#1976d2" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Montant"
              name="montant"
              value={detailAvance.montant}
              onChange={handleChange}
              fullWidth
              margin="dense"

              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MonetizationOn sx={{ color: "#1976d2" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Numéro de Pièce"
              name="NumeroPiece"
              value={detailAvance.NumeroPiece || ""}
              onChange={handleChange}
              fullWidth
              margin="dense"

              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ConfirmationNumber sx={{ color: "#1976d2" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Banque"
              name="banque"
              value={detailAvance.banque}
              onChange={handleChange}
              fullWidth
              margin="dense"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountBalance sx={{ color: "#1976d2" }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
          onClick={handleDetailSubmit}
          sx={{
            bgcolor: "#1976d2",
            color: "white",
            px: 2,
            py: 1,
            fontWeight: "bold",
            "&:hover": { bgcolor: "#1565c0" },
          }}
        >
          <Save sx={{ marginRight: 1 }} /> Modifier Détails
        </Button>
          </AccordionDetails>
        </Accordion>
      </DialogContent>
      <DialogActions>
        
        <Button
          onClick={handleAdvanceSubmit}
          sx={{
            bgcolor: "#1976d2",
            color: "white",
            px: 2,
            py: 1,
            fontWeight: "bold",
            "&:hover": { bgcolor: "#1565c0" },
          }}
        >
          <Save sx={{ marginRight: 0 }} /> Modifier Avance
        </Button>
        <Button
          onClick={handleClose}
          sx={{
            bgcolor: "#d32f2f",
            color: "white",
            px: 2,
            py: 1,
            fontWeight: "bold",
            "&:hover": { bgcolor: "#b71c1c" },
          }}
        >
          <Cancel sx={{ marginRight: 0 }} /> Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModifierAvance;