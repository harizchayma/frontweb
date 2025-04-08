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
import Detailavance from "../Avance/Detailavance";

function AvanceContratIcon({
  open,
  handleClose,
  defaultContractNumber,
  cinClient,
}) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailAvanceOpen, setDetailAvanceOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [avance, setAvance] = useState({
    Numero_contrat: "",
    Numero_avance: "",
    cin_client: cinClient || "",
    date: new Date().toISOString().split("T")[0],
  });
  const [detailAvance, setDetailAvance] = useState({
    montant: "",
    banque: "",
    mode_reglement: "",
    Numero_avance: "",
    echeance: "",
    NumeroPiece: "",
  });
  useEffect(() => {
    console.log("cinClient:", cinClient); // Debug
    setAvance((prev) => ({ ...prev, cin_client: cinClient || "" }));
  }, [cinClient]);

  const fetchLastNumeroAvance = async () => {
    try {
      const response = await axios.get("http://localhost:7001/avance/last");
      return response.data;
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
        setDetailAvance((prev) => ({
          ...prev,
          Numero_avance: newNumeroAvance,
        }));
      } else {
        setAvance((prev) => ({
          ...prev,
          Numero_avance: "V0001",
        }));
        setDetailAvance((prev) => ({
          ...prev,
          Numero_avance: "V0001",
        }));
      }
    };

    if (open) {
      initializeAvance();
    }
  }, [open]);

  const handleDetailAvanceClose = () => {
    setDetailAvanceOpen(false);
    setDetailAvance({
      montant: "",
      banque: "",
      mode_reglement: "",
      echeance: "",
      NumeroPiece: "",
      Numero_avance: avance.Numero_avance,
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
        echeance: detailAvance.echeance,
        NumeroPiece: detailAvance.NumeroPiece,
      };

      const response = await axios.post(
        "http://localhost:7001/detailAvance",
        detailToSend
      );

      if (response.status >= 200 && response.status < 300) {
        setSnackbarMessage("Détail d'avance ajouté avec succès !");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        handleDetailAvanceClose();
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

  const handleChangeDate = (e) => {
    setAvance((prev) => ({ ...prev, date: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Assurez-vous que le cin_client est défini
    if (!cinClient) {
      setSnackbarMessage("Le CIN du client ne peut pas être vide.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    const cinRegex = /^[A-Z0-9]+$/; // Exemple de regex pour valider le format
    if (!cinRegex.test(avance.cin_client)) {
      setSnackbarMessage("Le CIN du client est invalide.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    try {
      // Ajoutez le numéro de contrat à l'objet d'avance
      const avanceData = {
        ...avance,
        Numero_contrat: defaultContractNumber, // Ajout du numéro de contrat
      };

      console.log("Données envoyées à l'API pour ajout :", avanceData); // Vérifiez ce qui est envoyé

      const response = await axios.post(
        "http://localhost:7001/avance",
        avanceData
      );
      if (response.status >= 200 && response.status < 300) {
        setSuccessMessage("Avance ajoutée avec succès!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setDetailAvanceOpen(true);
        handleClose();
      } else {
        throw new Error(
          response.data?.message || "Erreur lors de l'ajout de l'avance."
        );
      }
    } catch (error) {
      // Gestion des erreurs
      setErrorMessage(
        error.response?.data?.message || "Erreur lors de l'ajout de l'avance."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            padding: "10px",
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
            marginBottom: 1,
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
            <Typography sx={{ mb: 2 }}>{defaultContractNumber}</Typography>

            <Typography variant="h5" sx={{ mb: 2, color: "#1976d2" }}>
              CIN Client
            </Typography>
            <TextField
              label="CIN Client"
              value={avance.cin_client}
              onChange={(e) =>
                setAvance((prev) => ({ ...prev, cin_client: e.target.value }))
              }
              required
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

export default AvanceContratIcon;
