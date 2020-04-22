const path = require('path');
const fs = require('fs');

const paramas = process.argv.slice(2);

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

// const generatePseudorandomeNumbers = ({ a, c, x, m }) => {
//   try {
//     let randomeNumbers = [x];

//     for (let i = 0; i < +paramas[5]; i++) {
//       const pseudoNumber = (a * randomeNumbers[i] + c) % m;
//       randomeNumbers.push(pseudoNumber);
//     }

//     return randomeNumbers.slice(1);
//   } catch (error) {
//     console.log(error);
//     return;
//   }
// };

const sortNumbers = (numbers) => {
  return numbers.sort((current, previous) => current - previous);
};

const printNumbers = (numbers) => {
  try {
    console.table(numbers);
  } catch (error) {
    console.log(error);
  }
};

const writeFile = (data, fileName) => {
  let route = path.join(__dirname, `Files/${fileName}.json`);
  let json = JSON.stringify(data);
  let fileExits = fs.existsSync(route);
  if (fileExits) fs.unlinkSync(route);
  fs.writeFileSync(route, json, 'utf8');
};

const prubeaPromedios = () => {
  try {
    const PRN = readFile('pseudoNumbers'); // [0.3468,0.027,0.29,0.41,0.81,0.61,0.21,0.41];
    const sumatoria = PRN.reduce((sum, currentValue) => sum + currentValue);
    const N = PRN.length;
    const promedio = sumatoria / N;
    const ZAlpha = 1.96;

    const Zo = Math.abs(((promedio - 0.5) * Math.sqrt(N)) / Math.sqrt(1 / 12));

    const LI = 0.5 - ZAlpha * (1 / Math.sqrt(12 * N));
    const LH = 0.5 + ZAlpha * (1 / Math.sqrt(12 * N));

    // console.log('raiz 1/12:', Math.sqrt(1 / 12));
    // console.log('raiz N:', Math.sqrt(PRN.length));

    // console.log('Sumatoria:', sumatoria);
    // console.log('Cantidad:', N);
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

const pruebaFrecuencias = () => {
  try {
    const PRN = [
      0.7896,
      0.0523,
      0.107,
      0.5588,
      0.1415,
      0.7609,
      0.1208,
      0.2774,
      0.6573,
      0.7927,
      0.8055,
      0.8265,
      0.2945,
      0.2085,
      0.4299,
      0.5852,
      0.9861,
      0.3449,
      0.3436,
      0.1154,
      0.899,
      0.5788,
      0.6762,
      0.0501,
      0.0012,
      0.2827,
      0.7306,
      0.7012,
      0.1828,
      0.4996,
      0.3862,
      0.7691,
      0.6833,
      0.5517,
      0.1085,
      0.7998,
      0.4568,
      0.2163,
      0.8762,
      0.5574,
      0.5896,
      0.3322,
      0.0319,
      0.6117,
      0.0926,
      0.6962,
      0.1703,
      0.0548,
      0.9151,
      0.7626,
      0.2993,
      0.3086,
      0.8336,
      0.5178,
      0.0327,
      0.5741,
      0.2659,
      0.859,
      0.4331,
      0.3529,
      0.24,
      0.6556,
      0.3851,
      0.9083,
      0.9419,
      0.9365,
      0.8881,
      0.8177,
      0.3698,
      0.199,
      0.5433,
      0.624,
      0.0913,
      0.4168,
      0.3395,
      0.5824,
      0.8585,
      0.8875,
      0.3373,
      0.1551,
      0.2395,
      0.5356,
      0.3338,
      0.4938,
      0.751,
      0.1996,
      0.65,
      0.7458,
      0.7911,
      0.6345,
      0.1915,
      0.4064,
      0.0813,
      0.7343,
      0.2272,
      0.2229,
      0.0728,
      0.6418,
      0.4427,
      0.721,
    ]; //readFile('pseudoNumbers'); // [0.3468,0.027,0.29,0.41,0.81,0.61,0.21,0.41];
    const N = PRN.length;
    const n = 5;
    const intervalos = [];
    const XAlpha = 9.4877;

    for (let i = 0; i < n; i++) {
      intervalos.push({
        intervalo: [i / n, (i + 1) / n],
        fe: N / n,
        fo: 0,
        tag: `n${i + 1}`,
      });
    }

    for (const [index, prn] of PRN.entries()) {
      try {
        for (const [index, n] of intervalos.entries()) {
          try {
            if (
              prn >= intervalos[index].intervalo[0] &&
              prn < intervalos[index].intervalo[1]
            ) {
              intervalos[index].fo += 1;
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
      (sum, current) => sum + Math.pow(current.fo - current.fe, 2) / current.fe,
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

const readFile = (fileName) => {
  const route = path.join(__dirname, `Files/${fileName}.json`);
  const rawdata = fs.readFileSync(route);
  return JSON.parse(rawdata);
};

// const pseudoNumbers = generatePseudorandomeNumbers({
//   a: +paramas[0],
//   c: +paramas[1],
//   x: +paramas[2],
//   m: +paramas[3],
// });

// printNumbers(pseudoNumbers);
// writeFile(sortNumbers(pseudoNumbers), paramas[4]);
// prubeaPromedios();
pruebaFrecuencias();
