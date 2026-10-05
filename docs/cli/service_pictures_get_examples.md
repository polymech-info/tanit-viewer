##### Examples



**Record only**

```sh
tanit-cli service pictures get <picture-uuid>
```

**Download the image** (`image_url` / `url` on the record)

```sh
tanit-cli service pictures get <picture-uuid> --download
```

**Download into a directory**

```sh
tanit-cli service pictures get <picture-uuid> --download --out ./pictures/ --json
```
