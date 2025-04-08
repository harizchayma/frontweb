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
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";

function Detailavance({
  open,
  onClose,
  avanceOptions,
  detailAvance,
  setDetailAvance,
  onAddDetailAvance,
  defaultAdvanceNumber,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDetailAvance((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (open && defaultAdvanceNumber) {
      setDetailAvance((prev) => ({
        ...prev,
        Numero_avance: defaultAdvanceNumber,
        montant: "", // reset montant
        banque: "", // reset banque
        mode_reglement: "", // reset mode_reglement
        NumeroPiece: "", // reset NumeroPiece
        echeance: "", // reset echeance
      }));
    }
  }, [open, defaultAdvanceNumber, setDetailAvance]);

  const banquesTunisiennes = [
    "Société Tunisienne de Banque (STB)",
    "Banque Nationale Agricole (BNA)",
    "Banque de l'Habitat (BH)",
    "Banque de Financement des Petites et Moyennes Entreprises (BFPME)",
    "Banque Tunisienne de Solidarité (BTS)",
    "Banque de Tunisie et des Émirats (BTE)",
    "Banque Tuniso-Libyenne (BTL)",
    "Tunisian Saudi Bank (TSB)",
    "Banque Zitouna",
    "Al Baraka Bank",
    "Al Wifak International Bank",
    "Amen Bank",
    "Attijari Bank",
    "Arab Tunisian Bank (ATB)",
    "Arab Banking Corporation (ABC)",
    "Banque Internationale Arabe de Tunisie (BIAT)",
    "Banque de Tunisie (BT)",
    "Banque Tuniso-Koweïtienne (BTK)",
    "Banque Franco-Tunisienne (BFT)",
    "Citi Bank",
    "Qatar National Bank (QNB)",
    "Union Bancaire pour le Commerce et l'Industrie (UBCI)",
    "Union Internationale de Banques (UIB)",
  ];

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onClose();
        }
      }}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": { padding: "10px", borderRadius: "8px" },
      }}
    >
      <DialogTitle sx={{
            fontSize: "1.5rem", // Slightly smaller title font size
            fontWeight: "bold",
            textAlign: "center",
            color: "#d21919",
            marginBottom: 1, // Reduced margin
          }}>
        Ajouter un détail d'avance{" "}
        {detailAvance.Numero_avance
          ? `- ${detailAvance.Numero_avance}`
          : defaultAdvanceNumber
          ? `- ${defaultAdvanceNumber}`
          : ""}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Montant"
          name="montant"
          value={detailAvance.montant || ""}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MonetizationOnIcon sx={{ color: "#1976d2" }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="banque-select-label">Banque</InputLabel>
          <Select
            labelId="banque-select-label"
            name="banque"
            value={detailAvance.banque || ""}
            onChange={handleInputChange}
          >
            {banquesTunisiennes.map((banque) => (
              <MenuItem key={banque} value={banque}>
                {banque}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="mode-reglement-label">Mode de Règlement</InputLabel>
          <Select
            labelId="mode-reglement-label"
            name="mode_reglement"
            value={detailAvance.mode_reglement || ""}
            onChange={handleInputChange}
          >
            <MenuItem value="Chèque">
              <PaymentIcon sx={{ marginRight: 1, color: "#1976d2" }} /> Chèque
            </MenuItem>
            <MenuItem value="Virement">
              <PaymentIcon sx={{ marginRight: 1, color: "#1976d2" }} /> Virement
            </MenuItem>
            <MenuItem value="Espèces">
              <PaymentIcon sx={{ marginRight: 1, color: "#1976d2" }} /> Espèces
            </MenuItem>
          </Select>
        </FormControl>

        {/* Champ Numéro de Pièce */}
        <TextField
          label="Numéro de Pièce"
          name="NumeroPiece"
          value={detailAvance.NumeroPiece || ""}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <DescriptionIcon sx={{ color: "#1976d2" }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Champ Échéance */}
        <TextField
          label="Échéance"
          name="echeance"
          type="date"
          value={detailAvance.echeance || ""}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarTodayIcon sx={{ color: "#1976d2" }} />
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onAddDetailAvance}
          color="primary" 
          sx={{ bgcolor: "#1976d2", color: "white" }}
          startIcon={<AddIcon />}
        >
          Ajouter
        </Button>
        <Button
          onClick={onClose}
          color="primary"
          startIcon={<CancelIcon />}
          sx={{ bgcolor: "#d32f2f", color: "white" }}
        >
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Detailavance;
