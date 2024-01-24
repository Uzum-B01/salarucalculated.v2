document.addEventListener("DOMContentLoaded", function () {
  var inputFields = document.querySelectorAll(
    'input[type="number"], input[type="text"]'
  );
  inputFields.forEach(function (field) {
    field.addEventListener("input", calculate);
  });

  calculate(); // Инициализация расчета при загрузке страницы
});

function roundUpToNearestThousand(number) {
  return Math.ceil(number / 1000) * 1000;
}
function formatNumber(number) {
  return number.toLocaleString("ru-RU");
}

function toPercentage(number) {
  return (number * 100).toFixed(0) + "%"; // Форматирует число с двумя знаками после запятой и добавляет '%'
}

function calculate() {
  var normHours = parseFloat(document.getElementById("normHours").value) || 0;
  var workedHours =
    parseFloat(document.getElementById("workedHours").value) || 0;
  var ordersCount =
    parseFloat(document.getElementById("ordersCount").value) || 0;
  var limitsCount =
    parseFloat(document.getElementById("limitsCount").value) || 0;
  var planCompletion =
    parseFloat(document.getElementById("planCompletion").value) || 0;
  var vchlScore = parseFloat(document.getElementById("vchlScore").value) || 0;
  var city = document.getElementById("myInput").value;
  var simCards = parseFloat(document.getElementById("simCards").value) || 0;
  var ucellCooperation = document.getElementById("ucellCooperation").value;
  var changesCount =
    parseFloat(document.getElementById("changesCount").value) || 0;
  var changesPlan =
    parseFloat(document.getElementById("changesPlan").value) || 0;
  var testScore = parseFloat(document.getElementById("testScore").value) || 0;
  var region = calculateRegion(city);
  var grade = calculateGrade(city);
  var salaryRate = getSalaryByGrade(grade);
  var vchlGreyd = getVCHLByGrade(ordersCount, region);
  var limitsGreyd = getLimitsByGrade(limitsCount, region);
  var maxPrice = getMaxPrice(ucellCooperation, limitsGreyd);
  var startPrice = getStartPrice(ucellCooperation, limitsGreyd);
  var vchlPrice = getVCHLPrice(vchlGreyd);
  var simPrice = getSimPrice(simCards);

  var startCompletion = changesCount / changesPlan;
  var maxCompletion = limitsCount / planCompletion;
  var startSalary = 0;
  var maxSalary = 0;
  var totalSalary = 0;

  limitsPlan = limitsCount * 2 + changesCount;

  if (ucellCooperation === "Нет") {
    simPrice = simPrice;
  } else {
    simPrice = 0;
  }

  if (testScore >= 75) {
    penalty = 0;
  } else if (testScore > 0) {
    penalty = 200000;
  }

  if (startCompletion > 1.5) {
    startSalary =
      1.1 * 1 +
      (1.3 - 1.1) * 0.75 +
      (1.5 - 1.3) * 0.5 +
      (startCompletion - 1.5) * 0.25;
  } else if (startCompletion >= 1.31) {
    startSalary = 1.1 * 1 + (1.3 - 1.1) * 0.75 + (startCompletion - 1.3) * 0.5;
  } else if (startCompletion >= 1.11) {
    startSalary = 1.1 * 1 + (startCompletion - 1.1) * 0.75;
  } else if (startCompletion >= 0.91) {
    startSalary = startCompletion * 1;
  } else if (startCompletion >= 0.71) {
    startSalary = startCompletion * 0.9;
  } else if (startCompletion >= 0.51) {
    startSalary = startCompletion * 0.7;
  } else if (startCompletion <= 0.5) {
    startSalary = startCompletion * 0.5;
  }

  if (maxCompletion > 1.5) {
    maxSalary =
      1.1 * 1 +
      (1.3 - 1.1) * 0.75 +
      (1.5 - 1.3) * 0.5 +
      (maxCompletion - 1.5) * 0.25;
  } else if (maxCompletion >= 1.31) {
    maxSalary = 1.1 * 1 + (1.3 - 1.1) * 0.75 + (maxCompletion - 1.3) * 0.5;
  } else if (maxCompletion >= 1.11) {
    maxSalary = 1.1 * 1 + (maxCompletion - 1.1) * 0.75;
  } else if (maxCompletion >= 0.91) {
    maxSalary = maxCompletion * 1;
  } else if (maxCompletion >= 0.71) {
    maxSalary = maxCompletion * 0.9;
  } else if (maxCompletion >= 0.51) {
    maxSalary = maxCompletion * 0.7;
  } else if (maxCompletion <= 0.5) {
    maxSalary = maxCompletion * 0.5;
  }

  if (workedHours > normHours) {
    salaryCost = roundUpToNearestThousand(
      (salaryRate / normHours) * (workedHours - normHours) * 2
    );
  }
  if (workedHours > normHours) {
    // Если количество отработанных часов больше нормы
    totalSalary = salaryRate;
  } else if (workedHours < normHours) {
    // Если количество отработанных часов меньше нормы
    totalSalary = roundUpToNearestThousand(
      (workedHours * salaryRate) / normHours
    );
  }

  if (workedHours > 120) {
    startPrice = startPrice;
    vchlPrice = vchlPrice;
    maxPrice = maxPrice;
  } else {
    startPrice = roundUpToNearestThousand((startPrice / 120) * workedHours);
    vchlPrice = roundUpToNearestThousand((vchlPrice / 120) * workedHours);
    maxPrice = roundUpToNearestThousand((maxPrice / 120) * workedHours);
  }

  var startCost = startPrice * startSalary;
  var maxCost = maxPrice * maxSalary;
  // Простой пример расчета
  var result = salaryRate;

  var resultsText =
    startPrice +
    "<br>" +
    vchlPrice +
    "<br>" +
    maxPrice +
    "<br>" +
    simPrice +
    "<br>" +
    toPercentage(startSalary) +
    "<br>" +
    toPercentage(maxSalary) +
    "<br>" +
    formatNumber(startCost) +
    "<br>" +
    formatNumber(maxCost);

  updateResults(resultsText);
}

