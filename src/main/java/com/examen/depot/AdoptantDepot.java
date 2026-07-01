package com.examen.depot;

import com.examen.modele.Adoptant;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository pour gérer les adoptants
 */
@Repository
public class AdoptantDepot {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<Adoptant> adoptantRowMapper;

    public AdoptantDepot(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.adoptantRowMapper = new BeanPropertyRowMapper<>(Adoptant.class);
    }

    public List<Adoptant> obtenirTout() {
        String sql = "SELECT id_adoptant AS idAdoptant, nom, prenom, email, telephone, adresse, profession, role FROM adoptant";
        return jdbcTemplate.query(sql, adoptantRowMapper);
    }

    public Adoptant obtenirParId(Integer idAdoptant) {
        String sql = "SELECT id_adoptant AS idAdoptant, nom, prenom, email, telephone, adresse, profession, role FROM adoptant WHERE id_adoptant = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{idAdoptant}, adoptantRowMapper);
        } catch (Exception e) {
            return null;
        }
    }

    public boolean creer(Adoptant adoptant) {
        String sql = "INSERT INTO adoptant (nom, prenom, email, telephone, adresse, profession, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                adoptant.getNom(),
                adoptant.getPrenom(),
                adoptant.getEmail(),
                adoptant.getTelephone(),
                adoptant.getAdresse(),
                adoptant.getProfession(),
                adoptant.getRole()) > 0;
    }

    public boolean mettre_a_jour(Adoptant adoptant) {
        String sql = "UPDATE adoptant SET nom = ?, prenom = ?, email = ?, telephone = ?, adresse = ?, profession = ?, role = ? WHERE id_adoptant = ?";
        return jdbcTemplate.update(sql,
                adoptant.getNom(),
                adoptant.getPrenom(),
                adoptant.getEmail(),
                adoptant.getTelephone(),
                adoptant.getAdresse(),
                adoptant.getProfession(),
                adoptant.getRole(),
                adoptant.getIdAdoptant()) > 0;
    }

    public boolean supprimer(Integer idAdoptant) {
        String sql = "DELETE FROM adoptant WHERE id_adoptant = ?";
        return jdbcTemplate.update(sql, idAdoptant) > 0;
    }
}
