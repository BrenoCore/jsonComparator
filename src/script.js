function compareKeysDeeply(obj1, obj2, path = []) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = new Set([...keys1, ...keys2]);
  let differences = [];

  for (const key of allKeys) {
    const newPath = [...path, key];

    if (!Object.prototype.hasOwnProperty.call(obj1, key) || !Object.prototype.hasOwnProperty.call(obj2, key)) {
      console.log(newPath)
      differences.push(newPath.join('.'));
    } else {
      const val1 = obj1[key];
      const val2 = obj2[key];

      if (typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null) {
        differences = differences.concat(compareKeysDeeply(val1, val2, newPath));
      }
    }
  }

  return differences;
}

function compareObjects() {
  const obj1 = JSON.parse(document.getElementById('object1').value);
  const obj2 = JSON.parse(document.getElementById('object2').value);
  const differences = compareKeysDeeply(obj1, obj2);
  const differencesText = differences.length > 0 ? `Differences: ${differences.join(', ')}` : 'Objects are equal';
  document.getElementById('differences').innerHTML = differencesText;
}

document.getElementById('object1').addEventListener('input', compareObjects);
document.getElementById('object2').addEventListener('input', compareObjects);