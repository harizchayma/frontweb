import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Paper,
    IconButton,
    Tooltip,
    InputAdornment,
    Box,
} from "@mui/material";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import DateRangeIcon from "@mui/icons-material/DateRange";
import DescriptionIcon from "@mui/icons-material/Description";
import WorkIcon from "@mui/icons-material/Work";
import AddCircleIcon from "@mui/icons-material/AddCircle"; // Import the icon for adding
import CancelIcon from "@mui/icons-material/Cancel"; // Import the icon for canceling

function AjouteClient({
    open,
    handleClose,
    newClient,
    setNewClient,
    handleAddClient,
}) {
    const [focusedField, setFocusedField] = useState(null);
    const [keyboardOpen, setKeyboardOpen] = useState(false);
    const [isClosingKeyboard, setIsClosingKeyboard] = useState(false);

    useEffect(() => {
        console.log("Keyboard Open State Changed: ", keyboardOpen);
    }, [keyboardOpen]);

    const handleChange = (field) => (event) => {
        let value = event.target.value;

        if (
            field === "nom_fr" ||
            field === "prenom_fr" ||
            field === "nom_ar" ||
            field === "prenom_ar" ||
            field === "profession_fr" ||
            field === "profession_ar"
        ) {
            value = value.replace(/[^a-zA-Z\s\u0600-\u06FF]/g, ""); // Allow latin letters, arabic letters and spaces
        } else if (field === "cin_client" || field === "num_tel") {
            value = value.replace(/[^0-9]/g, "").slice(0, 8);
        } else if (field === "Numero_Permis") {
            // Allow format: 2 digits / 6 digits
            const regex = /^(\d{0,2})(\/\d{0,6})?$/;
            const match = value.match(regex);
            value = match ? match[0] : ""; // Keep only valid part
        }

        setNewClient({ ...newClient, [field]: value });
    };

    const onKeyPress = (button) => {
        if (focusedField) {
            setNewClient({
                ...newClient,
                [focusedField]: (newClient[focusedField] || "") + button,
            });
        }
    };

    const handleArabicFieldClick = (field) => {
        if (!keyboardOpen && !isClosingKeyboard) {
            setFocusedField(field);
            setKeyboardOpen(true);
        }
    };

    const handleKeyboardClose = () => {
        console.log("Fermeture du clavier arabe");
        setIsClosingKeyboard(true);
        setKeyboardOpen(false);
        setFocusedField(null);

        setTimeout(() => {
            setIsClosingKeyboard(false);
        }, 300);
    };

    const personalInfoFields = [
        { label: "Nom (FR)", field: "nom_fr", icon: <PersonIcon sx={{ color: "#1976d2" }} /> },
        { label: "Nom (AR)", field: "nom_ar", arabic: true, icon: <PersonIcon sx={{ color: "#1976d2" }} /> },
        { label: "Date de Naissance", field: "date_naiss", type: "date", icon: <DateRangeIcon sx={{ color: "#1976d2" }} /> },
        { label: "Prénom (FR)", field: "prenom_fr", icon: <PersonIcon sx={{ color: "#1976d2" }} /> },
        { label: "Prénom (AR)", field: "prenom_ar", arabic: true, icon: <PersonIcon sx={{ color: "#1976d2" }} /> },
    ];

    const identificationDetailsFields = [
        { label: "CIN", field: "cin_client", icon: <DescriptionIcon sx={{ color: "#1976d2" }} /> },
        { label: "Numéro de Permis", field: "Numero_Permis", icon: <DescriptionIcon sx={{ color: "#1976d2" }} /> },
        { label: "Date de Permis", field: "date_permis", type: "date", icon: <DateRangeIcon sx={{ color: "#1976d2" }} /> },
        { label: "Date CIN", field: "date_cin", type: "date", icon: <DateRangeIcon sx={{ color: "#1976d2" }} /> },
    ];

    const contactInfoFields = [
        { label: "Adresse (FR)", field: "adresse_fr", icon: <HomeIcon sx={{ color: "#1976d2" }} /> },
        { label: "Adresse (AR)", field: "adresse_ar", arabic: true, icon: <HomeIcon sx={{ color: "#1976d2" }} /> },
        { label: "Numéro de Téléphone", field: "num_tel", icon: <PhoneIcon sx={{ color: "#1976d2" }} /> },
        { label: "Profession (FR)", field: "profession_fr", icon: <WorkIcon sx={{ color: "#1976d2" }} /> },
        { label: "Profession (AR)", field: "profession_ar", arabic: true, icon: <WorkIcon sx={{ color: "#1976d2" }} /> },
        { label: "Nationalité d'Origine", field: "nationalite_origine", icon: <DescriptionIcon sx={{ color: "#1976d2" }} /> },
    ];

    return (
        <>
            <Dialog
                open={open}
                maxWidth="md"
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        padding: "2px",
                        borderRadius: "8px",
                        backgroundColor: "#fff",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    },
                }}
                onClose={(event, reason) => {
                    if (reason !== "backdropClick") {
                        handleClose(); // Only close on close button click
                    }
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
                    <AddCircleIcon sx={{ mr: 1 }} />
                    Ajouter un Client
                </DialogTitle>

                <DialogContent sx={{ padding: 2 }}>
                    <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
                        {/* Informations Personnelles */}
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <h6
                                    style={{
                                        margin: "0 0 15px 0",
                                        color: "#0a115a",
                                        fontWeight: "600",
                                        fontSize: "1rem",
                                        textAlign: "center",
                                    }}
                                >
                                    Informations Personnelles
                                </h6>
                            </Grid>
                            {personalInfoFields.map(({ label, field, type, arabic, icon }) => (
                                <Grid item xs={12} sm={4} key={field}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label={label}
                                        value={newClient[field] || ""}
                                        onChange={handleChange(field)}
                                        type={type || "text"}
                                        InputLabelProps={type === "date" ? { shrink: true } : {}}
                                        InputProps={{
                                            style: { width: "250px", height: "40px" },
                                            startAdornment: (
                                                <InputAdornment position="start">{icon}</InputAdornment>
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
                                        onFocus={() => arabic && handleArabicFieldClick(field)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        {/* Détails d'Identification */}
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <h6
                                    style={{
                                        margin: "0 0 15px 0",
                                        color: "#0a115a",
                                        fontWeight: "600",
                                        fontSize: "1rem",
                                        textAlign: "center",
                                    }}
                                >
                                    Détails d'Identification
                                </h6>
                            </Grid>
                            {identificationDetailsFields.map(({ label, field, type, icon }) => (
                                <Grid item xs={12} sm={4} key={field}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label={label}
                                        value={newClient[field] || ""}
                                        onChange={handleChange(field)}
                                        type={type || "text"}
                                        InputLabelProps={type === "date" ? { shrink: true } : {}}
                                        InputProps={{
                                            style: { width: "250px", height: "40px" },
                                            startAdornment: (
                                                <InputAdornment position="start">{icon}</InputAdornment>
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
                                </Grid>
                            ))}
                        </Grid>
                        {/* Informations de Contact */}
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <h6
                                    style={{
                                        margin: "0 0 15px 0",
                                        color: "#0a115a",
                                        fontWeight: "600",
                                        fontSize: "1rem",
                                        textAlign: "center",
                                    }}
                                >
                                    Informations de Contact
                                </h6>
                            </Grid>
                            {contactInfoFields.map(({ label, field, type, arabic, icon }) => (
                                <Grid item xs={12} sm={4} key={field}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label={label}
                                        value={newClient[field] || ""}
                                        onChange={handleChange(field)}
                                        type={type || "text"}
                                        InputLabelProps={type === "date" ? { shrink: true } : {}}
                                        InputProps={{
                                            style: { width: "250px", height: "40px" },
                                            startAdornment: (
                                                <InputAdornment position="start">{icon}</InputAdornment>
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
                                        onFocus={() => arabic && handleArabicFieldClick(field)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </DialogContent>

                <DialogActions sx={{ padding: 1, justifyContent: "flex-end" }}>
                    <Button
                        onClick={handleAddClient}
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircleIcon />} // Add icon for the "Ajouter" button
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
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />} // Add icon for the "Annuler" button
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
            </Dialog>

            <Dialog
                open={keyboardOpen}
                onClose={handleKeyboardClose}
                onClick={(e) => e.stopPropagation()}
                maxWidth="md"
                fullWidth
                sx={{ "& .MuiDialog-paper": { borderRadius: "12px" } }}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        bgcolor: "#1976d2",
                        color: "white",
                        padding: 1.5,
                    }}
                >
                    Clavier Arabe
                    <Tooltip title="Fermer">
                        <IconButton onClick={handleKeyboardClose} sx={{ color: "white" }}>
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                            overflow: "auto",
                        }}
                    >
                        <Keyboard
                            layoutName="arabic"
                            onKeyPress={onKeyPress}
                            layout={{
                                arabic: [
                                    "ض ص ث ق ف غ ع ه خ ح ج د",
                                    "ش س ي ب ل ا ت ن م ك ط",
                                    "ئ ء ؤ ر لا ى ة و ز ظ",
                                ],
                            }}
                            sx={{
                                width: "100%",
                            }}
                        />
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default AjouteClient;