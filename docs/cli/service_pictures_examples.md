##### Examples



**List pictures for the logged-in user**

```sh
tanit-cli service pictures list --limit 20
```

**Fetch one record and download the asset**

```sh
tanit-cli service pictures get <picture-uuid> --download --out ./pictures/
```
