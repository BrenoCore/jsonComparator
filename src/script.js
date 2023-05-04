const deepKeyComparison = (obj1, obj2, path = []) => {
  const keys1 = obj1 ? Object.keys(obj1) : [];
  const keys2 = obj2 ? Object.keys(obj2) : [];
  const allKeys = new Set([...keys1, ...keys2]);
  let differences = { obj1Diff: [], obj2Diff: [] };
  const sortedKeys = Array.from(allKeys).sort();
  for (const key of sortedKeys) {
    const newPath = [...path, key];
    if (!obj1?.hasOwnProperty(key) || !obj2?.hasOwnProperty(key)) {
      const missingIn = !obj1?.hasOwnProperty(key) ? "obj1Diff" : "obj2Diff";
      differences[missingIn].push(newPath.join("."));
    } else {
      const val1 = obj1[key];
      const val2 = obj2[key];
      if (typeof val1 === "object" || typeof val2 === "object") {
        const nestedDifferences = deepKeyComparison(val1, val2, newPath);
        differences.obj1Diff.push(...nestedDifferences.obj1Diff);
        differences.obj2Diff.push(...nestedDifferences.obj2Diff);
      }
    }
  }
  return differences;
};

const compareObjects = () => {
  const { obj1, obj2 } = getObjects();
  if (obj1 && obj2) {
    saveObject("object1", obj1);
    saveObject("object2", obj2);
    const { obj1Diff, obj2Diff } = deepKeyComparison(obj1, obj2);
    setResult("result1", obj1Diff);
    setResult("result2", obj2Diff);
  }
};

const setResult = (result, differences) => {
  const resultElement = document.getElementById(result);
  hideResult(result, false);
  if (differences.length) {
    resultElement.innerHTML = `Missing:<br>${differences.join("<br>")}`;
    resultElement.classList.remove("no-missing");
  } else {
    resultElement.innerHTML = "No missing keys";
    resultElement.classList.add("no-missing");
  }
};

const hideResult = (result, hide) => {
  const resultElement = document.getElementById(result);
  if (hide) {
    resultElement.setAttribute("hidden", true);
  } else {
    resultElement.removeAttribute("hidden");
  }
};

const getObjects = () => {
  const obj1Value = document.getElementById("object1").value;
  const obj2Value = document.getElementById("object2").value;
  const warning1 = document.getElementById("warning1");
  const warning2 = document.getElementById("warning2");
  const obj1 = validateObject(obj1Value, warning1, "result1");
  const obj2 = validateObject(obj2Value, warning2, "result2");
  return { obj1, obj2 };
};

const validateObject = (object, warning, result) => {
  if (object) {
    try {
      const parsedObject = JSON.parse(object);
      warning.style.visibility = "hidden";
      return parsedObject;
    } catch (e) {
      hideResult(result, true);
      warning.style.visibility = "visible";
      return;
    }
  } else {
    hideResult(result, true);
    warning.style.visibility = "hidden";
    return;
  }
};

const loadObjects = () => {
  const obj1 = getObject("object1");
  const obj2 = getObject("object2");
  if (obj1)
    document.getElementById("object1").value = JSON.stringify(obj1, null, 2);
  if (obj2)
    document.getElementById("object2").value = JSON.stringify(obj2, null, 2);
  compareObjects();
};

const saveObject = (key, obj) => localStorage.setItem(key, JSON.stringify(obj));

const getObject = (key) => {
  const objStr = localStorage.getItem(key);
  return objStr ? JSON.parse(objStr) : null;
};

const enableDarkMode = (enabled) => {
  document.body.className = enabled ? "dark-theme" : "";
  localStorage.setItem("darkMode", enabled);
};

const loadTheme = () => {
  const isDarkModeStored = localStorage.getItem("darkMode");
  const isDarkMode =
    isDarkModeStored === null ? true : isDarkModeStored === "true";
  const darkModeToggle = document.getElementById("darkModeToggle");
  enableDarkMode(isDarkMode);
  darkModeToggle.checked = isDarkMode;
};

document.getElementById("darkModeToggle").addEventListener("change", (e) => {
  const isDarkMode = e.target.checked;
  enableDarkMode(isDarkMode);
});

document.getElementById("object1").addEventListener("input", compareObjects);
document.getElementById("object2").addEventListener("input", compareObjects);

loadTheme();
loadObjects();
