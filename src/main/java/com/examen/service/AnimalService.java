package com.examen.service;

import com.examen.depot.AnimalDepot;
import com.examen.modele.Animal;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Service pour gérer les animaux
 * Couche métier
 */
@Service
public class AnimalService {

    private final AnimalDepot animalDepot;

    public AnimalService(AnimalDepot animalDepot) {
        this.animalDepot = animalDepot;
    }

    /**
     * Récupère tous les animaux
     */
    public List<Animal> obtenirTout() {
        return animalDepot.obtenirTout();
    }

    /**
     * Récupère un animal par son ID
     */
    public Animal obtenirParId(Integer idAnimal) {
        return animalDepot.obtenirParId(idAnimal);
    }

    /**
     * Récupère tous les animaux d'un type
     */
    public List<Animal> obtenirParType(Integer idTypeAnimal) {
        return animalDepot.obtenirParType(idTypeAnimal);
    }

    /**
     * Crée un nouvel animal
     */
    public boolean creer(Animal animal) {
        if (animal.getNom() == null || animal.getNom().isEmpty()) {
            throw new IllegalArgumentException("Le nom de l'animal ne peut pas être vide");
        }
        if (animal.getAge() == null || animal.getAge() < 0) {
            throw new IllegalArgumentException("L'âge doit être supérieur ou égal à zéro");
        }
        if (animal.getSexe() == null || animal.getSexe().isEmpty()) {
            throw new IllegalArgumentException("Le sexe de l'animal est requis");
        }
        if (animal.getIdTypeAnimal() == null || animal.getIdTypeAnimal() <= 0) {
            throw new IllegalArgumentException("Le type d'animal est requis");
        }
        if (animal.getStatut() == null || animal.getStatut().isEmpty()) {
            animal.setStatut("disponible");
        }
        return animalDepot.creer(animal);
    }

    /**
     * Met à jour un animal
     */
    public boolean mettre_a_jour(Animal animal) {
        if (animal.getIdAnimal() == null) {
            throw new IllegalArgumentException("L'ID de l'animal est obligatoire");
        }
        return animalDepot.mettre_a_jour(animal);
    }

    /**
     * Supprime un animal
     */
    public boolean supprimer(Integer idAnimal) {
        if (idAnimal == null || idAnimal <= 0) {
            throw new IllegalArgumentException("L'ID de l'animal est invalide");
        }
        return animalDepot.supprimer(idAnimal);
    }
}
