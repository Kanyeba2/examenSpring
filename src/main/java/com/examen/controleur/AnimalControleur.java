package com.examen.controleur;

import com.examen.modele.Animal;
import com.examen.service.AnimalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

/**
 * Contrôleur REST pour gérer les animaux
 * Expose les endpoints API pour les opérations CRUD
 */
@RestController
@RequestMapping("/api/animaux")
@CrossOrigin(origins = "*")
public class AnimalControleur {

    private final AnimalService animalService;

    public AnimalControleur(AnimalService animalService) {
        this.animalService = animalService;
    }

    /**
     * GET /api/animaux - Récupère tous les animaux
     */
    @GetMapping
    public ResponseEntity<List<Animal>> obtenirTout() {
        List<Animal> animaux = animalService.obtenirTout();
        return ResponseEntity.ok(animaux);
    }

    /**
     * GET /api/animaux/{id} - Récupère un animal par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Animal> obtenirParId(@PathVariable Integer id) {
        Animal animal = animalService.obtenirParId(id);
        if (animal == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(animal);
    }

    /**
     * GET /api/animaux/type/{idType} - Récupère les animaux d'un type
     */
    @GetMapping("/type/{idType}")
    public ResponseEntity<List<Animal>> obtenirParType(@PathVariable Integer idType) {
        List<Animal> animaux = animalService.obtenirParType(idType);
        return ResponseEntity.ok(animaux);
    }

    /**
     * POST /api/animaux - Crée un nouvel animal
     */
    @PostMapping
    public ResponseEntity<String> creer(@RequestBody Animal animal) {
        try {
            boolean resultat = animalService.creer(animal);
            if (resultat) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body("Animal créé avec succès");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Erreur lors de la création de l'animal");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur : " + e.getMessage());
        }
    }

    /**
     * PUT /api/animaux/{id} - Met à jour un animal
     */
    @PutMapping("/{id}")
    public ResponseEntity<String> mettre_a_jour(@PathVariable Integer id, @RequestBody Animal animal) {
        animal.setIdAnimal(id);
        try {
            boolean resultat = animalService.mettre_a_jour(animal);
            if (resultat) {
                return ResponseEntity.ok("Animal mis à jour avec succès");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Animal non trouvé");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur : " + e.getMessage());
        }
    }

    /**
     * DELETE /api/animaux/{id} - Supprime un animal
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> supprimer(@PathVariable Integer id) {
        try {
            boolean resultat = animalService.supprimer(id);
            if (resultat) {
                return ResponseEntity.ok("Animal supprimé avec succès");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Animal non trouvé");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur : " + e.getMessage());
        }
    }

    /**
     * POST /api/animaux/upload - Upload d'une image pour animal
     */
    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("Aucun fichier reçu");
        }

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = StringUtils.getFilenameExtension(originalFileName);
        if (extension == null) {
            return ResponseEntity.badRequest().body("Extension de fichier manquante");
        }

        String filename = UUID.randomUUID().toString() + "." + extension;
        Path uploadDirectory = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadDirectory);
            Path destination = uploadDirectory.resolve(filename);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
            }
            return ResponseEntity.ok("/uploads/" + filename);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'enregistrement du fichier: " + e.getMessage());
        }
    }
}
