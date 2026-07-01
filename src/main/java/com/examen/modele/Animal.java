package com.examen.modele;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Modèle représentant un animal à adopter
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Animal {
    private Integer idAnimal;
    private String nom;
    private Integer age;
    private String sexe;
    private String description;
    private String statut; // disponible, réservé, adopté, en soin
    private Integer idTypeAnimal;
    private String nomTypeAnimal; // Pour jointure avec type d'animal
    private String photoUrl;
}
