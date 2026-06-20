"""Remove a (near-)white background from an image via border flood-fill,
keeping interior light areas (white vehicle body) intact. Usage:
  python3 scripts/remove_white_bg.py <path> [min] [spread]
"""
import sys
from collections import deque
from PIL import Image
import numpy as np

path = sys.argv[1]
MIN = int(sys.argv[2]) if len(sys.argv) > 2 else 236
SPREAD = int(sys.argv[3]) if len(sys.argv) > 3 else 16

im = Image.open(path).convert("RGBA")
w, h = im.size
arr = np.array(im)
rgb = arr[:, :, :3].astype(np.int16)
mn = rgb.min(2); mx = rgb.max(2); spread = mx - mn
light = ((mn >= MIN) & (spread <= SPREAD)).ravel().tolist()

visited = bytearray(w * h)
dq = deque()
def seed(i):
    if light[i] and not visited[i]:
        visited[i] = 1; dq.append(i)
for x in range(w):
    seed(x); seed((h - 1) * w + x)
for y in range(h):
    seed(y * w); seed(y * w + (w - 1))
while dq:
    i = dq.popleft(); x = i % w
    if x > 0 and light[i-1] and not visited[i-1]: visited[i-1]=1; dq.append(i-1)
    if x < w-1 and light[i+1] and not visited[i+1]: visited[i+1]=1; dq.append(i+1)
    if i >= w and light[i-w] and not visited[i-w]: visited[i-w]=1; dq.append(i-w)
    if i < w*(h-1) and light[i+w] and not visited[i+w]: visited[i+w]=1; dq.append(i+w)

bg = np.frombuffer(bytes(visited), dtype=np.uint8).astype(bool).reshape(h, w)
arr[:, :, 3][bg] = 0
out = Image.fromarray(arr, "RGBA")
bbox = out.split()[3].getbbox()
if bbox:
    pad = 8
    l, t, r, b = bbox
    out = out.crop((max(0, l-pad), max(0, t-pad), min(w, r+pad), min(h, b+pad)))
out.save(path)
print(f"{path}: {im.size} -> {out.size}  kept={round(100*(arr[:,:,3]>0).mean(),1)}%")
