package com.examen.depot;

import com.examen.modele.Animal;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository pour gérer les animaux
 * Utilise JdbcTemplate pour les opérations CRUD
 * Inclut des jointures avec la table type_animal
 */
@Repository
public class AnimalDepot {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<Animal> animalRowMapper;

    public AnimalDepot(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.animalRowMapper = new BeanPropertyRowMapper<>(Animal.class);
    }

    /**
     * Récupère tous les animaux avec la jointure sur type_animal
     */
    public List<Animal> obtenirTout() {
        String sql = "SELECT a.id_animal AS idAnimal, a.nom, a.age, a.sexe, a.description, " +
                     "a.statut, a.photo_url AS photoUrl, a.id_type_animal AS idTypeAnimal, " +
                     "t.nom_type_animal AS nomTypeAnimal " +
                     "FROM animal a " +
                     "LEFT JOIN type_animal t ON a.id_type_animal = t.id_type_animal";
        return jdbcTemplate.query(sql, animalRowMapper);
    }

    /**
     * Récupère un animal par son ID
     */
    public Animal obtenirParId(Integer idAnimal) {
        String sql = "SELECT a.id_animal AS idAnimal, a.nom, a.age, a.sexe, a.description, " +
                     "a.statut, a.photo_url AS photoUrl, a.id_type_animal AS idTypeAnimal, " +
                     "t.nom_type_animal AS nomTypeAnimal " +
                     "FROM animal a " +
                     "LEFT JOIN type_animal t ON a.id_type_animal = t.id_type_animal " +
                     "WHERE a.id_animal = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{idAnimal}, animalRowMapper);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Récupère tous les animaux d'un type
     */
    public List<Animal> obtenirParType(Integer idTypeAnimal) {
        String sql = "SELECT a.id_animal AS idAnimal, a.nom, a.age, a.sexe, a.description, " +
                     "a.statut, a.photo_url AS photoUrl, a.id_type_animal AS idTypeAnimal, " +
                     "t.nom_type_animal AS nomTypeAnimal " +
                     "FROM animal a " +
                     "LEFT JOIN type_animal t ON a.id_type_animal = t.id_type_animal " +
                     "WHERE a.id_type_animal = ?";
        return jdbcTemplate.query(sql, new Object[]{idTypeAnimal}, animalRowMapper);
    }

    /**
     * Crée un nouvel animal
     */
    public boolean creer(Animal animal) {
        String sql = "INSERT INTO animal (nom, age, sexe, description, statut, photo_url, id_type_animal) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                animal.getNom(),
                animal.getAge(),
                animal.getSexe(),
                animal.getDescription(),
                animal.getStatut(),
                animal.getPhotoUrl(),
                animal.getIdTypeAnimal()) > 0;
    }

    /**
     * Met à jour un animal
     */
    public boolean mettre_a_jour(Animal animal) {
        String sql = "UPDATE animal SET nom = ?, age = ?, sexe = ?, description = ?, statut = ?, " +
                     "photo_url = ?, id_type_animal = ? WHERE id_animal = ?";
        return jdbcTemplate.update(sql,
                animal.getNom(),
                animal.getAge(),
                animal.getSexe(),
                animal.getDescription(),
                animal.getStatut(),
                animal.getPhotoUrl(),
                animal.getIdTypeAnimal(),
                animal.getIdAnimal()) > 0;
    }

    /**
     * Supprime un animal
     */
    public boolean supprimer(Integer idAnimal) {
        String sql = "DELETE FROM animal WHERE id_animal = ?";
        return jdbcTemplate.update(sql, idAnimal) > 0;
    }
}
