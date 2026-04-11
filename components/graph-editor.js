/* ================================================================
   GraphEditor — reusable interactive graph editor component
   Usage:
     const editor = new GraphEditor({
       svgId:         'graph-svg',   // id of the <svg> element
       graph:         GRAPH,         // { nodes, edges, start, goal }
       logId:         'step-log',    // id of the log bar element
       onGraphChange: rebuildADJ,    // called after every edit
     });
     editor.enable();   // enter edit mode
     editor.disable();  // exit edit mode
     editor.draw();     // redraw current edit state
   ================================================================ */

class GraphEditor {

  constructor({ svgId, graph, logId = 'step-log', onGraphChange = () => {} }) {
    this.svgId         = svgId;
    this.graph         = graph;
    this.logId         = logId;
    this.onGraphChange = onGraphChange;

    // Internal state
    this.enabled      = false;
    this.dragNode     = null;
    this.dragOffX     = 0;
    this.dragOffY     = 0;
    this.dragMoved    = false;
    this.pendingEdge  = null;   // first node selected for edge creation
    this.ctxTarget    = null;   // node right-clicked
    this.nodeCounter  = graph.nodes.length;

    this._injectStyles();
    this._injectContextMenu();
    this._bindGlobalEvents();
  }


  /* ----------------------------------------------------------
     PUBLIC API
  ---------------------------------------------------------- */

  enable() {
    this.enabled     = true;
    this.pendingEdge = null;
    this.draw();
    this._log('Edit mode: drag nodes · click two nodes to connect · right-click for options');
  }

  disable() {
    this.enabled = false;
    this._hideCtxMenu();
    this.pendingEdge = null;
  }

  // Full redraw of the edit-mode graph
  draw() {
    if (!this.enabled) return;
    const svg = document.getElementById(this.svgId);
    if (!svg) return;
    const ns = 'http://www.w3.org/2000/svg';
    svg.innerHTML = '';

    // ── Edges ────────────────────────────────────────────────
    this.graph.edges.forEach(e => {
      const a = this._node(e.from);
      const b = this._node(e.to);
      if (!a || !b) return;

      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
      line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
      line.setAttribute('stroke', '#CCCCCC');
      line.setAttribute('stroke-width', '1.5');
      svg.appendChild(line);

      // Cost label at midpoint
      const tx = document.createElementNS(ns, 'text');
      tx.setAttribute('x', (a.x + b.x) / 2);
      tx.setAttribute('y', (a.y + b.y) / 2 - 6);
      tx.setAttribute('text-anchor', 'middle');
      tx.setAttribute('font-size', '11');
      tx.setAttribute('fill', '#AAAAAA');
      tx.textContent = e.cost;
      svg.appendChild(tx);
    });

    // ── Nodes ────────────────────────────────────────────────
    this.graph.nodes.forEach(n => {
      const g = document.createElementNS(ns, 'g');
      g.style.cursor = 'grab';

      const isStart   = n.id === this.graph.start;
      const isGoal    = n.id === this.graph.goal;
      const isPending = this.pendingEdge === n.id;

      const color = isPending ? '#FBBF24'
                  : isStart   ? '#34D399'
                  : isGoal    ? '#F87171'
                  : '#8F8F8F';

      const circle = document.createElementNS(ns, 'circle');
      circle.setAttribute('cx', n.x);
      circle.setAttribute('cy', n.y);
      circle.setAttribute('r',  22);
      circle.setAttribute('fill', color);
      circle.setAttribute('stroke',       isPending ? '#333' : 'transparent');
      circle.setAttribute('stroke-width', '2.5');

      const label = document.createElementNS(ns, 'text');
      label.setAttribute('x', n.x);
      label.setAttribute('y', Number(n.y) + 5);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size',   '14');
      label.setAttribute('font-weight', '700');
      label.setAttribute('fill', '#fff');
      label.setAttribute('pointer-events', 'none'); // clicks pass through to circle
      label.textContent = n.label;

      g.appendChild(circle);
      g.appendChild(label);
      this._bindNodeEvents(g, n, svg);
      svg.appendChild(g);
    });

    // ── Click empty space → add node ─────────────────────────
    svg.addEventListener('click', ev => {
      if (!this.enabled || this.dragMoved) return;
      const pt    = this._toSVGCoords(svg, ev);
      const label = prompt('Node label:', this._nextLabel());
      if (!label) return;
      const id = 'N' + this.nodeCounter++;
      this.graph.nodes.push({
        id,
        label: label.toUpperCase().slice(0, 3),
        x: Math.round(pt.x),
        y: Math.round(pt.y),
      });
      this.onGraphChange();
      this.draw();
      this._log(`Node ${label.toUpperCase()} added.`);
    }, { once: true }); // listener is re-added each draw() call
  }