function updateResults(text) {
  document.getElementById("results").innerHTML = text;
}

function calculateGrade(city) {
  // Первый грейд
  if (
    city === "Ташкент" ||
    city === "Зангиата" ||
    city === "Келес" ||
    city === "Эшангузар" ||
    city === "Куксарай" ||
    city === "Назарбек"
  ) {
    return "1 грейд";
  }
  // Второй грейд
  else if (
    city === "Фергана" ||
    city === "Андижан" ||
    city === "Наманган" ||
    city === "Бухара" ||
    city === "Самарканд" ||
    city === "Янгиюль" ||
    city === "Чирчик" ||
    city === "Алмалык" ||
    city === "Нукус" ||
    city === "Кибрай" ||
    city === "Ахангаран" ||
    city === "Зарафшан" ||
    city === "Нурафшан" ||
    city === "Туракурган" ||
    city === "Янгибазар"
  ) {
    return "2 грейд";
  }
  // Третий грейд
  else if (
    city === "Шахрихан" ||
    city === "Коканд" ||
    city === "Маргилан" ||
    city === "Навои" ||
    city === "Джизак" ||
    city === "Карши" ||
    city === "Шахрисабз" ||
    city === "Ангрен" ||
    city === "Чуст" ||
    city === "Асака" ||
    city === "Термез" ||
    city === "Ходжейли" ||
    city === "Хива" ||
    city === "Ургенч" ||
    city === "Газалкент" ||
    city === "Риштан" ||
    city === "Бекабад" ||
    city === "Учкудук"
  ) {
    return "3 грейд";
  } else if (
    city === "Гулистан" ||
    city === "Каган" ||
    city === "Кувасай" ||
    city === "Каттакурган" ||
    city === "Каракуль" ||
    city === "Галаасия" ||
    city === "Каракитай" ||
    city === "Фуркат" ||
    city === "Бешарык" ||
    city === "Яйпан" ||
    city === "Ибрат" ||
    city === "Кургантепа" ||
    city === "Карасу" ||
    city === "Чиназ" ||
    city === "Касан" ||
    city === "Гузар" ||
    city === "Шафиркан" ||
    city === "Ходжаабад" ||
    city === "Дангара" ||
    city === "Аккурган" ||
    city === "Джалакудук" ||
    city === "Караулбазар" ||
    city === "Чартак" ||
    city === "Алмазар" ||
    city === "Жондор" ||
    city === "Гиждуван" ||
    city === "Ханабад" ||
    city === "Денау" ||
    city === "Пскент" ||
    city === "Кунград" ||
    city === "Байсун" ||
    city === "Мубарек" ||
    city === "Китаб" ||
    city === "Учкурган"
  ) {
    return "4 грейд";
  } else {
    return "Выберите город";
  }
}

