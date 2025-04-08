import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from "axios";

const ModifieLogin = ({ open, handleClose, userId, onUserUpdated, currentLogin }) => {
  const [password, setPassword] = useState(""); // Manage password state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false); // Loading state
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handlePasswordChange = (e) => {
    setPassword(e.target.value); // Update password state
  };

  const handleSubmit = async () => {
    if (!password) {
      setSnackbarMessage("Le mot de passe ne peut pas être vide !");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true); // Set loading state
    console.log("Submitting password modification for user:", userId);
    
    try {
      const response = await axios.put(`http://localhost:7001/users/${userId}/login`, { password });
      console.log("Server response:", response); // Log full server response

      if (response.status === 200) {
        onUserUpdated(response.data.data); // Notify parent component
        setSnackbarMessage("Mot de passe modifié avec succès !");
        setSnackbarSeverity("success");
        handleClose(); // Close the dialog after successful update
      } else {
        setSnackbarMessage("Erreur lors de la modification du mot de passe !");
        setSnackbarSeverity("error");
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error updating login:", error);
      
      // Log error details for better debugging
      const errorMsg = error.response?.data?.message || error.message || "Erreur lors de la modification du mot de passe !";
      console.log("Error message from server:", errorMsg);
      
      setSnackbarMessage(errorMsg);
      setSnackbarSeverity("error");
    } finally {
      setLoading(false); // Reset loading state
      setSnackbarOpen(true); // Show Snackbar with message
      console.log("Snackbar opened with message:", snackbarMessage); // Log the message to be displayed
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} sx={{
      "& .MuiDialog-paper": {
        padding: "0px",
        borderRadius: "10px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      },
    }}>
      <DialogTitle sx={{
          fontSize: "1.4rem",
          fontWeight: "bold ",
          textAlign: "center",
          color: "#d21919",
          marginBottom: 1,
        }}>Modifier Mot de Passe</DialogTitle>
      <DialogContent>
        <TextField
          label="Login"
          value={currentLogin} // Display current login
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true, // Make it read-only
          }}
          sx={{ backgroundColor: '#fff' }}
        />
        <TextField
          label="Nouveau Mot de Passe"
          name="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange} // Handle password change
          fullWidth
          margin="normal"
          disabled={loading} // Disable input while loading
          InputProps={{
            endAdornment: (
              <Button onClick={() => setShowPassword(prev => !prev)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </Button>
            ),
          }}
          sx={{ backgroundColor: '#fff' }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary" disabled={loading}
          sx={{
            bgcolor: "#1976d2",
            color: "white",
            px: 2,
            py: 1,
            "&:hover": { bgcolor: "#0d47a1" },
            transition: "background-color 0.3s ease",
          }}>
          {loading ? "Modification..." : <><EditIcon style={{ marginRight: 4 }} /> Modifier</>}
        </Button>
        <Button onClick={handleClose} color="secondary" disabled={loading}
          sx={{
            color: "#f44336",
            borderColor: "#f44336",
            "&:hover": { bgcolor: "#f44336", color: "white" },
            transition: "background-color 0.3s ease",
          }}>
          <CloseIcon style={{ marginRight: 4 }} /> Annuler
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default ModifieLogin;