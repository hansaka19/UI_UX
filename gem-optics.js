import * as THREE from 'three';
// Trace a few internal facet reflections in the small preview, not a grading renderer.
export function createGemOptics(geometry, environment) {
  const position=geometry.attributes.position,planes=[];
  const a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),n=new THREE.Vector3();
  for(let i=0;i<position.count;i+=3){
    a.fromBufferAttribute(position,i);b.fromBufferAttribute(position,i+1);c.fromBufferAttribute(position,i+2);
    n.subVectors(b,a).cross(new THREE.Vector3().subVectors(c,a)).normalize();
    const d=n.dot(a);let supporting=true;
    for(let j=0;j<position.count;j++){c.fromBufferAttribute(position,j);if(n.dot(c)>d+.002){supporting=false;break}}
    if(supporting&&!planes.some(p=>p.x*n.x+p.y*n.y+p.z*n.z>.9999&&Math.abs(p.w-d)<.002))planes.push(new THREE.Vector4(n.x,n.y,n.z,d));
  }
  const count=Math.min(planes.length,64);while(planes.length<64)planes.push(new THREE.Vector4(0,0,0,100));
  const tint=new THREE.Color('#2455d5');
  const material=new THREE.ShaderMaterial({uniforms:{env:{value:environment},planes:{value:planes.slice(0,64)},planeCount:{value:count},tint:{value:tint},eye:{value:new THREE.Vector3()},rotation:{value:new THREE.Matrix3()},ior:{value:1.76}},vertexShader:`
    varying vec3 localPosition; varying vec3 localNormal;
    void main(){localPosition=position;localNormal=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}
  `,fragmentShader:`
    precision highp float;
    uniform samplerCube env;uniform vec4 planes[64];uniform int planeCount;uniform vec3 tint,eye;uniform mat3 rotation;uniform float ior;
    varying vec3 localPosition,localNormal;
    vec3 studio(vec3 direction){return textureCube(env,rotation*normalize(direction)).rgb;}
    void main(){
      vec3 normal=normalize(localNormal),incoming=normalize(localPosition-eye);
      float f0=pow((ior-1.0)/(ior+1.0),2.0),fresnel=f0+(1.0-f0)*pow(1.0-max(0.0,dot(-incoming,normal)),5.0);
      vec3 surface=studio(reflect(incoming,normal));
      vec3 direction=refract(incoming,normal,1.0/ior),origin=localPosition+direction*.004;
      vec3 body=vec3(0.0);float distanceTravelled=0.0;float energy=1.0;
      vec3 absorption=-log(clamp(tint,vec3(.035),vec3(.99)))*.5;
      for(int bounce=0;bounce<6;bounce++){
        float nearest=10000.0;vec3 face=vec3(0.0,1.0,0.0);
        for(int j=0;j<64;j++){
          if(j>=planeCount)break;
          float denominator=dot(planes[j].xyz,direction);
          if(denominator>.0001){float t=(planes[j].w-dot(planes[j].xyz,origin))/denominator;if(t>.0005&&t<nearest){nearest=t;face=planes[j].xyz;}}
        }
        if(nearest>100.0)break;
        distanceTravelled+=nearest;origin+=direction*nearest;
        vec3 exitRay=refract(direction,-face,ior);
        if(dot(exitRay,exitRay)>.001){
          float reflectance=f0+(1.0-f0)*pow(1.0-max(0.0,dot(direction,face)),5.0);
          body+=studio(exitRay)*exp(-absorption*distanceTravelled)*energy*(1.0-reflectance);
          energy*=reflectance;
        }
        direction=reflect(direction,face);origin+=direction*.004;
      }
      body+=studio(direction)*exp(-absorption*distanceTravelled)*energy*.35;
      vec3 colour=mix(body,surface*mix(vec3(1.0),tint,.35),fresnel)*1.35;
      colour=colour/(colour+vec3(1.0));colour=pow(colour,vec3(1.0/2.2));
      gl_FragColor=vec4(colour,1.0);
    }
  `});
  material.attenuationColor=tint;
  material.userData.updateCamera=(camera,mesh)=>{
    mesh.updateWorldMatrix(true,false);material.uniforms.eye.value.copy(camera.position).applyMatrix4(new THREE.Matrix4().copy(mesh.matrixWorld).invert());material.uniforms.rotation.value.setFromMatrix4(mesh.matrixWorld);
  };
  return material;
}
