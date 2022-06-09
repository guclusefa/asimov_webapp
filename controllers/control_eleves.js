var model_eleves = require('../models/model_eleves');
var methods = require('./methods');

module.exports = {
    // affichage liste ----------------------------------------------------------------------------------------------
    afficher_liste: function (req, res) {
        if (req.session.user_info !== undefined && req.session.user_info.user_isAdministration == 1) { // si connecte

            titre = "Liste des élèves";
            model_eleves.lister(function (lesEleves) {
                res.json({ titre, valid, erreur, user_info, lesEleves })
            })
        } else {
            req.flash('erreur', "Vous n'êtes pas autorisé");
            res.redirect("/")
        }
    },

    // affichage ajouter ----------------------------------------------------------------------------------------------
    afficher_ajouter: function (req, res) {
        if (req.session.user_info !== undefined && req.session.user_info.user_isAdministration == 1) { // si connecte

            titre = "Ajouter un élève";
            action = "/eleves/ajouter"
            modifier = 0
            res.json({ titre, valid, erreur, user_info, action, modifier })
        } else {
            req.flash('erreur', "Vous n'êtes pas autorisé");
            res.redirect("/")
        }
    },

    // affichage modifier ----------------------------------------------------------------------------------------------
    afficher_modifier: function (req, res) {
        if (req.session.user_info !== undefined && req.session.user_info.user_isAdministration == 1) { // si connecte

            id = req.params.id
            titre = "Modifier un élève";
            action = "/eleves/modifier/" + id
            modifier = 1

            model_eleves.ficher(id, function (unEleve) {
                if (unEleve.length > 0) {

                    unEleve = unEleve[0]
                    res.json({ titre, valid, erreur, user_info, action, modifier, unEleve })
                } else {
                    req.flash('erreur', "Élève n'existe pas");
                    res.redirect("/")
                }
            })
        } else {
            req.flash('erreur', "Vous n'êtes pas autorisé");
            res.redirect("/")
        }
    },

    // afficher fiche ----------------------------------------------------------------------------------------------
    afficher_fiche: function (req, res) {
        if (req.session.user_info !== undefined && req.session.user_info.user_isAdministration == 1) { // si connecte

            id = req.params.id
            titre = "Fiche d'élève";

            model_eleves.ficher(id, function (unEleve) {
                if (unEleve.length > 0) {

                    unEleve = unEleve[0]
                    res.json({ titre, valid, erreur, user_info, unEleve })
                } else {
                    req.flash('erreur', "Élève n'existe pas");
                    res.redirect("/")
                }
            })
        } else {
            req.flash('erreur', "Vous n'êtes pas autorisé");
            res.redirect("/")
        }
    },

    // ajouter eleve ----------------------------------------------------------------------------------------------
    ajouter: function (req, res) {
        if (req.session.user_info !== undefined && req.session.user_info.user_isAdministration == 1) { // si connecte

            // on prend les params
            let params = [
                nom = req.body.nom,
                prenom = req.body.prenom,
                mdp = req.body.date,
                date = req.body.date.split("/").reverse().join("/"),
                sexe = req.body.sexe,
                tel = req.body.tel,
                email = req.body.email
            ]

            // on verifie params
            let paramsAverif = [
                req.body.nom,
                req.body.prenom,
                req.body.date,
                req.body.sexe,
                req.body.email
            ]

            // si params valid
            if (methods.verifUser(paramsAverif) == "Valid") {

                // on prend dernier id
                model_eleves.listerLast(function (idLastEleve) {
                    // resp1
                    let params2 = [
                        resp1 = req.body.resp1,
                        idLast = idLastEleve[0].user_id + 1
                    ]

                    // resp 2
                    let params3 = [
                        resp2 = req.body.resp2,
                        idLast = idLastEleve[0].user_id + 1
                    ]

                    // si au moin 1 resp
                    if (req.body.resp1 != "" || req.body.resp2 != "") {

                        // si pas les memes
                        if (req.body.resp1 != req.body.resp2) {
                            model_eleves.ajouter(params, params2, params3, function (data) {
                                req.flash('valid', 'Élève ajouté avec succès');
                                res.redirect('./liste')
                            })
                        } else {
                            req.flash('erreur', "Les responsables ne peuvent pas être les mêmes");
                            res.redirect("/")
                        }
                    } else {
                        req.flash('erreur', "Veuillez choisir au moins un responsable");
                        res.redirect("/")
                    }
                })

            } else {
                req.flash('erreur', methods.verifUser(paramsAverif));
                res.redirect("/")
            }
        } else {
            req.flash('erreur', "Vous n'êtes pas autorisé");
            res.redirect("/")
        }
    },

    // modifier un eleve ----------------------------------------------------------------------------------------------
    modifier: function (req, res) {
        if (req.session.user_info !== undefined && req.session.user_info.user_isAdministration == 1) { // si connecte

            let params = [
                nom = req.body.nom,
                prenom = req.body.prenom,
                date = req.body.date.split("/").reverse().join("/"),
                sexe = req.body.sexe,
                tel = req.body.tel,
                email = req.body.email,
                id = req.params.id
            ]

            let paramsAverif = [
                req.body.nom,
                req.body.prenom,
                req.body.date,
                req.body.sexe,
                req.body.email
            ]

            if (methods.verifUser(paramsAverif) == "Valid") {
                model_eleves.ficher(req.params.id, function (unEleve) {
                    if (unEleve.length > 0) {

                        model_eleves.modifier(params, function (data) {
                            req.flash('valid', 'Élève modifié avec succès');
                            res.redirect('../liste')
                        })
                    } else {
                        req.flash('erreur', "Élève n'existe pas");
                        res.redirect("/")
                    }
                })
            } else {
                req.flash('erreur', methods.verifUser(paramsAverif));
                res.redirect("/")
            }
        } else {
            req.flash('erreur', "Vous n'êtes pas autorisé");
            res.redirect("/")
        }
    },

    // supprimer un eleve ----------------------------------------------------------------------------------------------
    supprimer: function (req, res) {
        if (req.session.user_info !== undefined && req.session.user_info.user_isAdministration == 1) { // si connecte

            id = req.params.id
            model_eleves.ficher(id, function (unEleve) {
                if (unEleve.length > 0) {

                    model_eleves.supprimer(id, function (data) {
                        req.flash('valid', 'Élève supprimé avec succès');
                        res.redirect('../liste')
                    })
                } else {
                    req.flash('erreur', "Élève n'existe pas");
                    res.redirect("/")
                }
            })
        } else {
            req.flash('erreur', "Vous n'êtes pas autorisé");
            res.redirect("/")
        }
    },
}