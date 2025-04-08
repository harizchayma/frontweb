import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Typography,
  InputAdornment,
} from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import BuildIcon from "@mui/icons-material/Build";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import SpeedIcon from "@mui/icons-material/Speed";
import PeopleIcon from "@mui/icons-material/People";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import DescriptionIcon from "@mui/icons-material/Description";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/Category";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddIcon from "@mui/icons-material/Add"; // Icon for adding vehicle
import CancelIcon from "@mui/icons-material/Cancel";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";

function AjouteVehicule({
  open,
  handleClose,
  newVehicle,
  setNewVehicle,
  categories,
  handleAddVehicle,
}) {
  const handleChange = (field) => (event) => {
    setNewVehicle({ ...newVehicle, [field]: event.target.value });
  };

  const marques = [
    "Alfa Romeo",
    "Audi",
    "BMW",
    "Citroën",
    "Dacia",
    "Fiat",
    "Mercedes-Benz",
    "Peugeot",
    "Renault",
    "Volkswagen",
    "Chery",
    "Hyundai",
    "Kia",
    "Nissan",
    "Suzuki",
    "Toyota",
    "Chevrolet",
    "Ford",
    "Jeep",
  ];

  const lieuxCertification = [
    "Tunis",
    "Sfax",
    "Sousse",
    "Gabès",
    "Bizerte",
    "Ariana",
    "Kairouan",
    "Gafsa",
    "Nabeul",
    "Monastir",
    "Mahdia",
    "Médenine",
    "Tozeur",
    "Kasserine",
    "Zarzis",
    "Hammamet",
    "Djerba",
    "Ben Arous",
    "Manouba",
  ];

  const energies = ["Essence", "Diesel", "Gaz", "Électrique", "Hybride"];

  const renderSelect = (label, field, options, icon) => (
    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={newVehicle[field] || ""}
        onChange={handleChange(field)}
        label={label}
        startAdornment={
          <InputAdornment position="start">{icon}</InputAdornment>
        }
        sx={{
          width: "250px",
          height: "40px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2", // Border color
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#115293", // Border color on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#0d47a1", // Border color when focused
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.id_categorie} value={option.id_categorie}>
            {option.catégorie} {/* Render the category name */}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          handleClose(); // Only close on close button click
        }
      }}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          padding: "0px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        },
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
        <AddIcon sx={{ mr: 1 }} />
        Ajouter un Véhicule
      </DialogTitle>

      <DialogContent sx={{ p: 1 }}>
        <Card variant="outlined" sx={{ boxShadow: 2, borderRadius: 2, p: 0.6 }}>
          <CardContent>
            {/* Identification du Véhicule Section */}
            <Typography
              variant="h6"
              style={{
                margin: "0 0 15px 0",
                color: "#1976d2",
                fontWeight: "600",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              Identification du Véhicule
            </Typography>
            <Grid container spacing={1}>
              {[
                {
                  label: "Numéro Immatriculation",
                  field: "num_immatriculation",
                  icon: <ConfirmationNumberIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Numéro de chassis",
                  field: "n_serie_du_type",
                  icon: <BuildIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Marque",
                  field: "marque",
                  isSelect: true,
                  options: marques,
                  icon: <DirectionsCarIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Modele",
                  field: "modele",
                  icon: <DeviceHubIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Prix par jour",
                  field: "prix_jour",
                  icon: <BuildIcon sx={{ color: "#1976d2" }} />,
                },
              ].map(({ label, field, isSelect, options, icon }) => (
                <Grid item xs={12} sm={4} key={field}>
                  {isSelect ? (
                    renderSelect(label, field, options, icon)
                  ) : (
                    <TextField
                      fullWidth
                      variant="outlined"
                      label={label}
                      value={newVehicle[field] || ""}
                      onChange={handleChange(field)}
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
                    />
                  )}
                </Grid>
              ))}
            </Grid>

            {/* Spécifications du Véhicule Section */}
            <Typography
              variant="h6"
              style={{
                margin: "0 0 15px 0",
                color: "#1976d2",
                fontWeight: "600",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              Spécifications du Véhicule
            </Typography>
            <Grid container spacing={1}>
              {[
                {
                  label: "Carrosserie",
                  field: "carrosserie",
                  icon: <BuildIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Énergie",
                  field: "energie",
                  isSelect: true,
                  options: energies,
                  icon: <LocalGasStationIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Puissance Fiscale",
                  field: "puissance_fiscale",
                  icon: <SpeedIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Nombre de Places",
                  field: "nbr_places",
                  icon: <PeopleIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Cylindrée",
                  field: "cylindree",
                  icon: (
                    <SettingsInputComponentIcon sx={{ color: "#1976d2" }} />
                  ),
                },
              ].map(({ label, field, isSelect, options, icon }) => (
                <Grid item xs={12} sm={4} key={field}>
                  {isSelect ? (
                    renderSelect(label, field, options, icon)
                  ) : (
                    <TextField
                      fullWidth
                      variant="outlined"
                      label={label}
                      value={newVehicle[field] || ""}
                      onChange={handleChange(field)}
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
                    />
                  )}
                </Grid>
              ))}
            </Grid>

            {/* Certification Section */}
            <Typography
              variant="h6"
              style={{
                margin: "0 0 15px 0",
                color: "#1976d2",
                fontWeight: "600",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              Certification
            </Typography>
            <Grid container spacing={1}>
              {[
                {
                  label: "Numéro Certificat",
                  field: "num_certificat",
                  icon: <DescriptionIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Lieu Certificat",
                  field: "lieu_certificat",
                  isSelect: true,
                  options: lieuxCertification,
                  icon: <LocationOnIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Date Certificat",
                  field: "date_certificat",
                  type: "date",
                  icon: <CalendarTodayIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Type Commercial",
                  field: "type_commercial",
                  icon: <DescriptionIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Catégorie",
                  field: "id_categorie",
                  isSelect: true,
                  options: categories,
                  icon: <CategoryIcon sx={{ color: "#1976d2" }} />,
                },
              ].map(({ label, field, isSelect, options, icon, type }) => (
                <Grid item xs={12} sm={4} key={field}>
                  {isSelect ? (
                    renderSelect(label, field, options, icon)
                  ) : (
                    <TextField
                      fullWidth
                      variant="outlined"
                      label={label}
                      type={type || "text"}
                      value={newVehicle[field] || ""}
                      onChange={handleChange(field)}
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
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions
        sx={{ p: 0.8, display: "flex", justifyContent: "flex-end" }}
      >
        <Button
          onClick={handleAddVehicle}
          variant="contained"
          sx={{
            bgcolor: "#1976d2",
            color: "white",
            px: 3,
            py: 1,
            "&:hover": { bgcolor: "#1565c0" },
          }}
          startIcon={<AddIcon />}
        >
          Ajouter
        </Button>
        <Button
          onClick={handleClose}
          variant="contained"
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
    </Dialog>
  );
}

export default AjouteVehicule;