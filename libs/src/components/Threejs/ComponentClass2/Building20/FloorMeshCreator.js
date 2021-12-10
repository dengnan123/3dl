import * as THREE from 'three';
import { Vertex } from 'three';
var createFloorMesh = function (xlength, ylength, zlength, count, gp) {
    const geo = new THREE.BufferGeometry();
    if (count <= 0) {
        console.log("Count数值不对");
        return geo;
    }

    const vertices = [];
    const uv0 = [];

    const ps = [[xlength / 2, zlength / 2], [-xlength / 2, zlength / 2],
    [-xlength / 2, -zlength / 2], [xlength / 2, -zlength / 2]];

    const pu = [0, 0.25, 0.5, 0.75, 1.0];
    //底面和顶面
    upDownFace();

    for (let index = 0; index < count; index++) {
        const y0 = index * ylength;
        const y1 = y0 + ylength;
        AddFace(0, 1, index, ylength);
        AddFace(1, 2, index, ylength);
        AddFace(2, 3, index, ylength);
        AddFace(3, 0, index, ylength);
    }
    console.log("顶点个数:", vertices.length / 3);
    console.log("UV个数:", uv0.length / 2);

    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('uv0', new THREE.Float32BufferAttribute(uv0, 2));

    return geo;

    function upDownFace() {
        vertices.push(ps[0][0], 0, ps[0][1]);
        vertices.push(ps[1][0], 0, ps[1][1]);
        vertices.push(ps[2][0], 0, ps[2][1]);
        vertices.push(ps[0][0], 0, ps[0][1]);
        vertices.push(ps[2][0], 0, ps[2][1]);
        vertices.push(ps[3][0], 0, ps[3][1]);


        uv0.push(2, 2);
        uv0.push(2, 2);
        uv0.push(2, 2);
        uv0.push(2, 2);
        uv0.push(2, 2);
        uv0.push(2, 2);

        const maxY = count * ylength;

        vertices.push(ps[0][0], maxY, ps[0][1]);
        vertices.push(ps[3][0], maxY, ps[3][1]);
        vertices.push(ps[2][0], maxY, ps[2][1]);
        vertices.push(ps[0][0], maxY, ps[0][1]);
        vertices.push(ps[2][0], maxY, ps[2][1]);
        vertices.push(ps[1][0], maxY, ps[1][1]);
        uv0.push(2, 2);
        uv0.push(2, 2);
        uv0.push(2, 2);
        uv0.push(2, 2);
        uv0.push(2, 2);
        uv0.push(2, 2);
    }
    function AddFace(p1, p2, index, zlength) {
        const sp = ps[p1];
        const np = ps[p2];
        const y = index * zlength;
        const yup = y + zlength;
        const uvY = index / count;
        const uvYup = (index + 1) / count;

        vertices.push(np[0], yup, np[1]);
        vertices.push(np[0], y, np[1]);
        vertices.push(sp[0], y, sp[1]);

        vertices.push(sp[0], yup, sp[1]);
        vertices.push(np[0], yup, np[1]);
        vertices.push(sp[0], y, sp[1]);


        if (p2 < p1) {
            p2 = p1 + 1;
        }

        uv0.push(pu[p2], uvYup);
        uv0.push(pu[p2], uvY);
        uv0.push(pu[p1], uvY);

        uv0.push(pu[p1], uvYup);
        uv0.push(pu[p2], uvYup);
        uv0.push(pu[p1], uvY);

    }

}


export { createFloorMesh };