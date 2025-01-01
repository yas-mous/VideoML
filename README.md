# VideoML project
### Commandes 
voir dans langium-quickstart.md
### Générer du code a partir d'un .vml

```bash
npm run cli ..\demo\test2.vml 
```

### Exemple de grammaire possible 
```bash
timeline myVideo {
    ---
    |Video'videos/video1.mp4',from 5,to 8
    ---
    |Video'videos/video2.mp4',from 13, to 14
    ---
    |Video'videos/video1.mp4',to 5
}

```

### Requirements

Avoir la version **2.1.1** de **moviepy**