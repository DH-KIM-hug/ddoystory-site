/* ddoystory 종이 작품 움직임 v12 (GSAP 3.15.1 + ScrollTrigger, assets/vendor/gsap/)
   규칙: 2D 이동, ±3도 이내 회전, 투명도만. 원근·3D 회전·늘림 없음.
   - 홈 첫 화면: 달 → 솔가지 → 까치 순으로 종이가 살짝 위에서 내려앉고, 까치는 마지막에 가지에 내려앉는다.
     제목 줄·금색 선·꼬리 글자가 차례로 나타난다(전체 약 1.8초).
   - 톡톡 동화극장 첫 화면: 해 → 언덕 → 감나무 → 토끼와 거북이가 길 위로 들어온다.
   - 지원·처리방침: 머리 조각(달·솔가지)과 제목이 살짝 내려앉는다.
   - 스크롤: 그림 층의 약한 시차, 카드·서가 칸이 한 장씩 놓인다.
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

  /* 글꼴이 준비된 뒤에 시작한다(FOUT 막기). 첫 화면에 실제로 쓰는 글자만 불러오게 text 를 넘긴다. 1.5초 안에 안 오면 그냥 시작한다. */
  var fontsOk=false,fontsAll=Promise.resolve();
  function fontsReady(){
    if(!document.fonts||!document.fonts.load) return Promise.resolve();
    var intro=$$('[data-intro]').map(function(e){return e.textContent;}).join('').replace(/\s+/g,'')||'가';
    var ht=$$('[data-intro] h1').map(function(e){return e.textContent;}).join('').replace(/\s+/g,'')||intro;
    var jobs=['400 1em Jua','600 1em Fredoka'].map(function(f){return document.fonts.load(f,ht);})
      .concat(['400 1em "Noto Sans KR"','400 1em Nunito','300 1em Nunito','700 1em Nunito','500 1em Fredoka'].map(function(f){return document.fonts.load(f,intro);}));
    fontsAll=Promise.all(jobs).then(function(){fontsOk=true;},function(){fontsOk=true;});
    var cap=new Promise(function(r){setTimeout(r,1500);});
    return Promise.race([fontsAll,cap]);
  }
  if(window.__moT) clearTimeout(window.__moT);
  fontsReady().then(run);

  function run(){
  if(!fontsOk&&document.fonts){
    root.classList.add('mo-font');
    Promise.race([fontsAll,new Promise(function(r){setTimeout(r,3000);})]).then(function(){root.classList.remove('mo-font');});
  }
  /* 머리 스크립트의 안전 시간이 먼저 지나 이미 보이는 상태라면 등장 연출은 건너뛴다 */
  var intro=root.classList.contains('mo');

  /* 종이가 떠 있을 때(넓고 옅은 그림자) → 내려앉았을 때(좁고 짙은 그림자) */
  var SH_UP='drop-shadow(0px 14px 16px rgba(46,36,28,0.07)) drop-shadow(0px 20px 22px rgba(46,36,28,0.04))';
  var SH_DOWN='drop-shadow(0px 1px 1px rgba(46,36,28,0.35)) drop-shadow(0px 4px 5px rgba(46,36,28,0.14))';

  function titleStrips(h1){
    if(!h1) return [];
    var lns=$$('.ln',h1).filter(function(el){return el.offsetParent!==null;});
    if(lns.length&&getComputedStyle(lns[0]).display!=='inline') return lns;
    return [h1];
  }
  /* 종이 한 장이 살짝 위에서 떨어져 자리 잡는다 */
  function drop(tl,els,at,o){
    o=o||{};
    els=[].concat(els||[]).filter(Boolean);
    if(!els.length) return;
    var from={x:o.x||0,y:o.y!=null?o.y:-22,rotation:o.r||0,opacity:0},
        to={x:0,y:0,rotation:0,opacity:1,duration:o.d||.6,ease:o.ease||'power3.out',stagger:o.st||0,clearProps:'opacity,transform'};
    if(o.sh){ from.filter=SH_UP; to.filter=SH_DOWN; to.clearProps='filter,opacity,transform'; }
    tl.fromTo(els,from,to,at);
  }
  /* 금색 선·꼬리 글자: 옆에서 살짝 밀려 나타난다(늘리지 않는다) */
  function fade(tl,els,at,o){
    o=o||{};
    els=[].concat(els||[]).filter(Boolean);
    if(!els.length) return;
    tl.fromTo(els,{x:o.x!=null?o.x:-14,y:o.y||0,opacity:0},{x:0,y:0,opacity:1,duration:o.d||.55,ease:'power2.out',stagger:o.st||0,clearProps:'opacity,transform'},at);
  }

  var tl=gsap.timeline({id:'intro',paused:true,defaults:{overwrite:'auto'}});
  var layers=[]; /* 시차를 받을 층 [요소, 깊이] */
  var art=$('[data-art]');
  var kind=art?art.getAttribute('data-art'):'';
  var strips=titleStrips($('[data-intro] h1'));

  /* 머리(공통): 상표 → 금색 선 → 꼬리 글자 */
  if(intro){
    fade(tl,$('.mast .brand, .mast .crumbs'),0,{x:-10,d:.5});
    fade(tl,$('.mast > .rule'),.12,{x:-24,d:.7});
    fade(tl,$$('.mast .tails > *'),.22,{x:10,st:.07,d:.45});
  }

  if(kind==='home'){
    var moon=$('.moon',art),pine=$('.pine',art),bird=$('.magpie',art);
    if(intro){
      drop(tl,moon,.05,{y:-26,sh:true,d:.7});
      tl.fromTo(pine,{x:30,y:-26,rotation:-2,opacity:0,filter:SH_UP},{x:0,y:0,rotation:0,opacity:1,filter:SH_DOWN,duration:.75,ease:'power3.out',clearProps:'filter,opacity,transform'},.32);
      /* 까치: 위 왼쪽에서 비스듬히 내려와 가지에 앉고, 한 번 살짝 출렁인다 */
      tl.fromTo(bird,{x:-70,y:-90,rotation:-3,opacity:0},{x:0,y:0,rotation:0,opacity:1,duration:.7,ease:'power2.out'},.78)
        .to(bird,{y:4,rotation:1,duration:.12,ease:'sine.out'},1.48)
        .to(bird,{y:0,rotation:0,duration:.2,ease:'sine.inOut',clearProps:'opacity,transform'},1.6);
      fade(tl,$('.hero .kicker'),.2,{x:-12});
      drop(tl,strips,.3,{y:-16,r:-1.5,st:.15,d:.6,ease:'back.out(1.3)'});
      drop(tl,$('.hero-tx > p:not(.kicker)'),.66,{y:-8,d:.55});
      fade(tl,$('.hero-rule .rule'),.9,{x:-40,d:.8});
    }
    layers=[[moon,4],[pine,9],[bird,12]];
  } else if(kind==='toki'){
    var sun=$('.sun',art),hills=$('.hills-art',art),pers=$('.persimmon'),rab=$('.rabbit',art),tur=$('.turtle',art);
    if(intro){
      drop(tl,sun,.05,{y:-26,sh:true,d:.7});
      drop(tl,hills,.25,{y:-20,sh:true,d:.75});
      tl.fromTo(pers,{x:-40,y:-24,rotation:-3,opacity:0},{x:0,y:0,rotation:0,opacity:1,duration:.7,ease:'power3.out',clearProps:'opacity,transform'},.55);
      /* 토끼와 거북이: 길을 따라 왼쪽 아래에서 들어온다. 토끼가 먼저, 거북이는 조금 늦게 천천히 */
      tl.fromTo(rab,{x:-120,y:40,rotation:-2,opacity:0},{x:0,y:0,rotation:0,opacity:1,duration:.75,ease:'power2.out',clearProps:'opacity,transform'},.85)
        .fromTo(tur,{x:-70,y:22,opacity:0},{x:0,y:0,opacity:1,duration:.9,ease:'power1.out',clearProps:'opacity,transform'},.98);
      fade(tl,$('.hero .kicker'),.2,{x:-12});
      drop(tl,strips,.3,{y:-16,r:-1.5,st:.15,d:.6,ease:'back.out(1.3)'});
      drop(tl,$$('.hero-tx > :not(h1):not(.kicker)'),.66,{y:-8,st:.1,d:.55});
      fade(tl,$('.hero-rule .rule'),.9,{x:-40,d:.8});
    }
    layers=[[sun,3],[hills,6],[rab,10],[tur,9]];
  } else if(kind==='doc'){
    var dm=$('.moon',art),dp=$('.pine',art);
    if(intro){
      drop(tl,dm,.05,{y:-20,sh:true,d:.6});
      tl.fromTo(dp,{x:24,y:-20,rotation:-2,opacity:0,filter:SH_UP},{x:0,y:0,rotation:0,opacity:1,filter:SH_DOWN,duration:.7,ease:'power3.out',clearProps:'filter,opacity,transform'},.22);
      drop(tl,$$('.title .intro-tx > *, .title > img'),.2,{y:-10,st:.1,d:.55});
    }
    layers=[[dm,3],[dp,7]];
  }

  /* 카드·서가 칸은 화면에 들어올 때 놓이므로, 숨김 클래스를 걷기 전에 미리 숨겨 둔다(ScrollTrigger 가 있을 때만) */
  var pieces=ST?$$('[data-piece], .tales li'):[];
  if(pieces.length) gsap.set(pieces,{opacity:0,y:-14});

  /* 숨김 클래스를 걷고 바로 재생(첫 프레임은 GSAP 가 이미 잡아 두었다) */
  tl.progress(0); reveal(); tl.play();

  if(!ST) return;

  /* ── 스크롤: 그림 층의 약한 시차(가까운 층일수록 더). 등장 연출이 끝난 뒤에 붙인다. ── */
  function parallax(){
    layers.forEach(function(l){
      if(!l[0]) return;
      gsap.to(l[0],{y:function(){return -l[1]*2.6;},ease:'none',
        scrollTrigger:{trigger:art,start:'top top',end:'bottom top',scrub:.6,invalidateOnRefresh:true}});
    });
  }
  if(art){ if(intro) tl.eventCallback('onComplete',parallax); else parallax(); }

  /* ── 스크롤: 바닥 언덕 띠가 살짝 올라오며 겹쳐 온다 ── */
  $$('.land .hills > img').forEach(function(c){
    gsap.fromTo(c,{y:18},{y:0,ease:'none',scrollTrigger:{trigger:c,start:'top bottom',end:'top 70%',scrub:.5}});
  });

  /* ── 스크롤: 카드·쪽지·서가 칸이 화면에 들어올 때 한 장씩 놓인다 ── */
  if(pieces.length){
    ST.batch(pieces,{start:'top 92%',once:true,onEnter:function(b){
      gsap.to(b,{opacity:1,y:0,duration:.55,ease:'power3.out',stagger:Math.min(.07,.5/b.length),overwrite:true,clearProps:'opacity,transform'});
    }});
  }
  }
})();
