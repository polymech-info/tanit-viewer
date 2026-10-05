##### Examples



Creates the post, uploads each file through `/api/images`, then attaches pictures. The default title is the first filename. Visibility is `public`, `listed`, or `private`.

**One image**

```sh
tanit-cli service posts create photo.png --title "Bench" --description "Shop photo"
```

**Several images**

```sh
tanit-cli service posts create a.jpg b.png --visibility listed --json
```

**Private post**

```sh
tanit-cli service posts create draft.png --visibility private
```

**Windows share dialog** (Explorer `Share to Tanit...` verb)

```sh
tanit-cli service posts create photo.png --job-ui
```
