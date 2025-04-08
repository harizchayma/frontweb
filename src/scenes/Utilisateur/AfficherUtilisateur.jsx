import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import ContactMailIcon from "@mui/icons-material/ContactMail"; // Email icon
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber"; // CIN icon
import PhoneIcon from "@mui/icons-material/Phone"; // Phone icon
import WorkIcon from "@mui/icons-material/Work"; // Role icon

const AfficherUtilisateur = ({ open, handleClose, selectedUser }) => {
  const [imageUrl, setImageUrl] = useState("");

  // Function to convert Buffer to Blob
  const bufferToBlob = (buffer, type = "image/jpeg") => {
    return new Blob([new Uint8Array(buffer.data)], { type });
  };

  useEffect(() => {
    if (selectedUser && selectedUser.image) {
      let blob;

      // Check if the image is a Buffer
      if (selectedUser.image.type === "Buffer") {
        // Convert Buffer to Blob
        blob = bufferToBlob(selectedUser.image);
      } else if (
        typeof selectedUser.image === "string" &&
        selectedUser.image.startsWith("data:image")
      ) {
        // If it's a base64 string, convert it to a Blob
        const base64Data = selectedUser.image.split(",")[1]; // Get the base64 part
        blob = bufferToBlob(base64Data);
      } else {
        console.error("Image format not supported:", selectedUser.image);
        return; // Exit if the image format is not supported
      }

      const url = URL.createObjectURL(blob);
      setImageUrl(url);

      // Cleanup function to revoke the Blob URL
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [selectedUser]);

  if (!selectedUser) return null;

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          handleClose(); // Call our new close method
        }
      }}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          padding: "20px",
          borderRadius: "15px",
          backgroundColor: "#f5f5f5",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
        },
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
        Détail de l'utilisateur
      </DialogTitle>
      <DialogContent
        sx={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          src={imageUrl}
          alt={`${selectedUser.nom} ${selectedUser.prenom}`}
          sx={{
            width: 150,
            height: 150,
            marginBottom: 2,
            border: "2px solid #d21919",
          }}
        />

        <Typography
          variant="h3"
          component="div"
          marginBottom={3}
          sx={{ color: "#1954d2", textAlign: "center" }}
        >
          {`${selectedUser.nom} ${selectedUser.prenom}`}
        </Typography>

        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          marginBottom={1}
          width="100%"
        >
          <ContactMailIcon sx={{ color: "#d21919", marginRight: 1 }} />
          <Typography variant="body1" color="textSecondary">
            Email: {selectedUser.mail}
          </Typography>
        </Box>

        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          marginBottom={1}
          width="100%"
        >
          <ConfirmationNumberIcon sx={{ color: "#d21919", marginRight: 1 }} />
          <Typography variant="body1" color="textSecondary">
            CIN: {selectedUser.cin_utilisateur}
          </Typography>
        </Box>

        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          marginBottom={1}
          width="100%"
        >
          <PhoneIcon sx={{ color: "#d21919", marginRight: 1 }} />
          <Typography variant="body1" color="textSecondary">
            Téléphone: {selectedUser.tel}
          </Typography>
        </Box>

        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          marginBottom={1}
          width="100%"
        >
          <WorkIcon sx={{ color: "#d21919", marginRight: 1 }} />
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Rôle: <Typography variant="body1" component="span" sx={{ color: "#000000",fontWeight: "bold" }}>{selectedUser.role}</Typography>
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="primary"
          sx={{
            color: "#fff",
            backgroundColor: "#d21919",
            "&:hover": { bgcolor: "#a61a1a" },
            transition: "background-color 0.3s ease",
          }}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AfficherUtilisateur;