package com.examen.modele;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Modèle représentant un type d'animal pour l'adoption
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TypeAnimal {
    private Integer idTypeAnimal;
    private String nomTypeAnimal;
    private String description;
}
