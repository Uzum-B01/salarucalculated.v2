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
  let today = new Date();
let startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
let endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
let daysInMonth = endOfMonth.getDate();

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
  var position = document.getElementById("position").value;
  var simCards = parseFloat(document.getElementById("simCards").value) || 0;
  var ucellCooperation = document.getElementById("ucellCooperation").value;
  var sfuAvailable = document.getElementById("sfuAvailable").value;
  var changesCount =
    parseFloat(document.getElementById("changesCount").value) || 0;
  var changesPlan =
    parseFloat(document.getElementById("changesPlan").value) || 0;
  var testScore = parseFloat(document.getElementById("testScore").value) || 0;

  limitsCount = limitsCount / today.getDate() * daysInMonth;
  ordersCount = ordersCount / today.getDate() * daysInMonth;
  changesCount = changesCount / today.getDate() * daysInMonth;
  var region = calculateRegion(city);
  var grade = calculateGrade(city);
  var salaryRate = getSalaryByGrade(grade, position);
  var vchlGreyd = getVCHLByGrade(ordersCount, region);
  var limitsGreyd = getLimitsByGrade(limitsCount, region);
  var limitsPrice = getLimitsPrice(
    ucellCooperation,
    sfuAvailable,
    limitsGreyd,
    position
  );
  var vchlPrice = getVCHLPrice(
    ucellCooperation,
    sfuAvailable,
    vchlGreyd,
    position
  );
  var changePrice = getChangePrice(vchlGreyd);
  var simPrice = getSimPrice(simCards);
  var limitCompletion = limitsCount / planCompletion;
  var changeCompletion = changesCount / changesPlan;

  var penalty = 0;
  var salaryCost = 0; // Инициализация переменной для дополнительных расчетов
  var totalSalary = 0;
  var limitSalary = 0;
  var changeSalary = 0;
  var vchlSalary = 0;
  var simSalary = simPrice;

  if (testScore >= 75) {
    penalty = 0;
  } else if (testScore > 0) {
    penalty = 200000;
  }

  if (limitCompletion > 1.5) {
    limitSalary =
      1.1 * 1 +
      (1.3 - 1.1) * 0.75 +
      (1.5 - 1.3) * 0.5 +
      (limitCompletion - 1.5) * 0.25;
  } else if (limitCompletion >= 1.31) {
    limitSalary = 1.1 * 1 + (1.3 - 1.1) * 0.75 + (limitCompletion - 1.3) * 0.5;
  } else if (limitCompletion >= 1.11) {
    limitSalary = 1.1 * 1 + (limitCompletion - 1.1) * 0.75;
  } else if (limitCompletion >= 0.91) {
    limitSalary = limitCompletion * 1;
  } else if (limitCompletion >= 0.71) {
    limitSalary = limitCompletion * 0.9;
  } else if (limitCompletion >= 0.51) {
    limitSalary = limitCompletion * 0.7;
  } else if (limitCompletion <= 0.5) {
    limitSalary = limitCompletion * 0.5;
  }

  if (changeCompletion > 1.5) {
    changeSalary =
      1.1 * 1 +
      (1.3 - 1.1) * 0.75 +
      (1.5 - 1.3) * 0.5 +
      (changeCompletion - 1.5) * 0.25;
  } else if (changeCompletion >= 1.31) {
    changeSalary =
      1.1 * 1 + (1.3 - 1.1) * 0.75 + (changeCompletion - 1.3) * 0.5;
  } else if (changeCompletion >= 1.11) {
    changeSalary = 1.1 * 1 + (changeCompletion - 1.1) * 0.75;
  } else if (changeCompletion >= 0.91) {
    changeSalary = changeCompletion * 1;
  } else if (changeCompletion >= 0.71) {
    changeSalary = changeCompletion * 0.9;
  } else if (changeCompletion >= 0.51) {
    changeSalary = changeCompletion * 0.7;
  } else if (changeCompletion <= 0.5) {
    changeSalary = changeCompletion * 0.5;
  }

  if (workedHours > normHours) {
    salaryCost = roundUpToNearestThousand(
      (salaryRate / normHours) * (workedHours - normHours) * 2
    );
  }

  if (vchlScore >= 85) {
    vchlSalary = (vchlPrice * vchlScore) / 100;
  } else if (vchlScore >= 73) {
    vchlSalary = vchlPrice / 2;
  }

  if (workedHours > 120) {
    limitsPrice = limitsPrice;
    vchlPrice = vchlPrice;
    changePrice = changePrice;
  } else {
    limitsPrice = roundUpToNearestThousand((limitsPrice / 120) * workedHours);
    vchlPrice = roundUpToNearestThousand((vchlPrice / 120) * workedHours);
    changePrice = roundUpToNearestThousand((changePrice / 120) * workedHours);
  }

  if (workedHours > normHours) {
    // Если количество отработанных часов больше нормы
    totalSalary = salaryRate;
  } else if (workedHours < normHours) {
    // Если количество отработанных часов меньше нормы
    totalSalary = roundUpToNearestThousand(
      (workedHours * salaryRate) / normHours
    );
  } else {
    // Если количество отработанных часов равно норме
    totalSalary = salaryRate;
  }

  var limitCost = limitsPrice * limitSalary;
  var changeCost = changePrice * changeSalary;
  // Простой пример расчета
  var result = formatNumber(totalSalary);
  var result2 = formatNumber(salaryCost);
  var avans = totalSalary / 2;
  var salary =
    totalSalary / 2 +
    salaryCost +
    simSalary +
    limitCost +
    vchlSalary +
    changeCost -
    penalty;
  var salaryTotal = salary + avans;
  // Вывод результатов
  var totalText =
    "Грейд: " +
    grade +
    "<br> Оклад: " +
    result +
    "<br> Переработки: " +
    result2 +
    "<br>" +
    "Бонус по UCELL: " +
    formatNumber(roundUpToNearestThousand(simSalary)) +
    "<br>" +
    "Бонус по лимитам: " +
    formatNumber(roundUpToNearestThousand(limitCost)) +
    "<br>" +
    "Бонус по ВЧЛ: " +
    formatNumber(roundUpToNearestThousand(vchlSalary)) +
    "<br>" +
    "Бонус за смену типа заказа: " +
    formatNumber(roundUpToNearestThousand(changeCost)) +
    "<br>" +
    "Депремация за тестирование: " +
    formatNumber(roundUpToNearestThousand(penalty)) +
    "<br>" +
    "Всего аванс (25-ое число): " +
    formatNumber(roundUpToNearestThousand(avans)) +
    "<br>" +
    "Заработная плата 10-ое число: " +
    formatNumber(roundUpToNearestThousand(salary)) +
    "<br>" +
    "Всего заработная плата сотрдника включая аванс: " +
    formatNumber(roundUpToNearestThousand(salaryTotal));

  var resultsText = "Выберите нужный вариант";
  var resultsText2 = "Заполните поля";
  var resultsText3 = "Оклад: " + result + "<br> Переработки: " + result2;
  var resultsText4 = "Прогнозируемое кол-во выданных заказов: " + formatNumber(Math.round(ordersCount)) +
    "<br> Грейд по ВЧЛ: " +
    vchlGreyd +
    "<br> Бонус по ВЧЛ: " +
    formatNumber(roundUpToNearestThousand(vchlSalary));
  var resultsText5 = "Прогнозируемое кол-во смен типа оплаты в рассрочку: " + formatNumber(Math.round(changesCount)) +
    "<br>Грейд по сменам типа оплаты: " +
    vchlGreyd +
    "<br>Выполнение плана по сменам типа оплаты: " +
    toPercentage(changeSalary) +
    "<br>Бонус за смену типа заказа: " +
    formatNumber(roundUpToNearestThousand(changeCost));
  var resultsText6 = "Прогнозируемое кол-во оформленных лимитов: " + formatNumber(Math.round(limitsCount)) +
    "<br>Грейд по лимитам: " +
    limitsGreyd +
    "<br>Выполнение плана по лимитам: " +
    toPercentage(limitSalary) +
    "<br>Бонус по лимитам: " +
    formatNumber(roundUpToNearestThousand(limitCost));
  var resultsText7 =
    "Бонус по UCELL: " +
    formatNumber(roundUpToNearestThousand(simSalary)) +
    "<br>Депремация за тестирование: " +
    formatNumber(roundUpToNearestThousand(penalty));
  updateResults(resultsText);
  updateResults2(resultsText2);
  updateResults3(resultsText3);
  updateResults4(resultsText4);
  updateResults5(resultsText5);
  updateResults6(resultsText6);
  updateResults7(resultsText7);
  updateTotalText(totalText);
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

