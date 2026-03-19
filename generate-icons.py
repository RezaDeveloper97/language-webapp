#!/usr/bin/env python3
"""
Generate Malaysian flag PWA icons and iOS splash screens.
Produces PNG files using only Python stdlib (struct + zlib).
"""
import math, zlib, struct, os

# ── Colours ──────────────────────────────────────────────────────────────────
RED    = (204,   0,   1, 255)
WHITE  = (255, 255, 255, 255)
BLUE   = (  1,   0, 102, 255)
YELLOW = (255, 204,   0, 255)
DARK   = ( 15,  15,  19, 255)

# ── Geometry helpers ──────────────────────────────────────────────────────────
def star_verts(cx, cy, R, r, n=14, a0=-math.pi/2):
    v = []
    for i in range(n):
        ao = a0 + i * 2*math.pi/n
        v.append((cx + R*math.cos(ao), cy + R*math.sin(ao)))
        ai = ao + math.pi/n
        v.append((cx + r*math.cos(ai), cy + r*math.sin(ai)))
    return v

def pip(px, py, poly):
    """Point-in-polygon (ray casting)."""
    inside, j = False, len(poly)-1
    for i, (xi, yi) in enumerate(poly):
        xj, yj = poly[j]
        if ((yi > py) != (yj > py)) and px < (xj-xi)*(py-yi)/(yj-yi)+xi:
            inside = not inside
        j = i
    return inside

# ── Flag renderer ─────────────────────────────────────────────────────────────
def precompute_flag(sz):
    """Return flat list of RGBA tuples for Malaysian flag at sz×sz."""
    cw, ch = sz/2, sz/2
    sv = star_verts(cw*0.755, ch*0.50, ch*0.26, ch*0.105)
    out = []
    for y in range(sz):
        stripe = int(y / (sz/14))
        base = RED if stripe%2==0 else WHITE
        for x in range(sz):
            if x < cw and y < ch:
                # Crescent
                dx_o = x - cw*0.37;  dy_o = y - ch*0.50
                dx_i = x - cw*0.455; dy_i = y - ch*0.435
                in_o = dx_o**2+dy_o**2 <= (ch*0.46)**2
                in_i = dx_i**2+dy_i**2 <= (ch*0.375)**2
                if in_o and not in_i:
                    out.append(YELLOW); continue
                # Star
                if pip(x, y, sv):
                    out.append(YELLOW); continue
                out.append(BLUE)
            else:
                out.append(base)
    return out

# ── PNG writer ────────────────────────────────────────────────────────────────
def _chunk(ct, data):
    body = ct + data
    return struct.pack('>I', len(data)) + body + struct.pack('>I', zlib.crc32(body)&0xffffffff)

def make_png(W, H, raw):
    sig  = b'\x89PNG\r\n\x1a\n'
    ihdr = _chunk(b'IHDR', struct.pack('>IIBBBBB', W, H, 8, 6, 0, 0, 0))
    idat = _chunk(b'IDAT', zlib.compress(bytes(raw), 6))
    iend = _chunk(b'IEND', b'')
    return sig+ihdr+idat+iend

# ── Icon generators ───────────────────────────────────────────────────────────
def flag_png(sz, padding=0):
    inner = sz - 2*padding
    flag  = precompute_flag(inner)
    raw   = bytearray()
    for y in range(sz):
        raw += b'\x00'
        for x in range(sz):
            if padding and (x<padding or x>=sz-padding or y<padding or y>=sz-padding):
                raw += bytes(RED)
            else:
                ix, iy = x-padding, y-padding
                raw += bytes(flag[iy*inner + ix])
    return make_png(sz, sz, raw)

