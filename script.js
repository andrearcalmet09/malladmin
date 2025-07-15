fetch('datamalla')
  .then(response => response.json())
  .then(data => {
    const malla = document.getElementById('malla');
    const estadoCursos = {};

    function puedeActivarse(curso) {
      return curso.prerequisitos.every(id => estadoCursos[id]);
    }

    data.forEach((semestre, i) => {
      const semDiv = document.createElement('div');
      semDiv.className = 'semestre';

      const titulo = document.createElement('h2');
      titulo.textContent = `Semestre ${i + 1}`;
      semDiv.appendChild(titulo);

      semestre.forEach(curso => {
        const cursoDiv = document.createElement('div');
        cursoDiv.className = `curso ${curso.tipo}`;
        cursoDiv.textContent = `${curso.nombre} (${curso.creditos} cr)`;
        cursoDiv.dataset.id = curso.id;

        if (!puedeActivarse(curso)) {
          cursoDiv.classList.add('bloqueado');
        }

        cursoDiv.addEventListener('click', () => {
          cursoDiv.classList.toggle('seleccionado');
          estadoCursos[curso.id] = cursoDiv.classList.contains('seleccionado');

          document.querySelectorAll('.curso').forEach(el => {
            const id = el.dataset.id;
            const cursoOriginal = data.flat().find(c => c.id === id);
            if (!cursoOriginal) return;

            if (!puedeActivarse(cursoOriginal) && !estadoCursos[id]) {
              el.classList.add('bloqueado');
            } else {
              el.classList.remove('bloqueado');
            }
          });
        });

        semDiv.appendChild(cursoDiv);
      });

      malla.appendChild(semDiv);
    });
  });
