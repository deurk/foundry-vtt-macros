///// CONFIGURATION
const heroName = "Anton Haralamb";
const spellName = "Image miroir";
const messagePrefix = "Nombre d'images miroir générées: ";

///// INFORMATIONS
// Système : Pathfinder 1
// Module(s) nécessaire(s) : Magic Token FX
// Modules(s) optionnel(s) : Macro Marker (voir NOTES)

///// NOTES
// Si l'acteur configuré à plusieurs jetons sur la scène, seul le premier jeton retourné sera affecté.
// Si le module Macro Marker est activé, copier le contenu entre DEBUT et FIN de la fonction macroMarker() dans l'onglet Marker.

///// SCRIPT
function castMirrorImages() {
    
    // Vérifier que l'acteur existe
    const hero = game.actors.getName(heroName);
    if (!hero) return ui.notifications.error("L'acteur nommé <i>" + heroName + "</i> n'existe pas");

    // Vérifier qu'un jeton de l'acteur existe
    const token = canvas.tokens.placeables.find(token => token.actor.id === hero.id);
    if (!token) return ui.notifications.error("L'acteur nommé <i>" + heroName + "</i> n'a pas de jeton sur la scène");

    // Vérifier que l'acteur dispose bien du sort
    const spell = hero.items.find(item => item.type === "spell" && item.name === spellName);
    if (!spell) return ui.notifications.error("L'acteur <i>" + heroName + "</i> ne dispose pas du sort <i>" + spellName + "</i>");
        
    // WORKAROUND : useSpell ne différencie pas les exécutions réussies ou ratées (BUG),
    // on se base sur les notifications pour déterminer le résultat du lancement de sort

    // Lancer le sort et consommer l'emplacement
    const notifLength =  ui.notifications.active.length;
    hero.useSpell(spell, {}, {skipDialog: true}).then(result => {

        if (ui.notifications.active.length != notifLength) return;
        
        // Definir le nombre d'images à afficher
        const rollData = spell.getRollData();
        let imagesRoll = new Roll("1d4 + floor(@cl/3)", rollData).roll();
        const mirrorImages = Math.min(imagesRoll.total, 8);

        // Afficher un message annoncant le nombre d'images générées
        imagesRoll.toMessage({
            speaker: ChatMessage.getSpeaker({actor: hero}),
            flavor: messagePrefix,
            rollMode: game.settings.get("core", "rollMode")
        });

        // Sauvegarder le nombre d'images pour traitement ultérieur
        hero.setFlag("pf1", "spells", {"mirrorImages": mirrorImages});

        // Activer l'effet visuel sur le jeton
        let params = [{
            filterType: "images",
            filterId: "myMirrorImages",
            time: 0,
            nbImage: mirrorImages + 1,
            alphaImg: 1.0,
            alphaChr: 0.0,
            blend: 4,
            ampX: 0.20,
            ampY: 0.20,
            zOrder: 20,
            animated : {
                time: { 
                    active: true, 
                    speed: 0.0010, 
                    animType: "move" 
                }
            }
        }];
        TokenMagic.addUpdateFilters(token, params); 
    });  
}

function macroMarker() {
    // DEBUT
    const heroName = "Anton Haralamb";
    return game.actors.getName(heroName).getFlag("pf1", "spells.mirrorImages");
    // FIN
}

castMirrorImages();
