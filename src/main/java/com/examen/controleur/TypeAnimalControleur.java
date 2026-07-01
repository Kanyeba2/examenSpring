package com.examen.controleur;

import com.examen.modele.TypeAnimal;
import com.examen.service.TypeAnimalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Contrôleur REST pour gérer les types d'animaux
 * Expose les endpoints API pour les opérations CRUD
 */
@RestController
@RequestMapping("/api/types")
@CrossOrigin(origins = "*")
public class TypeAnimalControleur {

    private final TypeAnimalService typeAnimalService;

    public TypeAnimalControleur(TypeAnimalService typeAnimalService) {
        this.typeAnimalService = typeAnimalService;
    }

    /**
     * GET /api/types - Récupère tous les types d'animaux
     */
    @GetMapping
    public ResponseEntity<List<TypeAnimal>> obtenirTout() {
        List<TypeAnimal> types = typeAnimalService.obtenirTout();
        return ResponseEntity.ok(types);
    }

    /**
     * GET /api/types/{id} - Récupère un type d'animal par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<TypeAnimal> obtenirParId(@PathVariable Integer id) {
        TypeAnimal typeAnimal = typeAnimalService.obtenirParId(id);
        if (typeAnimal == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(typeAnimal);
    }

    /**
     * POST /api/types - Crée un nouveau type d'animal
     */
    @PostMapping
    public ResponseEntity<String> creer(@RequestBody TypeAnimal typeAnimal) {
        try {
            boolean resultat = typeAnimalService.creer(typeAnimal);
            if (resultat) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body("Type d'animal créé avec succès");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Erreur lors de la création du type d'animal");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur : " + e.getMessage());
        }
    }

    /**
     * PUT /api/types/{id} - Met à jour un type d'animal
     */
    @PutMapping("/{id}")
    public ResponseEntity<String> mettre_a_jour(@PathVariable Integer id, @RequestBody TypeAnimal typeAnimal) {
        typeAnimal.setIdTypeAnimal(id);
        try {
            boolean resultat = typeAnimalService.mettre_a_jour(typeAnimal);
            if (resultat) {
                return ResponseEntity.ok("Type d'animal mis à jour avec succès");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Type d'animal non trouvé");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur : " + e.getMessage());
        }
    }

    /**
     * DELETE /api/types/{id} - Supprime un type d'animal
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> supprimer(@PathVariable Integer id) {
        try {
            boolean resultat = typeAnimalService.supprimer(id);
            if (resultat) {
                return ResponseEntity.ok("Type d'animal supprimé avec succès");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Type d'animal non trouvé");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur : " + e.getMessage());
        }
    }
}
