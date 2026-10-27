/**
 * Geometry for the two hands in the hero, in a local unit space: the wrist
 * sits on the left, the index fingertip on the right, y grows downward.
 * Each hand is a union of tapered capsules (forearm, palm, finger bones),
 * which doubles as a skeleton for the synthetic hand's neural traces.
 */

export type Bone = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  r1: number;
  r2: number;
};

export type HandShape = {
  bones: Bone[];
  /** Thumb and finger bones, outlined on their own so the fingers separate. */
  fingers: Bone[];
  /** Bones that form the index finger, from knuckle to tip. */
  index: Bone[];
  tip: { x: number; y: number };
};

function bone(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  r1: number,
  r2 = r1,
): Bone {
  return { x1, y1, x2, y2, r1, r2 };
}

/**
 * `droop` bends the index finger downward (radians per joint). Adam's hand
 * hangs; the reaching hand stays straight.
 */
export function makeHand(droop = 0): HandShape {
  const index: Bone[] = [];
  let x = 104;
  let y = -24;
  let angle = -0.06;
  const lengths = [50, 40, 32];
  const radii = [11, 10, 9, 8];
  lengths.forEach((len, i) => {
    angle += droop;
    const nx = x + Math.cos(angle) * len;
    const ny = y + Math.sin(angle) * len;
    index.push(bone(x, y, nx, ny, radii[i], radii[i + 1]));
    x = nx;
    y = ny;
  });
  const tip = {
    x: x + Math.cos(angle) * radii[3],
    y: y + Math.sin(angle) * radii[3],
  };

  const fingers: Bone[] = [
    // thumb, lifted and pointing forward
    bone(34, -20, 62, -40, 14, 11),
    bone(62, -40, 86, -48, 11, 8.5),
    // middle, ring and little fingers, hanging in a loose curl
    bone(98, -8, 140, 2, 11, 10),
    bone(140, 2, 156, 28, 10, 9),
    bone(156, 28, 148, 50, 9, 7.5),
    bone(94, 8, 130, 22, 10.5, 9.5),
    bone(130, 22, 138, 46, 9.5, 8.5),
    bone(138, 46, 128, 62, 8.5, 7),
    bone(86, 24, 112, 38, 9.5, 8.5),
    bone(112, 38, 114, 56, 8.5, 7.5),
    bone(114, 56, 106, 66, 7.5, 6.5),
    ...index,
  ];

  const bones: Bone[] = [
    // forearm, angled down and away from the wrist
    bone(-150, 46, -30, 12, 27, 22),
    bone(-30, 12, 18, 4, 22, 25),
    // palm, as two overlapping capsules so it reads as a wedge
    bone(18, -6, 96, -14, 26, 20),
    bone(22, 10, 90, 14, 24, 20),
    ...fingers,
  ];

  return { bones, fingers, index, tip };
}

/** Append a tapered capsule (a "stadium" with unequal ends) to a path. */
function addCapsule(path: Path2D, b: Bone) {
  const a = Math.atan2(b.y2 - b.y1, b.x2 - b.x1);
  const n = a + Math.PI / 2;
  path.moveTo(b.x1 + Math.cos(n) * b.r1, b.y1 + Math.sin(n) * b.r1);
  path.arc(b.x1, b.y1, b.r1, n, n + Math.PI);
  path.lineTo(b.x2 - Math.cos(n) * b.r2, b.y2 - Math.sin(n) * b.r2);
  path.arc(b.x2, b.y2, b.r2, n + Math.PI, n + Math.PI * 2);
  path.closePath();
}

/**
 * The two side contours of every finger bone, without the round ends, so the
 * fingers separate inside the silhouette like pencil lines on a drawing.
 */
export function fingerPath(shape: HandShape): Path2D {
  const path = new Path2D();
  for (const b of shape.fingers) {
    const n = Math.atan2(b.y2 - b.y1, b.x2 - b.x1) + Math.PI / 2;
    for (const side of [1, -1]) {
      const cx = Math.cos(n) * side;
      const cy = Math.sin(n) * side;
      path.moveTo(b.x1 + cx * b.r1, b.y1 + cy * b.r1);
      path.lineTo(b.x2 + cx * b.r2, b.y2 + cy * b.r2);
    }
  }
  return path;
}

/** The hand silhouette as one nonzero-filled path (union of every bone). */
export function handPath(shape: HandShape): Path2D {
  const path = new Path2D();
  for (const b of shape.bones) addCapsule(path, b);
  return path;
}

/**
 * Sample a lattice of points inside the silhouette, for the dot-matrix hand.
 * `edge` is 0 deep inside and 1 on the outline, so the outline reads brighter.
 */
export function sampleLattice(
  path: Path2D,
  step: number,
): { x: number; y: number; edge: number }[] {
  const probe = document.createElement("canvas").getContext("2d");
  if (!probe) return [];
  const points: { x: number; y: number; edge: number }[] = [];
  for (let y = -110; y <= 110; y += step) {
    for (let x = -230; x <= 260; x += step) {
      if (!probe.isPointInPath(path, x, y)) continue;
      const neighbours = [
        [step, 0],
        [-step, 0],
        [0, step],
        [0, -step],
      ].filter(([dx, dy]) => probe.isPointInPath(path, x + dx, y + dy)).length;
      points.push({ x, y, edge: neighbours < 4 ? 1 : 0 });
    }
  }
  return points;
}
