"""Make the brand logos transparent by flood-filling the outer background
(dark for dark-logo, light for light-logo) and auto-cropping the margins."""
import os
from collections import deque
from PIL import Image
import numpy as np

DIR = "public/images/logo"


def border_flood(mask, w, h):
    cand = mask.ravel().tolist()
    visited = bytearray(w * h)
    dq = deque()
    def seed(i):
        if cand[i] and not visited[i]:
            visited[i] = 1; dq.append(i)
    for x in range(w):
        seed(x); seed((h - 1) * w + x)
    for y in range(h):
        seed(y * w); seed(y * w + (w - 1))
    while dq:
        i = dq.popleft(); x = i % w
        if x > 0 and cand[i-1] and not visited[i-1]: visited[i-1]=1; dq.append(i-1)
        if x < w-1 and cand[i+1] and not visited[i+1]: visited[i+1]=1; dq.append(i+1)
        if i >= w and cand[i-w] and not visited[i-w]: visited[i-w]=1; dq.append(i-w)
        if i < w*(h-1) and cand[i+w] and not visited[i+w]: visited[i+w]=1; dq.append(i+w)
    return np.frombuffer(bytes(visited), dtype=np.uint8).astype(bool).reshape(h, w)


def process(name, mode):
    p = os.path.join(DIR, f"{name}.png")
    im = Image.open(p).convert("RGBA")
    w, h = im.size
    arr = np.array(im)
    rgb = arr[:, :, :3].astype(np.int16)
    mn = rgb.min(2); mx = rgb.max(2); spread = mx - mn
    if mode == "dark":
        bgmask = (mx <= 70) & (spread <= 22)
    else:  # light
        bgmask = (mn >= 232) & (spread <= 14)
    flooded = border_flood(bgmask, w, h)
    arr[:, :, 3][flooded] = 0
    out = Image.fromarray(arr, "RGBA")
    bbox = out.split()[3].getbbox()
    if bbox:
        pad = 6
        l, t, r, b = bbox
        out = out.crop((max(0, l-pad), max(0, t-pad), min(w, r+pad), min(h, b+pad)))
    out.save(p)
    print(f"{name}: {im.size} -> {out.size}")


process("dark-logo", "dark")
process("light-logo", "light")
print("done")
