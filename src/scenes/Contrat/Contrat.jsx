import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip ,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { tokens } from "../../theme";
import { Header } from "../../components";
import AjouteContrat from "./AjouteContrat";
import logo from "../../assets/images/nom.png";
import etat from "../../assets/images/car.png";
import AfficherContrat from "./AffichierContrat";
import ModifieContrat from "./ModifieContrat";
import { useAuth } from "../context/AuthContext";
import Visibility from "@mui/icons-material/Visibility";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Print from "@mui/icons-material/Print";
import AdvanceIcon from "@mui/icons-material/MonetizationOn"; // Icône pour l'avance
import ChauffeurIcon from "@mui/icons-material/Person"; // Icône pour le chauffeur
import AjouteChauffeurIcon from "./AjouteChauffeurIcon";
import AvanceContratIcon from "./IconAvance";
import { frFR } from "@mui/x-data-grid";
import GridToolbarCustom from "../../components/GridToolbarCustom";
const Contrat = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { role } = useAuth();
  const customColors =
    role === "Admin"
      ? { background: "#3c90f0", hover: "#2a3eb1", tableHeader: "#6da5ee" } // Admin colors
      : { background: "#a0d3e8", hover: "#7ab8d9", tableHeader: "#bcccdf" }; // User colorss
  const initialContractState = () => ({
    Date_debut: "",
    Heure_debut: "",
    Date_retour: "",
    Heure_retour: "",
    Duree_location: "",
    Prolongation: "",
    Numero_contrat: "",
    num_immatriculation: "",
    cin_client: "",
    Prix_total: "",
    mode_reglement_garantie: "",
    montant: "",
    echeance: "",
    numero_piece: "",
    banque: "",
    frais_retour: "",
    frais_carburant: "",
    frais_chauffeur: "",
  });

  const initialClientState = {
    nom_fr: "",
    nom_ar: "",
    prenom_fr: "",
    prenom_ar: "",
    cin_client: "",
    date_cin: "",
    date_naiss: "",
    adresse_fr: "",
    adresse_ar: "",
    num_tel: "",
    Numero_Permis: "",
    date_permis: "",
    profession_fr: "",
    profession_ar: "",
    nationalite_origine: "",
  };
  const [openAvanceDialog, setOpenAvanceDialog] = useState(false);
  const [data, setData] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newContract, setNewContract] = useState(initialContractState());
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [allChauffeursAdded, setAllChauffeursAdded] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [openAfficherContrat, setOpenAfficherContrat] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [openModifieContrat, setOpenModifieContrat] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openChauffeurDialogs, setOpenChauffeurDialogs] = useState({});
  const [openChauffeurDialog, setOpenChauffeurDialog] = useState(false);
  const [newChauffeurs, setNewChauffeurs] = useState({});
  const [selectedContractNumber, setSelectedContractNumber] = useState(null);
  const [newChauffeur, setNewChauffeur] = useState({
    numero_contrat: "",
    nom_fr: "",
    nom_ar: "",
    prenom_fr: "",
    prenom_ar: "",
    cin_chauffeur: "",
    date_cin_chauffeur: "",
    date_naiss: "",
    adresse_fr: "",
    adresse_ar: "",
    num_tel: "",
    numero_permis: "",
    date_permis: "",
    profession_fr: "",
    profession_ar: "",
    nationalite_origine: "",
  });
  const handleAddChauffeur = async (row) => {
    try {
      const currentChauffeurs = await fetchChauffeur(row.Numero_contrat);
      if (currentChauffeurs.length >= 3) {
        alert(
          "Ce contrat a déjà 3 chauffeurs. Vous ne pouvez pas en ajouter d'autres."
        );
        return;
      }

      setSelectedContractNumber(row.Numero_contrat);
      setOpenChauffeurDialog(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des chauffeurs:", error);
      alert(
        "Il y a eu une erreur lors de la récupération des chauffeurs. Vérifiez votre connexion."
      );
    }
  };

  const handleModify = (contract) => {
    setSelectedContract(contract);
    setOpenModifieContrat(true);
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  const handleAddContract = async (contractData, clientInfo, prix_jour) => {
    try {
      const duration = calculateDuration(
        contractData.Date_debut,
        contractData.Date_retour
      );

      const formattedContract = {
        Date_debut: contractData.Date_debut
          ? new Date(contractData.Date_debut).toISOString()
          : null,
        Heure_debut: contractData.Heure_debut || null, // Directly use the value
        Date_retour: contractData.Date_retour
          ? new Date(contractData.Date_retour).toISOString()
          : null,
        Heure_retour: contractData.Heure_retour || null, // Directly use the value
        Duree_location: duration,
        Numero_contrat: contractData.Numero_contrat || null,
        Prix_total: contractData.Prix_total || null,
        Prolongation: contractData.Prolongation ? null : null,
        num_immatriculation: contractData.num_immatriculation || null,
        cin_client: clientInfo.cin_client || null,
        banque: contractData.banque || null,
        echeance: contractData.echeance
          ? new Date(contractData.echeance).toISOString()
          : null,
        frais_retour: parseFloat(contractData.frais_retour) || 0,
        frais_carburant: parseFloat(contractData.frais_carburant) || 0,
        frais_chauffeur: parseFloat(contractData.frais_chauffeur) || 0,
        mode_reglement_garantie: contractData.mode_reglement_garantie || null,
        montant: parseFloat(contractData.montant) || 0,
        numero_piece: contractData.numero_piece || null,
      };

      console.log("Données du contrat à envoyer:", formattedContract);
      const response = await axios.post(
        "http://localhost:7001/contrat",
        formattedContract
      );
      const addedContract = response.data.data;

      setNewContract((prev) => ({
        ...prev,
        Numero_contrat: addedContract.Numero_contrat,
      }));
      setData((prevData) => [
        ...prevData,
        { ...addedContract, id: addedContract.ID_contrat },
      ]);

      setSnackbarMessage("Contrat ajouté avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erreur lors de l'ajout du contrat:", error);
      setSnackbarMessage(
        "Erreur: " + (error.response?.data?.message || error.message)
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  const isVehicleAvailable = (vehicle, startDate, endDate, contracts) => {
    return !contracts.some((contract) => {
      const contractStartDate = new Date(contract.Date_debut);
      const contractEndDate = new Date(contract.Date_retour);
      const vehicleImmatriculation = contract.num_immatriculation;

      return (
        vehicle.num_immatriculation === vehicleImmatriculation &&
        contractStartDate <= endDate &&
        contractEndDate >= startDate
      );
    });
  };
  const filteredAvailableVehicles = availableVehicles.filter((vehicle) =>
    isVehicleAvailable(
      vehicle,
      new Date(newContract.Date_debut),
      new Date(newContract.Date_retour),
      data
    )
  );
  const handleAddOpen = async () => {
    await generateNextContractNumber();
    console.log("Numéro de contrat généré:", newContract.Numero_contrat);

    // Filtrer les véhicules disponibles
    const filteredAvailableVehicles = availableVehicles.filter((vehicle) =>
      isVehicleAvailable(
        vehicle,
        new Date(newContract.Date_debut),
        new Date(newContract.Date_retour),
        data
      )
    );

    setOpenAddDialog(true);
    setAvailableVehicles(filteredAvailableVehicles); // Mettez à jour la liste des véhicules disponibles
  };
  const handleAdvance = (row) => {
    setSelectedContract(row); // Stockez les données du contrat sélectionné
    setOpenAvanceDialog(true); // Ouvrez le dialogue
  };
  const handleCloseAvanceDialog = () => {
    setOpenAvanceDialog(false); // Fermez le dialogue
    setSelectedContract(null); // Réinitialisez le contrat sélectionné si nécessaire
  };
  const handleAddContractAndOpenChauffeur = async () => {
    try {
      await handleAddContract();
      const nombreChauffeurs = parseInt(
        newContract["Nombre de chauffeur"] || 0
      );
      if (nombreChauffeurs > 0 && newContract.Numero_contrat) {
        console.log("Opening chauffeur dialog");
        setOpenChauffeurDialogsProp(true);
      } else {
        console.error("Numero_contrat is not defined or no chauffeurs needed.");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du contrat:", error);
    }
  };

  const handleOpenChauffeurDialog = (index) => {
    if (newContract.Numero_contrat) {
      setOpenChauffeurDialogs((prev) => ({ ...prev, [index]: true }));
      setNewChauffeurs((prev) => ({
        ...prev,
        [index]: { ...prev[index], numero_contrat: newContract.Numero_contrat },
      }));
    } else {
      console.error("Numero_contrat is not defined.");
    }
  };

  const handleCloseChauffeurDialog = (index) => {
    setOpenChauffeurDialogs((prev) => ({ ...prev, [index]: false }));
    setNewChauffeurs((prev) => ({
      ...prev,
      [index]: {
        nom_fr: "",
        nom_ar: "",
        prenom_fr: "",
        prenom_ar: "",
        cin_chauffeur: "",
        date_cin_chauffeur: "",
        date_naiss: "",
        adresse_fr: "",
        adresse_ar: "",
        num_tel: "",
        numero_permis: "",
        date_permis: "",
        profession_fr: "",
        profession_ar: "",
        nationalite_origine: "",
        Numero_contrat: newContract.Numero_contrat,
      },
    }));
  };

  const generateNextContractNumber = async () => {
    try {
      const response = await axios.get("http://localhost:7001/contrat");
      const contrats = response.data.data;

      if (contrats.length > 0) {
        const lastContractNumber = contrats.reduce((max, contract) => {
          const num = parseInt(contract.Numero_contrat.replace(/\D/g, ""), 10);
          return num > max ? num : max;
        }, 0);

        const nextContractNumber = `AC${(lastContractNumber + 1)
          .toString()
          .padStart(4, "0")}`;
        setNewContract((prev) => ({
          ...prev,
          Numero_contrat: nextContractNumber,
        }));
      } else {
        setNewContract((prev) => ({ ...prev, Numero_contrat: "AC0001" }));
      }
    } catch (error) {
      console.error(
        "Erreur lors de la génération du numéro de contrat:",
        error
      );
      setNewContract((prev) => ({ ...prev, Numero_contrat: "AC0001" })); // Valeur par défaut en cas d'erreur
    }
  };

  const handleAddClose = () => {
    setOpenAddDialog(false);
    setNewContract(initialContractState());
    setOpenChauffeurDialog(false);
  };
  const handleView = async (contract) => {
    setSelectedContract(contract);

    try {
      // Récupération des détails du client
      const clientResponse = await axios.get(
        `http://localhost:7001/client?cin_client=${contract.cin_client}`
      );
      const clientData = clientResponse.data.data;

      if (clientData && clientData.length > 0) {
        const matchedClient = clientData.find(
          (client) => client.cin_client === contract.cin_client
        );
        setSelectedClient(matchedClient || null);
      } else {
        console.error("Client not found for CIN:", contract.cin_client);
        setSelectedClient(null);
      }

      // Récupération du véhicule par immatriculation
      const vehicleResponse = await fetchVehiculeByImmatriculation(
        contract.num_immatriculation
      );
      setSelectedVehicle(vehicleResponse);

      setOpenAfficherContrat(true);
    } catch (error) {
      console.error("Error fetching client or vehicle details:", error);
    }
  };
  useEffect(() => {
    fetchData();
    fetchAvailableVehicles();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:7001/contrat");
      const contracts = response.data.data;
  
      const completeContracts = await Promise.all(
        contracts.map(async (contract) => {
          // Assume each 'contract' is an object containing 'dataValues'
          const contractData = contract.dataValues || contract;
  
          try {
            // Récupérer les données du client en fonction du CIN
            const clientResponse = await axios.get(
              `http://localhost:7001/client?cin_client=${contractData.cin_client}`
            );
            const clientData = clientResponse.data.data;
  
            // Trouver le client correspondant au CIN du contrat
            const client = clientData.find(
              (client) => client.cin_client === contractData.cin_client
            );
  
            return {
              ...contractData,
              id: contractData.ID_contrat, // Use the ID from the contract data
              clientName: client ? `${client.nom_fr} ${client.prenom_fr}` : "Non défini",
            };
          } catch (clientError) {
            console.error("Erreur lors de la récupération du client:", clientError);
            return {
              ...contractData,
              id: contractData.ID_contrat,
              clientName: "Client inconnu",
            };
          }
        })
      );
  
      setData(completeContracts);
    } catch (error) {
      console.error("Erreur lors de la récupération des contrats:", error);
    }
  };

  const fetchAvailableVehicles = async () => {
    try {
      const response = await axios.get("http://localhost:7001/vehicules");
      setAvailableVehicles(response.data.data);
    } catch (error) {
      console.error("Error fetching available vehicles", error);
    }
  };

  const fetchVehiculeByImmatriculation = async (num_immatriculation) => {
    try {
      const response = await axios.get(
        "http://localhost:7001/vehicules?num_immatriculation=${num_immatriculation}"
      );
      const vehicles = response.data.data;
      const selectedVehicle = vehicles.find(
        (vehicle) => vehicle.num_immatriculation === num_immatriculation
      );
      return selectedVehicle || null;
    } catch (error) {
      console.error("Erreur lors de la récupération du véhicule :", error);
      return null;
    }
  };

  const fetchChauffeur = async (numeroContrat) => {
    try {
      const response = await axios.get(
        `http://localhost:7001/chauffeur?Numero_contrat=${numeroContrat}`
      );
      if (response.data && response.data.data) {
        return response.data.data.filter(
          (chauffeur) => chauffeur.Numero_contrat === numeroContrat
        );
      }
      return [];
    } catch (error) {
      console.error("Error fetching chauffeurs", error);
      return [];
    }
  };
  const handleAllChauffeursAdded = () => {
    setAllChauffeursAdded(true);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleDeleteContract = async () => {
    if (!selectedContract) return;

    try {
      await axios.delete(
        `http://localhost:7001/contrat/${selectedContract.ID_contrat}`
      );
      setData((prevData) =>
        prevData.filter((c) => c.ID_contrat !== selectedContract.ID_contrat)
      );
      setSnackbarMessage("Contrat supprimé avec succès!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting contract", error);
      setSnackbarMessage("Erreur lors de la suppression du contrat.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setOpenDeleteDialog(false); // Close the delete confirmation dialog
    }
  };

  const confirmDelete = () => {
    handleDeleteContract();
  };
  const formatPrice = (price) => {
    if (price === null || price === undefined) return "N/A";
    return price.toFixed(3).toString().replace(".", ","); // Formate avec 3 décimales et remplace le point par une virgule
  };
  const handlePrint = async (contract) => {
    const chauffeurs = await fetchChauffeur(contract.Numero_contrat);
    const vehicules = await fetchVehiculeByImmatriculation(
      contract.num_immatriculation
    );
    const printWindow = window.open("", "_blank");

    let chauffeursInfo = "";
    chauffeurs.forEach((chauffeur, index) => {
      if (chauffeur && chauffeur.Numero_contrat === contract.Numero_contrat) {
        chauffeursInfo += `
        <div class="conducteur-info">
          <div class="conducteur-titre">${index + 1}${
          index === 0 ? "er" : "ème"
        } Conducteur / سائق</div>
          <div class="info">
            <div class="title-fr">Nom & Prénom</div>
            <div class="value">${chauffeur.nom_ar} ${chauffeur.prenom_ar}</div>
            <div class="title-ar">الاسم واللقب</div>
          </div>
          <div class="info">
            <div class="title-fr">Date de Naissance</div>
            <div class="value">${chauffeur.date_naiss || "N/A"}</div>
            <div class="title-ar">تاريخ الميلاد</div>
          </div>
          <div class="info">
            <div class="title-fr">Profession</div>
            <div class="value">${chauffeur.profession_ar || "N/A"}</div>
            <div class="title-ar">المهنة</div>
          </div>
          <div class="info">
            <div class="title-fr">Nationalité d'Origine</div>
            <div class="value">${chauffeur.nationalite_origine || "N/A"}</div>
            <div class="title-ar">الجنسية الأصلية</div>
          </div>
          <div class="info">
            <div class="title-fr">Passeport ou CIN</div>
            <div class="value">${chauffeur.cin_chauffeur || "N/A"}</div>
            <div class="title-ar">رقم جواز السفر أو بطاقة الهوية</div>
          </div>
          <div class="info">
            <div class="title-fr">Délivré le</div>
            <div class="value">${chauffeur.date_cin_chauffeur || "N/A"}</div>
            <div class="title-ar">تاريخ الإصدار</div>
          </div>
          <div class="info">
            <div class="title-fr">Adresse</div>
            <div class="value">${chauffeur.adresse_fr || "N/A"}</div>
            <div class="title-ar">العنوان</div>
          </div>
          <div class="info">
            <div class="title-fr">Permis de Conduite</div>
            <div class="value">${chauffeur.numero_permis || "N/A"}</div>
            <div class="title-ar">رخصة القيادة</div>
          </div>
          <div class="info">
            <div class="title-fr">Délivré le</div>
            <div class="value">${chauffeur.date_permis || "N/A"}</div>
            <div class="title-ar">تاريخ الإصدار</div>
          </div>
          <div class="info">
            <div class="title-fr">GSM/Tél</div>
            <div class="value">${chauffeur.num_tel || "N/A"}</div>
            <div class="title-ar">الهاتف</div>
          </div>
        </div>
      `;
      }
    });

    printWindow.document.write(`
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0px;
          color: #333;
        }
        .contract {
          max-width: 800px;
          margin: 1px;
          padding: 0px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .company-info {
          text-align: center; 
          margin-bottom: 5px;
        }
        .contract-title {
          text-align: center; 
          margin: 5px 0; 
          font-size: 15px; 
          font-weight: bold;
        }
        .container {
          display: flex; 
          justify-content: space-between;
        }
        .left {
          width: 40%; 
          margin-bottom: 2px; 
          border: 1px solid #ccc; 
          padding:10px; 
          border-radius: 5px; 
          font-size: 10px;
        }
        .right {
          width: 50%; 
          display: flex; 
          flex-direction: column; 
          align-items: flex-end; 
        }
        .info {
          display: flex; 
          justify-content: space-between;
          margin: 10px 0;
        }
        .conducteur-info {
          margin-bottom: 10px; 
          border: 1px solid #ccc; 
          padding: 20px; 
          border-radius: 5px; 
          font-size: 13px; 
          width: 100%; 
        }
        .conducteur-titre {
          font-weight: bold; 
          margin-bottom: 15px; 
          font-size: 18px; 
        }
        .title-fr {
        font-weight: bold;
          width: 45%; 
          text-align: left;
        }
        .title-ar {
        font-weight: bold;
          width: 45%; 
          text-align: right;
        }
        .value {
          width: 55%; 
          text-align: center;
        }
        .signature-area {
          margin-top: 40px; 
          display: flex; 
          justify-content: space-between; 
        }
        .signature {
          width: 150px; 
          height: 50px; 
          border: 1px dashed #000; 
          margin-bottom: 5px; 
        }
        .notes-area {
          margin-top: 20px; 
          font-size: 12px; 
          text-align: center; 
        }
          .etat-image {
max-width: 50%;
height: auto; /* Maintain aspect ratio */
} @media print { 
 body { margin: 0; padding: 0; } .contract { border: none; box-shadow: none; } } 
 </style>
  </head> 
  <body> 
  <div class="contract">
   <div class="company-info"> 
   <img src="${logo}" alt="Logo" style="max-width: 15%; height: 15%; margin-bottom: 1px;">
    </div> <h2 class="contract-title">Contrat de location / عقد الإيجار</h2> <div class="container"> 
    <div class="left"> 
    <div class="info">
     <div class="title-fr">Type de voiture / نوع السيارة:</div> 
     <div class="value">${
       vehicules ? vehicules.marque + " " + vehicules.modele : "N/A"
     }</div>
      </div> 
      <div class="info"> 
      <div class="title-fr">Immatriculation / رقم التسجيل:</div> 
      <div class="value">${contract.num_immatriculation || "N/A"}</div> 
      </div> <div class="info"> 
      <div class="title-fr">Carburant / نوع الوقود:</div> 
      <div class="value">${vehicules ? vehicules.energie : "N/A"}</div> 
      </div> <div class="info"> 
      <div class="title-fr">Date de Départ / تاريخ المغادرة:</div> 
      <div class="value">${contract.Date_debut || "N/A"}</div>
       </div>
        <div class="info"> 
        <div class="title-fr">Heure / الوقت:</div>
         <div class="value">${contract.Heure_debut || "N/A"}</div> 
         </div>
          <div class="info"> 
          <div class="title-fr">Date de Retour / تاريخ العودة:</div>
           <div class="value">${contract.Date_retour || "N/A"}</div> 
           </div> 
           <div class="info">
            <div class="title-fr">Heure / الوقت:</div> 
            <div class="value">${contract.Heure_retour || "N/A"}</div> 
            </div> 
            <div class="info"> 
            <div class="title-fr">Durée de la location / مدة الإيجار:</div> 
            <div class="value">${contract.Duree_location || "N/A"}</div>
             </div> 
             <div class="info"> <div class="title-fr">Prolongation / تمديد:</div>
              <div class="value">${contract.Prolongation || "N/A"}</div> 
              </div> <div class="info"> 
              <div class="title-fr">Agence de Retour / وكالة العودة:</div> 
              <div class="value">${contract.Agence_retour || ""}</div> 
              </div> 
              <div class="caution-div"> 
              <p><strong>Caution:</strong></p>
               <p>Paiement de Jours en excès, heures en, km en excés</p>
                <p>Avance sur le montant de dégâts survenus au véhicules</p>
                 <p>Paiement de remorquage</p> <p>Infraction Routière</p> 
                 </div> <img src="${etat}" alt="État du véhicule" class="etat-image" style="max-width: 50%; height: auto;"/>
                  <div class="info"> 
                  <div class="title-fr">Kilométrage:</div>
                   <div class="value">${contract.Kilometrage || "0"}</div> 
                   </div> 
                   <div class="info"> 
                   <div class="title-fr">Carburant:</div>
                    <div class="value">${contract.frais_carburant || ""}</div>
                     </div> <div class="info">
                      <div class="title-fr">État de Pneu:</div>
                       <div class="value">${contract.Etat_pneu || ""}</div>
                        </div> 
                        <div class="info"> 
                        <div class="title-fr">État Intérieur:</div>
                         <div class="value">${
                           contract.Etat_interieur || ""
                         }</div>
                          </div> 
                          <div class="info"> 
                          <div class="title-fr">Tarif:</div> 
                          <div class="value">${contract.Prix_total || ""}</div> 
                          </div> 
                          <div class="info"> 
                          <div class="title-fr">Frais de Retour:</div>
                           <div class="value">${
                             contract.frais_retour || ""
                           }</div> 
                           </div> 
                           <div class="info"> <div class="title-fr">Reste:</div> 
                           <div class="value">${contract.Reste || ""}</div> 
                           </div> 
                           <div class="info"> 
                           <div class="title-fr">Total Location en TTC:</div> 
                           <div class="value">${
                             formatPrice(contract.Prix_total * 1.19) || "N/A"
                           }</div> 
                           </div>
                            </div> 
                            <div class="right"> ${
                              chauffeursInfo ||
                              "<p>Aucun chauffeur associé à ce contrat / لا يوجد سائق مرتبط بهذا العقد</p>"
                            } 
                            </div>
                             </div> <div class="signature-area"> <div> 
                            <div class="signature">
                            </div>
                             <p>Signature du Client / توقيع العميل</p> </div> 
                             <div> 
                             <div class="signature"></div> 
                             <p>Visa Rander Car / تأشيرة رندر كار</p>
                              </div>
                               </div>
                                <div class="notes-area">
                                 <p><strong>A conserver: / يجب الاحتفاظ به:</strong> ce document doit être présenté à tout contrôle des agents de la sûreté nationale / يجب تقديم هذا المستند عند أي تفتيش من قبل ضباط الأمن الوطني.</p> 
                                 <p>Bonne route et soyez prudent / طريق آمن وكن حذرًا.</p> 
                                 </div> 
                                 </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const columns = [
    { field: "Numero_contrat", headerName: "Numéro de Contrat", width: 140 },
    {
      field: "num_immatriculation",
      headerName: "Numéro d'Immatriculation",
      width: 150,
    },
    { field: "clientName", headerName: "Client", width: 140 },
    { field: "Date_debut", headerName: "Date de Début", width: 120 },
    { field: "Date_retour", headerName: "Date de Retour", width: 120 },
    {
      field: "action",
      headerName: "Action",
      width: 400, // Augmenter encore un peu la largeur pour les tooltips
      renderCell: (params) => (
        <Box display="flex">
          <Tooltip title="Voir le contrat">
            <IconButton
              sx={{ color: "#3d59d5", marginRight: 1 }}
              onClick={() => handleView(params.row)}
              aria-label={`View contract ${params.row.Numero_contrat}`}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          {role === "Admin" && (
            <>
              <Tooltip title="Modifier le contrat">
                <IconButton
                  sx={{ color: "#3db351", marginRight: 1 }}
                  onClick={() => handleModify(params.row)}
                  aria-label={`Edit contract ${params.row.Numero_contrat}`}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Supprimer le contrat">
                <IconButton
                  sx={{ color: "error.main", marginRight: 1 }}
                  onClick={() => {
                    setSelectedContract(params.row);
                    setOpenDeleteDialog(true);
                  }}
                  aria-label={`Delete contract ${params.row.Numero_contrat}`}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
              <Tooltip title="Imprimer le contrat">
                <IconButton
                  sx={{ color: "#2d2c81", marginRight: 1 }}
                  onClick={() => handlePrint(params.row)}
                  aria-label={`Print contract ${params.row.Numero_contrat}`}
                >
                  <Print />
                </IconButton>
              </Tooltip>
              <Tooltip title="Ajouter un avance">
                <IconButton
                  sx={{ color: "#ffb300", marginRight: 1 }}
                  onClick={() => handleAdvance(params.row)} // Référence pour le traitement d'avance
                  aria-label={`Advance payment for contract ${params.row.Numero_contrat}`}
                >
                  <AdvanceIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Ajouter un chauffeur">
                <IconButton
                  sx={{ color: "#5c6bc0", marginRight: 1 }}
                  onClick={() => handleAddChauffeur(params.row)}
                  aria-label={`Add driver for contract ${params.row.Numero_contrat}`}
                >
                  <ChauffeurIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      ),
    },
  ];
  console.log("Data before DataGrid:", data);
  return (
    <Box m="5px" sx={{ padding: "10px" }}>
      <Header title="Contrats" />

      <Button
        variant="contained"
        sx={{
          backgroundColor: "#3c90f0",
          color: "white",
          fontSize: "0.875rem",
          padding: "10px 20px",
          borderRadius: "20px",
          marginBottom: "15px",
          "&:hover": {
            backgroundColor: "#2a3eb1",
          },
        }}
        onClick={handleAddOpen}
      >
        Ajoute Contrat
      </Button>

      <Box
        sx={{
          height: "60vh",
          width: "90%",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.ID_contrat}
          components={{
            Toolbar: GridToolbarCustom, // Custom toolbar
          }}
          localeText={{
            ...frFR.components.MuiDataGrid.defaultProps.localeText, // French default localization
          }}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          checkboxSelection
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: customColors.tableHeader,
              borderBottom: "none",
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: customColors.tableHeader,
              borderTop: "none",
            },
          }}
        />
      </Box>
      <AfficherContrat
        open={openAfficherContrat}
        handleClose={() => setOpenAfficherContrat(false)}
        selectedContrat={selectedContract}
        selectedClient={selectedClient}
        selectedVehicle={selectedVehicle}
      />
      <ModifieContrat
        open={openModifieContrat}
        handleClose={() => setOpenModifieContrat(false)}
        contrat={selectedContract}
        setContrat={setSelectedContract}
        handleUpdateContrat={(updatedContract) => {
          setData((prevData) =>
            prevData.map((c) =>
              c.ID_contrat === updatedContract.ID_contrat ? updatedContract : c
            )
          );
        }}
      />
      <AjouteChauffeurIcon
        open={openChauffeurDialog}
        handleClose={() => setOpenChauffeurDialog(false)}
        defaultContractNumber={selectedContractNumber} // Assurez-vous que ça correspond bien
        onChauffeurAdded={() => {
          setOpenChauffeurDialog(false); // Fermer le dialogue mais ne pas changer de page
          fetchData(); // Si vous voulez mettre à jour l'affichage des chauffeurs
        }}
      />
      <AjouteContrat
        open={openAddDialog}
        handleClose={handleAddClose}
        newContract={newContract}
        setNewContract={setNewContract}
        handleAddContract={handleAddContract}
        availableVehicles={filteredAvailableVehicles} // Utilisez la liste filtrée ici
        onAllChauffeursAdded={handleAllChauffeursAdded}
        setOpenChauffeurDialogsProp={setOpenChauffeurDialog}
      />
      <AvanceContratIcon
        open={openAvanceDialog}
        handleClose={handleCloseAvanceDialog}
        defaultContractNumber={
          selectedContract ? selectedContract.Numero_contrat : ""
        }
        cinClient={selectedContract ? selectedContract.cin_client : ""}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          <p>Êtes-vous sûr de vouloir supprimer ce Contrat ?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={confirmDelete} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Contrat;
