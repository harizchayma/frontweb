import React, { useEffect } from 'react';
import logo from "../../assets/images/nom.png"; 
import etat from "../../assets/images/etat.png";
const PrintContrat = ({ contract }) => {
  useEffect(() => {
    const printContract = async () => {
      const chauffeurs = await fetchChauffeur(contract.Numero_contrat);
      const vehicules = await fetchVehiculeByImmatriculation(contract.num_immatriculation);
      const printWindow = window.open("", "_blank");

      let chauffeursInfo = '';
      chauffeurs.forEach((chauffeur, index) => {
        if (chauffeur && chauffeur.Numero_contrat === contract.Numero_contrat) {
          chauffeursInfo += `
            <div class="conducteur-info">
              <div class="conducteur-titre">${index + 1}${index === 0 ? 'er' : 'ème'} Conducteur / سائق</div>
              <p><strong>Nom & Prénom / الاسم واللقب:</strong> ${chauffeur.nom_fr} ${chauffeur.prenom_fr}</p>
              <p><strong>Date de Naissance / تاريخ الميلاد:</strong> ${chauffeur.date_naiss || "N/A"}</p>
              <p><strong>Profession / المهنة:</strong> ${chauffeur.profession_fr || "N/A"}</p>
              <p><strong>Nationalité d'Origine / الجنسية الأصلية:</strong> ${chauffeur.nationalite_origine || "N/A"}</p>
              <p><strong>Passeport ou CIN No / رقم جواز السفر أو بطاقة الهوية:</strong> ${chauffeur.cin_chauffeur || "N/A"}</p>
              <p><strong>Délivré le / تاريخ الإصدار:</strong> ${chauffeur.date_cin_chauffeur || "N/A"}</p>
              <p><strong>Adresse / العنوان:</strong> ${chauffeur.adresse_fr || "N/A"}</p>
              <p><strong>Permis de Conduite / رخصة القيادة:</strong> ${chauffeur.numero_permis || "N/A"}</p>
              <p><strong>Délivré le / تاريخ الإصدار:</strong> ${chauffeur.date_permis || "N/A"}</p>
              <p><strong>GSM/Tél / الهاتف:</strong> ${chauffeur.num_tel || "N/A"}</p>
            </div>
          `;
        }
      });

      printWindow.document.write(`
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; font-size: 10px; margin: 0; padding: 2px; }
              .contract { max-width: 100%; margin: 0; padding: 10px; }
              .signature { border-bottom: 1px solid #000; width: 100px; margin: 2px auto; }
              img { max-width: 100px; height: auto; }
              .container { display: flex; justify-content: space-between; }
              .left, .right { flex: 1; padding: 5px; border: 1px solid #000; margin: 2px; }
              .conducteur-info { border: 1px solid #000; padding: 5px; margin-bottom: 2px; }
              .conducteur-titre { font-weight: bold; margin-bottom: 3px; background-color: #f0f0f0; padding: 2px; text-align: center; }
              .company-info { text-align: center; margin-bottom: 5px; }
              .company-info p { margin: 0; }
              .contract-title { text-align: center; margin-bottom: 5px; font-size: 14px; }
              .signature-area { text-align: center; margin-top: 5px; display: flex; justify-content: space-around; }
              .notes-area { margin-top: 5px; }
              .notes-area p { margin: 1px 0; }
            </style>
          </head>
          <body>
            <div class="contract">
              <div class="company-info">
                <img src="${logo}" alt="Logo" style="margin-bottom: 3px;">
                <p>شركة رندر كار لكراء السيارات و التنشيط السياحي</p>
              </div>
              <h2 class="contract-title">Contrat de location / عقد الإيجار</h2>
              <div class="container">
                <div class="left">
                  <p><strong>Type de voiture/نوع السيارة:</strong> ${vehicules ? vehicules.constructeur + " " + vehicules.type_constructeur : "N/A"}</p>
                  <p><strong>Immatriculation / رقم التسجيل:</strong> ${contract.num_immatriculation || "N/A"}</p>
                  <p><strong>Carburant / نوع الوقود:</strong> ${vehicules ? vehicules.energie : "N/A"}</p>
                  <p><strong>Date de Départ / تاريخ المغادرة:</strong> ${contract.Date_debut || "N/A"}</p>
                  <p><strong>Heure / الوقت:</strong> ${contract.Heure_debut || "N/A"}</p>
                  <p><strong>Date de Retour / تاريخ العودة:</strong> ${contract.Date_retour || "N/A"}</p>
                  <p><strong>Heure / الوقت:</strong> ${contract.Heure_retour || "N/A"}</p>
                  <p><strong>Durée de la location / مدة الإيجار:</strong> ${contract.Duree_location || "N/A"}</p>
                  <p><strong>Prolongation / تمديد:</strong> ${contract.Prolongation || "N/A"}</p>
                  <p><strong>Agence de Retour / وكالة العودة:</strong> ${contract.Agence_retour || ""}</p>
                  <p><strong>Kilomètrage </strong> ${contract.Kilometrage || "0"}</p>
                  <p><strong>Carburant </strong> ${contract.Carburant || ""}</p>
                  <p><strong>Etat de Pneu </strong> ${contract.Etat_pneu || ""}</p>
                  <p><strong>Etat Intérieur </strong> ${contract.Etat_interieur || ""}</p>
                  <p><strong>Tarif </strong> ${contract.Prix_total || ""}</p>
                  <p><strong>Frais de Retour </strong> ${contract.Frais || ""}</p>
                  <p><strong>Reste </strong> ${contract.Reste || ""}</p>
                  <p><strong>Total Location en TTC </strong> ${contract.Prix_total * 1.19 || ""}</p>
                </div>
                <div class="right">
                  ${chauffeursInfo || '<p>Aucun chauffeur associé à ce contrat / لا يوجد سائق مرتبط بهذا العقد</p>'}
                </div>
              </div>
              <div class="signature-area">
                <div>
                  <div class="signature"></div>
                  <p>Signature du Client / توقيع العميل</p>
                </div>
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

    printContract();
  }, [contract]);

  return null; // This component does not render anything to the DOM
};

export default PrintContrat;