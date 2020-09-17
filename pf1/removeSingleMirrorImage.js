///// CONFIGURATION
const heroName = "Anton Haralamb";

///// INFORMATION
// Système : Pathfinder 1
// Module(s) nécessaire(s) : Magic Token FX
// Notes : 

///// SCRIPT
function removeSingleMirrorImage() {
    
    // Vérifier que l'acteur existe
    const hero = game.actors.getName(heroName);
    if (!hero) return ui.notifications.error("L'acteur nommé <i>" + heroName + "</i> n'existe pas");

    // Vérifier qu'un jeton de l'acteur existe
    const token = canvas.tokens.placeables.find(token => token.actor.id === hero.id);
    if (!token) return ui.notifications.error("L'acteur nommé <i>" + heroName + "</i> n'a pas de jeton sur la scène");

    // Récupérer le nombre d'images miroir et le mettre à jour
    let mirrorImages = hero.getFlag("pf1", "spells.mirrorImages") - 1;
    hero.setFlag("pf1", "spells", {"mirrorImages": (mirrorImages < 1 ? 0 : mirrorImages)});
    
    // Supprimer l'effet visuel du jeton si il ne reste plus d'images miroir
    if (mirrorImages < 1) return TokenMagic.deleteFilters(token, "myMirrorImages");
    
    // Mettre à jour le nombre d'images miroir et ajuster l'effet visuel sur le jeton
    hero.setFlag("pf1", "spells", {"mirrorImages": mirrorImages});
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
}

removeSingleMirrorImage();
