package com.examen.depot;

import com.examen.modele.SuiviAdoption;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import java.sql.Timestamp;
import java.util.List;

/**
 * Repository pour gérer les suivis post-adoption
 */
@Repository
public class SuiviAdoptionDepot {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<SuiviAdoption> suiviRowMapper;

    public SuiviAdoptionDepot(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.suiviRowMapper = new BeanPropertyRowMapper<>(SuiviAdoption.class);
    }

    public List<SuiviAdoption> obtenirTout() {
        String sql = "SELECT id_suivi AS idSuivi, id_demande AS idDemande, date_suivi AS dateSuivi, etat_sante AS etatSante, commentaire, action_suivante AS actionSuivante FROM suivi_adoption";
        return jdbcTemplate.query(sql, suiviRowMapper);
    }

    public List<SuiviAdoption> obtenirParDemande(Integer idDemande) {
        String sql = "SELECT id_suivi AS idSuivi, id_demande AS idDemande, date_suivi AS dateSuivi, etat_sante AS etatSante, commentaire, action_suivante AS actionSuivante FROM suivi_adoption WHERE id_demande = ?";
        return jdbcTemplate.query(sql, new Object[]{idDemande}, suiviRowMapper);
    }

    public SuiviAdoption obtenirParId(Integer idSuivi) {
        String sql = "SELECT id_suivi AS idSuivi, id_demande AS idDemande, date_suivi AS dateSuivi, etat_sante AS etatSante, commentaire, action_suivante AS actionSuivante FROM suivi_adoption WHERE id_suivi = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{idSuivi}, suiviRowMapper);
        } catch (Exception e) {
            return null;
        }
    }

    public Integer creer(SuiviAdoption suiviAdoption) {
        String sql = "INSERT INTO suivi_adoption (id_demande, date_suivi, etat_sante, commentaire, action_suivante) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                suiviAdoption.getIdDemande(),
                Timestamp.valueOf(suiviAdoption.getDateSuivi()),
                suiviAdoption.getEtatSante(),
                suiviAdoption.getCommentaire(),
                suiviAdoption.getActionSuivante());
        return jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
    }

    public boolean mettre_a_jour(SuiviAdoption suiviAdoption) {
        String sql = "UPDATE suivi_adoption SET id_demande = ?, date_suivi = ?, etat_sante = ?, commentaire = ?, action_suivante = ? WHERE id_suivi = ?";
        return jdbcTemplate.update(sql,
                suiviAdoption.getIdDemande(),
                Timestamp.valueOf(suiviAdoption.getDateSuivi()),
                suiviAdoption.getEtatSante(),
                suiviAdoption.getCommentaire(),
                suiviAdoption.getActionSuivante(),
                suiviAdoption.getIdSuivi()) > 0;
    }

    public boolean supprimer(Integer idSuivi) {
        String sql = "DELETE FROM suivi_adoption WHERE id_suivi = ?";
        return jdbcTemplate.update(sql, idSuivi) > 0;
    }
}
