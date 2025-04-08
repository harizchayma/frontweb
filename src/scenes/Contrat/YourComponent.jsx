import React, { useState, useCallback, useEffect } from "react";
import { Box, Button, Typography, Dialog, Grid } from "@mui/material";
import AjouteAvanceContrat from "./AjouteAvanceContrat";
import AjouteChauffeur from "./AjouteChauffeur";

const YourComponent = ({ open, handleClose, contractNumber, cinClient }) => {
    const [localCinClient, setLocalCinClient] = useState(cinClient || "CIN_DEFAULT");
    const [openAddChauffeurDialog, setOpenAddChauffeurDialog] = useState(false);
    const [openAddAdvanceDialog, setOpenAddAdvanceDialog] = useState(false);
    
    // Data to hold advances (you might receive this data from a backend)
    const [data, setData] = useState([]);
    const [newAdvance, setNewAdvance] = useState({
        cin_client: "",
        date: "",
        Numero_contrat: "",
        Numero_avance: "",
    });
  
    useEffect(() => {
        setLocalCinClient(cinClient);
        // Assume fetchData fetches and sets data
        // fetchData();  
    }, [cinClient]);

    const generateNextAvanceNumber = useCallback(() => {
        if (data.length > 0) {
            const lastAvanceNumber = data.reduce((max, avance) => {
                const currentNum = parseInt(avance.Numero_avance.replace('V', ''), 10); // Extract number
                return currentNum > max ? currentNum : max;
            }, 0);
            return `V${(lastAvanceNumber + 1).toString().padStart(4, "0")}`;
        } else {
            return "V0001"; // Start from V0001 if no advances exist
        }
    }, [data]);

    const handleAddOpen = useCallback(() => {
        const nextAvanceNumber = generateNextAvanceNumber();
        setNewAdvance((prev) => ({ ...prev, Numero_avance: nextAvanceNumber }));
        setOpenAddAdvanceDialog(true);
    }, [generateNextAvanceNumber]);

    const handleOpenAddChauffeurDialog = () => {
        setOpenAddChauffeurDialog(true);
    };

    const handleCloseDialogs = () => {
        setOpenAddAdvanceDialog(false);
        setOpenAddChauffeurDialog(false);
    };

    return (
        <Dialog
            open={open}
            onClose={(event, reason) => {
                if (reason !== "backdropClick") {
                    handleClose();
                }
            }}
            maxWidth="md"
            fullWidth
        >
            <Box m={2} sx={{ backgroundColor: "#f9f9f9", borderRadius: 2, boxShadow: 3, padding: 3 }}>
                <Typography variant="h2" sx={{ marginBottom: 3, textAlign: "center", fontWeight: "bold", color: "#1976d2" }}>
                    Gestion de Contrat
                </Typography>
        
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={6} md={5}>
                        <Box mb={2} p={2} sx={{ border: "1px solid #1976d2", borderRadius: 1, backgroundColor: "white", height: "150px" }}>
                            <Typography variant="h6" gutterBottom>
                                Ajouter une Avance
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddOpen}
                                sx={{ "&:hover": { backgroundColor: "#1565c0" } }}
                            >
                                Ajouter Avance
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={5}>
                        <Box mb={2} p={2} sx={{ border: "1px solid #1976d2", borderRadius: 1, backgroundColor: "white", height: "150px" }}>
                            <Typography variant="h6" gutterBottom>
                                Ajouter un Chauffeur
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleOpenAddChauffeurDialog}
                                sx={{ "&:hover": { backgroundColor: "#1565c0" } }}
                            >
                                Ajouter Chauffeur
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                <AjouteAvanceContrat
                    open={openAddAdvanceDialog}
                    handleClose={handleCloseDialogs}
                    defaultNumeroAvance={newAdvance.Numero_avance}
                    defaultContractNumber={contractNumber}
                    defaultCinClient={localCinClient}
                />

                <AjouteChauffeur
                    open={openAddChauffeurDialog}
                    handleClose={handleCloseDialogs}
                    newChauffeur={{}}
                    setNewChauffeur={() => {}}
                    defaultContractNumber={contractNumber}
                />

                <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleClose}
                        sx={{
                            color: "#f44336",
                            borderColor: "#f44336",
                            "&:hover": { bgcolor: "#f44336", color: "white" },
                            transition: "background-color 0.3s ease",
                          }}
                    >
                        Annuler
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default YourComponent;