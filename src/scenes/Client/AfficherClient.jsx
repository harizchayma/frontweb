import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Grid, Card, CardContent, Divider, Box } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import DateRangeIcon from '@mui/icons-material/DateRange';
import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';

function AfficherClient({ open, handleClose, selectedClient }) {
  return (
    <Dialog                
     sx={{ '& .MuiDialog-paper': { padding: '0px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' } }}

    open={open} onClose={(event, reason) => {
      if (reason !== 'backdropClick') {
          handleClose(); // Only close on close button click
      }
  }}  maxWidth="md" fullWidth>
      <DialogTitle  sx={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', color: '#d21919', marginBottom: 2 }}>
        Détails du Client
      </DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        {selectedClient && (
          <Box>
            {/* Informations Personnelles Section */}
            <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                  Informations Personnelles
                </Typography>
                <Grid container spacing={1.4}>
                  {[
                    { label: "Nom (FR)", value: selectedClient.nom_fr, icon: <PersonIcon sx={{ color: '#1976d2' }} /> },
                    { label: "Nom (AR)", value: selectedClient.nom_ar, icon: <PersonIcon sx={{ color: '#1976d2' }} /> },
                    { label: "Prénom (FR)", value: selectedClient.prenom_fr, icon: <PersonIcon sx={{ color: '#1976d2' }} /> },
                    { label: "Prénom (AR)", value: selectedClient.prenom_ar, icon: <PersonIcon sx={{ color: '#1976d2' }} /> },
                    { label: "CIN", value: selectedClient.cin_client, icon: <DescriptionIcon sx={{ color: '#1976d2' }} /> },
                    { label: "Date de Naissance", value: selectedClient.date_naiss, icon: <DateRangeIcon sx={{ color: '#1976d2' }} /> },
                  ].map((item, index) => (
                    <Grid item xs={6} key={index} display="flex" alignItems="center">
                      {item.icon}
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333', marginLeft: 1 }}>
                        {item.label} :
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#be0707', marginLeft: 1, alignItems:'center' }}> {/* Valeur en gras */}
                        {item.value || "Non spécifié"}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Informations de Contact Section */}
            <Card variant="outlined" sx={{ boxShadow: 2, borderRadius: 2, mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                  Informations de Contact
                </Typography>
                <Grid container spacing={1.4}>
                  {[
                    { label: "Adresse (FR)", value: selectedClient.adresse_fr, icon: <HomeIcon sx={{ color: '#1976d2' }} /> },
                    { label: "Adresse (AR)", value: selectedClient.adresse_ar, icon: <HomeIcon sx={{ color: '#1976d2' }} /> },
                    { label: "Numéro de Téléphone", value: selectedClient.num_tel, icon: <PhoneIcon sx={{ color: '#1976d2' }} /> },
                  ].map((item, index) => (
                    <Grid item xs={6} key={index} display="flex" alignItems="center">
                      {item.icon}
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333', marginLeft: 1 }}>
                        {item.label} :
                      </Typography>
                      <Typography variant="body1" sx={{  color: '#555', marginLeft: 1 }}> {/* Valeur en gras */}
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
                <Grid container spacing={1.3}>
                  {[
                    { label: "Numéro de Permis", value: selectedClient.Numero_Permis, icon: <DescriptionIcon sx={{ color: '#1976d2' }} /> },
                    { label: "Date de Permis", value: selectedClient.date_permis, icon: <DateRangeIcon sx={{ color: '#1976d2' }} /> },
                    { label: "Profession (FR)", value: selectedClient.profession_fr, icon: <WorkIcon sx={{ color: '#1976d2' }} /> },
                    { label: "Profession (AR)", value: selectedClient.profession_ar, icon: <WorkIcon sx={{ color: '#1976d2' }} /> },
                    { label: "Nationalité d'Origine", value: selectedClient.nationalite_origine, icon: <DescriptionIcon sx={{ color: '#1976d2' }} /> },
                  ].map((item, index) => (
                    <Grid item xs={6} key={index} display="flex" alignItems="center">
                      {item.icon}
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333', marginLeft: 1 }}>
                        {item.label} :
                      </Typography>
                      <Typography variant="body1" sx={{  color: '#555', marginLeft: 1 }}> {/* Valeur en gras */}
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
        <Button onClick={handleClose} variant="contained" sx={{ bgcolor: "#1976d2", color: "white", fontWeight: "bold", '&:hover': { bgcolor: "#1565c0" } }}>
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AfficherClient;