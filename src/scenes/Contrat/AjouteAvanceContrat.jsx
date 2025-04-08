import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import DateIcon from "@mui/icons-material/CalendarToday";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import Detailavance from "../Avance/Detailavance"; // Assurez-vous d'importer le composant

function AjouteAvanceContrat({
  open,
  handleClose,
  defaultContractNumber,
  defaultCinClient,
}) {
  const [avance, setAvance] = useState({
    cin_client: defaultCinClient || "",
    date: "",
    Numero_contrat: defaultContractNumber || "",
    Numero_avance: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailAvanceOpen, setDetailAvanceOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Valeur par défaut ou 'error'
  const [detailAvance, setDetailAvance] = useState({
    montant: "", // ! Important: Ensure these fields have initial values
    banque: "",
    mode_reglement: "",
    Numero_avance: "", // This will be updated when the dialog opens
  });
  const fetchLastNumeroAvance = async () => {
    try {
      const response = await axios.get("http://localhost:7001/avance/last");
      return response.data; // Assurez-vous que cela correspond à la structure de votre réponse
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du dernier numéro d'avance:",
        error
      );
      return null;
    }
  };

  useEffect(() => {
    const initializeAvance = async () => {
      const lastNumeroAvance = await fetchLastNumeroAvance();
      if (lastNumeroAvance) {
        const lastNumber = parseInt(lastNumeroAvance.slice(1));
        const nextNumber = lastNumber + 1;
        const newNumeroAvance = `V${nextNumber.toString().padStart(4, "0")}`;
        setAvance((prev) => ({
          ...prev,
          Numero_avance: newNumeroAvance,
        }));
      } else {
        setAvance((prev) => ({
          ...prev,
          Numero_avance: "V0001",
        }));
      }
    };

    if (open) {
      initializeAvance();
    }
  }, [open]);

  const handleChangeDate = (event) => {
    setAvance((prev) => ({ ...prev, date: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (
      !avance.cin_client ||
      !avance.date ||
      !avance.Numero_contrat ||
      !avance.Numero_avance
    ) {
      setErrorMessage("Tous les champs (y compris le CIN) sont requis.");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:7001/avance", avance);
      setSuccessMessage("L'avance a été ajoutée avec succès.");

      // Ouvrir le composant Detailavance
      setDetailAvance((prev) => ({
        ...prev,
        Numero_avance: avance.Numero_avance, // Passer le numéro d'avance
        montant: "", // Réinitialiser le montant
        banque: "", // Réinitialiser la banque
        mode_reglement: "", // Réinitialiser le mode de règlement
      }));

      // Fermer le dialogue AjouteAvanceContrat
      handleClose(); // Ferme ce dialogue

      // Ouvrir le dialogue de détail d'avance
      setDetailAvanceOpen(true); // Ouvrir le dialogue de détail d'avance

      // Réinitialiser le formulaire
      setAvance({
        cin_client: "",
        date: "",
        Numero_contrat: defaultContractNumber || "",
        Numero_avance: "",
      });
    } catch (error) {
      setErrorMessage(
        "Une erreur est survenue lors de l'ajout de l'avance. Veuillez réessayer."
      );
      console.error(error);
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };
  const handleDetailAvanceClose = () => {
    setDetailAvanceOpen(false);
    // Si vous souhaitez également réinitialiser les valeurs
    setDetailAvance({
      montant: "",
      banque: "",
      mode_reglement: "",
      Numero_avance: "",
    });
  };

  const handleAddDetailAvance = async () => {
    try {
      if (
        !detailAvance.banque ||
        !detailAvance.mode_reglement ||
        !detailAvance.montant
      ) {
        setSnackbarMessage("Veuillez remplir tous les champs.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      const detailToSend = {
        Numero_avance: detailAvance.Numero_avance,
        montant: detailAvance.montant,
        banque: detailAvance.banque,
        mode_reglement: detailAvance.mode_reglement,
      };

      const response = await axios.post(
        "http://localhost:7001/detailAvance",
        detailToSend
      );

      if (response.status >= 200 && response.status < 300) {
        setSnackbarMessage("Détail d'avance ajouté avec succès !");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        handleDetailAvanceClose(); // Appel à la fermeture du dialogue
      } else {
        throw new Error(
          response.data?.message || "Erreur lors de l'ajout du détail d'avance."
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du détail d'avance:", error);
      setSnackbarMessage(
        error.response?.data?.message ||
          "Erreur lors de l'ajout du détail d'avance."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            handleClose(); // Only close on close button click
          }
        }}
        maxWidth="sm" // Make the dialog smaller
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            padding: "10px", // Reduced padding
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem", // Slightly smaller title font size
            fontWeight: "bold",
            textAlign: "center",
            color: "#d21919",
            marginBottom: 1, // Reduced margin
          }}
        >
          <EditIcon sx={{ mr: 1 }} />
          Ajouter une Avance - {avance.Numero_avance}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Typography variant="h5" sx={{ mb: 2, color: "#1976d2" }}>
              Numéro de Contrat
            </Typography>
            <Typography sx={{ mb: 2 }}>{avance.Numero_contrat}</Typography>

            <Typography variant="h5" sx={{ mb: 2, color: "#1976d2" }}>
              CIN Client
            </Typography>
            <TextField
              value={avance.cin_client}
              onChange={(e) =>
                setAvance((prev) => ({ ...prev, cin_client: e.target.value }))
              }
              required
              placeholder="Entrez le CIN"
              sx={{
                mb: 2,
                width: "250px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#1976d2" },
                  "&:hover fieldset": { borderColor: "#115293" },
                  "&.Mui-focused fieldset": { borderColor: "#0d47a1" },
                },
              }}
            />

            <Typography variant="h5" sx={{ color: "#1976d2" }}>
              Date
            </Typography>
            <TextField
              type="date"
              value={avance.date}
              onChange={handleChangeDate}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                width: "250px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#1976d2" },
                  "&:hover fieldset": { borderColor: "#115293" },
                  "&.Mui-focused fieldset": { borderColor: "#0d47a1" },
                },
              }}
            />
            <DialogActions>
              <Button
                type="submit"
                color="primary"
                sx={{
                  bgcolor: "#1976d2",
                  color: "white",
                  px: 3,
                  py: 1,
                  "&:hover": { bgcolor: "#1565c0" },
                }}
                disabled={loading}
                startIcon={<AddIcon />}
              >
                {loading ? "En cours..." : "Ajouter"}
              </Button>
              <Button
                onClick={handleClose}
                sx={{
                    bgcolor: "#d32f2f",
                    color: "white",
                    px: 3,
                    py: 1,
                    "&:hover": { bgcolor: "#b71c1c" },
                  }}
                startIcon={<CancelIcon />}
              >
                Annuler
              </Button>
            </DialogActions>
          </form>
        </DialogContent>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={errorMessage ? "error" : "success"}
          >
            {errorMessage || successMessage}
          </Alert>
        </Snackbar>
      </Dialog>

      <Detailavance
        open={detailAvanceOpen}
        onClose={() => setDetailAvanceOpen(false)}
        detailAvance={detailAvance}
        setDetailAvance={setDetailAvance}
        onAddDetailAvance={handleAddDetailAvance}
        defaultAdvanceNumber={avance.Numero_avance}
      />
    </>
  );
}

export default AjouteAvanceContrat;
