# ASSET-01 Location Photography Inventory

Audit date: 12 August 2026

This inventory records the client-supplied source archive, mapping evidence,
publication readiness, and the representative photograph used by the Version 4
homepage. File sizes are exact bytes. Source files remain preserved under
`assets/Store photos/`.

The preserved client archive contains 62 files: 52 confidently mapped Melbourne
location photographs, seven USA photographs awaiting a specific store mapping,
and three franchise-page files that do not identify a location. The organised
production folders also retain 22 WebP assets that pre-date this client archive;
these are production media, not additional newly supplied originals.

## Pre-repair Version 4 audit

| Location | Media at task start | Existed | Format | Dimensions / size | Published markup |
|---|---|---:|---:|---|---|
| Peel Street | `assets/Peel St.webp` | Yes | WebP | 1040×780 / 88,240 B | `width="1040" height="780"`, meaningful alt, `loading="lazy"`, `decoding="async"` |
| Racecourse Road | `assets/Racecourse3.webp` | No | WebP | Missing | `width="1360" height="764"`, meaningful alt, `loading="lazy"`, `decoding="async"` |
| Spencer Street | `assets/Spencer.webp` | No | WebP | Missing | `width="1360" height="1020"`, meaningful alt, `loading="lazy"`, `decoding="async"` |
| Brunswick Street | `assets/Brunswick1.webp` | No | WebP | Missing | `width="1360" height="765"`, meaningful alt, `loading="lazy"`, `decoding="async"` |
| Ascot Vale Road | `assets/Ascot Vale1.webp` | No | WebP | Missing | `width="1360" height="1020"`, meaningful alt, `loading="lazy"`, `decoding="async"` |
| East Windsor | Existing non-image placeholder | Yes | — | — | Decorative placeholder hidden from assistive technology |

## Current Version 4 location media

| Location | Published media | Format | Dimensions | Size | Markup | Status |
|---|---|---:|---:|---:|---|---|
| Peel Street | `assets/locations/north-melbourne/north-melbourne-01.webp` | WebP | 1040×780 | 88,240 B | `width="1040" height="780"`, meaningful alt, `loading="lazy"`, `decoding="async"` | Resolves |
| Racecourse Road | `assets/locations/flemington/flemington-01.webp` | WebP | 1360×764 | 148,548 B | `width="1360" height="764"`, meaningful alt, `loading="lazy"`, `decoding="async"` | Resolves |
| Spencer Street | `assets/locations/west-melbourne/west-melbourne-01.webp` | WebP | 1360×1020 | 229,946 B | `width="1360" height="1020"`, meaningful alt, `loading="lazy"`, `decoding="async"` | Resolves |
| Brunswick Street | `assets/locations/fitzroy/fitzroy-01.webp` | WebP | 1360×765 | 156,606 B | `width="1360" height="765"`, meaningful alt, `loading="lazy"`, `decoding="async"` | Resolves |
| Ascot Vale Road | `assets/locations/ascot-vale/ascot-vale-01.webp` | WebP | 1360×1020 | 257,896 B | `width="1360" height="1020"`, meaningful alt, `loading="lazy"`, `decoding="async"` | Resolves |
| East Windsor | Existing non-image placeholder | — | — | — | Decorative placeholder is hidden from assistive technology | Awaiting store mapping confirmation |

## Broken legacy references repaired

| Location | Broken path | Confirmed replacement |
|---|---|---|
| Racecourse Road | `assets/Racecourse3.webp` | `assets/locations/flemington/flemington-01.webp` |
| Spencer Street | `assets/Spencer.webp` | `assets/locations/west-melbourne/west-melbourne-01.webp` |
| Brunswick Street | `assets/Brunswick1.webp` | `assets/locations/fitzroy/fitzroy-01.webp` |
| Ascot Vale Road | `assets/Ascot Vale1.webp` | `assets/locations/ascot-vale/ascot-vale-01.webp` |

Peel Street was not broken, but its working asset was moved into the same
normalised production structure and its only application reference was updated.

## Mapping decisions

