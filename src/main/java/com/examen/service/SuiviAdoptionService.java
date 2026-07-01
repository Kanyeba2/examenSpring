package com.examen.service;

import com.examen.depot.SuiviAdoptionDepot;
import com.examen.modele.SuiviAdoption;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Service pour gérer les suivis post-adoption
 */
@Service
public class SuiviAdoptionService {

    private final SuiviAdoptionDepot suiviAdoptionDepot;

    public SuiviAdoptionService(SuiviAdoptionDepot suiviAdoptionDepot) {
        this.suiviAdoptionDepot = suiviAdoptionDepot;
    }

    public List<SuiviAdoption> obtenirTout() {
        return suiviAdoptionDepot.obtenirTout();
    }

    public List<SuiviAdoption> obtenirParDemande(Integer idDemande) {
        return suiviAdoptionDepot.obtenirParDemande(idDemande);
    }

    public SuiviAdoption obtenirParId(Integer idSuivi) {
        return suiviAdoptionDepot.obtenirParId(idSuivi);
    }

    public Integer creer(SuiviAdoption suiviAdoption) {
        if (suiviAdoption.getIdDemande() == null || suiviAdoption.getIdDemande() <= 0) {
            throw new IllegalArgumentException("L'ID de la demande est requis");
        }
        if (suiviAdoption.getDateSuivi() == null) {
            suiviAdoption.setDateSuivi(LocalDateTime.now());
        }
        return suiviAdoptionDepot.creer(suiviAdoption);
    }

    public boolean mettre_a_jour(SuiviAdoption suiviAdoption) {
        if (suiviAdoption.getIdSuivi() == null) {
            throw new IllegalArgumentException("L'ID du suivi est obligatoire");
        }
        if (suiviAdoption.getDateSuivi() == null) {
            suiviAdoption.setDateSuivi(LocalDateTime.now());
        }
        return suiviAdoptionDepot.mettre_a_jour(suiviAdoption);
    }

    public boolean supprimer(Integer idSuivi) {
        if (idSuivi == null || idSuivi <= 0) {
            throw new IllegalArgumentException("L'ID du suivi est invalide");
        }
        return suiviAdoptionDepot.supprimer(idSuivi);
    }
}
