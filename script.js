const canvas=document.getElementById('space'),ctx=canvas.getContext('2d');
const speed=document.getElementById('speed'),gravity=document.getElementById('gravity'),distance=document.getElementById('distance');
const vals={speedVal:document.getElementById('speedVal'),gravVal:document.getElementById('gravVal'),distVal:document.getElementById('distVal'),
s1:document.getElementById('s1'),s2:document.getElementById('s2'),s3:document.getElementById('s3'),s4:document.getElementById('s4'),mode:document.getElementById('mode')};
let W,H,stars=[],trail=[],planet={x:0,y:0,vx:0,vy:0},last=performance.now();

function resize(){
  W=canvas.width=canvas.clientWidth*devicePixelRatio;
  H=canvas.height=canvas.clientHeight*devicePixelRatio;
  ctx.setTransform(1,0,0,1,0,0);ctx.scale(devicePixelRatio,devicePixelRatio);
  W=canvas.clientWidth;H=canvas.clientHeight;
  stars=Array.from({length:170},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.5+.2,a:Math.random()*.7+.2}));
  reset();
}
function reset(){
  trail=[];
  const cx=W/2,cy=H/2,r=145*+distance.value;
  planet={x:cx+r,y:cy,vx:0,vy:-+speed.value*0.045};
}
function updateLabels(){
  const sp=+speed.value,g=+gravity.value,d=+distance.value;
  vals.speedVal.textContent=sp.toFixed(1)+' km/s';
  vals.gravVal.textContent=g.toFixed(2)+'×';
  vals.distVal.textContent=d.toFixed(2)+' AU';
  vals.s1.textContent=vals.speedVal.textContent;vals.s2.textContent=vals.gravVal.textContent;vals.s3.textContent=vals.distVal.textContent;
  let label='Balanced';
  if(sp<4.5)label='Falling inward';
  else if(sp>9)label='Escape risk';
  else if(sp>7.8)label='Wide orbit';
  vals.s4.textContent=label;vals.mode.textContent=label;
}
function draw(){
  const now=performance.now(),dt=Math.min((now-last)/16.67,2);last=now;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#02040a';ctx.fillRect(0,0,W,H);
  stars.forEach(s=>{ctx.globalAlpha=s.a;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill()});
  ctx.globalAlpha=1;
  const cx=W/2,cy=H/2;
  const grad=ctx.createRadialGradient(cx,cy,2,cx,cy,75);
  grad.addColorStop(0,'#fff8b0');grad.addColorStop(.18,'#ffd56a');grad.addColorStop(1,'#ff8a0000');
  ctx.fillStyle=grad;ctx.beginPath();ctx.arc(cx,cy,75,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#ffd76b';ctx.beginPath();ctx.arc(cx,cy,17,0,Math.PI*2);ctx.fill();

  const dx=cx-planet.x,dy=cy-planet.y,r2=dx*dx+dy*dy,r=Math.sqrt(r2);
  const accel=0.00065*+gravity.value;
  planet.vx+=accel*dx/r*dt;planet.vy+=accel*dy/r*dt;
  planet.x+=planet.vx*dt;planet.y+=planet.vy*dt;

  trail.push([planet.x,planet.y]);if(trail.length>500)trail.shift();
  ctx.beginPath();trail.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
  ctx.strokeStyle='#62e6ff55';ctx.lineWidth=2;ctx.stroke();

  ctx.strokeStyle='#9b7cff99';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,145*+distance.value,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='#62e6ff';ctx.shadowBlur=18;ctx.shadowColor='#62e6ff';
  ctx.beginPath();ctx.arc(planet.x,planet.y,7,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  requestAnimationFrame(draw);
}
[speed,gravity,distance].forEach(x=>x.addEventListener('input',()=>{updateLabels();reset()}));
document.getElementById('reset').onclick=()=>{speed.value=7;gravity.value=1;distance.value=1;updateLabels();reset()};
window.addEventListener('resize',resize);
updateLabels();resize();requestAnimationFrame(draw);
