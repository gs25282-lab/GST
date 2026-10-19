export function downloadStandaloneHtml() {
  const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GST 소재의 원자 배열 변화와 전기 저항 - 상변환 메모리 시뮬레이션</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
      background: #0f172a;
      color: #f1f5f9;
      line-height: 1.6;
      padding: 20px;
    }
    .container {
      max-width: 960px;
      margin: 0 auto;
    }
    header {
      text-align: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #334155;
    }
    h1 {
      font-size: 1.6rem;
      color: #38bdf8;
      margin-bottom: 6px;
    }
    .subtitle {
      font-size: 0.9rem;
      color: #94a3b8;
    }
    .btn-group {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-bottom: 20px;
    }
    button.btn {
      padding: 12px 24px;
      font-size: 1rem;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.2s;
    }
    .btn-amorph {
      background: #312e81;
      color: #c7d2fe;
    }
    .btn-amorph.active {
      background: #4f46e5;
      color: #ffffff;
      border-color: #a5b4fc;
      box-shadow: 0 0 16px rgba(99, 102, 241, 0.5);
    }
    .btn-cryst {
      background: #064e3b;
      color: #a7f3d0;
    }
    .btn-cryst.active {
      background: #059669;
      color: #ffffff;
      border-color: #6ee7b7;
      box-shadow: 0 0 16px rgba(16, 185, 129, 0.5);
    }
    .stage-wrapper {
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 24px;
    }
    svg {
      width: 100%;
      max-width: 460px;
      height: 460px;
    }
    .status-panel {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 16px;
    }
    .card-title {
      font-size: 0.8rem;
      color: #94a3b8;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .card-value {
      font-size: 1.4rem;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 6px;
    }
    .card-desc {
      font-size: 0.85rem;
      color: #cbd5e1;
    }
    .disclaimer {
      background: #1e1b4b;
      border: 1px solid #4338ca;
      border-radius: 10px;
      padding: 16px;
      font-size: 0.85rem;
      color: #e0e7ff;
    }
    .disclaimer strong {
      color: #38bdf8;
    }
    .legend {
      display: flex;
      gap: 16px;
      margin-top: 12px;
      font-size: 0.85rem;
    }
    .dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>GST 소재의 원자 배열 변화와 전기 저항</h1>
      <p class="subtitle">상변환 메모리(PRAM) 원리 탐구용 과학적 개념 모델 (고등학교 2학년 탐구 발표용)</p>
    </header>

    <div class="btn-group">
      <button id="btnAmorph" class="btn btn-amorph active" onclick="setState('amorphous')">
        비정질 상태 (Amorphous)
      </button>
      <button id="btnCryst" class="btn btn-cryst" onclick="setState('crystalline')">
        결정질 상태 (Crystalline)
      </button>
    </div>

    <div class="stage-wrapper">
      <svg id="canvas" viewBox="0 0 500 500"></svg>
      <div class="legend">
        <span><span class="dot" style="background:#06b6d4;"></span>Ge (게르마늄)</span>
        <span><span class="dot" style="background:#8b5cf6;"></span>Sb (안티모니)</span>
        <span><span class="dot" style="background:#f59e0b;"></span>Te (텔루륨)</span>
      </div>
    </div>

    <div class="status-panel">
      <div class="card">
        <div class="card-title">원자 배열</div>
        <div id="valArray" class="card-value" style="color: #a5b4fc;">불규칙함</div>
        <div id="descArray" class="card-desc">원자들이 불규칙하게 얽혀 장거리 주기성이 없음</div>
      </div>
      <div class="card">
        <div class="card-title">전기 저항</div>
        <div id="valResist" class="card-value" style="color: #f59e0b;">높음</div>
        <div id="descResist" class="card-desc">국재화된 공유 결합 및 전자 산란으로 전하 흐름 방해</div>
      </div>
      <div class="card">
        <div class="card-title">메모리 상태</div>
        <div id="valMemory" class="card-value" style="color: #38bdf8;">일반적으로 '0'으로 표현</div>
        <div id="descMemory" class="card-desc">전류가 거의 흐르지 않는 리셋(RESET) 상태</div>
      </div>
    </div>

    <div class="disclaimer">
      <strong>⚠️ 과학적 정확성 및 개념 모델 안내:</strong><br>
      1. 본 시뮬레이션은 실제 GST의 원자 배열과 전자 이동을 정밀하게 계산하는 물리 시뮬레이션이 아니라, 과학적 원리를 시각적으로 설명하기 위한 개념 모델(Conceptual Model)입니다.<br>
      2. 임의의 수치 데이터를 만들지 않고, 전기 저항은 '높음'과 '낮음'으로 정성적 비교합니다.<br>
      3. 원자 배열뿐 아니라 원자 사이의 결합(공명 결합 vs 국재화 공유 결합)과 전자 상태(밴드 구조)가 전기 저항에 결정적인 영향을 줍니다.<br>
      4. 일반화 주의: 원자 배열이 규칙적이기만 하면 모든 물질의 저항이 낮아지는 것은 아닙니다 (예: 규칙적 결정인 다이아몬드는 부도체). GST 특유의 칼코게나이드 결합 특성에 기인합니다.
    </div>
  </div>

  <script>
    const species = [
      'Te', 'Ge', 'Te', 'Sb', 'Te', 'Ge',
      'Sb', 'Te', 'Ge', 'Te', 'Sb', 'Te',
      'Te', 'Sb', 'Te', 'Ge', 'Te', 'Sb',
      'Ge', 'Te', 'Sb', 'Te', 'Ge', 'Te',
      'Te', 'Ge', 'Te', 'Sb', 'Te', 'Ge',
      'Sb', 'Te', 'Ge', 'Te', 'Sb', 'Te'
    ];
    const colors = { Ge: '#06b6d4', Sb: '#8b5cf6', Te: '#f59e0b' };
    const offsets = [
      [-18, 12], [22, -15], [-12, -24], [15, 18], [-26, 8], [14, -20],
      [20, 16], [-14, -18], [24, -10], [-18, 22], [16, -14], [-22, 10],
      [-10, -22], [18, 14], [-20, 20], [12, -26], [-16, 12], [24, -18],
      [14, 24], [-24, -12], [18, -20], [-12, 16], [22, 14], [-16, -22],
      [-22, 14], [16, -16], [-14, 22], [20, -12], [-18, -18], [14, 20],
      [12, -18], [-20, 16], [18, 22], [-16, -14], [22, -16], [-14, 18]
    ];

    let currentState = 'amorphous';
    const atoms = [];
    for (let i = 0; i < 36; i++) {
      const r = Math.floor(i / 6);
      const c = i % 6;
      const cx = 75 + c * 70;
      const cy = 75 + r * 70;
      const ax = Math.max(45, Math.min(455, cx + offsets[i][0] * 1.3));
      const ay = Math.max(45, Math.min(455, cy + offsets[i][1] * 1.3));
      atoms.push({ id: i, type: species[i], cx, cy, ax, ay });
    }

    const svg = document.getElementById('canvas');

    function render() {
      svg.innerHTML = '';
      const isCryst = currentState === 'crystalline';

      // Bonds
      if (isCryst) {
        for (let r = 0; r < 6; r++) {
          for (let c = 0; c < 6; c++) {
            const idx = r * 6 + c;
            if (c < 5) drawLine(atoms[idx].cx, atoms[idx].cy, atoms[idx + 1].cx, atoms[idx + 1].cy, '#38bdf8', 2);
            if (r < 5) drawLine(atoms[idx].cx, atoms[idx].cy, atoms[idx + 6].cx, atoms[idx + 6].cy, '#38bdf8', 2);
          }
        }
      } else {
        for (let i = 0; i < atoms.length; i++) {
          for (let j = i + 1; j < atoms.length; j++) {
            const dx = atoms[i].ax - atoms[j].ax;
            const dy = atoms[i].ay - atoms[j].ay;
            if (Math.hypot(dx, dy) <= 78) {
              drawLine(atoms[i].ax, atoms[i].ay, atoms[j].ax, atoms[j].ay, '#64748b', 1.5, '4,3');
            }
          }
        }
      }

      // Atoms
      atoms.forEach(a => {
        const x = isCryst ? a.cx : a.ax;
        const y = isCryst ? a.cy : a.ay;
        const color = colors[a.type];

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', \`translate(\${x}, \${y})\`);

        const c1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c1.setAttribute('r', '15');
        c1.setAttribute('fill', color);
        c1.setAttribute('stroke', '#0f172a');
        c1.setAttribute('stroke-width', '2');

        const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        txt.setAttribute('text-anchor', 'middle');
        txt.setAttribute('y', '4');
        txt.setAttribute('fill', '#ffffff');
        txt.setAttribute('font-size', '10');
        txt.setAttribute('font-weight', 'bold');
        txt.textContent = a.type;

        g.appendChild(c1);
        g.appendChild(txt);
        svg.appendChild(g);
      });
    }

    function drawLine(x1, y1, x2, y2, stroke, width, dash = '') {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke', stroke);
      line.setAttribute('stroke-width', width);
      line.setAttribute('opacity', '0.6');
      if (dash) line.setAttribute('stroke-dasharray', dash);
      svg.appendChild(line);
    }

    function setState(newState) {
      currentState = newState;
      const isAmorph = newState === 'amorphous';
      document.getElementById('btnAmorph').className = isAmorph ? 'btn btn-amorph active' : 'btn btn-amorph';
      document.getElementById('btnCryst').className = !isAmorph ? 'btn btn-cryst active' : 'btn btn-cryst';

      document.getElementById('valArray').textContent = isAmorph ? '불규칙함' : '규칙적임';
      document.getElementById('valArray').style.color = isAmorph ? '#a5b4fc' : '#6ee7b7';
      document.getElementById('descArray').textContent = isAmorph
        ? '원자들이 불규칙하게 얽혀 장거리 주기성이 없음'
        : '원자들이 3차원 격자 구조를 이루며 규칙적으로 정렬됨';

      document.getElementById('valResist').textContent = isAmorph ? '높음' : '낮음';
      document.getElementById('valResist').style.color = isAmorph ? '#f59e0b' : '#34d399';
      document.getElementById('descResist').textContent = isAmorph
        ? '국재화된 공유 결합 및 전자 산란으로 전하 흐름 방해'
        : '비편재화된 공명 결합으로 전자 이동이 매우 원활함';

      document.getElementById('valMemory').textContent = isAmorph ? "일반적으로 '0'으로 표현" : "일반적으로 '1'으로 표현";
      document.getElementById('descMemory').textContent = isAmorph
        ? '전류가 거의 흐르지 않는 리셋(RESET) 상태'
        : '전류가 쉽게 흐르는 셋(SET) 상태';

      render();
    }

    render();
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'GST_상변환_메모리_시뮬레이션.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
