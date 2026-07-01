package com.examen.service;

import com.examen.depot.TypeAnimalDepot;
import com.examen.modele.TypeAnimal;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Service pour gérer les types d'animaux
 * Couche métier
 */
@Service
public class TypeAnimalService {

    private final TypeAnimalDepot typeAnimalDepot;

    public TypeAnimalService(TypeAnimalDepot typeAnimalDepot) {
        this.typeAnimalDepot = typeAnimalDepot;
    }

    /**
     * Récupère tous les types d'animaux
     */
    public List<TypeAnimal> obtenirTout() {
        return typeAnimalDepot.obtenirTout();
    }

    /**
     * Récupère un type d'animal par son ID
     */
    public TypeAnimal obtenirParId(Integer idTypeAnimal) {
        return typeAnimalDepot.obtenirParId(idTypeAnimal);
    }

    /**
     * Crée un nouveau type d'animal
     */
    public boolean creer(TypeAnimal typeAnimal) {
        if (typeAnimal.getNomTypeAnimal() == null || typeAnimal.getNomTypeAnimal().isEmpty()) {
            throw new IllegalArgumentException("Le nom du type d'animal ne peut pas être vide");
        }
        return typeAnimalDepot.creer(typeAnimal);
    }

    /**
     * Met à jour un type d'animal
     */
    public boolean mettre_a_jour(TypeAnimal typeAnimal) {
        if (typeAnimal.getIdTypeAnimal() == null) {
            throw new IllegalArgumentException("L'ID du type d'animal est obligatoire");
        }
        return typeAnimalDepot.mettre_a_jour(typeAnimal);
    }

    /**
     * Supprime un type d'animal
     */
    public boolean supprimer(Integer idTypeAnimal) {
        if (idTypeAnimal == null || idTypeAnimal <= 0) {
            throw new IllegalArgumentException("L'ID du type d'animal est invalide");
        }
        return typeAnimalDepot.supprimer(idTypeAnimal);
    }
}
