const path = require('path');
const fs = require('fs');

const paramsList = process.argv.slice(2);
const task = paramsList[0];

const init = (task, params) => {
  switch (task) {
    case 'prueba-frecuencias':
      pruebaFrecuencias(...convertToNumber(params.slice(1)));
      break;
    case 'prueba-promedios':
      prubeaPromedios(...convertToNumber(params.slice(1)));
      break;
    case 'generar-numeros':
      generadorPseudoaleatorio(...convertToNumber(params.slice(1)));
      break;
    case 'prueba-distancias':
      pruebaDistancias(...convertToNumber(params.slice(1)));
      break;
    case 'prueba-varianza':
      pruebaVarianza();
      break;
    default:
      console.log('Por favor ingrese una tarea válida');
      break;
  }
};

const generadorPseudoaleatorio = (a, c, x, m, fileName) => {
  try {
    console.log(
      'generadorPseudoaleatorio -> a, c, x, m, fileName',
      a,
      c,
      x,
      m,
      fileName
    );
    const pseudoNumbers = generatePseudorandomeNumbers({ a, c, x, m });
    writeFile(sortNumbers(pseudoNumbers), fileName);
  } catch (error) {
    console.log(error);
  }
};

const generatePseudorandomeNumbers = ({ a, c, x, m }) => {
  try {
    let randomeNumbers = [x];
    let index = 0;

    let pseudoNumber = (a * randomeNumbers[index] + c) % m;

    while (!randomeNumbers.slice(1).includes(pseudoNumber)) {
      randomeNumbers.push(pseudoNumber);
      pseudoNumber = (a * randomeNumbers[++index] + c) % m;
      console.log('index:', index);
    }

    console.log('Done');
    return randomeNumbers.slice(1);
  } catch (error) {
    console.log(error);
    return;
  }
};

const sortNumbers = (numbers) => {
  return numbers.sort((current, previous) => current - previous);
};

// const printNumbers = (numbers) => {
//   try {
//     console.table(numbers);
//   } catch (error) {
//     console.log(error);
//   }
// };

const writeFile = (data, fileName) => {
  let route = path.join(__dirname, `Files/${fileName}.json`);
  let json = JSON.stringify(data);
  let fileExits = fs.existsSync(route);
  if (fileExits) fs.unlinkSync(route);
  fs.writeFileSync(route, json, 'utf8');
};

const prubeaPromedios = (u, ZAlpha) => {
  try {
    const PRN = readFile('pseudoNumbers');
    /* [
      0.3468,
      0.027,
      0.29,
      0.41,
      0.81,
      0.61,
      0.21,
      0.41,
    ]; */
    const sumatoria = PRN.reduce((sum, currentValue) => sum + currentValue);
    const N = PRN.length;
    const promedio = sumatoria / N;

    const Zo = Math.abs(((promedio - u) * Math.sqrt(N)) / Math.sqrt(1 / 12));

    const LI = u - ZAlpha * (1 / Math.sqrt(12 * N));
    const LH = u + ZAlpha * (1 / Math.sqrt(12 * N));

    console.log('Promedio:', promedio);
    console.log('Estadístico de prueba:', Zo);
    console.log('Limit Low:', LI);
    console.log('Limit High:', LH);

    if (LI <= promedio && promedio <= LH)
      console.log('Por límites, los NSA están uniformemente distribuidos');
    else
      console.log('Por límites, los NSA no están uniformemente distribuidos');

    if (Zo < ZAlpha)
      console.log(
        'Por estadístico de prueba, los NSA están uniformemente distribuidos'
      );
    else
      console.log(
        'Por estadístico de prueba, los NSA no están uniformemente distribuidos'
      );
  } catch (error) {
    console.log(error);
  }
};

const pruebaFrecuencias = (n, XAlpha) => {
  try {
    const PRN = readFile('pseudoNumbers'); // [0.3468,0.027,0.29,0.41,0.81,0.61,0.21,0.41];
    const N = PRN.length;
    const intervalos = [];

    for (let i = 0; i < n; i++) {
      intervalos.push({
        intervalo: [i / n, (i + 1) / n],
        fei: N / n,
        foi: 0,
        tag: `n${i + 1}`,
      });
    }

    for (const [indexI, prn] of PRN.entries()) {
      try {
        for (const [index] of intervalos.entries()) {
          try {
            if (
              prn >= intervalos[index].intervalo[0] &&
              prn < intervalos[index].intervalo[1]
            ) {
              intervalos[index].foi += 1;
            }
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    const Xo = intervalos.reduce(
      (sum, current) =>
        sum + Math.pow(current.foi - current.fei, 2) / current.fei,
      0
    );

    console.table(intervalos);
    console.log('Estadístico de prueba:', Xo);
    console.log('Estadístico de chi cuadrado:', XAlpha);

    if (Xo < XAlpha)
      console.log(
        'Por chi cuadrado, los NSA están uniformemente distribuidos y es independiente'
      );
    else
      console.log(
        'Por chi cuadrado, los NSA no están uniformemente distribuidos'
      );
  } catch (error) {
    console.log(error);
  }
};

const pruebaDistancias = (alpha, beta, n) => {
  try {
    const PRN = readFile('psuedoDump');

    const tetha = beta - alpha;
    let huecos = [];
    let pi;

    const indexes = PRN.map(
      (prn, index) => prn >= alpha && prn <= beta && index
    ).filter((prn) => prn);

    for (let i = 0; i <= n; i++) {
      if (i >= n) pi = Math.pow(1 - tetha, n);
      else pi = tetha * Math.pow(1 - tetha, i);

      huecos[i] = {
        pi,
        fei: (indexes.length - 1) * pi,
        tag: `p${i}`,
      };
    }

    console.table(huecos);
    console.table(indexes);
    console.log(
      'pi:',
      huecos.reduce((sum, obj) => sum + obj.pi, 0)
    );
    console.log(
      'fei:',
      huecos.reduce((sum, obj) => sum + obj.fei, 0)
    );
  } catch (error) {
    console.log(error);
  }
};

const pruebaVarianza = () => {
  try {
    const PRN = readFile('psuedoDump');
    const N = PRN.length;

    const promedio = PRN.reduce((sum, currentValue) => sum + currentValue) / N;

    const varianza = PRN.reduce(
      (sum, currentValue) =>
        sum + Math.pow(currentValue - promedio, 2) / (N - 1),
      0
    );
    
    const LI = 132.2554 / (12 * (N - 1));
    const LH = 74.2219 / (12 * (N - 1));

    console.log('Varianza', varianza);
    console.log('Limit low', LI);
    console.log('Limit High', LH);

    if (LI <= varianza && varianza <= LH)
      console.log('Por límites, los NSA están uniformemente distribuidos');
    else
      console.log('Por límites, los NSA no están uniformemente distribuidos');
  } catch (error) {
    console.log(error);
  }
};

const readFile = (fileName) => {
  const route = path.join(__dirname, `Files/${fileName}.json`);
  const rawdata = fs.readFileSync(route);
  return JSON.parse(rawdata);
};

const convertToNumber = (data) => {
  return data.map((item) => (!isNaN(+item) ? +item : item));
};

init(task, paramsList);