def splash_png(W, H, flag, fsz, icon_sz):
    x0 = (W-icon_sz)//2; y0 = (H-icon_sz)//2
    x1 = x0+icon_sz;     y1 = y0+icon_sz
    r2 = (icon_sz//2)**2
    icx = icy = icon_sz//2
    dark = bytes(DARK)
    drow = b'\x00' + dark*W
    raw  = bytearray()
    for y in range(H):
        if y < y0 or y >= y1:
            raw += drow
        else:
            iy = y-y0
            raw += b'\x00'
            for x in range(W):
                if x < x0 or x >= x1:
                    raw += dark
                else:
                    ix = x-x0
                    if (ix-icx)**2+(iy-icy)**2 > r2:
                        raw += dark
                    else:
                        fx = min(int(ix*fsz/icon_sz), fsz-1)
                        fy = min(int(iy*fsz/icon_sz), fsz-1)
                        raw += bytes(flag[fy*fsz+fx])
    return make_png(W, H, raw)

# ── Run ───────────────────────────────────────────────────────────────────────
pub     = os.path.join(os.path.dirname(__file__), 'public')
spdir   = os.path.join(pub, 'splash')
os.makedirs(spdir, exist_ok=True)

print('Generating flag icons...')
icons = [
    (64,  0,  'pwa-64x64.png'),
    (192, 0,  'pwa-192x192.png'),
    (512, 0,  'pwa-512x512.png'),
    (512, 51, 'maskable-icon-512x512.png'),
    (180, 0,  'apple-touch-icon.png'),
]
for sz, pad, name in icons:
    data = flag_png(sz, pad)
    path = os.path.join(pub, name)
    with open(path,'wb') as f: f.write(data)
    print(f'  {name}  ({len(data):,} bytes)')

print('\nPre-computing 128×128 flag for splash screens...')
FLAG_SZ   = 128
ICON_SZ   = 220
flag_data = precompute_flag(FLAG_SZ)

print('Generating iOS splash screens...')
screens = [
    # iPhone 16 Pro Max  (440×956  @3×)
    (1320, 2868, 'apple-splash-1320-2868.png'),
    # iPhone 16 Pro      (402×874  @3×)
    (1206, 2622, 'apple-splash-1206-2622.png'),
    # iPhone 16 Plus / 15 Pro Max / 15 Plus / 14 Pro Max  (430×932 @3×)
    (1290, 2796, 'apple-splash-1290-2796.png'),
    # iPhone 16 / 15 Pro / 15 / 14 Pro / 13 Pro / 13 / 12 Pro / 12  (390-393×844-852 @3×)
    (1179, 2556, 'apple-splash-1179-2556.png'),
    # iPhone 14 / 13 / 12  (390×844 @3×)
    (1170, 2532, 'apple-splash-1170-2532.png'),
    # iPhone 14 Plus / 13 Pro Max / 12 Pro Max  (428×926 @3×)
    (1284, 2778, 'apple-splash-1284-2778.png'),
    # iPhone 13 mini / 12 mini  (375×812 @3×)
    (1125, 2436, 'apple-splash-1125-2436.png'),
    # iPhone SE 3rd gen  (375×667 @2×)
    (750,  1334, 'apple-splash-750-1334.png'),
    # iPad Pro 12.9"     (1024×1366 @2×)
    (2048, 2732, 'apple-splash-2048-2732.png'),
    # iPad Pro 11"       (834×1194 @2×)
    (1668, 2388, 'apple-splash-1668-2388.png'),
    # iPad Air / iPad 10th  (820×1180 @2×)
    (1640, 2360, 'apple-splash-1640-2360.png'),
    # iPad mini 6th      (744×1133 @2×)
    (1488, 2266, 'apple-splash-1488-2266.png'),
]
for W, H, name in screens:
    print(f'  {name}  ({W}×{H})…', end='', flush=True)
    data = splash_png(W, H, flag_data, FLAG_SZ, ICON_SZ)
    with open(os.path.join(spdir, name),'wb') as f: f.write(data)
    print(f'  {len(data):,} bytes')

print('\nAll icons & splash screens generated!')
