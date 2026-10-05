##### Examples



**List posts**

```sh
tanit-cli service posts list --limit 20
```

**Create a post from images**

```sh
tanit-cli service posts create photo.png --title "Bench"
```

**Fetch one post and download its media**

```sh
tanit-cli service posts get <post-uuid> --download --out ./post-media/
```
