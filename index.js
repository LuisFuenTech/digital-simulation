const path = require('path');
const fs = require('fs');
const xlsx = require('node-xlsx');

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
    writeFile(sortNumbers(pseudoNumbers), 'sort_' + fileName);
    writeFile(pseudoNumbers, fileName);

    const r2 = generatePseudorandomeNumbers({ a, c, x: x + 23, m });
    writeFile(r2, fileName + '_r2');

    exportFile(fileName, m);
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

const exportFile = async (fileName, m) => {
  const data = readFile(fileName);
  const r2 = readFile(fileName + '_r2');

  const foo = data.sort(function () {
    return Math.random() - 0.5;
  });

  const fooR2 = r2.sort(function () {
    return Math.random() - 0.5;
  });

  let xlsxData = foo.slice(0, 200).map((item, index, arr) => {
    const info = {
      R1: arr[index] / m,
      R2: fooR2[index] / m,
    };

    return Array.from(Object.values(info));
  });

  xlsxData.unshift(['R1', 'R2']);

  const buffer = xlsx.build([{ name: 'npa', data: xlsxData }]);

  writeXLSXFile(buffer, 'taller');
};

const writeXLSXFile = async (data, fileName) => {
  let route = path.join(__dirname, `Files/${fileName}.xlsx`);
  let fileExits = fs.existsSync(route);
  if (fileExits) fs.unlinkSync(route);
  fs.writeFileSync(route, data);
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
    const PRN = readFile('psuedoDump');
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

    planeXY.map((item) => item.map((i) => console.log(i)));

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

const pruebaDistancias = (alpha, beta, n, XAlpha) => {
  try {
    const PRN = readFile('pseudoNumbers');

    const tetha = beta - alpha;
    let huecos = [];
    let pi;
    let SumFoi = 0;

    const indexes = PRN.map(
      (prn, index) => prn >= alpha && prn <= beta && index
    ).filter((prn) => prn);

    for (let i = 0; i <= n; i++) {
      if (i >= n) pi = Math.pow(1 - tetha, n);
      else pi = tetha * Math.pow(1 - tetha, i);

      huecos[i] = {
        pi,
        i,
        tag: `p${i}`,
        foi: 0,
      };
    }

    for (let i = 0; i < indexes.length - 1; i++) {
      let hole = indexes[i + 1] - indexes[i] - 1;

      for (let j = 0; j <= n; j++) {
        if (hole === j) {
          huecos[j].foi += 1;
          SumFoi++;
        }
      }

      if (hole > n) {
        huecos[n].foi += 1;
        SumFoi++;
      }
    }

    huecos.map(
      (item, index) => (huecos[index].fei = SumFoi * huecos[index].pi)
    );

    console.table(huecos);
    const Xo = huecos.reduce(
      (sum, curr) => sum + Math.pow(curr.foi - curr.fei, 2) / curr.fei,
      0
    );

    console.log('Xo:', Xo, 'Indexes:', indexes.length);

    if (Xo < XAlpha)
      console.log(
        'Por chi cuadrado, los NSA están uniformemente distribuidos y es independiente'
      );
    else
      console.log(
        'Por chi cuadrado, los NSA no están uniformemente distribuidos y es independiente'
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
