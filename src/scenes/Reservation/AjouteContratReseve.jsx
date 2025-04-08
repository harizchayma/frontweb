import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Snackbar,
  InputAdornment,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";
import {
  AccountCircle,
  CalendarToday,
  Close as CloseIcon,
  DirectionsCar,
  AttachMoney,
  CheckCircle,
} from "@mui/icons-material";
import axios from "axios";
import PropTypes from "prop-types";
import ArrowBack from "@mui/icons-material/ArrowBack";

const steps = [
  {
    label: "Informations Client",
    icon: <AccountCircle sx={{ color: "#1976d2" }} />,
  },
  {
    label: "Sélectionner Temps et Date",
    icon: <CalendarToday sx={{ color: "#1976d2" }} />,
  },
  {
    label: "Informations sur le Véhicule",
    icon: <DirectionsCar sx={{ color: "#1976d2" }} />,
  },
  { label: "Prix Total", icon: <AttachMoney sx={{ color: "#1976d2" }} /> },
  {
    label: "Informations de Garantie",
    icon: <CheckCircle sx={{ color: "#1976d2" }} />,
  },
];
const stepLabelStyle = (index, activeStep) => {
  console.log("Index in style:", index, "Active Step:", activeStep); // Add this line
  return {
    color: activeStep === index ? "red" : "#1976d2",
    fontWeight: activeStep === index ? "normal" : "bold"
  };
};

