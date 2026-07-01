package com.examen.modele;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Modèle représentant un suivi post-adoption
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SuiviAdoption {
    private Integer idSuivi;
    private Integer idDemande;
    private LocalDateTime dateSuivi;
    private String etatSante;
    private String commentaire;
    private String actionSuivante;
}