function calculateRegion(city) {
  // Первый грейд
  if (
    city === "Коканд" ||
    city === "Фергана" ||
    city === "Маргилан" ||
    city === "Андижан" ||
    city === "Наманган" ||
    city === "Чуст" ||
    city === "Асака" ||
    city === "Кувасай" ||
    city === "Риштан" ||
    city === "Туракурган" ||
    city === "Шахрихан" ||
    city === "Фуркат" ||
    city === "Бешарык" ||
    city === "Яйпан" ||
    city === "Кургантепа" ||
    city === "Джалакудук" ||
    city === "Ибрат" ||
    city === "Карасу" ||
    city === "Ходжаабад" ||
    city === "Дангара" ||
    city === "Чартак" ||
    city === "Ханабад" ||
    city === "Учкурган"
  ) {
    return "Долина";
  }
  // Второй грейд
  else if (
    city === "Ташкент" ||
    city === "Янгиюль" ||
    city === "Чирчик" ||
    city === "Ангрен" ||
    city === "Алмалык" ||
    city === "Кибрай" ||
    city === "Газалкент" ||
    city === "Келес" ||
    city === "Ахангаран" ||
    city === "Нурафшан" ||
    city === "Зангиата" ||
    city === "Алмазар" ||
    city === "Каракитай" ||
    city === "Куксарай" ||
    city === "Эшангузар" ||
    city === "Бекабад" ||
    city === "Назарбек" ||
    city === "Аккурган" ||
    city === "Янгибазар" ||
    city === "Пскент"
  ) {
    return "Ташкент + ТО";
  }
  // Третий грейд
  else if (
    city === "Бухара" ||
    city === "Самарканд" ||
    city === "Навои" ||
    city === "Джизак" ||
    city === "Карши" ||
    city === "Шахрисабз" ||
    city === "Гулистан" ||
    city === "Термез" ||
    city === "Нукус" ||
    city === "Ходжейли" ||
    city === "Хива" ||
    city === "Ургенч" ||
    city === "Каган" ||
    city === "Зарафшан" ||
    city === "Каттакурган" ||
    city === "Учкудук" ||
    city === "Галаасия" ||
    city === "Каракуль" ||
    city === "Караулбазар" ||
    city === "Касан" ||
    city === "Гузар" ||
    city === "Шафиркан" ||
    city === "Гиждуван" ||
    city === "Жондор" ||
    city === "Денау" ||
    city === "Кунград" ||
    city === "Байсун" ||
    city === "Мубарек" ||
    city === "Китаб"
  ) {
    return "Юго-запад";
  } else {
    return "Выберите город";
  }
}

function getSalaryByGrade(grade) {
  if (grade === "1 грейд") {
    return 3000000;
  } else if (grade === "2 грейд") {
    return 2500000;
  } else if (grade === "3 грейд") {
    return 2000000;
  } else if (grade === "4 грейд") {
    return 1500000;
  }
}

function getLimitsByGrade(limitsPlan, region) {
  if (limitsPlan >= 400 && region === "Ташкент + ТО") {
    return "1 грейд";
  } else if (limitsPlan >= 240 && region === "Ташкент + ТО") {
    return "2 грейд";
  } else if (limitsPlan >= 130 && region === "Ташкент + ТО") {
    return "3 грейд";
  } else if (limitsPlan < 130 && region === "Ташкент + ТО") {
    return "4 грейд";
  } else if (limitsPlan >= 500 && region === "Юго-запад") {
    return "1 грейд";
  } else if (limitsPlan >= 310 && region === "Юго-запад") {
    return "2 грейд";
  } else if (limitsPlan >= 190 && region === "Юго-запад") {
    return "3 грейд";
  } else if (limitsPlan < 190 && region === "Юго-запад") {
    return "4 грейд";
  } else if (limitsPlan >= 320 && region === "Долина") {
    return "1 грейд";
  } else if (limitsPlan >= 250 && region === "Долина") {
    return "2 грейд";
  } else if (limitsPlan >= 140 && region === "Долина") {
    return "3 грейд";
  } else if (limitsPlan < 140 && region === "Долина") {
    return "4 грейд";
  } else {
    return "0";
  }
}

