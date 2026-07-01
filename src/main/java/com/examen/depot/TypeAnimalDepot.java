package com.examen.depot;

import com.examen.modele.TypeAnimal;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository pour gérer les types d'animaux
 * Utilise JdbcTemplate pour les opérations CRUD
 */
@Repository
public class TypeAnimalDepot {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<TypeAnimal> typeAnimalRowMapper;

    public TypeAnimalDepot(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.typeAnimalRowMapper = new BeanPropertyRowMapper<>(TypeAnimal.class);
    }

    /**
     * Récupère tous les types d'animaux
     */
    public List<TypeAnimal> obtenirTout() {
        String sql = "SELECT id_type_animal AS idTypeAnimal, nom_type_animal AS nomTypeAnimal, description " +
                     "FROM type_animal";
        return jdbcTemplate.query(sql, typeAnimalRowMapper);
    }

    /**
     * Récupère un type d'animal par son ID
     */
    public TypeAnimal obtenirParId(Integer idTypeAnimal) {
        String sql = "SELECT id_type_animal AS idTypeAnimal, nom_type_animal AS nomTypeAnimal, description " +
                     "FROM type_animal WHERE id_type_animal = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{idTypeAnimal}, typeAnimalRowMapper);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Crée un nouveau type d'animal
     */
    public boolean creer(TypeAnimal typeAnimal) {
        String sql = "INSERT INTO type_animal (nom_type_animal, description) VALUES (?, ?)";
        return jdbcTemplate.update(sql, typeAnimal.getNomTypeAnimal(), typeAnimal.getDescription()) > 0;
    }

    /**
     * Met à jour un type d'animal
     */
    public boolean mettre_a_jour(TypeAnimal typeAnimal) {
        String sql = "UPDATE type_animal SET nom_type_animal = ?, description = ? WHERE id_type_animal = ?";
        return jdbcTemplate.update(sql, typeAnimal.getNomTypeAnimal(), typeAnimal.getDescription(),
                typeAnimal.getIdTypeAnimal()) > 0;
    }

    /**
     * Supprime un type d'animal
     */
    public boolean supprimer(Integer idTypeAnimal) {
        String sql = "DELETE FROM type_animal WHERE id_type_animal = ?";
        return jdbcTemplate.update(sql, idTypeAnimal) > 0;
    }
}
