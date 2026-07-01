package com.examen.modele;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Modèle représentant un adoptant
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Adoptant {
    private Integer idAdoptant;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private String profession;
    private String role;
}