| Client source group | Likely location | Confidence | Evidence |
|---|---|---|---|
| `Store photos/North Melbourne/` | Peel Street | HIGH | Client folder says North Melbourne, filenames say Peel St, and current model has one North Melbourne store. |
| `Store photos/Fleminngton/` | Racecourse Road | HIGH | Client folder identifies Flemington; the separate Ascot Vale group removes the second Flemington-address ambiguity, and images match the established Racecourse interior. |
| `Store photos/West Melbourne/` | Spencer Street | HIGH | Client folder identifies West Melbourne and storefront photography visibly shows street number 501. |
| `Store photos/Ascot vale/` | Ascot Vale Road | HIGH | Client folder and storefront signage identify the Ascot Vale store. |
| `Store photos/Fitzroy/` | Brunswick Street | HIGH | Client folder identifies Fitzroy and the current model has one Fitzroy store. |
| `Store photos/USA/` | East Windsor candidate | MEDIUM | Images clearly depict a Wash Bar USA interior, but no visible address or source metadata ties them specifically to East Windsor. Do not publish yet. |
| `Store photos/franchise page/` | Not a location group | UNKNOWN | Folder describes future franchise-page use and does not identify a store. Out of scope for ASSET-01. |

## Client source inventory

The tables below inventory each canonical client-source photograph once. The
52 root-level client-source copies were byte-for-byte duplicates of files in
`assets/Store photos/`; they are not counted a second time. The 22 older WebP
production assets are retained separately in the organised production folders.

### North Melbourne / Peel Street — HIGH confidence

| Filename | Format | Dimensions | Size |
|---|---:|---:|---:|
| `Peel St 1.jpg` | JPG | 1040×780 | 111,929 B |
| `Peel St 2.jpg` | JPG | 1040×780 | 101,627 B |
| `Peel St 3.jpg` | JPG | 1080×1080 | 804,398 B |
| `Peel St 4.jpg` | JPG | 1521×1141 | 353,406 B |
| `Peel St 5.jpg` | JPG | 1024×768 | 388,117 B |
| `Peel St 6.jpg` | JPG | 1231×966 | 610,563 B |
| `Peel St 7.JPG` | JPG | 1470×828 | 236,639 B |
| `Peel St 8.JPG` | JPG | 1470×828 | 219,839 B |
| `Peel St 9.JPG` | JPG | 1470×828 | 270,360 B |
| `Peel St 10.jpg` | JPG | 1216×913 | 310,212 B |
| `Peel St 11.jpg` | JPG | 1080×1080 | 190,459 B |
| `Peel St 12.jpg` | JPG | 1040×780 | 135,885 B |
| `Peel St 13.webp` | WebP | 1040×780 | 150,932 B |

### Flemington / Racecourse Road — HIGH confidence

| Filename | Format | Dimensions | Size |
|---|---:|---:|---:|
| `Fleminngton 1.jpg` | JPG | 1521×1141 | 352,154 B |
| `Fleminngton 2.jpg` | JPG | 1521×1453 | 255,541 B |
| `Fleminngton 3.jpg` | JPG | 1521×1141 | 308,114 B |
| `Fleminngton 4.jpg` | JPG | 1024×768 | 472,675 B |
| `Fleminngton 5.jpg` | JPG | 1521×1141 | 331,381 B |
| `Fleminngton 6.jpg` | JPG | 1073×1073 | 974,313 B |
| `Fleminngton 7.jpg` | JPG | 1080×1080 | 726,158 B |
| `Fleminngton 8.jpg` | JPG | 1216×913 | 376,089 B |
| `Fleminngton 9.jpg` | JPG | 1521×1141 | 331,574 B |
| `Fleminngton 10.jpg` | JPG | 1521×1141 | 282,368 B |
| `Fleminngton 11.jpg` | JPG | 1521×1141 | 189,646 B |
| `Fleminngton 12.jpg` | JPG | 1521×1521 | 453,483 B |

### West Melbourne / Spencer Street — HIGH confidence

| Filename | Format | Dimensions | Size |
|---|---:|---:|---:|
| `2022-08-21.jpg` | JPG | 1080×810 | 94,465 B |
| `2022-08-21 (1).jpg` | JPG | 1080×810 | 223,483 B |
| `2022-08-21 (2).jpg` | JPG | 1080×810 | 196,306 B |
| `2022-08-21 (3).jpg` | JPG | 1521×1141 | 165,686 B |
| `2022-08-21 (4).jpg` | JPG | 1521×2028 | 374,621 B |
| `IMG_6162.jpg` | JPG | 1216×913 | 338,159 B |

### Ascot Vale / Ascot Vale Road — HIGH confidence

