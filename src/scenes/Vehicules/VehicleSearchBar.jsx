import React, { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  MenuItem,
  Grid,
} from "@mui/material";
import DirectionsCar from "@mui/icons-material/DirectionsCar";
import axios from "axios";

const VehicleSearchBar = ({ onVehicleSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch vehicles and categories on component mount
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:7001/vehicules`);
        const allVehicles = response.data.data;
        console.log("Fetched Vehicles:", allVehicles); // Debugging line
        setVehicles(allVehicles);
        setFilteredVehicles(allVehicles); // Initialize filtered vehicles
      } catch (error) {
        console.error("Erreur lors de la récupération des véhicules:", error);
        setErrorMessage("Erreur lors de la recherche du véhicule.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:7001/categorie");
        console.log("Fetched Categories:", response.data.data); // Debugging line
        setCategories(response.data.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories", error);
      }
    };

    fetchVehicles();
    fetchCategories();
  }, []);

  // Filter vehicles based on search term and selected category
  useEffect(() => {
    filterVehicles();
  }, [searchTerm, selectedCategory, vehicles]);

  const filterVehicles = () => {
    let filtered = vehicles;

    // Filter by category if one is selected
    if (selectedCategory) {
      console.log(`Filtering vehicles by category: ${selectedCategory}`); // Debugging line
      filtered = filtered.filter(
        (vehicle) => vehicle.id_categorie === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.marque.toLowerCase().includes(lowerSearchTerm) ||
          vehicle.modele.toLowerCase().includes(lowerSearchTerm) ||
          vehicle.num_immatriculation.toString().includes(lowerSearchTerm)
      );
    }

    console.log("Filtered vehicles:", filtered); // Debugging line for filtered vehicles
    setFilteredVehicles(filtered);
    setErrorMessage(
      filtered.length === 0 && searchTerm ? "Aucun véhicule trouvé." : ""
    );
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSearchTerm(""); // Clear search term when category changes
  };

  return (
    <div>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={8}>
          <TextField
            label="Rechercher Véhicule"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              style: { width: "200px", borderColor: "#f0112b" }, 
              startAdornment: <DirectionsCar />,
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Sélectionner une catégorie"
            value={selectedCategory}
            onChange={handleCategoryChange}
            fullWidth
            sx={{ width: "200px" }}
          >
            <MenuItem value="">
              <em>Toutes les catégories</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem
                key={category.id_categorie}
                value={category.id_categorie}
              >
                {category.catégorie}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Error message styled in red */}
      {errorMessage && (
        <Typography variant="h6" sx={{ color: "red" }} aria-live="assertive">
          {errorMessage}
        </Typography>
      )}
      {loading && <CircularProgress />}
      {searchTerm &&
        filteredVehicles.length > 0 && ( // Only show the list if there is a search term and vehicles found
          <List>
            {filteredVehicles.map((vehicle) => (
              <ListItem
                button
                key={vehicle.num_immatriculation}
                onClick={() => onVehicleSelect(vehicle)}
              >
                <ListItemText
                  primary={`Immatriculation: ${vehicle.num_immatriculation}`}
                  secondary={`${vehicle.marque} ${vehicle.modele}`}
                  sx={{ color: "#f0112b" }} // Previously incorrect code corrected here
                />
              </ListItem>
            ))}
          </List>
        )}
      {searchTerm && filteredVehicles.length === 0 && (
        <Typography variant="body1" sx={{ color: "red" }}>
          Aucun véhicule trouvé.
        </Typography>
      )}
    </div>
  );
};

export default VehicleSearchBar;
