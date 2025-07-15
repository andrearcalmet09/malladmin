
fetch('data/malla.json')
  .then(res => res.json())
  .then(malla => {
    const aprobados = new Set();
    const cont = document.getElementById('malla');
    const contador = document.getElementById('contador');
    const niveles = [...new Set(malla.map(c => c.semestre))].sort((a, b) => a - b);

    niveles.forEach(n => {
      const sec = document.createElement('div');
      sec.className = 'semestre';
      sec.innerHTML = `<h2>Nivel ${n}</h2>`;
      malla.filter(c => c.semestre === n).forEach(c => {
        const btn = document.createElement('div');
        btn.className = 'curso';
        btn.id = c.codigo;
        btn.textContent = `${c.codigo} - ${c.nombre} (${c.creditos} cr)`;
        btn.onclick = () => {
          if (!btn.classList.contains('unlocked')) return;
          if (aprobados.has(c.codigo)) {
            aprobados.delete(c.codigo);
            btn.classList.remove('approved');
          } else {
            aprobados.add(c.codigo);
            btn.classList.add('approved');
          }
          actualizar();
        };
        sec.appendChild(btn);
      });
      cont.appendChild(sec);
    });

    function actualizar() {
      malla.forEach(c => {
        const el = document.getElementById(c.codigo);
        const puede = c.req.every(r => aprobados.has(r));
        if (puede) el.classList.add('unlocked');
        else {
          el.classList.remove('unlocked');
          if (aprobados.has(c.codigo)) {
            aprobados.delete(c.codigo);
            el.classList.remove('approved');
          }
        }
      });

      // Calcular créditos
      let totalCreditos = 0;
      malla.forEach(c => {
        if (aprobados.has(c.codigo)) totalCreditos += c.creditos || 0;
      });
      contador.textContent = `Créditos aprobados: ${totalCreditos}`;
    }

    actualizar();
  });
