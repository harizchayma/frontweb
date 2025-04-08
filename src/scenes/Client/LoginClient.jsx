import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

function LoginClient({ open, onClose, client, onAddLogin }) {
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAdd = () => {
    if (client && loginDetails.email && loginDetails.password) {
      onAddLogin(client.id_client, loginDetails);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ "& .MuiDialog-paper": { padding: "20px", borderRadius: "8px" } }}
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
        Ajouter les informations de connexion
      </DialogTitle>
      <DialogContent>
        {client && (
          <>
            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="Email"
              type="email"
              fullWidth
              name="email"
              value={loginDetails.email}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              id="password"
              label="Mot de passe"
              type="password"
              fullWidth
              name="password"
              value={loginDetails.password}
              onChange={handleInputChange}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
          variant="outlined"
          sx={{ borderRadius: "20px" }}
        >
          Annuler
        </Button>
        <Button
          onClick={handleAdd}
          color="warning"
          variant="contained"
          sx={{ borderRadius: "20px" }}
        >
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LoginClient;
