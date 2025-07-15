fetch('datamalla')
  .then(res => res.json())
  .then(malla => {
    const aprobados = new Set();
    const cont = document.getElementById('malla');
    const contador = document.getElementById('contador');
    const niveles = [...new Set(malla.map(c => c.semestre))].sort((a, b) => a - b);

    niveles.forEach(nivel => {
      const section = document.createElement('div');
      section.className = 'semestre';
      section.innerHTML = `<h2>Semestre ${nivel}</h2>`;

      malla.filter(curso => curso.semestre === nivel).forEach(curso => {
        const div = document.createElement('div');
        div.className = 'curso';
        div.id = curso.codigo;
        div.textContent = `${curso.codigo} - ${curso.nombre} (${curso.creditos} cr)`;

        div.onclick = () => {
          if (!div.classList.contains('unlocked')) return;

          if (aprobados.has(curso.codigo)) {
            aprobados.delete(curso.codigo);
            div.classList.remove('approved');
          } else {
            aprobados.add(curso.codigo);
            div.classList.add('approved');
          }
          actualizar();
        };

        section.appendChild(div);
      });

      cont.appendChild(section);
    });

    function actualizar() {
      malla.forEach(curso => {
        const puede = curso.req.every(r => aprobados.has(r));
        const el = document.getElementById(curso.codigo);
        if (puede) el.classList.add('unlocked');
        else {
          el.classList.remove('unlocked');
          el.classList.remove('approved');
          aprobados.delete(curso.codigo);
        }
      });

      let totalCreditos = 0;
      malla.forEach(curso => {
        if (aprobados.has(curso.codigo)) totalCreditos += curso.creditos;
      });
      contador.textContent = `Créditos aprobados: ${totalCreditos}`;
    }

    actualizar();
  });
