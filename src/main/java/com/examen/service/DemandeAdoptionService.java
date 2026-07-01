package com.examen.service;

import com.examen.depot.DemandeAdoptionDepot;
import com.examen.modele.DemandeAdoption;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Service pour gérer les demandes d'adoption
 * Couche métier avec logique métier
 */
@Service
public class DemandeAdoptionService {

    private final DemandeAdoptionDepot demandeAdoptionDepot;

    public DemandeAdoptionService(DemandeAdoptionDepot demandeAdoptionDepot) {
        this.demandeAdoptionDepot = demandeAdoptionDepot;
    }

    /**
     * Récupère toutes les demandes d'adoption
     */
    public List<DemandeAdoption> obtenirTout() {
        return demandeAdoptionDepot.obtenirTout();
    }

    /**
     * Récupère une demande d'adoption par son ID
     */
    public DemandeAdoption obtenirParId(Integer idDemande) {
        return demandeAdoptionDepot.obtenirParId(idDemande);
    }

    /**
     * Crée une nouvelle demande d'adoption
     */
    public Integer creer(DemandeAdoption demandeAdoption) {
        if (demandeAdoption.getIdAnimal() == null || demandeAdoption.getIdAnimal() <= 0) {
            throw new IllegalArgumentException("L'animal sélectionné est requis");
        }
        if (demandeAdoption.getIdAdoptant() == null || demandeAdoption.getIdAdoptant() <= 0) {
            throw new IllegalArgumentException("L'adoptant est requis");
        }
        if (demandeAdoption.getDateDemande() == null) {
            demandeAdoption.setDateDemande(LocalDateTime.now());
        }
        if (demandeAdoption.getStatut() == null || demandeAdoption.getStatut().isEmpty()) {
            demandeAdoption.setStatut("nouvelle");
        }
        return demandeAdoptionDepot.creer(demandeAdoption);
    }

    /**
     * Met à jour une demande d'adoption
     */
    public boolean mettre_a_jour(DemandeAdoption demandeAdoption) {
        if (demandeAdoption.getIdDemande() == null) {
            throw new IllegalArgumentException("L'ID de la demande est obligatoire");
        }
        if (demandeAdoption.getDateDemande() == null) {
            demandeAdoption.setDateDemande(LocalDateTime.now());
        }
        return demandeAdoptionDepot.mettre_a_jour(demandeAdoption);
    }

    /**
     * Supprime une demande d'adoption
     */
    public boolean supprimer(Integer idDemande) {
        if (idDemande == null || idDemande <= 0) {
            throw new IllegalArgumentException("L'ID de la demande est invalide");
        }
        return demandeAdoptionDepot.supprimer(idDemande);
    }
}
