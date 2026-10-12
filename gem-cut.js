import * as THREE from 'three';
// A compact faceted brilliant-style cut; its pavilion points down local -Y.
export function createGemCut() {
  const vertices=[],faces=[];
  const ring=(count,radius,y,offset=0,alternate=0)=>Array.from({length:count},(_,i)=>{
    const angle=2*Math.PI*i/count+offset,r=radius+(i%2?alternate:0);
    const index=vertices.length/3;vertices.push(Math.cos(angle)*r,y,Math.sin(angle)*r);return index;
  });
  const table=ring(8,.46,.47,Math.PI/8);
  const stars=ring(16,.64,.31,Math.PI/8,.12);
  const upper=ring(16,1,.06,Math.PI/8);
  const lower=ring(16,1,.015,Math.PI/8);
  const pavilion=ring(16,.61,-.42,Math.PI/8,-.10);
  const culet=ring(8,.015,-.96,Math.PI/8);
  // Winding is corrected against the center below, keeping the normals outward.
  for(let i=1;i<7;i++)faces.push(table[0],table[i],table[i+1]);
  for(let i=0;i<8;i++){
    const n=(i+1)%8,j=i*2,k=(j+1)%16,l=(j+2)%16;
    faces.push(table[i],stars[j],stars[k],table[i],stars[k],table[n],table[n],stars[k],stars[l]);
  }
  for(const[a,b]of[[stars,upper],[upper,lower],[lower,pavilion]]){
    for(let i=0;i<16;i++){const n=(i+1)%16;faces.push(a[i],b[i],b[n],a[i],b[n],a[n])}
  }
  for(let i=0;i<8;i++){const n=(i+1)%8,j=i*2,k=(j+1)%16,l=(j+2)%16;faces.push(pavilion[j],culet[i],pavilion[k],pavilion[k],culet[i],culet[n],pavilion[k],culet[n],pavilion[l])}
  for(let i=1;i<7;i++)faces.push(culet[0],culet[i],culet[i+1]);
  const geometry=new THREE.BufferGeometry();
  const output=[];let a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),normal=new THREE.Vector3(),center=new THREE.Vector3();
  for(let i=0;i<faces.length;i+=3){a.fromArray(vertices,faces[i]*3);b.fromArray(vertices,faces[i+1]*3);c.fromArray(vertices,faces[i+2]*3);normal.subVectors(b,a).cross(new THREE.Vector3().subVectors(c,a));center.copy(a).add(b).add(c).multiplyScalar(1/3);if(normal.dot(center)<0)[b,c]=[c.clone(),b.clone()];output.push(...a.toArray(),...b.toArray(),...c.toArray())}
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(output,3));geometry.computeVertexNormals();return geometry;
}
