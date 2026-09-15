## Opening files with `tanit://` links

Tanit registers a custom URL scheme so any application — a browser, an email
client, a chat message, or a script — can open a file directly in the viewer
with a single click.

### How it works

Click a `tanit://` link anywhere on your machine.  Your browser shows a
one-time "Open PolyMech Tanit?" confirmation (this is a standard OS security
prompt, the same as `magnet:` links for torrent clients).  After you confirm,
Tanit opens and a **permission dialog** appears asking whether to allow this
type of link.  Choose **Allow always** to skip the dialog for future links of
the same kind.

### Link formats

| What you want to open | Link |
|---|---|
| Image, document, or model from the cloud | `tanit://view/vfs/{mount}/{path}` |
| Local file | `tanit://view/C:/path/to/file.ext` |
| Local folder (file tree) | `tanit://browse/C:/path/to/folder` |

**Examples**

```
tanit://view/vfs/models/test/pic.png
tanit://view/vfs/models/test/assistant.md
tanit://view/vfs/models/test/extruders-en.xlsx
tanit://view/C:/Reports/summary.pdf
tanit://browse/C:/Projects/my-design
```

### Variables in links

Links support `${VAR}` substitution for common system locations.  Use these
to create portable links that work on any machine regardless of the user's
actual home directory.

**Known folders**

| Variable | Resolves to |
|---|---|
| `${HOME}` | User home directory |
| `${DESKTOP}` | Desktop |
| `${DOCUMENTS}` | Documents |
| `${DOWNLOADS}` | Downloads |
| `${PICTURES}` | Pictures |
| `${MUSIC}` | Music |
| `${VIDEOS}` | Videos |

```
tanit://browse/${PICTURES}
tanit://browse/${DOCUMENTS}
tanit://view/${DESKTOP}/report.pdf
tanit://view/${DOWNLOADS}/invoice.xlsx
```

**Date variables** — useful for log or archive folders organised by date:

| Variable | Example output |
|---|---|
| `${YYYY}` | `2026` |
| `${MM}` | `07` |
| `${DD}` | `06` |

```
tanit://browse/${DOCUMENTS}/logs/${YYYY}-${MM}
tanit://view/vfs/models/${YYYY}/${MM}/notes.md
```

**Named settings values** — values you have saved in the app under
Settings → Variables:

```
tanit://browse/${USER:scratch_dir}
tanit://view/${USER:project_root}/README.md
```

> Variables are expanded before the link is processed.  If a variable is
> unknown or refers to a path that does not exist, the link is rejected with
> an error rather than silently opening the wrong location.

### First-time setup

The `tanit://` handler must be registered once before links will work:

```powershell
tanit installer --url-schemes
```

To remove it:

```powershell
tanit installer --uninstall --url-schemes
```

### Permission dialog

The first time you open a link, Tanit asks for permission.  The dialog shows
the file being opened and a suggested scope:

| File type | Default permission scope | Risk shown |
|---|---|---|
| Images, documents | All files of that type (`tanit://view/**/*.png`) | Low |
| HTML, SVG | Files in the same folder (`tanit://view/vfs/…/**`) | Medium |
| Automation files (`.xblox`) | This exact file only | High |

You can edit the scope in the dialog before confirming, or choose
**Allow once** / **Allow for session** if you do not want a permanent grant.
Permissions are stored in your local settings and can be reviewed or revoked
at any time from **Settings → Security → Permissions**.

### Authenticated files

Files on private mounts require a token.  Append it as a query parameter — 
your app or admin tool provides the token:

```
tanit://view/vfs/home/my-notes.md?token=eyJ…
```

### Troubleshooting

| Symptom | Fix |
|---|---|
| Nothing happens when clicking the link | Run `tanit installer --url-schemes` and retry |
| Browser shows "no app found" | Same as above — handler not registered |
| Permission dialog appears every time | Click **Allow always** and confirm the scope covers future links |
| Link opens the wrong file | Check that the `{mount}` and `{path}` in the URL are correct |
