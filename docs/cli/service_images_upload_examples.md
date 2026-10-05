##### Examples



**One image**

```sh
tanit-cli service images upload photo.png
```

**Several images, one JSON object per file**

```sh
tanit-cli service images upload a.jpg b.png --json
```

**Exact HTTP response** (`http_status` and `raw_body`)

```sh
tanit-cli service images upload photo.png --dump-raw-http
```
