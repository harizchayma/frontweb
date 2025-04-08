import React, { useState } from "react";
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Paper,
  Grid,
  IconButton,
  MenuItem,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import CancelIcon from "@mui/icons-material/Cancel";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import axios from "axios";

function AjouteUtilisateur({ open, handleClose, onUserAdded = () => {} }) {
  const [userInfo, setUserInfo] = useState({
    nom: "",
    prenom: "",
    mail: "",
    cin_utilisateur: "",
    tel: "",
    login: "",
    password: "",
    role: "", // Add this line
    image: null,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setUserInfo({ ...userInfo, image: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setUserInfo({ ...userInfo, [name]: value });
    }
  };

  const handleSubmit = async () => {
    console.log(userInfo); // Keep this for debugging
    const formData = new FormData();

    Object.entries(userInfo).forEach(([key, value]) => {
        if (value) {
            formData.append(key, value);
        }
    });

    try {
        const response = await axios.post(
            "http://localhost:7001/users",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        onUserAdded(response.data);
        setSnackbarMessage("Utilisateur ajouté avec succès !");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        handleClose();
    } catch (error) {
        console.error("Error details:", error.response ? error.response.data : error.message);
        setSnackbarMessage("Erreur lors de l'ajout de l'utilisateur !");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
    }
};

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          handleClose();
        }
      }}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          padding: "0px",
          borderRadius: "10px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.4rem",
          fontWeight: "bold ",
          textAlign: "center",
          color: "#d21919",
          marginBottom: 1,
        }}
      >
        <AddCircleIcon sx={{ mr: 1 }} />
        Ajouter Utilisateur
      </DialogTitle>
      <DialogContent sx={{ padding: 1 }}>
        <Grid container spacing={2}>
          {/* Personal Information Group */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: 2, mb: 0 }}>
              <Typography variant="h6" sx={{ mb: 1, color: "#d21919" }}>
                Informations Personnelles
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Nom"
                    name="nom"
                    value={userInfo.nom}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: "#1976d2" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Prénom"
                    name="prenom"
                    value={userInfo.prenom}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: "#1976d2" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="CIN"
                    name="cin_utilisateur"
                    value={userInfo.cin_utilisateur}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ConfirmationNumberIcon sx={{ color: "#1976d2" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Email"
                    name="mail"
                    type="email"
                    value={userInfo.mail}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "#1976d2" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Téléphone"
                    name="tel"
                    value={userInfo.tel}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SmartphoneIcon sx={{ color: "#1976d2" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    select
                    label="Rôle"
                    name="role"
                    value={userInfo.role}
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: 2, mb: 0 }}>
              <Typography variant="h6" sx={{ mb: 0, color: "#d21919" }}>
                Informations de Compte
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Login"
                    name="login"
                    value={userInfo.login}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: "#1976d2" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Mot de passe"
                    name="password"
                    type="password"
                    value={userInfo.password}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} align="center">
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Cliquez pour ajouter une photo
                    </Typography>
                    <input
                      accept="image/*"
                      id="image-upload"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="image-upload">
                      <IconButton
                        color="primary"
                        component="span"
                        sx={{ padding: "7px", marginTop: "6px" }}
                      >
                        <PhotoCamera />
                      </IconButton>
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Image Preview"
                          style={{
                            width: "100%",
                            marginTop: "7px",
                            borderRadius: "7px",
                          }}
                        />
                      )}
                    </label>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ padding: 1, justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
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
          color="secondary"
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

export default AjouteUtilisateur;
