import React, { useState, useEffect } from 'react';
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
  Divider,
} from "@mui/material";
import axios from 'axios';
import EventIcon from '@mui/icons-material/Event'; 
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'; 
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'; 
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'; 
import PaymentIcon from '@mui/icons-material/Payment'; 

function AfficherAvance({ open, handleClose, selectedAvance }) {
  const [selectedDetailAvance, setSelectedDetailAvance] = useState(null);

  useEffect(() => {
    const fetchDetailAvance = async () => {
      if (selectedAvance && selectedAvance.Numero_avance) {
        try {
          const response = await axios.get(`http://localhost:7001/detailAvance/${selectedAvance.Numero_avance}`);
          setSelectedDetailAvance(response.data.data || {});
        } catch (error) {
          console.error('Error fetching detail avance:', error);
          setSelectedDetailAvance({});
        }
      } else {
        setSelectedDetailAvance({});
      }
    };

    fetchDetailAvance();
  }, [selectedAvance]);

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
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
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
        Numéro Avance: {selectedAvance?.Numero_avance ? ` ${selectedAvance.Numero_avance}` : ""}
      </DialogTitle>
      <DialogContent sx={{ padding: 2 }}>
        {selectedAvance && (
          <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, padding: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                {[
                  {
                    label: "Numéro de Contrat",
                    value: (
                      <Typography variant="body1" sx={{ color: "red", fontWeight: '600' }}>
                        {selectedAvance.Numero_contrat}
                      </Typography>
                    ),
                    icon: <ConfirmationNumberIcon sx={{ color: "#1976d2" }} />
                  },
                  { 
                    label: "CIN Client", 
                    value: selectedAvance.cin_client, 
                    icon: <AccountBoxIcon sx={{ color: "#1976d2" }} /> 
                  },
                  { 
                    label: "Date", 
                    value: selectedAvance.date, 
                    icon: <EventIcon sx={{ color: "#1976d2" }} /> 
                  },
                 
                 
                ].map((item, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={6} container alignItems="center">
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {item.icon} {item.label}:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" sx={{ color: '#5c5a5a' }}>
                        {item.value || ""}
                      </Typography>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                {[ { 
                    label: "Échéance", 
                    value: selectedDetailAvance?.echeance || "", 
                    icon: <EventIcon sx={{ color: "#1976d2" }} /> 
                  },
                  { 
                    label: "Mode de règlement", 
                    value: selectedDetailAvance?.mode_reglement || "", 
                    icon: <PaymentIcon sx={{ color: "#1976d2" }} /> 
                  },
                  { 
                    label: "Montant", 
                    value: selectedDetailAvance?.montant || "", 
                    icon: <MonetizationOnIcon sx={{ color: "#1976d2" }} /> 
                  },
                  { 
                    label: "Numéro de Pièce", 
                    value: selectedDetailAvance?.NumeroPiece || "", 
                    icon: <ConfirmationNumberIcon sx={{ color: "#1976d2" }} /> 
                  },
                  { 
                    label: "Banque", 
                    value: selectedDetailAvance?.banque || "", 
                    icon: <AccountBalanceIcon sx={{ color: "#1976d2" }} /> 
                  },
                 
                ].map((item, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={6} container alignItems="center">
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {item.icon} {item.label}:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" sx={{ color: '#5c5a5a' }}>
                        {item.value || ""}
                      </Typography>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{ bgcolor: "#d32f2f", color: "white", fontWeight: "bold", '&:hover': { bgcolor: "#c62828" } }}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AfficherAvance;