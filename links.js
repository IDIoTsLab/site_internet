// ============================================================
// 🔗  LIENS DU SITE IDIoTsLab — FICHIER CENTRAL
// ============================================================
// C'est LE SEUL fichier à modifier pour gérer TOUS les liens du site.
// Change une valeur ici et elle est appliquée automatiquement sur
// toutes les pages (accueil, location de salle, mentions légales,
// politique de confidentialité).
//
// ⚠️ Ne change PAS les noms à gauche (discord, instagram, etc.) ni
//    les clés du planning (septembre-2026, ...). Modifie seulement
//    ce qui est entre les guillemets "".
// ============================================================

const SITE_LINKS = {
    // --- Réseaux sociaux ---
    discord:   "https://discord.gg/jedW4J6qwx",
    instagram: "https://www.instagram.com/idiotslab",
    github:    "https://github.com/IDIoTsLab",
    linkedin:  "https://www.linkedin.com/company/idiotslab",

    // --- Contact : l'adresse est cassée en morceaux mélangés (voir EMAIL_PARTS
    //     plus bas) et n'est reconstruite qu'au moment du clic ---

    // --- Dons / association ---
    helloasso: "https://www.helloasso.com/associations/idiotslab",

    // --- Agendas Google (intégrés en iframe) ---
    agendaGeneral: "https://calendar.google.com/calendar/embed?src=45a2ef5f476572e8e4818790e624497ea91f85f54d0785552c7b359b2fdf2cb2%40group.calendar.google.com&ctz=Europe%2FParis",
    agendaSalle:   "https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Europe%2FParis&showPrint=0&showTz=0&showCalendars=0&title=Disponibilit%C3%A9%20de%20la%20salle&src=M2NkYmVjYmI4ZDc0MWRkN2YwN2RjODAyYjMxODc4NjVhMzYzNTFkNGU3YjI2ZTI2NGRlNDQ5NmI4YWQ3OGUxYUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%237986cb",

    // --- Configuration distante (dépôt GitHub « Ressources ») ---
    configYaml: "https://raw.githubusercontent.com/IDIoTsLab/Ressources/refs/heads/main/config.yaml",
    newsImage:  "https://raw.githubusercontent.com/IDIoTsLab/Ressources/refs/heads/main/news.png",

    // --- Hébergeur (mentions légales) ---
    hebergeur: "https://ovh.com",

    // --- Inscriptions HelloAsso par événement du planning ---
    // Lien rempli -> bouton « S'inscrire sur HelloAsso »
    // Laissé vide  -> bouton « Inscription à venir »
    planning: {
        "septembre-2026": "", // Vendredi de l'Idiotie
        "octobre-2026":   "https://www.helloasso.com/associations/idiotslab/evenements/week-end-do-it-edition-octobre-2026", // Week end do it Mini Patator
        "novembre-2026":  "https://www.helloasso.com/associations/idiotslab/evenements/vendredi-de-l-idiotie", // Vendredi de l'Idiotie
        "decembre-2026":  "", // Week end do it Babioles
        "janvier-2027":   "https://www.helloasso.com/associations/idiotslab/evenements/vendredi-de-l-idiotie-edition-janvier-2027", // Vendredi de l'Idiotie
        "fevrier-2027":   "", // Week end do it Voiture RC Bluetooth
        "mars-2027":      "", // Vendredi de l'Idiotie
        "avril-2027":     "", // Week end do it Figurines
        "mai-2027":       "", // Vendredi de l'Idiotie
        "juin-2027":      "", // Week end do it Plant Keeper
        "juillet-2027":   ""  // Vendredi de l'Idiotie
    }
};

// ------------------------------------------------------------
// 📧 Adresse email cassée en morceaux : [position, texte]
// L'ordre dans le tableau est volontairement mélangé : seule la
// position (1er nombre) dit comment recoller. Aucune partie ne
// contient le nom ou le domaine en entier, donc une recherche dans
// le code source ne trouve pas l'adresse.
// ------------------------------------------------------------
const EMAIL_PARTS = [
    [5, "gm"],
    [2, "ots"],
    [0, "the"],
    [7, ".com"],
    [4, "@"],
    [1, ".idi"],
    [3, "lab"],
    [6, "ail"]
];

// Reconstruit l'adresse complète : remet les morceaux dans l'ordre et les colle
function assembleEmail() {
    return EMAIL_PARTS
        .slice()                                   // copie, on ne modifie pas l'original
        .sort(function (a, b) { return a[0] - b[0]; })
        .map(function (part) { return part[1]; })
        .join("");
}

// SITE_LINKS.email est calculée à chaque lecture (jamais stockée en clair),
// donc l'adresse n'existe en entier qu'au moment où on l'utilise.
Object.defineProperty(SITE_LINKS, "email", {
    get: assembleEmail,
    enumerable: false
});

// ============================================================
// ⚙️  APPLICATION AUTOMATIQUE — NE RIEN MODIFIER EN DESSOUS
// ============================================================
(function () {
    function applyLinks() {
        // Liens simples : <a data-link="discord">, <a data-link="helloasso">, ...
        document.querySelectorAll('[data-link]').forEach(function (el) {
            var url = SITE_LINKS[el.dataset.link];
            if (url) {
                el.href = url;
                if (!el.hasAttribute('target')) {
                    el.target = '_blank';
                    el.rel = 'noopener';
                }
            }
        });

        // Sources d'iframe : <iframe data-link-src="agendaGeneral">
        document.querySelectorAll('[data-link-src]').forEach(function (el) {
            var url = SITE_LINKS[el.dataset.linkSrc];
            if (url) el.src = url;
        });

        // Liens email (assemblés au clic) : class .email-link* ou data-link="email"
        document.querySelectorAll(
            '.email-link, .email-link-2, .email-link-3, .email-link-footer, [data-link="email"]'
        ).forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = 'mailto:' + assembleEmail();
            });
        });

        // Boutons d'inscription du planning : <a data-event="octobre-2026">
        document.querySelectorAll('.planning-card [data-event]').forEach(function (btn) {
            var url = ((SITE_LINKS.planning || {})[btn.dataset.event] || '').trim();
            if (url) {
                btn.href = url;
                btn.target = '_blank';
                btn.rel = 'noopener';
                btn.classList.remove('disabled');
                btn.removeAttribute('aria-disabled');
                btn.textContent = "S'inscrire sur HelloAsso";
            } else {
                btn.classList.add('disabled');
                btn.setAttribute('aria-disabled', 'true');
                btn.removeAttribute('href');
                btn.textContent = 'Inscription à venir';
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyLinks);
    } else {
        applyLinks();
    }
})();
