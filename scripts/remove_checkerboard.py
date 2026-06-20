"""
Remove the baked-in 'fake transparency' checkerboard from the icons-source
cutout car images and produce genuine transparent PNGs.

The checkerboard is two tight colours: near-pure white (~248-255) and a light
grey (~225-242), both very low saturation. We make exactly those pixels
transparent. The thresholds are tight enough that coloured / shaded car bodies
(including silver and off-white) are preserved, and enclosed regions such as
windows become transparent too (no leftover checkerboard).
"""

import os
from collections import deque
from PIL import Image
import numpy as np

SRC = "design-source/icons-source"
DST = "public/images/categories"
os.makedirs(DST, exist_ok=True)

# source icon number -> output category file name
OUT = {
    "1": "hasarli",
    "2": "kazali",
    "3": "agir-hasarli",
    "4": "hurda",
    "5": "cekme-belgeli",
    "6": "motor-arizali",
    "7": "yanmis",
    "8": "sel-hasarli",
}


def border_flood(light, w, h):
    """Connected light region reachable from the image border (BFS)."""
    cand = light.ravel().tolist()
    visited = bytearray(w * h)
    dq = deque()

    def seed(i):
        if cand[i] and not visited[i]:
            visited[i] = 1
            dq.append(i)

    for x in range(w):
        seed(x); seed((h - 1) * w + x)
    for y in range(h):
        seed(y * w); seed(y * w + (w - 1))

    while dq:
        i = dq.popleft()
        x = i % w
        if x > 0 and cand[i - 1] and not visited[i - 1]:
            visited[i - 1] = 1; dq.append(i - 1)
        if x < w - 1 and cand[i + 1] and not visited[i + 1]:
            visited[i + 1] = 1; dq.append(i + 1)
        if i >= w and cand[i - w] and not visited[i - w]:
            visited[i - w] = 1; dq.append(i - w)
        if i < w * (h - 1) and cand[i + w] and not visited[i + w]:
            visited[i + w] = 1; dq.append(i + w)

    return np.frombuffer(bytes(visited), dtype=np.uint8).astype(bool).reshape(h, w)


def process(src_path, dst_path):
    im = Image.open(src_path).convert("RGBA")
    w, h = im.size
    arr = np.array(im)
    rgb = arr[:, :, :3].astype(np.int16)
    mn = rgb.min(axis=2)
    mx = rgb.max(axis=2)
    spread = mx - mn

    # Tight checkerboard colours (also catches enclosed windows).
    white = (mn >= 244) & (spread <= 12)
    grey = (mn >= 222) & (mx <= 244) & (spread <= 14)
    tight = white | grey

    # Looser "lightish" mask, flooded from the border to clean anti-aliased
    # edges and any stray specks connected to the outside background.
    light = (mn >= 196) & (spread <= 34)
    flooded = border_flood(light, w, h)

    bg = tight | flooded
    arr[:, :, 3][bg] = 0

    out = Image.fromarray(arr, "RGBA")
    # Crop to the visible (non-transparent) content with a small margin.
    alpha_bbox = out.split()[3].getbbox()
    if alpha_bbox:
        pad = 10
        l, t, r, b = alpha_bbox
        l = max(0, l - pad); t = max(0, t - pad)
        r = min(w, r + pad); b = min(h, b + pad)
        out = out.crop((l, t, r, b))
    out.save(dst_path)
    pct = 100 * (arr[:, :, 3] > 0).mean()
    return out.size, round(pct, 1)


for num, name in OUT.items():
    src = os.path.join(SRC, f"{num}.png")
    dst = os.path.join(DST, f"{name}.png")
    size, pct = process(src, dst)
    print(f"{num}.png -> {name}.png  size={size}  kept={pct}%")

print("done")
