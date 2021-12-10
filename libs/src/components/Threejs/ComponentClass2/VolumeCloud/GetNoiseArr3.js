import * as THREE from 'three';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';
import { Vector3 } from 'three';

function GetNoiseArr3Map(size) {
    // Texture

    const data = new Uint8Array(size * size * size);

    let i = 0;
    const scale = 0.05;
    const perlin = new ImprovedNoise();
    const vector = new THREE.Vector3();

    for (let z = 0; z < size; z++) {

        for (let y = 0; y < size; y++) {

            for (let x = 0; x < size; x++) {

                const d = 1.0 - vector.set(x, y, z).subScalar(size / 2).divideScalar(size).length();
                data[i] = (128 + 128 * perlin.noise(x * scale / 1.5, y * scale, z * scale / 1.5)) * d * d;
                i++;

            }

        }

    }

    const texture = new THREE.DataTexture3D(data, size, size, size);
    texture.format = THREE.RedFormat;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.unpackAlignment = 1;
    return texture;
}

function GetNoiseArr3Map2(info) {
    const { size, circlePercent, linearPercent } = info;
    // Texture
    const scale = (info.scale || 2) / 200;
    const scale2 = (info.scale || 2) / 200 * 4;
    const scaleOffset = info.scaleOffset || new Vector3(0, 0, 0);
    const data = new Uint8Array(size * size * size);

    let i = 0;
    const perlin = new ImprovedNoise();
    const vector = new THREE.Vector2();
    for (let z = 0; z < size; z++) {
        let l = (1.0 - z / size) * linearPercent + 1 - linearPercent;
        for (let y = 0; y < size; y++) {

            for (let x = 0; x < size; x++) {

                let d = vector.set(x, y).subScalar(size / 2).divideScalar(size).length();
                d = d * circlePercent + (1 - circlePercent);
                const perlin1 = perlin.noise(x * scale + scaleOffset.x, y * scale + scaleOffset.y, z * scale / 1.5 + scaleOffset.z);
                const perlin2 = perlin.noise(x * scale2 + scaleOffset.x, y * scale2 + scaleOffset.y, z * scale2 / 1.5 + scaleOffset.z);
                data[i] = (128 + 128 * (perlin1 * 0.8 + perlin2 * 0.2)) * d * d * l;
                i++;
            }

        }

    }

    const texture = new THREE.DataTexture3D(data, size, size, size);
    texture.format = THREE.RedFormat;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.unpackAlignment = 1;
    return texture;
}


export { GetNoiseArr3Map, GetNoiseArr3Map2 };