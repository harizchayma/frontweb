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
  IconButton,
  Tooltip,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import DateRangeIcon from "@mui/icons-material/DateRange";
import DescriptionIcon from "@mui/icons-material/Description";
import WorkIcon from "@mui/icons-material/Work";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios"; // Import axios for API calls

function AjouteChauffeur({ open, handleClose, handleAddChauffeur }) {
  const [focusedField, setFocusedField] = useState(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [isClosingKeyboard, setIsClosingKeyboard] = useState(false);
  const [chauffeursByContract, setChauffeursByContract] = useState({});
  const [contracts, setContracts] = useState([]);
  const [newChauffeur, setNewChauffeur] = useState({
    Numero_contrat: "",
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
    profession_fr: "",
    profession_ar: "",
    nationalite_origine: "",
  });
  useEffect(() => {
    const fetchContractsAndChauffeurs = async () => {
      try {
        const response = await axios.get("http://localhost:7001/contrat");
        setContracts(response.data.data);

        // Récupérer les chauffeurs par contrat
        const chauffeursResponse = await axios.get("http://localhost:7001/chauffeur"); // Endpoint pour récupérer tous les chauffeurs
        const chauffeursData = chauffeursResponse.data.data;

        // Compter les chauffeurs par contrat
        const countByContract = {};
        chauffeursData.forEach((chauffeur) => {
          const { Numero_contrat } = chauffeur;
          countByContract[Numero_contrat] = (countByContract[Numero_contrat] || 0) + 1;
        });
        setChauffeursByContract(countByContract);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchContractsAndChauffeurs();
  }, []);

  // Observer pour les changements de newChauffeur
  useEffect(() => {
    console.log("Updated Chauffeur State:", newChauffeur);
  }, [newChauffeur]);

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
  
    setNewChauffeur((prev) => ({ ...prev, [field]: value })); // Remplacez setLocalChauffeur par setNewChauffeur
  };

  const handleContractChange = (event) => {
    const selectedContract = event.target.value;
    console.log("Selected contract:", selectedContract); // Vérifiez que cela imprime une valeur valide
    setNewChauffeur((prevState) => {
        const updatedState = {
            ...prevState,
            Numero_contrat: selectedContract, // mettez à jour avec la bonne valeur
        };
        console.log("Updated Chauffeur State:", updatedState); // Vérifiez les mises à jour
        return updatedState;
    });
};
  const onKeyPress = (button) => {
    if (focusedField) {
      setNewChauffeur({
        ...newChauffeur,
        [focusedField]: (newChauffeur[focusedField] || "") + button,
      });
    }
  };
  
  const validateFields = () => {
    const requiredFields = [
        "Numero_contrat",
        "nom_fr",
        "prenom_fr",
        "date_naiss",
        "cin_chauffeur",
        "numero_permis",
        "adresse_fr",
        "num_tel",
        "profession_fr",
        "nom_ar",
        "prenom_ar",
        "adresse_ar",
        "nationalite_origine",
    ];
    
    for (const field of requiredFields) {
        if (!newChauffeur[field]) {
            console.error(`${field} est un champ requis.`);
            return false;
        }
    }
  
    // Vérification des formats ou des longueurs spécifiques (ajoutez votre logique ici)
    if (newChauffeur.num_tel.length < 8) {
        console.error("Numéro de téléphone doit contenir au minimum 8 chiffres.");
        return false;
    }
  
    return true;
};
const addChauffeur = async () => {
    try {
        // Valider les champs obligatoires
        if (!validateFields()) {
            return; // Arrêtez l'exécution si la validation échoue
        }

        const selectedContract = newChauffeur.Numero_contrat;

        // Vérifiez si le contrat a déjà 3 chauffeurs
        const currentCount = chauffeursByContract[selectedContract] || 0;

        if (currentCount >= 3) {
            console.error("Ce contrat a déjà 3 chauffeurs.");
            alert("Ce contrat a déjà atteint le nombre maximal de 3 chauffeurs."); // Afficher une alerte
            return; 
        }

        // Vérifiez que le numéro de contrat est défini
        if (!selectedContract) {
            console.error("Le numéro de contrat est requis.");
            alert("Le numéro de contrat est requis.");
            return; // Arrêtez l'exécution si aucune valeur n'est fournie
        }

        // Validation pour s'assurer que le numéro de contrat est valide
        if (!contracts.some(contract => contract.Numero_contrat === selectedContract)) {
            console.error("Le numéro de contrat sélectionné n'est pas valide.");
            alert("Le numéro de contrat sélectionné n'est pas valide.");
            return; // Arrêtez l'exécution si le numéro de contrat est invalide
        }

        // Vérification de la longueur du CIN
        if (newChauffeur.cin_chauffeur.length !== 8) {
            console.error("Le CIN doit contenir exactement 8 caractères.");
            alert("Le CIN doit contenir exactement 8 caractères.");
            return; // Arrêtez l'exécution si la validation échoue
        }

        const chauffeurData = {
            nom_fr: newChauffeur.nom_fr,
            prenom_fr: newChauffeur.prenom_fr,
            cin_chauffeur: newChauffeur.cin_chauffeur,
            date_cin_chauffeur: newChauffeur.date_cin_chauffeur,
            date_naiss: newChauffeur.date_naiss,
            adresse_fr: newChauffeur.adresse_fr,
            num_tel: newChauffeur.num_tel,
            numero_permis: newChauffeur.numero_permis,
            date_permis: newChauffeur.date_permis,
            profession_fr: newChauffeur.profession_fr,
            nom_ar: newChauffeur.nom_ar,
            prenom_ar: newChauffeur.prenom_ar,
            adresse_ar: newChauffeur.adresse_ar,
            nationalite_origine: newChauffeur.nationalite_origine,
            Numero_contrat: selectedContract
        };

        console.log("Données envoyées:", chauffeurData);
        
        // Envoi des données au serveur
        const response = await axios.post("http://localhost:7001/chauffeur", chauffeurData);
        
        console.log("Chauffeur ajouté avec succès:", response.data);
        
        // Mettre à jour les chauffeurs par contrat
        setChauffeursByContract(prevState => ({
            ...prevState,
            [selectedContract]: currentCount + 1 // Incrémenter le compteur pour ce contrat
        }));
        
        // Réinitialiser le formulaire ou mettre à jour les états si nécessaire
        handleAddChauffeur(); // Mettez à jour la liste ou fermez la boîte de dialogue
    } catch (error) {
        console.error("Erreur lors de l'ajout du chauffeur:", error);
        if (error.response) {
            console.error("Erreur du serveur:", error.response.data);
            console.log("Détails de l'erreur:", error.response.data.details);
        } else {
            alert("Une erreur est survenue lors de l'ajout du chauffeur. Veuillez réessayer.");
        }
    }
};
  const handleArabicFieldClick = (field) => {
    if (!keyboardOpen && !isClosingKeyboard) {
      setFocusedField(field);
      setKeyboardOpen(true);
    }
  };

  const handleKeyboardClose = () => {
    setIsClosingKeyboard(true);
    setKeyboardOpen(false);
    setFocusedField(null);

    setTimeout(() => {
      setIsClosingKeyboard(false);
    }, 300);
  };

  return (
    <>
      <Dialog
        open={open}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            padding: "2px",
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
            fontSize: "1.5rem",
            fontWeight: "bold",
            textAlign: "center",
            color: "#d21919",
            marginBottom: 2,
          }}
        >
          <AddCircleIcon sx={{ mr: 1 }} />
          Ajouter un Chauffeur
        </DialogTitle>

        <DialogContent sx={{ padding: 2 }}>
          <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
            {/* Informations Personnelles */}
            <Grid container spacing={2}>
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
              <Grid item xs={12} sm={4}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="contract-select-label">
                    Numéro de Contrat
                  </InputLabel>
                  <Select
                    labelId="contract-select-label"
                    value={newChauffeur.Numero_contrat || ""}
                    onChange={handleContractChange}
                    label="Numéro de Contrat"
                    inputProps={{
                      style: { height: "20px" }, // Ajustez la hauteur ici
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#1976d2" },
                        "&:hover fieldset": { borderColor: "#115293" },
                        "&.Mui-focused fieldset": { borderColor: "#0d47a1" },
                      },
                    }}
                  >
                    {contracts.map((contract) => (
                      <MenuItem
                        key={contract.ID_contrat}
                        value={contract.Numero_contrat}
                      >
                        {contract.Numero_contrat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {[
                {
                  label: "Nom (FR)",
                  field: "nom_fr",
                  icon: <PersonIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Nom (AR)",
                  field: "nom_ar",
                  arabic: true,
                  icon: <PersonIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Date de Naissance",
                  field: "date_naiss",
                  type: "date",
                  icon: <DateRangeIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Prénom (FR)",
                  field: "prenom_fr",
                  icon: <PersonIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Prénom (AR)",
                  field: "prenom_ar",
                  arabic: true,
                  icon: <PersonIcon sx={{ color: "#1976d2" }} />,
                },
              ].map(({ label, field, type, arabic, icon }) => (
                <Grid item xs={12} sm={4} key={field}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label={label}
                    value={newChauffeur[field] || ""}
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
            {/* Détails d'Identification */}
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
              {[
                {
                  label: "CIN",
                  field: "cin_chauffeur",
                  icon: <DescriptionIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Numéro de Permis",
                  field: "numero_permis",
                  icon: <DescriptionIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Date de Permis",
                  field: "date_permis",
                  type: "date",
                  icon: <DateRangeIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Date CIN",
                  field: "date_cin_chauffeur",
                  type: "date",
                  icon: <DateRangeIcon sx={{ color: "#1976d2" }} />,
                },
              ].map(({ label, field, type, icon }) => (
                <Grid item xs={12} sm={4} key={field}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label={label}
                    value={newChauffeur[field] || ""}
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
                  />
                </Grid>
              ))}
            </Grid>
            {/* Informations de Contact */}
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
                  label: "Adresse (FR)",
                  field: "adresse_fr",
                  icon: <HomeIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Adresse (AR)",
                  field: "adresse_ar",
                  arabic: true,
                  icon: <HomeIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Numéro de Téléphone",
                  field: "num_tel",
                  icon: <PhoneIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Profession (FR)",
                  field: "profession_fr",
                  icon: <WorkIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Profession (AR)",
                  field: "profession_ar",
                  arabic: true,
                  icon: <WorkIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Nationalité d'Origine",
                  field: "nationalite_origine",
                  icon: <DescriptionIcon sx={{ color: "#1976d2" }} />,
                },
              ].map(({ label, field, type, arabic, icon }) => (
                <Grid item xs={12} sm={4} key={field}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label={label}
                    value={newChauffeur[field] || ""}
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
            onClick={addChauffeur} // Changer ici
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            sx={{
              bgcolor: "#1976d2",
              color: "white",
              px: 2,
              py: 1,
              "&:hover": { bgcolor: "#0d47a1" },
              transition: "background-color 0.3s ease",
            }}
          >
            Ajouter
          </Button>
          <Button
            onClick={handleClose}
            variant="outlined"
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