  /* ----------------------------------------------------------
     PRIVATE — node event binding
  ---------------------------------------------------------- */

  _bindNodeEvents(g, n, svg) {

    // Drag — mousedown
    g.addEventListener('mousedown', ev => {
      if (!this.enabled) return;
      ev.stopPropagation();
      this.dragNode  = n.id;
      this.dragMoved = false;
      const pt       = this._toSVGCoords(svg, ev);
      this.dragOffX  = pt.x - n.x;
      this.dragOffY  = pt.y - n.y;
      g.style.cursor = 'grabbing';
    });

    // Edge creation — click
    g.addEventListener('click', ev => {
      if (!this.enabled || this.dragMoved) return;
      ev.stopPropagation();

      if (this.pendingEdge === null) {
        this.pendingEdge = n.id;
        this.draw();
        this._log(`Selected ${n.label} — click another node to connect.`);

      } else if (this.pendingEdge === n.id) {
        this.pendingEdge = null;
        this.draw();
        this._log('Selection cancelled.');

      } else {
        const alreadyConnected = this.graph.edges.some(
          e => (e.from === this.pendingEdge && e.to === n.id) ||
               (e.from === n.id && e.to === this.pendingEdge)
        );

        if (alreadyConnected) {
          this._log('These nodes are already connected.');
        } else {
          const costStr = prompt(`Edge cost: ${this.pendingEdge} ↔ ${n.label}`, '1');
          if (costStr !== null) {
            this.graph.edges.push({
              from: this.pendingEdge,
              to:   n.id,
              cost: Math.max(1, parseInt(costStr) || 1),
            });
            this.onGraphChange();
            this._log(`Edge ${this.pendingEdge} ↔ ${n.label} added.`);
          }
        }
        this.pendingEdge = null;
        this.draw();
      }
    });

    // Context menu — right-click
    g.addEventListener('contextmenu', ev => {
      if (!this.enabled) return;
      ev.preventDefault();
      ev.stopPropagation();
      this.ctxTarget = n.id;
      const menu = document.getElementById('ge-ctx-menu');
      menu.style.display = 'block';
      menu.style.left    = ev.clientX + 4 + 'px';
      menu.style.top     = ev.clientY + 4 + 'px';
    });
  }


  /* ----------------------------------------------------------
     PRIVATE — global mouse events (drag move/up)
  ---------------------------------------------------------- */

  _bindGlobalEvents() {
    const svg = document.getElementById(this.svgId);

    svg.addEventListener('mousemove', ev => {
      if (!this.dragNode) return;
      this.dragMoved    = true;
      const pt          = this._toSVGCoords(svg, ev);
      const node        = this._node(this.dragNode);
      if (!node) return;
      // Clamp to viewBox with 25px padding
      node.x = Math.max(25, Math.min(655, Math.round(pt.x - this.dragOffX)));
      node.y = Math.max(25, Math.min(375, Math.round(pt.y - this.dragOffY)));
      this.draw();
    });

    svg.addEventListener('mouseup', () => { this.dragNode = null; });

    document.addEventListener('click', () => this._hideCtxMenu());
  }


  /* ----------------------------------------------------------
     PRIVATE — context menu: inject HTML + wire buttons
  ---------------------------------------------------------- */