function getVCHLByGrade(ordersCount, region) {
  if (ordersCount >= 10900 && region === "Ташкент + ТО") {
    return "1 грейд";
  } else if (ordersCount >= 7600 && region === "Ташкент + ТО") {
    return "2 грейд";
  } else if (ordersCount >= 5400 && region === "Ташкент + ТО") {
    return "3 грейд";
  } else if (ordersCount < 5400 && region === "Ташкент + ТО") {
    return "4 грейд";
  } else if (ordersCount >= 9400 && region === "Юго-запад") {
    return "1 грейд";
  } else if (ordersCount >= 7100 && region === "Юго-запад") {
    return "2 грейд";
  } else if (ordersCount >= 4600 && region === "Юго-запад") {
    return "3 грейд";
  } else if (ordersCount < 4600 && region === "Юго-запад") {
    return "4 грейд";
  } else if (ordersCount >= 7700 && region === "Долина") {
    return "1 грейд";
  } else if (ordersCount >= 5600 && region === "Долина") {
    return "2 грейд";
  } else if (ordersCount >= 3800 && region === "Долина") {
    return "3 грейд";
  } else if (ordersCount < 3800 && region === "Долина") {
    return "4 грейд";
  } else {
    return "0";
  }
}

function getMaxPrice(ucellCooperation, limitsGreyd) {
  //----Администратор
  if (ucellCooperation === "Да" && limitsGreyd === "1 грейд") {
    return 1100000;
  } else if (ucellCooperation === "Да" && limitsGreyd === "2 грейд") {
    return 1020000;
  } else if (ucellCooperation === "Да" && limitsGreyd === "3 грейд") {
    return 800000;
  } else if (ucellCooperation === "Да" && limitsGreyd === "4 грейд") {
    return 700000;
  } else if (ucellCooperation === "Нет" && limitsGreyd === "1 грейд") {
    return 1100000;
  } else if (ucellCooperation === "Нет" && limitsGreyd === "2 грейд") {
    return 1000000;
  } else if (ucellCooperation === "Нет" && limitsGreyd === "3 грейд") {
    return 800000;
  } else if (ucellCooperation === "Нет" && limitsGreyd === "4 грейд") {
    return 700000;
  }
}

function getStartPrice(ucellCooperation, limitsGreyd) {
  //----Администратор
  if (ucellCooperation === "Да" && limitsGreyd === "1 грейд") {
    return 825000;
  } else if (ucellCooperation === "Да" && limitsGreyd === "2 грейд") {
    return 750000;
  } else if (ucellCooperation === "Да" && limitsGreyd === "3 грейд") {
    return 600000;
  } else if (ucellCooperation === "Да" && limitsGreyd === "4 грейд") {
    return 525000;
  } else if (ucellCooperation === "Нет" && limitsGreyd === "1 грейд") {
    return 550000;
  } else if (ucellCooperation === "Нет" && limitsGreyd === "2 грейд") {
    return 500000;
  } else if (ucellCooperation === "Нет" && limitsGreyd === "3 грейд") {
    return 400500;
  } else if (ucellCooperation === "Нет" && limitsGreyd === "4 грейд") {
    return 350000;
  }
}

function getVCHLPrice(vchlGreyd) {
  //----Администратор
  if (vchlGreyd === "1 грейд") {
    return 825000;
  } else if (vchlGreyd === "2 грейд") {
    return 750000;
  } else if (vchlGreyd === "3 грейд") {
    return 600000;
  } else if (vchlGreyd === "4 грейд") {
    return 525000;
  }
}

function getSimPrice(simCards) {
  if (simCards >= 30) {
    return 350000;
  } else if (simCards >= 25) {
    return 300000;
  } else if (simCards >= 20) {
    return 250000;
  } else if (simCards >= 15) {
    return 200000;
  } else if (simCards >= 10) {
    return 175000;
  } else if (simCards >= 5) {
    return 150000;
  } else {
    return 0;
  }
}
