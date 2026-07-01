package com.examen.modele;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Modèle représentant une demande d'adoption
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DemandeAdoption {
    private Integer idDemande;
    private Integer idAnimal;
    private Integer idAdoptant;
    private LocalDateTime dateDemande;
    private String statut; // nouvelle, en_cours, acceptee, refusee
    private String message;
    private LocalDateTime dateDecision;
    private String nomAnimal;
    private String nomAdoptant;
}