  _injectContextMenu() {
    if (document.getElementById('ge-ctx-menu')) return; // already injected

    const menu = document.createElement('div');
    menu.id        = 'ge-ctx-menu';
    menu.className = 'ge-ctx-menu';
    menu.style.display = 'none';
    menu.innerHTML = `
      <button class="ge-ctx-item" id="ge-ctx-start">🟢 Set as Start</button>
      <button class="ge-ctx-item" id="ge-ctx-goal">🔴 Set as Goal</button>
      <hr class="ge-ctx-divider">
      <button class="ge-ctx-item ge-ctx-danger" id="ge-ctx-delete">🗑 Delete node</button>
    `;
    document.body.appendChild(menu);

    document.getElementById('ge-ctx-start').addEventListener('click', () => {
      if (this.ctxTarget) {
        this.graph.start = this.ctxTarget;
        this.onGraphChange();
        this._log(`Start → ${this.ctxTarget}`);
        this.draw();
      }
      this._hideCtxMenu();
    });

    document.getElementById('ge-ctx-goal').addEventListener('click', () => {
      if (this.ctxTarget) {
        this.graph.goal = this.ctxTarget;
        this.onGraphChange();
        this._log(`Goal → ${this.ctxTarget}`);
        this.draw();
      }
      this._hideCtxMenu();
    });

    document.getElementById('ge-ctx-delete').addEventListener('click', () => {
      if (this.ctxTarget) {
        this.graph.nodes = this.graph.nodes.filter(n => n.id !== this.ctxTarget);
        this.graph.edges = this.graph.edges.filter(
          e => e.from !== this.ctxTarget && e.to !== this.ctxTarget
        );
        if (this.graph.start === this.ctxTarget) this.graph.start = this.graph.nodes[0]?.id;
        if (this.graph.goal  === this.ctxTarget) this.graph.goal  = this.graph.nodes[this.graph.nodes.length - 1]?.id;
        this.pendingEdge = null;
        this.onGraphChange();
        this._log(`Node ${this.ctxTarget} deleted.`);
        this.draw();
      }
      this._hideCtxMenu();
    });
  }


  /* ----------------------------------------------------------
     PRIVATE — inject component CSS once into <head>
  ---------------------------------------------------------- */

  _injectStyles() {
    if (document.getElementById('ge-styles')) return;
    const style = document.createElement('style');
    style.id = 'ge-styles';
    style.textContent = `
      .ge-ctx-menu {
        position: fixed;
        background: #fff;
        border: 1.5px solid #E0D9CF;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        padding: 0.35rem;
        z-index: 999;
        min-width: 160px;
      }
      .ge-ctx-item {
        display: block;
        width: 100%;
        padding: 0.45rem 0.85rem;
        background: none;
        border: none;
        border-radius: 4px;
        font-size: 0.85rem;
        text-align: left;
        cursor: pointer;
        color: #1A1A1A;
        font-family: inherit;
      }
      .ge-ctx-item:hover  { background: #F7F3EC; }
      .ge-ctx-danger      { color: #DC2626; }
      .ge-ctx-danger:hover{ background: #FEF2F2; }
      .ge-ctx-divider     { border: none; border-top: 1px solid #E0D9CF; margin: 0.25rem 0; }
    `;
    document.head.appendChild(style);
  }


  /* ----------------------------------------------------------
     PRIVATE — utilities
  ---------------------------------------------------------- */

  _node(id)    { return this.graph.nodes.find(n => n.id === id); }
  _hideCtxMenu() { const m = document.getElementById('ge-ctx-menu'); if (m) m.style.display = 'none'; }
  _log(msg)    { const el = document.getElementById(this.logId); if (el) el.textContent = msg; }

  _toSVGCoords(svg, e) {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  _nextLabel() {
    // Suggest next unused letter: A, B, C, ...
    const used = new Set(this.graph.nodes.map(n => n.label));
    for (let i = 0; i < 26; i++) {
      const l = String.fromCharCode(65 + i);
      if (!used.has(l)) return l;
    }
    return 'N' + this.nodeCounter;
  }
}
