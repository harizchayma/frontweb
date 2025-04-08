import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box, Grid, Card, CardContent } from "@mui/material";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import BuildIcon from '@mui/icons-material/Build';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import SpeedIcon from '@mui/icons-material/Speed';
import PeopleIcon from '@mui/icons-material/People';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import DescriptionIcon from '@mui/icons-material/Description';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

function AfficherVehicule({ open, handleClose, selectedVehicle }) {
  return (
    <Dialog open={open} onClose={(event, reason) => {
      if (reason !== 'backdropClick') {
        handleClose();
      }
    }} maxWidth="md" fullWidth
    sx={{ '& .MuiDialog-paper': { padding: '10px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' } }}
>
                <DialogTitle  sx={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', color: '#d21919', marginBottom: 2 }}>
        Détails du Véhicule
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {selectedVehicle && (
          <>
            {/* Identification Section */}
            <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                  Identification
                </Typography>
                <Grid container spacing={1.4}>
                  {[
                    { label: "Numéro Immatriculation", value: selectedVehicle.num_immatriculation, icon: <ConfirmationNumberIcon sx={{ color: '#1976d2' }} aria-label="Numéro Immatriculation" /> },
                    { label: "Numéro de chassis", value: selectedVehicle.n_serie_du_type, icon: <BuildIcon sx={{ color: '#1976d2' }} aria-label="Numéro de chassis" /> },
                    { label: "Marque", value: selectedVehicle.marque, icon: <DirectionsCarIcon sx={{ color: '#1976d2' }} aria-label="Marque" /> },
                    { label: "Modèle", value: selectedVehicle.modele, icon: <DeviceHubIcon sx={{ color: '#1976d2' }} aria-label="Modèle" /> },
                  ].map((item, index) => (
                    <Grid item xs={6} key={index} display="flex" alignItems="center">
                      {item.icon}
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333', marginLeft: 1 }}>
                        {item.label} :
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#b12222', marginLeft: 1 }}>
                        {item.value || "Non spécifié"}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Caractéristiques Section */}
            <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                  Caractéristiques
                </Typography>
                <Grid container spacing={1.4}>
                  {[
                    { label: "Prix par jour", value: selectedVehicle.prix_jour ,icon:<AttachMoneyIcon sx={{ color: '#1976d2' }}/>},
                    { label: "Carrosserie", value: selectedVehicle.carrosserie, icon: <CarRepairIcon sx={{ color: '#1976d2' }} aria-label="Carrosserie" /> },
                    { label: "Énergie", value: selectedVehicle.energie, icon: <LocalGasStationIcon sx={{ color: '#1976d2' }} aria-label="Énergie" /> },
                    { label: "Puissance Fiscale", value: selectedVehicle.puissance_fiscale, icon: <SpeedIcon sx={{ color: '#1976d2' }} aria-label="Puissance Fiscale" /> },
                    { label: "Nombre de Places", value: selectedVehicle.nbr_places, icon: <PeopleIcon sx={{ color: '#1976d2' }} aria-label="Nombre de Places" /> },
                    { label: "Cylindrée", value: selectedVehicle.cylindree, icon: <SettingsInputComponentIcon sx={{ color: '#1976d2' }} aria-label="Cylindrée" /> },
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

            {/* Certificat Section */}
            <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                  Certificat
                </Typography>
                <Grid container spacing={1.4}>
                  {[
                    { label: "Numéro Certificat", value: selectedVehicle.num_certificat, icon: <DescriptionIcon sx={{ color: '#1976d2' }} aria-label="Numéro Certificat" /> },
                    { label: "Lieu Certificat", value: selectedVehicle.lieu_certificat, icon: <LocationOnIcon sx={{ color: '#1976d2' }} aria-label="Lieu Certificat" /> },
                    { label: "Date Certificat", value: selectedVehicle.date_certificat, icon: <CalendarTodayIcon sx={{ color: '#1976d2' }} aria-label="Date Certificat" /> },
                    { label: "Catégorie", value: selectedVehicle.catégorie, icon: <CategoryIcon sx={{ color: '#1976d2' }} aria-label="Catégorie" /> },
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
          </>
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

export default AfficherVehicule;