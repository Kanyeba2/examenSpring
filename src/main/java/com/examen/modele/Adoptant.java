package com.examen.modele;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Modèle représentant un adoptant
 */
public class Adoptant {
    private Integer idAdoptant;
    private String nom;
    private String prenom;
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String motDePasse;
    private String telephone;
    private String adresse;
    private String profession;
    private String role;

    public Adoptant() {
    }

    public Adoptant(Integer idAdoptant, String nom, String prenom, String email, String motDePasse, String telephone, String adresse, String profession, String role) {
        this.idAdoptant = idAdoptant;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.telephone = telephone;
        this.adresse = adresse;
        this.profession = profession;
        this.role = role;
    }

    public Integer getIdAdoptant() {
        return idAdoptant;
    }

    public void setIdAdoptant(Integer idAdoptant) {
        this.idAdoptant = idAdoptant;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
