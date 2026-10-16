# Version 3 — extension du corpus et parcours gradués

## Inventaire
- 1 000 exercices uniques, 250 par niveau A1/A2/B1/B2, produits par 40 modèles grammaticaux et 25 variantes lexicales par modèle.
- 1 000 contextes spatiaux, issus de 25 catégories de lieux et de 40 villes. Les établissements ne sont pas des adresses réelles vérifiées. Les scénarios sont partagés et paramétrés ; les informations de compréhension sont propres au contexte.
- 6, 7, 8 ou 9 étapes principales selon le niveau, plus des embranchements de réparation. Les modèles sont utilisables dans les deux modes : interaction et décisions contextualisées.
- Répétition des sessions sans limite ; corpus fini et transparence sur les variantes. Aucun modèle génératif ni production libre automatique.

## Changement d’expérience
Prénom ou pseudonyme à la première visite, niveaux indépendants dans les trois jeux, filtre par ville et lieu, examen grammatical exploratoire en 20 questions, ressources de référence ouvertes sur leur site d’origine. Suppression de la voix et de l’atelier utilisateur.

## Évaluation
18 tests unitaires et de contenu réussis. Les nouveaux tests contrôlent le nombre et l’unicité des exercices, l’absence de cibles ambiguës, les 4 000 graphes contextuels gradués, leurs sorties et leur accessibilité, le profil et le repérage grammatical.

Test navigateur isolé du bundle final, sans réseau et avec stockage simulé : première saisie du prénom, retour sans nouvelle demande, sélection de niveau avant exercice, correction et continuation, filtres du catalogue, mauvais choix puis réparation, restauration du parcours, bascule des langues, vingt réponses du test, et état d’installation simulé. Six pages contrôlées en 1440 et 390 pixels, sans débordement horizontal ni exception JavaScript. Captures inspectées.

Le cycle beforeinstallprompt/appinstalled a été testé avec des événements simulés ; cela ne prouve pas une installation sur iOS ou Android. Une installation sur appareil et le mode avion restent à tester.

## Sources du module examens, consultées le 16 octobre 2026
- TV5MONDE : https://apprendre.tv5monde.com/fr/apprendre-francais/tester-son-niveau
- TV5MONDE, entraînement TCF : https://apprendre.tv5monde.com/fr/tcf
- France Éducation international : https://www.france-education-international.fr/diplome/delf-tout-public/niveau-a1/exemples-sujets ; pages analogues A2, B1 et B2.

Le site FEI a refusé l’accès automatique de notre réseau ; ses pages de niveau et les résultats indexés confirment la section de modèles, mais les téléchargements ne sont pas redistribués. Le simulateur TV5MONDE indique lui-même qu’un résultat d’entraînement ne garantit pas le résultat officiel. ParleQuest n’est ni affilié, ni centre certificateur, ni fournisseur d’un test officiel.

## Protocole de validation pédagogique à poursuivre
Faire relire les 40 modèles et leurs variantes par un enseignant FLE ; mesurer la difficulté réelle des items et des scénarios ; évaluer la compréhension et la stratégie pragmatique séparément du score de jeu. La classification CECRL demeure indicative. Le test interne est volontairement décrit comme un repérage grammatical, sans évaluation de la production orale ou écrite libre.

## Complément PWA et vérification en ligne
20 tests réussis après ajout des contrôles de manifeste, des icônes, de l’activation du service worker, de la préservation des caches d’autres applications, et du repli de navigation hors ligne dans un environnement simulé. Une expression de détection des fichiers de manifeste et d’icônes a été corrigée.

Sur la version effectivement déployée : première demande du prénom, sélection B1 avant affichage de l’exercice, correction « avais », 20 XP et conservation après rechargement, filtrage du catalogue CultureQuest en B2 (1000 contextes puis un seul après filtre), ouverture de Lyon/bureau du directeur et branche de réparation après un choix inadapté vérifiés. Le lien principal a été rechargé pour quitter l’ancienne version en cache. Le prénom du visiteur principal n’a pas été rempli à sa place ; les tests fonctionnels ont été réalisés sur l’origine distincte de l’édition déployée.
