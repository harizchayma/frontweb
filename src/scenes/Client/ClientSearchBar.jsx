import React, { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Paper,
  IconButton
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import axios from "axios";
import ClearIcon from "@mui/icons-material/Clear"; // For clearing the search input

const ClientSearchBar = ({ onClientSelect, onClose }) => {

  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClientSelect = (client) => {
    onClientSelect(client);
    onClose(); // This will close the client list
  };
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:7001/client`);
        setClients(response.data.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setErrorMessage("Erreur lors de la recherche du client.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    if (clients.length > 0) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = clients.filter(client =>
        client.nom_fr.toLowerCase().includes(lowerSearchTerm) ||
        client.prenom_fr.toLowerCase().includes(lowerSearchTerm) ||
        client.cin_client.toString().includes(lowerSearchTerm)
      );
      setFilteredClients(filtered);
      setErrorMessage(filtered.length === 0 && searchTerm ? "Aucun client trouvé." : "");
    } else {
      setFilteredClients([]);
    }
  }, [searchTerm, clients]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm(""); // Clear the search input
  };

  return (
    <div>
      <TextField
        label="Rechercher Client"
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: <AccountCircle sx={{ color: "#1976d2" }} />,
          endAdornment: (
            <IconButton
               onClick={() => setSearchTerm("")}
              sx={{ visibility: searchTerm ? 'visible' : 'hidden' }}  // Only show when there's text to clear
            >
              <ClearIcon sx={{ color: "#1976d2" }} />
            </IconButton>
          ),
        }}
        fullWidth
        sx={{
          mb: 0,
          bgcolor: "#f7f7f7", // Light gray background for the text field
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#1976d2',
            },
            '&:hover fieldset': {
              borderColor: '#115293',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0d47a1',
            },
          },
        }}
      />
      {errorMessage && (
        <Typography variant="body2" color="error" aria-live="assertive">
          {errorMessage}
        </Typography>
      )}
      {loading && <CircularProgress />}
      {searchTerm && (
        <Paper elevation={2} sx={{ maxHeight: 300, overflowY: 'auto' }}>
           <List>
            {filteredClients.map((client) => (
              <ListItem
                button
                key={client.cin_client}
                onClick={() => handleClientSelect(client)} // Utilisez la nouvelle fonction
                sx={{
                  '&:hover': {
                    backgroundColor: '#e1f5fe',
                  },
                }}
              >
                <ListItemText
                  primary={`CIN: ${client.cin_client}`}
                  secondary={`${client.nom_fr} ${client.prenom_fr}`}
                  primaryTypographyProps={{
                    sx: { fontWeight: '600', color: '#1976d2' },
                  }}
                  secondaryTypographyProps={{
                    sx: { color: '#555', fontStyle: 'italic' },
                  }} 
                />
              </ListItem>
            ))}
            {filteredClients.length === 0 && (
              <Typography variant="body1" color="grey" align="center" sx={{ mt: 1}}>
                Aucun client trouvé.
              </Typography>
            )}
          </List>
        </Paper>
      )}
    </div>
  );
};

export default ClientSearchBar;