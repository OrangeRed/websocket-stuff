/**
 * Seeded random number generator, using [xorshift](https://en.wikipedia.org/wiki/Xorshift).
 * Adapted from [seedrandom](https://github.com/davidbau/seedrandom).
 * @param {string} seed The seed for random numbers.
 */
function rng(seed = "") {
  let x = 0
  let y = 0
  let z = 0
  let w = 0

  function next() {
    const t = x ^ (x << 11)
    x = y
    y = z
    z = w
    w ^= ((w >>> 19) ^ t ^ (t >>> 8)) >>> 0
    return w / 0x100000000
  }

  for (var k = 0; k < seed.length + 64; k++) {
    x ^= seed.charCodeAt(k) | 0
    next()
  }

  return next
}

function getContrastYIQ(hexcolor: string) {
  var r = parseInt(hexcolor.slice(0, 2), 16)
  var g = parseInt(hexcolor.slice(2, 4), 16)
  var b = parseInt(hexcolor.slice(4, 6), 16)
  var yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? "black" : "white"
}

export function colorsFromString(
  str: string,
): [`#${string}`, ReturnType<typeof getContrastYIQ>] {
  const random = rng(str) // seed generator
  const rand = random() * Math.pow(255, 3)

  for (
    var i = 0, bgColor = "";
    i < 3;
    bgColor += ("00" + ((rand >> (i++ * 8)) & 0xff).toString(16)).slice(-2)
  );

  return [`#${bgColor}`, getContrastYIQ(bgColor)]
}
