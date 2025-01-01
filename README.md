# VideoML project
### Commandes 
voir dans langium-quickstart.md
### Générer du code a partir d'un .vml

```bash
npm run cli ..\demo\test2.vml 
```

### Exemple de grammaire possible 
```bash
timeline App {
    ---
    |'video1.mp4'
    |'video2.mp4', begin: 0, end: 10
    |'video3.mp4', begin: 10, end: 20
    ---
    |'video4.mp4'
    |'video5.mp4', begin: 30, end: 40
    |'video6.mp4', begin: 40, end: 50
    ---
    |'video7.mp4'
}

```

### Requirements

Avoir la version **2.1.1** de **moviepy**