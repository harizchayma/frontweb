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
  InputAdornment,
  IconButton,
  Box,
  CircularProgress, // Assurez-vous d'importer CircularProgress ici
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
} from "@mui/icons-material";
import axios from "axios";
import Keyboard from "react-simple-keyboard";

function AjouteChauffeurIcon({
  open,
  handleClose,
  defaultContractNumber,
  onChauffeurAdded,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [localChauffeur, setLocalChauffeur] = useState({
    Numero_contrat: defaultContractNumber || "",
    nom_fr: "",
    nom_ar: "",
    prenom_fr: "",
    prenom_ar: "",
    cin_chauffeur: "",
    date_cin_chauffeur: "",
    date_naiss: "",
    adresse_fr: "",
    adresse_ar: "",
    num_tel: "",
    numero_permis: "",
    date_permis: "",
    nationalite_origine: "",
    profession_fr: "",
    profession_ar: "",
  });

  useEffect(() => {
    setLocalChauffeur((prev) => ({
      ...prev,
      Numero_contrat: defaultContractNumber || "",
    }));
  }, [defaultContractNumber]);

  const [keyboardOpen, setKeyboardOpen] = useState(false);

  // Fonction pour gérer les frappes sur le clavier
  const onKeyPress = (button) => {
    const updatedValue = localChauffeur[cursorField] + button; // Append the pressed button text to the existing value of the field
    setLocalChauffeur((prev) => ({
      ...prev,
      [cursorField]: updatedValue,
    })); // Update the relevant field
  };

  const handleChange = (field) => (event) => {
    setLocalChauffeur((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const addChauffeur = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = {
        ...localChauffeur,
      };
      await axios.post("http://localhost:7001/chauffeur", data);
      setLoading(false);
      onChauffeurAdded(); // Appeler la prop pour notifier le parent que le chauffeur a été ajouté
      handleClose(); // Fermer le dialogue après l'ajout
    } catch (err) {
      setLoading(false);
      const errorMessage =
        err.response?.data?.message || "Erreur lors de l'ajout du chauffeur.";
      setError(errorMessage);
    }
  };

  const handleKeyboardClose = () => {
    setKeyboardOpen(false);
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
          Ajouter Chauffeur - {localChauffeur.Numero_contrat || "Non défini"}
          <IconButton
            onClick={handleClose}
            style={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
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
      </Dialog>

      {/* Clavier Arabe Dialog */}
      <Dialog
        open={keyboardOpen}
        onClose={handleKeyboardClose}
        onClick={(e) => e.stopPropagation()}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Clavier Arabe
          <IconButton onClick={handleKeyboardClose}>
            <CloseIcon />
          </IconButton>
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
              onKeyPress={onKeyPress} // Utilisez la fonction ici
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

export default AjouteChauffeurIcon;
