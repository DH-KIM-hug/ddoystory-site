/* ddoystory 종이 작품 움직임 (GSAP 3.15.1 + ScrollTrigger, assets/vendor/gsap/)
   규칙: 2D 이동, ±3도 이내 회전, 투명도, 그림자 변화만. 원근·3D 회전·늘림·반짝임 없음.
   - 첫 화면: 아치 구멍 안 층이 먼 것부터 내려앉고(그림자가 자리 잡으며 짙어짐), 까치가 날아들어 멈추고,
     오린 제목 글자가 한 줄씩 얹힌다.
   - 스크롤: 구멍 안 층의 약한 시차, 땅 능선이 살짝 올라옴, 액자·조각·서가 칸이 한 장씩 놓임.
   - 마우스(PC): 구멍 안 층이 아주 약하게 따라 움직임.
   초기 숨김은 <head> 의 작은 스크립트가 붙인 html.mo 클래스로만 건다(paper.css 의 .mo [data-intro]).
   움직임 줄이기를 켰거나 GSAP 를 못 불러오면 아무것도 숨기지 않고 최종 상태 그대로 둔다. */
(function(){
  var root=document.documentElement;
  function reveal(){ root.classList.remove('mo'); }
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce||!window.gsap){ reveal(); return; }
  var gsap=window.gsap, ST=window.ScrollTrigger;
  if(ST) gsap.registerPlugin(ST);

  var $=function(s,c){return (c||document).querySelector(s);};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));};

  /* 글꼴이 준비된 뒤에 시작한다: 대체 글꼴로 떠오르다 바뀌는 모습(FOUT)을 막는다.
     첫 화면에 실제로 쓰는 글자만 불러오게 text 를 넘긴다(한국어 글꼴은 unicode-range 로 쪼개져 있다).
     1.5초 안에 안 오면 그냥 시작한다. */
  var fontsOk=false,fontsAll=Promise.resolve();
  function fontsReady(){
    if(!document.fonts||!document.fonts.load) return Promise.resolve();
    var intro=$$('[data-intro]').map(function(e){return e.textContent;}).join('').replace(/\s+/g,'')||'가';
    var ht=$$('[data-intro] h1').map(function(e){return e.textContent;}).join('').replace(/\s+/g,'')||intro;
    var jobs=['400 1em Jua','400 1em Fredoka'].map(function(f){return document.fonts.load(f,ht);})
      .concat(['400 1em "Noto Sans KR"','700 1em "Noto Sans KR"','400 1em Nunito','700 1em Nunito','500 1em Fredoka'].map(function(f){return document.fonts.load(f,intro);}));
    fontsAll=Promise.all(jobs).then(function(){fontsOk=true;},function(){fontsOk=true;});
    var cap=new Promise(function(r){setTimeout(r,1500);});
    return Promise.race([fontsAll,cap]);
  }
  /* 여기까지 왔으면 머리의 2.5초 안전장치 대신 이 파일이 책임진다(글꼴 기다림 최대 1.5초) */
  if(window.__moT) clearTimeout(window.__moT);
  fontsReady().then(run);

  function run(){
  /* 1.5초 안에 글꼴이 안 왔으면 연출은 시작하되, 첫 화면 글자만 글꼴이 올 때까지(최대 3초 더) 숨겨 둔다. */
  if(!fontsOk&&document.fonts){
    root.classList.add('mo-font');
    Promise.race([fontsAll,new Promise(function(r){setTimeout(r,3000);})]).then(function(){root.classList.remove('mo-font');});
  }
  /* 머리 스크립트의 안전 시간이 먼저 지나 이미 보이는 상태라면 등장 연출은 건너뛴다 */
  var intro=root.classList.contains('mo');

  /* 종이가 떠 있을 때(넓고 옅은 그림자) → 내려앉았을 때(좁고 짙은 그림자) */
  var SH_UP='drop-shadow(0px 12px 14px rgba(46,36,28,0.06)) drop-shadow(0px 18px 20px rgba(46,36,28,0.04))';
  var SH_DOWN='drop-shadow(0px 1px 1px rgba(46,36,28,0.4)) drop-shadow(0px 3px 4px rgba(46,36,28,0.16))';

  /* 제목 줄: 블록으로 놓인 줄이면 한 줄씩, 글 흐름 속(폰)이면 제목 한 장으로 */
  function titleStrips(h1){
    if(!h1) return [];
    var lns=$$('.ln',h1).filter(function(el){return el.offsetParent!==null;});
    if(lns.length&&getComputedStyle(lns[0]).display!=='inline') return lns;
    return [h1];
  }
  /* 종이 한 장이 살짝 위에서 떨어져 자리 잡는다 */
  function drop(tl,els,at,o){
    o=o||{};
    if(!els||els.length===0) return;
    var from={y:o.y!=null?o.y:-22,rotation:o.r||0,opacity:0},
        to={y:0,rotation:0,opacity:1,duration:o.d||.6,ease:o.ease||'power3.out',stagger:o.st||0,clearProps:'opacity,transform'};
    if(o.sh){ from.filter=SH_UP; to.filter=SH_DOWN; to.clearProps='filter,opacity,transform'; }
    tl.fromTo(els,from,to,at);
  }

  var tl=gsap.timeline({id:'intro',paused:true,defaults:{overwrite:'auto'}});
  var layers=[]; /* 마우스·시차를 받을 층 [요소, 깊이] */
  var arch=$('.arch');
  var strips=titleStrips($('[data-intro] h1'));

  if(arch&&$('.sky',arch)){
    /* ── 스튜디오 홈: 하늘 → 해 → 먼 산 → 언덕 → 앞 언덕 → 솔가지, 까치가 날아든다 ── */
    var sun=$('.sun',arch),mtn=$('.mtn',arch),hm=$('.hm',arch),hn=$('.hn',arch),pine=$('.pine',arch),bird=$('.magpie',arch);
    if(intro){
      drop(tl,strips,.05,{y:-18,r:-2,st:.16,d:.62,ease:'back.out(1.3)'});
      drop(tl,$('.hero p'),.45,{y:-8,d:.6});
      drop(tl,[sun],.05,{y:-24,sh:true,d:.65});
      drop(tl,[mtn],.2,{y:-26,sh:true,d:.7});
      drop(tl,[hm],.36,{y:-24,sh:true,d:.7});
      drop(tl,[hn],.5,{y:-22,sh:true,d:.7});
      tl.fromTo(pine,{y:-30,rotation:-3,opacity:0,filter:SH_UP},{y:0,rotation:0,opacity:1,filter:SH_DOWN,duration:.75,ease:'power3.out',clearProps:'filter,opacity,transform'},.66);
      /* 까치: 왼쪽을 보고 날므로 오른쪽 밖에서 해 쪽으로 날아들어 한 번 멈춘다 */
      tl.fromTo(bird,{xPercent:150,y:30,rotation:3,opacity:0},{xPercent:0,y:0,rotation:0,opacity:1,duration:.95,ease:'power2.out',clearProps:'opacity'},.74)
        .to(bird,{y:-6,duration:.18,ease:'sine.out'},1.64).to(bird,{y:0,duration:.22,ease:'sine.in'},1.82);
    }
    layers=[[sun,2],[mtn,3],[hm,5],[hn,7],[bird,10],[pine,12]];
  } else if(arch){
    /* ── 톡톡 동화극장: 장면 → 앞 억새 → 솔가지 ── */
    var scene=$('.scene',arch),pn=$('.pine',arch),pl=$('.pampas-l',arch),pr=$('.pampas-r',arch);
    if(intro){
      drop(tl,strips,.05,{y:-18,r:-2,st:.16,d:.62,ease:'back.out(1.3)'});
      drop(tl,$$('.intro-tx > :not(h1)'),.42,{y:-8,st:.1,d:.55});
      tl.fromTo(scene,{y:-18,opacity:0},{y:0,opacity:1,duration:.9,ease:'power2.out',clearProps:'opacity'},.1);
      tl.fromTo([pl,pr],{yPercent:34,opacity:0},{yPercent:0,opacity:1,duration:.7,stagger:.1,ease:'power3.out',clearProps:'opacity'},.62);
      tl.fromTo(pn,{y:-36,rotation:-9,opacity:0,filter:SH_UP},{y:0,rotation:-6,opacity:1,filter:SH_DOWN,duration:.75,ease:'power3.out',clearProps:'filter,opacity'},.82);
      drop(tl,$('.arch-cap'),1.2,{y:-14,r:-3,d:.5,ease:'back.out(1.6)'});
    }
    layers=[[scene,2],[pn,10],[pl,7],[pr,7]];
  } else if(intro){
    /* ── 지원·처리방침: 머리글만 살짝 내려앉는다 ── */
    drop(tl,$$('[data-intro]:not(.top-sheet)'),0,{y:-12,st:.12,d:.6});
  }
  if(intro) drop(tl,$$('.top-sheet .top > *'),0,{y:-10,st:.08,d:.5});

  /* 숨김 클래스를 걷고 바로 재생(첫 프레임은 GSAP 가 이미 잡아 두었다) */
  tl.progress(0); reveal(); tl.play();

  var on=false; /* 마우스 따라오기: 등장 연출이 끝나면 켠다 */
  if(!ST) return;

  /* ── 스크롤: 구멍 안 층의 약한 시차(가까운 층일수록 더) ──
     등장 연출이 끝난 뒤에 붙인다: 먼저 붙이면 화면 크기가 바뀔 때(폰 주소창 등) 등장 시작 위치로 되돌아간다. */
  function parallax(){
    layers.forEach(function(l){
      if(!l[0]) return;
      gsap.to(l[0],{yPercent:function(){return l[1]*2.4/Math.max(l[0].offsetHeight,1)*100;},ease:'none',
        scrollTrigger:{trigger:arch,start:'top top',end:'bottom top',scrub:.6,invalidateOnRefresh:true}});
    });
  }
  if(arch){ if(intro) tl.eventCallback('onComplete',function(){ gsap.set(layers.map(function(l){return l[0];}).filter(Boolean),{y:0,x:0}); parallax(); on=true; }); else parallax(); }

  /* ── 스크롤: 땅 능선이 살짝 올라오며 겹쳐 온다 ── */
  $$('.ground .ridge').forEach(function(c){
    gsap.fromTo(c,{y:22},{y:0,ease:'none',scrollTrigger:{trigger:c,start:'top bottom',end:'top 65%',scrub:.5}});
  });

  /* ── 스크롤: 액자·조각·서가 칸이 화면에 들어올 때 한 장씩 놓인다 ── */
  var pieces=$$('.work, .next, .app-info > *, .sheet, .feature .poster, .feature-tx dl, .tales li');
  if(pieces.length){
    gsap.set(pieces,{opacity:0,y:-14});
    ST.batch(pieces,{start:'top 92%',once:true,onEnter:function(b){
      gsap.to(b,{opacity:1,y:0,duration:.55,ease:'power3.out',stagger:Math.min(.07,.5/b.length),overwrite:true,clearProps:'opacity,transform'});
    }});
  }

  /* ── 마우스(PC만): 구멍 안 층이 아주 약하게 따라온다(2D 이동) ── */
  if(arch&&matchMedia('(hover: hover) and (pointer: fine)').matches){
    var movers=layers.filter(function(l){return l[0];}).map(function(l){
      return {d:l[1],x:gsap.quickTo(l[0],'x',{duration:.9,ease:'power3.out'}),y:gsap.quickTo(l[0],'y',{duration:.9,ease:'power3.out'})};
    });
    on=!intro;
    window.addEventListener('pointermove',function(e){
      if(!on) return;
      var nx=e.clientX/window.innerWidth-.5, ny=e.clientY/window.innerHeight-.5;
      for(var i=0;i<movers.length;i++){ movers[i].x(nx*movers[i].d*1.6); movers[i].y(ny*movers[i].d); }
    },{passive:true});
  }
  }
})();
