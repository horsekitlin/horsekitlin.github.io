var fetch = require('node-fetch');

function main() {
  const uids = [4, 5, 6, 7, 8, 9, 10];
  const processes = uids.map((uid, index) => {
    if (index === 3) {
      return Promise.reject(new Error(`Hello Error ${index}`));
    }
    return fetch(`https://graph.facebook.com/${uid}?fields=id,name&access_token=1573834372888743|kwOadcjpVBhyNj5_r_m_Teffb3Y`).then(resp => resp.json());
  });
  Promise.all(processes)
    .then(results => console.log(`results: ${JSON.stringify(results)}`))
    .catch(error => {
      console.log(error);
      return false
    });
}

main();