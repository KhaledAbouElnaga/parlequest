# ParleQuest : dossier académique

## Présentation
ParleQuest est un prototype web d’apprentissage du français langue étrangère destiné à des apprenants travaillant des situations de difficulté indicative A2–B1. Il associe trois modalités : une conversation à embranchements (Parle Vrai), une activité de repérage et de correction grammaticale (ErreurLab), et des décisions de communication contextualisées (CultureQuest). Le fonctionnement ne nécessite ni compte, ni abonnement, ni clé d’API.

Le prototype relève d’une scénarisation pédagogique explicite : il n’interprète pas une conversation libre et ne produit pas de réponse générative. La correction compare une réponse à une liste de formes acceptées. La recommandation utilise la fréquence des catégories d’erreurs au premier essai. Cette transparence rend les décisions du système inspectables.

## Titres proposés
1. ParleQuest : scénarisation interactive et rétroaction explicite pour l’apprentissage du français langue étrangère.
2. De l’erreur à la décision : conception d’un environnement gratuit de pratique linguistique et pragmatique.
3. Articuler grammaire, interaction et compétence interculturelle dans une application de FLE.

## Problématique
Dans quelle mesure un environnement associant choix conversationnels, correction expliquée et réflexion pragmatique peut-il soutenir l’engagement et le transfert vers des situations nouvelles chez des apprenants de FLE ?

## Questions et hypothèses à tester
- Les explications explicites améliorent-elles la correction de phrases inédites portant sur les mêmes règles ?
- Les apprenants justifient-ils mieux leurs choix de registre après le parcours ?
- Une suggestion de révision fondée sur les erreurs favorise-t-elle la reprise volontaire d’un exercice ?
Ces propositions ne sont pas des résultats : aucune efficacité pédagogique n’a encore été démontrée.

## Méthode proposée
Recruter, avec consentement, un groupe pilote d’environ 12 à 20 étudiants volontaires ; expliquer les limites de généralisation d’un petit échantillon. Préparer un prétest et un post-test parallèles comprenant correction grammaticale, choix contextualisés et courte production écrite. Faire valider le contenu et le barème par un enseignant de FLE avant la collecte. Si possible, comparer deux groupes avec et sans explications, en contrôlant la durée et le niveau initial ; sinon annoncer une étude exploratoire pré/post sans conclusion causale.

Prévoir une séance de 20 à 30 minutes, puis une épreuve de transfert différée une semaine après. Recueillir uniquement des données consenties, pseudonymisées, sans nom dans les exports. Les traces restent locales ; le participant choisit de transmettre son export. Ne pas confondre les XP, susceptibles de varier selon le parcours, avec une mesure de compétence.

## Indicateurs et analyse
Comparer les scores de correction sur des items inédits, la qualité des justifications pragmatiques selon une grille explicite (adéquation au contexte, atténuation, justification), les abandons et les difficultés d’utilisation. Présenter les différences individuelles et les incertitudes ; conserver un barème identique entre les tests. Compléter par de courts entretiens. Ne pas annoncer une mesure de fluidité orale : le système ne reconnaît ni n’évalue la parole.

## Limites
Corpus restreint, choix guidés, correction fermée, absence d’évaluation de production libre, effet de mémorisation possible, contenus nécessitant une relecture enseignante. Les niveaux proposés sont indicatifs ; les niveaux du tableau de bord sont des jalons ludiques. Les pratiques culturelles dépendent des personnes, des institutions et du contexte.

## Feuille de route
1. Validation linguistique par un enseignant, tests utilisateurs et ajustement de l’accessibilité au clavier et au lecteur d’écran.
2. Ajouter des scénarios d’entretien, logement et vie quotidienne ; enrichir les réponses acceptées avec des variantes justifiées.
3. Étendre l’atelier aux graphes de dialogue et aux situations culturelles, avec validation des liens et import/export de corpus versionnés.
4. Ajouter révision espacée, migration de données et tests d’intégration continus ; prévoir un mode hors ligne avec cache versionné.
5. Étudier éventuellement un modèle local téléchargeable, facultatif et désactivé par défaut. Mesurer ses coûts matériels, sa précision et ses limites sans remplacer le moteur déterministe.

## Plan de soutenance
Besoin pédagogique → problématique → démonstration d’un parcours ramifié → correction expliquée → recommandation → architecture et protection des données → protocole d’évaluation → limites et perspectives.

## Évolution v3
L’inventaire et la validation actuels sont décrits dans RELEASE-V3.md. Le corpus comporte désormais 1000 exercices et 1000 contextes paramétrés (25 lieux ×40 villes), avec 6–9 étapes principales graduées et des reprises. Un repérage grammatical interne ne doit pas être confondu avec une certification ou un placement intégral. Les villes sont réelles mais les institutions et détails sont fictifs. Une relecture enseignante du corpus étendu reste indispensable au protocole de recherche proposé ci-dessus.