const AjouteContratReseve = ({ open, handleClose, selectedReservation, activeStep }) => {
  const [localActiveStep, setLocalActiveStep] = useState(activeStep || 0);
  const [errorMessage, setErrorMessage] = useState("");
  const [clientInfo, setClientInfo] = useState({
    cin_client: "",
    firstName: "",
    lastName: "",
  });
  const [newContract, setNewContract] = useState({
    Date_debut: "",
    Heure_debut: "",
    Date_retour: "",
    Heure_retour: "",
    num_immatriculation: "",
    Duree_location: "",
    prix_jour: 0,
    fraisCarburat: 0,
    fraisRetour: 0,
    fraisChauffeur: 0,
    prix_ht: 0,
    Prix_total: 0,
    id_reservation: ""
  });

  const [duration, setDuration] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [vehicleSelectionError, setVehicleSelectionError] = useState("");
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [contractNumber, setContractNumber] = useState("");

  const pad = (num) => String(num).padStart(2, "0");

  const toDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr || !timeStr.includes(":")) return new Date();
    const [hours, minutes] = timeStr.split(":").map((val) => pad(val));
    return new Date(`${dateStr}T${hours}:${minutes}`);
  };

  useEffect(() => {
    if (activeStep) {
      setLocalActiveStep(activeStep);
    }

    if (selectedReservation) {
      setClientInfo({
        cin_client: selectedReservation.cin_client || "",
        firstName: selectedReservation.prenom_fr || "",
        lastName: selectedReservation.nom_fr || "",
      });
      setNewContract({
        Date_debut: selectedReservation.Date_debut || "",
        Heure_debut: selectedReservation.Heure_debut || "",
        Date_retour: selectedReservation.Date_retour || "",
        Heure_retour: selectedReservation.Heure_retour || "",
        num_immatriculation: selectedReservation.num_immatriculation || "",
        Duree_location: "",
        prix_jour: 0,
        id_reservation: selectedReservation.id_reservation || "",
      });
      setSelectedVehicle(
        selectedReservation.num_immatriculation
          ? {
              num_immatriculation: selectedReservation.num_immatriculation,
            }
          : null
      );

      if (selectedReservation.num_immatriculation) {
        fetch(
          `http://localhost:7001/vehicules?num_immatriculation=${selectedReservation.num_immatriculation}`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.data && data.data.length > 0) {
              setNewContract((prev) => ({
                ...prev,
                prix_jour: data.data[0].prix_jour,
              }));
            }
          })
          .catch((error) =>
            console.error(
              "Erreur lors de la récupération du prix du véhicule :",
              error
            )
          );
      }
    }
  }, [selectedReservation, activeStep]);

  const calculateDureeLocation = () => {
    const debut = toDateTime(newContract.Date_debut, newContract.Heure_debut);
    const retour = toDateTime(
      newContract.Date_retour,
      newContract.Heure_retour
    );
    const diffInMs = retour - debut;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays > 0 ? diffInDays : 1;
  };

  useEffect(() => {
    if (
      localActiveStep === 2 &&
      newContract.Date_debut &&
      newContract.Heure_debut &&
      newContract.Date_retour &&
      newContract.Heure_retour
    ) {
      fetchAvailableVehicles();
    }
  }, [localActiveStep, newContract]);

  const fetchAvailableVehicles = async () => {
    try {
      const [vehiclesRes, contractsRes] = await Promise.all([
        fetch("http://localhost:7001/vehicules"),
        fetch(`http://localhost:7001/contrat?startDate=${newContract.Date_debut}&endDate=${newContract.Date_retour}`)
      ]);
  
      if (!vehiclesRes.ok || !contractsRes.ok) {
        throw new Error("Échec de récupération des données depuis l'API.");
      }
  
      const [vehiclesData, contractsData] = await Promise.all([
        vehiclesRes.json(),
        contractsRes.json()
      ]);
  
      if (!vehiclesData.data || !contractsData.data) {
        throw new Error("Données invalides reçues de l'API.");
      }
  
      const searchStart = toDateTime(newContract.Date_debut, newContract.Heure_debut);
      const searchEnd = toDateTime(newContract.Date_retour, newContract.Heure_retour);
  
      const booked = contractsData.data
        .filter((contract) => {
          const contractStart = contract.dataValues
            ? toDateTime(contract.dataValues.Date_debut, contract.dataValues.Heure_debut)
            : null;
          const contractEnd = contract.dataValues
            ? toDateTime(contract.dataValues.Date_retour, contract.dataValues.Heure_retour)
            : null;
  
          if (!contractStart || !contractEnd) {
            console.warn("Contrat avec données manquantes :", contract);
            return false;
          }
  
          // Vérifie si le contrat se chevauche avec les dates recherchées
          return !(
            contractEnd <= searchStart || contractStart >= searchEnd
          );
        })
        .map((c) => c.dataValues.num_immatriculation); // Extraction des véhicules réservés
  
      const available = vehiclesData.data.filter(
        (v) => !booked.includes(v.num_immatriculation) // Filtrage des véhicules disponibles
      );
  
      if (available.length === 0) {
        setVehicleSelectionError("Les véhicules de cette réservation sont indisponibles."); // Alerte si aucun véhicule n'est disponible
        setSnackbarMessage("Aucun véhicule disponible pour cette période.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } else {
        setVehicleSelectionError(""); // Aucune erreur de sélection de véhicule
      }
  
      setAvailableVehicles(available); // Met à jour la liste des véhicules disponibles
    } catch (err) {
      console.error("Erreur:", err.message);
      setErrorMessage("Erreur lors de la récupération des véhicules.");
      setSnackbarMessage("Erreur lors de la récupération des véhicules.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleVehicleSelection = (e) => {
    const selectedId = parseInt(e.target.value);
    const vehicle = availableVehicles.find((v) => v.id_vehicule === selectedId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setNewContract((prev) => ({
        ...prev,
        num_immatriculation: vehicle.num_immatriculation,
        prix_jour: vehicle.prix_jour,
      }));
      setVehicleSelectionError("");
    }
  };

  useEffect(() => {
    const prixHT = newContract.prix_jour * duration;
    setNewContract((prev) => ({
      ...prev,
      prix_ht: prixHT,
    }));
  }, [newContract.prix_jour, duration]);

  const handleChange = (name, value) => {
    setNewContract((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (localActiveStep === 0 && !clientInfo.cin_client) {
      setErrorMessage("Veuillez entrer un CIN valide.");
      return;
    }
    if (
      localActiveStep === 1 &&
      (!newContract.Date_debut ||
        !newContract.Heure_debut ||
        !newContract.Date_retour ||
        !newContract.Heure_retour)
    ) {
      setErrorMessage("Veuillez remplir tous les champs de date/heure.");
      return;
    }
    if (localActiveStep === 2 && !selectedVehicle) {
      setSnackbarMessage("Veuillez sélectionner un véhicule avant de continuer.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return; // Ne pas ouvrir la case 3
    } else if (localActiveStep === 2 && selectedVehicle) {
      setLocalActiveStep((prev) => prev + 1);
    } else {
      setSnackbarMessage("Veuillez sélectionner un véhicule avant de continuer.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  const handleBack = () => {
    setLocalActiveStep((prev) => prev - 1);
  };

  const calculateTotalPrice = () => {
    const fraisCarburat = Number(newContract.fraisCarburat) || 0;
    const fraisRetour = Number(newContract.fraisRetour) || 0;
    const fraisChauffeur = Number(newContract.fraisChauffeur) || 0;

    const totalFees = fraisCarburat + fraisRetour + fraisChauffeur;
    const prixHT = (newContract.prix_jour || 0) * (duration || 1); 
    const totalPrice = (prixHT + totalFees) * 1.19; 

    return totalPrice;
  };

  const handleSubmit = async () => {
    try {
        const prixTotal = calculateTotalPrice();
        const contractData = {
            ...newContract,
            cin_client: clientInfo.cin_client,
            Duree_location: duration,
            Prix_total: prixTotal,
            frais_carburant: Number(newContract.fraisCarburat) || 0,
            frais_retour: Number(newContract.fraisRetour) || 0,
            frais_chauffeur: Number(newContract.fraisChauffeur) || 0,
        };

        contractData.id_reservation = newContract.id_reservation;

        console.log("Données à soumettre :", contractData);

        await axios.post("http://localhost:7001/contrat", contractData);

        // Change the reservation status to accepted
        await axios.patch(
            `http://localhost:7001/reservation/${newContract.id_reservation}/action`,
            { action: "accepte" }
        );

        handleClose();
        setSnackbarMessage("Contrat ajouté avec succès et réservation acceptée!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
    } catch (err) {
        console.error(err.response?.data || err.message);
        setSnackbarMessage("Erreur lors de la création du contrat.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
    }
};
  const fetchLastContractNumber = async () => {
    try {
      const response = await axios.get("http://localhost:7001/contrat/last");
      if (response.data && response.data.data) {
        const lastNumber = response.data.data;
        const prefix = lastNumber.slice(0, 2); 
        const numericPart = parseInt(lastNumber.slice(2), 10);
        const nextNumericPart = numericPart + 1;
        const nextContractNumber = `${prefix}${String(nextNumericPart).padStart(4, '0')}`;
        setContractNumber(nextContractNumber);
      } else {
        setContractNumber("AC0001");
        console.warn("No last contract number found, setting default.");
      }
    } catch (error) {
      console.error("Error fetching last contract number:", error);
      setContractNumber("AC0001");
    }
  };

  useEffect(() => {
    fetchLastContractNumber();
  }, []);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <TextField
            fullWidth
            label="CIN Client"
            value={clientInfo.cin_client}
            onChange={(e) =>
              setClientInfo({ ...clientInfo, cin_client: e.target.value })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle sx={{ color: "#1976d2" }} />
                </InputAdornment>
              ),
            }}
            disabled
          />
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Date Début"
                type="date"
                value={newContract.Date_debut}
                onChange={(e) => handleChange("Date_debut", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Heure Début"
                type="time"
                value={newContract.Heure_debut}
                onChange={(e) => handleChange("Heure_debut", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Date Retour"
                type="date"
                value={newContract.Date_retour}
                onChange={(e) => handleChange("Date_retour", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Heure Retour"
                type="time"
                value={newContract.Heure_retour}
                onChange={(e) => handleChange("Heure_retour", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ color: "#f0112b" }}>
                Durée de location : {duration} jours
              </Typography>
            </Grid>
            {errorMessage && (
              <Typography color="error">{errorMessage}</Typography>
            )}
          </Grid>
        );

      case 2:
        return (
          <RadioGroup
            name="vehicle-selection"
            value={selectedVehicle?.num_immatriculation || ""}
            onChange={handleVehicleSelection}
          >
            <Grid container spacing={2}>
              {availableVehicles.length ? (
                availableVehicles.map((v) => (
                  <Grid item xs={12} sm={4} key={v.id_vehicule}>
                    <Paper
                      elevation={3}
                      sx={{
                        padding: 2,
                        borderRadius: 2,
                        transition: "0.3s",
                        "&:hover": { boxShadow: 7 },
                        minHeight: "150px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        textAlign: "left",
                      }}
                    >
                      <FormControlLabel
                        value={v.id_vehicule.toString()}
                        control={<Radio sx={{ color: "#1976d2" }} />}
                        label={
                          <>
                            <Typography
                              variant="h6"
                              sx={{ color: "#f0112b", fontWeight: "bold" }}
                            >
                              {v.num_immatriculation}
                            </Typography>
                            <Typography variant="body1">
                              Modèle: {v.modele}
                            </Typography>
                            <Typography variant="body1">
                              Marque: {v.marque}
                            </Typography>
                            <Typography variant="body1">
                              Prix par jour: {v.prix_jour} dt
                            </Typography>
                          </>
                        }
                        checked={
                          selectedVehicle?.num_immatriculation ===
                          v.num_immatriculation
                        }
                      />
                    </Paper>
                  </Grid>
                ))
              ) : (
                <Typography color="error" sx={{ mt: 2 }}>
                  Aucun véhicule disponible
                </Typography>
              )}
            </Grid>
            {vehicleSelectionError && (
              <Typography color="error">{vehicleSelectionError}</Typography>
            )}
          </RadioGroup>
        );

      case 3:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Prix par jour"
                value={newContract.prix_jour || 0}
                onChange={(e) =>
                  handleChange("prix_jour", parseFloat(e.target.value) || 0)
                }
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Prix HT"
                value={newContract.prix_ht ? newContract.prix_ht.toFixed(2) : 0}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ padding: 1.5, borderRadius: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ marginBottom: 1, color: "#1976d2" }}
                >
                  Frais
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Frais carburant"
                      value={newContract.fraisCarburat || 0}
                      onChange={(e) =>
                        handleChange(
                          "fraisCarburat",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoney sx={{ color: "#1976d2" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Frais retour"
                      value={newContract.fraisRetour || 0}
                      onChange={(e) =>
                        handleChange(
                          "fraisRetour",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoney sx={{ color: "#1976d2" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Frais chauffeur"
                      value={newContract.fraisChauffeur || 0}
                      onChange={(e) =>
                        handleChange(
                          "fraisChauffeur",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoney sx={{ color: "#1976d2" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h3"
                sx={{
                  textAlign: "center",
                  color: "#f0112b",
                  fontWeight: "bold",
                }}
              >
                Prix Total TTC: {calculateTotalPrice().toFixed(2)} dt
              </Typography>
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                variant="outlined"
                label="Mode de règlement garantie"
                value={newContract.mode_reglement_garantie || ""}
                onChange={(e) =>
                  handleChange("mode_reglement_garantie", e.target.value)
                }
                displayEmpty
                sx={{
                  mb: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#1976d2" },
                    "&:hover fieldset": { borderColor: "#115293" },
                    "&.Mui-focused fieldset": { borderColor: "#0d47a1" },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle sx={{ color: "#1976d2" }} />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="" disabled>
                  Sélectionner un mode de règlement
                </MenuItem>
                <MenuItem value="virement_bancaire">Virement bancaire</MenuItem>
                <MenuItem value="cheque">Chèque</MenuItem>
                <MenuItem value="carte_bancaire">Carte bancaire</MenuItem>
                <MenuItem value="especes">Espèces</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Montant"
                name="montant"
                value={newContract.montant || ""}
                onChange={(e) => handleChange("montant", e.target.value)}
                type="text"
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Échéance"
                name="echeance"
                value={newContract.echeance || ""}
                type="date"
                onChange={(e) => handleChange("echeance", e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  mb: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#1976d2" },
                    "&:hover fieldset": { borderColor: "#115293" },
                    "&.Mui-focused fieldset": { borderColor: "#0d47a1" },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday sx={{ color: "#1976d2" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Numéro de pièce"
                name="numero_piece"
                value={newContract.numero_piece || ""}
                onChange={(e) => handleChange("numero_piece", e.target.value)}
                sx={{
                  mb: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#1976d2" },
                    "&:hover fieldset": { borderColor: "#115293" },
                    "&.Mui-focused fieldset": { borderColor: "#0d47a1" },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney sx={{ color: "#1976d2" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                variant="outlined"
                label="Banque"
                value={newContract.banque || ""}
                onChange={(e) => handleChange("banque", e.target.value)}
                displayEmpty
                sx={{
                  mb: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#1976d2" },
                    "&:hover fieldset": { borderColor: "#115293" },
                    "&.Mui-focused fieldset": { borderColor: "#0d47a1" },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle sx={{ color: "#1976d2" }} />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="" disabled>
                  Sélectionner une banque
                </MenuItem>
                {/* Fill in with your available banks */}
              </Select>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          handleClose(); // Utiliser la fonction de fermeture
        }
      }}
      fullWidth
      maxWidth="md"
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
          color: "#1976d2",
          marginBottom: 1,
        }}
      >
        Ajouter un Contrat
        <CloseIcon
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 20,
            cursor: "pointer",
            color: "#f0112b",
          }}
        />
        <Typography
          variant="h4"
          align="center"
          sx={{ marginBottom: 1, color: "#f0112b" }}
        >
          [Numéro de Contrat: {contractNumber || "N/A"}]
        </Typography>
        <Typography
          variant="h4"
          align="center"
          sx={{ marginBottom: 1, color: "#f011cb" }}
        >
          [Numéro de Réservation: R{selectedReservation?.id_reservation || "N/A"}]
        </Typography>
      </DialogTitle>
      <Typography
        variant="h5"
        align="center"
        sx={{
          marginBottom: 1,
          color: "#00a86b",
          fontWeight: "normal",
          fontSize: "1rem",
        }}
      >
        <Typography component="span">Durée de Location:</Typography>
        <Typography component="span" sx={{ fontWeight: "bold" }}>
          {` ${duration} jours`}
        </Typography>
        {"  "}
        <span>Numéro d'immatriculation:</span>
        {selectedVehicle ? (
          <Typography component="span" sx={{ fontWeight: "bold" }}>
            {` (${selectedVehicle.num_immatriculation})`}
          </Typography>
        ) : null}
      </Typography>
      
     
      <DialogContent>
        <Stepper
          activeStep={localActiveStep}
          alternativeLabel
          sx={{ marginBottom: 3 }}
        >
          {steps.map(({ label, icon }, index) => {
    console.log("Index in map:", index); // Add this line
    return (
      <Step key={label}>
        <StepLabel icon={icon}
          sx={{ "& .MuiStepLabel-label": stepLabelStyle(index, localActiveStep) }}>{label}</StepLabel>
      </Step>
    );
  })}
        </Stepper>
        {renderStepContent(localActiveStep)}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleBack}
          disabled={localActiveStep === 0}
          variant="outlined"
          color="primary"
          sx={{ borderRadius: "20px", marginRight: 1 }}
          startIcon={<ArrowBack />}
        >
          Retour
        </Button>
        <Button
          onClick={localActiveStep === steps.length - 1 ? handleSubmit : handleNext}
          color="primary"
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#155a8a" },
            borderRadius: "20px",
          }}
        >
          {localActiveStep === steps.length - 1 ? "Valider" : "Suivant"}
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

AjouteContratReseve.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedReservation: PropTypes.shape({
    cin_client: PropTypes.string,
    prenom_fr: PropTypes.string,
    nom_fr: PropTypes.string,
    Date_debut: PropTypes.string,
    Heure_debut: PropTypes.string,
    Date_retour: PropTypes.string,
    Heure_retour: PropTypes.string,
    id_reservation: PropTypes.number,
  }),
};

export default AjouteContratReseve;