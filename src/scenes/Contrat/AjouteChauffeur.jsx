import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Paper,
  CircularProgress,
  Typography,
  InputAdornment,
  Tooltip,
  IconButton,
  Box,
} from "@mui/material";
import {
  Person,
  Phone,
  Home,
  Description,
  CalendarToday,
  Close as CloseIcon,
  AddCircle as AddCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material"; // Import icons
import axios from "axios";
import Keyboard from "react-simple-keyboard"; // Assuming you have a keyboard component
import "react-simple-keyboard/build/css/index.css"; // Import keyboard styles

function AjouteChauffeur({
  open,
  handleClose,
  newChauffeur,
  setNewChauffeur,
  index,
  setNewChauffeurs,
  defaultContractNumber,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [isClosingKeyboard, setIsClosingKeyboard] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [localChauffeur, setLocalChauffeur] = useState({
    ...newChauffeur,
    Numero_contrat: defaultContractNumber, // Set the default contract number
  });

  useEffect(() => {
    setLocalChauffeur((prev) => ({
      ...prev,
      Numero_contrat: defaultContractNumber,
    }));
  }, [defaultContractNumber]); // Ensure to update if the defaultContractNumber changes

  useEffect(() => {
    if (keyboardOpen && focusedField) {
      // You would need to use refs or find the input element in some way
      // Here's a conceptual way - assuming you have a ref for input fields
      const inputElement = document.querySelector(
        `input[name=${focusedField}]`
      );
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [keyboardOpen, focusedField]);

  const handleChange = (field) => (event) => {
    let value = event.target.value;

    if (
      field === "nom_fr" ||
      field === "prenom_fr" ||
      field === "nom_ar" ||
      field === "prenom_ar" ||
      field === "profession_fr" ||
      field === "profession_ar"
    ) {
      value = value.replace(/[^a-zA-Z\s\u0600-\u06FF]/g, ""); // Allow latin and arabic letters
    } else if (field === "cin_chauffeur" || field === "num_tel") {
      value = value.replace(/[^0-9]/g, "").slice(0, 8);
    } else if (field === "numero_permis") {
      const regex = /^(\d{0,2})(\/\d{0,6})?$/;
      const match = value.match(regex);
      value = match ? match[0] : ""; // Keep only valid part
    }

    setLocalChauffeur((prev) => ({ ...prev, [field]: value }));
  };

  const addChauffeur = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = {
        Numero_contrat: localChauffeur.Numero_contrat,
        nom_fr: localChauffeur.nom_fr,
        nom_ar: localChauffeur.nom_ar,
        prenom_fr: localChauffeur.prenom_fr,
        prenom_ar: localChauffeur.prenom_ar,
        cin_chauffeur: localChauffeur.cin_chauffeur,
        date_cin_chauffeur: localChauffeur.date_cin_chauffeur,
        date_naiss: localChauffeur.date_naiss,
        adresse_fr: localChauffeur.adresse_fr,
        adresse_ar: localChauffeur.adresse_ar,
        num_tel: localChauffeur.num_tel,
        numero_permis: localChauffeur.numero_permis,
        date_permis: localChauffeur.date_permis,
        nationalite_origine: localChauffeur.nationalite_origine,
        profession_fr: localChauffeur.profession_fr,
        profession_ar: localChauffeur.profession_ar,
      };

      console.log("Data envoyée:", data);
      await axios.post("http://localhost:7001/chauffeur", data);
      setLoading(false);
      handleClose();

      if (index !== undefined) {
        setNewChauffeurs((prev) => {
          const updatedChauffeurs = { ...prev };
          delete updatedChauffeurs[index];
          return updatedChauffeurs;
        });
      }
      setNewChauffeur({});
    } catch (err) {
      setLoading(false);
      const errorMessage =
        err.response?.data?.message || "Erreur lors de l'ajout du chauffeur.";
      setError(errorMessage);
      console.error("Erreur lors de l'ajout du chauffeur:", err);
    }
  };

  const handleKeyboardClose = () => {
    console.log("Fermeture du clavier arabe");
    setIsClosingKeyboard(true);
    setKeyboardOpen(false);
    setFocusedField(null); // Clear focused field when keyboard closes

    setTimeout(() => {
      setIsClosingKeyboard(false);
    }, 300);
  };

  const onKeyPress = (button) => {
    if (focusedField) {
      // Use focusedField instead of activeField
      setLocalChauffeur((prev) => ({
        ...prev,
        [focusedField]: prev[focusedField] + button,
      }));
    }
  };

  const handleArabicFieldClick = (field) => {
    if (!keyboardOpen && !isClosingKeyboard) {
      console.log("Opening keyboard for field: ", field); // Debugging log
      setFocusedField(field);
      setKeyboardOpen(true);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            padding: "10px",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.3rem",
            fontWeight: "bold",
            textAlign: "center",
            color: "#d21919",
            marginBottom: 2,
          }}
        >
          Ajouter Chauffeur     Numéro de Contrat: {localChauffeur.Numero_contrat || "N/A"}
        </DialogTitle>
        <DialogContent sx={{ padding: 2 }}>
          <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
            <Grid item xs={12}>
              <h6
                style={{
                  margin: "0 0 15px 0",
                  color: "#0a115a",
                  fontWeight: "600",
                  fontSize: "1rem",
                  textAlign: "center",
                }}
              >
                Informations Personnelles
              </h6>
              
            </Grid>
            <Grid container spacing={2}>
              {[
                {
                  label: "Nom (FR)",
                  field: "nom_fr",
                  icon: <Person sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Nom (AR)",
                  field: "nom_ar",
                  arabic: true,
                  icon: <Person sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Prénom (FR)",
                  field: "prenom_fr",
                  icon: <Person sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Prénom (AR)",
                  field: "prenom_ar",
                  arabic: true,
                  icon: <Person sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Date de Naissance",
                  field: "date_naiss",
                  type: "date",
                  icon: <CalendarToday sx={{ color: "#1976d2" }} />,
                },
              ].map(({ label, field, type, icon, arabic }) => (
                <Grid item xs={12} sm={4} key={field}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label={label}
                    name={field}
                    value={localChauffeur[field] || ""}
                    onChange={handleChange(field)}
                    type={type || "text"}
                    InputLabelProps={type === "date" ? { shrink: true } : {}}
                    InputProps={{
                      style: { width: "250px", height: "40px" },
                      startAdornment: (
                        <InputAdornment position="start">{icon}</InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 1,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#1976d2" },
                        "&:hover fieldset": { borderColor: "#115293" },
                        "&.Mui-focused fieldset": { borderColor: "#0d47a1" },
                      },
                    }}
                    onFocus={() => arabic && handleArabicFieldClick(field)}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Identification Details Section */}
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <h6
                  style={{
                    margin: "0 0 15px 0",
                    color: "#0a115a",
                    fontWeight: "600",
                    fontSize: "1rem",
                    textAlign: "center",
                  }}
                >
                  Détails d'Identification
                </h6>
              </Grid>
              <Grid container spacing={2}>
                {[
                  {
                    label: "CIN chauffeur",
                    field: "cin_chauffeur",
                    icon: <Description sx={{ color: "#1976d2" }} />,
                  },
                  {
                    label: "Date CIN",
                    field: "date_cin_chauffeur",
                    type: "date",
                    icon: <CalendarToday sx={{ color: "#1976d2" }} />,
                  },
                  {
                    label: "Adresse (FR)",
                    field: "adresse_fr",
                    icon: <Home sx={{ color: "#1976d2" }} />,
                  },
                  {
                    label: "Adresse (AR)",
                    field: "adresse_ar",
                    arabic: true,
                    icon: <Home sx={{ color: "#1976d2" }} />,
                  },
                  {
                    label: "Numéro de Téléphone",
                    field: "num_tel",
                    icon: <Phone sx={{ color: "#1976d2" }} />,
                  },
                ].map(({ label, field, type, icon, arabic }) => (
                  <Grid item xs={12} sm={4} key={field}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label={label}
                      name={field}
                      value={localChauffeur[field] || ""}
                      onChange={handleChange(field)}
                      type={type || "text"}
                      InputLabelProps={type === "date" ? { shrink: true } : {}}
                      InputProps={{
                        style: { width: "250px", height: "40px" },
                        startAdornment: (
                          <InputAdornment position="start">
                            {icon}
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 1,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#1976d2" },
                          "&:hover fieldset": { borderColor: "#115293" },
                          "&.Mui-focused fieldset": { borderColor: "#0d47a1" },
                        },
                      }}
                      onFocus={() => arabic && handleArabicFieldClick(field)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Contact Information Section */}
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <h6
                  style={{
                    margin: "0 0 15px 0",
                    color: "#0a115a",
                    fontWeight: "600",
                    fontSize: "1rem",
                    textAlign: "center",
                  }}
                >
                  Informations de Contact
                </h6>
              </Grid>
              {[
                {
                  label: "Numéro de Permis",
                  field: "numero_permis",
                  icon: <Description sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Date de Permis",
                  field: "date_permis",
                  type: "date",
                  icon: <CalendarToday sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Profession (FR)",
                  field: "profession_fr",
                  icon: <Description sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Profession (AR)",
                  field: "profession_ar",
                  arabic: true,
                  icon: <Description sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Nationalité d'Origine",
                  field: "nationalite_origine",
                  icon: <Description sx={{ color: "#1976d2" }} />,
                },
              ].map(({ label, field, type, icon, arabic }) => (
                <Grid item xs={12} sm={4} key={field}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label={label}
                    name={field}
                    value={localChauffeur[field] || ""}
                    onChange={handleChange(field)}
                    type={type || "text"}
                    InputLabelProps={type === "date" ? { shrink: true } : {}}
                    InputProps={{
                      style: { width: "250px", height: "40px" },
                      startAdornment: (
                        <InputAdornment position="start">{icon}</InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 1,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#1976d2" },
                        "&:hover fieldset": { borderColor: "#115293" },
                        "&.Mui-focused fieldset": { borderColor: "#0d47a1" },
                      },
                    }}
                    onFocus={() => arabic && handleArabicFieldClick(field)}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ padding: 1, justifyContent: "flex-end" }}>
          <Button
            disabled={loading}
            onClick={addChauffeur}
            color="primary"
            variant="contained"
            startIcon={<AddCircleIcon />}
            sx={{
              bgcolor: "#1976d2",
              color: "white",
              px: 3,
              py: 1,
              "&:hover": { bgcolor: "#0d47a1" },
              transition: "background-color 0.3s ease",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Ajouter"
            )}
          </Button>
          <Button
            disabled={loading}
            onClick={handleClose}
            color="error"
            startIcon={<CancelIcon />}
            sx={{
              color: "#f44336",
              borderColor: "#f44336",
              "&:hover": { bgcolor: "#f44336", color: "white" },
              transition: "background-color 0.3s ease",
            }}
          >
            Annuler
          </Button>
        </DialogActions>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      </Dialog>
      <Dialog
        open={keyboardOpen}
        onClose={handleKeyboardClose}
        onClick={(e) => e.stopPropagation()}
        maxWidth="md"
        fullWidth
        sx={{ "& .MuiDialog-paper": { borderRadius: "12px" } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "1.5rem",
            fontWeight: "bold",
            bgcolor: "#1976d2",
            color: "white",
            padding: 1.5,
          }}
        >
          Clavier Arabe
          <Tooltip title="Fermer">
            <IconButton onClick={handleKeyboardClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              overflow: "auto",
            }}
          >
            <Keyboard
              layoutName="arabic"
              onKeyPress={onKeyPress}
              layout={{
                arabic: [
                  "ض ص ث ق ف غ ع ه خ ح ج د",
                  "ش س ي ب ل ا ت ن م ك ط",
                  "ئ ء ؤ ر لا ى ة و ز ظ",
                ],
              }}
              sx={{
                width: "100%",
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AjouteChauffeur;
