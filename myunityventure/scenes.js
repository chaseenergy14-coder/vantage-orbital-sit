"use strict";
/* =====================================================================
   Unity Venture Group — high-end SVG scene library (no dependencies)
   One consistent coastal home, drawn across every act.
   ===================================================================== */
const SCENES = (() => {
  const E = id => document.getElementById(id);
  const wrap = (w, h, inner, ar) =>
    `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="${ar||'xMidYMid slice'}">${inner}</svg>`;

  /* ---- a hi-vis worker ---- */
  function worker(x, y, s, flip) {
    return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
      <ellipse cx="0" cy="2" rx="20" ry="5" fill="#000" opacity=".28"/>
      <rect x="-9" y="-30" width="8" height="30" rx="2" fill="#23262B"/>
      <rect x="1" y="-30" width="8" height="30" rx="2" fill="#1D2024"/>
      <path d="M-12 -78 L12 -78 L9 -52 L-9 -52 Z" fill="url(#hiviz)"/>
      <rect x="-11" y="-69" width="22" height="4.5" fill="#F4F4EC" opacity=".75"/>
      <rect x="-7" y="-62" width="14" height="4.5" fill="#F4F4EC" opacity=".55"/>
      <rect x="9" y="-74" width="6" height="20" rx="3" fill="url(#hiviz)"/>
      <circle cx="0" cy="-86" r="7.5" fill="#E3AE82"/>
      <path d="M-9.5 -85 A9.5 9 0 0 1 9.5 -85 Z" fill="#E7B23C"/>
      <rect x="-10.5" y="-85" width="21" height="3" rx="1.5" fill="#C28C1F"/>
    </g>`;
  }

  /* ---- a light-gauge cold-formed steel stud wall panel ---- */
  function studPanel(x, y, w, h, n, stroke) {
    stroke = stroke || "#AEB7C1";
    let studs = "";
    for (let i = 1; i < n; i++) {
      const sx = x + (w * i) / n;
      studs += `<rect x="${sx - 2.5}" y="${y + 5}" width="5" height="${h - 10}" fill="${stroke}"/>
        <rect x="${sx - 2.5}" y="${y + 5}" width="2" height="${h - 10}" fill="#D6DDE4"/>
        <circle cx="${sx}" cy="${y + h * 0.38}" r="4.5" fill="#2C333A"/>
        <circle cx="${sx}" cy="${y + h * 0.66}" r="4.5" fill="#2C333A"/>`;
    }
    return `<g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${stroke}" stroke-width="5.5"/>
      <rect x="${x}" y="${y}" width="${w}" height="3" fill="#D6DDE4"/>
      ${studs}</g>`;
  }

  /* ================= THE HOME (consistent everywhere) ================= */
  /* local box ~ x[120..868] y[138..470]; parts carry ${pre}- ids */
  function houseMarkup(pre, glow) {
    glow = glow || 0;
    let panels = "";
    for (let i = 0; i < 6; i++) {
      const x = 392 + i * 78;
      panels += `<g id="${pre}-p${i + 1}">
        <rect x="${x}" y="156" width="78" height="236" fill="url(#glass)" opacity="${glow ? 0.7 : 0.86}"/>
        ${glow ? `<rect x="${x + 4}" y="160" width="70" height="228" fill="url(#glassGlow)" opacity="${glow}"/>` : ""}
        <polygon points="${x + 6},156 ${x + 30},156 ${x + 8},392 ${x},392 ${x},318" fill="#FFFFFF" opacity=".13"/>
        <rect x="${x}" y="156" width="78" height="236" fill="none" stroke="#222A30" stroke-width="3.5"/>
        ${i === 4 ? `<line x1="${x + 60}" y1="262" x2="${x + 60}" y2="292" stroke="#10151A" stroke-width="5" stroke-linecap="round"/>` : ""}
      </g>`;
    }
    let ribs = "";
    for (let x = 160; x < 372; x += 15) ribs += `<line x1="${x}" y1="192" x2="${x}" y2="388" stroke="#7E8A96" stroke-width="2.4"/>`;
    let piers = "";
    [170, 300, 430, 560, 690, 800].forEach(x => {
      piers += `<rect x="${x}" y="392" width="14" height="66" fill="url(#steelClad)"/><rect x="${x}" y="392" width="5" height="66" fill="#5E6A76"/>`;
    });
    const interior = `<g opacity="${glow ? 0.95 : 0.55}" fill="#1A222B">
      <rect x="470" y="316" width="120" height="40" rx="9"/><rect x="458" y="300" width="16" height="56" rx="6"/>
      <rect x="612" y="304" width="66" height="52" rx="5"/>
      <line x1="540" y1="156" x2="540" y2="224" stroke="#1A222B" stroke-width="4"/><circle cx="540" cy="230" r="8"/>
      <rect x="700" y="332" width="84" height="24" rx="6"/></g>`;
    const railing = `<g stroke="#AEB8C2" stroke-width="2.6">${[150,250,350,450,550,650,750,840].map(x=>`<line x1="${x}" y1="350" x2="${x}" y2="380"/>`).join("")}</g><rect x="120" y="346" width="734" height="5" fill="#BFC8D1"/>`;
    return `
      <ellipse cx="500" cy="470" rx="440" ry="32" fill="url(#softShadow)"/>
      <g id="${pre}-piers">${piers}</g>
      <g id="${pre}-deck">
        ${railing}
        <rect x="120" y="380" width="734" height="14" fill="#C9D2DB"/>
        <rect x="120" y="392" width="734" height="6" fill="#8C97A2"/>
        <rect x="846" y="394" width="58" height="9" fill="#BAC4CE"/><rect x="858" y="403" width="58" height="9" fill="#A9B4BF"/><rect x="870" y="412" width="58" height="9" fill="#97A2AE"/>
      </g>
      <g id="${pre}-volL">
        <rect x="150" y="188" width="222" height="204" fill="url(#steelClad)"/>${ribs}
        <rect x="180" y="232" width="74" height="110" fill="url(#glass)" opacity=".86" stroke="#222A30" stroke-width="3.5"/>
        ${glow ? `<rect x="184" y="236" width="66" height="102" fill="url(#glassGlow)" opacity="${glow}"/>` : ""}
      </g>
      <g id="${pre}-roofL"><rect x="132" y="138" width="262" height="22" fill="url(#roofGrad)"/><rect x="132" y="158" width="262" height="5" fill="#0E0B08" opacity=".2"/></g>
      <g id="${pre}-glass">${interior}${panels}
        <rect x="386" y="156" width="6" height="236" fill="#222A30"/><rect x="850" y="156" width="6" height="236" fill="#222A30"/>
      </g>
      <g id="${pre}-roofR"><rect x="388" y="136" width="484" height="24" fill="url(#roofGrad)"/><rect x="388" y="158" width="484" height="6" fill="#0E0B08" opacity=".18"/></g>`;
  }

  /* ---- sky helpers ---- */
  const cloudBand = (y, op) => `<g fill="#FFFFFF" opacity="${op}" filter="url(#haze)">
    <ellipse cx="300" cy="${y}" rx="180" ry="20"/><ellipse cx="620" cy="${y - 18}" rx="220" ry="22"/>
    <ellipse cx="1050" cy="${y + 8}" rx="240" ry="24"/><ellipse cx="1420" cy="${y - 10}" rx="180" ry="20"/></g>`;
  const glitter = (cx, y) => {
    let g = "";
    for (let i = 0; i < 22; i++) { const x = cx + (Math.random() - .5) * 360, yy = y + Math.random() * 150; g += `<ellipse cx="${x}" cy="${yy}" rx="${6 + Math.random() * 14}" ry="1.6" fill="#FFE6B0" opacity="${.15 + Math.random() * .4}"/>`; }
    return g;
  };
  const duneGrass = (x, y, n, col) => {
    let g = "";
    for (let i = 0; i < n; i++) { const gx = x + i * 7 - n * 3; g += `<path d="M${gx} ${y} q${(Math.random()-.5)*10} -${22+Math.random()*16} ${(Math.random()-.5)*22} -${30+Math.random()*18}" stroke="${col||'#9DA567'}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`; }
    return g;
  };

  /* ====================== SCENE: HERO (golden hour) ====================== */
  function heroScene() {
    return wrap(1600, 900, `
      <rect width="1600" height="900" fill="url(#skyGold)"/>
      <circle cx="430" cy="430" r="220" fill="url(#sun)"/>
      <circle cx="430" cy="430" r="58" fill="#FFF1CE"/>
      ${cloudBand(220, .5)}${cloudBand(360, .3)}
      <rect y="556" width="1600" height="150" fill="url(#seaGold)"/>
      ${glitter(470, 560)}
      <rect y="556" width="1600" height="4" fill="#F4D49A" opacity=".6"/>
      <path d="M0 706 Q420 666 900 690 T1600 700 L1600 900 L0 900 Z" fill="url(#sand)"/>
      <path d="M0 900 L0 792 Q560 760 1600 800 L1600 900 Z" fill="url(#sandDusk)"/>
      <g transform="translate(150 250) scale(0.92)">${houseMarkup("hero", 0.5)}</g>
      <g opacity=".9">${duneGrass(210, 856, 16, "#8C9456")}${duneGrass(1330, 846, 18, "#8C9456")}${duneGrass(560, 872, 12)}</g>
      <rect width="1600" height="900" fill="#C2603F" opacity=".05"/>`);
  }

  /* ============== SCENE: ADDRESS (dawn beach, atmospheric) ============== */
  function beachScene(mode) {
    const sky = mode === "dusk" ? "url(#skyGold)" : "url(#skyDawn)";
    const sand = mode === "dusk" ? "url(#sandDusk)" : "url(#sand)";
    return wrap(1600, 900, `
      <rect width="1600" height="900" fill="${sky}"/>
      <circle cx="1180" cy="500" r="190" fill="url(#sun)" opacity=".9"/>
      ${cloudBand(250, .35)}
      <rect y="586" width="1600" height="150" fill="url(#seaGold)"/>${glitter(1180, 590)}
      <path d="M0 726 Q500 690 1100 712 T1600 720 L1600 900 L0 900 Z" fill="${sand}"/>
      <g opacity=".55" transform="translate(330 360) scale(0.55)">${houseMarkup("addr", 0.3)}</g>
      <g opacity=".85">${duneGrass(170, 876, 22, "#94995E")}${duneGrass(1380, 862, 20, "#94995E")}${duneGrass(740, 888, 16)}</g>
      <rect width="1600" height="900" fill="#1A120C" opacity=".18"/>`);
  }

  /* ===================== SCENE: BLUEPRINT (line draw) ===================== */
  function blueprintScene() {
    let grid = "";
    for (let x = 0; x <= 1600; x += 48) grid += `<line x1="${x}" y1="0" x2="${x}" y2="900" stroke="#E0A472" stroke-width="1" opacity=".08"/>`;
    for (let y = 0; y <= 900; y += 48) grid += `<line x1="0" y1="${y}" x2="1600" y2="${y}" stroke="#E0A472" stroke-width="1" opacity=".08"/>`;
    // technical elevation of the home (strokes, animated)
    const L = 'pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"';
    let glass = "";
    for (let i = 0; i < 6; i++) { const x = 760 + i * 70; glass += `<rect ${L} x="${x}" y="360" width="70" height="190" fill="none"/>`; }
    let studs = "";
    for (let x = 548; x < 740; x += 22) studs += `<line ${L} x1="${x}" y1="392" x2="${x}" y2="550"/>`;
    const house = `<g id="bpHouse" fill="none" stroke="#F0B070" stroke-width="2.4">
      <rect ${L} x="540" y="392" width="210" height="158"/>${studs}
      <rect ${L} x="520" y="372" width="700" height="20"/>
      <rect ${L} x="752" y="360" width="468" height="12"/>
      ${glass}
      <rect ${L} x="752" y="360" width="6" height="190"/><rect ${L} x="1214" y="360" width="6" height="190"/>
      <line ${L} x1="540" y1="550" x2="1220" y2="550"/>
      ${[560,640,720,840,960,1080,1180].map(x=>`<line ${L} x1="${x}" y1="550" x2="${x}" y2="612"/>`).join("")}
      <line ${L} x1="520" y1="612" x2="1240" y2="612"/>
    </g>
    <g fill="#F0B070" font-family="Inter,sans-serif" opacity=".0" id="bpAnno">
      <text x="880" y="660" font-size="15" font-weight="700" letter-spacing="6" text-anchor="middle">COASTAL SERIES 01 · OCEAN ELEVATION · SHEET A-201</text>
    </g>`;
    return wrap(1600, 900, `<rect width="1600" height="900" fill="#161616"/>${grid}
      <rect x="40" y="40" width="1520" height="820" fill="none" stroke="#E0A472" stroke-width="1.5" opacity=".35"/>
      ${house}`);
  }
  function drawBlueprint(t) {
    const host = E("bgBp"); if (!host) return;
    const shapes = host.querySelectorAll("#bpHouse [stroke-dasharray]");
    const n = shapes.length;
    shapes.forEach((el, i) => { const a = .5 * (i / n), b = a + .28; el.style.strokeDashoffset = String(1 - Math.min(1, Math.max(0, (t - a) / (b - a)))); });
    const an = host.querySelector("#bpAnno"); if (an) an.setAttribute("opacity", String(Math.min(1, Math.max(0, (t - .6) / .25))));
  }

  /* ===================== SCENE: FACTORY (CFS panel shop) ===================== */
  function factoryScene() {
    // back wall windows w/ daylight
    let win = "";
    for (let x = 120; x < 980; x += 220) win += `<rect x="${x}" y="180" width="150" height="120" fill="#7C94A0"/><rect x="${x}" y="180" width="150" height="120" fill="#A9C4CC" opacity=".5"/><line x1="${x+75}" y1="180" x2="${x+75}" y2="300" stroke="#3A444C" stroke-width="3"/>`;
    // roof trusses
    let truss = "";
    for (let x = 0; x < 1600; x += 80) truss += `<path d="M${x} 150 L${x+40} 96 L${x+80} 150" stroke="#3A434C" stroke-width="5" fill="none"/>`;
    // work-light pools
    const lights = [320, 760, 1180].map(x => `<g transform="translate(${x} 150)"><line y2="48" stroke="#11151A" stroke-width="4"/><path d="M-30 48 h60 l-10 22 h-40 z" fill="#11151A"/><ellipse cx="0" cy="74" rx="22" ry="7" fill="#FFE6AE"/><ellipse cx="0" cy="200" rx="150" ry="150" fill="#FFE6AE" opacity=".06"/></g>`).join("");
    // stud racks
    let rack = "";
    for (let i = 0; i < 9; i++) rack += `<line x1="40" y1="${560 + i * 7}" x2="190" y2="${560 + i * 7}" stroke="#9AA6B2" stroke-width="3"/>`;
    return wrap(1600, 900, `
      <rect width="1600" height="660" fill="#1C232B"/><rect y="150" width="1600" height="30" fill="#222B33"/>
      <g opacity=".5">${truss}</g>
      <rect y="92" width="1600" height="60" fill="#262F38"/>
      ${win}
      <text x="120" y="430" fill="#3C4853" font-family="Inter,sans-serif" font-weight="800" font-size="30" letter-spacing="11">UNITY VENTURE GROUP · CFS PANEL PLANT 02</text>
      ${lights}
      <!-- open bay door, daylight + waiting trailer -->
      <rect x="1230" y="200" width="370" height="460" fill="url(#skyDawn)"/>
      <rect x="1218" y="180" width="12" height="480" fill="#11151A"/>
      <rect x="1300" y="560" width="300" height="14" rx="3" fill="#1A2129"/><circle cx="1360" cy="600" r="20" fill="#0C1015"/><circle cx="1520" cy="600" r="20" fill="#0C1015"/>
      <!-- floor -->
      <rect y="660" width="1600" height="240" fill="#2D3742"/><rect y="660" width="1600" height="7" fill="#1A2129"/>
      <g stroke="#222C35" stroke-width="3" opacity=".7"><line x1="0" y1="740" x2="1600" y2="740"/><line x1="0" y1="820" x2="1600" y2="820"/></g>
      <!-- stud rack left -->
      <rect x="30" y="540" width="170" height="120" fill="#222B33"/><g>${rack}</g>
      <!-- overhead gantry crane -->
      <rect x="0" y="206" width="1600" height="12" fill="#C9881F"/><rect x="0" y="206" width="1600" height="4" fill="#E7A53A"/>
      <rect x="690" y="206" width="120" height="20" rx="3" fill="#E7A53A"/>
      <line x1="750" y1="226" x2="750" y2="372" stroke="#11151A" stroke-width="3"/>
      <!-- panel being lifted by gantry -->
      <g transform="translate(610 372)">${studPanel(0, 0, 300, 150, 7)}<line x1="150" y1="0" x2="150" y2="-12" stroke="#11151A" stroke-width="3"/></g>
      <!-- assembly jig tables with panels -->
      <g transform="translate(250 612)"><rect x="-20" y="44" width="380" height="14" fill="#1A2129"/><rect x="-10" y="58" width="14" height="40" fill="#161C22"/><rect x="330" y="58" width="14" height="40" fill="#161C22"/>${studPanel(0, -40, 340, 84, 8)}</g>
      <g transform="translate(770 628)"><rect x="-20" y="36" width="420" height="14" fill="#1A2129"/><rect x="-10" y="50" width="14" height="40" fill="#161C22"/><rect x="380" y="50" width="14" height="40" fill="#161C22"/>${studPanel(0, -52, 380, 92, 9)}</g>
      <!-- finished panel rolling to bay -->
      <g transform="translate(1080 590)">${studPanel(0, 0, 150, 150, 4, "#C2CAD2")}<circle cx="30" cy="166" r="12" fill="#11151A"/><circle cx="120" cy="166" r="12" fill="#11151A"/></g>
      <!-- workers -->
      ${worker(360, 690, 1.15)}${worker(470, 700, 1.0, true)}${worker(840, 712, 1.2)}${worker(980, 706, 1.0, true)}${worker(1150, 700, 1.05)}
      <rect width="1600" height="900" fill="#0E0B08" opacity=".12"/>`);
  }

  /* ===================== SCENE: DELIVERY (parallax truck) ===================== */
  function truckScene() {
    return wrap(1600, 900, `
      <rect width="1600" height="900" fill="url(#skyGold)"/>
      <circle cx="1240" cy="420" r="200" fill="url(#sun)"/><circle cx="1240" cy="420" r="50" fill="#FFF1CE"/>
      ${cloudBand(210, .4)}
      <g id="jFar"></g><g id="jMid"></g>
      <rect y="612" width="1600" height="120" fill="url(#seaGold)"/>${glitter(1240, 614)}
      <path d="M0 690 Q500 664 1600 686 L1600 760 L0 760 Z" fill="url(#sandDusk)"/>
      <g id="jNear"></g>
      <!-- road -->
      <path d="M-100 900 L600 730 L1700 760 L1700 900 Z" fill="#2A2F35"/>
      <path d="M-100 900 L640 742 L760 742 L120 900 Z" fill="#C9A86A" opacity=".5"/>
      <g id="truck" transform="translate(470 560)">
        <ellipse cx="280" cy="208" rx="300" ry="16" fill="url(#softShadow)"/>
        <!-- flatbed -->
        <rect x="20" y="150" width="360" height="16" rx="3" fill="#161C22"/><rect x="34" y="138" width="332" height="12" fill="#28323C"/>
        <!-- panelized cargo: stacked CFS wall panels + wrapped module -->
        <g>
          <g transform="translate(40 36)">${studPanel(0, 0, 120, 102, 6, "#AEB7C1")}</g>
          <g transform="translate(120 44)"><rect width="118" height="94" rx="3" fill="#11181F" stroke="url(#steelClad)" stroke-width="4"/><rect x="7" y="7" width="104" height="80" fill="url(#glass)" opacity=".85"/><line x1="44" y1="7" x2="44" y2="87" stroke="#222A30" stroke-width="3"/><line x1="78" y1="7" x2="78" y2="87" stroke="#222A30" stroke-width="3"/></g>
          <g transform="translate(232 30)"><rect width="130" height="108" rx="4" fill="#D7C7AE"/><path d="M0 0 h130 M0 27 h130 M0 54 h130 M0 81 h130" stroke="#B7A684" stroke-width="2"/><rect width="130" height="108" rx="4" fill="none" stroke="#9C8C6A" stroke-width="3"/></g>
          <path d="M40 30 L40 150 M362 28 L362 150" stroke="#E89A4A" stroke-width="5"/>
          <path d="M120 36 L120 150 M238 36 L238 150" stroke="#E89A4A" stroke-width="4" opacity=".8"/>
        </g>
        <!-- cab -->
        <g>
          <path d="M382 166 L382 78 Q382 58 402 56 L470 50 Q494 48 506 68 L542 120 Q548 130 548 142 L548 166 Z" fill="#EFE9DC"/>
          <path d="M474 56 Q492 54 502 72 L530 116 L470 116 Z" fill="#C8704A"/>
          <rect x="382" y="130" width="166" height="14" fill="#C8704A"/><rect x="382" y="144" width="166" height="22" fill="#CDC6B6"/>
          <text x="398" y="126" font-family="Inter,sans-serif" font-weight="900" font-size="16" letter-spacing="1" fill="#1A120C">UVG</text>
          <rect x="542" y="122" width="10" height="44" rx="3" fill="#1A2129"/>
          <ellipse cx="548" cy="120" rx="10" ry="6" fill="#FFE6AE" opacity=".8"/>
        </g>
        <g id="truckWheels" fill="#0C1015">
          <g class="wheel" transform="translate(80 178)"><circle r="26"/><circle r="11" fill="#39424B"/><line x1="-10" x2="10" stroke="#0C1015" stroke-width="3"/><line y1="-10" y2="10" stroke="#0C1015" stroke-width="3"/></g>
          <g class="wheel" transform="translate(150 178)"><circle r="26"/><circle r="11" fill="#39424B"/></g>
          <g class="wheel" transform="translate(420 178)"><circle r="28"/><circle r="12" fill="#39424B"/><line x1="-11" x2="11" stroke="#0C1015" stroke-width="3"/><line y1="-11" y2="11" stroke="#0C1015" stroke-width="3"/></g>
          <g class="wheel" transform="translate(505 178)"><circle r="28"/><circle r="12" fill="#39424B"/></g>
        </g>
      </g>
      <rect width="1600" height="900" fill="#C2603F" opacity=".05"/>`);
  }
  function buildJourneyLayers() {
    const far = E("bgTruck") && E("bgTruck").querySelector("#jFar");
    if (!far) return;
    let f = "";
    f += `<path d="M-200 612 Q300 560 800 600 Q1200 568 1900 604 L1900 660 L-200 660 Z" fill="#5A4E55" opacity=".5"/>`;
    far.innerHTML = f;
    const mid = E("bgTruck").querySelector("#jMid");
    let m = "";
    for (let i = 0; i < 10; i++) { const x = 120 + i * 360; m += `<g transform="translate(${x} 690)"><path d="M0 0 q-10 -120 8 -180" stroke="#3A2E22" stroke-width="14" fill="none"/><g stroke="#3E5A40" stroke-width="9" fill="none" stroke-linecap="round"><path d="M8 -150 q-70 -34 -120 -6"/><path d="M8 -150 q70 -34 120 -6"/><path d="M8 -150 q-46 -60 -96 -64"/><path d="M8 -150 q46 -60 96 -64"/><path d="M8 -150 q4 -64 30 -84"/></g></g>`; }
    mid.innerHTML = m;
    const near = E("bgTruck").querySelector("#jNear");
    let n = `<g stroke="#7C8894" stroke-width="6">`;
    for (let x = -200; x < 1900; x += 150) n += `<line x1="${x}" y1="700" x2="${x}" y2="742"/>`;
    n += `<line x1="-200" y1="700" x2="1900" y2="700"/></g>`;
    near.innerHTML = n;
  }
  function driveTruck(p) {
    const host = E("bgTruck"); if (!host) return;
    const pe = (t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)(Math.min(1, Math.max(0, (p - .02) / .94)));
    const far = host.querySelector("#jFar"), mid = host.querySelector("#jMid"), near = host.querySelector("#jNear"), tk = host.querySelector("#truck");
    if (far) far.setAttribute("transform", `translate(${-700 * pe * .35} 0)`);
    if (mid) mid.setAttribute("transform", `translate(${-700 * pe * .65} 0)`);
    if (near) near.setAttribute("transform", `translate(${-700 * pe} 0)`);
    if (tk) { const bob = Math.sin(p * 200) * (pe > 0 && pe < 1 ? 2 : 0); tk.setAttribute("transform", `translate(470 ${560 + bob})`); }
    host.querySelectorAll("#truckWheels .wheel").forEach(w => w.style.animationPlayState = (pe > .003 && pe < .997) ? "running" : "paused");
  }

  /* ===================== SCENE: BUILD (crane set on beach) ===================== */
  const BTX = 430, BTY = 250, BS = 0.86;
  function buildScene() {
    return wrap(1600, 900, `
      <rect width="1600" height="900" fill="url(#skyNoon)" id="bSky"/>
      <rect width="1600" height="900" fill="url(#skyGold)" opacity="0" id="bSkyDusk"/>
      <circle id="bSun" cx="200" cy="440" r="46" fill="#FFF1CE"/><circle id="bSunGlow" cx="200" cy="440" r="150" fill="url(#sun)"/>
      <rect y="566" width="1600" height="150" fill="url(#sea)"/>
      <path d="M0 706 Q420 672 900 694 T1600 702 L1600 900 L0 900 Z" fill="url(#sand)"/>
      <path d="M0 900 L0 794 Q560 764 1600 802 L1600 900 Z" fill="url(#sandDusk)"/>
      <g transform="translate(${BTX} ${BTY}) scale(${BS})">${houseMarkup("er", 0)}</g>
      <g id="bGrass" opacity="0">${duneGrass(360, 856, 14, "#8C9456")}${duneGrass(1240, 858, 14, "#8C9456")}</g>
      <!-- lattice crane -->
      <g id="bCrane">
        <rect x="1300" y="700" width="150" height="56" rx="6" fill="#E7A53A"/><rect x="1316" y="664" width="60" height="42" rx="5" fill="#1A2129"/>
        <circle cx="1330" cy="772" r="22" fill="#0C1015"/><circle cx="1420" cy="772" r="22" fill="#0C1015"/>
        <g stroke="#E7A53A" stroke-width="10"><line x1="1372" y1="700" x2="900" y2="150"/></g>
        <g stroke="#C9881F" stroke-width="3" opacity=".8">${Array.from({length:9},(_, i)=>`<line x1="${1372-i*52}" y1="${700-i*61}" x2="${1372-(i+1)*52}" y2="${700-(i+1)*61}"/>`).join("")}</g>
        <line id="bCable" x1="900" y1="150" x2="900" y2="430" stroke="#0C1015" stroke-width="2.5"/>
        <rect id="bHook" x="888" y="424" width="24" height="12" rx="3" fill="#0C1015"/>
      </g>
      ${worker(560, 720, 1.0)}${worker(640, 726, 0.95, true)}${worker(1180, 730, 1.05)}`);
  }
  const B_PARTS = ["er-piers","er-deck","er-volL","er-p1","er-p2","er-p3","er-p4","er-p5","er-p6","er-roofL","er-roofR"];
  const B_WIN = { "er-piers":[.03,.12],"er-deck":[.12,.2],"er-volL":[.2,.3],"er-p1":[.3,.37],"er-p2":[.37,.44],"er-p3":[.44,.51],"er-p4":[.51,.58],"er-p5":[.58,.65],"er-p6":[.65,.72],"er-roofL":[.73,.8],"er-roofR":[.8,.87] };
  function erect(p) {
    const host = E("bgBuild"); if (!host) return;
    const clamp = (v) => Math.min(1, Math.max(0, v)), eo = t => 1 - Math.pow(1 - t, 3);
    host.querySelector("#bSkyDusk").setAttribute("opacity", String(clamp((p - .6) / .35) * .9));
    const sx = 200 + 1180 * p, sy = 440 - 250 * (1 - Math.pow((p - .5) * 2, 2));
    ["bSun", "bSunGlow"].forEach(id => { const e = host.querySelector("#" + id); e.setAttribute("cx", sx); e.setAttribute("cy", sy); });
    let active = null;
    for (const id of B_PARTS) {
      const el = host.querySelector("#" + id); if (!el) continue;
      const [a, b] = B_WIN[id], t = clamp((p - a) / (b - a));
      const above = id.indexOf("roof") >= 0;
      const dy = above ? -300 * (1 - eo(t)) : 170 * (1 - eo(t));
      el.setAttribute("opacity", String(t <= 0 ? 0 : (t < .16 ? t / .16 : 1)));
      el.setAttribute("transform", `translate(0 ${dy})`);
      if (t > 0 && t < 1 && id.indexOf("er-p") === 0) { const i = parseInt(id.slice(4), 10) - 1; active = { x: BTX + (392 + i * 78 + 39) * BS, y: BTY + (156 + dy) * BS }; }
    }
    const cable = host.querySelector("#bCable"), hook = host.querySelector("#bHook");
    if (active) { cable.setAttribute("x2", active.x); cable.setAttribute("y2", active.y); hook.setAttribute("x", active.x - 12); hook.setAttribute("y", active.y - 6); cable.setAttribute("opacity", "1"); hook.setAttribute("opacity", "1"); }
    else { cable.setAttribute("opacity", "0"); hook.setAttribute("opacity", "0"); }
    host.querySelector("#bCrane").setAttribute("opacity", String(1 - clamp((p - .87) / .1)));
    host.querySelector("#bGrass").setAttribute("opacity", String(clamp((p - .86) / .1)));
    const glow = clamp((p - .82) / .15);
    ["er-p1","er-p2","er-p3","er-p4","er-p5","er-p6"].forEach((id, i) => { const e = host.querySelector("#" + id); if (e) { let r = e.querySelector("rect"); } });
    const gl = host.querySelector("#er-glass");
  }

  /* ===================== SCENE: TOUR (interior pano) ===================== */
  function tourScene() {
    // wide interior; #tourPan translated horizontally
    let glassWall = "";
    for (let x = 120; x < 2800; x += 150) glassWall += `<rect x="${x}" y="150" width="150" height="430" fill="url(#glass)" opacity=".5"/><line x1="${x}" y1="150" x2="${x}" y2="580" stroke="#222A30" stroke-width="6"/>`;
    return wrap(1600, 900, `
      <g id="tourPan">
      <rect x="0" y="0" width="2800" height="150" fill="#EEE9DE"/><rect x="0" y="148" width="2800" height="10" fill="#D2CBBC"/>
      <!-- ocean through the back glass wall -->
      <rect x="100" y="150" width="2620" height="430" fill="url(#skyNoon)"/>
      <rect x="100" y="430" width="2620" height="150" fill="url(#sea)"/>
      <g opacity=".4" stroke="#DCECEC" stroke-width="3" fill="none"><path d="M100 480 q70 -12 140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0"/></g>
      ${glassWall}
      <rect x="0" y="580" width="2800" height="320" fill="url(#sandDusk)"/><rect x="0" y="580" width="2800" height="12" fill="#B49A6E"/>
      <g stroke="#9C8156" stroke-width="3" opacity=".5"><line x1="0" y1="680" x2="2800" y2="680"/><line x1="0" y1="780" x2="2800" y2="780"/></g>
      <!-- living -->
      <g><ellipse cx="430" cy="700" rx="300" ry="30" fill="#E8E0D0" opacity=".7"/>
        <rect x="240" y="560" width="380" height="80" rx="16" fill="#3A444C"/><rect x="220" y="520" width="40" height="120" rx="14" fill="#3A444C"/><rect x="600" y="520" width="40" height="120" rx="14" fill="#3A444C"/>
        <rect x="360" y="660" width="160" height="12" rx="4" fill="#6E5A3E"/>
        <line x1="430" y1="150" x2="430" y2="320" stroke="#1A2129" stroke-width="5"/><circle cx="430" cy="328" r="10" fill="#1A2129"/></g>
      <!-- kitchen -->
      <g><rect x="900" y="540" width="420" height="34" rx="8" fill="#E7E1D4"/><rect x="912" y="574" width="396" height="120" fill="#2C3A42"/>
        <g fill="#C0A074"><rect x="950" y="600" width="34" height="94" rx="9"/><rect x="1100" y="600" width="34" height="94" rx="9"/><rect x="1250" y="600" width="34" height="94" rx="9"/></g>
        <line x1="1040" y1="150" x2="1040" y2="330" stroke="#1A2129" stroke-width="4"/><circle cx="1040" cy="340" r="13" fill="#11161F"/>
        <line x1="1200" y1="150" x2="1200" y2="330" stroke="#1A2129" stroke-width="4"/><circle cx="1200" cy="340" r="13" fill="#11161F"/></g>
      <!-- dining -->
      <g><rect x="1480" y="560" width="320" height="16" rx="6" fill="#6E5A3E"/><rect x="1516" y="576" width="12" height="120" fill="#6E5A3E"/><rect x="1750" y="576" width="12" height="120" fill="#6E5A3E"/>
        <g fill="#2C3A42"><rect x="1440" y="566" width="32" height="120" rx="9"/><rect x="1806" y="566" width="32" height="120" rx="9"/><rect x="1560" y="572" width="32" height="112" rx="9"/><rect x="1668" y="572" width="32" height="112" rx="9"/></g></g>
      <!-- primary suite -->
      <g><rect x="2010" y="470" width="86" height="220" rx="8" fill="#B7C2CC"/>
        <rect x="2110" y="520" width="430" height="120" rx="14" fill="#E7E1D4"/><rect x="2110" y="640" width="430" height="34" rx="8" fill="#C0A074"/>
        <rect x="2160" y="498" width="150" height="46" rx="14" fill="#CBDBDF"/><rect x="2340" y="498" width="150" height="46" rx="14" fill="#CBDBDF"/>
        <ellipse cx="2320" cy="700" rx="300" ry="28" fill="#DCEAE6" opacity=".5"/></g>
      </g>`);
  }
  function panTour(p) {
    const host = E("bgTour"); if (!host) return;
    const pan = host.querySelector("#tourPan"); if (!pan) return;
    const pe = (t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)(Math.min(1, Math.max(0, (p - .02) / .94)));
    pan.setAttribute("transform", `translate(${-1200 * pe} 0)`);
  }

  /* ===================== catalog card houses ===================== */
  function cardScene(kind) {
    const sky = `<rect width="900" height="470" fill="url(#skyGold)"/><circle cx="240" cy="230" r="120" fill="url(#sun)"/><rect y="330" width="900" height="60" fill="url(#seaGold)"/><path d="M0 372 Q300 356 900 368 L900 470 L0 470 Z" fill="url(#sand)"/>`;
    let body;
    if (kind === "02") body = `<g transform="translate(60 70) scale(0.82)">${houseMarkup("c2", 0.4)}</g><g transform="translate(640 150) scale(0.5)">${houseMarkup("c2b", 0.4)}</g>`;
    else if (kind === "03") body = `<g transform="translate(120 4) scale(0.9)">${houseMarkup("c3", 0.45)}</g><rect x="250" y="20" width="430" height="40" fill="url(#roofGrad)"/><g stroke="#222A30" stroke-width="3">${[300,360,420,480,540,600,660].map(x=>`<line x1="${x}" y1="22" x2="${x}" y2="58"/>`).join("")}</g>`;
    else body = `<g transform="translate(70 40) scale(0.92)">${houseMarkup("c1", 0.45)}</g>`;
    return wrap(900, 470, sky + body);
  }

  /* ===================== paint everything ===================== */
  function paint() {
    E("heroBg").innerHTML = heroScene();
    E("bgAddr").innerHTML = beachScene("dawn");
    E("bgRep").innerHTML = beachScene("dusk");
    E("bgBp").innerHTML = blueprintScene();
    E("bgFac").innerHTML = factoryScene();
    E("bgTruck").innerHTML = truckScene(); buildJourneyLayers();
    E("bgBuild").innerHTML = buildScene();
    E("bgTour").innerHTML = tourScene();
    document.querySelectorAll("[data-card]").forEach(el => el.innerHTML = cardScene(el.dataset.card));
    // initialise progressive scenes at p=0
    drawBlueprint(0); erect(0); driveTruck(0); panTour(0);
  }

  return { paint, drawBlueprint, driveTruck, erect, panTour };
})();
