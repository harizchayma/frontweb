import React, { useState, useEffect } from "react"; // Ensure useState is included
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Snackbar,
  CircularProgress,
  Select,
  MenuItem,
  InputAdornment,
  ListItemIcon,
  Box,
} from "@mui/material";
import { fr } from "date-fns/locale";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  DateRange,
  DirectionsCar,
  CheckCircle,
  AccountCircle,
  MonetizationOn,
  LocalShipping,
  AttachMoney,
  Person,
  CalendarToday, // Assurez-vous que cette ligne est présente
  Description,
  AccountBalance,
} from "@mui/icons-material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import AjouteClient from "../Client/AjouteClient";
import YourComponent from "./YourComponent";
import ClientSearchBar from "../Client/ClientSearchBar";
import AllOutIcon from "@mui/icons-material/AllOut";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useAuth } from "../context/AuthContext";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";

const steps = [
  {
    label: "Informations Client",
    icon: <AccountCircle sx={{ color: "#1976d2" }} />,
  },
  {
    label: "Sélectionner Temps et Date",
    icon: <DateRange sx={{ color: "#1976d2" }} />,
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

const AjouteContrat = ({
  open,
  handleClose,
  newContract,
  setNewContract,
  handleAddContract,
  availableVehicles,
}) => {
  const initialContractState = () => ({
    Date_debut: "",
    Heure_debut: "",
    Date_retour: "",
    Heure_retour: "",
    Duree_location: "",
    Prolongation: "",
    Numero_contrat: "",
    num_immatriculation: "",
    cin_client: "",
    Prix_total: "",
    mode_reglement_garantie: "",
    montant: "",
    echeance: "",
    numero_piece: "",
    banque: "",
    frais_retour: "",
    frais_carburant: "",
    frais_chauffeur: "",
  });
  const { role } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [openYourComponent, setOpenYourComponent] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [clientInfo, setClientInfo] = useState({ cin_client: "" });
  const [clientExists, setClientExists] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleCategories, setVehicleCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [clientDetails, setClientDetails] = useState({
    firstName: "",
    lastName: "",
  });
  const [openAddClientDialog, setOpenAddClientDialog] = useState(false);
  const [customPricePerDay, setCustomPricePerDay] = useState(0);
  const [vehicleSelectionError, setVehicleSelectionError] = useState("");
  const [newClient, setNewClient] = useState({
    nom_fr: "",
    nom_ar: "",
    prenom_fr: "",
    prenom_ar: "",
    cin_client: "",
    date_cin: "",
    date_naiss: "",
    adresse_fr: "",
    adresse_ar: "",
    num_tel: "",
    Numero_Permis: "",
    date_permis: "",
    profession_fr: "",
    profession_ar: "",
    nationalite_origine: "",
  });

  const availableBanks = [
    "Banque de Tunisie",
    "Banque Nationale Agricole",
    "Banque Zitouna",
    "Banque de l'Habitat",
    "Attijari Bank",
    "Amen Bank",
    "Arab Tunisian Bank",
    "Société Tunisienne de Banque",
    "Liste des Banques",
  ];

  const [montantError, setMontantError] = useState("");
  const [modeReglementError, setModeReglementError] = useState("");
  const [fraisCarburat, setFraisCarburat] = useState(0);
  const [fraisRetour, setFraisRetour] = useState(0);
  const [fraisChauffeur, setFraisChauffeur] = useState(0);
  const [modeReglement, setModeReglement] = useState("");
  const [vehicleSearchQuery, setVehicleSearchQuery] = useState("");
  const [showClientList, setShowClientList] = useState(false);
  const getDaysBetweenDates = (startDate, endDate) => {
    if (!startDate || !endDate) {
      return 0;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      return 0;
    }

    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const duration = getDaysBetweenDates(
    newContract.Date_debut,
    newContract.Date_retour
  );
  const stepLabelStyle = (index) => {
    if (activeStep === index) {
      return {
        color: "red",
        fontWeight: "bold",
      };
    } else {
      return {
        color: "#1976d2",
        fontWeight: "normal",
      };
    }
  };

  const handleCloseDialog = () => {
    setIsConfirmationOpen(true); // Open confirmation dialog
  };

  const handleConfirmClose = () => {
    setIsConfirmationOpen(false); // Close confirmation dialog
    // Reset the newContract state and any other relevant states
    setNewContract(initialContractState()); // Reset to initial state
    setClientInfo({ cin_client: "" }); // Reset client info
    setClientExists(false); // Reset client existence flag
    setSelectedVehicle(null); // Reset selected vehicle
    setCustomPricePerDay(0); // Reset custom price
    setActiveStep(0); // Reset to the first step
    handleClose(); // Close the main dialog
  };

  const handleCancelClose = () => {
    setIsConfirmationOpen(false); // Close confirmation dialog without closing the main dialog
  };

  const handleVehicleSelection = (event) => {
    const selectedId = parseInt(event.target.value);
    const selected = availableVehicles.find(
      (vehicle) => vehicle.id_vehicule === selectedId
    );

    if (selected) {
      setSelectedVehicle(selected);
      setCustomPricePerDay(selected.prix_jour);
      setNewContract((prev) => ({
        ...prev,
        num_immatriculation: selected.num_immatriculation,
      }));

      const { totalHT, totalPrice } = calculateTotalPrice();
      setNewContract((prev) => ({
        ...prev,
        prix_ht: totalHT,
        Prix_total: totalPrice,
      }));
    }
  };
  const yourCloseHandler = () => {
    setOpenYourComponent(false);
    handleClose(); // Ferme aussi AjouteContrat
  };
  const filteredVehicles = availableVehicles.filter((vehicle) => {
    const matchesSearchQuery =
      vehicle.num_immatriculation
        .toLowerCase()
        .includes(vehicleSearchQuery.toLowerCase()) ||
      vehicle.modele.toLowerCase().includes(vehicleSearchQuery.toLowerCase()) ||
      vehicle.marque.toLowerCase().includes(vehicleSearchQuery.toLowerCase());

    const matchesCategory = selectedCategory
      ? selectedCategory === "all" || vehicle.id_categorie === selectedCategory // Check if "all" is selected
      : true; // If no category is selected, return all

    return matchesSearchQuery && matchesCategory;
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:7001/categorie");
        console.log("Fetched Categories:", response.data.data); // Debugging line
        setVehicleCategories(response.data.data || []);
      } catch (error) {
        console.error("Error fetching vehicle categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddClient = async () => {
    try {
      await axios.post("http://localhost:7001/client", newClient);
      setOpenAddClientDialog(false);
      setNewClient({
        nom_fr: "",
        nom_ar: "",
        prenom_fr: "",
        prenom_ar: "",
        cin_client: "",
        date_cin: "",
        date_naiss: "",
        adresse_fr: "",
        adresse_ar: "",
        num_tel: "",
        Numero_Permis: "",
        date_permis: "",
        profession_fr: "",
        profession_ar: "",
        nationalite_origine: "",
      });
      await handleCINChange({ target: { value: clientInfo.cin_client } });
    } catch (error) {
      console.error("Error adding client", error);
    }
  };

  const handleCINChange = async (e) => {
    const cin_client = e.target.value; // Use cin_client instead of cin
    setClientInfo({ ...clientInfo, cin_client }); // Update the cin_client in clientInfo
    setClientExists(false);
    setClientDetails({ firstName: "", lastName: "" });
    setErrorMessage("");
    console.log("CIN Client Input:", cin_client); // Debugging line
    if (cin_client.length === 8) {
      try {
        const response = await axios.get(
          `http://localhost:7001/client?cin_client=${cin_client}`
        );
        const clients = response.data.data;
        const client = clients.find(
          (client) => client.cin_client === cin_client
        );

        if (client) {
          setClientExists(true);
          setClientDetails({
            firstName: client.prenom_fr,
            lastName: client.nom_fr,
          });
        } else {
          setClientExists(false);
          setErrorMessage("Aucun client trouvé avec ce CIN.");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du CIN:", error);
        setErrorMessage("Erreur lors de la vérification du CIN.");
      }
    } else if (cin_client.length > 0 && cin_client.length !== 8) {
      setErrorMessage("Le CIN doit contenir exactement 8 caractères.");
    }
  };

  const handleAddClientClick = () => {
    setOpenAddClientDialog(true);
  };

  const handleChange = (name, value) => {
    // Update the newContract state with the new value
    setNewContract((prev) => ({ ...prev, [name]: value }));

    // Handle specific fields with additional logic
    if (name === "customPricePerDay") {
      setCustomPricePerDay(value);
    }

    if (name === "mode_reglement_garantie") {
      setModeReglement(value);
      if (!value) {
        setModeReglementError("Le mode de règlement est requis.");
      } else {
        setModeReglementError("");
      }
    }

    if (name === "montant") {
      if (isNaN(value) || value <= 0) {
        setMontantError("Le montant doit être un nombre positif.");
      } else {
        setMontantError("");
      }
    }

    // Handle time inputs for Heure_debut and Heure_retour
    if (name === "Heure_debut" || name === "Heure_retour") {
      // Validate time input format (HH:MM)
      const timeParts = value.split(":");
      if (timeParts.length === 2 && timeParts.every((part) => !isNaN(part))) {
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
          // Set the valid time
          setNewContract((prev) => ({ ...prev, [name]: value }));
        } else {
          console.error(
            "Invalid time format: hours must be 0-23 and minutes must be 0-59"
          );
        }
      } else {
        console.error("Invalid time format");
      }
    }

    // Handle additional fields for fees
    if (name === "frais_carburant") {
      setFraisCarburat(parseFloat(value) || 0);
    } else if (name === "frais_retour") {
      setFraisRetour(parseFloat(value) || 0);
    } else if (name === "frais_chauffeur") {
      setFraisChauffeur(parseFloat(value) || 0);
    }
  };

  const calculateTotalPrice = () => {
    if (
      !selectedVehicle ||
      !newContract.Date_debut ||
      !newContract.Date_retour
    ) {
      return { totalHT: 0, totalPrice: 0 };
    }

    const duration = getDaysBetweenDates(
      newContract.Date_debut,
      newContract.Date_retour
    );
    const pricePerDay = customPricePerDay; // Utiliser le prix par jour personnalisé
    const totalHT = duration * pricePerDay;

    // Calculer totalFrais en utilisant les variables d'état
    const totalFrais = fraisCarburat + fraisRetour + fraisChauffeur;

    const totalPrice = (totalHT + totalFrais) * 1.19; // Supposons une taxe de 19%
    return { totalHT, totalPrice };
  };

  useEffect(() => {
    if (activeStep === 3 && selectedVehicle) {
      const { totalHT, totalPrice } = calculateTotalPrice();
      setNewContract((prev) => ({
        ...prev,
        cin_client: clientInfo.cin_client,
        prix_ht: totalHT,
        Prix_total: totalPrice,
      }));
    }
  }, [
    activeStep,
    selectedVehicle,
    newContract.Date_debut,
    newContract.Date_retour,
    fraisCarburat,
    fraisRetour,
    fraisChauffeur,
    clientInfo.cin_client,
    customPricePerDay,
  ]);

  const handleNext = () => {
    // Step 0: Validate client information
    if (activeStep === 0) {
      if (!clientExists || !clientInfo.cin_client) {
        setErrorMessage("Veuillez sélectionner un client.");
        return;
      }
    }

    // Step 1: Validate dates
    if (activeStep === 1) {
      if (!newContract.Date_debut || !newContract.Date_retour) {
        setErrorMessage("Veuillez remplir tous les champs de date.");
        return;
      }

      const today = new Date();
      const selectedStartDate = new Date(newContract.Date_debut);
      const selectedEndDate = new Date(newContract.Date_retour);

      if (selectedStartDate < today) {
        setErrorMessage("La date de début ne peut pas être dans le passé.");
        return;
      }

      if (selectedEndDate < selectedStartDate) {
        setErrorMessage("La date de retour doit être après la date de début.");
        return;
      }
    }

    // Step 2: Validate vehicle selection
    if (activeStep === 2) {
      if (!selectedVehicle) {
        setVehicleSelectionError("Veuillez sélectionner un véhicule.");
        return;
      } else {
        setVehicleSelectionError(""); // Clear error if vehicle is selected
      }
    }

    setActiveStep((prev) => prev + 1); // Move to the next step
  };

  const handleAddContractAndRedirect = async () => {
    setLoading(true);
    try {
      // Attempt to add the contract with the provided data
      await handleAddContract(newContract, clientInfo, customPricePerDay);

      // Open YourComponent only upon successful addition of the contract
      setOpenYourComponent(true);
    } catch (error) {
      console.error("Erreur lors de l'ajout du contrat:", error);
      setErrorMessage("Erreur lors de l'ajout du contrat. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderStepContent = (step) => {
    const duration = getDaysBetweenDates(
      newContract.Date_debut,
      newContract.Date_retour
    );
    const totalHT = duration * customPricePerDay;
    const totalFrais = fraisCarburat + fraisRetour + fraisChauffeur;
    const totalPrice = (totalHT + totalFrais) * 1.19;

    switch (step) {
      case 0:
        return (
          <Grid container spacing={4}>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center", mb: 1 }}
            >
              <ClientSearchBar
                onClientSelect={(client) => {
                  // Update client details and existence status
                  setClientDetails({
                    firstName: client.prenom_fr,
                    lastName: client.nom_fr,
                  });
                  setClientExists(true);
                  setClientInfo({ cin_client: client.cin_client });

                  // Close the client search list
                  setShowClientList(false);
                }}
                onClose={() => setShowClientList(false)} // Close the client list explicitly
              />
            </Grid>

            <Grid container item xs={12} spacing={2} alignItems="center">
              <Grid
                item
                xs={12}
                sm={5}
                container
                justifyContent="flex-end"
                alignItems="center"
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  label="CIN Client"
                  name="cin_client"
                  value={clientInfo.cin_client || ""}
                  onChange={handleCINChange}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#007bff" },
                      "&:hover fieldset": { borderColor: "#0056b3" },
                      "&.Mui-focused fieldset": { borderColor: "#004080" },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#007bff",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#004080",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle sx={{ color: "#007bff" }} />
                      </InputAdornment>
                    ),
                  }}
                />
                {role === "admin" && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddClientClick}
                    sx={{
                      marginLeft: 2, // Space between input and button
                      borderRadius: "25px",
                      padding: "12px 28px",
                      backgroundColor: "#007bff",
                      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                      "&:hover": {
                        backgroundColor: "#0069d9",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                        transform: "scale(1.05)",
                        transition: "0.2s",
                      },
                    }}
                  >
                    Ajouter Client
                  </Button>
                )}
              </Grid>

              {clientExists && (
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={8}
                    sx={{
                      padding: 4,
                      borderRadius: 10,
                      backgroundColor: "#ffffff",
                      marginBottom: 2,
                      boxShadow: "0px 12px 24px rgba(96, 166, 219, 0.62)",
                    }}
                  >
                    {/* Container for Avatar and Name */}
                    <Grid container alignItems="center">
                      {/* Avatar Display */}
                      <Grid item>
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            marginRight: 3,
                            backgroundColor: "#007bff", // Set background color to blue
                            color: "#ffffff", // Set text color to white for better contrast
                          }}
                        >
                          {`${clientDetails.lastName.charAt(
                            0
                          )}${clientDetails.firstName.charAt(0)}`.toUpperCase()}
                        </Avatar>
                      </Grid>

                      {/* Client Name Display */}
                      <Grid item>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: "bold",
                            color: "#3985e9",
                            marginBottom: 1,
                          }}
                        >
                          Client Trouvé
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "600", color: "#34495e", mb: 1 }}
                        >
                          <strong>Nom: </strong>
                          <span style={{ color: "#ec2e4e", fontWeight: "800" }}>
                            {clientDetails.lastName}
                          </span>
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "600", color: "#34495e" }}
                        >
                          <strong>Prénom: </strong>
                          <span style={{ color: "#ec2e4e", fontWeight: "800" }}>
                            {clientDetails.firstName}
                          </span>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              )}
            </Grid>

            {/* Display error message if no client is found for the entered CIN */}
            {!clientExists && clientInfo.cin_client.length > 0 && (
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  color="error"
                  sx={{ fontWeight: "bold", textAlign: "center", mt: 1 }}
                >
                  Aucun client trouvé. Veuillez ajouter un nouveau client.
                </Typography>
              </Grid>
            )}
          </Grid>
        );
      case 1:
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={fr}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date Début"
                  name="Date_debut"
                  type="date"
                  value={newContract.Date_debut || ""}
                  onChange={(e) => handleChange("Date_debut", e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{ bgcolor: "#f5f5f5", borderRadius: 1 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  // Change this line in your renderStepContent function
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: "#1976d2" }} />{" "}
                        {/* Use CalendarToday instead of CalendarTodayIcon */}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Heure Début"
                  name="Heure_debut"
                  type="time" // Ensure this is set to time
                  value={newContract.Heure_debut || ""}
                  onChange={(e) => handleChange("Heure_debut", e.target.value)}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date Retour"
                  name="Date_retour"
                  type="date"
                  value={newContract.Date_retour || ""}
                  onChange={(e) => handleChange("Date_retour", e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{ bgcolor: "#f5f5f5", borderRadius: 1 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  // Change this line in your renderStepContent function
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: "#1976d2" }} />{" "}
                        {/* Use CalendarToday instead of CalendarTodayIcon */}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Heure Retour"
                  name="Heure_retour"
                  type="time"
                  value={newContract.Heure_retour || ""}
                  onChange={(e) => handleChange("Heure_retour", e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{ bgcolor: "#f5f5f5", borderRadius: 1 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5" sx={{ color: "#f0112b" }}>
                  Durée de location : {duration} jours
                </Typography>
              </Grid>
            </Grid>
          </LocalizationProvider>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            {/* Vehicle Category Selection */}
            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                variant="outlined"
                label="Catégorie de véhicule"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setVehicleSearchQuery(""); // Clear search when changing the category
                }}
                displayEmpty
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#1976d2" },
                    "&:hover fieldset": { borderColor: "#115293" },
                    "&.Mui-focused fieldset": { borderColor: "#0d47a1" },
                  },
                }}
              >
                <MenuItem
                  value=""
                  disabled
                  sx={{ fontWeight: "bold", color: "#f60000" }}
                >
                  <ListItemIcon>
                    <AllOutIcon fontSize="small" />
                  </ListItemIcon>
                  Sélectionner une catégorie
                </MenuItem>
                <MenuItem
                  value="all"
                  sx={{ fontWeight: "normal", color: "#1976d2" }}
                >
                  <ListItemIcon>
                    <AllOutIcon fontSize="small" />
                  </ListItemIcon>
                  Tous les catégories
                </MenuItem>
                {vehicleCategories.length > 0 &&
                  vehicleCategories.map((category) => (
                    <MenuItem
                      key={category.id_categorie}
                      value={category.id_categorie}
                    >
                      <ListItemIcon>
                        <DirectionsCarIcon
                          sx={{ fontSize: "small", color: "#1976d2" }}
                        />
                      </ListItemIcon>
                      {category.catégorie}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>

            {/* Vehicle Search Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Rechercher un véhicule"
                value={vehicleSearchQuery}
                onChange={(e) => setVehicleSearchQuery(e.target.value)}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#1976d2" },
                    "&:hover fieldset": { borderColor: "#115293" },
                    "&.Mui-focused fieldset": { borderColor: "#0d47a1" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Liste des véhicules disponibles
              </Typography>
              <RadioGroup
                aria-label="vehicle-selection"
                name="vehicle-selection"
                value={
                  selectedVehicle ? selectedVehicle.id_vehicule.toString() : ""
                }
                onChange={handleVehicleSelection}
              >
                <Grid container spacing={2} justifyContent="center">
                  {filteredVehicles.length > 0 ? (
                    filteredVehicles.map((vehicle) => (
                      <Grid item xs={12} sm={4} key={vehicle.id_vehicule}>
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
                            value={vehicle.id_vehicule.toString()}
                            control={<Radio sx={{ color: "#1976d2" }} />}
                            label={
                              <>
                                <Typography
                                  variant="h6"
                                  sx={{ color: "#f0112b", fontWeight: "bold" }}
                                >
                                  {vehicle.num_immatriculation}
                                </Typography>
                                <Typography variant="body1">
                                  Modèle: {vehicle.modele}
                                </Typography>
                                <Typography variant="body1">
                                  Marque: {vehicle.marque}
                                </Typography>
                                <Typography variant="body1">
                                  Prix par jour: {vehicle.prix_jour} dt
                                </Typography>
                              </>
                            }
                          />
                        </Paper>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Typography variant="h6" color="error" align="center">
                        Aucun véhicule disponible
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </RadioGroup>
              {/* Display vehicle selection error if it exists */}
              {vehicleSelectionError && (
                <Typography variant="body1" color="error">
                  {vehicleSelectionError}
                </Typography>
              )}
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Prix par jour"
                value={customPricePerDay}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value) || 0;
                  setCustomPricePerDay(newValue);
                  setNewContract((prev) => ({ ...prev, prix_jour: newValue }));
                  const updatedTotalHT = duration * newValue; // Recalculer en fonction de la nouvelle valeur
                  const updatedTotalPrice =
                    (updatedTotalHT +
                      fraisCarburat +
                      fraisRetour +
                      fraisChauffeur) *
                    1.19;
                  setNewContract((prev) => ({
                    ...prev,
                    prix_ht: updatedTotalHT,
                    Prix_total: updatedTotalPrice,
                  }));
                }}
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MonetizationOn sx={{ color: "#1976d2" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 0,
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
                label="Prix HT"
                value={newContract.prix_ht ? newContract.prix_ht.toFixed(2) : 0}
                disabled // Rendre le champ en lecture seule
              />
            </Grid>

            {/* Groupe pour les frais */}
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
                      value={fraisCarburat}
                      onChange={(e) =>
                        handleChange("frais_carburant", e.target.value)
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
                      value={fraisRetour}
                      onChange={(e) =>
                        handleChange("frais_retour", e.target.value)
                      }
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocalShipping sx={{ color: "#1976d2" }} />
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
                      value={fraisChauffeur}
                      onChange={(e) =>
                        handleChange("frais_chauffeur", e.target.value)
                      }
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: "#1976d2" }} />
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
                  textAlign: "center", // Centrer le texte
                  color: "#f0112b", // Couleur rouge
                  fontWeight: "bold", // Optionnel : rendre le texte en gras
                }}
              >
                Prix Total TTC:{" "}
                {newContract.Prix_total ? newContract.Prix_total.toFixed(2) : 0}{" "}
                dt
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
                    "&: hover fieldset": { borderColor: "#115293" },
                    "&.Mui-focused fieldset": { borderColor: "#0d47a1" },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalance sx={{ color: "#1976d2" }} />
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
              {modeReglementError && (
                <Typography color="error">{modeReglementError}</Typography>
              )}
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
                error={Boolean(montantError)}
                helperText={montantError}
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
                      <Description sx={{ color: "#1976d2" }} />
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
                      <AccountBalance sx={{ color: "#1976d2" }} />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="" disabled>
                  Sélectionner une banque
                </MenuItem>
                {availableBanks.map((bank, index) => (
                  <MenuItem key={index} value={bank}>
                    {bank}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            handleCloseDialog(); // Call our new close method
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
            onClick={handleCloseDialog} // Call the method to open confirmation dialog
            sx={{
              position: "absolute",
              right: 20,
              cursor: "pointer",
              color: "#f0112b",
            }}
          />{" "}
          <Typography
            variant="h4"
            align="center"
            sx={{ marginBottom: 1, color: "#f0112b" }}
          >
            [Numéro de Contrat: {newContract.Numero_contrat || "N/A"}]
          </Typography>
        </DialogTitle>
        <Typography
          variant="h5"
          align="center"
          sx={{
            marginBottom: 1, // Increase bottom margin for better spacing
            color: "#00a86b", // Change color to a shade of pinkish-purple
            fontWeight: "normal", // Set font weight to normal
            fontSize: "1rem", // Font size set to 1rem
          }}
        >
          <Typography component="span">Durée de Location:</Typography>
          <Typography component="span" sx={{ fontWeight: "bold" }}>
            {` ${duration} jours`}{" "}
            {/* Added space before duration for readability */}
          </Typography>
          {"  "}
          <span>Numéro d'immatriculation:</span>
          {selectedVehicle ? (
            <Typography component="span" sx={{ fontWeight: "bold" }}>
              {` (${selectedVehicle.num_immatriculation})`}
            </Typography>
          ) : null}
        </Typography>
        <DialogContent sx={{ padding: 3 }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{ marginBottom: 3 }}
          >
            {steps.map(({ label, icon }, index) => (
              <Step key={label}>
                <StepLabel
                  icon={icon}
                  sx={{ "& .MuiStepLabel-label": stepLabelStyle(index) }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          {renderStepContent(activeStep)}
          {errorMessage && (
            <Typography color="error" sx={{ fontWeight: "bold", marginTop: 2 }}>
              {errorMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: 1, justifyContent: "space-between" }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            variant="outlined"
            color="primary"
            sx={{ borderRadius: "20px", marginRight: 1 }}
            startIcon={<ArrowBack />} // Icône pour le bouton Retour
          >
            Retour
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            onClick={
              activeStep === steps.length - 1
                ? handleAddContractAndRedirect
                : handleNext
            }
            color="primary"
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#155a8a" },
              borderRadius: "20px",
            }}
            disabled={
              loading ||
              (activeStep === 0 && (!clientExists || !clientInfo.cin_client)) || // Assurez-vous qu'un client valide est sélectionné
              (activeStep === 2 && !selectedVehicle) || // Assurez-vous qu'un véhicule est sélectionné avant de continuer
              (activeStep === 3 && (montantError || modeReglementError))
            }
            endIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <ArrowForward />
              )
            } // Icône pour le bouton Suivant
          >
            {loading
              ? "Chargement..."
              : activeStep === steps.length - 1
              ? "Valide"
              : "Suivant"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isConfirmationOpen} onClose={handleCancelClose}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir annuler? Toutes les données non
            enregistrées seront perdues.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose} color="primary">
            Retour
          </Button>
          <Button onClick={handleConfirmClose} color="error">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
      />
      <AjouteClient
        open={openAddClientDialog}
        handleClose={() => setOpenAddClientDialog(false)}
        newClient={newClient}
        setNewClient={setNewClient}
        handleAddClient={handleAddClient}
      />
      <YourComponent
        open={openYourComponent}
        handleClose={yourCloseHandler}
        contractNumber={newContract.Numero_contrat} // Pass the current contract number
        cinClient={clientInfo.cin_client} // Pass the client's CIN here
      />
    </LocalizationProvider>
  );
};

AjouteContrat.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  newContract: PropTypes.object.isRequired,
  setNewContract: PropTypes.func.isRequired,
  handleAddContract: PropTypes.func.isRequired,
  availableVehicles: PropTypes.array.isRequired,
};

export default AjouteContrat;
