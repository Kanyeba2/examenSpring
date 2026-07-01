package com.examen.controleur;

import com.examen.modele.DemandeAdoption;
import com.examen.service.DemandeAdoptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Contrôleur REST pour gérer les demandes d'adoption
 * Expose les endpoints API pour les opérations CRUD
 */
@RestController
@RequestMapping("/api/demandes")
@CrossOrigin(origins = "*")
public class DemandeAdoptionControleur {

    private final DemandeAdoptionService demandeAdoptionService;

    public DemandeAdoptionControleur(DemandeAdoptionService demandeAdoptionService) {
        this.demandeAdoptionService = demandeAdoptionService;
    }

    /**
     * GET /api/demandes - Récupère toutes les demandes d'adoption
     */
    @GetMapping
    public ResponseEntity<List<DemandeAdoption>> obtenirTout() {
        List<DemandeAdoption> demandes = demandeAdoptionService.obtenirTout();
        return ResponseEntity.ok(demandes);
    }

    /**
     * GET /api/demandes/{id} - Récupère une demande par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<DemandeAdoption> obtenirParId(@PathVariable Integer id) {
        DemandeAdoption demande = demandeAdoptionService.obtenirParId(id);
        if (demande == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(demande);
    }

    /**
     * POST /api/demandes - Crée une nouvelle demande d'adoption
     */
    @PostMapping
    public ResponseEntity<String> creer(@RequestBody DemandeAdoption demandeAdoption) {
        try {
            Integer idDemande = demandeAdoptionService.creer(demandeAdoption);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Demande d'adoption créée avec succès. ID : " + idDemande);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur : " + e.getMessage());
        }
    }

    /**
     * PUT /api/demandes/{id} - Met à jour une demande d'adoption
     */
    @PutMapping("/{id}")
    public ResponseEntity<String> mettre_a_jour(@PathVariable Integer id, @RequestBody DemandeAdoption demandeAdoption) {
        demandeAdoption.setIdDemande(id);
        try {
            boolean resultat = demandeAdoptionService.mettre_a_jour(demandeAdoption);
            if (resultat) {
                return ResponseEntity.ok("Demande d'adoption mise à jour avec succès");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Demande d'adoption non trouvée");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur : " + e.getMessage());
        }
    }

    /**
     * DELETE /api/demandes/{id} - Supprime une demande d'adoption
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> supprimer(@PathVariable Integer id) {
        try {
            boolean resultat = demandeAdoptionService.supprimer(id);
            if (resultat) {
                return ResponseEntity.ok("Demande d'adoption supprimée avec succès");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Demande d'adoption non trouvée");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur : " + e.getMessage());
        }
    }
}
