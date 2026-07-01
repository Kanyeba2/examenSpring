package com.examen.controleur;

import com.examen.modele.Adoptant;
import com.examen.service.AdoptantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Contrôleur REST pour gérer les adoptants
 */
@RestController
@RequestMapping("/api/adoptants")
@CrossOrigin(origins = "*")
public class AdoptantControleur {

    private final AdoptantService adoptantService;

    public AdoptantControleur(AdoptantService adoptantService) {
        this.adoptantService = adoptantService;
    }

    @GetMapping
    public ResponseEntity<List<Adoptant>> obtenirTout() {
        return ResponseEntity.ok(adoptantService.obtenirTout());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Adoptant> obtenirParId(@PathVariable Integer id) {
        Adoptant adoptant = adoptantService.obtenirParId(id);
        if (adoptant == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(adoptant);
    }

    @PostMapping
    public ResponseEntity<String> creer(@RequestBody Adoptant adoptant) {
        try {
            boolean resultat = adoptantService.creer(adoptant);
            if (resultat) {
                return ResponseEntity.status(HttpStatus.CREATED).body("Adoptant créé avec succès");
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la création de l'adoptant");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur : " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Adoptant credentials) {
        try {
            Adoptant adoptant = adoptantService.authentifier(credentials.getEmail(), credentials.getMotDePasse());
            if (adoptant == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou mot de passe invalide");
            }
            if (!"admin".equalsIgnoreCase(adoptant.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Accès administrateur requis");
            }
            return ResponseEntity.ok(adoptant);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur : " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> mettre_a_jour(@PathVariable Integer id, @RequestBody Adoptant adoptant) {
        adoptant.setIdAdoptant(id);
        try {
            boolean resultat = adoptantService.mettre_a_jour(adoptant);
            if (resultat) {
                return ResponseEntity.ok("Adoptant mis à jour avec succès");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Adoptant non trouvé");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur : " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> supprimer(@PathVariable Integer id) {
        try {
            boolean resultat = adoptantService.supprimer(id);
            if (resultat) {
                return ResponseEntity.ok("Adoptant supprimé avec succès");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Adoptant non trouvé");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur : " + e.getMessage());
        }
    }
}
