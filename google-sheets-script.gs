// ============================================================
// Best Friend Zoo Hotel — Google Apps Script
// Вставить в: script.google.com → Новый проект → вставить весь код
// ============================================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Создаём заголовки если лист пустой
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Дата и время',
        'Имя владельца',
        'Телефон (WhatsApp)',
        'Имя питомца',
        'Вид животного',
        'Порода',
        'Возраст',
        'Течка (для сук)',
        'Даты заезда / отъезда',
        'Срок пребывания (дней)',
        'Последний визит к вет.',
        'Причина визита к вет.',
        'Особенности здоровья',
        'Частота выгула',
        'Что любит',
        'Что не любит',
        'Отношение к людям',
        'Отношение к животным',
        'Особенности характера',
        'Корм (марка)',
        'Привычный рацион',
        'Кормление относительно прогулки',
        'Охраняет игрушки',
        'Охраняет еду',
        'Бывает агрессивен',
        'Причины агрессии',
        'Кусал человека',
        'Знание команд',
        'Кол-во прогулок в день',
        'Откуда узнали',
        'Данные для договора'
      ];
      sheet.appendRow(headers);

      // Форматирование заголовка
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#141414');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setFontSize(11);
      sheet.setFrozenRows(1);

      // Ширина колонок
      sheet.setColumnWidth(1, 160);  // дата
      sheet.setColumnWidth(2, 160);  // имя владельца
      sheet.setColumnWidth(3, 160);  // телефон
      sheet.setColumnWidths(4, 28, 180); // остальные
    }

    // Перевод значений select в читаемый вид
    const feedingMap = {
      'not-specified': 'Не принципиально',
      'before': 'До прогулки',
      'after': 'После прогулки'
    };
    const commandsMap = {
      'know-do': 'Знает и выполняет',
      'know-wont': 'Знает, но не выполняет',
      'dont-know': 'Не знает'
    };
    const speciesMap = {
      'dog': 'Собака',
      'cat': 'Кошка'
    };

    // Чередующийся цвет строк
    const row = sheet.getLastRow() + 1;
    const rowColor = (row % 2 === 0) ? '#f9f9f9' : '#ffffff';

    sheet.appendRow([
      new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }),
      data.ownerName        || '',
      data.ownerPhone       || '',
      data.petName          || '',
      speciesMap[data.petSpecies] || data.petSpecies || '',
      data.petBreed         || '',
      data.petAge           || '',
      data.heatCycle        || '',
      data.dates            || '',
      data.duration         || '',
      data.lastVet          || '',
      data.vetReason        || '',
      data.healthIssues     || '',
      data.walkFreq         || '',
      data.likes            || '',
      data.dislikes         || '',
      data.toPeople         || '',
      data.toAnimals        || '',
      data.character        || '',
      data.foodBrand        || '',
      data.diet             || '',
      feedingMap[data.feedingSchedule] || data.feedingSchedule || '',
      data.guardToys        || '',
      data.guardFood        || '',
      data.aggressive       || '',
      data.aggroReason      || '',
      data.bitten           || '',
      commandsMap[data.commands] || data.commands || '',
      data.walksNum         || '',
      data.source           || '',
      data.contractData     || ''
    ]);

    // Цвет новой строки
    sheet.getRange(sheet.getLastRow(), 1, 1, 31).setBackground(rowColor);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Функция для ручного создания заголовков (запустить 1 раз в редакторе)
function initSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    const headers = [
      'Дата и время', 'Имя владельца', 'Телефон (WhatsApp)', 'Имя питомца',
      'Вид животного', 'Порода', 'Возраст', 'Течка (для сук)',
      'Даты заезда / отъезда', 'Срок пребывания (дней)', 'Последний визит к вет.',
      'Причина визита к вет.', 'Особенности здоровья', 'Частота выгула',
      'Что любит', 'Что не любит', 'Отношение к людям', 'Отношение к животным',
      'Особенности характера', 'Корм (марка)', 'Привычный рацион',
      'Кормление относительно прогулки', 'Охраняет игрушки', 'Охраняет еду',
      'Бывает агрессивен', 'Причины агрессии', 'Кусал человека', 'Знание команд',
      'Кол-во прогулок в день', 'Откуда узнали', 'Данные для договора'
    ];
    sheet.appendRow(headers);
    
    // Форматирование
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#141414').setFontColor('#ffffff').setFontWeight('bold').setFontSize(11);
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 160);
    sheet.setColumnWidth(3, 160);
    sheet.setColumnWidths(4, 28, 180);
    
    Logger.log('Таблица успешно инициализирована!');
  } else {
    Logger.log('Таблица уже содержит данные.');
  }
}

// Тест — запустить вручную чтобы проверить что скрипт работает
function testScript() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  Logger.log('Скрипт подключён. Строк в таблице: ' + sheet.getLastRow());
}