| Filename | Format | Dimensions | Size |
|---|---:|---:|---:|
| `Ascot vale 1.jpg` | JPG | 1521×856 | 368,488 B |
| `Ascot vale 2.jpg` | JPG | 1521×2028 | 546,080 B |
| `Ascot vale 3.jpg` | JPG | 1521×1141 | 502,704 B |
| `Ascot vale 4.jpg` | JPG | 1521×2028 | 844,809 B |
| `Ascot vale 5.jpg` | JPG | 1521×1141 | 483,933 B |
| `Ascot vale 6.jpg` | JPG | 1521×1141 | 507,728 B |
| `Ascot vale 7.jpg` | JPG | 1280×960 | 300,492 B |
| `Ascot vale 8.jpg` | JPG | 1521×1145 | 538,416 B |
| `Ascot vale 9.jpg` | JPG | 1521×1141 | 305,899 B |

### Fitzroy / Brunswick Street — HIGH confidence

| Filename | Format | Dimensions | Size |
|---|---:|---:|---:|
| `Fitzroy 1.jpg` | JPG | 1521×684 | 177,956 B |
| `Fitzroy 2.jpg` | JPG | 1521×684 | 171,452 B |
| `Fitzroy 3.jpg` | JPG | 1521×684 | 151,520 B |
| `Fitzroy 4.jpg` | JPG | 1521×684 | 193,957 B |
| `Fitzroy 5.jpg` | JPG | 1521×684 | 169,562 B |
| `Fitzroy 6.jpg` | JPG | 1521×684 | 117,638 B |
| `Fitzroy 7.jpg` | JPG | 1521×856 | 261,915 B |
| `Fitzroy 8.jpg` | JPG | 1521×1141 | 453,663 B |
| `Fitzroy 9.jpg` | JPG | 1521×1141 | 329,904 B |
| `Fitzroy 10.JPG` | JPG | 1470×828 | 268,250 B |
| `Fitzroy 11.JPG` | JPG | 1470×828 | 276,084 B |
| `Fitzroy 12.JPG` | JPG | 402×226 | 35,135 B |

### USA / possible East Windsor — MEDIUM confidence

**CLIENT MEETING — LOCATION CONFIRMATION REQUIRED:** these files clearly show
a Wash Bar USA interior but contain no visible address proving East Windsor.

| Filename | Format | Dimensions | Size |
|---|---:|---:|---:|
| `USA 1.webp` | WebP | 1360×1020 | 266,006 B |
| `USA 2.webp` | WebP | 1360×1020 | 251,652 B |
| `USA 3.webp` | WebP | 1360×1020 | 225,546 B |
| `USA 4.webp` | WebP | 765×1020 | 134,964 B |
| `USA 5.webp` | WebP | 574×1020 | 78,572 B |
| `USA 6.webp` | WebP | 765×1020 | 152,360 B |
| `USA 7.webp` | WebP | 765×1020 | 121,550 B |

### Franchise-page source files — UNKNOWN location and out of scope

| Filename | Format | Dimensions | Size |
|---|---:|---:|---:|
| `0744abe1-550b-465b-8d42-5301f8887863.jpg` | JPG | 685×913 | 162,583 B |
| `1000052406.jpg` | JPG | 1054×607 | 139,874 B |
| `unnamed (3).jpg` | JPG | 1521×1141 | 189,646 B |

## Organised production structure

- `assets/locations/north-melbourne/`: 20 confirmed files
- `assets/locations/flemington/`: 15 confirmed files
- `assets/locations/west-melbourne/`: 10 confirmed files
- `assets/locations/ascot-vale/`: 12 confirmed files
- `assets/locations/fitzroy/`: 17 confirmed files
- `assets/locations/east-windsor/`: not created; mapping remains unconfirmed

Only each location's `-01.webp` file is rendered by Version 4. Additional
confirmed files are organised for a future separately approved experience.

## Performance review

**PERFORMANCE REVIEW:** 25 client source JPG files exceed 300 KiB (307,200 B). The
largest are `Fleminngton 6.jpg` (974,313 B), `Ascot vale 4.jpg` (844,809 B),
and `Peel St 3.jpg` (804,398 B). No client location photograph exceeds 1 MB.
No conversion, resizing, or recompression was performed in ASSET-01.

The five published representative WebP files are all below 300 KB.
