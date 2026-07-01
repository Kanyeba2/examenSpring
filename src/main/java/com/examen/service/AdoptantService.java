package com.examen.service;

import com.examen.depot.AdoptantDepot;
import com.examen.modele.Adoptant;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Service pour gérer les adoptants
 */
@Service
public class AdoptantService {

    private final AdoptantDepot adoptantDepot;

    public AdoptantService(AdoptantDepot adoptantDepot) {
        this.adoptantDepot = adoptantDepot;
    }

    public List<Adoptant> obtenirTout() {
        return adoptantDepot.obtenirTout();
    }

    public Adoptant obtenirParId(Integer idAdoptant) {
        return adoptantDepot.obtenirParId(idAdoptant);
    }

    public boolean creer(Adoptant adoptant) {
        if (adoptant.getNom() == null || adoptant.getNom().isEmpty()) {
            throw new IllegalArgumentException("Le nom de l'adoptant ne peut pas être vide");
        }
        if (adoptant.getPrenom() == null || adoptant.getPrenom().isEmpty()) {
            throw new IllegalArgumentException("Le prénom de l'adoptant ne peut pas être vide");
        }
        if (adoptant.getEmail() == null || adoptant.getEmail().isEmpty()) {
            throw new IllegalArgumentException("L'email de l'adoptant est requis");
        }
        if (adoptant.getMotDePasse() == null || adoptant.getMotDePasse().isEmpty()) {
            throw new IllegalArgumentException("Le mot de passe est requis");
        }
        return adoptantDepot.creer(adoptant);
    }

    public Adoptant authentifier(String email, String motDePasse) {
        if (email == null || email.isEmpty() || motDePasse == null || motDePasse.isEmpty()) {
            throw new IllegalArgumentException("Email et mot de passe sont requis");
        }
        Adoptant adoptant = adoptantDepot.obtenirParEmail(email);
        if (adoptant == null) {
            return null;
        }
        if (motDePasse.equals(adoptant.getMotDePasse())) {
            adoptant.setMotDePasse(null); // Ne pas exposer le mot de passe
            return adoptant;
        }
        return null;
    }

    public boolean mettre_a_jour(Adoptant adoptant) {
        if (adoptant.getIdAdoptant() == null) {
            throw new IllegalArgumentException("L'ID de l'adoptant est obligatoire");
        }
        return adoptantDepot.mettre_a_jour(adoptant);
    }

    public boolean supprimer(Integer idAdoptant) {
        if (idAdoptant == null || idAdoptant <= 0) {
            throw new IllegalArgumentException("L'ID de l'adoptant est invalide");
        }
        return adoptantDepot.supprimer(idAdoptant);
    }
}
