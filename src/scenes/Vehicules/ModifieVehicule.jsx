import React, { useState } from "react";
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
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber"; // Numéro Immatriculation
import BuildIcon from "@mui/icons-material/Build"; // Numéro de chassis
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation"; // Énergie
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"; // Marque
import CarRepairIcon from "@mui/icons-material/CarRepair"; // Carrosserie
import SpeedIcon from "@mui/icons-material/Speed"; // Puissance Fiscale
import PeopleIcon from "@mui/icons-material/People"; // Nombre de Places
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent"; // Cylindrée
import DescriptionIcon from "@mui/icons-material/Description"; // Numéro Certificat
import LocationOnIcon from "@mui/icons-material/LocationOn"; // Lieu Certificat
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"; // Date Certificat
import CategoryIcon from "@mui/icons-material/Category"; // Catégorie
import DeviceHubIcon from "@mui/icons-material/DeviceHub"; // Type Constructeur
import EditIcon from "@mui/icons-material/Edit"; // Import EditIcon
import SaveIcon from "@mui/icons-material/Save"; // Import SaveIcon
import CancelIcon from "@mui/icons-material/Cancel"; // Import CancelIcon

function ModifieVehicule({
  open,
  handleClose,
  vehicle,
  setVehicle,
  handleUpdateVehicle,
  categories,
}) {
  const currentVehicle = vehicle || {};
  const [image, setImage] = useState(null);
  console.log("Image being sent:", image);
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

  const energies = ["Essence", "Diesel", "Gaz", "Électrique", "Hybride"];
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        // Validation de la taille (exemple : 2 Mo maximum)
        if (file.size > 2 * 1024 * 1024) {
            alert("L'image est trop volumineuse (max 2 Mo)");
            return;
        }
        // Validation du format (exemple : jpg, png)
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            alert("Format d'image non valide (jpg, png)");
            return;
        }
        setImage(file);
    }
};

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
          padding: "5px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.4rem",
          fontWeight: "bold",
          textAlign: "center",
          color: "#d21919",
          marginBottom: 2,
        }}
      >
        <EditIcon sx={{ mr: 1 }} />
        Modifier le Véhicule
      </DialogTitle>

      <DialogContent sx={{ p: 1 }}>
        <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, p: 0.7 }}>
          <CardContent>
            {/* Vehicle Identification Section */}
            <Typography
              variant="h6"
              style={{
                margin: "0 0 15px 0",
                color: "#1976d2",
                fontWeight: "600",
                fontSize: "1rem",
                textAlign: "center",
              }}
              gutterBottom
            >
              Identification du Véhicule
            </Typography>
            <Grid container spacing={2}>
              {[
                {
                  label: "Numéro Immatriculation",
                  key: "num_immatriculation",
                  readOnly: true,
                  icon: <ConfirmationNumberIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Numéro de chassis",
                  key: "n_serie_du_type",
                  icon: <BuildIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Marque",
                  key: "marque",
                  isSelect: true,
                  options: marques,
                  icon: <DirectionsCarIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Modele",
                  key: "modele",
                  icon: <DeviceHubIcon sx={{ color: "#1976d2" }} />,
                },
                { label: "Prix par jour", key: "prix_jour" },
              ].map((field, index) => (
                <Grid item xs={4} key={index}>
                  {field.isSelect ? (
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>{field.label}</InputLabel>
                      <Select
                        value={currentVehicle[field.key] || ""}
                        onChange={(e) =>
                          setVehicle({
                            ...currentVehicle,
                            [field.key]: e.target.value,
                          })
                        }
                        label={field.label}
                        startAdornment={
                          <InputAdornment position="start">
                            {field.icon}
                          </InputAdornment>
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
                        {field.options.map((option, idx) => (
                          <MenuItem key={idx} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <TextField
                      label={field.label}
                      type={field.type || "text"}
                      fullWidth
                      variant="outlined"
                      value={currentVehicle[field.key] || ""}
                      onChange={(e) =>
                        !field.readOnly &&
                        setVehicle({
                          ...currentVehicle,
                          [field.key]: e.target.value,
                        })
                      }
                      InputLabelProps={
                        field.type === "date" ? { shrink: true } : {}
                      }
                      InputProps={{
                        style: { width: "250px", height: "40px" },
                        readOnly: field.readOnly,
                        startAdornment: (
                          <InputAdornment position="start">
                            {field.icon}
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

            {/* Image Upload Section */}
            <Typography
              variant="h6"
              style={{
                margin: "20px 0",
                color: "#1976d2",
                fontWeight: "600",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              Ajouter une Image
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="contained"
                    component="span"
                    sx={{
                      bgcolor: "#1976d2",
                      color: "white",
                      "&:hover": { bgcolor: "#1565c0" },
                    }}
                  >
                    Choisir une image
                  </Button>
                </label>
                {image && (
                  <Typography
                    variant="body2"
                    style={{ marginTop: "10px", color: "#555" }}
                  >
                    Image sélectionnée: {image.name}
                  </Typography>
                )}
              </Grid>
            </Grid>

            {/* Vehicle Specifications Section */}
            <Typography
              variant="h6"
              style={{
                margin: "20px 0",
                color: "#1976d2",
                fontWeight: "600",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              Spécifications du Véhicule
            </Typography>
            <Grid container spacing={2}>
              {[
                {
                  label: "Carrosserie",
                  key: "carrosserie",
                  icon: <CarRepairIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Énergie",
                  key: "energie",
                  isSelect: true,
                  options: energies,
                  icon: <LocalGasStationIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Puissance Fiscale",
                  key: "puissance_fiscale",
                  icon: <SpeedIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Nombre de Places",
                  key: "nbr_places",
                  icon: <PeopleIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Cylindrée",
                  key: "cylindree",
                  icon: (
                    <SettingsInputComponentIcon sx={{ color: "#1976d2" }} />
                  ),
                },
              ].map((field, index) => (
                <Grid item xs={4} key={index}>
                  {field.isSelect ? (
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>{field.label}</InputLabel>
                      <Select
                        value={currentVehicle[field.key] || ""}
                        onChange={(e) =>
                          setVehicle({
                            ...currentVehicle,
                            [field.key]: e.target.value,
                          })
                        }
                        label={field.label}
                        startAdornment={
                          <InputAdornment position="start">
                            {field.icon}
                          </InputAdornment>
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
                        {field.options.map((option, idx) => (
                          <MenuItem key={idx} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <TextField
                      label={field.label}
                      type={field.type || "text"}
                      fullWidth
                      variant="outlined"
                      value={currentVehicle[field.key] || ""}
                      onChange={(e) =>
                        setVehicle({
                          ...currentVehicle,
                          [field.key]: e.target.value,
                        })
                      }
                      InputProps={{
                        style: { width: "250px", height: "40px" },
                        startAdornment: (
                          <InputAdornment position="start">
                            {field.icon}
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
                margin: "20px 0",
                color: "#1976d2",
                fontWeight: "600",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              Certification
            </Typography>
            <Grid container spacing={2}>
              {[
                {
                  label: "Numéro Certificat",
                  key: "num_certificat",
                  icon: <DescriptionIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Lieu Certificat",
                  key: "lieu_certificat",
                  isSelect: true,
                  options: lieuxCertification,
                  icon: <LocationOnIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Date Certificat",
                  key: "date_certificat",
                  type: "date",
                  icon: <CalendarTodayIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Type Commercial",
                  key: "type_commercial",
                  icon: <DescriptionIcon sx={{ color: "#1976d2" }} />,
                },
                {
                  label: "Catégorie",
                  key: "id_categorie",
                  isSelect: true,
                  options: categories,
                  icon: <CategoryIcon sx={{ color: "#1976d2" }} />,
                },
              ].map((field, index) => (
                <Grid item xs={4} key={index}>
                  {field.isSelect ? (
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>{field.label}</InputLabel>
                      <Select
                        value={currentVehicle[field.key] || ""}
                        onChange={(e) =>
                          setVehicle({
                            ...currentVehicle,
                            [field.key]: e.target.value,
                          })
                        }
                        label={field.label}
                        startAdornment={
                          <InputAdornment position="start">
                            {field.icon}
                          </InputAdornment>
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
                        {field.options.map((option, idx) => (
                          <MenuItem
                            key={idx}
                            value={option.id_categorie || option}
                          >
                            {option.catégorie || option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <TextField
                      label={field.label}
                      type={field.type || "text"}
                      fullWidth
                      variant="outlined"
                      value={currentVehicle[field.key] || ""}
                      onChange={(e) =>
                        setVehicle({
                          ...currentVehicle,
                          [field.key]: e.target.value,
                        })
                      }
                      InputLabelProps={
                        field.type === "date" ? { shrink: true } : {}
                      }
                      InputProps={{
                        style: { width: "250px", height: "40px" },
                        startAdornment: (
                          <InputAdornment position="start">
                            {field.icon}
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
        sx={{ p: 0.6, display: "flex", justifyContent: "flex-end" }}
      >
        <Button
          onClick={() => handleUpdateVehicle(image)} // Pass image to the handler
          variant="contained"
          sx={{
            bgcolor: "#1976d2",
            color: "white",
            px: 3,
            py: 1,
            "&:hover": { bgcolor: "#1565c0" },
          }}
          startIcon={<SaveIcon />}
        >
          Modifier
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

export default ModifieVehicule;
