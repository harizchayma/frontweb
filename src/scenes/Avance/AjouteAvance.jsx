import React, { useEffect } from "react";
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
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add"; // Import the Add icon
import ContractIcon from "@mui/icons-material/Assignment"; // Example icon for contract
import ClientIcon from "@mui/icons-material/Person"; // Example icon for client
import AdvanceIcon from "@mui/icons-material/MonetizationOn"; // Example icon for advance number
import DateIcon from "@mui/icons-material/CalendarToday"; // Example icon for date
import EditIcon from "@mui/icons-material/Edit"; // Import EditIcon
import CancelIcon from '@mui/icons-material/Cancel';

function AjouteAvance({
  openAddDialog,
  handleAddClose,
  newAdvance,
  setNewAdvance,
  contracts,
  handleContractChange,
  handleAddAdvance,
  defaultContractNumber,
}) {


  return (
    <>
      {/* Add Advance Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            handleAddClose(); // Only close on close button click
          }
        }}
        maxWidth="sm" // Make the dialog smaller
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            padding: "10px", // Reduced padding
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem", // Slightly smaller title font size
            fontWeight: "bold",
            textAlign: "center",
            color: "#d21919",
            marginBottom: 1, // Reduced margin
          }}
        >
          {/* Display the advance number in the title */}
          <EditIcon sx={{ mr: 1 }} />
          Ajouter une Avance{" "}
          {newAdvance.Numero_avance ? `- ${newAdvance.Numero_avance}` : ""}
        </DialogTitle>
        <DialogContent sx={{ padding: 2 }}> {/* Reduced dialog content padding */}
        <FormControl fullWidth margin="normal">
  <InputLabel id="contract-select-label">
    Numéro de Contrat
  </InputLabel>
  <Select
  labelId="contract-select-label"
  value={newAdvance.Numero_contrat || ""}
  onChange={handleContractChange}
  startAdornment={
    <InputAdornment position="start">
      <ContractIcon sx={{ color: "#1976d2" }} />
    </InputAdornment>
  }
>
  {contracts.map((contract) => (
    <MenuItem key={contract.Numero_contrat} value={contract.Numero_contrat}>
      {contract.Numero_contrat} {/* Affichez aussi d'autres attributs si nécessaire */}
    </MenuItem>
  ))}
</Select>
</FormControl>
          <TextField
            label="CIN Client"
            value={newAdvance.cin_client}
            onChange={(e) =>
              setNewAdvance({ ...newAdvance, cin_client: e.target.value })
            }
            fullWidth
            margin="normal"
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ClientIcon sx={{ color: "#1976d2" }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Date"
            type="date"
            value={newAdvance.date}
            onChange={(e) =>
              setNewAdvance({ ...newAdvance, date: e.target.value })
            }
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DateIcon sx={{ color: "#1976d2" }} />
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
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAddAdvance}
            color="primary"
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
            onClick={handleAddClose}
            color="primary"
            startIcon={<CancelIcon />}
            sx={{
              bgcolor: "#d32f2f",
              color: "white",
              px: 3,
              py: 1,
              "&:hover": { bgcolor: "#b71c1c" },
            }}
          >
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AjouteAvance;