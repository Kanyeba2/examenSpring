package com.examen.depot;

import com.examen.modele.DemandeAdoption;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.sql.Timestamp;
import java.util.List;

/**
 * Repository pour gérer les demandes d'adoption
 * Utilise JdbcTemplate pour les opérations CRUD
 * Inclut des jointures vers animal et adoptant
 */
@Repository
public class DemandeAdoptionDepot {

    private final JdbcTemplate jdbcTemplate;

    public DemandeAdoptionDepot(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Récupère toutes les demandes d'adoption avec informations d'animal et d'adoptant
     */
    public List<DemandeAdoption> obtenirTout() {
        String sql = "SELECT d.id_demande AS idDemande, d.id_animal AS idAnimal, " +
                     "d.id_adoptant AS idAdoptant, d.date_demande AS dateDemande, d.statut, d.message, d.date_decision AS dateDecision, " +
                     "a.nom AS nomAnimal, ad.nom AS nomAdoptant " +
                     "FROM demande_adoption d " +
                     "JOIN animal a ON d.id_animal = a.id_animal " +
                     "JOIN adoptant ad ON d.id_adoptant = ad.id_adoptant";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
            new DemandeAdoption(
                rs.getInt("idDemande"),
                rs.getInt("idAnimal"),
                rs.getInt("idAdoptant"),
                rs.getTimestamp("dateDemande") != null ? rs.getTimestamp("dateDemande").toLocalDateTime() : null,
                rs.getString("statut"),
                rs.getString("message"),
                rs.getTimestamp("dateDecision") != null ? rs.getTimestamp("dateDecision").toLocalDateTime() : null,
                rs.getString("nomAnimal"),
                rs.getString("nomAdoptant")
            )
        );
    }

    /**
     * Récupère une demande d'adoption par son ID
     */
    public DemandeAdoption obtenirParId(Integer idDemande) {
        String sql = "SELECT d.id_demande AS idDemande, d.id_animal AS idAnimal, " +
                     "d.id_adoptant AS idAdoptant, d.date_demande AS dateDemande, d.statut, d.message, d.date_decision AS dateDecision, " +
                     "a.nom AS nomAnimal, ad.nom AS nomAdoptant " +
                     "FROM demande_adoption d " +
                     "JOIN animal a ON d.id_animal = a.id_animal " +
                     "JOIN adoptant ad ON d.id_adoptant = ad.id_adoptant " +
                     "WHERE d.id_demande = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{idDemande}, (rs, rowNum) ->
                new DemandeAdoption(
                    rs.getInt("idDemande"),
                    rs.getInt("idAnimal"),
                    rs.getInt("idAdoptant"),
                    rs.getTimestamp("dateDemande") != null ? rs.getTimestamp("dateDemande").toLocalDateTime() : null,
                    rs.getString("statut"),
                    rs.getString("message"),
                    rs.getTimestamp("dateDecision") != null ? rs.getTimestamp("dateDecision").toLocalDateTime() : null,
                    rs.getString("nomAnimal"),
                    rs.getString("nomAdoptant")
                )
            );
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Crée une nouvelle demande d'adoption
     */
    public Integer creer(DemandeAdoption demandeAdoption) {
        String sql = "INSERT INTO demande_adoption (id_animal, id_adoptant, date_demande, statut, message, date_decision) " +
                     "VALUES (?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                demandeAdoption.getIdAnimal(),
                demandeAdoption.getIdAdoptant(),
                Timestamp.valueOf(demandeAdoption.getDateDemande()),
                demandeAdoption.getStatut(),
                demandeAdoption.getMessage(),
                demandeAdoption.getDateDecision() != null ? Timestamp.valueOf(demandeAdoption.getDateDecision()) : null
        );
        return jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
    }

    /**
     * Met à jour une demande d'adoption
     */
    public boolean mettre_a_jour(DemandeAdoption demandeAdoption) {
        String sql = "UPDATE demande_adoption SET id_animal = ?, id_adoptant = ?, date_demande = ?, statut = ?, message = ?, date_decision = ? " +
                     "WHERE id_demande = ?";
        return jdbcTemplate.update(sql,
                demandeAdoption.getIdAnimal(),
                demandeAdoption.getIdAdoptant(),
                Timestamp.valueOf(demandeAdoption.getDateDemande()),
                demandeAdoption.getStatut(),
                demandeAdoption.getMessage(),
                demandeAdoption.getDateDecision() != null ? Timestamp.valueOf(demandeAdoption.getDateDecision()) : null,
                demandeAdoption.getIdDemande()) > 0;
    }

    /**
     * Supprime une demande d'adoption
     */
    public boolean supprimer(Integer idDemande) {
        String sql = "DELETE FROM demande_adoption WHERE id_demande = ?";
        return jdbcTemplate.update(sql, idDemande) > 0;
    }
}
