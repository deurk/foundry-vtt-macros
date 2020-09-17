///// CONFIGURATION
const heroName = "Anton Haralamb";
const spellName = "Image miroir";
const messagePrefix = "Nombre d'images miroir générées: ";

///// INFORMATION
// Système : Pathfinder 1
// Module(s) nécessaire(s) : Magic Token FX
// Notes : Actor must only have ONE token on the map for this macro to work correctly

///// SCRIPT
function castMirrorImages() {
    const hero = game.actors.getName(heroName);

    // Vérifier que l'acteur existe
    if (!hero) return ui.notifications.error("L'acteur nommé <i>" + heroName + "</i> n'existe pas");

    // Vérifier que l'acteur dispose bien du sort
    const spell = hero.items.find(item => item.type === "spell" && item.name === spellName);
    if (!spell) return ui.notifications.error("L'acteur <i>" + heroName + "</i> ne dispose pas du sort <i>" + spellName + "</i>");
        
    // WORKAROUND : useSpell ne différencie pas les exécutions réussies ou ratées (BUG), on se base sur les notifications pour déterminer le résultat du lancement de sort
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
        const token = canvas.tokens.placeables.find(token => token.actor.id === hero.id);
        TokenMagic.addUpdateFilters(token, params); 
    });  
}

castMirrorImages();
