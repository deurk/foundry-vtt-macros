///// CONFIGURATION
const heroName = "Anton Haralamb";

///// INFORMATIONS
// Base : Foundry VTT (0.6.6)
// Système : Pathfinder 1 (0.73.7)
// Module(s) nécessaire(s) : Magic Token FX (0.4.2b)
// Modules(s) optionnel(s) : -
// Auteur(s) : Alexandre Nizoux (deurk#5568), Dorgendubal

///// NOTES
// Si l'acteur configuré à plusieurs jetons sur la scène, seul le premier jeton retourné sera affecté.

///// SCRIPT
function removeSingleMirrorImage() {
    
    // Vérifier que l'acteur existe
    const hero = game.actors.getName(heroName);
    if (!hero) return ui.notifications.error("L'acteur nommé <i>" + heroName + "</i> n'existe pas");

    // Vérifier qu'un jeton de l'acteur existe
    const token = canvas.tokens.placeables.find(token => token.actor.id === hero.id);
    if (!token) return ui.notifications.error("L'acteur nommé <i>" + heroName + "</i> n'a pas de jeton sur la scène");

    // Récupérer le nombre d'images miroir
    let mirrorImages = hero.getFlag("pf1", "spells.mirrorImages");

    // Vérifier si c'est le héros qui est touché ou une de ses images
    let touchRoll = new Roll("1d" + (mirrorImages + 1)).roll();
    if (touchRoll.total == 1) {
        let params =
            [{
                filterType: "splash",
                filterId: "mySplash",
                color: 0x990505,
                padding: 40,
                autoDestroy: true,
                time: Math.random()*1000,
                seed: Math.random(),
                splashFactor: 0.5,
                spread: 1.5,
                blend: 8,
                dimX: 1,
                dimY: 1,
                cut: false,
                textureAlphaBlend: true,
                anchorX: 0.32+(Math.random()*0.36),
                anchorY: 0.32+(Math.random()*0.36),
                animated:
                {
                    color: 
                    {
                        active: true, 
                        loopDuration: 1000,
                        loops: 5,
                    }
                }
            }];
        TokenMagic.addUpdateFilters(token, params);
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ token: token }),
            content: 'Aïe !'
        }, { chatBubble: true });
        return ;
    }

    // Mettre à jour le nombre d'images miroir
    mirrorImages = mirrorImages - 1;
    hero.setFlag("pf1", "spells", {"mirrorImages": (mirrorImages < 1 ? 0 : mirrorImages)});
    
    // Supprimer l'effet visuel du jeton si il ne reste plus d'images miroir
    if (mirrorImages < 1) return TokenMagic.deleteFilters(token, "myMirrorImages");
    
    // Mettre à jour le nombre d'images miroir et ajuster l'effet visuel sur le jeton
    hero.setFlag("pf1", "spells", {"mirrorImages": mirrorImages});
    let params = [{
        filterType: "images",
        filterId: "myMirrorImages",
        nbImage: mirrorImages,
    }];
    TokenMagic.addUpdateFilters(token, params); 
}

removeSingleMirrorImage();
