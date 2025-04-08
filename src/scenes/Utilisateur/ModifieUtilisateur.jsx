import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";

function ModifieUtilisateur({ open, onClose, user, onUserUpdated = () => {} }) {
  const [userInfo, setUserInfo] = useState({
    nom: "",
    prenom: "",
    mail: "",
    cin_utilisateur: "",
    tel: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Fetch user data when the dialog opens
  useEffect(() => {
    if (open && user) {
      // Set userInfo with the user data
      setUserInfo({
        nom: user.nom || "", // Assurez-vous que ces champs existent dans l'objet user
        prenom: user.prenom || "",
        mail: user.mail || "",
        cin_utilisateur: user.cin_utilisateur || "",
        tel: user.tel || "",
      });
    }
  }, [open, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:7001/users/${user.id}`, // Utilisez user.id ici
        userInfo
      );
      onUserUpdated(response.data.data); // Assurez-vous que cela correspond à la structure de votre réponse
      setSnackbarMessage("Utilisateur modifié avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onClose(); // Fermez le dialogue après la mise à jour
    } catch (error) {
      console.error("Error updating user:", error);
      setSnackbarMessage("Erreur lors de la modification de l'utilisateur !");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onClose(); // Call our new close method
        }
      }}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          padding: "2px",
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
        Modifier Utilisateur
      </DialogTitle>
      <DialogContent sx={{ padding: 2 }}>
        <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Nom"
                name="nom"
                value={userInfo.nom || ""}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#1976d2" }}/>
                    </InputAdornment>
                  ),
                }}sx={{
                  
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Prénom"
                name="prenom"
                value={userInfo.prenom || ""}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#1976d2" }}/>
                    </InputAdornment>
                  ),
                }}sx={{
                  
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="mail"
                type="email"
                value={userInfo.mail || ""}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#1976d2" }}/>
                    </InputAdornment>
                  ),
                }}sx={{
                  
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="CIN"
                name="cin_utilisateur"
                value={userInfo.cin_utilisateur || ""}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ConfirmationNumberIcon sx={{ color: "#1976d2" }} />
                    </InputAdornment>
                  ),
                }}sx={{
                  
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Téléphone"
                name="tel"
                value={userInfo.tel || ""}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SmartphoneIcon sx={{ color: "#1976d2" }}/>
                    </InputAdornment>
                  ),
                }}sx={{
                  
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
              />
            </Grid>
          </Grid>
        </Paper>
      </DialogContent>
      <DialogActions sx={{ padding: 1, justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          startIcon={<EditIcon />}
          sx={{
            bgcolor: "#1976d2",
            color: "white",
            px: 2,
            py: 1,
            "&:hover": { bgcolor: "#0d47a1" },
            transition: "background-color 0.3s ease",
          }}
        >
          Modifier
        </Button>
        <Button
          onClick={onClose}
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

export default ModifieUtilisateur;