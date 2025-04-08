import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Grid, Card, CardContent, Box } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import DateRangeIcon from '@mui/icons-material/DateRange';
import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';

function AfficheChauffeur({ open, handleClose, selectedChauffeur }) {
  return (
    <Dialog                
      sx={{ '& .MuiDialog-paper': { padding: '0px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' } }}
      open={open} onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          handleClose(); // Only close on close button click
        }
      }}  
      maxWidth="md" 
      fullWidth>
      
      {/* Update the title to include Numéro de Contrat */}
      <DialogTitle sx={{ fontSize: '1.4rem', fontWeight: 'bold', textAlign: 'center', color: '#d21919', marginBottom: 1 }}>
        Détails du Chauffeur   Numéro de Contrat: {selectedChauffeur?.Numero_contrat || "Non spécifié"}
      </DialogTitle>
      
      <DialogContent sx={{ p: 1 }}>
        {selectedChauffeur && (
          <Box>
            {/* Informations Personnelles Section */}
            <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, mb: 1 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                  Informations Personnelles
                </Typography>
                <Grid container spacing={1.4}>
                  {[
                    { label: "Nom (FR)", value: selectedChauffeur.nom_fr, icon: <PersonIcon sx={{ color: '#1976d2' }} /> },
                    { label: "Nom (AR)", value: selectedChauffeur.nom_ar, icon: <PersonIcon sx={{ color: '#1976d2' }} /> },
                    { label: "Prénom (FR)", value: selectedChauffeur.prenom_fr, icon: <PersonIcon sx={{ color: '#1976d2' }} /> },
                    { label: "Prénom (AR)", value: selectedChauffeur.prenom_ar, icon: <PersonIcon sx={{ color: '#1976d2' }} /> },
                    { label: "CIN", value: selectedChauffeur.cin_chauffeur, icon: <DescriptionIcon sx={{ color: '#1976d2' }} /> },
                    { label: "Date de CIN", value: selectedChauffeur.date_cin_chauffeur, icon: <DateRangeIcon sx={{ color: '#1976d2' }} /> },
                    { label: "Date de Naissance", value: selectedChauffeur.date_naiss, icon: <DateRangeIcon sx={{ color: '#1976d2' }} /> },
                  ].map((item, index) => (
                    <Grid item xs={6} key={index} display="flex" alignItems="center">
                      {item.icon}
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333', marginLeft: 1 }}>
                        {item.label} :
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#be0707', marginLeft: 1 }}>
                        {item.value || "Non spécifié"}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Informations de Contact Section */}
            <Card variant="outlined" sx={{ boxShadow: 2, borderRadius: 2, mb: 1 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                  Informations de Contact
                </Typography>
                <Grid container spacing={1.3}>
                  {[
                    { label: "Adresse (FR)", value: selectedChauffeur.adresse_fr, icon: <HomeIcon sx={{ color: '#1976d2' }} /> },
                    { label: "Adresse (AR)", value: selectedChauffeur.adresse_ar, icon: <HomeIcon sx={{ color: '#1976d2' }} /> },
                    { label: "Numéro de Téléphone", value: selectedChauffeur.num_tel, icon: <PhoneIcon sx={{ color: '#1976d2' }} /> },
                  ].map((item, index) => (
                    <Grid item xs={6} key={index} display="flex" alignItems="center">
                      {item.icon}
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333', marginLeft: 1 }}>
                        {item.label} :
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#555', marginLeft: 1 }}>
                        {item.value || "Non spécifié"}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Informations Professionnelles Section */}
            <Card variant="outlined" sx={{ boxShadow: 2, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                  Informations Professionnelles
                </Typography>
                <Grid container spacing={1.2}>
                  {[
                    { label: "Numéro de Permis", value: selectedChauffeur.numero_permis, icon: <DescriptionIcon sx={{ color: '#1976d2' }} /> },
                    { label: "Date de Permis", value: selectedChauffeur.date_permis, icon: <DateRangeIcon sx={{ color: '#1976d2' }} /> },
                    { label: "Profession (FR)", value: selectedChauffeur.profession_fr, icon: <WorkIcon sx={{ color: '#1976d2' }} /> },
                    { label: "Profession (AR)", value: selectedChauffeur.profession_ar, icon: <WorkIcon sx={{ color: '#1976d2' }} /> },
                    { label: "Nationalité d'Origine", value: selectedChauffeur.nationalite_origine, icon: <DescriptionIcon sx={{ color: '#1976d2' }} /> },
                  ].map((item, index) => (
                    <Grid item xs={6} key={index} display="flex" alignItems="center">
                      {item.icon}
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333', marginLeft: 1 }}>
                        {item.label} :
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#555', marginLeft: 1 }}>
                        {item.value || "Non spécifié"}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={handleClose} 
          variant="contained" 
          sx={{ bgcolor: "#1976d2", color: "white", fontWeight: "bold", '&:hover': { bgcolor: "#1565c0" } }}>
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AfficheChauffeur;