function getSalaryByGrade(grade, position) {
  position = position.toLowerCase().trim();
  if (position === "администратор" && grade === "1 грейд") {
    return 3000000;
  } else if (position === "администратор" && grade === "2 грейд") {
    return 2500000;
  } else if (position === "администратор" && grade === "3 грейд") {
    return 2000000;
  } else if (position === "администратор" && grade === "4 грейд") {
    return 1500000;
  } else if (
    position === "специалист по финансовым услугам" &&
    grade === "1 грейд"
  ) {
    return 3000000;
  } else if (
    position === "специалист по финансовым услугам" &&
    grade === "2 грейд"
  ) {
    return 2500000;
  } else if (
    position === "специалист по финансовым услугам" &&
    grade === "3 грейд"
  ) {
    return 2000000;
  } else if (
    position === "специалист по финансовым услугам" &&
    grade === "4 грейд"
  ) {
    return 1500000;
  } else if (position === "менеджер пункта выдачи" && grade === "1 грейд") {
    return 4000000;
  } else if (position === "менеджер пункта выдачи" && grade === "2 грейд") {
    return 3500000;
  } else if (position === "менеджер пункта выдачи" && grade === "3 грейд") {
    return 3000000;
  } else if (position === "менеджер пункта выдачи" && grade === "4 грейд") {
    return 2500000;
  } else {
    return 0; // Возвращаем 0, если комбинация грейда и должности не найдена
  }
}

