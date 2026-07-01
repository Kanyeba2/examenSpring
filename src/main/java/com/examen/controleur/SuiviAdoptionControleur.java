package com.examen.controleur;

import com.examen.modele.SuiviAdoption;
import com.examen.service.SuiviAdoptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Contrôleur REST pour gérer les suivis post-adoption
 */
@RestController
@RequestMapping("/api/suivis")
@CrossOrigin(origins = "*")
public class SuiviAdoptionControleur {

    private final SuiviAdoptionService suiviAdoptionService;

    public SuiviAdoptionControleur(SuiviAdoptionService suiviAdoptionService) {
        this.suiviAdoptionService = suiviAdoptionService;
    }

    @GetMapping
    public ResponseEntity<List<SuiviAdoption>> obtenirTout() {
        return ResponseEntity.ok(suiviAdoptionService.obtenirTout());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SuiviAdoption> obtenirParId(@PathVariable Integer id) {
        SuiviAdoption suivi = suiviAdoptionService.obtenirParId(id);
        if (suivi == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(suivi);
    }

    @GetMapping("/demande/{idDemande}")
    public ResponseEntity<List<SuiviAdoption>> obtenirParDemande(@PathVariable Integer idDemande) {
        return ResponseEntity.ok(suiviAdoptionService.obtenirParDemande(idDemande));
    }

    @PostMapping
    public ResponseEntity<String> creer(@RequestBody SuiviAdoption suiviAdoption) {
        try {
            Integer idSuivi = suiviAdoptionService.creer(suiviAdoption);
            return ResponseEntity.status(HttpStatus.CREATED).body("Suivi créé avec succès. ID : " + idSuivi);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur : " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> mettre_a_jour(@PathVariable Integer id, @RequestBody SuiviAdoption suiviAdoption) {
        suiviAdoption.setIdSuivi(id);
        try {
            boolean resultat = suiviAdoptionService.mettre_a_jour(suiviAdoption);
            if (resultat) {
                return ResponseEntity.ok("Suivi mis à jour avec succès");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Suivi non trouvé");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur : " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> supprimer(@PathVariable Integer id) {
        try {
            boolean resultat = suiviAdoptionService.supprimer(id);
            if (resultat) {
                return ResponseEntity.ok("Suivi supprimé avec succès");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Suivi non trouvé");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur : " + e.getMessage());
        }
    }
}
