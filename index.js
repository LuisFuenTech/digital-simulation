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
    case 'prueba-ks':
      pruebaKolmogorov(...convertToNumber(params.slice(1)));
      break;
    case 'prueba-series':
      pruebaSeries(...convertToNumber(params.slice(1)));
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

const pruebaKolmogorov = (DAlpha) => {
  try {
    const PRN = readFile('pseudoNumbers');
    let PRNList = [];
    let positive = [];
    let negative = [];
    const sortedPRN = sortNumbers(PRN);
    const N = sortedPRN.length;

    for (let i = 0; i < N; i++) {
      const fn = (i + 1) / N;
      const xi = sortedPRN[i];
      const left = Math.abs(fn - xi);
      const right = Math.abs(xi - (i + 1 - 1) / N);

      PRNList.push({
        fn,
        xi,
        left,
        right,
      });

      positive.push(left);
      negative.push(right);
    }

    console.table(PRNList);

    const DNpositive = Math.max(...positive.map((number) => Math.abs(number)));
    const DNNegative = Math.max(...negative.map((number) => Math.abs(number)));
    const DN = Math.max(DNpositive, DNNegative);

    console.log('DN left', DNpositive);
    console.log('DN right', DNNegative);
    console.log('DN:', DN);
    console.log('DAlpha:', DAlpha);

    if (DN <= DAlpha)
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

const pruebaSeries = (n) => {
  try {
    // const numbers = [
    //   8,
    //   5,
    //   4,
    //   5,
    //   2,
    //   5,
    //   2,
    //   4,
    //   6,
    //   4,
    //   2,
    //   4,
    //   0,
    //   2,
    //   5,
    //   3,
    //   3,
    //   1,
    //   7,
    //   5,
    //   6,
    //   4,
    //   4,
    //   0,
    //   8,
    // ];

    // const X =
    //   (Math.pow(n, 2) / 99) *
    //   numbers.reduce((sum, cur) => sum + Math.pow(cur - 3.96, 2), 0);

    // console.log('square:', Math.pow(n, 2) / 99);
    // console.log(
    //   'sum:',
    //   numbers.reduce((sum, cur) => sum + Math.pow(cur - 3.96, 2), 0)
    // );
    // console.log('X:', X);

    const PRN = readFile('pseudoNumbers');
    let planeXY = [];
    let aux = [];
    let pairs = [];
    const N = PRN.length;
    const fe = (N - 1) / Math.pow(n, 2);
    let total = 0;
    let Xo = 0;
    const XAlpha = 36.415;

    for (let i = 0; i < N - 1; i++) {
      pairs.push([PRN[i], PRN[i + 1]]);
    }

    let count = 0;

    console.log(planeXY.length, 'plane');

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= n; j++) {
        count++;
        aux.push({ x: j / n, y: i / n, fe, fo: 0 });
      }
      planeXY.push(aux);
      aux = [];
    }

    for (let i = 0; i < pairs.length; i++) {
      for (let j = 0; j < planeXY.length; j++) {
        planeXY[j].map((pair, index) => {
          const x = pairs[i][0];
          const y = pairs[i][1];
          const inX = pair.x;
          const inY = pair.y;

          if (inX - 0.2 <= x && x < inX && inY - 0.2 <= y && y < inY) {
            planeXY[j][index].fo += 1;
            console.log(planeXY[j][index]);
            console.log(
              `x:${x} - y: ${y} === pair.x: ${pair.x} - pair.y:${pair.y}. i=${i}`
            );
            console.log('=======================================');
          }
        });
      }
    }

    for (const data of planeXY) {
      total += data.reduce((sum, curr) => sum + curr.fo, 0);
      Xo += data.reduce((sum, curr) => sum + Math.pow(curr.fo - curr.fe, 2), 0);
    }

    const final = (Math.pow(n, 2) / (N - 1)) * Xo;

    console.log(
      planeXY.length,
      'plane',
      'total:',
      total,
      'Xo:',
      Xo,
      'Xo final:',
      final
    );
    console.log(planeXY);

    console.log(count);

    // console.table(pairs);
    console.log('total:', pairs.length);
    writeFile(pairs, 'pairs');
    writeFile(planeXY, 'XY');
    console.table(planeXY);

    if (final < XAlpha)
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
    const PRN = readFile('pseudoNumbers');
    const N = PRN.length;

    const promedio = PRN.reduce((sum, currentValue) => sum + currentValue) / N;

    const varianza = PRN.reduce(
      (sum, currentValue) =>
        sum + Math.pow(currentValue - promedio, 2) / (N - 1),
      0
    );

    const LI = 132.2554 / (12 * (N - 1));
    const LH = 74.2219 / (12 * (N - 1));

    console.log('Promedio:', promedio);
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
