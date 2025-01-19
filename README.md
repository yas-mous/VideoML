# VideoML project
### Prérequis
- python3
- moviepy (version 2.1.1)
### Commandes 
voir dans langium-quickstart.md
### Générer du code a partir d'un .vml

**Lancer le serveur video-generator**
```bash
cd video-generator
npm install

npm run build

npm run start
```

**A la racine du projet**
```bash
npm install

npm run grammar //=npm run langium:generate
npm run build //build videoML & frontend
npm run frontend //launch frontend
```




**In videoML**

after any modif in the grammar 
```bash
npm run langium:generate
```
 after any modif in the generator
 ```bash
npm run build
 ```
 Press `F5` to open a new window with your extension loaded to write `.vml` code

 to generte code

```bash
npm run cli ..\demo\test2.vml 
```

### Exemple de grammaire possible 
**optionnel :**
- & mp4 : pour modifier l extension (validation a faire pour accepter que les extensions videos)
- output'../generatedVideos' : pour specifier un chemin, par defaut meme repertoire que le fichier .vml
    - **with / : "C:/videos/myVideo.mp4"**

```bash
timeline myVideo & mp4 output'../generatedVideos'{
    ---
    |Video'videos/video1.mp4',from 5,to 8
    ---
    |Video'videos/video2.mp4',from 13, to 14
    ---
    |Video'videos/video1.mp4',to 5
}

```
to add subtitle 
```bash
timeline myVideo {
    ---
    |Video 'videos/video1.mp4', subtitle: {text: 'Bienvenue', start: 1, duration: 5}
}
```

#### Effets

Avec effets freeze

```bash
timeline myVideo {
    ---
    |Video'videos/video1.mp4',from 5,to 8
    ---
    |Video'videos/video2.mp4',from 10, to 14 ~freeze 2+3
    ---
    |Video'videos/video1.mp4',to 5
}
```
Avec effet crop appliqué sur toute la video1.mp4
```bash
timeline myVideo {
    ---
    |Video'videos/video2.mp4' ~freeze 2+3
    |Video'videos/video1.mp4' ~crop x 200,y 200, width 200, height 200
}
```

Avec effet crop appliqué sur la video1.mp4 dans l extrait de 2s a 4s.
Le reste de la vidéo reste inchangé.
```bash
timeline myVideo {
    ---
    |Video'videos/video2.mp4', to 7 ~freeze 2+3
    |Video'videos/video1.mp4' 
    ~crop x 200,y 200, width 200, height 200,from 2,to 4
}
```
Avec effet grayscale : converti la video en couleur de gris. From et to sont optionnel pour rendre seulement une partie de la video grise.
```bash
timeline grayscaleVideo {
    ---
    |Video'videos/video2.mp4', from 7 ~grayscale, from 4, to 6
}
```


### Generated videos

Exemples de vidéos générés par le DSL
`VideoML\demo\generatedVideos`