function getLimitsByGrade(limitsCount, region) {
  if (limitsCount >= 400 && region === "Ташкент + ТО") {
    return "1 грейд";
  } else if (limitsCount >= 240 && region === "Ташкент + ТО") {
    return "2 грейд";
  } else if (limitsCount >= 130 && region === "Ташкент + ТО") {
    return "3 грейд";
  } else if (limitsCount < 130 && region === "Ташкент + ТО") {
    return "4 грейд";
  } else if (limitsCount >= 500 && region === "Юго-запад") {
    return "1 грейд";
  } else if (limitsCount >= 310 && region === "Юго-запад") {
    return "2 грейд";
  } else if (limitsCount >= 190 && region === "Юго-запад") {
    return "3 грейд";
  } else if (limitsCount < 190 && region === "Юго-запад") {
    return "4 грейд";
  } else if (limitsCount >= 320 && region === "Долина") {
    return "1 грейд";
  } else if (limitsCount >= 250 && region === "Долина") {
    return "2 грейд";
  } else if (limitsCount >= 140 && region === "Долина") {
    return "3 грейд";
  } else if (limitsCount < 140 && region === "Долина") {
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

function getLimitsPrice(ucellCooperation, sfuAvailable, limitsGreyd, position) {
  //----Администратор
  if (
    ucellCooperation === "Нет" &&
    sfuAvailable === "Да" &&
    limitsGreyd === "1 грейд" &&
    position === "Администратор"
  ) {
    return 687500;
  } else if (
    ucellCooperation === "Нет" &&
    sfuAvailable === "Да" &&
    limitsGreyd === "2 грейд" &&
    position === "Администратор"
  ) {
    return 625000;
  } else if (
    ucellCooperation === "Нет" &&
    sfuAvailable === "Да" &&
    limitsGreyd === "3 грейд" &&
    position === "Администратор"
  ) {
    return 500000;
  } else if (
    ucellCooperation === "Нет" &&
    sfuAvailable === "Да" &&
    limitsGreyd === "4 грейд" &&
    position === "Администратор"
  ) {
    return 437500;
  } else if (
    ucellCooperation === "Нет" &&
    sfuAvailable === "Нет" &&
    limitsGreyd === "1 грейд" &&
    position === "Администратор"
  ) {
    return 962500;
  } else if (
    ucellCooperation === "Нет" &&
    sfuAvailable === "Нет" &&
    limitsGreyd === "2 грейд" &&
    position === "Администратор"
  ) {
    return 875000;
  } else if (
    ucellCooperation === "Нет" &&
    sfuAvailable === "Нет" &&
    limitsGreyd === "3 грейд" &&
    position === "Администратор"
  ) {
    return 700000;
  } else if (
    ucellCooperation === "Нет" &&
    sfuAvailable === "Нет" &&
    limitsGreyd === "4 грейд" &&
    position === "Администратор"
  ) {
    return 612500;
  } else if (
    ucellCooperation === "Да" &&
    sfuAvailable === "Да" &&
    limitsGreyd === "1 грейд" &&
    position === "Администратор"
  ) {
    return 825000;
  } else if (
    ucellCooperation === "Да" &&
    sfuAvailable === "Да" &&
    limitsGreyd === "2 грейд" &&
    position === "Администратор"
  ) {
    return 750000;
  } else if (
    ucellCooperation === "Да" &&
    sfuAvailable === "Да" &&
    limitsGreyd === "3 грейд" &&
    position === "Администратор"
  ) {
    return 600000;
  } else if (
    ucellCooperation === "Да" &&
    sfuAvailable === "Да" &&
    limitsGreyd === "4 грейд" &&
    position === "Администратор"
  ) {
    return 525000;
  } else if (
    ucellCooperation === "Да" &&
    sfuAvailable === "Нет" &&
    limitsGreyd === "1 грейд" &&
    position === "Администратор"
  ) {
    return 1237500;
  } else if (
    ucellCooperation === "Да" &&
    sfuAvailable === "Нет" &&
    limitsGreyd === "2 грейд" &&
    position === "Администратор"
  ) {
    return 1125000;
  } else if (
    ucellCooperation === "Да" &&
    sfuAvailable === "Нет" &&
    limitsGreyd === "3 грейд" &&
    position === "Администратор"
  ) {
    return 900000;
  } else if (
    ucellCooperation === "Да" &&
    sfuAvailable === "Нет" &&
    limitsGreyd === "4 грейд" &&
    position === "Администратор"
  ) {
    return 787500;
  }
  //-----Менеджер пункта выдачи
  else if (
    ucellCooperation === "Нет" &&
    limitsGreyd === "1 грейд" &&
    position === "Менеджер пункта выдачи"
  ) {
    return 687500;
  } else if (
    ucellCooperation === "Нет" &&
    limitsGreyd === "2 грейд" &&
    position === "Менеджер пункта выдачи"
  ) {
    return 625000;
  } else if (
    ucellCooperation === "Нет" &&
    limitsGreyd === "3 грейд" &&
    position === "Менеджер пункта выдачи"
  ) {
    return 500000;
  } else if (
    ucellCooperation === "Нет" &&
    limitsGreyd === "4 грейд" &&
    position === "Менеджер пункта выдачи"
  ) {
    return 437500;
  } else if (
    ucellCooperation === "Да" &&
    limitsGreyd === "1 грейд" &&
    position === "Менеджер пункта выдачи"
  ) {
    return 825000;
  } else if (
    ucellCooperation === "Да" &&
    limitsGreyd === "2 грейд" &&
    position === "Менеджер пункта выдачи"
  ) {
    return 750000;
  } else if (
    ucellCooperation === "Да" &&
    limitsGreyd === "3 грейд" &&
    position === "Менеджер пункта выдачи"
  ) {
    return 600000;
  } else if (
    ucellCooperation === "Да" &&
    limitsGreyd === "4 грейд" &&
    position === "Менеджер пункта выдачи"
  ) {
    return 525000;
  } else {
    return 4;
  }
}

function getVCHLPrice(ucellCooperation, sfuAvailable, vchlGreyd, position) {
  //----Администратор
  if (
    ucellCooperation === "Нет" &&
    sfuAvailable === "Да" &&
    vchlGreyd === "1 грейд" &&
    position === "Администратор"
  ) {
    return 1100000;
  } else if (
    ucellCooperation === "Нет" &&
    sfuAvailable === "Да" &&
    vchlGreyd === "2 грейд" &&
    position === "Администратор"
  ) {
    return 1000000;
  } else if (
    ucellCooperation === "Нет" &&
    sfuAvailable === "Да" &&
    vchlGreyd === "3 грейд" &&
    position === "Администратор"
  ) {
    return 800000;
  } else if (
    ucellCooperation === "Нет" &&
    sfuAvailable === "Да" &&
    vchlGreyd === "4 грейд" &&
    position === "Администратор"
  ) {
    return 700000;
  } else if (
    ucellCooperation === "Нет" &&
    sfuAvailable === "Нет" &&
    vchlGreyd === "1 грейд" &&
    position === "Администратор"
  ) {
    return 825000;
  } else if (
    ucellCooperation === "Нет" &&
    sfuAvailable === "Нет" &&
    vchlGreyd === "2 грейд" &&
    position === "Администратор"
  ) {
    return 750000;
  } else if (
    ucellCooperation === "Нет" &&
    sfuAvailable === "Нет" &&
    vchlGreyd === "3 грейд" &&
    position === "Администратор"
  ) {
    return 600000;
  } else if (
    ucellCooperation === "Нет" &&
    sfuAvailable === "Нет" &&
    vchlGreyd === "4 грейд" &&
    position === "Администратор"
  ) {
    return 525000;
  } else if (
    ucellCooperation === "Да" &&
    sfuAvailable === "Да" &&
    vchlGreyd === "1 грейд" &&
    position === "Администратор"
  ) {
    return 1237500;
  } else if (
    ucellCooperation === "Да" &&
    sfuAvailable === "Да" &&
    vchlGreyd === "2 грейд" &&
    position === "Администратор"
  ) {
    return 1125000;
  } else if (
    ucellCooperation === "Да" &&
    sfuAvailable === "Да" &&
    vchlGreyd === "3 грейд" &&
    position === "Администратор"
  ) {
    return 900000;
  } else if (
    ucellCooperation === "Да" &&
    sfuAvailable === "Да" &&
    vchlGreyd === "4 грейд" &&
    position === "Администратор"
  ) {
    return 787500;
  } else if (
    ucellCooperation === "Да" &&
    sfuAvailable === "Нет" &&
    vchlGreyd === "1 грейд" &&
    position === "Администратор"
  ) {
    return 825000;
  } else if (
    ucellCooperation === "Да" &&
    sfuAvailable === "Нет" &&
    vchlGreyd === "2 грейд" &&
    position === "Администратор"
  ) {
    return 750000;
  } else if (
    ucellCooperation === "Да" &&
    sfuAvailable === "Нет" &&
    vchlGreyd === "3 грейд" &&
    position === "Администратор"
  ) {
    return 600000;
  } else if (
    ucellCooperation === "Да" &&
    sfuAvailable === "Нет" &&
    vchlGreyd === "4 грейд" &&
    position === "Администратор"
  ) {
    return 525000;
  }
  //-----Менеджер пункта выдачи
  else if (
    ucellCooperation === "Нет" &&
    vchlGreyd === "1 грейд" &&
    position === "Менеджер пункта выдачи"
  ) {
    return 1100000;
  } else if (
    ucellCooperation === "Нет" &&
    vchlGreyd === "2 грейд" &&
    position === "Менеджер пункта выдачи"
  ) {
    return 1000000;
  } else if (
    ucellCooperation === "Нет" &&
    vchlGreyd === "3 грейд" &&
    position === "Менеджер пункта выдачи"
  ) {
    return 800000;
  } else if (
    ucellCooperation === "Нет" &&
    vchlGreyd === "4 грейд" &&
    position === "Менеджер пункта выдачи"
  ) {
    return 700000;
  } else if (
    ucellCooperation === "Да" &&
    vchlGreyd === "1 грейд" &&
    position === "Менеджер пункта выдачи"
  ) {
    return 1237500;
  } else if (
    ucellCooperation === "Да" &&
    vchlGreyd === "2 грейд" &&
    position === "Менеджер пункта выдачи"
  ) {
    return 1125000;
  } else if (
    ucellCooperation === "Да" &&
    vchlGreyd === "3 грейд" &&
    position === "Менеджер пункта выдачи"
  ) {
    return 900000;
  } else if (
    ucellCooperation === "Да" &&
    vchlGreyd === "4 грейд" &&
    position === "Менеджер пункта выдачи"
  ) {
    return 787500;
  } else {
    return 4;
  }
}

function getChangePrice(vchlGreyd) {
  if ((vchlGreyd = "1 грейд")) {
    return 687500;
  } else if ((vchlGreyd = "2 грейд")) {
    return 625000;
  } else if ((vchlGreyd = "3 грейд")) {
    return 500000;
  } else if ((vchlGreyd = "4 грейд")) {
    return 437500;
  } else {
    return 5;
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

function updateResults(text) {
  document.getElementById("results").innerHTML = text;
}

function updateResults2(text) {
  document.getElementById("results2").innerHTML = text;
}
function updateResults3(text) {
  document.getElementById("results3").innerHTML = text;
}

function updateResults4(text) {
  document.getElementById("results4").innerHTML = text;
}

function updateResults5(text) {
  document.getElementById("results5").innerHTML = text;
}

function updateResults6(text) {
  document.getElementById("results6").innerHTML = text;
}
function updateResults7(text) {
  document.getElementById("results7").innerHTML = text;
}

function updateTotalText(text) {
  document.getElementById("totalText").innerHTML = text;
}
