##### Examples



**Post record**

```sh
tanit-cli service posts get <post-uuid>
```

**Responsive image query**

```sh
tanit-cli service posts get <post-uuid> --sizes 480,960 --formats webp,jpeg --lang en
```

**Download media into a directory**

```sh
tanit-cli service posts get <post-uuid> --download --out ./post-media/ --json
```
