# YANIS MEAL

Application web de planification de repas, avec des plats de la cuisine ivoirienne.

## Fonctionnalités
- Création de compte, connexion et déconnexion
- Planning de la semaine : 7 jours, 3 repas par jour
- Catalogue de 15 plats avec leurs ingrédients
- Liste de courses générée automatiquement
- Remise à zéro de la semaine

## Technologies
HTML, CSS, JavaScript, PHP 8.2, MariaDB, Nginx, Docker

## Structure du projet
- `src/` : les pages du site
- `api/` : l'API en PHP (comptes, plats, planning)
- `db_data/` : le script SQL qui crée la base de données
- `nginx/` : la configuration du serveur web
- `php/` : le Dockerfile de PHP

## Lancer le projet
1. Installer Docker Desktop.
2. Ouvrir un terminal dans le dossier du projet.
3. Lancer : `docker compose up -d --build`
4. Ouvrir http://localhost:8080 dans le navigateur.

## Auteur
Yanis Messou — étudiant en MIAGE
