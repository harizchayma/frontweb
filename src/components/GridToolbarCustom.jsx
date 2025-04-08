import React from "react";
import {
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";

function GridToolbarCustom() {
  return (
    <GridToolbarContainer>
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        <div>
        <GridToolbarColumnsButton
  title="Colonnes" // Explicitly in French
  sx={{ marginRight: 1 }}
/>
<GridToolbarFilterButton
  title="Filtres" // Explicitly in French
  sx={{ marginRight: 1 }}
/>
<GridToolbarDensitySelector
  title="Densité" // Explicitly in French
  sx={{ marginRight: 1 }}
/>
<GridToolbarExport
  title="Exporter" // Explicitly in French
  sx={{ marginRight: 1 }}
/>

        </div>

    
      </Box>
    </GridToolbarContainer>
  );
}

export default GridToolbarCustom;
