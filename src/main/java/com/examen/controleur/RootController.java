package com.examen.controleur;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Redirige la racine '/' vers la page publique d'accueil.
 */
@Controller
public class RootController {

    @GetMapping("/")
    public String root() {
        // redirige vers la page utilisateur située dans static/accueil.html
        return "redirect:/accueil.html";
    }
}
