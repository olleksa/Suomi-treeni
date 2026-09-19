import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Volume2, X, ChevronLeft, Plus, Share2, BookOpen, Check,
  Search, Trash2, Play, Copy, Info, Flame, Layers, MessageSquare, Lock
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Палитра: финская зима — иней, озёрная синь, морошка, ель, брусника */
/* ------------------------------------------------------------------ */
const C = {
  paper: "#EDF1F5",
  card: "#FFFFFF",
  ink: "#0E1E33",
  inkSoft: "#5A6B80",
  line: "#D3DCE6",
  blue: "#0A47A9",
  blueSoft: "#DCE6FA",
  ochre: "#D8960F",
  ochreSoft: "#FBEFD2",
  spruce: "#1B7A57",
  spruceSoft: "#DDF0E7",
  lingon: "#B8332A",
  lingonSoft: "#FBE2DF",
};
// Меняется при каждой пересборке — по ней видно, какая версия открыта.
const BUILD = "16.09 / 46 уроков, гибкая проверка ответа";
const FONT = '"Helvetica Neue", Inter, system-ui, -apple-system, "Segoe UI", Arial, sans-serif';

/* ------------------------------------------------------------------ */
/*  Урок 17 — FinnishPod101 Lower Beginner S1 #17 (болезнь и симптомы) */
/* ------------------------------------------------------------------ */
const LESSON_17 = {
  id: "LB_S1_17",
  title: "Болезнь и симптомы",
  source: "FinnishPod101 · Lower Beginner S1 #17",
  glossary: [
    { w: "sairas", ru: "больной, болен", en: "sick, ill",
      forms: ["sairas", "sairaana"],
      note: "Про любую болезнь — от простуды до рака, но не про травмы: со сломанной ногой человек loukkaantunut («травмированный»), а не sairas. Можно сказать и Tiina on sairas, и Tiina on sairaana. Эссив (-na) означает временное состояние: sairaana — сейчас болеет и поправится. Про диабет так не скажешь — только Tiina on sairas." },
    { w: "kipeä", ru: "болит; больной, воспалённый", en: "sore; sick, ill",
      forms: ["kipeä", "kipeät", "kipeää"],
      note: "В разговорной речи — синоним sairas: Oletko kipeä? = Oletko sairas? («Ты болен?»). В формальном языке (газеты) kipeä значит в основном «болит». Частая конструкция: Minulla on ... kipeä («У меня болит ...»), в середину вставляется часть тела: Minulla on jalka kipeä, Minulla on selkä kipeä." },
    { w: "vuotaa", ru: "течь, протекать", en: "to leak, to run (of nose)",
      forms: ["vuotaa", "vuoti", "vuotanut"],
      note: "Стандартный глагол для любой жидкости, газа (и даже информации), которая медленно уходит оттуда, где должна оставаться. Про нос — «течёт, надо сморкаться». Если нос просто заложен: Nenäni on tukossa." },
    { w: "kuume", ru: "температура, жар", en: "fever",
      forms: ["kuume", "kuumetta", "kuumeen"],
      note: "Симптом, поэтому обычно в партитиве: Minulla on kuumetta («У меня температура»). Основы: kuume-, kuumee-." },
    { w: "kuinka", ru: "как, насколько", en: "how",
      forms: ["kuinka"],
      note: "Синоним miten, но чаще стоит перед прилагательным: kuinka kauan («как долго»), kuinka vanha («сколько лет»), kuinka pitkä («какого роста»)." },
    { w: "nenä", ru: "нос", en: "nose", forms: ["nenä", "nenäsi", "nenäni", "nenää"] },
    { w: "paras", ru: "лучший", en: "best",
      forms: ["paras"],
      note: "Превосходная степень от hyvä. On paras + инфинитив = «лучше всего сделать что-то»: On paras levätä." },
    { w: "kurkku", ru: "горло", en: "throat",
      forms: ["kurkku", "kurkkua", "kurkkuaan"],
      note: "То же слово значит «огурец». Что именно имеется в виду, ясно из контекста: Kurkku on kipeä — про горло, а не про овощ." },
    { w: "levätä", ru: "отдыхать", en: "to rest",
      forms: ["levätä", "lepää", "lepäsi", "lepäävät"],
      note: "Тип глагола с чередованием: levätä → minä lepään, hän lepää, hän lepäsi." },
    { w: "luulla", ru: "думать, полагать (предполагать)", en: "to believe, to think",
      forms: ["luulla", "luulen", "luulin", "luuli"],
      note: "Luulla — думать в смысле «предполагать, возможно ошибочно». Не путать с ajatella («размышлять») и tietää («знать»). Luulin, että... часто значит «а я-то думал, что...»." },
    { w: "minulla on", ru: "у меня есть", en: "I have",
      forms: ["minulla", "sinulla", "hänellä", "meillä", "teillä", "heillä", "eerikalla", "juhalla", "naisella", "monella", "lapsella", "jussilla"],
      note: "Владение выражается адессивом (-lla/-llä) + on: Minulla on kuume. Названия болезней обычно в номинативе (flunssa, ruokamyrkytys), а симптомы — в партитиве (kuumetta, yskää, nuhaa). Yskä и nuha могут быть и тем, и другим." },
    { w: "flunssa", ru: "простуда", en: "the common cold", forms: ["flunssa", "flunssaa"] },
    { w: "influenssa", ru: "грипп", en: "influenza, flu", forms: ["influenssa", "influenssaa"] },
    { w: "heinänuha", ru: "сенная лихорадка, поллиноз", en: "hay fever", forms: ["heinänuha"] },
    { w: "nuha", ru: "насморк", en: "runny nose", forms: ["nuha", "nuhaa"] },
    { w: "yskä", ru: "кашель", en: "cough", forms: ["yskä", "yskää"] },
    { w: "ripuli", ru: "понос", en: "diarrhea", forms: ["ripuli", "ripulia"] },
    { w: "vatsatauti", ru: "кишечный грипп, желудочная инфекция", en: "stomach flu", forms: ["vatsatauti", "vatsatautia"] },
    { w: "ruokamyrkytys", ru: "пищевое отравление", en: "food poisoning", forms: ["ruokamyrkytys", "ruokamyrkytyksen"] },
    { w: "käsi", ru: "рука (кисть)", en: "hand, arm", forms: ["käsi", "kädet", "kättä"] },
    { w: "jalka", ru: "нога", en: "foot, leg", forms: ["jalka", "jalat", "jalkaa"] },
    { w: "sormi", ru: "палец (на руке)", en: "finger", forms: ["sormi", "sormet", "sormemme", "sormenne"] },
    { w: "varvas", ru: "палец (на ноге)", en: "toe", forms: ["varvas", "varpaat"] },
    { w: "vatsa", ru: "живот", en: "stomach", forms: ["vatsa", "vatsaa"] },
    { w: "polvi", ru: "колено", en: "knee", forms: ["polvi", "polveni", "polvet"] },
    { w: "kyynärpää", ru: "локоть", en: "elbow", forms: ["kyynärpää"] },
    { w: "selkä", ru: "спина", en: "back", forms: ["selkä", "selkää"] },
    { w: "ranne", ru: "запястье", en: "wrist", forms: ["ranne", "ranteet", "ranteesi"] },
    { w: "elatiivi", ru: "элатив: причина боли", en: "elative for cause",
      forms: ["eilisestä", "tennispelistä", "kävelemisestä"],
      note: "Причина боли ставится в элатив (-sta/-stä): Käsi on kipeä eilisestä tennispelistä («Рука болит после вчерашней игры в теннис»), Jalat ovat kipeät kävelemisestä («Ноги болят от ходьбы»)." },
  ],
  items: [
    // диалог
    { fi: "Minun pitäisi ehkä lähteä kotiin.", ru: "Мне, наверное, пора домой.", en: "I think maybe I should go home.", k: "d", who: "Petri" },
    { fi: "Kuinka niin? Oletko sairas?", ru: "Это почему? Ты болен?", en: "Why? Are you sick?", k: "d", who: "Mari" },
    { fi: "Luulen, että minulla on kuumetta.", ru: "Думаю, у меня температура.", en: "I think I have a fever.", k: "d", who: "Petri" },
    { fi: "Kurkku on kipeä ja nenä vuotaa.", ru: "Горло болит и нос течёт.", en: "I have a sore throat and my nose is running.", k: "d", who: "Petri" },
    { fi: "Sitten on kyllä paras levätä.", ru: "Тогда лучше всего отдохнуть.", en: "Then you had better rest.", k: "d", who: "Mari" },
    { fi: "Joo. Hei hei.", ru: "Ага. Пока.", en: "Yeah. Bye.", k: "d", who: "Petri" },
    // слова
    { fi: "kuinka", ru: "как, насколько", en: "how", k: "w" },
    { fi: "kipeä", ru: "болит; больной", en: "sore; sick", k: "w" },
    { fi: "nenä", ru: "нос", en: "nose", k: "w" },
    { fi: "paras", ru: "лучший", en: "best", k: "w" },
    { fi: "kurkku", ru: "горло", en: "throat", k: "w" },
    { fi: "vuotaa", ru: "течь", en: "to leak, to run", k: "w" },
    { fi: "levätä", ru: "отдыхать", en: "to rest", k: "w" },
    { fi: "sairas", ru: "больной", en: "sick, ill", k: "w" },
    { fi: "luulla", ru: "думать, полагать", en: "to think, to believe", k: "w" },
    { fi: "kuume", ru: "температура, жар", en: "fever", k: "w" },
    { fi: "flunssa", ru: "простуда", en: "the common cold", k: "w" },
    { fi: "influenssa", ru: "грипп", en: "influenza", k: "w" },
    { fi: "heinänuha", ru: "сенная лихорадка", en: "hay fever", k: "w" },
    { fi: "nuha", ru: "насморк", en: "runny nose", k: "w" },
    { fi: "yskä", ru: "кашель", en: "cough", k: "w" },
    { fi: "ripuli", ru: "понос", en: "diarrhea", k: "w" },
    { fi: "vatsatauti", ru: "кишечный грипп", en: "stomach flu", k: "w" },
    { fi: "ruokamyrkytys", ru: "пищевое отравление", en: "food poisoning", k: "w" },
    { fi: "käsi", ru: "рука", en: "hand, arm", k: "w" },
    { fi: "jalka", ru: "нога", en: "foot, leg", k: "w" },
    { fi: "sormi", ru: "палец на руке", en: "finger", k: "w" },
    { fi: "varvas", ru: "палец на ноге", en: "toe", k: "w" },
    { fi: "vatsa", ru: "живот", en: "stomach", k: "w" },
    { fi: "polvi", ru: "колено", en: "knee", k: "w" },
    { fi: "kyynärpää", ru: "локоть", en: "elbow", k: "w" },
    { fi: "selkä", ru: "спина", en: "back", k: "w" },
    { fi: "ranne", ru: "запястье", en: "wrist", k: "w" },
    // предложения
    { fi: "Kuinka kauan sinulla on ollut kuumetta?", ru: "Как долго у тебя температура?", en: "For how long have you had a fever?", k: "s" },
    { fi: "Kuinka hyvä tuo elokuva on?", ru: "Насколько хорош тот фильм?", en: "How good is that movie?", k: "s" },
    { fi: "Kuinka pitkä sinä olet?", ru: "Какого ты роста?", en: "How tall are you?", k: "s" },
    { fi: "Kuinka vanha sinä olet?", ru: "Сколько тебе лет?", en: "How old are you?", k: "s" },
    { fi: "Kuinka kauan olet opiskellut suomea?", ru: "Как долго ты учишь финский?", en: "How long have you been studying Finnish?", k: "s" },
    { fi: "Mikä kohta on kipeä?", ru: "Где именно болит?", en: "Where does it hurt?", k: "s" },
    { fi: "Niistä nenäsi.", ru: "Высморкайся.", en: "Blow your nose.", k: "s" },
    { fi: "Tämä on paras kirja, minkä olen ikinä lukenut.", ru: "Это лучшая книга, которую я когда-либо читал.", en: "This is the best book I've ever read.", k: "s" },
    { fi: "Isä selvitti kurkkuaan.", ru: "Папа прочистил горло.", en: "Dad cleared his throat.", k: "s" },
    { fi: "Keittiön vesihana vuotaa.", ru: "Кухонный кран течёт.", en: "The kitchen faucet leaks.", k: "s" },
    { fi: "Mies lepää riippumatossa.", ru: "Мужчина отдыхает в гамаке.", en: "The man is resting in the hammock.", k: "s" },
    { fi: "Nainen lepää riippumatossa.", ru: "Женщина отдыхает в гамаке.", en: "The woman is resting in the hammock.", k: "s" },
    { fi: "Gorilla lepää nurmikolla.", ru: "Горилла отдыхает на газоне.", en: "The gorilla is resting in the grass.", k: "s" },
    { fi: "Mies lepäsi riippumatossa.", ru: "Мужчина отдыхал в гамаке.", en: "The man rested in the hammock.", k: "s" },
    { fi: "Lepää vähän, minä laitan ruoan.", ru: "Отдохни немного, я приготовлю еду.", en: "Rest a bit, I'll do the cooking.", k: "s" },
    { fi: "Emmi on sairas eikä voi mennä kouluun.", ru: "Эмми больна и не может пойти в школу.", en: "Emmi is sick and can't go to school.", k: "s" },
    { fi: "Luulin, että sinä käyt kaupassa.", ru: "Я думал, что ты сходишь в магазин.", en: "I thought you were supposed to do the shopping.", k: "s" },
    { fi: "Naisella on kuumetta.", ru: "У женщины температура.", en: "The woman has a fever.", k: "s" },
    { fi: "Ei minulla ole kuumetta.", ru: "Нет у меня никакой температуры.", en: "I don't have a fever.", k: "s" },
    { fi: "Lapsen kuume nousi yhä korkeammaksi yön aikana.", ru: "Температура ребёнка поднималась всё выше за ночь.", en: "The child's fever climbed higher during the night.", k: "s" },
    { fi: "Eerikalla on flunssa.", ru: "У Эрики простуда.", en: "Eerika has a cold.", k: "s" },
    { fi: "Milloin sinulla on viimeksi ollut influenssa?", ru: "Когда ты последний раз болел гриппом?", en: "When did you last have influenza?", k: "s" },
    { fi: "Juhalla on heinänuha.", ru: "У Юхи сенная лихорадка.", en: "Juha has hay fever.", k: "s" },
    { fi: "Onko sinulla kuumetta?", ru: "У тебя температура?", en: "Do you have a fever?", k: "s" },
    { fi: "Minulla on ollut nuhaa jo yli viikon.", ru: "У меня насморк уже больше недели.", en: "I've had a runny nose for over a week now.", k: "s" },
    { fi: "Minulla on yskää ja nuhaa, mutta ei kuumetta.", ru: "У меня кашель и насморк, но температуры нет.", en: "I have a cough and a runny nose, but no fever.", k: "s" },
    { fi: "Onpa sinulla paha yskä.", ru: "Ну и сильный же у тебя кашель.", en: "You've got a bad cough.", k: "s" },
    { fi: "Heillä kaikilla oli Thaimaassa ripulia.", ru: "У них у всех в Таиланде был понос.", en: "All of them had diarrhea in Thailand.", k: "s" },
    { fi: "Monella päiväkodin lapsella on nyt vatsatauti.", ru: "У многих детей в саду сейчас кишечный грипп.", en: "Many children in the daycare have a stomach flu now.", k: "s" },
    { fi: "Luulen, että minulla on ruokamyrkytys.", ru: "Думаю, у меня пищевое отравление.", en: "I think I have food poisoning.", k: "s" },
    { fi: "Käsi on kipeä eilisestä tennispelistä.", ru: "Рука болит после вчерашнего тенниса.", en: "My arm hurts from yesterday's tennis match.", k: "s" },
    { fi: "Jalat ovat kipeät kävelemisestä.", ru: "Ноги болят от ходьбы.", en: "My feet hurt from walking.", k: "s" },
    { fi: "Minulla on vatsa kipeä.", ru: "У меня болит живот.", en: "My stomach hurts.", k: "s" },
    { fi: "Polveni on kipeä.", ru: "У меня болит колено.", en: "My knee hurts.", k: "s" },
    { fi: "Jussin selkä on kipeä.", ru: "У Юсси болит спина.", en: "Jussi's back hurts.", k: "s" },
    { fi: "Ovatko ranteesi vielä kipeät?", ru: "У тебя ещё болят запястья?", en: "Do your wrists still hurt?", k: "s" },
    { fi: "Keilaaminen oli hauskaa, mutta illalla sormemme olivat kipeät.", ru: "Боулинг был весёлым, но вечером пальцы болели.", en: "Bowling was fun, but in the evening our fingers were sore.", k: "s" },
    { fi: "Olivatko teidänkin sormenne kipeät?", ru: "У вас тоже болели пальцы?", en: "Were your fingers sore too?", k: "s" },
    { fi: "Nenäni on tukossa.", ru: "У меня заложен нос.", en: "My nose is stuffy.", k: "s" },
  ],
};

/* ------------------------------------------------------------------ */
/*  Урок 18 — Lower Beginner S1 #18 (у врача: где болит)               */
/* ------------------------------------------------------------------ */
const LESSON_18 = {
  id: "LB_S1_18",
  title: "У врача: где болит",
  source: "FinnishPod101 · Lower Beginner S1 #18",
  glossary: [
    { w: "vika", ru: "неисправность, поломка, проблема", en: "fault, problem",
      forms: ["vika", "vikana", "vikaa"],
      note: "Mikä on vikana? — «В чём дело?», «Что не так?». Слово стоит в эссиве (-na). Разговорная частица -s в Mikäs смягчает вопрос. Подходит и к людям, и к технике: Mikä tässä tietokoneessa on vikana?" },
    { w: "särkeä", ru: "ломить, ныть, болеть; ломать, разбивать", en: "to ache; to break",
      forms: ["särkee", "särkeekö", "särki", "särkenyt", "särkeä", "särkekää"],
      note: "Главная конструкция урока — предложение без подлежащего. Глагол всегда в 3-м лице ед. числа (särkee), а часть тела стоит в партитиве: Päätä särkee. Того, у кого болит, ставят в генитив перед частью тела: Elmerin hammasta särkee. Särkeä годится не для любой боли: чаще всего это pää, hammas, korva, jalat и ломота в мышцах при гриппе. Про живот так не говорят. В переносном смысле — про сердце. В значении «разбить» särkeä ведёт себя как обычный глагол с подлежащим: Pallo särki ikkunan." },
    { w: "adessiivi", ru: "второй способ: у кого болит — в адессиве", en: "adessive experiencer",
      forms: ["minulla", "sinulla", "elmerillä", "mummilla"],
      note: "Можно сказать иначе: человек в адессиве (-lla/-llä), а глагол встаёт между ним и частью тела: Minulla särkee päätä. При таком порядке слов притяжательного окончания у части тела уже быть не может." },
    { w: "joka", ru: "каждый", en: "every",
      forms: ["joka"],
      note: "Короткая форма от jokainen. Уникальна тем, что не склоняется вообще: joka pojalla on sadetakki (ср. jokaisella pojalla on sadetakki). И ещё: jokainen может стоять само по себе в значении «каждый, все» — Jokaisella on sadetakki, а joka так не умеет, ему всегда нужно существительное рядом." },
    { w: "influenssa", ru: "грипп", en: "influenza, flu",
      forms: ["influenssa", "influenssaa", "influenssalta", "influenssaan"],
      note: "В финском influenssa и flunssa — не одно и то же. Influenssa — настоящий грипп, а flunssa обычно значит просто простуду: небольшой кашель, насморк, почти без температуры." },
    { w: "sairausloma", ru: "больничный", en: "sick leave",
      forms: ["sairausloma", "sairauslomaa", "sairauslomalla"],
      note: "Sairas — «больной» (прилагательное, урок 17), а sairaus — «болезнь» (существительное). Разница в одну букву. Отсюда sairausloma — «больничный»; форма sairasloma тоже часто встречается." },
    { w: "suu", ru: "рот", en: "mouth", forms: ["suu", "suuta", "suun", "suuhygienia"] },
    { w: "korva", ru: "ухо", en: "ear", forms: ["korva", "korvat", "korvia", "korviaan", "korvaa"] },
    { w: "avata", ru: "открывать", en: "to open",
      forms: ["avata", "avaa", "avaan", "avasi", "avattiin", "avaisitko"],
      note: "Avaa suu — «Открой рот» (повелительное наклонение). Avaisitko ikkunan? — вежливая просьба через кондиционал: «Ты не открыл бы окно?»" },
    { w: "paljon", ru: "много, очень", en: "a lot",
      forms: ["paljon"],
      note: "С глаголами значит и «много», и «очень»: Pidän siitä paljon — «Мне это очень нравится»." },
    { w: "aste", ru: "градус", en: "degree",
      forms: ["aste", "astetta", "asteen"],
      note: "В Финляндии всё в метрической системе: градусы только по Цельсию, на кухне — децилитры и граммы. Единственное заметное исключение — диагонали экранов в дюймах." },
    { w: "pää", ru: "голова", en: "head", forms: ["pää", "päätä", "päätäni", "päätäsi", "päätään"] },
    { w: "hammas", ru: "зуб", en: "tooth", forms: ["hammas", "hammasta", "hampaat"] },
    { w: "silmä", ru: "глаз", en: "eye", forms: ["silmä", "silmät", "silmiä", "silmiäni"] },
    { w: "sydän", ru: "сердце", en: "heart", forms: ["sydän", "sydäntä", "sydämen"] },
    { w: "lääkäri", ru: "врач", en: "doctor", forms: ["lääkäri", "lääkäriin", "lääkärillä"] },
  ],
  items: [
    { fi: "Mikäs on vikana?", ru: "Что вас беспокоит?", en: "What seems to be the problem?", k: "d", who: "Lääkäri" },
    { fi: "Joka paikkaa särkee.", ru: "Всё тело ломит.", en: "I ache everywhere.", k: "d", who: "Petri" },
    { fi: "Kuumetta on 38,5 astetta, ja kurkku on kipeä.", ru: "Температура 38,5 градуса, и горло болит.", en: "I have a 38.5 degree fever and a sore throat.", k: "d", who: "Petri" },
    { fi: "Katsotaanpa. Avaa suu.", ru: "Посмотрим-ка. Открой рот.", en: "Let's see. Open your mouth.", k: "d", who: "Lääkäri" },
    { fi: "Katson myös korvat. Särkeekö niitä?", ru: "Посмотрю ещё уши. Они болят?", en: "I'll check your ears as well. Do they ache?", k: "d", who: "Lääkäri" },
    { fi: "Vaikuttaa influenssalta.", ru: "Похоже на грипп.", en: "It looks like influenza.", k: "d", who: "Lääkäri" },
    { fi: "Annan sinulle loppuviikon sairauslomaa.", ru: "Дам тебе больничный до конца недели.", en: "I'll give you sick leave for the rest of the week.", k: "d", who: "Lääkäri" },
    { fi: "Lepää ja juo paljon.", ru: "Отдыхай и много пей.", en: "Rest and drink a lot.", k: "d", who: "Lääkäri" },
    { fi: "Selvä.", ru: "Ясно.", en: "Okay.", k: "d", who: "Petri" },
    { fi: "vika", ru: "неисправность, проблема", en: "fault, problem", k: "w" },
    { fi: "suu", ru: "рот", en: "mouth", k: "w" },
    { fi: "korva", ru: "ухо", en: "ear", k: "w" },
    { fi: "sairausloma", ru: "больничный", en: "sick leave", k: "w" },
    { fi: "avata", ru: "открывать", en: "to open", k: "w" },
    { fi: "paljon", ru: "много, очень", en: "a lot", k: "w" },
    { fi: "joka", ru: "каждый", en: "every", k: "w" },
    { fi: "särkeä", ru: "ломить, ныть (о боли)", en: "to ache", k: "w" },
    { fi: "aste", ru: "градус", en: "degree", k: "w" },
    { fi: "pää", ru: "голова", en: "head", k: "w" },
    { fi: "hammas", ru: "зуб", en: "tooth", k: "w" },
    { fi: "silmä", ru: "глаз", en: "eye", k: "w" },
    { fi: "sydän", ru: "сердце", en: "heart", k: "w" },
    { fi: "sairaus", ru: "болезнь", en: "illness, disease", k: "w" },
    { fi: "lääkäri", ru: "врач", en: "doctor", k: "w" },
    { fi: "lääke", ru: "лекарство", en: "medicine", k: "w" },
    { fi: "Mikä tässä tietokoneessa on vikana?", ru: "Что не так с этим компьютером?", en: "What's wrong with this computer?", k: "s" },
    { fi: "Hyvä suuhygienia on tärkeää.", ru: "Хорошая гигиена полости рта важна.", en: "Good oral hygiene is important.", k: "s" },
    { fi: "Koira höristi korviaan.", ru: "Собака навострила уши.", en: "The dog pricked up his ears.", k: "s" },
    { fi: "Eero on sairauslomalla.", ru: "Ээро на больничном.", en: "Eero is on sick leave.", k: "s" },
    { fi: "Poika avaa oven.", ru: "Мальчик открывает дверь.", en: "The boy opens the door.", k: "s" },
    { fi: "Uusi ravintola avattiin eilen.", ru: "Новый ресторан открыли вчера.", en: "A new restaurant opened yesterday.", k: "s" },
    { fi: "Avaisitko ikkunan?", ru: "Ты не мог бы открыть окно?", en: "Could you open the window, please?", k: "s" },
    { fi: "Lepo on paras lääke influenssaan.", ru: "Отдых — лучшее лекарство от гриппа.", en: "Rest is the best medicine for the flu.", k: "s" },
    { fi: "Ville katsoo paljon telkkaria.", ru: "Вилле много смотрит телевизор.", en: "Ville watches TV a lot.", k: "s" },
    { fi: "Pidän siitä paljon.", ru: "Мне это очень нравится.", en: "I like it very much.", k: "s" },
    { fi: "Syön täällä joka päivä.", ru: "Я ем здесь каждый день.", en: "I eat here every day.", k: "s" },
    { fi: "Päätäni särkee.", ru: "У меня болит голова.", en: "I have a headache.", k: "s" },
    { fi: "Ulkona on tuskin yksi aste lämmintä.", ru: "На улице едва один градус тепла.", en: "It is barely one degree outside.", k: "s" },
    { fi: "Siellä on kaksikymmentäviisi astetta lämmintä.", ru: "Там двадцать пять градусов тепла.", en: "It's twenty-five degrees out there.", k: "s" },
    { fi: "Päätä särkee.", ru: "Голова болит.", en: "I have a headache.", k: "s" },
    { fi: "Särkeekö päätäsi?", ru: "У тебя болит голова?", en: "Do you have a headache?", k: "s" },
    { fi: "Elmerin hammasta särkee.", ru: "У Элмери болит зуб.", en: "Elmeri has a toothache.", k: "s" },
    { fi: "Mummin jalkoja särkee öisin.", ru: "У бабушки по ночам ноют ноги.", en: "Grandma's legs ache in the night.", k: "s" },
    { fi: "Hänen päätään on särkenyt koko päivän.", ru: "У неё голова болит весь день.", en: "She's had a headache all day.", k: "s" },
    { fi: "Sydäntä särkee katsoa tuon perheen menoa.", ru: "Сердце разрывается смотреть, как живёт эта семья.", en: "It is heart-breaking to watch that family.", k: "s" },
    { fi: "Silmiäni särkee työpäivän jälkeen.", ru: "Глаза болят после рабочего дня.", en: "My eyes ache after a day at work.", k: "s" },
    { fi: "Päätäni särki illalla, mutta onneksi se meni yön aikana ohi.", ru: "Вечером болела голова, но, к счастью, за ночь прошло.", en: "I had a headache in the evening, but it went by during the night.", k: "s" },
    { fi: "Minulla särkee päätä.", ru: "У меня болит голова.", en: "I have a headache.", k: "s" },
    { fi: "Särkeekö sinulla päätä?", ru: "У тебя болит голова?", en: "Do you have a headache?", k: "s" },
    { fi: "Elmerillä särkee hammasta.", ru: "У Элмери болит зуб.", en: "Elmeri has a toothache.", k: "s" },
    { fi: "Mummilla särkee jalkoja öisin.", ru: "У бабушки по ночам ноют ноги.", en: "Grandma's legs ache in the night.", k: "s" },
    { fi: "Pallo särki ikkunan.", ru: "Мяч разбил окно.", en: "The ball broke the window.", k: "s" },
    { fi: "Joka pojalla on sadetakki.", ru: "У каждого мальчика есть дождевик.", en: "Every boy has a raincoat.", k: "s" },
    { fi: "Jokaisella on sadetakki.", ru: "У каждого есть дождевик.", en: "Everyone has a raincoat.", k: "s" },
  ],
};

/* ------------------------------------------------------------------ */
/*  Урок 19 — Lower Beginner S1 #19 (в магазине: вежливое «вы»)        */
/* ------------------------------------------------------------------ */
const LESSON_19 = {
  id: "LB_S1_19",
  title: "Вежливое «вы» в магазине",
  source: "FinnishPod101 · Lower Beginner S1 #19",
  glossary: [
    { w: "teitittely", ru: "вежливое обращение на Te", en: "polite address",
      forms: ["teitittely", "sinuttelu", "teille", "teitä", "olette", "oletteko", "allekirjoittakaa", "odottakaa", "lukekaa", "henkilötodistuksenne", "saisinko"],
      note: "У финского есть разделение на вежливое teitittely (от te) и обычное sinuttelu (от sinä), как французские vous и tu. Но пользуются им заметно реже: чётких правил нет, многие, особенно молодые, чувствуют себя с ним неловко. Чаще всего вы услышите его от продавцов и официантов, от журналистов при интервью с политиками, и уместно самому обратиться так к незнакомому человеку намного старше себя. На письме вежливое Te пишется с заглавной буквы.\nФормально это второе лицо множественного числа, но с одной важной оговоркой: прилагательные и причастия остаются в единственном числе, хотя местоимение во множественном. Сравните Oletteko jo lopettaneet? (обычное «вы» — нескольким людям) и Oletteko jo lopettanut? (вежливое — одному человеку). А вот притяжательные окончания берут форму множественного числа: henkilötodistuksenne." },
    { w: "persoonaton puhuttelu", ru: "уйти от обращения: 3-е лицо без подлежащего", en: "impersonal address",
      forms: ["voi", "saisi", "saa", "ottaako", "on hyvä ja"],
      note: "Раз непонятно, когда sinuttelu, а когда teitittely, финны часто вообще не обращаются к собеседнику напрямую. Простой приём — 3-е лицо единственного числа без подлежащего, особенно в инструкциях: Kyselylomakkeen voi antaa minulle («Анкету можно отдать мне»), Täällä ei saa tupakoida («Здесь нельзя курить»). Второй приём — говорить о человеке в третьем лице по имени или титулу: Ottaako herra presidentti lisää kahvia? Звучит слегка старомодно, но в некоторых ситуациях уместно." },
    { w: "millainen", ru: "какой, какого рода", en: "what kind of",
      forms: ["millainen", "millaista", "millaisesta", "minkälainen"],
      note: "Вопросительное слово, которое ждёт в ответе прилагательное. Есть целое семейство слов на -lainen: sellainen («такой»), tällainen («вот такой»), tuollainen («вон такой»). Первая часть каждого — генитив местоимения: minkä, sen, tämän, tuon. У millainen есть равноправный вариант minkälainen, у остальных — только одна форма. Обратите внимание: tällainen нарушает гармонию гласных, а в разговорной речи многие говорят tälläinen или tälläne." },
    { w: "solmio", ru: "галстук", en: "necktie",
      forms: ["solmio", "solmiota", "solmiopaidassa"],
      note: "Стандартное слово для длинного узкого галстука. Синонимы: kravatti и разговорные kraka, skraga (последнее — хельсинкский сленг). Бабочка называется solmuke или rusetti. И solmio, и solmuke происходят от solmu («узел»)." },
    { w: "hillitty", ru: "сдержанный, спокойный, неброский", en: "conservative, subdued, composed",
      forms: ["hillitty", "hillitymmän", "hillitysti"],
      note: "Всё, что не бросается в глаза и не выглядит вычурно. Про одежду — без ярких цветов и странного кроя, то есть безопасный вариант для деловой обстановки. Про человека — спокойный, владеющий собой: Hän käyttäytyy aina niin hillitysti." },
    { w: "sopia", ru: "подходить, идти (о вещи); договариваться", en: "to suit, to fit",
      forms: ["sopia", "sopii", "sopisi", "sopivat"],
      note: "И про то, что вещь по размеру, и про то, что она к лицу или сочетается с другой: Tuo väri sopii sinulle, Tämä huivi sopii hyvin tämän takin kanssa. Форма sopisi — кондиционал, вежливое предположение: «подошёл бы»." },
    { w: "etsiä", ru: "искать", en: "to search, to look for",
      forms: ["etsiä", "etsin", "etsit", "etsii", "etsi", "etsiäkseni"],
      note: "Объект при etsiä обычно в партитиве, потому что поиск не завершён: Etsin solmiota, Tutkija etsii muurahaisia." },
    { w: "auttaa", ru: "помогать", en: "to help",
      forms: ["auttaa", "auttavat", "auttoi", "auttaisitko", "voinko auttaa"],
      note: "Тому, кому помогают, — партитив: Myymäläapulainen auttoi minua, Pojat auttavat äitiään. Voinko auttaa? — стандартная фраза продавца." },
    { w: "ajatella", ru: "думать, размышлять; задумывать", en: "to think",
      forms: ["ajatella", "ajattelin", "ajatellut"],
      note: "В отличие от luulla («предполагать», урок 17), ajatella — это обдумывать и намереваться: Ajattelin syödä tänään keittoa. Olette ajatellut — перфект вежливого обращения: «что вы себе присмотрели»." },
    { w: "mieluummin", ru: "лучше, охотнее", en: "rather",
      forms: ["mieluummin"],
      note: "Сравнительная форма наречия: «предпочтительнее». Otatko mieluummin teetä vai kahvia?" },
    { w: "myyjä", ru: "продавец", en: "salesperson", forms: ["myyjä", "myymäläapulainen"] },
    { w: "vihreä", ru: "зелёный", en: "green", forms: ["vihreä"] },
  ],
  items: [
    { fi: "Voinko auttaa?", ru: "Чем могу помочь?", en: "May I help you?", k: "d", who: "Myyjä" },
    { fi: "Etsin solmiota.", ru: "Я ищу галстук.", en: "I'm looking for a necktie.", k: "d", who: "Petri" },
    { fi: "Tuleeko se Teille?", ru: "Это для вас?", en: "Will it be for you?", k: "d", who: "Myyjä" },
    { fi: "Kyllä.", ru: "Да.", en: "Yes.", k: "d", who: "Petri" },
    { fi: "Millaista solmiota olette ajatellut?", ru: "Какой галстук вы себе присмотрели?", en: "What kind of a tie do you have in mind?", k: "d", who: "Myyjä" },
    { fi: "Tämä vihreä sopisi Teille hyvin.", ru: "Этот зелёный вам бы отлично подошёл.", en: "This green one would suit you well.", k: "d", who: "Myyjä" },
    { fi: "Ehkä ottaisin mieluummin jonkin hillitymmän.", ru: "Пожалуй, я бы взял что-нибудь поспокойнее.", en: "I think I'd rather have something more conservative.", k: "d", who: "Petri" },
    { fi: "mieluummin", ru: "лучше, охотнее", en: "rather", k: "w" },
    { fi: "hillitty", ru: "сдержанный, неброский", en: "conservative, subdued", k: "w" },
    { fi: "auttaa", ru: "помогать", en: "to help", k: "w" },
    { fi: "sopia", ru: "подходить, идти", en: "to suit, to fit", k: "w" },
    { fi: "ajatella", ru: "думать, размышлять", en: "to think", k: "w" },
    { fi: "etsiä", ru: "искать", en: "to search", k: "w" },
    { fi: "solmio", ru: "галстук", en: "necktie", k: "w" },
    { fi: "millainen", ru: "какой, какого рода", en: "what kind of", k: "w" },
    { fi: "teitittely", ru: "обращение на «вы»", en: "polite address", k: "w" },
    { fi: "sinuttelu", ru: "обращение на «ты»", en: "casual address", k: "w" },
    { fi: "Otatko mieluummin teetä vai kahvia?", ru: "Ты предпочитаешь чай или кофе?", en: "Would you prefer tea or coffee?", k: "s" },
    { fi: "Hän käyttäytyy aina niin hillitysti.", ru: "Она всегда держится так сдержанно.", en: "She's always so composed.", k: "s" },
    { fi: "Gustavo sanoi, että hän voi auttaa.", ru: "Густаво сказал, что может помочь.", en: "Gustavo said he could help.", k: "s" },
    { fi: "Myymäläapulainen auttoi minua.", ru: "Продавец-консультант мне помог.", en: "The shop assistant helped me.", k: "s" },
    { fi: "Hänen elämäntarkoituksensa oli auttaa toisia ihmisiä.", ru: "Смыслом её жизни было помогать другим людям.", en: "Her purpose in life was to help other people.", k: "s" },
    { fi: "Auttaisitko nostamaan tämän laatikon hyllyyn?", ru: "Не поможешь поднять эту коробку на полку?", en: "Could you help me lift this box on the shelf?", k: "s" },
    { fi: "Pojat auttavat äitiään.", ru: "Сыновья помогают маме.", en: "The sons help their mother.", k: "s" },
    { fi: "Tuo väri sopii sinulle.", ru: "Этот цвет тебе идёт.", en: "That color looks good on you.", k: "s" },
    { fi: "Tämä huivi sopii hyvin tämän takin kanssa.", ru: "Этот шарф хорошо смотрится с этим пальто.", en: "This scarf goes well with this jacket.", k: "s" },
    { fi: "Ajattelin syödä tänään keittoa.", ru: "Я подумал сегодня съесть супа.", en: "I thought I'd eat soup today.", k: "s" },
    { fi: "Mitä etsit?", ru: "Что ты ищешь?", en: "What are you looking for?", k: "s" },
    { fi: "Tutkija etsii muurahaisia.", ru: "Исследователь ищет муравьёв.", en: "The scientist searches for ants.", k: "s" },
    { fi: "Tutkija etsi muurahaisia.", ru: "Исследователь искал муравьёв.", en: "The scientist searched for ants.", k: "s" },
    { fi: "Käytän puhelinluetteloa etsiäkseni puhelinnumeroita.", ru: "Я пользуюсь телефонной книгой, чтобы искать номера.", en: "I use the phone book to search for phone numbers.", k: "s" },
    { fi: "Petrillä on raidallinen solmio.", ru: "У Петри полосатый галстук.", en: "Petri has a striped necktie.", k: "s" },
    { fi: "Mies solmiopaidassa seisoo.", ru: "Мужчина в рубашке с галстуком стоит.", en: "The man in the shirt and tie is standing.", k: "s" },
    { fi: "Millaisesta musiikista pidät?", ru: "Какая музыка тебе нравится?", en: "What kind of music do you like?", k: "s" },
    { fi: "Millaista koulua Helen käy?", ru: "В какую школу ходит Хелен?", en: "What kind of a school does Helen go to?", k: "s" },
    { fi: "Millainen sää Helsingissä on?", ru: "Какая в Хельсинки погода?", en: "What's the weather like in Helsinki?", k: "s" },
    { fi: "Oletteko jo lopettaneet?", ru: "Вы уже закончили? (обычное «вы», нескольким)", en: "Have you finished? (normal plural)", k: "s" },
    { fi: "Oletteko jo lopettanut?", ru: "Вы уже закончили? (вежливо, одному)", en: "Have you finished? (polite, to one person)", k: "s" },
    { fi: "Oletteko tyytyväisiä palveluun?", ru: "Вы довольны обслуживанием? (нескольким)", en: "Are you happy with the service? (normal plural)", k: "s" },
    { fi: "Oletteko tyytyväinen palveluun?", ru: "Вы довольны обслуживанием? (вежливо, одному)", en: "Are you happy with the service? (polite)", k: "s" },
    { fi: "Te olette Suomen ensimmäiset mitalistit.", ru: "Вы первые медалисты Финляндии. (нескольким)", en: "You are Finland's first medalists. (normal plural)", k: "s" },
    { fi: "Te olette Suomen ensimmäinen mitalisti.", ru: "Вы первый медалист Финляндии. (вежливо, одному)", en: "You are Finland's first medalist. (polite)", k: "s" },
    { fi: "Allekirjoittakaa tähän, kiitos.", ru: "Подпишите здесь, пожалуйста.", en: "Please sign here.", k: "s" },
    { fi: "Odottakaa tuossa aulassa, lääkäri kutsuu Teitä nimellä.", ru: "Подождите в том холле, врач вызовет вас по имени.", en: "Please wait in the hall, the doctor will call you by name.", k: "s" },
    { fi: "Lukekaa ohje huolellisesti.", ru: "Прочитайте инструкцию внимательно.", en: "Please read the instruction carefully.", k: "s" },
    { fi: "Saisinko nähdä henkilötodistuksenne?", ru: "Можно ваш документ?", en: "May I see your ID card, please?", k: "s" },
    { fi: "Kyselylomakkeen voi antaa minulle.", ru: "Анкету можно отдать мне.", en: "The questionnaire can be given to me.", k: "s" },
    { fi: "Mitä tänne saisi olla?", ru: "Что вам подать?", en: "What would you like to have?", k: "s" },
    { fi: "Täällä ei saa tupakoida.", ru: "Здесь нельзя курить.", en: "It is not allowed to smoke here.", k: "s" },
    { fi: "Ottaako herra presidentti lisää kahvia?", ru: "Господин президент желает ещё кофе?", en: "Mr. President, would you like some more coffee?", k: "s" },
    { fi: "Lahtinen on hyvä ja ottaa lisää leipää.", ru: "Господин Лахтинен, возьмите ещё хлеба.", en: "Please have some more bread, Mr. Lahtinen.", k: "s" },
  ],
};

/* ------------------------------------------------------------------ */
/*  Урок 20 — Lower Beginner S1 #20 (сравнительная степень)            */
/* ------------------------------------------------------------------ */
const LESSON_20 = {
  id: "LB_S1_20",
  title: "Что лучше: сравнительная степень",
  source: "FinnishPod101 · Lower Beginner S1 #20",
  glossary: [
    { w: "komparatiivi", ru: "сравнительная степень: -mpi", en: "comparative of adjectives",
      forms: ["lyhyempi", "kapeampi", "leveämpi", "mukavampi", "isompi", "lämpimämpi", "tuulisempi", "helpompi", "pienempi", "sairaampi", "kipeämpi", "hillitympi", "terveempi", "kivempi", "mustempi", "hauskempi", "kylmempi", "parempi", "suurempi", "hillitymmän", "lyhyemmästä", "isompana", "lämpimämpää", "leveämmät", "paremmalla", "paremmin", "kylmemmässä", "mustempia", "hauskempaa"],
      note: "Можно, конечно, сказать enemmän («более»), но обычно берут особую форму: к гласной основе прилагательного добавляется -mpi. Iso → isompi, leveä → leveämpi, lyhyt (основа lyhye-) → lyhyempi, lämmin (основа lämpimä-) → lämpimämpi, terve (основа tervee-) → terveempi.\nОдно исключение из правила: если в прилагательном два слога и оно кончается на a или ä, этот конечный гласный переходит в e. Kiva → kivempi, musta → mustempi, hauska → hauskempi, kylmä → kylmempi. Но kapea и mukava длиннее двух слогов, поэтому у них kapeampi, mukavampi.\nПри склонении -mpi превращается в -mpa-/-mpä- либо -mma-/-mmä-: isompana, lyhyemmästä, leveämmät, paremmalla, kylmemmässä. И, как во многих языках, hyvä («хороший») ведёт себя не по правилам: hyvä → parempi." },
    { w: "kuin", ru: "чем; как (при сравнении)", en: "than, as",
      forms: ["kuin", "yhtä"],
      note: "Схема сравнения: A on ... kuin B. Kuin всегда стоит перед B — тем, с чем сравнивают: Pekka on lyhyempi kuin Matti. Если из контекста и так ясно, с чем сравнивают, B опускают вместе с kuin: Tämä on mukavampi.\nТо же kuin работает с enemmän («больше»), vähemmän («меньше») и yhtä paljon («столько же»): Minulla on enemmän veljiä kuin Jaakolla, Eerolla on yhtä paljon töitä kuin Kallella. Конструкция yhtä + прилагательное значит «такой же»: Emmi on yhtä pitkä kuin Helen." },
    { w: "löytyä", ru: "найтись, обнаружиться; быть в наличии", en: "to be found",
      forms: ["löytyä", "löytyy", "löytyykö", "löytyi", "löytynyt", "löytää"],
      note: "Пара к löytää («найти»). Разница в том, кто подлежащее: при löytää подлежащее — тот, кто ищет и находит, при löytyä — сама вещь, которая нашлась. По смыслу это финский аналог английского пассива: Tämä kaulakoru löytyi kadulta («Ожерелье нашлось на улице»). В магазине löytyä значит «есть в наличии»: Löytyykö tätä mekkoa isompana?" },
    { w: "vähän", ru: "немного, чуть-чуть; мало", en: "a bit, a little, a few",
      forms: ["vähän", "vähemmän"],
      note: "Значит и «немного» (vähän pienempi — «немного меньше», Minulla on vähän rahaa — «у меня есть немного денег»), и «мало» — особенно после vain («только») или hyvin («очень»): Minulla on vain vähän rahaa («у меня совсем мало денег»). Годится и с исчисляемым, и с неисчисляемым: vähän maitoa, vähän ihmisiä." },
    { w: "mekko", ru: "платье", en: "dress",
      forms: ["mekko", "mekon", "mekosta", "mekkoa", "kotelomekko", "kukkamekko"],
      note: "Женское платье, и повседневное, и нарядное. Но у самых торжественных нарядов своё слово с puku («костюм»): iltapuku («вечернее платье»), hääpuku («свадебное»). Составные: kotelomekko («платье-футляр»), kukkamekko («летнее платье в цветочек»)." },
    { w: "koko", ru: "размер", en: "size",
      forms: ["koko", "kokoa", "kokona"],
      note: "Не путайте с неизменяемым koko («весь, целый») из урока 7 — пишутся одинаково, различает контекст. Yhtä kokoa isompana — «на один размер больше»." },
    { w: "kysyä", ru: "спрашивать", en: "to ask",
      forms: ["kysyä", "kysyn", "kysyy", "kysyi", "kysy", "kysymys", "kysymyksen", "kysyttävää"],
      note: "У кого спрашивают — аблатив (-lta/-ltä): Opettaja kysyy oppilaalta kysymyksen, kysy minulta." },
    { w: "iso", ru: "большой", en: "big", forms: ["iso", "isompi", "isompana", "isoon"] },
    { w: "lyhyt", ru: "короткий; невысокий", en: "short", forms: ["lyhyt", "lyhyempi", "lyhyemmästä"] },
    { w: "leveä", ru: "широкий", en: "wide", forms: ["leveä", "leveämpi", "leveät", "leveämmät"] },
    { w: "kapea", ru: "узкий, тонкий", en: "narrow", forms: ["kapea", "kapealle", "kapeampi"] },
    { w: "terve", ru: "здоровый", en: "healthy", forms: ["terve", "terveempi"] },
  ],
  items: [
    { fi: "Mitä pidät tästä mekosta?", ru: "Как тебе это платье?", en: "How do you like this dress?", k: "d", who: "Satu" },
    { fi: "Se lyhyempi mekko oli parempi kuin tuo.", ru: "То платье, что покороче, было лучше этого.", en: "The shorter dress was better than that.", k: "d", who: "Petri" },
    { fi: "Se oli liian kapea.", ru: "Оно было слишком узкое.", en: "It was too narrow.", k: "d", who: "Satu" },
    { fi: "Tämä on mukavampi, koska tämä on vähän leveämpi.", ru: "Это удобнее, потому что оно немного шире.", en: "This one is more comfortable, because this is a bit wider.", k: "d", who: "Satu" },
    { fi: "Ehkä siitä lyhyemmästä löytyy isompi koko.", ru: "Может, того короткого найдётся размер побольше.", en: "Maybe they have a bigger size of the shorter one.", k: "d", who: "Petri" },
    { fi: "Voinhan minä kysyä.", ru: "Ну могу и спросить.", en: "Well, I can ask.", k: "d", who: "Satu" },
    { fi: "Anteeksi, löytyykö tätä mekkoa yhtä kokoa isompana?", ru: "Извините, а это платье есть на размер больше?", en: "Excuse me, do you have this dress in one size bigger?", k: "d", who: "Satu" },
    { fi: "mekko", ru: "платье", en: "dress", k: "w" },
    { fi: "leveä", ru: "широкий", en: "wide", k: "w" },
    { fi: "löytyä", ru: "найтись, быть в наличии", en: "to be found", k: "w" },
    { fi: "kysyä", ru: "спрашивать", en: "to ask", k: "w" },
    { fi: "vähän", ru: "немного, чуть-чуть", en: "a bit, a little", k: "w" },
    { fi: "koko", ru: "размер", en: "size", k: "w" },
    { fi: "iso", ru: "большой", en: "big", k: "w" },
    { fi: "lyhyt", ru: "короткий", en: "short", k: "w" },
    { fi: "kuin", ru: "чем (при сравнении)", en: "than", k: "w" },
    { fi: "kapea", ru: "узкий", en: "narrow", k: "w" },
    { fi: "parempi", ru: "лучше", en: "better", k: "w" },
    { fi: "Hänellä on tänään uusi mekko yllään.", ru: "На ней сегодня новое платье.", en: "She is wearing a new dress today.", k: "s" },
    { fi: "Minkä mekon ottaisin?", ru: "Какое платье мне взять?", en: "Which dress shall I take?", k: "s" },
    { fi: "Ilmarilla on leveät housut.", ru: "У Илмари широкие брюки.", en: "Ilmari has wide trousers.", k: "s" },
    { fi: "Tämä kaulakoru löytyi äsken kadulta.", ru: "Это ожерелье только что нашлось на улице.", en: "This necklace was just found on the street.", k: "s" },
    { fi: "Onko syyllinen löytynyt?", ru: "Виновного нашли?", en: "Has the culprit been found?", k: "s" },
    { fi: "Yliopisto-opiskelija kysyy kysymyksen.", ru: "Студент задаёт вопрос.", en: "The university student asks a question.", k: "s" },
    { fi: "Opettaja kysyy oppilaalta kysymyksen.", ru: "Учитель задаёт ученику вопрос.", en: "The teacher is asking the student a question.", k: "s" },
    { fi: "Jos sinulla on jotain kysyttävää, kysy minulta nyt.", ru: "Если есть что спросить, спроси меня сейчас.", en: "If you have any questions, please ask me now.", k: "s" },
    { fi: "Mari kysyi, saammeko raportin valmiiksi tänään.", ru: "Мари спросила, успеем ли мы доделать отчёт сегодня.", en: "Mari asked if we'll manage to finish the report today.", k: "s" },
    { fi: "Saisinko vähän lisää?", ru: "Можно немного добавки?", en: "May I have some more, please?", k: "s" },
    { fi: "Saisinko vähän teetä?", ru: "Можно немного чая?", en: "May I have a little tea, please?", k: "s" },
    { fi: "Minulla on vähän päänsärkyä.", ru: "У меня слегка болит голова.", en: "I have a bit of a headache.", k: "s" },
    { fi: "Internetissä myytävien vaatteiden kokoa on vaikea selvittää.", ru: "Размер одежды, которую продают в интернете, трудно определить.", en: "It is difficult to figure out the size of the clothes sold on the Internet.", k: "s" },
    { fi: "Tämä koko on minulle liian pieni.", ru: "Этот размер мне мал.", en: "This size is too small for me.", k: "s" },
    { fi: "Tuo pöytä on liian iso hänen pieneen toimistoonsa.", ru: "Тот стол слишком большой для её маленького кабинета.", en: "That desk is too big for this small office.", k: "s" },
    { fi: "Tämä takki on minulle liian iso.", ru: "Эта куртка мне велика.", en: "This coat is too big for me.", k: "s" },
    { fi: "Tiinan koira on iso.", ru: "Собака Тийны большая.", en: "Tiina's dog is big.", k: "s" },
    { fi: "Pekka on lyhyempi kuin Matti.", ru: "Пекка ниже Матти.", en: "Pekka is shorter than Matti.", k: "s" },
    { fi: "Onko Eppu Normaali parempi kuin Yö?", ru: "«Эппу Нормаали» лучше, чем «Юё»?", en: "Is Eppu Normaali better than Yö?", k: "s" },
    { fi: "Emmi on yhtä pitkä kuin Helen.", ru: "Эмми такого же роста, как Хелен.", en: "Emmi is as tall as Helen.", k: "s" },
    { fi: "Meksiko on suurempi kuin Belize.", ru: "Мексика больше Белиза.", en: "Mexico is bigger than Belize.", k: "s" },
    { fi: "Minusta tuntui kuin minua tarkkailtaisiin, kun käännyin kapealle kadulle.", ru: "Мне казалось, будто за мной следят, когда я свернул на узкую улицу.", en: "I felt I was being watched when I turned into the narrow street.", k: "s" },
    { fi: "Piirrä tähän kapea viiva.", ru: "Нарисуй здесь тонкую линию.", en: "Draw a thin line here.", k: "s" },
    { fi: "Huomenna on lämpimämpää kuin tänään.", ru: "Завтра будет теплее, чем сегодня.", en: "It'll be warmer tomorrow than today.", k: "s" },
    { fi: "Ruskea sohva on mukavampi kuin valkoinen.", ru: "Коричневый диван удобнее белого.", en: "The brown sofa is more comfortable than the white one.", k: "s" },
    { fi: "Onko sinulla lyhyempi matka kotiin kuin minulla?", ru: "Тебе до дома ближе, чем мне?", en: "Do you have a shorter way home than I have?", k: "s" },
    { fi: "Ville on isompi kuin Markku.", ru: "Вилле крупнее Маркку.", en: "Ville is bigger than Markku.", k: "s" },
    { fi: "Erkki on tänään sairaampi kuin eilen, mutta huomenna hän on varmasti jo terveempi.", ru: "Эркки сегодня болеет сильнее, чем вчера, но завтра наверняка будет уже здоровее.", en: "Erkki is more sick today than he was yesterday, but tomorrow he will surely be healthier.", k: "s" },
    { fi: "Nämä housut ovat leveämmät kuin nuo toiset.", ru: "Эти брюки шире тех.", en: "These trousers are wider than those other ones.", k: "s" },
    { fi: "Tulkaa uudelleen paremmalla ajalla.", ru: "Приходите ещё раз, когда будет побольше времени.", en: "Come again when you have more time.", k: "s" },
    { fi: "Ruoka säilyisi paremmin kylmemmässä.", ru: "Еда сохранилась бы лучше в прохладе.", en: "Food would keep better in a lower temperature.", k: "s" },
    { fi: "Edessä on mustempia pilviä kuin takana.", ru: "Впереди тучи чернее, чем позади.", en: "There are darker clouds in front of than behind of us.", k: "s" },
    { fi: "Lomalla olisi hauskempaa kuin töissä.", ru: "В отпуске было бы веселее, чем на работе.", en: "It would be more fun on vacation than at work.", k: "s" },
    { fi: "Minulla on enemmän veljiä kuin Jaakolla.", ru: "У меня больше братьев, чем у Яакко.", en: "I have more brothers than Jaakko.", k: "s" },
    { fi: "Tässä lasissa on enemmän maitoa kuin tuossa.", ru: "В этом стакане больше молока, чем в том.", en: "There is more milk in this glass than in that one.", k: "s" },
    { fi: "Eerolla on yhtä paljon töitä kuin Kallella.", ru: "У Ээро столько же работы, сколько у Калле.", en: "Eero has as much work as Kalle.", k: "s" },
  ],
};

const LESSONS_EXTRA = [
{
  id: "LB_S1_01",
  title: "Рассказ о себе",
  source: "FinnishPod101 · Lower Beginner S1 #1",
  glossary: [
    { w: "nominatiivi", ru: "номинатив — словарная форма", en: "nominative", forms: ["kalle", "omena", "poliisi", "varas", "maito", "pojat"],
      note: "Словарная форма существительного, прилагательного, числительного или местоимения. Обычно это подлежащее и всегда — нечто целое, в отличие от партитива, который выражает часть. В финском порядок слов свободный, роль слова показывает окончание, а не место в предложении." },
    { w: "partitiivi", ru: "партитив — часть, незавершённость", en: "partitive", forms: ["omenaa", "maitoa", "kylmää", "jalkapalloa", "taloa", "tiinaa", "onnea", "mielenkiintoista", "työtä", "rahaa"],
      note: "Обозначает часть, неопределённое количество или незаконченное действие: Maija söi omenaa («Майя ела яблоко») против Maija söi omenan («съела яблоко целиком»). Партитив обязателен в отрицаниях и часто в вопросах. Окончание -a/-ä или -ta/-tä." },
    { w: "genetiivi", ru: "генитив — принадлежность и завершённость", en: "genitive", forms: ["tiinan", "paikan", "talon", "mukin", "työn", "omenan", "varkaan"],
      note: "Окончание -n. Показывает принадлежность (Tiinan hame — «юбка Тийны») или что действие охватило объект целиком и завершилось: Maalari maalasi talon punaiseksi." },
    { w: "astevaihtelu", ru: "чередование ступеней согласных", en: "consonant gradation", forms: ["paikan", "mukin", "isomman", "kaupassa"],
      note: "Основа слова меняется при добавлении окончаний, если в ней есть k, p или t: kk>k, pp>p, tt>t, а также t>d, p>v, mp>mm. Paikka → paikan, muki → mukin. Затрагивает и существительные, и глаголы. Некоторые новые заимствования (auto, muki) не затрагиваются." },
    { w: "paikka", ru: "место; должность, работа", en: "place, position, job", forms: ["paikka", "paikan", "paikkaa"],
      note: "Используется почти везде, где по-русски «место»: и физическое, и переносное. Может значить место в театре (Haluan hyvän paikan) и рабочее место — тогда часто в форме työpaikka, что значит и «работа», и «место работы»." },
    { w: "onni", ru: "удача; счастье", en: "luck, happiness", forms: ["onni", "onnea", "onnen"],
      note: "Одно слово покрывает и удачу в азартной игре, и тихое счастье от хорошей книги или прогулки с другом." },
    { w: "aloittaa", ru: "начинать (что-то)", en: "to start, to begin", forms: ["aloittaa", "aloitan", "aloitti", "aloitin"],
      note: "Переходный глагол, всегда нужен объект: Tiina aloitti uuden kirjan. Сказать «книга началась» через aloittaa нельзя — для этого есть непереходный alkaa: Kirja alkoi hyvin." },
    { w: "ohjelmoija", ru: "программист", en: "programmer", forms: ["ohjelmoija", "ohjelmoijan"] },
    { w: "mielenkiintoinen", ru: "интересный", en: "interesting", forms: ["mielenkiintoinen", "mielenkiintoista"] },
    { w: "saada", ru: "получать", en: "to get, to receive", forms: ["saada", "saan", "saa", "sain", "sai"] },
    { w: "työ", ru: "работа", en: "work, job", forms: ["työ", "työn", "työtä"] },
    { w: "kun", ru: "когда", en: "when", forms: ["kun"] },
    { w: "tänään", ru: "сегодня", en: "today", forms: ["tänään"] },
    { w: "uusi", ru: "новый", en: "new", forms: ["uusi", "uuden", "uutta", "uusia"] }
  ],
  items: [
    { fi: "Minä olen Petri Lahtinen.", ru: "Я Петри Лахтинен.", en: "I'm Petri Lahtinen.", k: "d", who: "Petri" },
    { fi: "Olen ohjelmoija.", ru: "Я программист.", en: "I'm a programmer.", k: "d", who: "Petri" },
    { fi: "Aloitan tänään uuden työn.", ru: "Сегодня я начинаю новую работу.", en: "I'll start a new job today.", k: "d", who: "Petri" },
    { fi: "Se on mielenkiintoista.", ru: "Это интересно.", en: "It's interesting.", k: "d", who: "Petri" },
    { fi: "Minulla oli onnea, kun sain paikan.", ru: "Мне повезло, что я получил это место.", en: "I was lucky to get the job.", k: "d", who: "Petri" },
    { fi: "paikka", ru: "место; работа", en: "place, job", k: "w" },
    { fi: "ohjelmoija", ru: "программист", en: "programmer", k: "w" },
    { fi: "mielenkiintoinen", ru: "интересный", en: "interesting", k: "w" },
    { fi: "onni", ru: "удача, счастье", en: "luck, happiness", k: "w" },
    { fi: "saada", ru: "получать", en: "to get", k: "w" },
    { fi: "työ", ru: "работа", en: "work", k: "w" },
    { fi: "kun", ru: "когда", en: "when", k: "w" },
    { fi: "aloittaa", ru: "начинать", en: "to start", k: "w" },
    { fi: "tänään", ru: "сегодня", en: "today", k: "w" },
    { fi: "uusi", ru: "новый", en: "new", k: "w" },
    { fi: "Onko tämä varmasti oikea paikka?", ru: "Это точно нужное место?", en: "Are you sure this is the right place?", k: "s" },
    { fi: "Ohjelmoija käytti tietokonetta.", ru: "Программист пользовался компьютером.", en: "The programmer used the computer.", k: "s" },
    { fi: "Tämä kirja on todella mielenkiintoinen.", ru: "Эта книга действительно интересная.", en: "This book is really interesting.", k: "s" },
    { fi: "Raha ei tuo onnea.", ru: "Деньги не приносят счастья.", en: "Money doesn't make you happy.", k: "s" },
    { fi: "Mies saa rahaa.", ru: "Мужчина получает деньги.", en: "The man receives money.", k: "s" },
    { fi: "Etsin uutta työtä.", ru: "Я ищу новую работу.", en: "I'm looking for a new job.", k: "s" },
    { fi: "Tulen heti, kun tämä on valmis.", ru: "Приду сразу, как это будет готово.", en: "I'll come as soon as this is ready.", k: "s" },
    { fi: "Aloitan huomenna uuden kirjan.", ru: "Завтра начну новую книгу.", en: "I'll start a new book tomorrow.", k: "s" },
    { fi: "Paraati on tänään.", ru: "Парад сегодня.", en: "The parade is today.", k: "s" },
    { fi: "Olen tänään kiireinen.", ru: "Я сегодня занят.", en: "I'm busy today.", k: "s" },
    { fi: "Tiinalla on uusi kampaus.", ru: "У Тийны новая причёска.", en: "Tiina has a new hairstyle.", k: "s" },
    { fi: "Kalle on poika.", ru: "Калле — мальчик.", en: "Kalle is a boy.", k: "s" },
    { fi: "Omena on kylmä.", ru: "Яблоко холодное.", en: "The apple is cold.", k: "s" },
    { fi: "Maito kaatui pöydälle.", ru: "Молоко разлилось на стол (всё).", en: "All the milk was spilled on the table.", k: "s" },
    { fi: "Maitoa kaatui pöydälle.", ru: "Немного молока пролилось на стол.", en: "Some milk was spilled on the table.", k: "s" },
    { fi: "Pojat pelaavat jalkapalloa.", ru: "Мальчики играют в футбол.", en: "The boys play soccer.", k: "s" },
    { fi: "Poliisi ottaa varkaan kiinni.", ru: "Полиция поймает вора.", en: "The police will catch the thief.", k: "s" },
    { fi: "Maija söi omenaa.", ru: "Майя ела яблоко (часть).", en: "Maija ate some apple.", k: "s" },
    { fi: "Maija söi omenan.", ru: "Майя съела яблоко целиком.", en: "Maija ate an entire apple.", k: "s" },
    { fi: "Maito on kylmää.", ru: "Молоко холодное.", en: "The milk is cold.", k: "s" },
    { fi: "Maalari maalasi taloa.", ru: "Маляр красил дом (процесс).", en: "The painter was painting a house.", k: "s" },
    { fi: "Maalari maalasi talon punaiseksi.", ru: "Маляр покрасил дом в красный.", en: "The painter painted the house red.", k: "s" },
    { fi: "Oletko nähnyt Tiinaa?", ru: "Ты видел Тийну?", en: "Have you seen Tiina?", k: "s" },
    { fi: "En ole nähnyt Tiinaa.", ru: "Я не видел Тийну.", en: "I haven't seen Tiina.", k: "s" },
    { fi: "Tiinan hame on sininen.", ru: "Юбка Тийны синяя.", en: "Tiina's skirt is blue.", k: "s" },
    { fi: "Tämä paikka on vapaa.", ru: "Это место свободно.", en: "This seat is free.", k: "s" },
    { fi: "Haluan hyvän paikan.", ru: "Я хочу хорошее место.", en: "I want a good seat.", k: "s" },
    { fi: "Äiti lukee kirjaa.", ru: "Мама читает книгу.", en: "Mother is reading a book.", k: "s" },
    { fi: "Haluan isomman mukin.", ru: "Я хочу кружку побольше.", en: "I want a bigger mug.", k: "s" }
  ]
},
{
  id: "LB_S1_02",
  title: "Как спросить дорогу",
  source: "FinnishPod101 · Lower Beginner S1 #2",
  glossary: [
    { w: "anteeksi", ru: "извините; простите", en: "excuse me, I'm sorry", forms: ["anteeksi"],
      note: "Просят прощения за проступок и вежливо привлекают внимание. Можно уточнить, за что: Anteeksi, että häiritsen («Простите, что беспокою»). Важно: в отличие от английского I'm sorry, это НЕ выражение сочувствия — «сочувствую вашей утрате» через anteeksi не скажешь." },
    { w: "sisäpaikallissijat", ru: "внутренние местные падежи: -ssa / -sta / -Vn", en: "inner locative cases", forms: ["talossa", "talosta", "taloon", "kaapissa", "kaapista", "kaappiin", "puistossa", "puistoon", "järvessä", "järvestä", "järveen", "risteyksestä", "kulmasta", "valoista"],
      note: "Инессив (-ssa/-ssä) — «в», элатив (-sta/-stä) — «из», иллатив (гласный + n) — «в (куда)». Про замкнутое пространство: коробка, дом, шкаф. Обратите внимание на чередование: kaapissa — kaapista — kaappiin." },
    { w: "ulkopaikallissijat", ru: "внешние местные падежи: -lla / -lta / -lle", en: "outer locative cases", forms: ["pihalla", "pihalta", "pihalle", "pöydällä", "pöydältä", "pöydälle", "torilla", "rannalla", "oikealle", "vasemmalle", "vasemmalta", "kadulla", "laiturilta", "bussipysäkille"],
      note: "Адессив (-lla/-llä) — «на», аблатив (-lta/-ltä) — «с», аллатив (-lle) — «на (куда)». Про поверхность: стол, пол, площадь. Направления тоже идут сюда: oikealle, vasemmalle." },
    { w: "oikea", ru: "правый; правильный, настоящий", en: "right; correct", forms: ["oikea", "oikealle", "oikealla", "oikean"],
      note: "Как и в английском right, у слова два значения: «правый» (не левый) и «верный, правильный»." },
    { w: "näkyä", ru: "быть видимым, виднеться", en: "to be visible", forms: ["näkyä", "näkyy", "näkyi", "näkynyt"],
      note: "Непереходный глагол: объекта у него нет, а то, что видно, — подлежащее. Puistossa ei näkynyt lapsia («В парке не было видно детей»)." },
    { w: "kääntyä", ru: "поворачивать(ся)", en: "to turn", forms: ["kääntyä", "käänny", "kääntyy", "käännyt", "kääntykää", "kääntyminen"] },
    { w: "risteys", ru: "перекрёсток", en: "crossing", forms: ["risteys", "risteyksestä", "risteyksessä"] },
    { w: "suora", ru: "прямой", en: "straight", forms: ["suora", "suoraan"] },
    { w: "pitkä", ru: "длинный, долгий", en: "long", forms: ["pitkä", "pitkälle", "pitkään"] },
    { w: "vasen", ru: "левый", en: "left", forms: ["vasen", "vasemmalle", "vasemmalla", "vasemmalta"] },
    { w: "puisto", ru: "парк", en: "park", forms: ["puisto", "puistossa", "puistoon", "puistosta"] },
    { w: "seuraava", ru: "следующий", en: "next", forms: ["seuraava", "seuraavasta", "seuraavista"] }
  ],
  items: [
    { fi: "Anteeksi, mutta missä on Lönnrotinkatu?", ru: "Извините, а где улица Лённротинкату?", en: "Excuse me, but where is Lönnrotinkatu?", k: "d", who: "Petri" },
    { fi: "Käänny seuraavasta risteyksestä oikealle ja sitten suoraan.", ru: "Поверните на следующем перекрёстке направо, а потом прямо.", en: "Turn right at the next crossing, and then straight.", k: "d", who: "Ohikulkija" },
    { fi: "Kuinka pitkälle?", ru: "Как далеко?", en: "How far?", k: "d", who: "Petri" },
    { fi: "Kun vasemmalta näkyy puisto, olet Lönnrotinkadulla.", ru: "Когда слева покажется парк, вы на Лённротинкату.", en: "When you see a park on the left, you're in Lönnrotinkatu.", k: "d", who: "Ohikulkija" },
    { fi: "Kiitos!", ru: "Спасибо!", en: "Thank you!", k: "d", who: "Petri" },
    { fi: "anteeksi", ru: "извините", en: "excuse me", k: "w" },
    { fi: "suora", ru: "прямой", en: "straight", k: "w" },
    { fi: "pitkä", ru: "длинный, долгий", en: "long", k: "w" },
    { fi: "näkyä", ru: "быть видимым", en: "to be visible", k: "w" },
    { fi: "oikea", ru: "правый; правильный", en: "right", k: "w" },
    { fi: "vasen", ru: "левый", en: "left", k: "w" },
    { fi: "puisto", ru: "парк", en: "park", k: "w" },
    { fi: "kääntyä", ru: "поворачивать", en: "to turn", k: "w" },
    { fi: "seuraava", ru: "следующий", en: "next", k: "w" },
    { fi: "risteys", ru: "перекрёсток", en: "crossing", k: "w" },
    { fi: "Anteeksi, että olen myöhässä.", ru: "Извините, что опоздал.", en: "I'm sorry I'm late.", k: "s" },
    { fi: "Tämä tie on suora.", ru: "Эта дорога прямая.", en: "This road is straight.", k: "s" },
    { fi: "Sinne on pitkä matka.", ru: "Туда далеко.", en: "It's a long way there.", k: "s" },
    { fi: "Taivaalla näkyy tähtiä.", ru: "На небе видны звёзды.", en: "You can see stars in the sky.", k: "s" },
    { fi: "Käänny oikealle seuraavista valoista.", ru: "Поверни направо на следующем светофоре.", en: "Turn right at the next light.", k: "s" },
    { fi: "Suomessa ajamme oikealla puolella.", ru: "В Финляндии мы ездим по правой стороне.", en: "In Finland we drive on the right side.", k: "s" },
    { fi: "Se on vasemmalla puolella.", ru: "Это с левой стороны.", en: "It's on the left side.", k: "s" },
    { fi: "Älä koskaan käänny vasemmalle tästä.", ru: "Никогда не поворачивай здесь налево.", en: "Never turn left here.", k: "s" },
    { fi: "Pariskunta kävelee puistossa.", ru: "Пара гуляет в парке.", en: "The couple is walking in the park.", k: "s" },
    { fi: "Isä saapuu puistoon.", ru: "Папа приходит в парк.", en: "The father arrives at the park.", k: "s" },
    { fi: "Jos käännyt tästä vasemmalle, saavut umpikujalle.", ru: "Если повернёшь здесь налево, попадёшь в тупик.", en: "If you turn left here, you will come to a dead end.", k: "s" },
    { fi: "Kääntykää ensin vasemmalle, sitten oikealle.", ru: "Поверните сначала налево, потом направо.", en: "First turn left, then right.", k: "s" },
    { fi: "Tämä on vilkas risteys.", ru: "Это оживлённый перекрёсток.", en: "This is a busy crossing.", k: "s" },
    { fi: "Jussi on talossa.", ru: "Юсси в доме.", en: "Jussi is in the house.", k: "s" },
    { fi: "Jussi tulee talosta.", ru: "Юсси выходит из дома.", en: "Jussi comes out of the house.", k: "s" },
    { fi: "Jussi menee taloon.", ru: "Юсси идёт в дом.", en: "Jussi goes into the house.", k: "s" },
    { fi: "Ota lautanen kaapista.", ru: "Возьми тарелку из шкафа.", en: "Take the plate from the cabinet.", k: "s" },
    { fi: "Laita lautanen kaappiin.", ru: "Положи тарелку в шкаф.", en: "Put the plate in the cabinet.", k: "s" },
    { fi: "Puistossa on paljon ihmisiä.", ru: "В парке много людей.", en: "There are a lot of people in the park.", k: "s" },
    { fi: "Isä ui mielellään järvessä.", ru: "Папа любит плавать в озере.", en: "Dad likes to swim in the lake.", k: "s" },
    { fi: "Anteeksi, mutta missä olen?", ru: "Извините, а где я нахожусь?", en: "Excuse me, but where am I?", k: "s" },
    { fi: "Minne tämä tie vie?", ru: "Куда ведёт эта дорога?", en: "Where does this road go?", k: "s" },
    { fi: "Se on tässä ihan lähellä.", ru: "Это тут совсем рядом.", en: "It's quite close by here.", k: "s" },
    { fi: "Käänny liikennevaloista vasemmalle.", ru: "Поверни на светофоре налево.", en: "Turn left at the traffic lights.", k: "s" },
    { fi: "Aja viisi kilometriä pohjoiseen ja sitten käänny länteen.", ru: "Проедь пять километров на север, потом поверни на запад.", en: "Drive five kilometers north and then turn west.", k: "s" },
    { fi: "Jussi on pihalla.", ru: "Юсси во дворе.", en: "Jussi is in the yard.", k: "s" },
    { fi: "Ota lautanen pöydältä.", ru: "Возьми тарелку со стола.", en: "Take the plate from the table.", k: "s" },
    { fi: "Laita lautanen pöydälle.", ru: "Поставь тарелку на стол.", en: "Put the plate on the table.", k: "s" },
    { fi: "Millä kadulla teatteri on?", ru: "На какой улице театр?", en: "What street is the theater on?", k: "s" },
    { fi: "Miltä laiturilta juna lähtee?", ru: "С какой платформы уходит поезд?", en: "Which platform will the train leave from?", k: "s" },
    { fi: "Onko sinne pitkä matka täältä?", ru: "Отсюда туда далеко?", en: "Is it a long way from here?", k: "s" }
  ]
},
{
  id: "LB_S1_03",
  title: "В офисе: что где стоит",
  source: "FinnishPod101 · Lower Beginner S1 #3",
  glossary: [
    { w: "postpositiot", ru: "послелоги: ориентир идёт в генитиве", en: "postpositions with genitive", forms: ["takana", "vieressä", "edessä", "sivulla", "päällä", "alla", "keskellä", "sisällä", "ulkopuolella", "yläpuolella", "alapuolella", "lähellä"],
      note: "Схема: A on B:n [направление]. Ориентир B ставится в генитив, а слово направления идёт ПОСЛЕ него (в русском и английском — перед): Puu on talon takana («Дерево за домом»). Порядок A и B может меняться, но слово направления всегда сразу после B." },
    { w: "vieressä", ru: "рядом с", en: "next to", forms: ["vieressä", "vierestä", "viereen"],
      note: "Vieressä и edessä — бывшие существительные в инессиве, поэтому у них есть родня в других падежах: vierestä («от, со стороны»), viereen («к»), edestä, eteen. Два слова — а падежных форм шесть." },
    { w: "edessä", ru: "перед", en: "in front of", forms: ["edessä", "edestä", "eteen"] },
    { w: "lehtihylly", ru: "полка для газет и журналов", en: "magazine shelf", forms: ["lehtihylly", "lehtihyllyssä"],
      note: "Сложное слово: lehti + hylly. Hylly — любая полка. А вот lehti очень широкое: и лист растения, и газета, и журнал, и комикс. Уточняют приставкой: sanomalehti (газета), aikakauslehti (журнал), sarjakuvalehti (комикс)." },
    { w: "toimisto", ru: "офис", en: "office", forms: ["toimisto", "toimistossa", "toimistoni", "toimistoomme"] },
    { w: "keittiö", ru: "кухня", en: "kitchen", forms: ["keittiö", "keittiössä", "keittiötä", "keittiön"] },
    { w: "naulakko", ru: "вешалка", en: "coat rack", forms: ["naulakko", "naulakon", "naulakkoon"] },
    { w: "ikkuna", ru: "окно", en: "window", forms: ["ikkuna", "ikkunan", "ikkunaa", "ikkunasta"] },
    { w: "avain", ru: "ключ", en: "key", forms: ["avain", "avaimen"] },
    { w: "nurkka", ru: "угол", en: "corner", forms: ["nurkka", "nurkan", "nurkassa"] },
    { w: "takana", ru: "за, позади", en: "behind", forms: ["takana"] }
  ],
  items: [
    { fi: "Tervetuloa!", ru: "Добро пожаловать!", en: "Welcome!", k: "d", who: "Mari" },
    { fi: "Kiitos.", ru: "Спасибо.", en: "Thank you.", k: "d", who: "Petri" },
    { fi: "Tässä on toimiston avain.", ru: "Вот ключ от офиса.", en: "Here's a key to the office.", k: "d", who: "Mari" },
    { fi: "Tuossa nurkan takana on naulakko.", ru: "Вон там за углом вешалка.", en: "There's a coat rack behind the corner.", k: "d", who: "Mari" },
    { fi: "Naulakon vieressä on keittiö.", ru: "Рядом с вешалкой кухня.", en: "Next to the coat rack, there's a kitchen.", k: "d", who: "Mari" },
    { fi: "Tuon ikkunan edessä on lehtihylly.", ru: "Перед тем окном полка с журналами.", en: "In front of that window, there's a magazine shelf.", k: "d", who: "Mari" },
    { fi: "edessä", ru: "перед", en: "in front of", k: "w" },
    { fi: "lehtihylly", ru: "полка для журналов", en: "magazine shelf", k: "w" },
    { fi: "toimisto", ru: "офис", en: "office", k: "w" },
    { fi: "vieressä", ru: "рядом с", en: "next to", k: "w" },
    { fi: "keittiö", ru: "кухня", en: "kitchen", k: "w" },
    { fi: "naulakko", ru: "вешалка", en: "coat rack", k: "w" },
    { fi: "ikkuna", ru: "окно", en: "window", k: "w" },
    { fi: "avain", ru: "ключ", en: "key", k: "w" },
    { fi: "nurkka", ru: "угол", en: "corner", k: "w" },
    { fi: "takana", ru: "за, позади", en: "behind", k: "w" },
    { fi: "Tavataan matkailuneuvonnan edessä.", ru: "Встретимся перед туристическим бюро.", en: "Let's meet in front of the tourist information.", k: "s" },
    { fi: "Pöytä on ikkunan edessä.", ru: "Стол стоит перед окном.", en: "The table is in front of the window.", k: "s" },
    { fi: "Onko lehtihyllyssä mitään hyviä lehtiä?", ru: "На полке есть хорошие журналы?", en: "Are there any good magazines on the shelf?", k: "s" },
    { fi: "Ihmiset työskentelevät toimistossa.", ru: "Люди работают в офисе.", en: "The people are working at the office.", k: "s" },
    { fi: "Toimistoni on toisessa kerroksessa.", ru: "Мой офис на втором этаже.", en: "My office is on the second floor.", k: "s" },
    { fi: "Jussi istuu Emmin vieressä.", ru: "Юсси сидит рядом с Эмми.", en: "Jussi is sitting next to Emmi.", k: "s" },
    { fi: "Nainen siistii keittiötä.", ru: "Женщина убирает кухню.", en: "The woman is tidying up the kitchen.", k: "s" },
    { fi: "Keittiö on uusi.", ru: "Кухня новая.", en: "The kitchen is new.", k: "s" },
    { fi: "Kokki laittoi ruokaa keittiössä.", ru: "Повар готовил на кухне.", en: "The chef cooked in the kitchen.", k: "s" },
    { fi: "Laita takki naulakkoon.", ru: "Повесь куртку на вешалку.", en: "Hang your coat on the coat rack.", k: "s" },
    { fi: "Voitko sulkea ikkunan, kiitos.", ru: "Закрой окно, пожалуйста.", en: "Close the window, please.", k: "s" },
    { fi: "Avaa ikkuna, kiitos.", ru: "Открой окно, пожалуйста.", en: "Open the window, please.", k: "s" },
    { fi: "Kylpyhuoneessa on pikkuruinen ikkuna.", ru: "В ванной крошечное окно.", en: "The bathroom has a tiny window.", k: "s" },
    { fi: "Liisa katsoo ulos ikkunasta.", ru: "Лийса смотрит в окно.", en: "Liisa looks out of the window.", k: "s" },
    { fi: "Tämä on avain etuoveen.", ru: "Это ключ от входной двери.", en: "This is the key to the front door.", k: "s" },
    { fi: "Avain on hyllyssä.", ru: "Ключ на полке.", en: "The key is on the shelf.", k: "s" },
    { fi: "Poika istuu nurkassa ja murjottaa.", ru: "Мальчик сидит в углу и дуется.", en: "The boy sits in the corner, sulking.", k: "s" },
    { fi: "Mitä tuon oven takana on?", ru: "Что за той дверью?", en: "What's there behind that door?", k: "s" },
    { fi: "Puu on talon takana.", ru: "Дерево за домом.", en: "The tree is behind the house.", k: "s" },
    { fi: "Ruokakauppa on kampaamon vieressä.", ru: "Продуктовый рядом с парикмахерской.", en: "The grocery store is next to the hairdresser's.", k: "s" },
    { fi: "Verhot ovat ikkunan edessä.", ru: "Занавески перед окном.", en: "The curtains are in front of the window.", k: "s" },
    { fi: "Maljakko on kaapin päällä.", ru: "Ваза на шкафу.", en: "The vase is on top of the cabinet.", k: "s" },
    { fi: "Kissa on pöydän alla.", ru: "Кошка под столом.", en: "The cat is under the table.", k: "s" },
    { fi: "Kulho on pöydän keskellä.", ru: "Миска посреди стола.", en: "The bowl is in the middle of the table.", k: "s" },
    { fi: "Talon sisällä on lämmintä.", ru: "В доме тепло.", en: "It's warm inside the house.", k: "s" },
    { fi: "Sohvan yläpuolella on maalaus.", ru: "Над диваном картина.", en: "There's a painting above the sofa.", k: "s" },
    { fi: "Hotelli on kirkon lähellä.", ru: "Отель рядом с церковью.", en: "The hotel is close to the church.", k: "s" },
    { fi: "Tiina ottaa maljakon kaapin päältä.", ru: "Тийна берёт вазу со шкафа.", en: "Tiina takes the vase from the top of the cabinet.", k: "s" },
    { fi: "Kissa tulee pöydän alta ja menee kaapin alle.", ru: "Кошка вылезает из-под стола и лезет под шкаф.", en: "The cat comes out from under the table and goes under the cabinet.", k: "s" }
  ]
},
{
  id: "LB_S1_10",
  title: "Впечатления: как тебе это?",
  source: "FinnishPod101 · Lower Beginner S1 #10",
  glossary: [
    { w: "ablatiivi", ru: "аблатив впечатления: -lta / -ltä", en: "ablative of impression", forms: ["mukavilta", "kivalta", "mielenkiintoiselta", "kylmältä", "selvältä", "uudelta", "tyytyväiseltä", "hyvältä", "turhalta", "mielekkäältä", "ankaralta", "maalta", "pitkältä", "piristävältä", "hauskalta", "tylsältä", "helpolta", "epäreilulta", "kovalta", "poliisilta", "miltä"],
      note: "Главная конструкция урока. Вопрос: Miltä x tuntuu/vaikuttaa? Ответ: X vaikuttaa/tuntuu + слово в аблативе (-lta/-ltä). Обычно это прилагательное, но может быть и существительное: Hän vaikuttaa poliisilta («Он похож на полицейского»). Если вопрос уже прозвучал, повторять подлежащее не нужно — достаточно одного слова в аблативе: Ihan kivalta." },
    { w: "vaikuttaa", ru: "казаться; влиять", en: "to seem; to influence", forms: ["vaikuttaa", "vaikutti", "vaikuttivat", "vaikutan"],
      note: "В этом уроке — «казаться»: Hän vaikuttaa mukavalta. Но есть и значение «влиять», и там другая конструкция, так что перепутать сложно: Pimeys vaikuttaa mielialaan («Темнота влияет на настроение»)." },
    { w: "tuntua", ru: "ощущаться, казаться", en: "to feel, to seem", forms: ["tuntua", "tuntuu", "tuntui", "tuntuvat"],
      note: "Близко к vaikuttaa, но с личным оттенком, плюс значит буквальное ощущение на ощупь: Vesi tuntui kylmältä. Päätös vaikutti epäreilulta — объективное наблюдение, Päätös tuntui epäreilulta — «мне показалось несправедливым»." },
    { w: "projekti", ru: "проект", en: "project", forms: ["projekti", "projektikin", "projektin"],
      note: "Недавнее заимствование из шведского projekt. Типичная финская привычка: если слово кончается на согласный, добавляют -i. Так polis стал poliisi, mugg — muki, skåp — kaappi." },
    { w: "miten", ru: "как", en: "how", forms: ["miten"],
      note: "Вопрос ожидает в ответе способ или образ действия: Miten Jussi kävelee? — Hitaasti («Медленно»). Miten olet menossa kaupunkiin? — Bussilla («На автобусе»)." },
    { w: "muuten", ru: "в остальном; кстати", en: "otherwise; by the way", forms: ["muuten"] },
    { w: "kiva", ru: "приятный, классный", en: "nice", forms: ["kiva", "kivalta", "kivaa"] },
    { w: "mukava", ru: "приятный, милый", en: "nice, pleasant", forms: ["mukava", "mukavilta", "mukavia", "mukavalta"] },
    { w: "ensimmäinen", ru: "первый", en: "first", forms: ["ensimmäinen"] }
  ],
  items: [
    { fi: "Miten töissä meni?", ru: "Как прошло на работе?", en: "How was work?", k: "d", who: "Satu" },
    { fi: "Hyvin. Työkaverit vaikuttivat mukavilta.", ru: "Хорошо. Коллеги показались приятными.", en: "Fine. The colleagues seemed nice.", k: "d", who: "Petri" },
    { fi: "Miltä paikka muuten vaikutti?", ru: "А место в остальном как показалось?", en: "How was the place otherwise?", k: "d", who: "Satu" },
    { fi: "Ihan kivalta.", ru: "Вполне неплохо.", en: "It seemed good.", k: "d", who: "Petri" },
    { fi: "Ensimmäinen projektikin tuntuu mielenkiintoiselta.", ru: "И первый проект кажется интересным.", en: "The first project seems interesting, too.", k: "d", who: "Petri" },
    { fi: "miten", ru: "как", en: "how", k: "w" },
    { fi: "ensimmäinen", ru: "первый", en: "first", k: "w" },
    { fi: "projekti", ru: "проект", en: "project", k: "w" },
    { fi: "kiva", ru: "приятный, классный", en: "nice", k: "w" },
    { fi: "tuntua", ru: "ощущаться, казаться", en: "to feel, to seem", k: "w" },
    { fi: "vaikuttaa", ru: "казаться; влиять", en: "to seem; to influence", k: "w" },
    { fi: "mukava", ru: "приятный", en: "nice", k: "w" },
    { fi: "muuten", ru: "в остальном; кстати", en: "otherwise", k: "w" },
    { fi: "Kerro minulle miten voin käyttää kaukosäädintä.", ru: "Расскажи мне, как пользоваться пультом.", en: "Tell me how to use the remote control.", k: "s" },
    { fi: "Miten kaukana rautatieasema on?", ru: "Как далеко железнодорожный вокзал?", en: "How far is the railway station?", k: "s" },
    { fi: "Miten pian tulet kotiin?", ru: "Как скоро ты придёшь домой?", en: "How soon will you come home?", k: "s" },
    { fi: "Miten voit?", ru: "Как дела? Как ты?", en: "How are you doing?", k: "s" },
    { fi: "Ensimmäinen poikaystäväni pelasi tennistä.", ru: "Мой первый парень играл в теннис.", en: "My first boyfriend played tennis.", k: "s" },
    { fi: "Tämä on pitkä projekti.", ru: "Это долгий проект.", en: "This will be a long project.", k: "s" },
    { fi: "Kiva, saamme tänään jälkiruokaa!", ru: "Класс, сегодня будет десерт!", en: "Great, we'll get dessert today!", k: "s" },
    { fi: "Täällä tuntuu kylmältä.", ru: "Здесь холодно (по ощущениям).", en: "It feels cold here.", k: "s" },
    { fi: "Kaikki vaikuttaa selvältä.", ru: "Всё кажется ясным.", en: "Everything seems clear.", k: "s" },
    { fi: "Uudet naapurimme ovat oikein mukavia.", ru: "Наши новые соседи очень приятные.", en: "Our new neighbors are very nice.", k: "s" },
    { fi: "Miltä suomen kieli tuntuu?", ru: "Каким тебе кажется финский язык?", en: "How does the Finnish language feel?", k: "s" },
    { fi: "Helpolta.", ru: "Лёгким.", en: "Easy.", k: "s" },
    { fi: "Talo vaikuttaa uudelta.", ru: "Дом выглядит новым.", en: "The house seems new.", k: "s" },
    { fi: "Johtaja vaikuttaa tyytyväiseltä.", ru: "Начальник кажется довольным.", en: "The manager seems pleased.", k: "s" },
    { fi: "Uusi opettajamme tuntuu kivalta.", ru: "Наш новый учитель кажется приятным.", en: "Our new teacher seems nice.", k: "s" },
    { fi: "Tämä kirja vaikuttaa mielenkiintoiselta.", ru: "Эта книга кажется интересной.", en: "This book seems interesting.", k: "s" },
    { fi: "Suunnitelma vaikuttaa hyvältä.", ru: "План кажется хорошим.", en: "The plan seems good.", k: "s" },
    { fi: "Kokous tuntuu turhalta.", ru: "Собрание кажется бессмысленным.", en: "The meeting seems useless.", k: "s" },
    { fi: "Työni tuntuu mielekkäältä.", ru: "Моя работа кажется осмысленной.", en: "My work feels meaningful.", k: "s" },
    { fi: "Isäsi vaikuttaa ankaralta.", ru: "Твой отец кажется строгим.", en: "Your father seems strict.", k: "s" },
    { fi: "Suomi tuntuu mukavalta maalta.", ru: "Финляндия кажется приятной страной.", en: "Finland feels like a nice country.", k: "s" },
    { fi: "Matka tuntuu pitkältä.", ru: "Дорога кажется долгой.", en: "It feels like a long way.", k: "s" },
    { fi: "Auringonpaiste tuntuu piristävältä.", ru: "Солнечный свет бодрит.", en: "Sunshine feels refreshing.", k: "s" },
    { fi: "Uudet naapurit tuntuvat mukavilta.", ru: "Новые соседи кажутся приятными.", en: "The new neighbors seem nice.", k: "s" },
    { fi: "Tuo vaikuttaa hauskalta.", ru: "Это кажется забавным.", en: "That seems fun.", k: "s" },
    { fi: "Tämä elokuva tuntuu tylsältä.", ru: "Этот фильм кажется скучным.", en: "This movie feels boring.", k: "s" },
    { fi: "Vesi tuntui kylmältä.", ru: "Вода была холодной на ощупь.", en: "The water felt cold.", k: "s" },
    { fi: "Sänky tuntui kovalta.", ru: "Кровать оказалась жёсткой.", en: "The bed felt hard.", k: "s" },
    { fi: "Pimeys vaikuttaa mielialaan.", ru: "Темнота влияет на настроение.", en: "Darkness has an effect on mood.", k: "s" }
  ]
},
{
  id: "LB_S1_11",
  title: "Перед сном: перфект",
  source: "FinnishPod101 · Lower Beginner S1 #11",
  glossary: [
    { w: "perfekti", ru: "перфект: olla + причастие на -nut/-nyt/-neet", en: "perfect tense", forms: ["harjannut", "käynyt", "vaihtanut", "lukenut", "syönyt", "aloittaneet", "kääntyneet", "nukuttanut", "tullut", "tehnyt", "ollut", "lainannut", "pelannut", "pelanneet", "kaivanneet", "päättäneet", "nähnyt"],
      note: "Действие важно для настоящего: либо продолжается, либо его результат в силе. Olen harjannut hampaani — чистка закончилась, но зубы чистые, можно спать. Сравните: Äiti on laittanut ruokaa kolmesta asti (мама всё ещё готовит) и Äiti laittoi ruokaa kolmesta asti (уже не готовит). Образуется из olla в нужном лице + причастие NUT: -nut/-nyt в единственном числе, -neet во множественном. У глаголов с согласной основой -n- заменяется последней согласной основы: tul-lut, men-nyt, ol-lut, pes-syt. У глаголов на гласный + ta именно -t меняется на n: lainat-a → lainan-nut, tarvit-a → tarvin-nut, pelat-a → pelan-nut." },
    { w: "vessa", ru: "туалет", en: "bathroom, restroom", forms: ["vessa", "vessassa", "vessaan"],
      note: "Самое обычное, слегка неформальное слово. На табличках всегда WC, в официальном тексте — WC или käymälä. В ресторанах есть miestenhuone и naistenhuone. Встречаются и эвфемизмы вроде pieni huone, но vessa годится почти везде." },
    { w: "yöpuku", ru: "пижама, ночная одежда", en: "pajamas, nightdress", forms: ["yöpuku", "yöpuvun", "muumiyöpuku"],
      note: "Общее слово для любой одежды для сна: yö («ночь») + puku («костюм, одежда»). Уточнить можно словами pyjama («пижама») или yöpaita («ночная рубашка», буквально «ночная рубаха»)." },
    { w: "vaihtaa", ru: "менять, обменивать", en: "to change, to exchange", forms: ["vaihtaa", "vaihtanut", "vaihdan", "vaihtoi"],
      note: "Годится везде, где что-то меняют на что-то: vaihtaa vaatteita (переодеться), vaihtaa työpaikkaa (сменить работу), vaihtaa rahaa (обменять деньги), vaihtaa patteri (поменять батарейку), vaihtaa väriä (сменить цвет)." },
    { w: "käydä", ru: "сходить и вернуться, побывать", en: "to visit, to go and come back", forms: ["käydä", "käynyt", "käyn", "käyt", "käytkö", "kävi"],
      note: "Особенность финского: käydä значит не просто «идти», а «сходить туда и обратно». Käytkö sinä kaupassa? — «Ты сходишь в магазин (и вернёшься)?»" },
    { w: "harjata", ru: "чистить щёткой", en: "to brush", forms: ["harjata", "harjannut", "harjaa"] },
    { w: "sänky", ru: "кровать", en: "bed", forms: ["sänky", "sänkyyn", "sängyssä", "sängyn"] },
    { w: "iltasatu", ru: "сказка на ночь", en: "bedtime story", forms: ["iltasatu", "iltasadun"] },
    { w: "hammas", ru: "зуб", en: "tooth", forms: ["hammas", "hampaasi", "hampaani", "hampaitaan"] }
  ],
  items: [
    { fi: "Viivi, oletko harjannut hampaasi?", ru: "Вийви, ты почистила зубы?", en: "Viivi, have you brushed your teeth?", k: "d", who: "Petri" },
    { fi: "Oletko käynyt vessassa?", ru: "Ты сходила в туалет?", en: "Have you been to the bathroom?", k: "d", who: "Petri" },
    { fi: "Oletko vaihtanut yöpuvun?", ru: "Ты переоделась в пижаму?", en: "Have you changed into your pajamas?", k: "d", who: "Petri" },
    { fi: "Hyvä. Mene sänkyyn, niin luen iltasadun.", ru: "Хорошо. Ложись в кровать, и я почитаю сказку.", en: "Good. Go to bed, and I'll read you a bedtime story.", k: "d", who: "Petri" },
    { fi: "iltasatu", ru: "сказка на ночь", en: "bedtime story", k: "w" },
    { fi: "harjata", ru: "чистить щёткой", en: "to brush", k: "w" },
    { fi: "yöpuku", ru: "пижама", en: "pajamas", k: "w" },
    { fi: "sänky", ru: "кровать", en: "bed", k: "w" },
    { fi: "vaihtaa", ru: "менять, обменивать", en: "to change", k: "w" },
    { fi: "hammas", ru: "зуб", en: "tooth", k: "w" },
    { fi: "käydä", ru: "сходить (и вернуться)", en: "to visit", k: "w" },
    { fi: "vessa", ru: "туалет", en: "bathroom", k: "w" },
    { fi: "Lue tänään oikein pitkä iltasatu!", ru: "Почитай сегодня очень длинную сказку!", en: "Please read a very long bedtime story today!", k: "s" },
    { fi: "Nainen harjaa hampaitaan.", ru: "Женщина чистит зубы.", en: "The woman brushes her teeth.", k: "s" },
    { fi: "Viivillä on muumiyöpuku.", ru: "У Вийви пижама с муми-троллями.", en: "Viivi has Moomin pajamas.", k: "s" },
    { fi: "Menen sänkyyn joka ilta kello yhdeksän.", ru: "Я ложусь спать каждый вечер в девять.", en: "I go to bed every night at 9 o'clock.", k: "s" },
    { fi: "Nainen lepää sängyssä.", ru: "Женщина отдыхает в кровати.", en: "The woman is resting in the bed.", k: "s" },
    { fi: "Ostin uuden sängyn.", ru: "Я купил новую кровать.", en: "I bought a new bed.", k: "s" },
    { fi: "Siivooja petasi sängyn hotellihuoneessa.", ru: "Горничная застелила кровать в номере.", en: "The maid made the bed in the hotel room.", k: "s" },
    { fi: "En tiedä missä voin vaihtaa rahaa.", ru: "Не знаю, где можно обменять деньги.", en: "I don't know where I can exchange money.", k: "s" },
    { fi: "Viivillä heiluu hammas.", ru: "У Вийви шатается зуб.", en: "Viivi has a loose tooth.", k: "s" },
    { fi: "Käytkö sinä kaupassa, vai käynkö minä?", ru: "Ты сходишь в магазин или я?", en: "Will you go to the store, or shall I go?", k: "s" },
    { fi: "Anteeksi, missä täällä on vessa?", ru: "Извините, где здесь туалет?", en: "Excuse me, where's the restroom?", k: "s" },
    { fi: "vaihtaa vaatteita", ru: "переодеться", en: "to change clothes", k: "s" },
    { fi: "vaihtaa työpaikkaa", ru: "сменить работу", en: "to change jobs", k: "s" },
    { fi: "vaihtaa rahaa", ru: "обменять деньги", en: "to exchange money", k: "s" },
    { fi: "Oletko lukenut tämän kirjan?", ru: "Ты прочитал эту книгу?", en: "Have you read this book?", k: "s" },
    { fi: "Oletko jo syönyt lounasta?", ru: "Ты уже пообедал?", en: "Have you had lunch already?", k: "s" },
    { fi: "Olet myöhässä, me olemme jo aloittaneet.", ru: "Ты опоздал, мы уже начали.", en: "You're late, we've already started.", k: "s" },
    { fi: "He ovat varmasti kääntyneet väärään suuntaan.", ru: "Они наверняка свернули не туда.", en: "They must have turned in the wrong direction.", k: "s" },
    { fi: "Minua on nukuttanut koko päivän.", ru: "Меня весь день клонит в сон.", en: "I've been sleepy all day.", k: "s" },
    { fi: "Onko Tiina jo tullut?", ru: "Тийна уже пришла?", en: "Has Tiina arrived already?", k: "s" },
    { fi: "Saanko mennä ulos? Olen tehnyt läksyni.", ru: "Можно мне на улицу? Я сделал уроки.", en: "May I go out? I've done my homework.", k: "s" },
    { fi: "Maiju on aina ollut kiltti lapsi.", ru: "Майю всегда была послушным ребёнком.", en: "Maiju has always been a well-behaved child.", k: "s" },
    { fi: "Olen lainannut Kallelta rahaa.", ru: "Я занял денег у Калле.", en: "I've borrowed some money from Kalle.", k: "s" },
    { fi: "Erkki on pelannut salibandya kolme vuotta.", ru: "Эркки играет во флорбол три года.", en: "Erkki has been playing floorball for three years.", k: "s" },
    { fi: "Olette pelanneet jo kaksi tuntia.", ru: "Вы играете уже два часа.", en: "You have been playing for two hours already.", k: "s" },
    { fi: "Kissat ovat kaivanneet sinua.", ru: "Кошки скучали по тебе.", en: "The cats have missed you.", k: "s" },
    { fi: "Äiti on laittanut ruokaa kolmesta asti.", ru: "Мама готовит с трёх часов (и сейчас готовит).", en: "Mom has been cooking since three o'clock.", k: "s" },
    { fi: "Onko miehesi ikinä antanut sinulle kukkia?", ru: "Твой муж когда-нибудь дарил тебе цветы?", en: "Has your husband ever given you flowers?", k: "s" }
  ]
},
{
  id: "LB_S1_12",
  title: "Погода и степень уверенности",
  source: "FinnishPod101 · Lower Beginner S1 #12",
  glossary: [
    { w: "pitäisi", ru: "должно бы, по идее", en: "should", forms: ["pitäisi", "pitäisitkö"],
      note: "Вспомогательный глагол, после него основной глагол в инфинитиве. Форма не меняется по лицам (тот, кто должен, стоит в генитиве: Heidän pitäisi tulla). Смысл: вы ожидаете, что так будет, но с вас не спросят, если не сложится." },
    { w: "saattaa", ru: "может быть, возможно", en: "may", forms: ["saattaa", "saatamme", "saattoi"],
      note: "Тоже вспомогательный глагол с инфинитивом. Уверенности меньше, чем в pitäisi." },
    { w: "epävarmuus", ru: "слова неуверенности", en: "hedging words", forms: ["ehkä", "luultavasti", "tuskin", "varmasti", "kovin", "aika", "voi", "voida"],
      note: "Шкала: varmasti («точно») → pitäisi («должно бы») → luultavasti («вероятно») → saattaa / voi («может быть») → ehkä («может, вряд ли высокая вероятность») → tuskin («вряд ли»). Tuskin само по себе отрицательное, глагол при нём отдельно не отрицают: Tuskin ne siellä ovat." },
    { w: "aika", ru: "довольно, весьма", en: "rather, somewhat", forms: ["aika"],
      note: "Наречие при прилагательных: умеренное усиление. Обычно в утвердительных предложениях. Kovin («очень») сильнее и годится и в отрицаниях: Ei kovin." },
    { w: "pouta", ru: "погода без дождя", en: "dry weather", forms: ["pouta", "poutaa", "pilvipouta"],
      note: "Значит просто «не идёт дождь» — может быть и солнечно, и пасмурно. Для пасмурной, но сухой погоды есть отдельное слово pilvipouta (pilvi — «облако»)." },
    { w: "sadekuuro", ru: "ливень, кратковременный дождь", en: "rain shower", forms: ["sadekuuro", "sadekuuroja"],
      note: "Короткий дождь, иногда сильный, чаще летом. Есть известная строчка Микко Алатало: Aurinko paistaa ja vettä sataa, taitaa tulla kesä («Солнце светит и дождь идёт — похоже, лето»). Её знают почти все в Финляндии." },
    { w: "tuulinen", ru: "ветреный", en: "windy", forms: ["tuulinen", "tuulista", "tuulisena"],
      note: "Окончание -inen делает из существительного прилагательное: tuuli → tuulinen, aurinko → aurinkoinen («солнечный»), pilvi → pilvinen («облачный»), sade → sateinen («дождливый»)." },
    { w: "lämmin", ru: "тёплый", en: "warm", forms: ["lämmin", "lämmintä", "lämpimät", "lämpimiä"] },
    { w: "ylihuomenna", ru: "послезавтра", en: "the day after tomorrow", forms: ["ylihuomenna", "ylihuomiseksi"] },
    { w: "tuuli", ru: "ветер", en: "wind", forms: ["tuuli", "tuulta", "tuulen"] }
  ],
  items: [
    { fi: "Huomenna pitäisi olla aika lämmintä.", ru: "Завтра должно быть довольно тепло.", en: "It should be rather warm tomorrow.", k: "d", who: "Petri" },
    { fi: "Entä loppuviikolla?", ru: "А в конце недели?", en: "How about the rest of the week?", k: "d", who: "Satu" },
    { fi: "Ylihuomenna saattaa vielä tulla sadekuuroja, mutta loppuviikolla pitäisi olla poutaa.", ru: "Послезавтра ещё возможны ливни, но к концу недели должно быть без дождя.", en: "There may still be showers the day after tomorrow, but the rest of the week should be dry.", k: "d", who: "Petri" },
    { fi: "Onko tuulista?", ru: "Ветрено?", en: "Will it be windy?", k: "d", who: "Satu" },
    { fi: "Ei kovin. Tuulta on neljä metriä sekunnissa.", ru: "Не очень. Ветер четыре метра в секунду.", en: "Not very. The wind will be four meters per second.", k: "d", who: "Petri" },
    { fi: "tuuli", ru: "ветер", en: "wind", k: "w" },
    { fi: "metriä sekunnissa", ru: "метров в секунду", en: "meters per second", k: "w" },
    { fi: "aika", ru: "довольно, весьма", en: "rather", k: "w" },
    { fi: "pouta", ru: "погода без дождя", en: "dry weather", k: "w" },
    { fi: "sadekuuro", ru: "ливень", en: "rain shower", k: "w" },
    { fi: "tuulinen", ru: "ветреный", en: "windy", k: "w" },
    { fi: "lämmin", ru: "тёплый", en: "warm", k: "w" },
    { fi: "ylihuomenna", ru: "послезавтра", en: "the day after tomorrow", k: "w" },
    { fi: "saattaa", ru: "может быть", en: "may", k: "w" },
    { fi: "luultavasti", ru: "вероятно", en: "probably", k: "w" },
    { fi: "tuskin", ru: "вряд ли", en: "not likely", k: "w" },
    { fi: "varmasti", ru: "точно, наверняка", en: "certainly", k: "w" },
    { fi: "ehkä", ru: "может быть", en: "perhaps", k: "w" },
    { fi: "Tuuli lennättää kuivia lehtiä.", ru: "Ветер несёт сухие листья.", en: "The wind is blowing dry leaves around.", k: "s" },
    { fi: "Tuulen nopeus on viisi metriä sekunnissa.", ru: "Скорость ветра пять метров в секунду.", en: "The wind speed is five meters per second.", k: "s" },
    { fi: "On jo aika myöhä.", ru: "Уже довольно поздно.", en: "It's rather late already.", k: "s" },
    { fi: "Minun pitää nyt mennä.", ru: "Мне пора идти.", en: "I have to go now.", k: "s" },
    { fi: "Koko ensi viikon on poutaa.", ru: "Всю следующую неделю будет без дождя.", en: "The entire next week will be dry.", k: "s" },
    { fi: "Tuulisena päivänä on hyvä lennättää leijaa.", ru: "В ветреный день хорошо запускать воздушного змея.", en: "It's good to fly a kite on a windy day.", k: "s" },
    { fi: "Sisällä on ihanan lämmintä.", ru: "Внутри чудесно тепло.", en: "It's wonderfully warm inside.", k: "s" },
    { fi: "Pue lämpimät vaatteet, ulkona on kylmä.", ru: "Надень тёплую одежду, на улице холодно.", en: "Put on warm clothes, it's cold out there.", k: "s" },
    { fi: "Menen ystäväni juhliin ylihuomenna.", ru: "Послезавтра иду на праздник к другу.", en: "I will go to my friend's party the day after tomorrow.", k: "s" },
    { fi: "Tämän pitäisi olla valmis ylihuomenna.", ru: "Это должно быть готово послезавтра.", en: "This should be ready the day after tomorrow.", k: "s" },
    { fi: "Huomenna saattaa sataa.", ru: "Завтра может пойти дождь.", en: "It may rain tomorrow.", k: "s" },
    { fi: "Heidän pitäisi jo tulla.", ru: "Они уже должны бы прийти.", en: "They should be coming already.", k: "s" },
    { fi: "Jossain täällä sen pitäisi olla.", ru: "Оно должно быть где-то здесь.", en: "It should be somewhere around here.", k: "s" },
    { fi: "Sateenkaaren päässä saattaa olla kultaa.", ru: "На конце радуги может быть золото.", en: "There may be gold at the end of a rainbow.", k: "s" },
    { fi: "Saatamme mennä viikonloppuna mökille.", ru: "На выходных мы, может быть, поедем на дачу.", en: "We may go to our summer cottage during the weekend.", k: "s" },
    { fi: "Hän on aika varmasti kotona.", ru: "Он почти наверняка дома.", en: "It's pretty certain that he's at home.", k: "s" },
    { fi: "Tänään on aika lämmintä.", ru: "Сегодня довольно тепло.", en: "It's pretty warm today.", k: "s" },
    { fi: "Tämä ei kestä kovin kauan.", ru: "Это не займёт очень много времени.", en: "This won't take very long.", k: "s" },
    { fi: "Ehkä huomenna on parempi sää.", ru: "Может, завтра погода будет получше.", en: "Maybe the weather will be better tomorrow.", k: "s" },
    { fi: "Huomenna voi olla tuulista.", ru: "Завтра может быть ветрено.", en: "It may be windy tomorrow.", k: "s" },
    { fi: "Maali voi olla vielä märkää.", ru: "Краска, возможно, ещё не высохла.", en: "The paint may still be wet.", k: "s" },
    { fi: "Sakset ovat luultavasti tässä laatikossa.", ru: "Ножницы, вероятно, в этом ящике.", en: "The scissors are probably in this drawer.", k: "s" },
    { fi: "Tuskin ne siellä ovat.", ru: "Вряд ли они там.", en: "I don't think they are there.", k: "s" },
    { fi: "Tämä on varmasti elämänne paras ostos!", ru: "Это точно лучшая покупка в вашей жизни!", en: "This is definitely the best buy in your life!", k: "s" }
  ]
},
{
  id: "LB_S1_13",
  title: "Одежда и множественное число",
  source: "FinnishPod101 · Lower Beginner S1 #13",
  glossary: [
    { w: "monikko", ru: "множественное число в падежах: показатель -i-", en: "plural case forms", forms: ["kengillä", "lätäköissä", "käsineitä", "housuihin", "kengissä", "laseissa", "kirjoissa", "sukissa", "vaatteista", "puiden", "ohikulkijoille", "serkuiltani", "housuille", "elokuviin", "hahmoja", "reikiä", "hamstereita", "mainoksia"],
      note: "В номинативе множественное — просто -t, но во всех остальных падежах между основой и окончанием встаёт -i-: kengä-t, но keng-i-ssä, keng-i-llä. Между гласными -i- превращается в -j-: koulu-j-a, koulu-j-en. Особые окончания у генитива (-en, -den, -tten, -ten) и иллатива (-in, -hin, -siin) — их можно набрать позже на практике." },
    { w: "pitää", ru: "держать; нравиться; быть должным", en: "to hold; to like; to have to", forms: ["pitää", "pitääkö", "pidä", "pidän", "pitäisitkö", "piti"],
      note: "Значений много, но связь есть. «Нравиться» — с элативом: Veera pitää jäätelöstä. «Держать»: Pitäisitkö kirjaani hetken? Отсюда же «держать воду»: Tämä kulho ei pidä vettä («Эта миска протекает»). «Держаться за» — тоже элатив: Pidä kiinni tästä köydestä. И вспомогательный глагол «надо»: Minun pitää mennä." },
    { w: "housut", ru: "брюки, штаны", en: "trousers, pants", forms: ["housut", "housuihin", "housuissa", "housuille"],
      note: "Любая одежда на нижнюю часть тела с отдельными штанинами, и мужская, и женская. Слово всегда во множественном числе, как и в русском. Производные: alushousut (трусы), sukkahousut (колготки), sadehousut (дождевые штаны)." },
    { w: "käsine", ru: "перчатка", en: "glove", forms: ["käsine", "käsineet", "käsineitä", "käsineiden"],
      note: "От käsi («рука»). Обычно про перчатку с отдельными пальцами. Есть и другие слова: hanska, rukkanen (четыре пальца вместе), lapanen («вязаная варежка»). Поскольку рук две, эти слова чаще всего во множественном числе." },
    { w: "kenkä", ru: "ботинок, туфля", en: "shoe", forms: ["kenkä", "kengät", "kengillä", "kengissä", "kenkiä", "kenkäpari"] },
    { w: "lätäkkö", ru: "лужа", en: "puddle", forms: ["lätäkkö", "lätäköissä", "lätäköitä"] },
    { w: "juosta", ru: "бежать", en: "to run", forms: ["juosta", "juokse", "juoksee", "juosseet"] },
    { w: "laittaa", ru: "класть, ставить; готовить еду", en: "to put; to prepare food", forms: ["laittaa", "laita", "laittoi"] },
    { w: "paita", ru: "рубашка, футболка", en: "shirt", forms: ["paita", "paidan", "paitasi"] },
    { w: "koulupäivä", ru: "школьный день", en: "schoolday", forms: ["koulupäivä", "koulupäivää"] },
    { w: "työpäivä", ru: "рабочий день", en: "workday", forms: ["työpäivä", "työpäivän", "työpäivää"] }
  ],
  items: [
    { fi: "Viivi, älä sitten juokse noilla kengillä lätäköissä.", ru: "Вийви, не бегай по лужам в этих ботинках.", en: "Viivi, don't go running in puddles with those shoes.", k: "d", who: "Petri" },
    { fi: "Ne eivät pidä vettä.", ru: "Они промокают.", en: "They aren't watertight.", k: "d", who: "Petri" },
    { fi: "Ja laita paita housuihin.", ru: "И заправь рубашку в брюки.", en: "And tuck your shirt into your trousers.", k: "d", who: "Satu" },
    { fi: "Äläkä unohda käsineitä kouluun.", ru: "И не забудь перчатки в школе.", en: "And don't forget your gloves at school.", k: "d", who: "Petri" },
    { fi: "Hyvää koulupäivää!", ru: "Хорошего школьного дня!", en: "Have a nice day at school!", k: "d", who: "Satu" },
    { fi: "Hyvää työpäivää! Heippa!", ru: "Хорошего рабочего дня! Пока!", en: "Have a nice day at work! Bye bye!", k: "d", who: "Viivi" },
    { fi: "housut", ru: "брюки", en: "trousers", k: "w" },
    { fi: "käsine", ru: "перчатка", en: "glove", k: "w" },
    { fi: "koulupäivä", ru: "школьный день", en: "schoolday", k: "w" },
    { fi: "työpäivä", ru: "рабочий день", en: "workday", k: "w" },
    { fi: "juosta", ru: "бежать", en: "to run", k: "w" },
    { fi: "paita", ru: "рубашка", en: "shirt", k: "w" },
    { fi: "laittaa", ru: "класть; готовить", en: "to put", k: "w" },
    { fi: "kenkä", ru: "ботинок", en: "shoe", k: "w" },
    { fi: "lätäkkö", ru: "лужа", en: "puddle", k: "w" },
    { fi: "pitää", ru: "держать; нравиться; быть должным", en: "to hold; to like", k: "w" },
    { fi: "Noissa housuissa on isot taskut.", ru: "У тех брюк большие карманы.", en: "Those trousers have big pockets.", k: "s" },
    { fi: "Minulla on lämpimät käsineet.", ru: "У меня тёплые перчатки.", en: "I have warm gloves.", k: "s" },
    { fi: "Huomenna on lyhyt koulupäivä.", ru: "Завтра короткий школьный день.", en: "Tomorrow we have a short schoolday.", k: "s" },
    { fi: "Työpäivän jälkeen Minna on ihan väsynyt.", ru: "После рабочего дня Минна совсем уставшая.", en: "After a day at work, Minna is quite tired.", k: "s" },
    { fi: "Ville juoksee nopeasti.", ru: "Вилле бегает быстро.", en: "Ville runs quickly.", k: "s" },
    { fi: "Laita likaiset paitasi pesukoneeseen, kiitos.", ru: "Положи грязные рубашки в стиральную машину, пожалуйста.", en: "Put your dirty shirts into the washing machine, please.", k: "s" },
    { fi: "Otanko sinisen vai vihreän paidan?", ru: "Взять синюю или зелёную рубашку?", en: "Shall I take the blue or the green shirt?", k: "s" },
    { fi: "Laita käsineet käteen.", ru: "Надень перчатки.", en: "Put on your gloves.", k: "s" },
    { fi: "Nämä kengät ovat liian pienet.", ru: "Эти ботинки слишком малы.", en: "These shoes are too small.", k: "s" },
    { fi: "Kadulla on lätäköitä.", ru: "На улице лужи.", en: "There are puddles in the street.", k: "s" },
    { fi: "Pitääkö tämä takki vettä?", ru: "Эта куртка не промокает?", en: "Is this coat watertight?", k: "s" },
    { fi: "Veera pitää jäätelöstä.", ru: "Веера любит мороженое.", en: "Veera likes ice cream.", k: "s" },
    { fi: "Serkuillani on hamstereita.", ru: "У моих двоюродных есть хомяки.", en: "My cousins have hamsters.", k: "s" },
    { fi: "Mennäänkö elokuviin?", ru: "Пойдём в кино?", en: "Shall we go to the movies?", k: "s" },
    { fi: "Mitä näissä laseissa on?", ru: "Что в этих стаканах?", en: "What's in these glasses?", k: "s" },
    { fi: "Tove Janssonin kirjoissa on mielenkiintoisia hahmoja.", ru: "В книгах Туве Янссон интересные персонажи.", en: "There are interesting characters in Tove Jansson's books.", k: "s" },
    { fi: "Noissa kengissä on korkea korko.", ru: "У тех туфель высокий каблук.", en: "Those shoes have a high heel.", k: "s" },
    { fi: "Näillä kengillä on hyvä kävellä.", ru: "В этих ботинках удобно ходить.", en: "These shoes are good to walk in.", k: "s" },
    { fi: "Viivin sukissa on reikiä.", ru: "В носках Вийви дырки.", en: "There are holes in Viivi's socks.", k: "s" },
    { fi: "Satu pitää sinisistä vaatteista.", ru: "Сату любит синюю одежду.", en: "Satu likes blue clothes.", k: "s" },
    { fi: "Puiden takana on leikkipuisto.", ru: "За деревьями детская площадка.", en: "There is a playground behind the trees.", k: "s" },
    { fi: "Miehet jakoivat mainoksia ohikulkijoille.", ru: "Мужчины раздавали рекламу прохожим.", en: "The men handed advertisements to passers-by.", k: "s" },
    { fi: "Eeron housuille roiskui maalia.", ru: "На брюки Ээро брызнула краска.", en: "Some paint splashed on Eero's trousers.", k: "s" },
    { fi: "Sain serkuiltani postikortin.", ru: "Я получил открытку от двоюродных.", en: "I got a postcard from my cousins.", k: "s" }
  ]
},
{
  id: "LB_S1_14",
  title: "Отрицание в прошедшем времени",
  source: "FinnishPod101 · Lower Beginner S1 #14",
  glossary: [
    { w: "kielteinen imperfekti", ru: "отрицательный имперфект: en / et / ei + причастие NUT", en: "negative imperfect", forms: ["nähnyt", "nähneet", "sanonut", "käynyt", "muistanut", "unohtanut", "kuullut", "ostaneet", "myöhästynyt", "menneet", "päässeet", "juosseet", "satanut", "olleet", "tiennyt"],
      note: "Схема простая, если знать перфект. Отрицательный глагол берёт лицо (en, et, ei, emme, ette, eivät), а основной идёт причастием NUT: -nut/-nyt в единственном, -neet во множественном. Сравните: настоящее время en näe («не вижу») — прошедшее en nähnyt («не видел»). Объект в отрицании всегда в партитиве: en nähnyt kukkaa." },
    { w: "ulkomailla", ru: "за границей", en: "abroad", forms: ["ulkomailla", "ulkomailta", "ulkomaille", "ulkomaat"],
      note: "Адессив множественного числа от ulkomaa, буквально «внешняя земля». Само ulkomaa в одиночку почти не используется — только в составных словах: ulkomaankauppa («внешняя торговля»), ulkomaanmatka («поездка за границу»). Ходовые наречия: ulkomailla («за границей»), ulkomailta («из-за границы»), ulkomaille («за границу»)." },
    { w: "ulkomainen", ru: "иностранный, заграничный", en: "foreign", forms: ["ulkomainen", "ulkomaisia", "ulkomaalaisia", "ulkomaalainen"],
      note: "Тоже от ulkomaa, с прилагательным окончанием -inen. Противоположность — kotimainen («отечественный», буквально «домашнеземельный»). Родственное существительное ulkomaalainen значит «иностранец»." },
    { w: "keksi", ru: "печенье", en: "cookie, biscuit", forms: ["keksi", "keksejä", "keksit", "suklaakeksejä"],
      note: "Любое печенье, сладкое или солёное. Часто взаимозаменяемо с pikkuleipä («маленький хлебец»), но keksi обычно тоньше и всегда сухое, а pikkuleipä может быть мягким и толстым." },
    { w: "että", ru: "что (союз)", en: "that", forms: ["että"] },
    { w: "nähdä", ru: "видеть", en: "to see", forms: ["nähdä", "näin", "näit", "näitkö", "näki", "nähnyt", "näkee"] },
    { w: "sanoa", ru: "сказать", en: "to say", forms: ["sanoa", "sano", "sanoi", "sanonut", "sanoo", "sanotaan"] },
    { w: "loma", ru: "отпуск, каникулы", en: "vacation", forms: ["loma", "lomalta", "lomalla", "talvilomana"] },
    { w: "palata", ru: "возвращаться", en: "to return", forms: ["palata", "palasi", "palaa", "palaamme"] }
  ],
  items: [
    { fi: "Näitkö, että keittiössä on keksejä?", ru: "Ты видел, что на кухне есть печенье?", en: "Did you see there are cookies in the kitchen?", k: "d", who: "Hanna" },
    { fi: "En nähnyt.", ru: "Не видел.", en: "No, I didn't.", k: "d", who: "Petri" },
    { fi: "Matti palasi tänään lomalta.", ru: "Матти сегодня вернулся из отпуска.", en: "Matti returned from vacation today.", k: "d", who: "Hanna" },
    { fi: "Kävikö hän jossain ulkomailla?", ru: "Он ездил куда-то за границу?", en: "Did he go somewhere abroad?", k: "d", who: "Petri" },
    { fi: "Hän ei sanonut, mutta keksit eivät olleet ulkomaalaisia.", ru: "Он не сказал, но печенье было не заграничное.", en: "He didn't say, but the cookies were not from abroad.", k: "d", who: "Hanna" },
    { fi: "ulkomainen", ru: "иностранный", en: "foreign", k: "w" },
    { fi: "nähdä", ru: "видеть", en: "to see", k: "w" },
    { fi: "ulkomailla", ru: "за границей", en: "abroad", k: "w" },
    { fi: "sanoa", ru: "сказать", en: "to say", k: "w" },
    { fi: "loma", ru: "отпуск", en: "vacation", k: "w" },
    { fi: "että", ru: "что (союз)", en: "that", k: "w" },
    { fi: "keksi", ru: "печенье", en: "cookie", k: "w" },
    { fi: "palata", ru: "возвращаться", en: "to return", k: "w" },
    { fi: "Ovatko nämä omenat ulkomaisia?", ru: "Эти яблоки импортные?", en: "Are these apples foreign?", k: "s" },
    { fi: "Oletko nähnyt silmälasejani?", ru: "Ты не видел мои очки?", en: "Have you seen my glasses?", k: "s" },
    { fi: "Isomummi ei ikinä käynyt ulkomailla.", ru: "Прабабушка никогда не была за границей.", en: "My great-grandmother never went abroad.", k: "s" },
    { fi: "En minä niin sanonut!", ru: "Я такого не говорил!", en: "I didn't say so!", k: "s" },
    { fi: "Älä sano mitään.", ru: "Ничего не говори.", en: "Don't say anything.", k: "s" },
    { fi: "Voisitko sanoa missä on hotelli?", ru: "Не подскажете, где отель?", en: "Could you tell me where the hotel is?", k: "s" },
    { fi: "Kun joku aivastaa, sanotaan Terveydeksi.", ru: "Когда кто-то чихает, говорят «Будь здоров».", en: "When somebody sneezes, we say 'Bless you.'", k: "s" },
    { fi: "Milloin sinä olet lomalla?", ru: "Когда у тебя отпуск?", en: "When will you be on vacation?", k: "s" },
    { fi: "En tiennyt, että Liisa ei ole kotona.", ru: "Я не знал, что Лийсы нет дома.", en: "I didn't know Liisa was not at home.", k: "s" },
    { fi: "Rakastan suklaakeksejä!", ru: "Обожаю шоколадное печенье!", en: "I love chocolate cookies!", k: "s" },
    { fi: "Palaamme pian.", ru: "Мы скоро вернёмся.", en: "We'll be back soon.", k: "s" },
    { fi: "Isä palaa kotiin.", ru: "Папа возвращается домой.", en: "The father returns home.", k: "s" },
    { fi: "En näe kukkaa.", ru: "Я не вижу цветка.", en: "I don't see a flower.", k: "s" },
    { fi: "En nähnyt kukkaa.", ru: "Я не видел цветка.", en: "I didn't see a flower.", k: "s" },
    { fi: "Hän ei nähnyt kukkaa.", ru: "Он не видел цветка.", en: "He didn't see a flower.", k: "s" },
    { fi: "Emme nähneet kukkaa.", ru: "Мы не видели цветка.", en: "We didn't see a flower.", k: "s" },
    { fi: "Sari ei käynyt eilen kaupassa.", ru: "Сари вчера не ходила в магазин.", en: "Sari didn't go to the store yesterday.", k: "s" },
    { fi: "En muistanut soittaa äidille.", ru: "Я забыл позвонить маме.", en: "I didn't remember to call Mother.", k: "s" },
    { fi: "Tällä kertaa hän ei unohtanut syntymäpäivääni.", ru: "В этот раз он не забыл мой день рождения.", en: "This time he didn't forget my birthday.", k: "s" },
    { fi: "Etkö kuullut, kun puhelin soi?", ru: "Ты не слышал, как звонил телефон?", en: "Didn't you hear the phone ring?", k: "s" },
    { fi: "Leena ja Pekka eivät vielä ostaneet sitä asuntoa.", ru: "Леена и Пекка ещё не купили ту квартиру.", en: "Leena and Pekka didn't buy that apartment yet.", k: "s" },
    { fi: "Onneksi en myöhästynyt bussista.", ru: "К счастью, я не опоздал на автобус.", en: "Fortunately, I didn't miss the bus.", k: "s" },
    { fi: "Emme menneet eilen elokuviin.", ru: "Мы вчера не пошли в кино.", en: "We didn't go to the movies yesterday.", k: "s" },
    { fi: "Harmi, että te ette päässeet mukaan.", ru: "Жаль, что вы не смогли пойти с нами.", en: "Too bad you couldn't come along.", k: "s" },
    { fi: "He eivät juosseet tarpeeksi nopeasti.", ru: "Они бежали недостаточно быстро.", en: "They didn't run fast enough.", k: "s" },
    { fi: "Eilen ei satanut.", ru: "Вчера дождя не было.", en: "It didn't rain yesterday.", k: "s" }
  ]
},
{
  id: "LB_S1_15",
  title: "Эссив: в каком качестве",
  source: "FinnishPod101 · Lower Beginner S1 #15",
  glossary: [
    { w: "essiivi", ru: "эссив: -na / -nä", en: "essive case", forms: ["lapsena", "aikuisena", "pienenä", "iloisena", "punaisena", "kylmänä", "sairaana", "opettajana", "isona", "puheenjohtajana", "parhaana", "lemmikkinä", "metsästyskoirana", "sukkina", "sinuna", "työttömänä", "jouluna", "kesänä", "tiistaina", "ystävänään", "helppona", "kukkana", "oppilaana", "kätenä", "asiana"],
      note: "Выражает состояние или роль — часто временные. Образуется прибавлением -na/-nä к гласной основе, чередования ступеней в эссиве нет, так что обычно окончание просто клеится к словарной форме. Три типа употребления: 1) состояние — Lapsi hyppi iloisena, Eija on sairaana; 2) роль и должность — Hän on opettaja («учитель по профессии») против Hän on opettajana Helsingin yliopistossa («работает учителем»); 3) время — jouluna, viime kesänä, tiistaina." },
    { w: "päättää", ru: "решать; заканчивать", en: "to decide, to end", forms: ["päättää", "päätti", "päättäneet", "päätän"],
      note: "Pää значит «голова» или «конец» (например, конец верёвки), а päättää буквально — «положить конец». Отсюда «завершить»: Hän päätti puheensa kiitoksiin («Он закончил речь благодарностями»). И отсюда же «решить, заключить»: Eero päätti lähteä kotiin." },
    { w: "asia", ru: "дело, вопрос, вещь", en: "thing, issue, matter", forms: ["asia", "asioistaan", "asiaa", "asian", "asiasta", "tosiasia"],
      note: "Очень широкое слово: пункт повестки, любой вопрос, дело. Mennään jo asiaan («Перейдём к делу»), Veikko puhui asian vierestä («Вейкко говорил не по существу»), Minun pitää hoitaa muutama asia («Мне надо сделать пару дел»). «Факт» — tosiasia, буквально «истинная вещь». Устойчивые: pidä huoli omista asioistasi («занимайся своими делами»), asiasta toiseen («кстати»)." },
    { w: "tarkasti", ru: "внимательно, точно", en: "carefully, exactly", forms: ["tarkasti", "tarkka", "tarkkaan"],
      note: "Наречие от tarkka («точный, внимательный»). Годится везде, где нужна точность или строгое следование инструкции: Kuuntele tarkasti! («Слушай внимательно!»), Leikkaa tarkasti viivaa pitkin («Режь точно по линии»)." },
    { w: "lapsi", ru: "ребёнок", en: "child", forms: ["lapsi", "lapsena", "lapsia", "lapsen", "lapsella"] },
    { w: "aikuinen", ru: "взрослый", en: "adult", forms: ["aikuinen", "aikuisena", "aikuisten"] },
    { w: "pieni", ru: "маленький", en: "small", forms: ["pieni", "pienenä", "pieniä", "pienempi"] },
    { w: "helppo", ru: "лёгкий, простой", en: "easy", forms: ["helppo", "helppoa", "helpolta", "helpompi"] },
    { w: "miettiä", ru: "обдумывать, размышлять", en: "to consider, to think", forms: ["miettiä", "mietin", "miettii"] }
  ],
  items: [
    { fi: "Katsokaa noita lapsia. Lapsena kaikki on niin helppoa.", ru: "Посмотрите на этих детей. В детстве всё так просто.", en: "Look at those kids. It's all so easy when you're a kid.", k: "d", who: "Hanna" },
    { fi: "Totta. Aikuisena pitää miettiä kaikkea kauhean tarkasti.", ru: "Правда. Взрослым приходится всё ужасно тщательно обдумывать.", en: "That's true. As an adult you have to consider everything terribly carefully.", k: "d", who: "Mari" },
    { fi: "Mutta ainakin aikuisena voi itse päättää omista asioistaan.", ru: "Но зато взрослым можно самому решать свои дела.", en: "But at least as an adult you can make your own decisions.", k: "d", who: "Petri" },
    { fi: "Onhan se niinkin. Pienenä ei saanut päättää mistään.", ru: "И то верно. Маленьким ничего решать не давали.", en: "That's true as well. When you were small, you weren't allowed to decide anything.", k: "d", who: "Hanna" },
    { fi: "lapsi", ru: "ребёнок", en: "child", k: "w" },
    { fi: "päättää", ru: "решать; заканчивать", en: "to decide", k: "w" },
    { fi: "asia", ru: "дело, вопрос", en: "thing, issue", k: "w" },
    { fi: "tarkasti", ru: "внимательно, точно", en: "carefully", k: "w" },
    { fi: "pieni", ru: "маленький", en: "small", k: "w" },
    { fi: "helppo", ru: "лёгкий", en: "easy", k: "w" },
    { fi: "aikuinen", ru: "взрослый", en: "adult", k: "w" },
    { fi: "miettiä", ru: "обдумывать", en: "to consider", k: "w" },
    { fi: "Kun olin lapsi, ajoin pyörälläni kouluun joka päivä.", ru: "Когда я был ребёнком, я каждый день ездил в школу на велосипеде.", en: "When I was a child I used to ride my bike to school every day.", k: "s" },
    { fi: "Onko sinulla lapsia?", ru: "У тебя есть дети?", en: "Do you have any children?", k: "s" },
    { fi: "Eduskunta päättää tänään uudesta laista.", ru: "Парламент сегодня решает по новому закону.", en: "The Parliament will decide on a new law today.", k: "s" },
    { fi: "Tämä on monimutkainen asia.", ru: "Это сложный вопрос.", en: "This is a complex issue.", k: "s" },
    { fi: "Mittaa pituus tarkasti.", ru: "Измерь длину точно.", en: "Measure the length carefully.", k: "s" },
    { fi: "Auto on pieni, mutta se on erittäin voimakas.", ru: "Машина маленькая, но очень мощная.", en: "The car is small, but it's very powerful.", k: "s" },
    { fi: "Liian suuri on parempi kuin liian pieni.", ru: "Слишком большое лучше, чем слишком маленькое.", en: "Too big is better than too small.", k: "s" },
    { fi: "Voi, miten suloinen pieni kissanpentu!", ru: "Ой, какой милый котёнок!", en: "Oh, what a cute little kitten!", k: "s" },
    { fi: "Tarvitsen pieniä seteleitä.", ru: "Мне нужны мелкие купюры.", en: "I need some small bills.", k: "s" },
    { fi: "Tämä lasku on helppo.", ru: "Этот пример лёгкий.", en: "This calculation is easy.", k: "s" },
    { fi: "Yksi aikuisten lippu, kiitos.", ru: "Один взрослый билет, пожалуйста.", en: "One adult ticket, please.", k: "s" },
    { fi: "Mietin ongelmaa koko päivän, mutta en keksinyt ratkaisua.", ru: "Я весь день думал над задачей, но не нашёл решения.", en: "I was thinking about the problem all day, but couldn't find a solution.", k: "s" },
    { fi: "Lapsi hyppi iloisena.", ru: "Ребёнок радостно прыгал.", en: "The child jumped up and down happily.", k: "s" },
    { fi: "Aurinko hehkui punaisena.", ru: "Солнце пылало красным.", en: "The Sun glowed red.", k: "s" },
    { fi: "Nautitaan kylmänä.", ru: "Употреблять охлаждённым.", en: "Enjoy it chilled.", k: "s" },
    { fi: "Eija on sairaana.", ru: "Эйя болеет (сейчас).", en: "Eija is sick.", k: "s" },
    { fi: "Hän on opettajana Helsingin yliopistossa.", ru: "Он работает преподавателем в Хельсинкском университете.", en: "He works as a teacher at Helsinki University.", k: "s" },
    { fi: "Mikä sinusta tulee isona?", ru: "Кем ты станешь, когда вырастешь?", en: "What will you be when you grow up?", k: "s" },
    { fi: "Isänä oleminen ei ole helppoa.", ru: "Быть отцом непросто.", en: "It is not easy to be a father.", k: "s" },
    { fi: "Aatos oli tarmokas puheenjohtajana.", ru: "Аатос был энергичным председателем.", en: "Aatos was energetic as chairman.", k: "s" },
    { fi: "Kaisa piti Kerttua parhaana ystävänään.", ru: "Кайса считала Кертту своей лучшей подругой.", en: "Kaisa considered Kerttu her best friend.", k: "s" },
    { fi: "Tämä koira on hyvä lemmikkinä, mutta ei metsästyskoirana.", ru: "Эта собака хороша как питомец, но не как охотничья.", en: "This dog is good as a pet, but not as a hound.", k: "s" },
    { fi: "Pelle käytti lapasia sukkina.", ru: "Клоун использовал варежки вместо носков.", en: "The clown used mittens as socks.", k: "s" },
    { fi: "Sinuna pyytäisin anteeksi.", ru: "На твоём месте я бы извинился.", en: "If I were you, I would apologize.", k: "s" },
    { fi: "Hän on opettaja, mutta on nyt työttömänä.", ru: "Он учитель, но сейчас без работы.", en: "He is a teacher, but is currently unemployed.", k: "s" },
    { fi: "Mitä te syötte jouluna?", ru: "Что вы едите на Рождество?", en: "What do you eat during Christmas?", k: "s" },
    { fi: "Viime kesänä satoi paljon.", ru: "Прошлым летом было много дождей.", en: "It rained a lot last summer.", k: "s" },
    { fi: "Onko sinulla menoa tiistaina?", ru: "У тебя есть планы во вторник?", en: "Are you going somewhere on Tuesday?", k: "s" }
  ]
},
{
  id: "LB_S1_16",
  title: "Дни недели",
  source: "FinnishPod101 · Lower Beginner S1 #16",
  glossary: [
    { w: "viikonpäivät", ru: "дни недели и их падежи", en: "weekdays", forms: ["maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauantai", "sunnuntai", "maanantaina", "tiistaina", "keskiviikkona", "torstaina", "perjantaina", "lauantaina", "sunnuntaina", "maanantaista", "tiistaihin", "maanantailta", "tiistaille", "torstain", "sunnuntaille", "lauantaille", "keskiviikosta", "keskiviikolta", "päivänä"],
      note: "maanantai, tiistai, keskiviikko, torstai, perjantai, lauantai, sunnuntai. С заглавной буквы НЕ пишутся — как и названия месяцев и праздников (joulu). «В такой-то день» — эссив, просто добавьте -na: maanantaina, torstaina. Другие падежи для других смыслов: siirsi palaverin maanantaista tiistaihin («перенёс встречу с понедельника на вторник»), Onko sinulla ohjelmaa sunnuntaille? («Есть планы на воскресенье?»), Tänään on lauantai («Сегодня суббота» — номинатив)." },
    { w: "keskiviikko", ru: "среда", en: "Wednesday", forms: ["keskiviikko", "keskiviikkona", "keskiviikolta", "keskiviikosta"],
      note: "Все остальные дни недели заимствованы из древнегерманских языков, а keskiviikko перевели: буквально «середина недели», как немецкое Mittwoch. Приставка keski- («средний») работает и в других словах: keskipäivä («полдень»), keskiyö («полночь»)." },
    { w: "palaveri", ru: "рабочая встреча, совещание", en: "meeting at work", forms: ["palaveri", "palaverin", "palaveria", "palaveriin", "viikkopalaveri"],
      note: "Это встреча на работе, где обсуждают или решают конкретный вопрос — никогда не дружеская встреча. Составные: viikkopalaveri, projektipalaveri, statuspalaveri. Слово слегка разговорное, деловой сленг; в официальном тексте пишут kokous. Kokous при этом шире: sukukokous («семейный сбор»), kansankokous («народное собрание»)." },
    { w: "miten", ru: "как; что значит", en: "how", forms: ["miten"],
      note: "В диалоге устойчивое Miten niin? — «Это почему?», «В смысле?». В остальном вопрос про способ: Miten olet menossa kaupunkiin? — Bussilla." },
    { w: "tuntua", ru: "казаться, ощущаться", en: "to feel like", forms: ["tuntua", "tuntuu", "tuntui"],
      note: "С аблативом (-lta/-ltä): Minusta tuntui ihan keskiviikolta («Мне казалось, что среда»). Minusta tuntuu, että... — «мне кажется, что...»." },
    { w: "onneksi", ru: "к счастью", en: "fortunately", forms: ["onneksi"] },
    { w: "viikonloppu", ru: "выходные", en: "weekend", forms: ["viikonloppu", "viikonloppuna", "viikonloppusi"] },
    { w: "torstai", ru: "четверг", en: "Thursday", forms: ["torstai", "torstaina", "torstain"] },
    { w: "perjantai", ru: "пятница", en: "Friday", forms: ["perjantai", "perjantaina"] }
  ],
  items: [
    { fi: "Etkö tule palaveriin?", ru: "Ты не придёшь на совещание?", en: "Aren't you coming to the meeting?", k: "d", who: "Petri" },
    { fi: "Miten niin? Sehän on torstaina.", ru: "Это почему? Оно же в четверг.", en: "Why? It's on Thursday, isn't it?", k: "d", who: "Hanna" },
    { fi: "Tänään on torstai.", ru: "Сегодня четверг.", en: "It's Thursday today.", k: "d", who: "Petri" },
    { fi: "Kas, niinpä onkin. Minusta tuntui ihan keskiviikolta.", ru: "Надо же, и правда. Мне казалось, что среда.", en: "Oh, that's right. I felt like it's just Wednesday.", k: "d", who: "Hanna" },
    { fi: "Onneksi huomenna on jo perjantai ja viikonloppu.", ru: "К счастью, завтра уже пятница и выходные.", en: "Fortunately, tomorrow is already Friday and the weekend.", k: "d", who: "Hanna" },
    { fi: "maanantai", ru: "понедельник", en: "Monday", k: "w" },
    { fi: "tiistai", ru: "вторник", en: "Tuesday", k: "w" },
    { fi: "keskiviikko", ru: "среда", en: "Wednesday", k: "w" },
    { fi: "torstai", ru: "четверг", en: "Thursday", k: "w" },
    { fi: "perjantai", ru: "пятница", en: "Friday", k: "w" },
    { fi: "lauantai", ru: "суббота", en: "Saturday", k: "w" },
    { fi: "sunnuntai", ru: "воскресенье", en: "Sunday", k: "w" },
    { fi: "viikonloppu", ru: "выходные", en: "weekend", k: "w" },
    { fi: "palaveri", ru: "рабочая встреча", en: "meeting", k: "w" },
    { fi: "onneksi", ru: "к счастью", en: "fortunately", k: "w" },
    { fi: "tuntua", ru: "казаться", en: "to feel like", k: "w" },
    { fi: "miten", ru: "как", en: "how", k: "w" },
    { fi: "Tuletko käymään torstaina?", ru: "Зайдёшь в четверг?", en: "Will you come and see me on Thursday?", k: "s" },
    { fi: "Minusta tuntuu, että hovimestari on murhaaja.", ru: "Мне кажется, что дворецкий — убийца.", en: "I've got a feeling that the butler is the murderer.", k: "s" },
    { fi: "Menen keskiviikkona kampaajalle.", ru: "В среду иду к парикмахеру.", en: "I'm going to the hairdresser's on Wednesday.", k: "s" },
    { fi: "Onneksi se ei ollut mitään vakavaa.", ru: "К счастью, ничего серьёзного.", en: "Fortunately, it wasn't anything serious.", k: "s" },
    { fi: "Perjantaina aion olla kotona ja rentoutua.", ru: "В пятницу собираюсь быть дома и отдыхать.", en: "On Friday, I'm going to stay at home and relax.", k: "s" },
    { fi: "Kuinka yleensä vietät viikonloppusi?", ru: "Как ты обычно проводишь выходные?", en: "How do you usually spend your weekends?", k: "s" },
    { fi: "Mitä aiotte tehdä viikonloppuna?", ru: "Что вы собираетесь делать на выходных?", en: "What are you going to do during the weekend?", k: "s" },
    { fi: "Minulla on huomenna kaksi palaveria.", ru: "У меня завтра две встречи.", en: "I have two meetings tomorrow.", k: "s" },
    { fi: "Meillä on matematiikan koe maanantaina.", ru: "У нас в понедельник контрольная по математике.", en: "We have a math exam on Monday.", k: "s" },
    { fi: "Tiistaina sataa vettä.", ru: "Во вторник будет дождь.", en: "It will rain on Tuesday.", k: "s" },
    { fi: "Vien auton huoltoon keskiviikkona.", ru: "В среду отвезу машину на техобслуживание.", en: "I will take the car for maintenance on Wednesday.", k: "s" },
    { fi: "Torstaina on aina hernekeittoa ja pannukakkua.", ru: "По четвергам всегда гороховый суп и панкейк.", en: "There's always pea soup and pancake on Thursday.", k: "s" },
    { fi: "Mitä aiot tehdä perjantaina?", ru: "Что будешь делать в пятницу?", en: "What are you going to do on Friday?", k: "s" },
    { fi: "Käyttekö te saunassa lauantaina?", ru: "Вы ходите в сауну по субботам?", en: "Do you go to the sauna on Saturday?", k: "s" },
    { fi: "Virtaset lähtivät sunnuntaina Thaimaahan.", ru: "Виртанены в воскресенье улетели в Таиланд.", en: "The Virtanens left for Thailand on Sunday.", k: "s" },
    { fi: "Minä päivänä menisimme elokuviin?", ru: "В какой день пойдём в кино?", en: "On what day shall we go to the movies?", k: "s" },
    { fi: "Mari siirsi palaverin maanantaista tiistaihin.", ru: "Мари перенесла встречу с понедельника на вторник.", en: "Mari moved the meeting from Monday to Tuesday.", k: "s" },
    { fi: "Miksi torstain palaveri on niin myöhään?", ru: "Почему встреча в четверг так поздно?", en: "Why is the meeting on Thursday so late?", k: "s" },
    { fi: "Onko sinulla jo ohjelmaa sunnuntaille?", ru: "У тебя уже есть планы на воскресенье?", en: "Do you already have something to do on Sunday?", k: "s" },
    { fi: "Tänään on lauantai.", ru: "Сегодня суббота.", en: "It's Saturday today.", k: "s" },
    { fi: "Keskiviikosta tulee lämmin päivä.", ru: "Среда будет тёплым днём.", en: "Wednesday is going to be a warm day.", k: "s" },
    { fi: "Vieläkö lauantaille on paikkoja?", ru: "На субботу ещё есть места?", en: "Do you still have seats for Saturday?", k: "s" }
  ]
},
];

const LESSONS_78 = [
{
  id: "LB_S1_07",
  title: "Прошедшее время (имперфект)",
  source: "FinnishPod101 · Lower Beginner S1 #7",
  glossary: [
    { w: "imperfekti", ru: "имперфект: показатель -i- между основой и окончанием", en: "imperfect tense", forms: ["katsoin", "katsoitteko", "katsoit", "katsoi", "katsoimme", "katsoivat", "aioin", "aioit", "aikoi", "luin", "luki", "lukivat", "menin", "meni", "menimme", "olin", "oli", "olivat", "tulin", "tuli", "söin", "söi", "sain", "sait", "sai", "näkivät", "satoi", "voitti", "kävittekö", "teit", "nukutti", "väsytti"],
      note: "Просто рассказ о том, что случилось: действие закончилось до момента речи. В утвердительных формах всегда есть показатель -i- между основой и личным окончанием: katso-i-n, katso-i-t, katso-i (в 3-м лице ед. числа окончания нет), katso-i-mme, katso-i-tte, katso-i-vat. Основа берётся та же, что в настоящем времени, и чередование ступеней работает как обычно: aion → aioin, mutta aikoo → aikoi." },
    { w: "vartalonmuutokset", ru: "изменения основы перед -i-", en: "stem changes before -i-", forms: ["sain", "myin", "luin", "olin", "menin", "söin", "join", "sadoin", "satoi", "annoin", "antoi", "autoin", "laitoin", "kaatoi", "lainasin", "tiesin", "kaipasin", "taisin", "uin"],
      note: "Четыре типа. 1) Долгий гласный укорачивается: saa-n → sa-i-n, myy-n → my-i-n. 2) Последний гласный основы выпадает: lue-n → lu-i-n, mene-n → men-i-n; в односложных основах с -ie, -uo, -yö выпадает первый гласный: syö-n → sö-i-n. 3) Конечное a основы переходит в o, если в основе два слога и первый гласный — a: anta- → anno-i-n, anto-i; sata- → sato-i. 4) Конечный гласный выпадает, а t переходит в s: lainat-a → lainas-i-n, tietä-ä → ties-i-n, taita-a → tais-i-n. Если основа и так кончается на -i, имперфект совпадает с настоящим: uin («плаваю» и «плавал»)." },
    { w: "koko", ru: "весь, целый", en: "entire, all", forms: ["koko"],
      note: "Прилагательное с единственной формой — падежных окончаний не берёт вообще: Luin koko kirjan (ср. Luin hyvän kirjan), Koko kirjassa ei ollut yhtään tylsää kohtaa (ср. Tässä kirjassa...). Таких неизменяемых прилагательных немного, к ним же относятся ensi («следующий») и viime («прошлый»)." },
    { w: "nukuttaa", ru: "укладывать спать; клонить в сон", en: "to make sleep; to feel sleepy", forms: ["nukuttaa", "nukutti", "nukuta"],
      note: "Буквально «заставлять спать»: Lämmin maito nukuttaa («От тёплого молока клонит в сон»), Eeva nukuttaa vauvaa («Ээва укладывает малыша»). Minua nukuttaa значит «мне хочется спать», но minua здесь ОБЪЕКТ, а не подлежащее: глагол в 3-м лице ед. числа, подлежащего нет вовсе. Буквально: «(что-то) нагоняет на меня сон»." },
    { w: "kauhean", ru: "ужасно, страшно (усилитель)", en: "terribly", forms: ["kauhean", "kauheasti"],
      note: "Как и русское «ужасно», часто используется просто для усиления, без всякого ужаса: kauhean mielenkiintoinen («ужасно интересный»)." },
    { w: "aikoa", ru: "собираться, намереваться", en: "to intend, to be going to", forms: ["aikoa", "aion", "aiotko", "aioin", "aikoi", "aiotte"] },
    { w: "mennä nukkumaan", ru: "идти спать", en: "to go to bed", forms: ["nukkumaan", "menkää", "menin", "menimme"] },
    { w: "liian", ru: "слишком", en: "too, excessively", forms: ["liian"] },
    { w: "aikaisin", ru: "рано", en: "early", forms: ["aikaisin"] },
    { w: "eilen", ru: "вчера", en: "yesterday", forms: ["eilen"] },
    { w: "jääkiekko", ru: "хоккей", en: "ice hockey", forms: ["jääkiekko", "jääkiekkoa"] },
    { w: "ilta", ru: "вечер", en: "evening", forms: ["ilta", "illan", "illalla", "iltaa", "kesäiltana", "illasta"] }
  ],
  items: [
    { fi: "Katsoitteko eilen jääkiekkoa?", ru: "Вы вчера смотрели хоккей?", en: "Did you watch ice hockey yesterday?", k: "d", who: "Mari" },
    { fi: "Minä luin koko illan yhtä kirjaa.", ru: "Я весь вечер читала одну книгу.", en: "I spent the whole evening reading a book.", k: "d", who: "Hanna" },
    { fi: "Se oli kauhean mielenkiintoinen.", ru: "Она была ужасно интересная.", en: "It was terribly interesting.", k: "d", who: "Hanna" },
    { fi: "Minä kyllä aioin, mutta olin liian väsynyt.", ru: "Я-то собирался, но был слишком уставший.", en: "I was going to, but I was too tired.", k: "d", who: "Petri" },
    { fi: "Menin aikaisin nukkumaan.", ru: "Я рано лёг спать.", en: "I went to bed early.", k: "d", who: "Petri" },
    { fi: "Minä katsoin. Mutta kyllä minuakin nukutti.", ru: "Я смотрела. Но меня тоже клонило в сон.", en: "I watched it, but I was sleepy, too.", k: "d", who: "Mari" },
    { fi: "kauhean", ru: "ужасно (усилитель)", en: "terribly", k: "w" },
    { fi: "aikoa", ru: "собираться", en: "to intend", k: "w" },
    { fi: "liian", ru: "слишком", en: "too", k: "w" },
    { fi: "aikaisin", ru: "рано", en: "early", k: "w" },
    { fi: "mennä nukkumaan", ru: "идти спать", en: "to go to bed", k: "w" },
    { fi: "nukuttaa", ru: "клонить в сон", en: "to feel sleepy", k: "w" },
    { fi: "eilen", ru: "вчера", en: "yesterday", k: "w" },
    { fi: "jääkiekko", ru: "хоккей", en: "ice hockey", k: "w" },
    { fi: "koko", ru: "весь, целый", en: "entire", k: "w" },
    { fi: "ilta", ru: "вечер", en: "evening", k: "w" },
    { fi: "Virtasilla on kauhean monta kissaa.", ru: "У Виртаненов ужасно много кошек.", en: "The Virtanens have terribly many cats.", k: "s" },
    { fi: "Aiotko katsoa tänään telkkaria?", ru: "Ты собираешься сегодня смотреть телевизор?", en: "Are you planning to watch TV today?", k: "s" },
    { fi: "Tämä ruoka on liian tulista minulle.", ru: "Эта еда слишком острая для меня.", en: "This food is too hot for me.", k: "s" },
    { fi: "Menkää illalla aikaisin nukkumaan.", ru: "Ложитесь вечером спать пораньше.", en: "Go to bed early in the evening.", k: "s" },
    { fi: "Minun pitää herätä huomenna aikaisin.", ru: "Мне завтра надо рано встать.", en: "I'll have to get up early tomorrow.", k: "s" },
    { fi: "Nyt on aika mennä nukkumaan!", ru: "Пора спать!", en: "It's time to go to bed now!", k: "s" },
    { fi: "Äiti nukuttaa vauvaa.", ru: "Мама укладывает малыша.", en: "The mother is trying to make the baby sleep.", k: "s" },
    { fi: "Lämmin maito nukuttaa.", ru: "От тёплого молока клонит в сон.", en: "Warm milk makes you sleepy.", k: "s" },
    { fi: "Mitä teit eilen?", ru: "Что ты делал вчера?", en: "What did you do yesterday?", k: "s" },
    { fi: "Pelaajat pelaavat jääkiekkoa.", ru: "Игроки играют в хоккей.", en: "The players are playing ice hockey.", k: "s" },
    { fi: "Söitkö yksin koko kakun?", ru: "Ты один съел весь торт?", en: "Did you eat the entire cake by yourself?", k: "s" },
    { fi: "Luin koko kirjan.", ru: "Я прочитал всю книгу.", en: "I read the entire book.", k: "s" },
    { fi: "Tenniskenttä on auki myös illalla.", ru: "Теннисный корт открыт и вечером.", en: "The tennis court is open in the evening, too.", k: "s" },
    { fi: "Pelaamme usein korttia lämpimänä kesäiltana.", ru: "Мы часто играем в карты тёплым летним вечером.", en: "We often play cards on a warm summer evening.", k: "s" },
    { fi: "Hauskaa iltaa!", ru: "Хорошего вечера!", en: "Have a nice evening!", k: "s" },
    { fi: "Päivällä teen ahkerasti töitä, joten illalla rentoudun.", ru: "Днём я усердно работаю, поэтому вечером отдыхаю.", en: "I work hard during the day, so I relax in the evening.", k: "s" },
    { fi: "Menimme eilen myöhään nukkumaan.", ru: "Вчера мы поздно легли спать.", en: "We went to bed late yesterday.", k: "s" },
    { fi: "Luin viime viikolla kaksi kirjaa.", ru: "На прошлой неделе я прочитал две книги.", en: "I read two books last week.", k: "s" },
    { fi: "Ville oli joukkueen paras hyökkääjä.", ru: "Вилле был лучшим нападающим команды.", en: "Ville was the best forward of the team.", k: "s" },
    { fi: "Vesi oli kylmää.", ru: "Вода была холодная.", en: "The water was cold.", k: "s" },
    { fi: "Suomi voitti Ruotsin 1-0.", ru: "Финляндия обыграла Швецию 1:0.", en: "Finland beat Sweden one to zero.", k: "s" },
    { fi: "Maiju ja Emmi näkivät Riikan äsken kaupungilla.", ru: "Майю и Эмми только что видели Рийкку в городе.", en: "Maiju and Emmi saw Riikka in town a moment ago.", k: "s" },
    { fi: "Eilen satoi koko päivän.", ru: "Вчера дождь шёл весь день.", en: "It rained all day yesterday.", k: "s" },
    { fi: "Söin lounaalla keittoa.", ru: "На обед я ел суп.", en: "I had soup for lunch.", k: "s" },
    { fi: "Kävittekö eilen kirjastossa?", ru: "Вы вчера были в библиотеке?", en: "Did you go to the library yesterday?", k: "s" },
    { fi: "Sait kokeesta täydet pisteet.", ru: "Ты получил за экзамен полный балл.", en: "You got full marks from the exam.", k: "s" }
  ]
},
{
  id: "LB_S1_08",
  title: "Вспомогательные глаголы: кофе или чай",
  source: "FinnishPod101 · Lower Beginner S1 #8",
  glossary: [
    { w: "apuverbit", ru: "вспомогательные глаголы + инфинитив", en: "helping verbs", forms: ["aikoa", "haluta", "tahtoa", "unohtaa", "ajatella", "luvata", "pelätä", "jaksaa", "uskaltaa", "viitsiä", "yrittää", "alkaa", "ehtiä", "täytyä", "osata", "halusit", "tahtoo", "unohdimme", "ajattelitko", "lupasivat", "pelkää", "jaksoin", "uskalsi", "viitsi", "yritän", "alkoi", "ehdimmekö", "täytyy", "osaa"],
      note: "Вспомогательный глагол берёт на себя лицо и время, а основной остаётся в инфинитиве — в словарной форме: Aion juosta maratonin. Обычно инфинитив идёт сразу после вспомогательного, но порядок может меняться ради акцента. Список: aikoa (собираться), haluta / tahtoa (хотеть), unohtaa (забыть), ajatella (думать, планировать), luvata (обещать), pelätä (бояться), päättää (решить), jaksaa (иметь силы), uskaltaa (осмелиться), viitsiä (иметь охоту), yrittää (пытаться), alkaa (начинать), ehtiä (успевать), meinata (собираться), pitää / täytyä (быть должным), saada (иметь разрешение), taitaa (пожалуй), voida (мочь), osata (уметь)." },
    { w: "voida", ru: "мочь (возможность, разрешение)", en: "to be able to, can", forms: ["voida", "voin", "voinko", "voitko", "voisin", "voi", "voitte"],
      note: "Про возможность, разрешение или самочувствие: Voinko mennä ulos? («Можно мне на улицу?»), Kuinka voitte? («Как вы себя чувствуете?»). НО не про умение! «Я умею петь» — Osaan laulaa. Voin laulaa значит только, что мне ничто не мешает петь, например горло не болит." },
    { w: "taitaa", ru: "пожалуй, похоже; уметь", en: "to be likely; to master", forms: ["taitaa", "taidan", "taisi", "taitaisi"],
      note: "Говорит о вероятности, часто на основании увиденного: Koira taitaa olla nälkäinen («Собака, похоже, голодная»). Про свои планы звучит мягче, чем aikoa: Taidan mennä aikaisin nukkumaan («Пожалуй, лягу пораньше») против решительного Aion mennä aikaisin nukkumaan." },
    { w: "meinata", ru: "собираться; иметь в виду; чуть не сделать", en: "to intend; to mean", forms: ["meinata", "meinaatteko", "meinaatko", "meinasin", "meinasimme"],
      note: "Разговорнее, чем aikoa, но смысл тот же. Плюс два своих значения. Первое — «иметь в виду» (из шведского mena): Mitä meinaat? («Что ты имеешь в виду?»). Второе — «чуть не»: Meinasin kaataa kukkamaljakon («Я чуть не опрокинул вазу»), Meinasimme törmätä hirveen («Мы чуть не врезались в лося»)." },
    { w: "kerta", ru: "раз", en: "time (this time, next time)", forms: ["kerta", "kertaa", "kerralla", "kertaa", "kerran"] },
    { w: "oikeastaan", ru: "вообще-то, на самом деле", en: "actually", forms: ["oikeastaan"] },
    { w: "juoda", ru: "пить", en: "to drink", forms: ["juoda", "juon", "juo", "join"] },
    { w: "vielä", ru: "ещё", en: "still, yet", forms: ["vielä"] },
    { w: "ainakin", ru: "по крайней мере", en: "at least", forms: ["ainakin"] }
  ],
  items: [
    { fi: "Meinaatteko ottaa vielä kahvia?", ru: "Вы будете ещё кофе?", en: "Are you still going to take coffee?", k: "d", who: "Hanna" },
    { fi: "Minä ainakin aion ottaa.", ru: "Я, по крайней мере, буду.", en: "I'm going to have some, at least.", k: "d", who: "Mari" },
    { fi: "Kyllä minäkin voisin juoda kahvia.", ru: "Да, я бы тоже выпил кофе.", en: "Yes, I could have some coffee, as well.", k: "d", who: "Petri" },
    { fi: "Hyvä, haetaan sitten.", ru: "Хорошо, тогда сходим за ним.", en: "Good, then let's go and get it.", k: "d", who: "Hanna" },
    { fi: "Minä taidan oikeastaan ottaa tällä kertaa teetä.", ru: "Я, вообще-то, пожалуй, возьму на этот раз чай.", en: "Actually, I think I'll have tea this time.", k: "d", who: "Hanna" },
    { fi: "taitaa", ru: "пожалуй, похоже", en: "to be likely", k: "w" },
    { fi: "oikeastaan", ru: "вообще-то", en: "actually", k: "w" },
    { fi: "kerta", ru: "раз", en: "time", k: "w" },
    { fi: "meinata", ru: "собираться; иметь в виду", en: "to intend", k: "w" },
    { fi: "juoda", ru: "пить", en: "to drink", k: "w" },
    { fi: "vielä", ru: "ещё", en: "still, yet", k: "w" },
    { fi: "ainakin", ru: "по крайней мере", en: "at least", k: "w" },
    { fi: "voida", ru: "мочь", en: "to be able to", k: "w" },
    { fi: "osata", ru: "уметь", en: "to have the skill", k: "w" },
    { fi: "haluta", ru: "хотеть", en: "to want", k: "w" },
    { fi: "jaksaa", ru: "иметь силы", en: "to have the strength", k: "w" },
    { fi: "uskaltaa", ru: "осмелиться", en: "to dare", k: "w" },
    { fi: "viitsiä", ru: "иметь охоту, не лениться", en: "to be bothered", k: "w" },
    { fi: "ehtiä", ru: "успевать", en: "to have the time", k: "w" },
    { fi: "täytyä", ru: "быть должным", en: "to have to", k: "w" },
    { fi: "Taitaa tulla kylmä päivä.", ru: "Похоже, день будет холодный.", en: "It looks like it's going to be a cold day.", k: "s" },
    { fi: "Oikeastaan minulla on jo kiire.", ru: "Вообще-то я уже спешу.", en: "Actually, I'm in a hurry already.", k: "s" },
    { fi: "Anna minun auttaa ensi kerralla.", ru: "В следующий раз дай мне помочь.", en: "Next time, let me help you.", k: "s" },
    { fi: "Meinaatko katsoa tänään telkkaria?", ru: "Ты собираешься сегодня смотреть телевизор?", en: "Are you going to watch TV today?", k: "s" },
    { fi: "Nainen juo vettä.", ru: "Женщина пьёт воду.", en: "The woman drinks water.", k: "s" },
    { fi: "Saisinko vielä yhden.", ru: "Можно мне ещё один.", en: "May I have one more, please.", k: "s" },
    { fi: "Lunta on ainakin kymmenen senttimetriä.", ru: "Снега как минимум десять сантиметров.", en: "There is at least ten centimeters of snow.", k: "s" },
    { fi: "Valitan, mutta en voi auttaa.", ru: "Сожалею, но я не могу помочь.", en: "I'm sorry, but I can't help you.", k: "s" },
    { fi: "Mitä meinaat?", ru: "Что ты имеешь в виду?", en: "What do you mean?", k: "s" },
    { fi: "Meinasin kaataa kukkamaljakon.", ru: "Я чуть не опрокинул вазу.", en: "I almost knocked over the flower vase.", k: "s" },
    { fi: "Voinko mennä Joonaksen kanssa ulos?", ru: "Можно мне пойти на улицу с Йоонасом?", en: "May I go out with Joonas?", k: "s" },
    { fi: "Kuinka voitte?", ru: "Как вы себя чувствуете?", en: "How are you?", k: "s" },
    { fi: "Osaan laulaa.", ru: "Я умею петь.", en: "I can sing.", k: "s" },
    { fi: "Koira taitaa olla nälkäinen.", ru: "Собака, похоже, голодная.", en: "The dog seems hungry.", k: "s" },
    { fi: "Taidan mennä aikaisin nukkumaan.", ru: "Пожалуй, лягу спать пораньше.", en: "I think I'll go to bed early.", k: "s" },
    { fi: "Aion mennä aikaisin nukkumaan.", ru: "Я собираюсь лечь спать пораньше.", en: "I'm going to go to bed early.", k: "s" },
    { fi: "Aion juosta maratonin.", ru: "Я собираюсь пробежать марафон.", en: "I'm going to run a marathon.", k: "s" },
    { fi: "Eero tahtoo aina olla paras.", ru: "Ээро всегда хочет быть лучшим.", en: "Eero always wants to be the best.", k: "s" },
    { fi: "Unohdimme käydä kaupassa.", ru: "Мы забыли зайти в магазин.", en: "We forgot to go to the store.", k: "s" },
    { fi: "Antti ja Elina lupasivat tulla kolmelta.", ru: "Антти и Элина обещали прийти в три.", en: "Antti and Elina promised to come at three.", k: "s" },
    { fi: "Mummi pelkää mennä pimeällä ulos.", ru: "Бабушка боится выходить в темноте.", en: "Grandma is afraid to go out when it's dark.", k: "s" },
    { fi: "Reijo päätti lopettaa opiskelun ja mennä töihin.", ru: "Рейо решил бросить учёбу и пойти работать.", en: "Reijo decided to quit studying and go to work.", k: "s" },
    { fi: "Jaksoin juosta koko matkan.", ru: "У меня хватило сил пробежать всю дистанцию.", en: "I had the strength to run all the way.", k: "s" },
    { fi: "Viivi uskalsi silittää koiraa.", ru: "Вийви осмелилась погладить собаку.", en: "Viivi had the courage to pat the dog.", k: "s" },
    { fi: "En viitsi lähteä salille tänään.", ru: "Мне сегодня лень идти в зал.", en: "I can't be bothered to go to the gym today.", k: "s" },
    { fi: "Yritän laihtua kaksi kiloa.", ru: "Я пытаюсь сбросить два килограмма.", en: "I'm trying to lose two kilos.", k: "s" },
    { fi: "Merja alkoi kirjoittaa päiväkirjaa.", ru: "Мерья начала вести дневник.", en: "Merja started to keep a diary.", k: "s" },
    { fi: "Ehdimmekö tehdä tämän tänään?", ru: "Мы успеем сделать это сегодня?", en: "Will we have the time to do this today?", k: "s" },
    { fi: "Meinasin unohtaa tapaamisen.", ru: "Я чуть не забыл про встречу.", en: "I almost forgot the meeting.", k: "s" },
    { fi: "Jesperin pitää tehdä läksyt.", ru: "Йеспери надо сделать уроки.", en: "Jesperi has to do his homework.", k: "s" },
    { fi: "Kalle ei saa katsoa telkkaria.", ru: "Калле нельзя смотреть телевизор.", en: "Kalle is not allowed to watch TV.", k: "s" },
    { fi: "Minna taisi jo mennä kotiin.", ru: "Минна, кажется, уже ушла домой.", en: "I think Minna went home already.", k: "s" },
    { fi: "Teidän täytyy odottaa hetki.", ru: "Вам придётся подождать минутку.", en: "You'll have to wait a moment.", k: "s" },
    { fi: "Voitko auttaa vähän?", ru: "Можешь немного помочь?", en: "Can you help a bit?", k: "s" },
    { fi: "Sara osaa jo lukea.", ru: "Сара уже умеет читать.", en: "Sara can read already.", k: "s" }
  ]
},
];

const LESSONS_4569 = [
{
  id: "LB_S1_04",
  title: "Чей телефон: притяжательные окончания",
  source: "FinnishPod101 · Lower Beginner S1 #4",
  glossary: [
    { w: "omistusliitteet", ru: "притяжательные окончания: -ni, -si, -nsa, -mme, -nne", en: "possessive suffixes",
      forms: ["työpöytäsi", "puhelimensa", "puhelimesi", "puhelimeni", "taloni", "talosi", "talonsa", "talomme", "talonne", "autoni", "autonsa", "äitini", "poikasi", "koiransa", "työtoverisi", "sateenvarjonsa", "vaimonsa", "työpöytäni", "työpöytänsä", "lasini", "vyönsä", "pojalleni", "pöydällensä", "kotimatkallaan"],
      note: "Схема: генитив личного местоимения + предмет с притяжательным окончанием. minun -ni, sinun -si, hänen -nsa/-nsä, meidän -mme, teidän -nne, heidän -nsa/-nsä.\nОкончание идёт после падежного, но перед энклитиками (-kin, -pa). Если падежное окончание кончается на согласный — генитив -n или номинатив множественного -t, — этот согласный отбрасывается. Поэтому taloni может значить и «мой дом», и «моего дома», и «мои дома»: различает только контекст.\nМестоимение часто опускают: в 1-м и 2-м лице почти всегда (Autoni on huollossa), если на нём нет особого ударения (Minunkin äitini...). В 3-м лице, когда предмет — подлежащее, местоимение обязательно: Hänen autonsa on huollossa." },
    { w: "hänen vai ei", ru: "чей именно: с hänen или без", en: "third person: whose exactly",
      forms: ["hänen", "heidän"],
      note: "Когда предмет НЕ подлежащее, наличие hänen меняет смысл. Если владелец и есть подлежащее — местоимение убирают: Pekka lähtee kotiin. Sirpa siivoaa työpöytänsä («Сирпа убирает свой стол»). Если владелец кто-то другой — hänen обязательно: Sirpa siivoaa hänen työpöytänsä («убирает его стол»). В 1-м и 2-м лице такой разницы нет." },
    { w: "pitkä omistusliite", ru: "второй вариант окончания 3-го лица: долгий гласный + n", en: "alternative third person suffix",
      forms: ["taloaan", "talossaan", "talostaan", "talollaan", "taloltaan", "talolleen", "taloonsa", "kotimatkallaan"],
      note: "У 3-го лица есть второй вариант: долгий гласный + n. Он годится в непрямых падежах, если падежное окончание кончается на один гласный: talossansa или talossaan, talollensa или talolleen. В разговорной речи чаще именно он, а -nsa звучит книжно. В номинативе и генитиве вариант один: talonsa." },
    { w: "joku", ru: "кто-то, некто", en: "someone",
      forms: ["joku", "jonkun", "jotakuta", "jossakussa", "jotkut"],
      note: "Местоимение для неизвестного человека. Странность в том, что склоняется в двух местах сразу, будто jo и ku — отдельные слова: генитив jonkun, партитив jotakuta, инессив jossakussa, номинатив множественного jotkut. Сами окончания обычные, надо только не забыть вставить их ещё и в середину." },
    { w: "-pa/-pä", ru: "энклитика усиления", en: "emphasis marker",
      forms: ["onpa", "niinpä", "käveletpä", "jäätelöpä", "minullapa", "juupas", "eipäs"],
      note: "Цепляется к концу слова и усиливает его — в разговорной речи есть и вариант -pas. Идёт последним: после падежных окончаний, притяжательных суффиксов и глагольных форм. Minullapa on jäätelöä («А у меня мороженое, а у тебя нет»), Onpa täällä kuuma («Ну и жарко же тут»). Персонажей Ричарда Скарри Pig Will и Pig Won't перевели как Juupas-possu и Eipäs-possu — от juu («ага») и ei («нет»)." },
    { w: "-kin", ru: "энклитика «тоже»", en: "also",
      forms: ["jussikin", "minullakin", "jäätelökin", "käveletkin", "minunkin", "projektikin", "niinpä onkin"],
      note: "Вторая энклитика: значит «тоже, также». Minullakin on jäätelöä («У меня тоже есть мороженое»), Jäätelökin on hyvää («И мороженое тоже вкусное»)." },
    { w: "lähin", ru: "ближайший", en: "the closest",
      forms: ["lähin", "lähellä"],
      note: "Превосходная степень от lähellä («близко»). Про расстояние (lähin kahvila) и про отношения (lähin työtoveri — «ближайший коллега», тот, с кем работаешь теснее всего)." },
    { w: "unohtaa", ru: "забывать", en: "to forget", forms: ["unohtaa", "unohdan", "unohda", "unohtanut", "unohtako"] },
    { w: "puhelin", ru: "телефон", en: "phone", forms: ["puhelin", "puhelinta", "puhelimen", "puhelimeni", "puhelimesi", "puhelimensa"] },
    { w: "työtoveri", ru: "коллега", en: "colleague", forms: ["työtoveri", "työtoverit", "työtoverisi"] },
    { w: "työpöytä", ru: "рабочий стол", en: "desk", forms: ["työpöytä", "työpöytäni", "työpöytäsi", "työpöytänsä"] },
    { w: "kas", ru: "о, надо же", en: "oh", forms: ["kas"] },
    { w: "niin", ru: "так, настолько", en: "so, as", forms: ["niin", "niinpä"] }
  ],
  items: [
    { fi: "Tässä on Hanna.", ru: "Это Ханна.", en: "This is Hanna.", k: "d", who: "Mari" },
    { fi: "Hanna on lähin työtoverisi.", ru: "Ханна — твоя ближайшая коллега.", en: "Hanna will be your closest colleague.", k: "d", who: "Mari" },
    { fi: "Hei!", ru: "Привет!", en: "Hi!", k: "d", who: "Hanna" },
    { fi: "Terve!", ru: "Здравствуй!", en: "Hello!", k: "d", who: "Petri" },
    { fi: "Tässä on sinun työpöytäsi.", ru: "Вот твой рабочий стол.", en: "Here's your desk.", k: "d", who: "Mari" },
    { fi: "Kas, onko joku unohtanut puhelimensa tähän?", ru: "Надо же, кто-то забыл здесь телефон?", en: "Oh, has someone forgotten their phone here?", k: "d", who: "Mari" },
    { fi: "Eikös se ole sinun puhelimesi?", ru: "А это разве не твой телефон?", en: "Isn't that your phone?", k: "d", who: "Hanna" },
    { fi: "Minun puhelimeni? No niinpä onkin.", ru: "Мой телефон? И правда мой.", en: "My phone? Oh, that's right, so it is.", k: "d", who: "Mari" },
    { fi: "puhelin", ru: "телефон", en: "phone", k: "w" },
    { fi: "niin", ru: "так, настолько", en: "so, as", k: "w" },
    { fi: "-pa/-pä", ru: "усилительная частица", en: "emphasis marker", k: "w" },
    { fi: "-kin", ru: "тоже, также", en: "also", k: "w" },
    { fi: "lähin", ru: "ближайший", en: "the closest", k: "w" },
    { fi: "unohtaa", ru: "забывать", en: "to forget", k: "w" },
    { fi: "joku", ru: "кто-то", en: "someone", k: "w" },
    { fi: "työtoveri", ru: "коллега", en: "colleague", k: "w" },
    { fi: "työpöytä", ru: "рабочий стол", en: "desk", k: "w" },
    { fi: "kas", ru: "о, надо же", en: "oh", k: "w" },
    { fi: "Onko sinulla puhelinta?", ru: "У тебя есть телефон?", en: "Do you have a phone?", k: "s" },
    { fi: "Hän hukkasi puhelimensa kotimatkallaan.", ru: "Он потерял телефон по дороге домой.", en: "He lost his phone on his way home.", k: "s" },
    { fi: "Puhelimesi soi.", ru: "У тебя телефон звонит.", en: "Your phone is ringing.", k: "s" },
    { fi: "Tulen niin pian kuin pääsen.", ru: "Приду, как только смогу.", en: "I'll come as soon as I can.", k: "s" },
    { fi: "Onpa täällä kuuma.", ru: "Ну и жарко же тут.", en: "I say, it's hot here.", k: "s" },
    { fi: "Jussikin tulee.", ru: "Юсси тоже придёт.", en: "Jussi is coming, too.", k: "s" },
    { fi: "Missä on lähin kahvila?", ru: "Где ближайшее кафе?", en: "Where is the closest café?", k: "s" },
    { fi: "Älä koskaan unohda mistä tulet.", ru: "Никогда не забывай, откуда ты родом.", en: "Never forget where you come from.", k: "s" },
    { fi: "Unohdan aina, missä lasini ovat.", ru: "Я вечно забываю, где мои очки.", en: "I always forget where my glasses are.", k: "s" },
    { fi: "Mies unohtaa vyönsä.", ru: "Мужчина забывает свой ремень.", en: "The man forgets his belt.", k: "s" },
    { fi: "Jonkun koira odottaa oven ulkopuolella.", ru: "Чья-то собака ждёт за дверью.", en: "Somebody's dog is waiting outside the door.", k: "s" },
    { fi: "Minulla on mukavat työtoverit.", ru: "У меня приятные коллеги.", en: "I have nice colleagues.", k: "s" },
    { fi: "Työpöytäni on huoneen keskellä.", ru: "Мой стол посреди комнаты.", en: "My desk is in the middle of the room.", k: "s" },
    { fi: "Kas, posti on jo tullut.", ru: "О, почта уже пришла.", en: "Oh, the mail has already arrived.", k: "s" },
    { fi: "Minullapa on jäätelöä.", ru: "А у меня мороженое!", en: "I've got ice cream (and you don't)!", k: "s" },
    { fi: "Jäätelöpä maistuu hyvältä.", ru: "Ох и вкусное же мороженое.", en: "I say, ice cream sure tastes good.", k: "s" },
    { fi: "Käveletpä nopeasti.", ru: "Ну и быстро же ты ходишь.", en: "I say, you walk briskly.", k: "s" },
    { fi: "Minullakin on jäätelöä.", ru: "У меня тоже есть мороженое.", en: "I've got ice cream, too.", k: "s" },
    { fi: "Jäätelökin on hyvää.", ru: "И мороженое тоже вкусное.", en: "Ice cream is good, as well.", k: "s" },
    { fi: "Käveletkin nopeasti.", ru: "Ты тоже быстро ходишь.", en: "You walk briskly, too.", k: "s" },
    { fi: "Minun autoni on punainen, mutta hänen autonsa on vihreä.", ru: "Моя машина красная, а его — зелёная.", en: "My car is red, but his car is green.", k: "s" },
    { fi: "Autoni on huollossa.", ru: "Моя машина на техобслуживании.", en: "My car is in maintenance.", k: "s" },
    { fi: "Hänen autonsa on huollossa.", ru: "Его машина на техобслуживании.", en: "His car is in maintenance.", k: "s" },
    { fi: "Äitini harrastaa joogaa.", ru: "Моя мама занимается йогой.", en: "My mother is into yoga.", k: "s" },
    { fi: "Minunkin äitini harrastaa joogaa.", ru: "Моя мама тоже занимается йогой.", en: "My mother is into yoga, too.", k: "s" },
    { fi: "Teidän talonne on suurempi kuin meidän.", ru: "Ваш дом больше нашего.", en: "Your house is bigger than ours.", k: "s" },
    { fi: "Heidän koiransa on hyvin koulutettu.", ru: "Их собака хорошо выдрессирована.", en: "Their dog is well trained.", k: "s" },
    { fi: "Meneekö poikasi syksyllä kouluun?", ru: "Твой сын осенью пойдёт в школу?", en: "Is your son going to school in the fall?", k: "s" },
    { fi: "Sirpa siivoaa työpöytänsä.", ru: "Сирпа убирает свой стол.", en: "Sirpa tidies her own desk.", k: "s" },
    { fi: "Sirpa siivoaa hänen työpöytänsä.", ru: "Сирпа убирает его стол.", en: "Sirpa tidies his desk.", k: "s" },
    { fi: "Sirpa järjestää paperit pöydällensä.", ru: "Сирпа раскладывает бумаги на своём столе.", en: "Sirpa organizes the papers on her own desk.", k: "s" },
    { fi: "Sirpa järjestää paperit hänen pöydällensä.", ru: "Сирпа раскладывает бумаги на его столе.", en: "Sirpa organizes the papers on his desk.", k: "s" },
    { fi: "Opettaja antoi pojalleni huonon arvosanan.", ru: "Учитель поставил моему сыну плохую оценку.", en: "The teacher gave my son a poor grade.", k: "s" },
    { fi: "Hänen vaimonsa unohtaa aina sateenvarjonsa.", ru: "Его жена вечно забывает свой зонт.", en: "His wife always forgets her own umbrella.", k: "s" },
    { fi: "Hänen vaimonsa unohtaa aina hänen sateenvarjonsa.", ru: "Его жена вечно забывает его зонт.", en: "His wife always forgets his umbrella.", k: "s" }
  ]
},
{
  id: "LB_S1_05",
  title: "Три способа сказать «чей»",
  source: "FinnishPod101 · Lower Beginner S1 #5",
  glossary: [
    { w: "omistuksen kolme tapaa", ru: "три конструкции принадлежности", en: "three ways of expressing possession",
      forms: ["minulla", "sinulla", "hänellä", "meillä", "teillä", "hannan", "marin", "kirjaston", "kasvin", "tuon", "sen", "niiden", "kynänsä", "kaapissaan", "kynävarastomme", "isäni", "isänsä", "opettajansa", "opettajamme", "voileipänsä", "taskuunsa", "tavaroitanne"],
      note: "Их ровно три, и они не смешиваются.\n1) Адессив + olla — «у меня есть»: Minulla on kissa. Владелец тут НЕ подлежащее, подлежащее — сама вещь, поэтому она в номинативе или партитиве. Так сообщают новую информацию или спрашивают: Onko sinulla sokeria?\n2) Существительное или указательное местоимение в генитиве: Hannan kynä on keltainen, Tuon pojan koira on iloinen. Никакого притяжательного окончания у вещи при этом НЕТ. Указательные местоимения (tämä, tuo, se, nämä, nuo, ne) ведут себя как существительные.\n3) Личное местоимение в генитиве + притяжательное окончание: hänen kynänsä. Только личные местоимения включают притяжательное окончание. Правила опускания местоимения — из урока 4." },
    { w: "lainata", ru: "одалживать: и брать, и давать", en: "to borrow, to lend",
      forms: ["lainata", "lainaa", "lainasin", "lainaisitko", "lainaan"],
      note: "Одно слово на оба направления, а кто кому — показывают падежи. Jaakko lainaa Erkille viisi euroa — «Яакко даёт Эркки взаймы пять евро» (аллатив -lle). Jaakko lainaa Erkiltä viisi euroa — «Яакко занимает у Эркки» (аблатив -ltä)." },
    { w: "itse", ru: "сам, себя", en: "self, oneself",
      forms: ["itse", "itselleni", "itsellesi", "itsellemme", "itsekseni"],
      note: "Может стоять само: Minä pärjään itse («Я справлюсь сам»), Itse tarina ei ole kovin hyvä («Сама история не очень»). Часто с притяжательным окончанием: Hae itsellesi uusi kynä («Возьми себе новую ручку»), Ostamme itsellemme koiran." },
    { w: "kynä", ru: "ручка, карандаш", en: "pen, pencil",
      forms: ["kynä", "kynää", "kynäsi", "kynästä", "kynänsä", "kynävarastomme"],
      note: "Общее слово для всего пишущего. Уточняют приставкой: lyijykynä («карандаш»), värikynä («цветной карандаш»), kuulakärkikynä («шариковая ручка»), mustekynä («перьевая»), sulkakynä («гусиное перо»), huopakynä («фломастер»)." },
    { w: "varasto", ru: "запас, склад", en: "stock, warehouse", forms: ["varasto", "varaston", "kynävarasto", "kynävarastomme"] },
    { w: "pyyhekumi", ru: "ластик", en: "eraser", forms: ["pyyhekumi", "pyyhekumeja", "kumeja"] },
    { w: "lehtiö", ru: "блокнот", en: "notepad", forms: ["lehtiö", "lehtiön", "lehtiöitä"] },
    { w: "hetkeksi", ru: "на минутку", en: "for a moment", forms: ["hetkeksi", "hetki"] },
    { w: "toki", ru: "конечно, разумеется", en: "sure", forms: ["toki", "onhan"] },
    { w: "kaappi", ru: "шкаф", en: "cabinet", forms: ["kaappi", "kaapissa", "kaapissaan"] }
  ],
  items: [
    { fi: "Hanna, onko sinulla kynää?", ru: "Ханна, у тебя есть ручка?", en: "Hanna, do you have a pencil?", k: "d", who: "Petri" },
    { fi: "Saanko lainata hetkeksi?", ru: "Можно одолжить на минутку?", en: "May I borrow one for a second?", k: "d", who: "Petri" },
    { fi: "Toki, ota tämä.", ru: "Конечно, бери эту.", en: "Sure, take this.", k: "d", who: "Hanna" },
    { fi: "Minä haen itselleni uuden Marilta.", ru: "Я возьму себе новую у Мари.", en: "I'll get myself a new one from Mari.", k: "d", who: "Hanna" },
    { fi: "Kynävarastomme on hänen kaapissaan.", ru: "Наш запас ручек в её шкафу.", en: "Our stock of pencils is in her cabinet.", k: "d", who: "Hanna" },
    { fi: "Kiitos.", ru: "Спасибо.", en: "Thank you.", k: "d", who: "Petri" },
    { fi: "Marin kaapissa on myös lehtiöitä ja kumeja.", ru: "В шкафу у Мари ещё блокноты и ластики.", en: "There are also notebooks and erasers in Mari's cabinet.", k: "d", who: "Hanna" },
    { fi: "kynä", ru: "ручка, карандаш", en: "pen, pencil", k: "w" },
    { fi: "varasto", ru: "запас, склад", en: "stock", k: "w" },
    { fi: "pyyhekumi", ru: "ластик", en: "eraser", k: "w" },
    { fi: "itse", ru: "сам, себя", en: "self", k: "w" },
    { fi: "lainata", ru: "одалживать", en: "to borrow, to lend", k: "w" },
    { fi: "hetkeksi", ru: "на минутку", en: "for a moment", k: "w" },
    { fi: "toki", ru: "конечно", en: "sure", k: "w" },
    { fi: "lehtiö", ru: "блокнот", en: "notepad", k: "w" },
    { fi: "kaappi", ru: "шкаф", en: "cabinet", k: "w" },
    { fi: "Teroita kynäsi.", ru: "Заточи карандаш.", en: "Sharpen your pencil.", k: "s" },
    { fi: "Oletko tarkistanut paperiliittimiemme varaston?", ru: "Ты проверил наш запас скрепок?", en: "Have you checked our stock for paperclips?", k: "s" },
    { fi: "Tarvitsen uuden lehtiön.", ru: "Мне нужен новый блокнот.", en: "I need a new notebook.", k: "s" },
    { fi: "Oletko itse hyvä laulaja?", ru: "А сам ты хорошо поёшь?", en: "Are you a good singer yourself?", k: "s" },
    { fi: "Lainasin vanhempieni autoa sinä yönä.", ru: "В ту ночь я взял машину родителей.", en: "I borrowed my parents' car that night.", k: "s" },
    { fi: "Se oli huonoin päätös, minkä koskaan olen tehnyt.", ru: "Это было худшее решение в моей жизни.", en: "It was the worst decision I have ever made.", k: "s" },
    { fi: "Monta vuotta sitten tällä kaupalla oli tapana lainata videoita.", ru: "Много лет назад в этом магазине выдавали видеокассеты.", en: "Many years ago, this shop used to lend videos.", k: "s" },
    { fi: "Lainaisitko minulle kymmenen euroa?", ru: "Не одолжишь мне десять евро?", en: "Could you lend me ten euros?", k: "s" },
    { fi: "Jaakko lainaa Erkille viisi euroa.", ru: "Яакко даёт Эркки взаймы пять евро.", en: "Jaakko lends Erkki five euros.", k: "s" },
    { fi: "Jaakko lainaa Erkiltä viisi euroa.", ru: "Яакко занимает у Эркки пять евро.", en: "Jaakko borrows five euros from Erkki.", k: "s" },
    { fi: "Tulisitko hetkeksi tänne?", ru: "Подойди сюда на минутку.", en: "Come here for a second, please.", k: "s" },
    { fi: "Toki, autan sinua.", ru: "Конечно, помогу.", en: "Sure, I'll help you.", k: "s" },
    { fi: "Onhan se toki kaunis, mutta liian kallis.", ru: "Красивая-то она красивая, но слишком дорогая.", en: "It sure is pretty, but too expensive.", k: "s" },
    { fi: "Minä pärjään itse.", ru: "Я справлюсь сам.", en: "I'll get along by myself.", k: "s" },
    { fi: "Hae itsellesi uusi kynä.", ru: "Возьми себе новую ручку.", en: "Fetch yourself a new pencil.", k: "s" },
    { fi: "Ostamme itsellemme koiran.", ru: "Мы купим себе собаку.", en: "We'll buy ourselves a dog.", k: "s" },
    { fi: "Minulla on kissa.", ru: "У меня есть кошка.", en: "I have a cat.", k: "s" },
    { fi: "Minulla ei ole yhtään rahaa.", ru: "У меня совсем нет денег.", en: "I don't have any money.", k: "s" },
    { fi: "Mitä ruokaa meillä on tänään?", ru: "Что у нас сегодня на еду?", en: "What do we have for dinner today?", k: "s" },
    { fi: "Hänellä on punaiset hiukset.", ru: "У него рыжие волосы.", en: "He has red hair.", k: "s" },
    { fi: "Teillä on viihtyisä toimisto.", ru: "У вас уютный офис.", en: "You have a pleasant office.", k: "s" },
    { fi: "Onko sinulla sokeria?", ru: "У тебя есть сахар?", en: "Do you have any sugar?", k: "s" },
    { fi: "Hannan kynä on keltainen.", ru: "Ручка Ханны жёлтая.", en: "Hanna's pencil is yellow.", k: "s" },
    { fi: "Petri lainaa Hannan kynää.", ru: "Петри берёт ручку Ханны.", en: "Petri borrows Hanna's pencil.", k: "s" },
    { fi: "Hannan kynästä katkeaa terä.", ru: "У ручки Ханны ломается кончик.", en: "The tip of Hanna's pencil breaks.", k: "s" },
    { fi: "Tuon pojan koira on iloinen.", ru: "Собака того мальчика радостная.", en: "That boy's dog is happy.", k: "s" },
    { fi: "Sen häntä heiluu.", ru: "Хвост у неё виляет.", en: "Its tail is wagging.", k: "s" },
    { fi: "Onko tämä kirjaston kirja?", ru: "Это библиотечная книга?", en: "Is this a library book?", k: "s" },
    { fi: "Kasvin lehdet alkavat riippua.", ru: "Листья растения начинают поникать.", en: "The leaves of the plant are beginning to droop.", k: "s" },
    { fi: "Niiden väri alkaa vaihtua.", ru: "Их цвет начинает меняться.", en: "Their color is beginning to change.", k: "s" },
    { fi: "Isäni on eläkkeellä.", ru: "Мой отец на пенсии.", en: "My father is retired.", k: "s" },
    { fi: "Hänen isänsä on vielä töissä.", ru: "Его отец ещё работает.", en: "His father is still working.", k: "s" },
    { fi: "Heidän opettajansa on ankara, mutta meidän opettajamme on mukava.", ru: "Их учитель строгий, а наш приятный.", en: "Their teacher is strict, but our teacher is nice.", k: "s" },
    { fi: "Älkää unohtako tavaroitanne.", ru: "Не забудьте свои вещи.", en: "Don't forget your belongings.", k: "s" },
    { fi: "Paula hakee juotavaa, ja Juho syö voileipänsä.", ru: "Паула идёт за питьём, а Юхо ест свой бутерброд.", en: "Paula goes to get something to drink, and Juho eats his own sandwich.", k: "s" },
    { fi: "Paula hakee juotavaa, ja Juho syö hänen voileipänsä.", ru: "Паула идёт за питьём, а Юхо ест её бутерброд.", en: "Paula goes to get something to drink, and Juho eats her sandwich.", k: "s" },
    { fi: "Juho antaa avaimet Paulalle. Paula laittaa ne taskuunsa.", ru: "Юхо отдаёт ключи Пауле. Паула кладёт их в свой карман.", en: "Juho gives the keys to Paula. Paula puts them in her own pocket.", k: "s" },
    { fi: "Juho antaa avaimet Paulalle. Paula laittaa ne hänen taskuunsa.", ru: "Юхо отдаёт ключи Пауле. Паула кладёт их в его карман.", en: "Juho gives the keys to Paula. Paula puts them in his pocket.", k: "s" }
  ]
},
{
  id: "LB_S1_06",
  title: "Который час и числа после десяти",
  source: "FinnishPod101 · Lower Beginner S1 #6",
  glossary: [
    { w: "luvut yli kymmenen", ru: "числа больше десяти", en: "numbers over ten",
      forms: ["yksitoista", "kaksitoista", "kolmetoista", "neljätoista", "viisitoista", "kuusitoista", "seitsemäntoista", "kahdeksantoista", "yhdeksäntoista", "kaksikymmentä", "kaksikymmentäyksi", "kaksikymmentäviisi", "kolmekymmentä", "sata", "satayksi", "kaksisataa", "tuhat", "viisituhatta", "miljoona"],
      note: "От одиннадцати до девятнадцати: однозначное число + -toista (yksitoista, kaksitoista). Десятки от двадцати: однозначное число + партитив от kymmenen — kaksikymmentä, kolmekymmentä, дальше просто дописывается остаток: kaksikymmentäviisi. Сотни и тысячи так же, через партитив от sata и tuhat: kaksisataa, viisituhatta, satayksitoista." },
    { w: "lukujen taivutus", ru: "склоняются все части числа", en: "declension of numbers",
      forms: ["yhdessä", "neljässä", "seitsemässätoista", "kahdessakymmenessäkahdeksassa", "kahdeltatoista", "yhdeltä", "kahdelta", "yhdeksältä", "viiden", "kolmen"],
      note: "Плата за простое образование чисел: склоняются ВСЕ части. Seitsemäntoista → seitsemässätoista, kaksikymmentäkahdeksan → kahdessakymmenessäkahdeksassa. Не склоняется только -toista. В разговорной речи обычно склоняют лишь последнюю часть, но на письме положено все." },
    { w: "kellonajat", ru: "как называть время", en: "telling time",
      forms: ["yli", "vaille", "vailla", "puoli", "tasan", "vartti", "varttia", "viittä", "kymmentä", "kahtakymmentä"],
      note: "Схема: [минуты] yli/vaille [часы], а для ровного часа и половины — tasan/puoli [часы]. Внимание на «полчаса»: финны считают половину ДО следующего часа, поэтому puoli neljä — это половина четвёртого, то есть 3:30. Минуты могут быть в номинативе или партитиве: маленькие числа чаще в партитиве (viittä vaille neljä), большие — в номинативе (kaksikymmentäviisi yli neljä).\nЧтобы сказать, во сколько что-то происходит, час ставится в аблатив (-lta/-ltä): Kokous alkaa yhdeksältä, Juna lähtee puoli kahdelta. Если час и так ясен, аблатив можно перенести на puoli (Aloitetaan puolelta), но не на минуты (Jatketaan kahtakymmentä yli).\nВ Финляндии на письме всегда 24-часовой формат, разделитель официально точка (18.04), но двоеточие тоже в ходу." },
    { w: "vartti", ru: "четверть часа", en: "quarter of an hour",
      forms: ["vartti", "varttia", "vartin"],
      note: "Разговорное слово. В указании времени всегда в партитиве: varttia vaille kaksitoista («без четверти двенадцать»), varttia yli viisi («четверть шестого»)." },
    { w: "kello", ru: "часы; звонок, колокол", en: "clock, watch, bell",
      forms: ["kello", "kelloni", "rannekello", "seinäkello", "käkikello", "kirkonkello"],
      note: "Годится почти для любых часов и звонков. Составных слов много: rannekello («наручные часы»), seinäkello («настенные»), käkikello («с кукушкой»), kirkonkello («церковный колокол»), kissankello («колокольчик» — цветок)." },
    { w: "mielelläni", ru: "с удовольствием, охотно", en: "with pleasure, I'd love to",
      forms: ["mielelläni", "mielelläsi", "mielellään", "mielellämme", "mielellänne", "mielellään"],
      note: "Корень mieli («ум, настроение») + адессив -llä + притяжательное окончание, буквально «на моём уме». Поэтому слово меняется по лицам: mielelläni («я с удовольствием»), mielelläsi, mielellään, mielellämme, mielellänne." },
    { w: "kaksitoista", ru: "двенадцать", en: "twelve",
      forms: ["kaksitoista", "kahdeltatoista"],
      note: "Буквально «два второго», то есть «два из второго десятка», а само «десять» опущено. Toinen — порядковое от «два», toista — его партитив. В старых текстах так строили и большие числа: viisikolmatta («двадцать пять»), kuusineljättä («тридцать шесть»); сейчас это архаика, молодёжь их уже не понимает." },
    { w: "lounas", ru: "обед", en: "lunch", forms: ["lounas", "lounasta", "lounaan", "lounaalle", "lounaalla", "lounaaksi"] },
    { w: "puoli", ru: "половина", en: "half", forms: ["puoli", "puolelta", "puolenpäivän"] },
    { w: "yleensä", ru: "обычно", en: "usually", forms: ["yleensä"] },
    { w: "yli", ru: "сверх, после (о времени)", en: "over, past", forms: ["yli"] },
    { w: "vaille", ru: "без (о времени); кроме", en: "to (time), without", forms: ["vaille", "vailla"] }
  ],
  items: [
    { fi: "Mitä kello on?", ru: "Который час?", en: "What time is it?", k: "d", who: "Hanna" },
    { fi: "Kaksikymmentäviisi yli kaksitoista.", ru: "Двенадцать двадцать пять.", en: "Twenty-five past twelve.", k: "d", who: "Petri" },
    { fi: "Menemme Marin kanssa lounaalle puoli yhdeltä.", ru: "Мы с Мари идём на обед в полпервого.", en: "Mari and I are going for lunch at half past twelve.", k: "d", who: "Hanna" },
    { fi: "Tuletko mukaan?", ru: "Пойдёшь с нами?", en: "Would you like to join us?", k: "d", who: "Hanna" },
    { fi: "Mielelläni.", ru: "С удовольствием.", en: "I'd love to.", k: "d", who: "Petri" },
    { fi: "Yleensä syömme jo varttia vaille kaksitoista.", ru: "Обычно мы едим уже без четверти двенадцать.", en: "Usually, we have lunch already at a quarter to twelve.", k: "d", who: "Hanna" },
    { fi: "kello", ru: "часы; звонок", en: "clock, watch", k: "w" },
    { fi: "kaksitoista", ru: "двенадцать", en: "twelve", k: "w" },
    { fi: "kaksikymmentäviisi", ru: "двадцать пять", en: "twenty-five", k: "w" },
    { fi: "yli", ru: "после (о времени)", en: "past", k: "w" },
    { fi: "vaille", ru: "без (о времени)", en: "to (time)", k: "w" },
    { fi: "puoli", ru: "половина", en: "half", k: "w" },
    { fi: "vartti", ru: "четверть часа", en: "quarter of an hour", k: "w" },
    { fi: "lounas", ru: "обед", en: "lunch", k: "w" },
    { fi: "yleensä", ru: "обычно", en: "usually", k: "w" },
    { fi: "mielelläni", ru: "с удовольствием", en: "I'd love to", k: "w" },
    { fi: "Kelloni on minuutin edellä.", ru: "Мои часы спешат на минуту.", en: "My watch is one minute fast.", k: "s" },
    { fi: "Nooran luokalla on kaksikymmentäviisi oppilasta.", ru: "В классе Нооры двадцать пять учеников.", en: "There are twenty-five pupils in Noora's class.", k: "s" },
    { fi: "Menen nukkumaan kahdeltatoista.", ru: "Я ложусь спать в двенадцать.", en: "I go to bed at twelve.", k: "s" },
    { fi: "Luulen, että on lounaan aika.", ru: "Думаю, пора обедать.", en: "I think it is time for lunch.", k: "s" },
    { fi: "Mitä söit tänään lounaaksi?", ru: "Что ты сегодня ел на обед?", en: "What did you eat for lunch today?", k: "s" },
    { fi: "Syön lounasta mieluummin itsekseni puistossa.", ru: "Я предпочитаю обедать один в парке.", en: "I prefer to eat lunch on my own in the park.", k: "s" },
    { fi: "Kati on juuri lounaalla.", ru: "Кати как раз на обеде.", en: "Kati is having lunch just now.", k: "s" },
    { fi: "Resepti vaati yksi ja puoli teelusikallista sokeria.", ru: "По рецепту нужно полторы чайных ложки сахара.", en: "The recipe called for one and a half teaspoons of sugar.", k: "s" },
    { fi: "Sopiiko sinulle palaveri puoli kolmelta?", ru: "Тебе подходит встреча в полтретьего?", en: "Is it ok for you to have a meeting at half past two?", k: "s" },
    { fi: "Onko täällä yleensä näin paljon ihmisiä?", ru: "Здесь обычно столько народу?", en: "Are there usually so many people here?", k: "s" },
    { fi: "Olet vartin myöhässä.", ru: "Ты опоздал на четверть часа.", en: "You're a quarter of an hour late.", k: "s" },
    { fi: "Minulla on vähän vaille kymmenen euroa.", ru: "У меня чуть меньше десяти евро.", en: "I have a little less than ten euros.", k: "s" },
    { fi: "Kello on kaksikymmentä yli neljä.", ru: "Двадцать минут пятого.", en: "It's twenty past four.", k: "s" },
    { fi: "Kello on kaksikymmentä vaille neljä.", ru: "Без двадцати четыре.", en: "It's twenty to four.", k: "s" },
    { fi: "Kello on puoli neljä.", ru: "Половина четвёртого.", en: "It's half past three.", k: "s" },
    { fi: "Kello on tasan neljä.", ru: "Ровно четыре.", en: "It's four o'clock sharp.", k: "s" },
    { fi: "Kello on viittä vaille neljä.", ru: "Без пяти четыре.", en: "It's five to four.", k: "s" },
    { fi: "Kello on kymmentä yli neljä.", ru: "Десять минут пятого.", en: "It's ten past four.", k: "s" },
    { fi: "Kello on varttia vaille kaksitoista.", ru: "Без четверти двенадцать.", en: "It's quarter to twelve.", k: "s" },
    { fi: "Kello on varttia yli viisi.", ru: "Четверть шестого.", en: "It's quarter past five.", k: "s" },
    { fi: "Kokous alkaa yhdeksältä.", ru: "Собрание начинается в девять.", en: "The meeting starts at nine o'clock.", k: "s" },
    { fi: "Juna lähtee puoli kahdelta.", ru: "Поезд уходит в половине второго.", en: "The train departs at half past one.", k: "s" },
    { fi: "Tiina tulee kymmentä vaille kuudelta.", ru: "Тийна придёт без десяти шесть.", en: "Tiina will come at ten to six.", k: "s" },
    { fi: "Aloitetaan puolelta.", ru: "Начнём в половине.", en: "Let's start at half past.", k: "s" },
    { fi: "Jatketaan kahtakymmentä yli.", ru: "Продолжим в двадцать минут.", en: "Let's continue at twenty past.", k: "s" },
    { fi: "Junan saapumisaika on 18.04.", ru: "Поезд прибывает в 18:04.", en: "The train will arrive at 6:04 pm.", k: "s" },
    { fi: "Äiti, juna tulee neljää yli kuudelta.", ru: "Мама, поезд придёт в четыре минуты седьмого.", en: "Mom, the train comes at four past six.", k: "s" }
  ]
},
{
  id: "LB_S1_09",
  title: "Как прощаться",
  source: "FinnishPod101 · Lower Beginner S1 #9",
  glossary: [
    { w: "hyvästelyt", ru: "формулы прощания: три группы", en: "taking leave",
      forms: ["hyvästi", "hei hei", "heippa", "moikka", "näkemiin", "kuulemiin", "nähdään", "huomiseen", "soitellaan", "näkyillään", "pärjäile"],
      note: "Прощание складывается из трёх групп фраз, и можно взять одну, а можно все три подряд.\n1) Просто «пока», от формального к разговорному: hyvästi («прощай» — редкое, означает, что больше не увидитесь, иногда даже «видеть тебя не хочу»), hei hei (самое обычное, годится и в делах, и с друзьями), heippa, moikka (разговорные). Просто hei или moi при прощании тоже говорят, но короткие варианты звучат резковато.\n2) Про следующую встречу: näkemiin («до свидания», буквально «до увидения» — формально), kuulemiin («до связи», по телефону), nähdään huomenna / illalla / ensi viikolla, nähdään (когда не знаешь когда), huomiseen («до завтра»), soitellaan («созвонимся»), näkyillään (совсем разговорное, шутливое).\n3) Пожелание: hyvää päivän jatkoa, hauskaa iltaa, hyvää yötä, hyvää viikonloppua, hyvää lomaa, hyvää työpäivää, hyvää jatkoa («всего наилучшего» — если не увидитесь долго), voi hyvin, koita pärjätä («держись» — если у человека трудности), pärjäile.\nНа пожелание отвечают Kiitos samoin или просто Samoin. На Hyvää yötä и Hyvää viikonloppua можно ответить той же фразой.\nВажно: Hyvää huomenta / päivää / iltaa — это приветствия при встрече, для прощания они не годятся." },
    { w: "maissa", ru: "около, примерно (о времени)", en: "about, around (time)",
      forms: ["maissa"],
      note: "Послелог для приблизительного времени, а время перед ним стоит в генитиве: kolmen maissa («около трёх»), puoli viiden maissa («около половины пятого»), puolenpäivän maissa («около полудня»)." },
    { w: "loppuviikko", ru: "конец недели", en: "the rest of the week",
      forms: ["loppuviikko", "loppuviikolla", "alkuviikko"],
      note: "Loppu («конец») + viikko («неделя»). Значит либо вторую половину недели, либо всё, что осталось от этой недели. Противоположность — alkuviikko («начало недели»): понедельник, вторник и, может быть, среда, а с четверга уже loppuviikko. Не путайте с viikonloppu («выходные») — те же части, но в другом порядке." },
    { w: "aika", ru: "время; час", en: "time, hour",
      forms: ["aika", "aikaan", "aikaa", "keskiaika"],
      note: "И момент времени — Mihin aikaan tulet? («Во сколько придёшь?»), и период — itsenäisyyden aika («период независимости»), keskiaika («Средние века»). Не путайте с наречием aika («довольно») из урока 12." },
    { w: "samoin", ru: "взаимно; так же", en: "likewise",
      forms: ["samoin"],
      note: "Kiitos samoin — «спасибо, и вам того же»: стандартный ответ на пожелание. В другом значении — «таким же образом»: samoin ajattelevat ihmiset («люди, думающие так же»)." },
    { w: "huomiseen", ru: "до завтра", en: "until tomorrow", forms: ["huomiseen", "huominen"] },
    { w: "lähteä", ru: "уходить, отправляться", en: "to leave", forms: ["lähteä", "lähden", "lähdemme", "lähtee", "lähti", "lähtenyt"] },
    { w: "huomenna", ru: "завтра", en: "tomorrow", forms: ["huomenna"] },
    { w: "nyt", ru: "сейчас, теперь", en: "now", forms: ["nyt"] }
  ],
  items: [
    { fi: "Taidan lähteä nyt kotiin.", ru: "Пожалуй, я пойду домой.", en: "I think I'll go home now.", k: "d", who: "Petri" },
    { fi: "Selvä. Mihin aikaan tulet huomenna?", ru: "Ясно. Во сколько придёшь завтра?", en: "Okay. What time will you be coming tomorrow?", k: "d", who: "Hanna" },
    { fi: "Yhdeksän maissa.", ru: "Около девяти.", en: "Around nine o'clock.", k: "d", who: "Petri" },
    { fi: "Hyvä. Loppuviikolla saat jo aloittaa oikeita töitä.", ru: "Хорошо. К концу недели уже начнёшь настоящую работу.", en: "Good. Towards the end of the week, you'll get to start some real work.", k: "d", who: "Hanna" },
    { fi: "Huomiseen! Hauskaa iltaa!", ru: "До завтра! Хорошего вечера!", en: "See you tomorrow! Have a nice evening!", k: "d", who: "Hanna" },
    { fi: "Kiitos samoin. Huomiseen!", ru: "Спасибо, взаимно. До завтра!", en: "Thanks, you too! See you tomorrow!", k: "d", who: "Petri" },
    { fi: "huomenna", ru: "завтра", en: "tomorrow", k: "w" },
    { fi: "maissa", ru: "около (о времени)", en: "around (time)", k: "w" },
    { fi: "loppuviikko", ru: "конец недели", en: "the rest of the week", k: "w" },
    { fi: "huomiseen", ru: "до завтра", en: "until tomorrow", k: "w" },
    { fi: "samoin", ru: "взаимно; так же", en: "likewise", k: "w" },
    { fi: "lähteä", ru: "уходить", en: "to leave", k: "w" },
    { fi: "nyt", ru: "сейчас", en: "now", k: "w" },
    { fi: "aika", ru: "время, час", en: "time, hour", k: "w" },
    { fi: "näkemiin", ru: "до свидания", en: "good bye", k: "w" },
    { fi: "kuulemiin", ru: "до связи (по телефону)", en: "until we talk again", k: "w" },
    { fi: "nähdään", ru: "увидимся", en: "see you", k: "w" },
    { fi: "heippa", ru: "пока", en: "bye", k: "w" },
    { fi: "hyvästi", ru: "прощай", en: "farewell", k: "w" },
    { fi: "Mennäänkö huomenna elokuviin?", ru: "Пойдём завтра в кино?", en: "Shall we go to the movies tomorrow?", k: "s" },
    { fi: "Pääsen töistä viiden maissa.", ru: "Я освобожусь с работы около пяти.", en: "I'll get off work around five o'clock.", k: "s" },
    { fi: "kolmen maissa", ru: "около трёх", en: "around three o'clock", k: "s" },
    { fi: "puoli viiden maissa", ru: "около половины пятого", en: "around half past four", k: "s" },
    { fi: "puolenpäivän maissa", ru: "около полудня", en: "around noon", k: "s" },
    { fi: "Loppuviikko näyttää todella kiireiseltä.", ru: "Конец недели выглядит очень напряжённым.", en: "The end of the week looks very busy.", k: "s" },
    { fi: "Huomiseen! Heippa!", ru: "До завтра! Пока!", en: "See you tomorrow! Bye!", k: "s" },
    { fi: "Samoin ajattelevien ihmisten kanssa on helppo tulla toimeen.", ru: "С теми, кто думает так же, легко находить общий язык.", en: "It's easy to get along with people who think the same way as you do.", k: "s" },
    { fi: "Hän on jo lähtenyt.", ru: "Он уже ушёл.", en: "He has already left.", k: "s" },
    { fi: "Lähdemme huomenna Kanarialle.", ru: "Завтра мы улетаем на Канары.", en: "We'll be leaving for the Canary Islands tomorrow.", k: "s" },
    { fi: "Olen erittäin kiireinen nyt.", ru: "Я сейчас очень занят.", en: "I am very busy now.", k: "s" },
    { fi: "Nyt, kuunnelkaa minua, olkaa hyvä.", ru: "А теперь послушайте меня, пожалуйста.", en: "Now, please listen to me.", k: "s" },
    { fi: "Juon nyt teetä.", ru: "Я сейчас пью чай.", en: "I am drinking tea now.", k: "s" },
    { fi: "Mihin aikaan näytelmäsi on?", ru: "Во сколько твой спектакль?", en: "What time is your play?", k: "s" },
    { fi: "Mihin aikaan he menevät sinne?", ru: "Во сколько они туда идут?", en: "What time do they go there?", k: "s" },
    { fi: "Heippa! Nähdään huomenna!", ru: "Пока! До завтра!", en: "Bye! See you tomorrow!", k: "s" },
    { fi: "Näkemiin ja hyvää päivän jatkoa.", ru: "До свидания и хорошего дня.", en: "Good bye and have a nice day.", k: "s" },
    { fi: "Koita pärjätä. Moikka!", ru: "Держись. Пока!", en: "Hang in there. Bye!", k: "s" },
    { fi: "Rentouttavaa lomaa, nähdään taas. Hei hei!", ru: "Хорошего отпуска, ещё увидимся. Пока!", en: "Have a relaxing vacation. See you again. Bye bye!", k: "s" },
    { fi: "Nähdään ensi viikolla.", ru: "Увидимся на следующей неделе.", en: "See you next week.", k: "s" },
    { fi: "Hyvää yötä.", ru: "Спокойной ночи.", en: "Good night.", k: "s" },
    { fi: "Hyvää viikonloppua!", ru: "Хороших выходных!", en: "Have a nice weekend!", k: "s" },
    { fi: "Hyvää jatkoa.", ru: "Всего наилучшего.", en: "All the best in the future.", k: "s" },
    { fi: "Voi hyvin.", ru: "Береги себя.", en: "Keep well.", k: "s" },
    { fi: "Soitellaan taas.", ru: "Ещё созвонимся.", en: "Let's keep in touch by phone.", k: "s" }
  ]
},
];

const LESSONS_NEXT = [
{
  id: "LB_S1_21",
  title: "Вежливая просьба: кондиционал",
  source: "FinnishPod101 · Lower Beginner S1 #21",
  glossary: [
    { w: "konditionaali", ru: "кондиционал: показатель -isi-", en: "conditional verb form",
      forms: ["tekisitkö", "voisiko", "pitäisi", "ehtisit", "riittäisi", "laittaisitko", "tulisin", "ehtisin", "olisit", "olisi", "olisikin", "menisi", "lähtisin", "tarvitsisi", "antaisitko", "voisitko", "saisinko", "lainaisitko", "ottaisin", "olisipa", "voittaisipa", "sopisi", "riittäisin", "katsoisi", "löytyisi", "kysyisi", "auttaisi", "saisi", "pelaisi", "joisi", "söisi", "tekisi", "etsisi", "lähtisi"],
      note: "Форма для действия, которое чем-то обусловлено и потому под вопросом: «сделал бы». Показатель -isi- встаёт между основой и личным окончанием, а основа берётся та же, что в 3-м лице множественного: riittävät → riittäisin, katsovat → katsoisin.\nДве поправки к основе. Если она кончается на -e или -i, этот гласный выпадает: tekevät → tekisin, ehtivät → ehtisin, lähtevät → lähtisin, etsivät → etsisin. Если она кончается на два гласных, один уходит: saavat → saisin, pelaavat → pelaisin, а в juo-, syö-, vie- выпадает первый: juovat → joisin, syövät → söisin. Olla — исключение: ovat → olisin.\nТри применения. Условие или что-то нереальное: Tulisin, jos ehtisin («Пришёл бы, если бы успел»). Вежливая просьба, вопрос, заказ: Antaisitko minulle tuon kirjan?, Saisinko leipää?, Ottaisin kilon silakoita. И желание — часто с частицей -pa: Olisipa jo kesä! («Скорее бы лето!»)." },
    { w: "tehdä", ru: "делать; изготавливать", en: "to do, to make",
      forms: ["tehdä", "tekisitkö", "teet", "teen", "tekee", "tekisi"],
      note: "Покрывает и «делать», и «изготавливать»: Mitä teet huomenna?, Jaana tekee itse vaatteensa («Яана сама шьёт себе одежду»). Полезная готовая фраза в магазине: Paljonko se tekee? — «Сколько с меня?»" },
    { w: "ennen", ru: "до, перед", en: "before",
      forms: ["ennen", "ennenkin"],
      note: "Предлог, и то, до чего происходит дело, ставится в партитив: ennen yhtä («до часа»), ennen kahta («до двух»), ennen joulua, ennen sinua. Работает и как наречие «раньше»: En ole ennen käynyt täällä, Ennen tässä oli kauppa («Раньше здесь был магазин»)." },
    { w: "tieto", ru: "сведения, данные, знания", en: "information, data, knowledge",
      forms: ["tieto", "tietoa", "tiedot", "tietoja", "tietokone"],
      note: "Слово очень широкое: и «информация» (Minulla ei ole tietoa tästä), и «данные» (Onko sinulla kaikki tarvittavat tiedot?), и «знания» (Hänellä on asiasta hyvät tiedot), и даже разведданные (Hän keräsi tietoja vihollisesta). Отсюда tietokone — «компьютер»: это калька со шведского datamaskin, «машина данных», а не «машина знаний», как иногда переводят." },
    { w: "riittää", ru: "хватать, быть достаточным", en: "to be enough", forms: ["riittää", "riittäisi", "riitä", "riittävät"] },
    { w: "ehtiä", ru: "успевать", en: "to have the time", forms: ["ehtiä", "ehtisit", "ehditkö", "ehtisin"] },
    { w: "muutos", ru: "изменение, правка", en: "change", forms: ["muutos", "muutoksen"] },
    { w: "koodi", ru: "код", en: "code", forms: ["koodi", "koodiin", "koodissa"] },
    { w: "sähköposti", ru: "электронная почта", en: "e-mail", forms: ["sähköposti", "sähköpostilla", "sähköpostia", "sähköpostiviesti", "sähköpostiviestiä"] }
  ],
  items: [
    { fi: "Petri, tekisitkö koodiin yhden muutoksen?", ru: "Петри, ты не внесёшь одну правку в код?", en: "Petri, could you please do a change in the code?", k: "d", who: "Mari" },
    { fi: "Voisiko sen tehdä huomenna?", ru: "А можно это сделать завтра?", en: "Could it be done tomorrow?", k: "d", who: "Petri" },
    { fi: "Minun pitäisi ihan kohta lähteä.", ru: "Мне вот-вот надо уходить.", en: "I should be going in a minute.", k: "d", who: "Petri" },
    { fi: "Jos ehtisit tehdä sen huomenna ennen kahta, niin se riittäisi.", ru: "Если бы успел завтра до двух, этого было бы достаточно.", en: "If you had time to do it tomorrow before two o'clock, that would be enough.", k: "d", who: "Mari" },
    { fi: "Selvä, katson sitä huomenna.", ru: "Ясно, посмотрю завтра.", en: "Okay, I'll have a look at it tomorrow.", k: "d", who: "Petri" },
    { fi: "Laittaisitko minulle tiedot sähköpostilla.", ru: "Пришли мне, пожалуйста, данные по почте.", en: "Please send me the information by email.", k: "d", who: "Petri" },
    { fi: "tehdä", ru: "делать", en: "to do, to make", k: "w" },
    { fi: "riittää", ru: "хватать", en: "to be enough", k: "w" },
    { fi: "tieto", ru: "сведения, данные", en: "information", k: "w" },
    { fi: "ennen", ru: "до, перед", en: "before", k: "w" },
    { fi: "sähköpostiviesti", ru: "письмо по электронной почте", en: "e-mail", k: "w" },
    { fi: "koodi", ru: "код", en: "code", k: "w" },
    { fi: "muutos", ru: "изменение", en: "change", k: "w" },
    { fi: "ehtiä", ru: "успевать", en: "to have the time", k: "w" },
    { fi: "Mitä sinä teet?", ru: "Что ты делаешь?", en: "What are you doing?", k: "s" },
    { fi: "Rahani eivät riitä uuteen takkiin.", ru: "Мне не хватает денег на новую куртку.", en: "I don't have enough money for a new coat.", k: "s" },
    { fi: "Esitelmää varten on hyvä etsiä tietoa esimerkiksi internetistä.", ru: "Для доклада хорошо поискать сведения, например, в интернете.", en: "For the presentation, it is good to find information on the Internet.", k: "s" },
    { fi: "Onko sinulla tietoa suunnitelmista?", ru: "У тебя есть сведения о планах?", en: "Do you have any information about the plans?", k: "s" },
    { fi: "Minun pitäisi mennä pankkiin ennen koulua.", ru: "Мне надо бы зайти в банк до школы.", en: "I should go to the bank before school.", k: "s" },
    { fi: "Tulen kotiin ennen viittä.", ru: "Приду домой до пяти.", en: "I'll come home before five o'clock.", k: "s" },
    { fi: "Tuleeko sinulle paljon sähköpostia?", ru: "Тебе много пишут на почту?", en: "Do you get a lot of email?", k: "s" },
    { fi: "Ohjelmoija kirjoittaa sähköpostiviestiä.", ru: "Программист пишет письмо.", en: "The programmer types an e-mail.", k: "s" },
    { fi: "Tässä koodissa on paljon virheitä.", ru: "В этом коде много ошибок.", en: "There are a lot of bugs in this code.", k: "s" },
    { fi: "Lämpötilan muutos on kaksi astetta.", ru: "Изменение температуры — два градуса.", en: "The change in the temperature is two degrees.", k: "s" },
    { fi: "Ehditkö bussiin?", ru: "Ты успел на автобус?", en: "Did you make it to the bus?", k: "s" },
    { fi: "Paljonko se tekee?", ru: "Сколько с меня?", en: "How much is it?", k: "s" },
    { fi: "Jaana tekee itse vaatteensa.", ru: "Яана сама шьёт себе одежду.", en: "Jaana makes her own clothes.", k: "s" },
    { fi: "En ole ennen käynyt täällä.", ru: "Я раньше здесь не был.", en: "I haven't been here before.", k: "s" },
    { fi: "Ennen tässä oli kauppa.", ru: "Раньше здесь был магазин.", en: "There used to be a store here.", k: "s" },
    { fi: "Hänellä on asiasta hyvät tiedot.", ru: "Она хорошо разбирается в этом вопросе.", en: "She has good knowledge about the subject.", k: "s" },
    { fi: "Tulisin, jos ehtisin.", ru: "Пришёл бы, если бы успел.", en: "I would come, if I had the time.", k: "s" },
    { fi: "Jos olisit lukenut kokeeseen, se olisi mennyt paremmin.", ru: "Если бы ты готовился к экзамену, всё прошло бы лучше.", en: "If you had studied for the exam, it would have gone better.", k: "s" },
    { fi: "En menisi, vaikka minulla olisikin aikaa.", ru: "Я бы не пошёл, даже если бы было время.", en: "I wouldn't go, even if I had time.", k: "s" },
    { fi: "Lähtisin matkoille, jos minun ei tarvitsisi olla töissä.", ru: "Поехал бы путешествовать, если бы не надо было работать.", en: "I would go traveling, if I didn't have to be at work.", k: "s" },
    { fi: "Antaisitko minulle tuon kirjan?", ru: "Не подашь мне ту книгу?", en: "Could you please give me that book?", k: "s" },
    { fi: "Voisitko tehdä tämän vielä tänään?", ru: "Ты не мог бы сделать это ещё сегодня?", en: "Could you do this today?", k: "s" },
    { fi: "Saisinko leipää?", ru: "Можно мне хлеба?", en: "May I have some bread, please?", k: "s" },
    { fi: "Lainaisitko kynää hetkeksi?", ru: "Не одолжишь ручку на минутку?", en: "Could you lend me a pen for a second?", k: "s" },
    { fi: "Ottaisin kilon silakoita.", ru: "Мне килограмм селёдки, пожалуйста.", en: "I'll take one kilogram of Baltic herrings, please.", k: "s" },
    { fi: "Kallella olisi asiaa.", ru: "У Калле к тебе дело.", en: "Kalle would like to talk with you.", k: "s" },
    { fi: "Minun pitäisi nyt mennä.", ru: "Мне пора идти.", en: "I should go now.", k: "s" },
    { fi: "Olisipa jo kesä!", ru: "Скорее бы лето!", en: "I wish it were summer already!", k: "s" },
    { fi: "Voittaisipa Suomi taas jääkiekon maailmanmestaruuden.", ru: "Вот бы Финляндия снова взяла чемпионат мира по хоккею.", en: "I wish Finland won the ice hockey World Championships again.", k: "s" }
  ]
},
{
  id: "LB_S1_22",
  title: "Как выразить мнение",
  source: "FinnishPod101 · Lower Beginner S1 #22",
  glossary: [
    { w: "olla ... mieltä", ru: "быть такого-то мнения", en: "to be of the opinion",
      forms: ["mieltä", "samaa", "eri", "sitä"],
      note: "Первая конструкция урока. Olla спрягается по подлежащему, а mieltä всегда стоит в партитиве единственного числа.\nСогласие или несогласие: подставьте samaa («то же») или eri («другое») — Minä olen samaa mieltä («Я согласен»), Minä olen eri mieltä («Я не согласен»), Kalle oli samaa mieltä.\nСамо мнение: sitä mieltä, että + предложение — Minä olen sitä mieltä, että tuo mekko sopii sinulle. Так же строится и вопрос: Mitä mieltä te olette? Тема, о которой мнение, идёт в элатив: Mitä mieltä olette tästä?" },
    { w: "minun mielestäni", ru: "по-моему, я считаю", en: "in my opinion",
      forms: ["mielestäni", "mielestäsi", "mielestään", "mielestämme", "mielestänne", "maijun", "mummin", "virtasten"],
      note: "Вторая конструкция. Человек с мнением ставится в генитив (и подлежащим он не является), а mieli — в элатив единственного числа. Без существительного рядом слово берёт притяжательное окончание: mielestäni, mielestäsi, mielestään, mielestämme, mielestänne. С существительным окончание не нужно: Maijun mielestä kahvi on pahaa, Mummin mielestä tatuoinnit ovat rumia. После этой конструкции всегда идёт целое предложение — просто «я согласен» так не скажешь." },
    { w: "mieli", ru: "ум, настроение", en: "mind, mood",
      forms: ["mieli", "mielessä", "mieltä", "mielellä", "mielipide", "mielelläni", "mielisairas"],
      note: "Mitä sinulla on mielessä? — «Что у тебя на уме?». Ещё значит «настроение»: Millä mielellä olet tänään?, Hänelle tuli siitä paha mieli («Ему стало от этого неприятно»). Родня по слову: mielipide («мнение»), mielelläni («с удовольствием», урок 6), mielisairas («душевнобольной»)." },
    { w: "muuttaa", ru: "менять; переезжать", en: "to change, to move",
      forms: ["muuttaa", "muuta", "muutti", "muutimme"],
      note: "Значит «сделать другим», изменить свойство: muuttaa kuvan kokoa («изменить размер картинки»), Noita muutti prinssin sammakoksi («Колдунья превратила принца в жабу»). Но заменить одно на другое — это vaihtaa (урок 11), не muuttaa. Есть и второе значение — «переезжать»: Muutimme viime vuonna Helsinkiin." },
    { w: "kannattaa", ru: "стоит (сделать); поддерживать; быть выгодным", en: "to be worth it, to support",
      forms: ["kannattaa", "kannata", "kannatat", "kannattavat", "kannattava"],
      note: "Буквально «держать, поддерживать»: pylväät kannattavat kattoa («колонны держат крышу»). Переносно — поддерживать дело или команду: Mitä joukkuetta kannatat? Ещё «быть выгодным»: Rikos ei kannata («Преступление не выгодно»). А в диалоге употреблено самое частое значение — «стоит, есть смысл»: Kannattaa muuttaa toimintoa." },
    { w: "toiminto", ru: "функция (в программе)", en: "functionality, function", forms: ["toiminto", "toimintoa", "toimintoja"] },
    { w: "mielipide", ru: "мнение", en: "opinion", forms: ["mielipide", "mielipidettä", "mielipiteitä"] },
    { w: "nykyinen", ru: "текущий, нынешний", en: "current", forms: ["nykyinen", "nykyään"] },
    { w: "käyttää", ru: "использовать, пользоваться", en: "to use", forms: ["käyttää", "käytti", "käytän", "käyttäisi"] },
    { w: "sama", ru: "тот же, одинаковый", en: "same", forms: ["sama", "samaa"] },
    { w: "muu", ru: "другой, прочий", en: "other", forms: ["muu", "muuta", "muiden", "muidenkin"] },
    { w: "vanha", ru: "старый", en: "old", forms: ["vanha", "vanhoja", "vanhempi"] }
  ],
  items: [
    { fi: "Mitä mieltä te olette?", ru: "Что вы думаете?", en: "What do you think?", k: "d", who: "Mari" },
    { fi: "Pitäisikö muuttaa toimintoa vai pitää vanha?", ru: "Стоит поменять функцию или оставить старую?", en: "Should we change the functionality or keep the old one?", k: "d", who: "Mari" },
    { fi: "Minun mielestäni kannattaa muuttaa.", ru: "По-моему, стоит поменять.", en: "I think it would be good to change it.", k: "d", who: "Petri" },
    { fi: "Minä olen samaa mieltä.", ru: "Я согласна.", en: "I agree.", k: "d", who: "Hanna" },
    { fi: "Minun mielestäni nykyinen toiminto on vaikea käyttää.", ru: "По-моему, текущей функцией трудно пользоваться.", en: "I think the current functionality is difficult to use.", k: "d", who: "Hanna" },
    { fi: "Selvä. Kysyn vielä muidenkin mielipidettä.", ru: "Ясно. Спрошу ещё мнение остальных.", en: "Okay. I'll ask the others for their opinions, as well.", k: "d", who: "Mari" },
    { fi: "mieli", ru: "ум, настроение", en: "mind", k: "w" },
    { fi: "nykyinen", ru: "текущий, нынешний", en: "current", k: "w" },
    { fi: "käyttää", ru: "использовать", en: "to use", k: "w" },
    { fi: "sama", ru: "тот же, одинаковый", en: "same", k: "w" },
    { fi: "kannattaa", ru: "стоит; поддерживать", en: "to be worth it", k: "w" },
    { fi: "muu", ru: "другой, прочий", en: "other", k: "w" },
    { fi: "mielipide", ru: "мнение", en: "opinion", k: "w" },
    { fi: "muuttaa", ru: "менять; переезжать", en: "to change", k: "w" },
    { fi: "toiminto", ru: "функция", en: "functionality", k: "w" },
    { fi: "vanha", ru: "старый", en: "old", k: "w" },
    { fi: "Mitähän Eevan mielessä liikkuu?", ru: "Интересно, о чём думает Ээва.", en: "I wonder what Eeva is thinking about.", k: "s" },
    { fi: "Isän nykyinen vaimo on mukava.", ru: "Нынешняя жена отца приятная.", en: "Dad's current wife is nice.", k: "s" },
    { fi: "Osaatko käyttää tätä ohjelmaa?", ru: "Ты умеешь пользоваться этой программой?", en: "Do you know how to use this program?", k: "s" },
    { fi: "Ohjelmoija käytti tietokonetta.", ru: "Программист пользовался компьютером.", en: "The programmer used the computer.", k: "s" },
    { fi: "Henkilö käyttää tietokonetta kirjoittaakseen sähköpostia.", ru: "Человек пользуется компьютером, чтобы написать письмо.", en: "The person is using a computer to write an email.", k: "s" },
    { fi: "Se on sama menettelytapa kuin joka vuosi.", ru: "Это тот же порядок, что и каждый год.", en: "It is the same procedure as every year.", k: "s" },
    { fi: "Onko tuo sama kirja, jota luit eilen?", ru: "Это та же книга, которую ты читал вчера?", en: "Is that the same book you read yesterday?", k: "s" },
    { fi: "Onko tämä väri sama kuin tuo?", ru: "Этот цвет такой же, как тот?", en: "Is this color the same as that one?", k: "s" },
    { fi: "Kännykkäpelien suunnittelusta on tullut kannattava bisnes.", ru: "Разработка мобильных игр стала выгодным делом.", en: "Designing mobile games has become a profitable business.", k: "s" },
    { fi: "Ei sinne enää kannata mennä.", ru: "Туда уже нет смысла идти.", en: "It's no use going there any longer.", k: "s" },
    { fi: "Mitä joukkuetta kannatat?", ru: "За какую команду ты болеешь?", en: "Which team do you support?", k: "s" },
    { fi: "Onko teillä mitään muuta väriä?", ru: "У вас есть какой-нибудь другой цвет?", en: "Do you have any other color?", k: "s" },
    { fi: "Tiinalla on voimakkaita mielipiteitä.", ru: "У Тийны сильные убеждения.", en: "Tiina has some strong opinions.", k: "s" },
    { fi: "Muuta tämä kuva vähän kirkkaammaksi.", ru: "Сделай эту картинку чуть светлее.", en: "Change this picture to be a bit brighter.", k: "s" },
    { fi: "Muutimme viime vuonna Helsinkiin.", ru: "В прошлом году мы переехали в Хельсинки.", en: "We moved to Helsinki last year.", k: "s" },
    { fi: "Mitä toimintoja tässä ohjelmassa on?", ru: "Какие функции есть в этой программе?", en: "What functionality does this program have?", k: "s" },
    { fi: "Heitin pois vanhoja leluja roskiin.", ru: "Я выкинул старые игрушки в мусор.", en: "I threw away old toys in the garbage.", k: "s" },
    { fi: "Tämä takki on vanha.", ru: "Эта куртка старая.", en: "This coat is old.", k: "s" },
    { fi: "Mitä sinulla on mielessä?", ru: "Что у тебя на уме?", en: "What do you have in mind?", k: "s" },
    { fi: "Millä mielellä olet tänään?", ru: "Какое у тебя сегодня настроение?", en: "What's your mood today?", k: "s" },
    { fi: "Minä olen sitä mieltä, että tuo mekko sopii sinulle.", ru: "Я считаю, что то платье тебе идёт.", en: "I think that dress suits you.", k: "s" },
    { fi: "Äiti oli sitä mieltä, että pöytä oli liian pieni.", ru: "Мама считала, что стол был слишком маленький.", en: "Mom thought the table was too small.", k: "s" },
    { fi: "Vanhat ihmiset ovat sitä mieltä, että nuorilla ei ole tapoja.", ru: "Старики считают, что у молодёжи нет манер.", en: "Old people think youngsters have no manners.", k: "s" },
    { fi: "Oletteko sitä mieltä, että veroja pitäisi nostaa?", ru: "Вы считаете, что налоги надо поднять?", en: "Do you think taxes should be raised?", k: "s" },
    { fi: "Olemmeko samaa mieltä asiasta?", ru: "Мы согласны по этому вопросу?", en: "Do we agree on the subject?", k: "s" },
    { fi: "Minä olen eri mieltä.", ru: "Я не согласен.", en: "I disagree.", k: "s" },
    { fi: "Kalle oli samaa mieltä.", ru: "Калле был согласен.", en: "Kalle agreed.", k: "s" },
    { fi: "Mitä mieltä olette tästä?", ru: "Что вы об этом думаете?", en: "What do you think about this?", k: "s" },
    { fi: "Maijun mielestä kahvi on pahaa.", ru: "По мнению Майю, кофе противный.", en: "Maiju thinks coffee tastes bad.", k: "s" },
    { fi: "Meidän mielestämme sinun pitäisi mennä töihin.", ru: "По-нашему, тебе надо бы пойти работать.", en: "We think you should find a job.", k: "s" },
    { fi: "Virtasten mielestä laskettelu on hauskaa.", ru: "Виртанены считают, что горные лыжи — это весело.", en: "The Virtanens think downhill skiing is fun.", k: "s" },
    { fi: "Mummin mielestä tatuoinnit ovat rumia.", ru: "По мнению бабушки, татуировки некрасивые.", en: "Granny thinks tattoos are ugly.", k: "s" },
    { fi: "Onko tämä väri teidän mielestänne hyvä?", ru: "По-вашему, этот цвет хороший?", en: "Do you all think this color is good?", k: "s" },
    { fi: "Minun mielestäni värin pitäisi olla vähän vaaleampi.", ru: "По-моему, цвет должен быть чуть светлее.", en: "I think the color should be a bit lighter.", k: "s" }
  ]
},
{
  id: "LB_S1_23",
  title: "Времена года и время суток",
  source: "FinnishPod101 · Lower Beginner S1 #23",
  glossary: [
    { w: "ajan adessiivi", ru: "когда именно: время в адессиве", en: "adessive of time",
      forms: ["talvella", "keväällä", "kesällä", "syksyllä", "aamulla", "aamupäivällä", "päivällä", "iltapäivällä", "illalla", "yöllä", "viikolla", "öisin"],
      note: "Чтобы сказать, что что-то происходит в такой-то отрезок времени, название отрезка ставится в адессив (-lla/-llä). Так работают времена года, части суток и слово viikko.\ntalvi → talvella, kevät → keväällä, kesä → kesällä, syksy → syksyllä; aamu → aamulla, aamupäivä → aamupäivällä, päivä → päivällä, iltapäivä → iltapäivällä, ilta → illalla, yö → yöllä.\nСмысл при этом либо «вообще, каждое лето», либо про конкретный период, ясный из контекста. Слова ensi («следующий») и viime («прошлый») с адессивом времени не употребляются, поэтому какое именно лето — понимайте из разговора.\nИсключение — viikko: недели все похожи, из контекста нужную не угадать, поэтому уточнение обязательно: ensi viikolla, viime viikolla. А из исключения есть своё исключение: если viikko противопоставлено выходным и значит «с понедельника по пятницу», уточнение не нужно — Viikolla minulla on kiire, mutta viikonloppuna ehdin rentoutua." },
    { w: "valoisa", ru: "светлый (где много света)", en: "light, well-lit",
      forms: ["valoisa", "valoisaa", "valo", "auringonvalo"],
      note: "Светлый в смысле «где много света», обычно солнечного, но и от лампы тоже. НЕ значит «светлый» о цвете — для цвета есть vaalea: vaalean sininen («светло-синий»). И не значит «лёгкий» по весу. От существительного valo («свет»): auringonvalo, päivänvalo. Про характер тоже говорят: valoisa luonne («светлый, оптимистичный нрав»)." },
    { w: "pimeä", ru: "тёмный (где нет света)", en: "dark, lacking light",
      forms: ["pimeä", "pimeää", "pimeällä"],
      note: "Противоположность valoisa: там, где нет света. Про цвет так же нельзя — для цвета tumma: tumman ruskea («тёмно-коричневый»). Pimeä — это уже довольно темно, почти совсем. Между valoisa и pimeä есть hämärä («сумрачно, полутьма»)." },
    { w: "synkkä", ru: "мрачный, гнетущий", en: "gloomy, dark",
      forms: ["synkkä", "synkkää", "synkällä", "synkmetsä"],
      note: "И про обстановку (synkkä ilta — «мрачный вечер»), и про настроение человека: Kalle on tänään synkällä tuulella («Калле сегодня в мрачном настроении»). Часто про тучи и густой лес, звучит немного зловеще. Лихолесье Толкина по-фински — Synkmetsä («мрачный лес»)." },
    { w: "kevät", ru: "весна", en: "spring", forms: ["kevät", "keväällä"] },
    { w: "kesä", ru: "лето", en: "summer", forms: ["kesä", "kesällä", "kesäleireille"] },
    { w: "syksy", ru: "осень", en: "fall, autumn", forms: ["syksy", "syksyllä"] },
    { w: "talvi", ru: "зима", en: "winter", forms: ["talvi", "talvella"] },
    { w: "ihana", ru: "чудесный, прелестный", en: "lovely, wonderful", forms: ["ihana", "ihanaa", "ihanan"] },
    { w: "aina", ru: "всегда", en: "always", forms: ["aina"] }
  ],
  items: [
    { fi: "Ihanaa, kun on kevät!", ru: "Как чудесно, что весна!", en: "It's wonderful now that it's spring!", k: "d", who: "Satu" },
    { fi: "Niinpä. Talvella sitä vain odottaa, että tulee valoisaa ja lämmintä.", ru: "И правда. Зимой только и ждёшь, когда станет светло и тепло.", en: "Definitely. In the winter you just wait for it to get light and warm.", k: "d", who: "Petri" },
    { fi: "Kesällä on mukavaa, mutta syksy tulee aina liian aikaisin.", ru: "Летом хорошо, но осень всегда приходит слишком рано.", en: "It's nice in the summer, but autumn always comes too early.", k: "d", who: "Satu" },
    { fi: "Joo... Syksyllä on niin synkkää ja pimeää.", ru: "Да... Осенью так мрачно и темно.", en: "Yeah... It's so gloomy and dark in autumn.", k: "d", who: "Petri" },
    { fi: "kevät", ru: "весна", en: "spring", k: "w" },
    { fi: "kesä", ru: "лето", en: "summer", k: "w" },
    { fi: "syksy", ru: "осень", en: "fall, autumn", k: "w" },
    { fi: "talvi", ru: "зима", en: "winter", k: "w" },
    { fi: "aikaisin", ru: "рано", en: "early", k: "w" },
    { fi: "synkkä", ru: "мрачный", en: "gloomy", k: "w" },
    { fi: "aina", ru: "всегда", en: "always", k: "w" },
    { fi: "pimeä", ru: "тёмный", en: "dark", k: "w" },
    { fi: "ihana", ru: "чудесный", en: "lovely", k: "w" },
    { fi: "valoisa", ru: "светлый", en: "light, bright", k: "w" },
    { fi: "hämärä", ru: "сумрачный, полутьма", en: "dusky, dim", k: "w" },
    { fi: "Lumi sulaa keväällä.", ru: "Весной снег тает.", en: "The snow melts in the spring.", k: "s" },
    { fi: "Oli synkkä ja myrskyinen yö.", ru: "Была тёмная и ветреная ночь.", en: "It was a dark and stormy night.", k: "s" },
    { fi: "Syksyllä on kiva aloittaa jotain uutta.", ru: "Осенью приятно начать что-то новое.", en: "It's nice to start something new in the fall.", k: "s" },
    { fi: "Menemme aina keväällä Lappiin.", ru: "Весной мы всегда едем в Лапландию.", en: "We always go to Lapland in the spring.", k: "s" },
    { fi: "Et kai sinä pelkää pimeää?", ru: "Ты же не боишься темноты?", en: "You're not afraid of the dark, are you?", k: "s" },
    { fi: "Jussi on niin ihana!", ru: "Юсси такой чудесный!", en: "Jussi is so lovely!", k: "s" },
    { fi: "Talvella Virtaset käyvät laskettelemassa.", ru: "Зимой Виртанены катаются на горных лыжах.", en: "In the winter, the Virtanens go downhill skiing.", k: "s" },
    { fi: "Asuntonne on ihanan valoisa.", ru: "У вас чудесно светлая квартира.", en: "It's lovely how much light there is in your apartment.", k: "s" },
    { fi: "En pidä kesäleireille menemisestä.", ru: "Я не люблю ездить в летние лагеря.", en: "I don't like to go to summer camps.", k: "s" },
    { fi: "Mitä aiot tehdä kesällä?", ru: "Что планируешь делать летом?", en: "What are you planning to do in the summer?", k: "s" },
    { fi: "Kalle on tänään synkällä tuulella.", ru: "Калле сегодня в мрачном настроении.", en: "Kalle is in a gloomy mood today.", k: "s" },
    { fi: "Mitä teit kesällä?", ru: "Что ты делал летом?", en: "What did you do in the summer?", k: "s" },
    { fi: "Meillä on aina paljon töitä keväällä.", ru: "Весной у нас всегда много работы.", en: "We always have a lot of work in the spring.", k: "s" },
    { fi: "Sara menee syksyllä kouluun.", ru: "Сара осенью пойдёт в школу.", en: "Sara will go to school in the fall.", k: "s" },
    { fi: "Talvella luen paljon.", ru: "Зимой я много читаю.", en: "In the winter, I read a lot.", k: "s" },
    { fi: "Onko sinulla aikaa iltapäivällä?", ru: "У тебя есть время после обеда?", en: "Do you have time in the afternoon?", k: "s" },
    { fi: "Herään aamulla kahdeksalta.", ru: "Утром я встаю в восемь.", en: "I wake up at eight o'clock in the morning.", k: "s" },
    { fi: "Mikolla on aamupäivällä yksi palaveri.", ru: "У Микко до обеда одна встреча.", en: "Mikko has a meeting before noon.", k: "s" },
    { fi: "Katsoin illalla hyvän elokuvan.", ru: "Вечером я посмотрел хороший фильм.", en: "I watched a good movie in the evening.", k: "s" },
    { fi: "Montako kertaa vauvasi herää yöllä?", ru: "Сколько раз твой малыш просыпается ночью?", en: "How many times does your baby wake up during the night?", k: "s" },
    { fi: "Tulemme käymään ensi viikolla.", ru: "Мы зайдём на следующей неделе.", en: "We will drop by next week.", k: "s" },
    { fi: "Viime viikolla satoi paljon.", ru: "На прошлой неделе было много дождей.", en: "It rained a lot last week.", k: "s" },
    { fi: "Täältä on hieno maisema sekä yöllä että päivällä.", ru: "Отсюда прекрасный вид и ночью, и днём.", en: "The scene is great here both at night and during the day.", k: "s" },
    { fi: "Viikolla minulla on kiire, mutta viikonloppuna ehdin rentoutua.", ru: "На неделе я занят, а на выходных успеваю отдохнуть.", en: "I'm busy during the week, but on the weekend I have time to relax.", k: "s" }
  ]
},
{
  id: "LB_S1_24",
  title: "Настроение и чувства",
  source: "FinnishPod101 · Lower Beginner S1 #24",
  glossary: [
    { w: "tunteet", ru: "как сказать, что чувствуешь", en: "expressing feelings",
      forms: ["iloinen", "surullinen", "hilpeä", "rauhallinen", "masentunut", "pettynyt", "tyytyväinen", "tyytymätön", "onnellinen", "hermostunut", "masentuneita", "hermostuneita", "onnellisilta", "tyytymättömiltä", "rauhalliselta", "tyytyväiseltä", "masentuneelta"],
      note: "Самый простой способ — прилагательное в предложении с olla. Одна тонкость: в единственном числе прилагательное стоит в номинативе, а во множественном — в партитиве множественного. Mari oli iloinen, но Olimme masentuneita, Näyttelijät olivat hermostuneita.\nСлова, которые пригодятся: iloinen («радостный»), surullinen («грустный»), hilpeä («весёлый»), rauhallinen («спокойный»), masentunut («подавленный»), pettynyt («разочарованный»), tyytyväinen («довольный»), tyytymätön («недовольный»), onnellinen («счастливый»), hermostunut («нервничающий»).\nЕсли человек не «есть» такой, а «выглядит» таким, берут vaikuttaa («казаться», урок 10) или näyttää («выглядеть»), а прилагательное ставят в аблатив: Petri vaikutti rauhalliselta, Mika näytti tyytyväiseltä. Во множественном числе аблатив тоже множественный: Jukka ja Minna vaikuttavat onnellisilta." },
    { w: "harmittaa", ru: "досадовать, быть раздосадованным", en: "to be vexed",
      forms: ["harmittaa", "harmitti", "harmittaako", "harmittaa minua", "mattia", "tiinaa", "teitä"],
      note: "Глагол устроен непривычно: тот, кто досадует, стоит в партитиве и подлежащим НЕ является. Tiinaa harmittaa — «Тийна досадует». Minua harmittaa — «мне досадно».\nА подлежащим становится то, что раздосадовало: Häviäminen harmittaa minua («Проигрыш меня раздосадовал»). Причину можно и вынести в придаточное: Mattia harmitti, koska hän ei päässyt kavereiden kanssa ulos." },
    { w: "surra", ru: "горевать, оплакивать; переживать", en: "to mourn, to worry",
      forms: ["surra", "suri", "sure", "surko", "surraan"],
      note: "Здесь наоборот, всё как обычно: переживающий — подлежащее, а предмет переживаний — объект. Kerttu suri kuollutta miestään («Кертту оплакивала умершего мужа»), Ei yhtä lautasta kannata surra («Из-за одной тарелки не стоит убиваться»). Повелительное отрицательное: Älkää surko («Не переживайте»)." },
    { w: "olla hyvällä tuulella", ru: "быть в хорошем настроении", en: "to be in a good mood",
      forms: ["tuulella", "hyvällä", "huonolla", "pahalla"],
      note: "Идиома, буквально «быть на хорошем ветру»: tuuli — это «ветер» (урок 12). Противоположность — olla huonolla tuulella или olla pahalla tuulella («быть в плохом настроении»). Huono значит «плохой, негодный», paha — «плохой, злой», поэтому pahalla tuulella звучит чуть мрачнее, хотя разница невелика." },
    { w: "kuunnella", ru: "слушать (внимательно)", en: "to listen",
      forms: ["kuunnella", "kuuntelin", "kuuntelee", "kuunteli", "kuuntele"],
      note: "Именно активное слушание. Если звук просто донёсся сам, нужен kuulla («слышать»). Разница слышна в примере: Kuulin oven läpi, mitä he puhuivat — «я услышал через дверь, о чём они говорили», может быть, просто проходил мимо. А Kuuntelin oven läpi — уже «подслушивал», прижавшись ухом к двери." },
    { w: "huomenta", ru: "доброе утро", en: "good morning",
      forms: ["huomenta", "huomen", "huominen", "huomenna", "huomiseen"],
      note: "Короткая форма от Hyvää huomenta. Это партитив от huomen — старинного слова «утро». В современном языке «утро» — это aamu, а huomen сместилось в сторону значения «завтра» и живёт в основном в устойчивых выражениях: huomenna («завтра», наречие), huominen («завтрашний день»), Huomiseen («до завтра», урок 9)." },
    { w: "rikkoa", ru: "разбить, сломать", en: "to break", forms: ["rikkoa", "rikoin", "rikkoi", "rikkonut"] },
    { w: "masentunut", ru: "подавленный, в унынии", en: "depressed", forms: ["masentunut", "masentuneita", "masentuneelta"] },
    { w: "huonosti", ru: "плохо", en: "badly", forms: ["huonosti", "huono"] },
    { w: "matka", ru: "поездка, дорога", en: "trip, way", forms: ["matka", "matkalla", "matkan", "matkani"] },
    { w: "musiikki", ru: "музыка", en: "music", forms: ["musiikki", "musiikkia", "musiikista"] }
  ],
  items: [
    { fi: "Kylläpä sinä olet hyvällä tuulella.", ru: "Ну ты и в хорошем настроении.", en: "Oh, you're in a good mood.", k: "d", who: "Hanna" },
    { fi: "Kuuntelin matkalla hyvää musiikkia.", ru: "Я по дороге слушал хорошую музыку.", en: "I listened to some good music on the way.", k: "d", who: "Petri" },
    { fi: "Mari vaikuttaa vähän masentuneelta. Mikähän hänellä on?", ru: "Мари выглядит немного подавленной. Что это с ней?", en: "Mari seems a bit down. I wonder what's wrong with her?", k: "d", who: "Hanna" },
    { fi: "Kysytään. Huomenta, Mari! Onko jokin huonosti?", ru: "Спросим. Доброе утро, Мари! Что-то не так?", en: "Let's ask. Morning, Mari! Is something wrong?", k: "d", who: "Petri" },
    { fi: "Ei tässä mitään. Minua vaan harmittaa, kun rikoin aamulla lautasen.", ru: "Да ничего. Просто досадно, что я утром разбила тарелку.", en: "It's nothing. I'm just vexed that I broke a plate this morning.", k: "d", who: "Mari" },
    { fi: "Ei yhtä lautasta kannata surra! Katso, miten kaunis päivä siellä on.", ru: "Из-за одной тарелки не стоит убиваться! Смотри, какой там красивый день.", en: "There's no point in mourning over a plate. See what a beautiful day it is!", k: "d", who: "Petri" },
    { fi: "surra", ru: "горевать, переживать", en: "to mourn, to worry", k: "w" },
    { fi: "olla hyvällä tuulella", ru: "быть в хорошем настроении", en: "to be in a good mood", k: "w" },
    { fi: "huomenta", ru: "доброе утро", en: "good morning", k: "w" },
    { fi: "huonosti", ru: "плохо", en: "badly", k: "w" },
    { fi: "rikkoa", ru: "разбить, сломать", en: "to break", k: "w" },
    { fi: "masentunut", ru: "подавленный", en: "depressed", k: "w" },
    { fi: "harmittaa", ru: "досадовать", en: "to be vexed", k: "w" },
    { fi: "kuunnella", ru: "слушать", en: "to listen", k: "w" },
    { fi: "matka", ru: "поездка, дорога", en: "trip, way", k: "w" },
    { fi: "musiikki", ru: "музыка", en: "music", k: "w" },
    { fi: "iloinen", ru: "радостный", en: "happy, cheerful", k: "w" },
    { fi: "surullinen", ru: "грустный", en: "sad", k: "w" },
    { fi: "rauhallinen", ru: "спокойный", en: "calm", k: "w" },
    { fi: "pettynyt", ru: "разочарованный", en: "disappointed", k: "w" },
    { fi: "tyytyväinen", ru: "довольный", en: "pleased, content", k: "w" },
    { fi: "tyytymätön", ru: "недовольный", en: "displeased", k: "w" },
    { fi: "onnellinen", ru: "счастливый", en: "happy", k: "w" },
    { fi: "hermostunut", ru: "нервничающий", en: "nervous", k: "w" },
    { fi: "hilpeä", ru: "весёлый", en: "cheerful", k: "w" },
    { fi: "Älä sure, kyllä koirasi tulee takaisin.", ru: "Не переживай, твоя собака вернётся.", en: "Don't worry, your dog will come back.", k: "s" },
    { fi: "Taija oli eilen tosi hyvällä tuulella.", ru: "Тайя вчера была в очень хорошем настроении.", en: "Taija was in a really good mood yesterday.", k: "s" },
    { fi: "Hyvää huomenta!", ru: "Доброе утро!", en: "Good morning!", k: "s" },
    { fi: "Tuossa käy vielä huonosti.", ru: "Это ещё плохо кончится.", en: "That's not going to end well.", k: "s" },
    { fi: "Pallo rikkoi ikkunan.", ru: "Мяч разбил окно.", en: "The ball broke the window.", k: "s" },
    { fi: "Moni nuorikin on nykyään masentunut.", ru: "Сейчас и многие молодые в подавленном состоянии.", en: "Even many young people are depressed these days.", k: "s" },
    { fi: "Villeä harmittaa, koska hän myöhästyi junasta.", ru: "Вилле досадно, потому что он опоздал на поезд.", en: "Ville is vexed because he missed the train.", k: "s" },
    { fi: "Nainen kuuntelee musiikkia.", ru: "Женщина слушает музыку.", en: "The woman is listening to music.", k: "s" },
    { fi: "Nainen kuunteli musiikkia.", ru: "Женщина слушала музыку.", en: "The woman listened to music.", k: "s" },
    { fi: "Kuuntele! Mikä tuo ääni on?", ru: "Слушай! Что это за звук?", en: "Listen! What's that sound?", k: "s" },
    { fi: "Poika kuuntelee valtameren ääntä.", ru: "Мальчик слушает шум океана.", en: "The boy is listening to the sound of the ocean.", k: "s" },
    { fi: "Nainen kuuntelee tarkasti.", ru: "Женщина слушает внимательно.", en: "The woman is listening closely.", k: "s" },
    { fi: "Ajattelimme varata matkan Kreikkaan.", ru: "Мы подумывали забронировать поездку в Грецию.", en: "We thought we'd book a trip to Greece.", k: "s" },
    { fi: "Jotkut sanovat, että musiikki on maailmanlaajuinen kieli.", ru: "Некоторые говорят, что музыка — всемирный язык.", en: "Some say music is the universal language.", k: "s" },
    { fi: "Millaisesta musiikista pidät?", ru: "Какая музыка тебе нравится?", en: "What kind of music do you like?", k: "s" },
    { fi: "Mari oli iloinen, kun pääsi yliopistoon.", ru: "Мари была рада, что поступила в университет.", en: "Mari was happy because she was admitted to the university.", k: "s" },
    { fi: "Olimme masentuneita kilpailun jälkeen.", ru: "После соревнования мы были подавлены.", en: "We were depressed after the contest.", k: "s" },
    { fi: "Oletko tyytyväinen suoritukseesi?", ru: "Ты доволен своим выступлением?", en: "Are you pleased with your performance?", k: "s" },
    { fi: "Näyttelijät olivat hermostuneita ennen näytöstä.", ru: "Актёры нервничали перед спектаклем.", en: "The actors were nervous before the show.", k: "s" },
    { fi: "Petri vaikutti rauhalliselta ennen haastattelua.", ru: "Петри казался спокойным перед собеседованием.", en: "Petri seemed calm before the interview.", k: "s" },
    { fi: "Mika näytti tyytyväiseltä kokeen jälkeen.", ru: "Мика выглядел довольным после экзамена.", en: "Mika seemed pleased after the exam.", k: "s" },
    { fi: "Ikkunapöydän naiset vaikuttavat tyytymättömiltä.", ru: "Женщины за столиком у окна кажутся недовольными.", en: "The women at the window table seem discontent.", k: "s" },
    { fi: "Jukka ja Minna vaikuttavat onnellisilta.", ru: "Юкка и Минна выглядят счастливыми.", en: "Jukka and Minna seem happy.", k: "s" },
    { fi: "Häviäminen harmittaa minua.", ru: "Проигрыш меня расстраивает.", en: "Losing makes me vexed.", k: "s" },
    { fi: "Tiinaa harmittaa.", ru: "Тийне досадно.", en: "Tiina is vexed.", k: "s" },
    { fi: "Harmittaako teitä se, että tähän rakennetaan voimalaitos?", ru: "Вам досадно, что здесь построят электростанцию?", en: "Are you vexed by the fact that there will be a power plant built here?", k: "s" },
    { fi: "Kerttu suri kuollutta miestään.", ru: "Кертту оплакивала умершего мужа.", en: "Kerttu mourned over her deceased husband.", k: "s" },
    { fi: "Älkää surko, kyllä kaikki järjestyy.", ru: "Не переживайте, всё наладится.", en: "Don't worry, everything will sort out.", k: "s" },
    { fi: "Kuulin oven läpi, mitä he puhuivat.", ru: "Я услышал через дверь, о чём они говорили.", en: "I heard what they said through the door.", k: "s" },
    { fi: "Kuuntelin oven läpi, mitä he puhuivat.", ru: "Я подслушивал через дверь, о чём они говорили.", en: "I listened to what they said through the door.", k: "s" }
  ]
},
{
  id: "LB_S1_25",
  title: "Пассив: кто-то что-то делает",
  source: "FinnishPod101 · Lower Beginner S1 #25",
  glossary: [
    { w: "passiivi", ru: "форма неопределённого действующего лица", en: "unspecified actor form",
      forms: ["kaadetaan", "rakennetaan", "jätetään", "jätetäänköhän", "toivotaan", "istutetaan", "vaikutetaan", "kysytään", "autetaan", "muutetaan", "halutaan", "ollaan", "kuunnellaan", "surraan", "tehdään", "tullaan", "ajatellaan", "levätään", "juodaan", "mennään", "mennäänkö", "syödään", "heitetään", "maalataan", "pelataan", "liikutaan", "tanssitaan", "pidetään", "lähdetään", "voidaan", "juodaan", "rakennettu"],
      note: "Эту форму по традиции зовут пассивом, но по сути она другая. Английский пассив поднимает объект в подлежащие («The fish is eaten»), а финская форма говорит, что нечто делают неназванные люди: неизвестно кто, или незачем уточнять, или «вообще все так делают». Подлежащего в предложении нет вовсе, а действующий всегда человек — поэтому «рыбу съела кошка» через эту форму не передать.\nОбразование двух видов. Если перед последним -a/-ä инфинитива стоит гласный, берём основу 1-го лица единственного и добавляем -taan/-tään, причём конечный -a/-ä основы переходит в -e: kaataa → kaadan → kaadetaan, rakentaa → rakennan → rakennetaan, jättää → jätän → jätetään, istuttaa → istutan → istutetaan, kysyä → kysyn → kysytään, toivoa → toivon → toivotaan.\nЕсли перед последним гласным инфинитива согласный, добавляем -an/-än прямо к инфинитиву: haluta → halutaan, olla → ollaan, tehdä → tehdään, tulla → tullaan, ajatella → ajatellaan, levätä → levätään, juoda → juodaan.\nПорядок слов: предложение начинается с объекта или обстоятельства. Объект по-прежнему делится на «целиком» и «частично», но «целиком» здесь НЕ генитив, а номинатив: Omena syödään («Яблоко съедят») против Omenaa syödään («Яблоко едят»). Сравните с обычным Emmi syö omenan.\nВ разговорной речи эта форма почти всегда заменяет «мы»: не Me menemme elokuviin, а Me mennään elokuviin. Особенно в побуждении: Menkäämme elokuviin! звучит напыщенно, говорят Mennään elokuviin! Ею же уходят от прямого обращения: врач может спросить Kuinkas täällä tänään voidaan? («Как мы себя сегодня чувствуем?»)" },
    { w: "kukaan", ru: "кто-нибудь; никто", en: "anyone, no one",
      forms: ["kukaan", "ketään", "kenenkään", "kenessäkään", "kenestäkään", "kehenkään", "kenelläkään", "kellään", "keneltäkään", "kenellekään", "kenään"],
      note: "Всегда о человеке и почти всегда в вопросе или отрицании: Onko täällä ketään? («Здесь есть кто-нибудь?»), Ei kukaan halua... Как и joku (урок 4), склоняется в середине: партитив ketään, генитив kenenkään, инессив kenessäkään, элатив kenestäkään, иллатив kehenkään, адессив kenelläkään или kellään, аблатив keneltäkään, аллатив kenellekään, эссив kenään. Формы множественного числа встречаются редко." },
    { w: "puu", ru: "дерево; древесина", en: "tree, wood",
      forms: ["puu", "puita", "puiden", "puulattia", "puulusikka", "polttopuut"],
      note: "И живое дерево, и древесина как материал. Но «лес» — это не puu, а metsä. Составные: puulattia («деревянный пол»), puulusikka («деревянная ложка»), polttopuut («дрова»). Если хоккейный судья не реагирует на происходящее, его могут назвать puusilmä — буквально «деревянный глаз»." },
    { w: "talo", ru: "дом (жилой)", en: "house",
      forms: ["talo", "taloja", "talossa", "taloa", "omakotitalo", "kerrostalo", "rivitalo"],
      note: "Обычно именно жилой дом. Прочие здания — rakennus: toimistorakennus («офисное здание»). Составные: omakotitalo («частный дом на одну семью»), kerrostalo («многоэтажка»), rivitalo («блокированный дом, таунхаус»)." },
    { w: "kaataa", ru: "валить; наливать; опрокидывать", en: "to fell, to pour",
      forms: ["kaataa", "kaadan", "kaadetaan", "kaataa"],
      note: "Одно слово на всё, что опрокидывается или льётся: kaataa puu («срубить дерево»), Emäntä kaataa kahvia («Хозяйка наливает кофе»)." },
    { w: "rakentaa", ru: "строить", en: "to build", forms: ["rakentaa", "rakennan", "rakennetaan", "rakennettu"] },
    { w: "istuttaa", ru: "сажать (растения)", en: "to plant", forms: ["istuttaa", "istutan", "istutetaan", "istuttaneet"] },
    { w: "jättää", ru: "оставлять", en: "to leave (behind)", forms: ["jättää", "jätän", "jätetään", "jätämme", "jättäkää"] },
    { w: "toivoa", ru: "надеяться, желать", en: "to hope", forms: ["toivoa", "toivon", "toivotaan"] },
    { w: "asua", ru: "жить, проживать", en: "to live", forms: ["asua", "asun", "asutko", "asui", "asumaan"] },
    { w: "ympärillä", ru: "вокруг", en: "around", forms: ["ympärillä", "ympäri"] }
  ],
  items: [
    { fi: "Katso, tuosta kaadetaan puita.", ru: "Смотри, там валят деревья.", en: "Look, they're felling trees over there.", k: "d", who: "Satu" },
    { fi: "Siihen rakennetaan uusia taloja.", ru: "Там будут строить новые дома.", en: "They'll be building new houses there.", k: "d", who: "Petri" },
    { fi: "Jätetäänköhän siihen yhtään puuta?", ru: "Интересно, оставят ли там хоть одно дерево?", en: "I wonder if they'll leave any trees standing?", k: "d", who: "Satu" },
    { fi: "Toivotaan. Tai sitten siihen istutetaan jotain uutta.", ru: "Будем надеяться. Или посадят что-нибудь новое.", en: "Let's hope so. Or maybe they'll plant something new there.", k: "d", who: "Petri" },
    { fi: "Ei kai kukaan halua asua talossa, jonka ympärillä ei ole mitään vihreää.", ru: "Вряд ли кто-то хочет жить в доме, вокруг которого нет ничего зелёного.", en: "I suppose no one wants to live in a house that doesn't have anything green around it.", k: "d", who: "Satu" },
    { fi: "ympärillä", ru: "вокруг", en: "around", k: "w" },
    { fi: "kaataa", ru: "валить; наливать", en: "to fell, to pour", k: "w" },
    { fi: "toivoa", ru: "надеяться", en: "to hope", k: "w" },
    { fi: "istuttaa", ru: "сажать", en: "to plant", k: "w" },
    { fi: "asua", ru: "жить, проживать", en: "to live", k: "w" },
    { fi: "jättää", ru: "оставлять", en: "to leave", k: "w" },
    { fi: "kukaan", ru: "кто-нибудь; никто", en: "anyone, no one", k: "w" },
    { fi: "puu", ru: "дерево; древесина", en: "tree, wood", k: "w" },
    { fi: "rakentaa", ru: "строить", en: "to build", k: "w" },
    { fi: "talo", ru: "дом", en: "house", k: "w" },
    { fi: "Perhoset lepattelivat kukkien ympärillä.", ru: "Бабочки порхали вокруг цветов.", en: "Butterflies fluttered around the flowers.", k: "s" },
    { fi: "Tuo puu pitäisi kaataa.", ru: "То дерево надо бы спилить.", en: "That tree should be felled.", k: "s" },
    { fi: "Emäntä kaataa kahvia.", ru: "Хозяйка наливает кофе.", en: "The hostess is serving coffee.", k: "s" },
    { fi: "Toivotaan, että huomenna paistaa aurinko.", ru: "Будем надеяться, что завтра будет солнце.", en: "Let's hope the sun will shine tomorrow.", k: "s" },
    { fi: "Oletteko istuttaneet pihallenne mitään?", ru: "Вы что-нибудь посадили у себя во дворе?", en: "Have you planted anything in your yard?", k: "s" },
    { fi: "Asutko sinä Helsingissä?", ru: "Ты живёшь в Хельсинки?", en: "Do you live in Helsinki?", k: "s" },
    { fi: "Mies asui Sydneyssä, Australiassa.", ru: "Мужчина жил в Сиднее, в Австралии.", en: "The man lived in Sydney, Australia.", k: "s" },
    { fi: "Jätämme huoneen kahdeltatoista.", ru: "Мы освободим номер в двенадцать.", en: "We'll leave the room at noon.", k: "s" },
    { fi: "Jättäkää minullekin jälkiruokaa.", ru: "Оставьте и мне десерта.", en: "Leave some dessert for me, too.", k: "s" },
    { fi: "Onko täällä ketään?", ru: "Здесь есть кто-нибудь?", en: "Anybody here?", k: "s" },
    { fi: "Puiden lehdet vaihtavat väriä syksyllä.", ru: "Осенью листья деревьев меняют цвет.", en: "The leaves of trees change color in the fall.", k: "s" },
    { fi: "Milloin tämä talo on rakennettu?", ru: "Когда этот дом построили?", en: "When was this house built?", k: "s" },
    { fi: "Maalataan talo.", ru: "Покрасим дом.", en: "Let's paint the house.", k: "s" },
    { fi: "Omena syödään.", ru: "Яблоко съедят (целиком).", en: "The apple is eaten.", k: "s" },
    { fi: "Omenaa syödään.", ru: "Яблоко едят (не всё).", en: "An apple is being eaten.", k: "s" },
    { fi: "Pallo heitetään koiralle.", ru: "Мяч кинут собаке.", en: "The ball is thrown to the dog.", k: "s" },
    { fi: "Palloa heitetään koiralle.", ru: "Мяч кидают собаке.", en: "The ball is being thrown to the dog.", k: "s" },
    { fi: "Talo maalataan.", ru: "Дом покрасят.", en: "The house will be painted.", k: "s" },
    { fi: "Taloa maalataan.", ru: "Дом красят.", en: "The house is being painted.", k: "s" },
    { fi: "Suomessa juodaan paljon kahvia.", ru: "В Финляндии пьют много кофе.", en: "People drink a lot of coffee in Finland.", k: "s" },
    { fi: "Nykyään syödään liikaa ja liikutaan liian vähän.", ru: "Сейчас едят слишком много, а двигаются слишком мало.", en: "These days, people eat too much and exercise too little.", k: "s" },
    { fi: "Katso, tuolla pelataan jalkapalloa.", ru: "Смотри, там играют в футбол.", en: "Look, there are some people playing football over there.", k: "s" },
    { fi: "Tähän rakennetaan kerrostalo.", ru: "Здесь построят многоэтажку.", en: "A block of flats will be built here.", k: "s" },
    { fi: "Mennäänkö kävelylle?", ru: "Пойдём погуляем?", en: "Shall we go for a walk?", k: "s" },
    { fi: "Meidän häissämme tanssitaan aamuun asti!", ru: "На нашей свадьбе будут танцевать до утра!", en: "At our wedding, people will dance until the morning!", k: "s" },
    { fi: "Täällä pidetään kiinni työajoista.", ru: "Здесь придерживаются рабочего графика.", en: "We observe working hours here.", k: "s" },
    { fi: "Me mennään elokuviin.", ru: "Мы идём в кино. (разговорно)", en: "We will go to the movies. (colloquial)", k: "s" },
    { fi: "Kuinkas täällä tänään voidaan?", ru: "Как мы себя сегодня чувствуем?", en: "How are you today?", k: "s" }
  ]
},
{
  id: "BE_S1_01",
  title: "Погода: vielä и enää",
  source: "FinnishPod101 · Beginner S1 #1",
  glossary: [
    { w: "vielä ja enää", ru: "vielä «ещё» и enää «больше не»", en: "still and anymore",
      forms: ["vielä", "vieläkin", "enää", "niinkö", "kuitenkaan"],
      note: "Два наречия времени, которые легко перепутать.\n1) Vielä при глаголе в утвердительной форме — «ещё, всё ещё»: Olen vielä kiireinen («Я всё ещё занят»), Olen vielä nuori, Olin vielä opiskelija.\n2) Vielä при отрицании — «пока не, ещё не»: En tiedä vielä («Пока не знаю»), Etkö ole vielä naimisissa?, En ole löytänyt vielä poikaystävää.\n3) Enää употребляется только в отрицании и значит «больше не»: En ole enää niin kiireinen, En ole enää nuori, En mene sinne enää.\nСмысл различается по сути: vielä про то, что продолжается, enää про то, что закончилось. Уберите наречие — и останется простая констатация: Sataako ulkona? («На улице дождь?»), Ulkona ei sada." },
    { w: "sääsanat", ru: "погодные слова", en: "weather vocabulary",
      forms: ["sade", "pouta", "selkeä", "pakkanen", "ukkosmyrsky", "ukkonen", "salama", "tihkusade", "rankkasade", "lumi", "loska", "räntä", "lumimyrsky", "pyry", "lumituisku", "lumisade", "sadepilvi", "säätiedote"],
      note: "Осадки и явления: sade («дождь»), pouta («без дождя»), selkeä («ясно»), pakkanen («морозь»), ukkosmyrsky («гроза»), ukkonen («гром»), salama («молния»), tihkusade («морось»), rankkasade («ливень»), lumi («снег»), loska («слякоть»), räntä («мокрый снег»), lumimyrsky и pyry («метель»), lumituisku («поземка»), lumisade («снегопад»), sadepilvi («дождевая туча»).\nКак ощущается: kylmä («холодно»), jäätävä («ледяной»), kuuma («жарко»), kostea («влажно»), hiostava («душно»), viileä («прохладно»), raikas («свежо»)." },
    { w: "sateenvarjo", ru: "зонт", en: "umbrella",
      forms: ["sateenvarjo", "sateenvarjoni", "sateenvarjoa", "sateenvarjoasi", "sateenvarjon"],
      note: "Сложено из sade («дождь») и varjo («тень, укрытие»), буквально «тень дождя». Есть сленговые sontsa и sontikka, но sateenvarjo поймут в любом уголке страны." },
    { w: "kirkas taivas", ru: "ясное небо", en: "clear sky",
      forms: ["kirkas", "kirkkaalta", "taivas", "taivaalla", "taivaalta", "pilvinen", "harmaa"],
      note: "Kirkas — «ясный, яркий», taivas — «небо». Фраза про совершенно чистое небо без облаков: Aurinko paistaa kirkkaalta taivaalta. Про облачное небо скажут pilvinen taivas, про серое — harmaa taivas. А «небо в облаках» — taivas on pilvessä." },
    { w: "liittyä", ru: "присоединяться", en: "to join",
      forms: ["liittyä", "liityn", "liitytkö", "liityin", "seuraani", "seuraan"],
      note: "Liittyä seuraan — «присоединиться к компании»: Liitytkö seuraani? («Составишь мне компанию?»). Куда присоединяются — в иллатив: Liityin kirjakerhoon («Я вступил в книжный клуб»)." },
    { w: "sataa", ru: "идти (об осадках)", en: "to rain, to snow",
      forms: ["sataa", "sataako", "sada", "satoi", "satanut"],
      note: "Безличный глагол: подлежащего нет, стоит всегда в 3-м лице единственного. Sataa само по себе — про дождь, а что именно падает, уточняется партитивом: sataa lunta («идёт снег»), sataa räntää." },
    { w: "aurinko", ru: "солнце", en: "sun", forms: ["aurinko", "auringon", "auringonvalo", "auringonpaiste"] },
    { w: "paistaa", ru: "светить; жарить, печь", en: "to shine; to bake", forms: ["paistaa", "paistoi", "paista"] },
    { w: "sää", ru: "погода", en: "weather", forms: ["sää", "säästä", "sään", "säätiedote"] },
    { w: "pilvi", ru: "облако, туча", en: "cloud", forms: ["pilvi", "pilvessä", "pilviä", "pilvinen"] },
    { w: "taivas", ru: "небо", en: "sky", forms: ["taivas", "taivaalla", "taivaalta", "taivaasta"] }
  ],
  items: [
    { fi: "Olen juuri lähdössä lounaalle. Liitytkö seuraani?", ru: "Я как раз собираюсь на обед. Составишь компанию?", en: "I'm just about to leave for lunch. Would you like to join me?", k: "d", who: "Jukka" },
    { fi: "Kiitos, liityn mielelläni!", ru: "Спасибо, с удовольствием!", en: "Thank you, I'd love to!", k: "d", who: "Aino" },
    { fi: "Mutta sataako ulkona vielä? Unohdin sateenvarjoni kotiin.", ru: "А на улице ещё идёт дождь? Я забыла зонт дома.", en: "But is it still raining outside? I left my umbrella at home.", k: "d", who: "Aino" },
    { fi: "Ai niinkö? Ulkona ei kuitenkaan onneksi sada enää, vaikka taivas on pilvessä.", ru: "Да? К счастью, на улице уже не идёт, хотя небо в облаках.", en: "Is that so? Luckily it's not raining outside anymore, even though the sky is cloudy.", k: "d", who: "Jukka" },
    { fi: "No se on hyvä uutinen!", ru: "Ну это хорошая новость!", en: "Well that is good news!", k: "d", who: "Aino" },
    { fi: "Olisipa tänäänkin yhtä hyvä sää kuin eilen, kun aurinko paistoi kirkkaalta taivaalta.", ru: "Вот бы и сегодня погода была такая же хорошая, как вчера, когда солнце светило с ясного неба.", en: "I wish the weather today was as good as it was yesterday, when the sun was shining in the clear sky.", k: "d", who: "Aino" },
    { fi: "liittyä", ru: "присоединяться", en: "to join", k: "w" },
    { fi: "aurinko", ru: "солнце", en: "sun", k: "w" },
    { fi: "paistaa", ru: "светить", en: "to shine", k: "w" },
    { fi: "sää", ru: "погода", en: "weather", k: "w" },
    { fi: "pilvi", ru: "облако, туча", en: "cloud", k: "w" },
    { fi: "kirkas", ru: "ясный, яркий", en: "bright, clear", k: "w" },
    { fi: "sataa", ru: "идти (о дожде)", en: "to rain", k: "w" },
    { fi: "sateenvarjo", ru: "зонт", en: "umbrella", k: "w" },
    { fi: "taivas", ru: "небо", en: "sky", k: "w" },
    { fi: "vielä", ru: "ещё, всё ещё", en: "still, yet", k: "w" },
    { fi: "enää", ru: "больше не", en: "anymore", k: "w" },
    { fi: "pakkanen", ru: "мороз", en: "freezing weather", k: "w" },
    { fi: "ukkonen", ru: "гром", en: "thunder", k: "w" },
    { fi: "salama", ru: "молния", en: "lightning", k: "w" },
    { fi: "tihkusade", ru: "морось", en: "drizzle", k: "w" },
    { fi: "rankkasade", ru: "ливень", en: "heavy rain", k: "w" },
    { fi: "lumi", ru: "снег", en: "snow", k: "w" },
    { fi: "loska", ru: "слякоть", en: "slush", k: "w" },
    { fi: "räntä", ru: "мокрый снег", en: "sleet", k: "w" },
    { fi: "pyry", ru: "метель", en: "blizzard", k: "w" },
    { fi: "selkeä", ru: "ясный (о погоде)", en: "clear", k: "w" },
    { fi: "jäätävä", ru: "ледяной", en: "freezing", k: "w" },
    { fi: "kostea", ru: "влажный", en: "humid", k: "w" },
    { fi: "hiostava", ru: "душный", en: "muggy", k: "w" },
    { fi: "viileä", ru: "прохладный", en: "cool", k: "w" },
    { fi: "raikas", ru: "свежий", en: "brisk, fresh", k: "w" },
    { fi: "Haluaisin liittyä seuraan, mutta pelkäänpä että mursin varpaani eilen.", ru: "Я бы присоединился, но боюсь, что вчера сломал палец на ноге.", en: "I'd like to join, but I'm afraid I broke my toe yesterday.", k: "s" },
    { fi: "Menemme katsomaan elokuvaa. Haluatko liittyä seuraan?", ru: "Мы идём смотреть фильм. Хочешь с нами?", en: "We are going to see a movie. Do you want to join?", k: "s" },
    { fi: "Liityin eilen kirjakerhoon.", ru: "Вчера я вступил в книжный клуб.", en: "I joined a book club yesterday.", k: "s" },
    { fi: "Aurinko piristää minua.", ru: "Солнце меня бодрит.", en: "The sun cheers me up.", k: "s" },
    { fi: "Auringon pitäisi paistaa huomennakin.", ru: "Солнце должно светить и завтра.", en: "The sun should shine tomorrow as well.", k: "s" },
    { fi: "Perhe nauttii hyvästä säästä.", ru: "Семья наслаждается хорошей погодой.", en: "The family is enjoying the fine weather.", k: "s" },
    { fi: "Iltapäivällä sää muuttuu.", ru: "После обеда погода изменится.", en: "In the afternoon, the weather will change.", k: "s" },
    { fi: "Sää on kauhea.", ru: "Погода ужасная.", en: "This weather is horrible.", k: "s" },
    { fi: "Onneksi tänään on hyvä sää.", ru: "К счастью, сегодня хорошая погода.", en: "Luckily the weather's nice today.", k: "s" },
    { fi: "Taivaalla on vain muutama pilvi.", ru: "На небе всего несколько облаков.", en: "There are only a few clouds in the sky.", k: "s" },
    { fi: "Auringonpaiste on keväällä todella kirkas.", ru: "Весной солнечный свет очень яркий.", en: "The sunshine is really bright in the spring.", k: "s" },
    { fi: "Harmi, että tänään sataa.", ru: "Жаль, что сегодня дождь.", en: "It's a shame that it's raining today.", k: "s" },
    { fi: "En mene ulos, siellä sataa.", ru: "Я не выйду, там дождь.", en: "I'm not going out, it's raining.", k: "s" },
    { fi: "Näyttää siltä että sataa, joten älä unohda sateenvarjoasi.", ru: "Похоже, будет дождь, так что не забудь зонт.", en: "It looks like rain so don't forget your umbrella!", k: "s" },
    { fi: "Sateenvarjo on syksyllä tarpeellinen.", ru: "Осенью зонт необходим.", en: "An umbrella is necessary in the autumn.", k: "s" },
    { fi: "Saisinko tuon sateenvarjon?", ru: "Можно мне тот зонт?", en: "May I have that umbrella, please?", k: "s" },
    { fi: "Taivas näyttää tummalta.", ru: "Небо выглядит тёмным.", en: "The sky looks dark.", k: "s" },
    { fi: "Taivas on täynnä tähtiä.", ru: "Небо полно звёзд.", en: "The sky is full of stars.", k: "s" },
    { fi: "Minulla on uusi punainen sateenvarjo.", ru: "У меня новый красный зонт.", en: "I have a new red umbrella.", k: "s" },
    { fi: "Menen rannalle jos aurinko paistaa kirkkaalta taivaalta.", ru: "Пойду на пляж, если солнце будет светить с ясного неба.", en: "I will go to the beach if the sun is shining and the sky is clear.", k: "s" },
    { fi: "Olen vielä kiireinen.", ru: "Я всё ещё занят.", en: "I'm still busy.", k: "s" },
    { fi: "Olen vielä nuori.", ru: "Я ещё молод.", en: "I'm still young.", k: "s" },
    { fi: "Olin vielä opiskelija.", ru: "Я был тогда ещё студентом.", en: "I was still a student.", k: "s" },
    { fi: "En tiedä vielä.", ru: "Я пока не знаю.", en: "I don't know yet.", k: "s" },
    { fi: "Etkö ole vielä naimisissa?", ru: "Ты ещё не женат?", en: "Haven't you gotten married yet?", k: "s" },
    { fi: "En ole enää niin kiireinen.", ru: "Я больше не так занят.", en: "I'm not so busy anymore.", k: "s" },
    { fi: "En ole enää nuori.", ru: "Я больше не молод.", en: "I'm not young anymore.", k: "s" },
    { fi: "En mene sinne enää.", ru: "Я больше туда не пойду.", en: "I won't go there anymore.", k: "s" },
    { fi: "Aurinko ei paista enää, mennään kotiin.", ru: "Солнце больше не светит, идём домой.", en: "The sun is not shining anymore, let's go home.", k: "s" },
    { fi: "Ulkona sataa vieläkin lunta.", ru: "На улице всё ещё идёт снег.", en: "It's still snowing outside.", k: "s" },
    { fi: "Koska enää ei tuule, voimme lähteä veneilemään.", ru: "Раз ветра больше нет, можем пойти покататься на лодке.", en: "Because it's not windy anymore, we can go boating.", k: "s" },
    { fi: "Kolata lunta", ru: "Чистить снег лопатой", en: "To plow snow by hand", k: "s" }
  ]
},
{
  id: "IN_S1_01",
  title: "Собеседование на работу",
  source: "FinnishPod101 · Intermediate S1 #1",
  glossary: [
    { w: "preesens haastattelussa", ru: "настоящее время о себе", en: "present tense for your qualities",
      forms: ["opiskelen", "opiskelet", "opiskelee", "opiskelemme", "opiskelette", "opiskelevat", "työskentelen", "pidän", "olen"],
      note: "На собеседовании настоящее время описывает то, что верно сейчас: что вы учите, где работаете, какой вы человек. Готовые каркасы: Minä opiskelen... , Minä pidän... («мне нравится», с элативом), ...sopii minulle hyvin, koska... («мне это подходит, потому что»), Olen... («я такой-то»).\nЧто именно изучаете — партитив: Opiskelen kirjallisuutta yliopistossa. А в каком качестве работаете — эссив (урок 15): Työskentelen osa-aikaisena kukkakaupassa, Olen kotiäitinä." },
    { w: "perfekti työhistoriasta", ru: "перфект о прошлом опыте", en: "perfect for work history",
      forms: ["olen ollut", "olen työskennellyt", "olen tehnyt", "olen opiskellut", "olette lukeneet", "olemme lukeneet", "olen juonut", "olet lukenut"],
      note: "Перфект (урок 11) — главное время для рассказа о прошлом опыте: olen työskennellyt siellä aikaisemmin, Olen tehnyt kirjanpitäjän töitä, Olen opiskellut taidetta.\nВажное ограничение: перфект НЕ ставят рядом с точным указанием времени — eilen, viime viikolla, kaksi tuntia sitten, sinä päivänä. «Eilen olen lukenut kirjan» — ошибка, надо Luin kirjan eilen. Зато он свободно сочетается с общими словами: jo («уже»), ei koskaan / ei ikinä («никогда»), kerran («однажды»), aikaisemmin и ennen («раньше»), vielä («ещё»). Olen jo lukenut kirjan — правильно, потому что jo не привязано к дате." },
    { w: "työhaastattelu", ru: "собеседование при приёме на работу", en: "job interview",
      forms: ["työhaastattelu", "työhaastatteluun"],
      note: "Из työ («работа») и haastattelu («интервью»). Saitko kutsun työhaastatteluun? — «Тебя позвали на собеседование?»" },
    { w: "myyntityö", ru: "работа в продажах", en: "sales work",
      forms: ["myyntityö", "myyntityöstä", "myynti", "myyjä", "myyntipäällikkö", "suunnittelutyö"],
      note: "Myynti («продажи») + työ. Годится про всё, что связано с прямыми продажами клиентам — и продавец в магазине, и телемаркетинг. Про руководителя лучше сказать точнее: myyntipäällikkö («начальник отдела продаж»). Первую часть можно менять: suunnittelutyö («проектная работа»)." },
    { w: "ruokakauppa", ru: "продуктовый магазин", en: "grocery store",
      forms: ["ruokakauppa", "ruokakaupassa", "kauppa", "kauppaan"],
      note: "Ruoka («еда») + kauppa («магазин»). Любой магазин с продуктами, от маленькой лавки до гипермаркета. Про закусочную или киоск так не говорят — там noutoravintola или kioski. В речи часто сокращают до просто kauppa: Menen kauppaan («Иду в магазин»)." },
    { w: "työntekijän ominaisuudet", ru: "качества работника", en: "qualities of an employee",
      forms: ["ahkera", "systemaattinen", "päättäväinen", "luova", "ystävällinen", "miellyttävä", "luotettava", "kurinalainen", "motivoitunut", "joustava", "vilpitön", "menestynyt", "tahdikas", "rehellinen", "innostunut", "reilu", "järjestelmällinen", "looginen", "innovatiivinen", "aito", "tuottelias", "käytännöllinen", "positiivinen", "luonne", "johtajuustaidot", "tiimityöskentelijä", "huumorintaju"],
      note: "Прилагательные: ahkera («работящий»), systemaattinen («системный»), päättäväinen («решительный»), luova («творческий»), ystävällinen («приветливый»), miellyttävä («приятный»), luotettava («надёжный»), kurinalainen («дисциплинированный»), motivoitunut («мотивированный»), joustava («гибкий»), vilpitön («искренний»), tahdikas («тактичный»), rehellinen («честный»), innostunut («увлечённый»), reilu («справедливый»), järjestelmällinen («методичный»), looginen («логичный»), innovatiivinen, aito («настоящий»), tuottelias («продуктивный»), käytännöllinen («практичный»), positiivinen.\nСуществительные: luonne («характер»), johtajuustaidot («лидерские навыки»), tiimityöskentelijä («командный игрок»), huumorintaju («чувство юмора»), kokemus («опыт»)." },
    { w: "osa-aikainen", ru: "работающий на неполную ставку", en: "part-time", forms: ["osa-aikainen", "osa-aikaisen", "osa-aikaisena"] },
    { w: "kokemus", ru: "опыт", en: "experience", forms: ["kokemus", "kokemusta"] },
    { w: "aikaisemmin", ru: "раньше, ранее", en: "previously", forms: ["aikaisemmin", "aiemmin"] },
    { w: "sopiva", ru: "подходящий", en: "suitable", forms: ["sopiva", "sopivaa", "sopii", "sopisit"] },
    { w: "asiakaspalvelu", ru: "обслуживание клиентов", en: "customer service", forms: ["asiakaspalvelu", "asiakaspalvelusta"] },
    { w: "iltatyö", ru: "работа по вечерам", en: "evening work", forms: ["iltatyö", "iltatöitä"] },
    { w: "viikonloppuvuoro", ru: "смена в выходные", en: "weekend shift", forms: ["viikonloppuvuoro", "viikonloppuvuoroja", "viikonlopputyö", "viikonlopputöistä"] }
  ],
  items: [
    { fi: "Päivää! Olen Vilja Nurmela, tulin työhaastatteluun.", ru: "Добрый день! Я Вилья Нурмела, пришла на собеседование.", en: "Good afternoon! I'm Vilja Nurmela, I'm here for a job interview.", k: "d", who: "Vilja" },
    { fi: "Aivan, tervetuloa Vilja! Haet siis osa-aikaisen myyjän paikkaa.", ru: "Точно, добро пожаловать, Вилья! Значит, вы на место продавца на неполную ставку.", en: "Oh, right, welcome Vilja! So you're applying for the part-time sales assistant position.", k: "d", who: "Haastattelija" },
    { fi: "Kyllä.", ru: "Да.", en: "Yes.", k: "d", who: "Vilja" },
    { fi: "Onko sinulla kokemusta myyntityöstä?", ru: "У вас есть опыт работы в продажах?", en: "Do you have any experience in sales work?", k: "d", who: "Haastattelija" },
    { fi: "Olen ollut aikaisemmin ruokakaupassa töissä.", ru: "Раньше я работала в продуктовом магазине.", en: "I've previously worked in a supermarket.", k: "d", who: "Vilja" },
    { fi: "Ahaa. Miksi olisit sopiva henkilö tähän tehtävään?", ru: "Понятно. Почему вы подходящий человек для этой должности?", en: "Ok, I see. Why would you be a suitable person for this job?", k: "d", who: "Haastattelija" },
    { fi: "Opiskelen tällä hetkellä kirjallisuutta. Pidän myös asiakaspalvelusta.", ru: "Сейчас я изучаю литературу. Ещё мне нравится работа с клиентами.", en: "I'm currently studying literature. I also like customer service.", k: "d", who: "Vilja" },
    { fi: "Olen ahkera, ja iloinen työntekijä.", ru: "Я работящий и жизнерадостный сотрудник.", en: "I'm hard-working, and a cheerful employee.", k: "d", who: "Vilja" },
    { fi: "Tämä työ sisältää lähinnä iltatöitä ja myös viikonloppuvuoroja. Sopiiko se sinulle?", ru: "Эта работа — в основном вечерние смены и смены в выходные. Вам это подходит?", en: "This work includes mainly evening and weekend shifts. Is that ok for you?", k: "d", who: "Haastattelija" },
    { fi: "Kyllä, erinomaisesti. Opiskelen päiväsaikaan, joten ilta- ja viikonlopputyö sopii minulle oikein hyvin.", ru: "Да, отлично. Я учусь днём, так что вечерняя работа и выходные подходят мне очень хорошо.", en: "Yes, very much so. I study during the daytime, so evening and weekend work suits me perfectly.", k: "d", who: "Vilja" },
    { fi: "Hienoa! Kiitos Vilja. Soitamme loppuviikosta, jos päätämme ottaa sinut meille töihin.", ru: "Прекрасно! Спасибо, Вилья. Позвоним в конце недели, если решим вас взять.", en: "Great! Thank you Vilja. We'll call you at the end of the week, if we decide to hire you.", k: "d", who: "Haastattelija" },
    { fi: "Selvä. Kiitos paljon! Näkemiin!", ru: "Хорошо. Большое спасибо! До свидания!", en: "All right. Thank you so much! Good-bye!", k: "d", who: "Vilja" },
    { fi: "työhaastattelu", ru: "собеседование", en: "job interview", k: "w" },
    { fi: "osa-aikainen", ru: "на неполную ставку", en: "part-time", k: "w" },
    { fi: "kokemus", ru: "опыт", en: "experience", k: "w" },
    { fi: "aikaisemmin", ru: "раньше", en: "previously", k: "w" },
    { fi: "sopiva", ru: "подходящий", en: "suitable", k: "w" },
    { fi: "asiakaspalvelu", ru: "обслуживание клиентов", en: "customer service", k: "w" },
    { fi: "iltatyö", ru: "работа по вечерам", en: "evening work", k: "w" },
    { fi: "viikonlopputyö", ru: "работа по выходным", en: "weekend work", k: "w" },
    { fi: "viikonloppuvuoro", ru: "смена в выходные", en: "weekend shift", k: "w" },
    { fi: "ahkera", ru: "работящий", en: "diligent, hardworking", k: "w" },
    { fi: "luotettava", ru: "надёжный", en: "reliable", k: "w" },
    { fi: "joustava", ru: "гибкий", en: "flexible", k: "w" },
    { fi: "rehellinen", ru: "честный", en: "honest", k: "w" },
    { fi: "luova", ru: "творческий", en: "creative", k: "w" },
    { fi: "päättäväinen", ru: "решительный", en: "determined", k: "w" },
    { fi: "huumorintaju", ru: "чувство юмора", en: "sense of humor", k: "w" },
    { fi: "Työhaastatteluun on hyvä valmistautua kunnolla.", ru: "К собеседованию хорошо как следует подготовиться.", en: "It's good to prepare well for a job interview.", k: "s" },
    { fi: "Saitko kutsun työhaastatteluun?", ru: "Тебя позвали на собеседование?", en: "Did you get an invitation to a job interview?", k: "s" },
    { fi: "Toimistollamme aloittaa uusi osa-aikainen sihteeri.", ru: "У нас в офисе начинает новый секретарь на неполную ставку.", en: "A new part-time secretary is starting at our office.", k: "s" },
    { fi: "Isälläni on pitkä kokemus talojen rakentamisesta.", ru: "У моего отца большой опыт в строительстве домов.", en: "My father has a lot of experience with building houses.", k: "s" },
    { fi: "Minulla on paljon kokemusta pankkitoiminnan alalta.", ru: "У меня много опыта в банковской сфере.", en: "I have a lot of experience in the banking sector.", k: "s" },
    { fi: "Minulla ei ole kokemusta myyntityöstä.", ru: "У меня нет опыта работы в продажах.", en: "I have no experience in sales work.", k: "s" },
    { fi: "Opetin aikaisemmin englantia lapsille.", ru: "Раньше я преподавал английский детям.", en: "I previously taught English to children.", k: "s" },
    { fi: "Tämä työpaikka on erittäin sopiva sinulle.", ru: "Это место тебе очень подходит.", en: "This job is very suitable for you.", k: "s" },
    { fi: "Useilla yrityksillä on nykyään asiakaspalvelu netissä.", ru: "У многих компаний сейчас поддержка клиентов в интернете.", en: "Many companies nowadays have customer service online.", k: "s" },
    { fi: "Iltatyö sopii opiskelijoille.", ru: "Вечерняя работа подходит студентам.", en: "Evening work is suitable for students.", k: "s" },
    { fi: "Viikonlopputöistä saa hyvää palkkaa.", ru: "За работу по выходным хорошо платят.", en: "You get a nice salary for weekend hours.", k: "s" },
    { fi: "Teen tällä hetkellä vain viikonloppuvuoroja.", ru: "Сейчас я работаю только по выходным.", en: "I only do weekend shifts at the moment.", k: "s" },
    { fi: "Ruokakaupassa oli pitkä jono.", ru: "В продуктовом была длинная очередь.", en: "There was a long queue at the grocery store.", k: "s" },
    { fi: "Minä opiskelen yliopistossa.", ru: "Я учусь в университете.", en: "I study in a university.", k: "s" },
    { fi: "Minä työskentelen kukkakaupassa.", ru: "Я работаю в цветочном магазине.", en: "I work in a flower shop.", k: "s" },
    { fi: "Minä opiskelen kirjallisuutta yliopistossa.", ru: "Я изучаю литературу в университете.", en: "I study literature at university.", k: "s" },
    { fi: "Minä työskentelen osa-aikaisena kukkakaupassa.", ru: "Я работаю в цветочном магазине на неполную ставку.", en: "I work as a part-time worker in a flower shop.", k: "s" },
    { fi: "Minä olen kotiäitinä.", ru: "Я домохозяйка.", en: "I am a housewife.", k: "s" },
    { fi: "Tämä työ sopii minulle hyvin, koska puhun eri kieliä.", ru: "Эта работа мне подходит, потому что я говорю на разных языках.", en: "This job suits me well because I speak different languages.", k: "s" },
    { fi: "Olen luotettava ja ahkera työntekijä.", ru: "Я надёжный и работящий сотрудник.", en: "I am a trustworthy and hard-working employee.", k: "s" },
    { fi: "Olen ystävällinen ja joustava työntekijä.", ru: "Я приветливый и гибкий сотрудник.", en: "I am a friendly and flexible employee.", k: "s" },
    { fi: "Olen työskennellyt pankissa ennenkin.", ru: "Я и раньше работал в банке.", en: "I have worked in a bank before as well.", k: "s" },
    { fi: "Olen tehnyt kirjanpitäjän töitä.", ru: "Я работал бухгалтером.", en: "I have worked as a book-keeper.", k: "s" },
    { fi: "Olen opiskellut taidetta.", ru: "Я изучал искусство.", en: "I have studied art.", k: "s" },
    { fi: "Olen jo lukenut kirjan.", ru: "Я уже прочитал книгу.", en: "I have read the book already.", k: "s" },
    { fi: "Luin kirjan eilen.", ru: "Я прочитал книгу вчера.", en: "I read the book yesterday.", k: "s" },
    { fi: "Valmennan juniorijalkapallojoukkuetta, joten olen hyvä johtaja.", ru: "Я тренирую юношескую футбольную команду, так что я хороший руководитель.", en: "I coach a junior football team, so I am a good leader.", k: "s" },
    { fi: "Päivää! Nimeni on Vilja. Onko teillä mahdollisesti työpaikkoja vapaana?", ru: "Добрый день! Меня зовут Вилья. У вас, возможно, есть свободные места?", en: "Good afternoon! My name is Vilja. Do you possibly have any job vacancies?", k: "s" }
  ]
},
];

const LESSONS_AB = [
{
  id: "AB_S1_01",
  title: "Знакомство: как себя назвать",
  source: "FinnishPod101 · Absolute Beginner S1 #1",
  glossary: [
    { w: "minä olen", ru: "конструкция «я — такой-то»", en: "I am ...",
      forms: ["minä", "olen", "on", "ovat"],
      note: "Схема простая: Minä olen A. Minä — местоимение «я», olen — форма глагола olla («быть») для первого лица единственного числа, а на месте A всё, что вы хотите о себе сказать: имя, профессия, состояние. Minä olen Helen, Minä olen opettaja, Minä olen iloinen («Я радостный»).\nОдна оговорка: не всякое состояние так выражается. «Мне жарко» или «мне холодно» через minä olen не скажешь — для них есть отдельная конструкция, она встретится позже." },
    { w: "hauska tutustua", ru: "приятно познакомиться", en: "nice to meet you",
      forms: ["hauska", "tutustua", "tavata"],
      note: "Буквально «приятно познакомиться»: hauska («приятный») + tutustua («знакомиться») в инфинитиве. Как и в русском, это не полное предложение — подлежащего и сказуемого тут нет. Равноправный вариант — Hauska tavata, буквально «приятно встретиться». Говорить это не обязательно, но приятно." },
    { w: "hyvää päivää", ru: "приветствия по времени дня", en: "greetings",
      forms: ["hyvää", "päivää", "huomenta", "iltaa", "yötä", "öitä", "näkemiin", "nähdään", "heippa", "moikka"],
      note: "Hyvää päivää — из hyvä («хороший») и päivä («день»), оба в падежной форме, но пока это можно не разбирать. Приветствие слегка официальное и годится почти на весь день: примерно с одиннадцати-двенадцати до шести-семи вечера. До полудня говорят Hyvää huomenta («доброе утро»), после шести — Hyvää iltaa («добрый вечер»).\nВажно: всё это говорят ТОЛЬКО при встрече, не при расставании. Расходясь, скажут Näkemiin (официально) или Nähdään, Hei hei, Heippa, Moikka (по-дружески), а перед сном — Hyvää yötä.\nСлово hyvää можно опустить, вежливость почти не пострадает. Правда, если убрать его из Hyvää yötä, то yötä обычно ставят во множественное: Öitä!" },
    { w: "vartalo", ru: "основа слова, к которой клеятся окончания", en: "declension stem",
      forms: ["vartalo"],
      note: "Почти все финские слова меняются: и глаголы, и существительные, и прилагательные, и местоимения, и числительные берут окончания. Но основа, к которой они клеятся, не всегда совпадает со словарной формой — с инфинитивом у глаголов и с номинативом у остальных. Поэтому основу приходится знать отдельно; в уроках её дают вместе с новым словом." },
    { w: "äänteet", ru: "буквы и звуки финского", en: "Finnish sounds",
      forms: ["kissa", "järvi", "kengät", "kenkä", "langat", "äiti", "ääni", "pöllö", "löytää", "auto", "hei", "kiitos", "orava", "koulu", "tuuli", "tuli", "kyllä", "yö"],
      note: "Пишется латиницей, но гласных больше, чем в английском: есть ä, ö и å.\nСогласные: k всегда читается как /k/ — kissa («кошка»); j читается как русское «й» — järvi («озеро»); сочетание nk превращается в звук «нг» при изменении слова: kenkä («ботинок») → kengät («ботинки»), langat («нитки»).\nГласные: å — это «шведское o», встречается только в шведских именах и названиях вроде Åbo и Åland. ä — открытое «э» как в английском cat: äiti («мама»), ääni («звук, голос»). ö — как «ё» без «й»: pöllö («сова»), löytää («находить»). Остальные ближе к русским, чем к английским: a в auto, e в hei, i в kiitos, o в orava («белка») и koulu («школа»), u в tuuli, y — среднее между «у» и «ю», как в kyllä («да») и yö («ночь»)." },
    { w: "kaksoiskirjaimet", ru: "двойные буквы: долгий звук меняет смысл", en: "double letters",
      forms: ["kuka", "kukka", "tuli", "tuuli"],
      note: "Двойная гласная или двойная согласная — это просто долгий звук, но пропустить его нельзя: смысл меняется. Kuka — «кто», а kukka — «цветок». Tuli — «огонь», а tuuli — «ветер». Долготу надо и слышать, и выговаривать." },
    { w: "hyvä", ru: "хороший", en: "good", forms: ["hyvä", "hyvää", "hyväksi"] },
    { w: "päivä", ru: "день", en: "day", forms: ["päivä", "päivää", "päivän"] },
    { w: "hauska", ru: "приятный, весёлый", en: "pleasant, fun", forms: ["hauska", "hauskaa"] },
    { w: "tervetuloa", ru: "добро пожаловать", en: "welcome", forms: ["tervetuloa"] },
    { w: "tutustua", ru: "знакомиться", en: "to get to know", forms: ["tutustua"] },
    { w: "ja", ru: "и", en: "and", forms: ["ja"] }
  ],
  items: [
    { fi: "Päivää, minä olen Helen.", ru: "Добрый день, я Хелен.", en: "Hello, I'm Helen.", k: "d", who: "Helen" },
    { fi: "Hyvää päivää ja tervetuloa!", ru: "Добрый день и добро пожаловать!", en: "Hello, and welcome!", k: "d", who: "Liisa" },
    { fi: "Minä olen Liisa. Hauska tutustua.", ru: "Я Лийса. Приятно познакомиться.", en: "I'm Liisa. Nice to meet you.", k: "d", who: "Liisa" },
    { fi: "Hauska tutustua.", ru: "Приятно познакомиться.", en: "Nice to meet you.", k: "d", who: "Helen" },
    { fi: "minä", ru: "я", en: "I", k: "w" },
    { fi: "hyvä", ru: "хороший", en: "good", k: "w" },
    { fi: "ja", ru: "и", en: "and", k: "w" },
    { fi: "tutustua", ru: "знакомиться", en: "to get to know", k: "w" },
    { fi: "tervetuloa", ru: "добро пожаловать", en: "welcome", k: "w" },
    { fi: "olla", ru: "быть", en: "to be", k: "w" },
    { fi: "hauska", ru: "приятный, весёлый", en: "pleasant, fun", k: "w" },
    { fi: "päivä", ru: "день", en: "day", k: "w" },
    { fi: "kuka", ru: "кто", en: "who", k: "w" },
    { fi: "kukka", ru: "цветок", en: "flower", k: "w" },
    { fi: "tuli", ru: "огонь", en: "fire", k: "w" },
    { fi: "tuuli", ru: "ветер", en: "wind", k: "w" },
    { fi: "äiti", ru: "мама", en: "mother", k: "w" },
    { fi: "ääni", ru: "звук, голос", en: "sound, voice", k: "w" },
    { fi: "järvi", ru: "озеро", en: "lake", k: "w" },
    { fi: "kissa", ru: "кошка", en: "cat", k: "w" },
    { fi: "pöllö", ru: "сова", en: "owl", k: "w" },
    { fi: "orava", ru: "белка", en: "squirrel", k: "w" },
    { fi: "koulu", ru: "школа", en: "school", k: "w" },
    { fi: "kyllä", ru: "да", en: "yes", k: "w" },
    { fi: "yö", ru: "ночь", en: "night", k: "w" },
    { fi: "Minä olen opiskelija.", ru: "Я студент.", en: "I'm a student.", k: "s" },
    { fi: "Minä olen Sari Lehtinen.", ru: "Я Сари Лехтинен.", en: "I am Sari Lehtinen.", k: "s" },
    { fi: "Minä olen opettaja.", ru: "Я учитель.", en: "I am a teacher.", k: "s" },
    { fi: "Minä olen iloinen.", ru: "Я радостный.", en: "I am happy.", k: "s" },
    { fi: "Hän on hyvä ihminen.", ru: "Она хороший человек.", en: "She is a good person.", k: "s" },
    { fi: "Vihannekset ovat hyväksi sinulle.", ru: "Овощи тебе полезны.", en: "Vegetables are good for you.", k: "s" },
    { fi: "Tämä on hyvä!", ru: "Это хорошо!", en: "This is good!", k: "s" },
    { fi: "Tämä on oikein hyvä.", ru: "Это очень хорошо.", en: "This is very good.", k: "s" },
    { fi: "Yksi valkoviini ja kaksi olutta, kiitos.", ru: "Один бокал белого вина и два пива, пожалуйста.", en: "One white wine and two beers, please.", k: "s" },
    { fi: "Näkemiin, oli hauska tutustua.", ru: "До свидания, было приятно познакомиться.", en: "Goodbye, it was nice to meet you.", k: "s" },
    { fi: "Hauska tavata.", ru: "Приятно встретиться.", en: "Nice to meet you.", k: "s" },
    { fi: "Tervetuloa kotiini!", ru: "Добро пожаловать ко мне домой!", en: "Welcome to my home!", k: "s" },
    { fi: "Tervetuloa kotiin!", ru: "С возвращением домой!", en: "Welcome home!", k: "s" },
    { fi: "He ovat ystäviäni.", ru: "Они мои друзья.", en: "They are my friends.", k: "s" },
    { fi: "Onko sinulla siskoa?", ru: "У тебя есть сестра?", en: "Do you have a sister?", k: "s" },
    { fi: "Hän on hauska mies.", ru: "Он весёлый мужчина.", en: "He is a funny man.", k: "s" },
    { fi: "koko päivän", ru: "весь день", en: "all day long", k: "s" },
    { fi: "Mikä päivä tänään on?", ru: "Какой сегодня день?", en: "What day is it today?", k: "s" },
    { fi: "Hauskaa päivää!", ru: "Хорошего дня!", en: "Have a nice day!", k: "s" },
    { fi: "Hyvää huomenta!", ru: "Доброе утро!", en: "Good morning!", k: "s" },
    { fi: "Hyvää iltaa!", ru: "Добрый вечер!", en: "Good evening!", k: "s" },
    { fi: "Hyvää yötä!", ru: "Спокойной ночи!", en: "Good night!", k: "s" },
    { fi: "Öitä!", ru: "Ночи! (по-дружески)", en: "Night! (casual)", k: "s" }
  ]
},
{
  id: "AB_S1_02",
  title: "Он и она: глагол в единственном числе",
  source: "FinnishPod101 · Absolute Beginner S1 #2",
  glossary: [
    { w: "yksikön persoonamuodot", ru: "три лица единственного числа", en: "singular verb forms",
      forms: ["olen", "olet", "on", "tulen", "tulet", "tulee"],
      note: "У финского глагола своя форма для каждого лица — в отличие от английского, где меняется только третье. Берём основу глагола и добавляем окончание: -n для первого лица, -t для второго. В третьем лице окончания нет, зато последний гласный основы удлиняется: tule- → hän tulee.\nminä tulen, sinä tulet, hän tulee. Глагол olla неправильный, его третье лицо надо просто запомнить: minä olen, sinä olet, hän on.\nВажная привычка: раз лицо видно по окончанию, местоимения minä и sinä обычно опускают — Tulen huomenna звучит естественнее, чем Minä tulen huomenna. А вот в третьем лице подлежащее нужно, иначе непонятно, о ком речь." },
    { w: "hän", ru: "он, она", en: "he, she",
      forms: ["hän", "häntä", "hänellä"],
      note: "Одно местоимение на оба рода: финский в третьем лице мужчин и женщин не различает. Из-за этого финны, говоря по-английски, часто путают he и she — это не невнимательность, а привычка родного языка.\nВ принципе hän только о людях, не о животных, хотя своих питомцев некоторые так называют. В сказках очеловеченных зверей тоже зовут hän." },
    { w: "hei ja terve", ru: "неформальные приветствия", en: "casual greetings",
      forms: ["hei", "terve", "moi", "heippa", "moikka", "moro", "tere", "tervetuloa", "tervemenoa"],
      note: "В уроке 1 были официальные приветствия по времени дня. Hei и terve — попроще, но в деловой обстановке тоже годятся. Hei значит ровно «привет», и больше ничего.\nA у terve есть своё значение — «здоровый». Оно же сидит в слове tervetuloa («добро пожаловать»), где вторая часть — форма глагола tulla («приходить»). Есть и противоположность: tervemenoa, от mennä («уходить»), примерно «скатертью дорога».\nЕщё разговорнее: moi, heippa, moikka, moro, tere." },
    { w: "ääntäminen", ru: "как звучит финский", en: "Finnish pronunciation",
      forms: ["ala", "kukka", "sinä", "hieno", "järvi", "joki", "äiti", "isä", "lämmin", "täällä", "yö", "syödä"],
      note: "Звуков немного: тринадцать согласных (d, g, h, j, k, l, m, n, p, r, s, t, v) и девять гласных (a, e, i, o, u, y, ä, ö, å). Слова строятся из слогов, где гласные и согласные чередуются: a.la, kuk.ka, si.nä. Скоплений согласных вроде английского strength в финском не бывает.\nГлавная ловушка для говорящих по-английски — придыхание. В английском после p, t, k вырывается облачко воздуха («TWO»), в финском его почти нет. Придыхание сразу выдаёт иностранца. Небольшое придыхание есть только у h: hieno («хороший»).\nЗвук j — это русское «й»: järvi («озеро»), joki («река»). Å встречается только в шведских именах и читается как обычное o." },
    { w: "väsynyt", ru: "уставший", en: "tired", forms: ["väsynyt"] },
    { w: "varmaan", ru: "наверное, должно быть", en: "surely, probably", forms: ["varmaan", "varmasti"] },
    { w: "vähän", ru: "немного", en: "a little", forms: ["vähän"] },
    { w: "sinä", ru: "ты", en: "you", forms: ["sinä", "sinulla", "sinulle"] }
  ],
  items: [
    { fi: "Hei, minä olen Emmi.", ru: "Привет, я Эмми.", en: "Hi, I'm Emmi.", k: "d", who: "Emmi" },
    { fi: "Hei!", ru: "Привет!", en: "Hi!", k: "d", who: "Helen" },
    { fi: "Hän on Jussi.", ru: "Это Юсси.", en: "He is Jussi.", k: "d", who: "Emmi" },
    { fi: "Terve! Sinä olet varmaan väsynyt.", ru: "Привет! Ты, наверное, устала.", en: "Hey! You must be tired.", k: "d", who: "Jussi" },
    { fi: "Vähän.", ru: "Немного.", en: "A little.", k: "d", who: "Helen" },
    { fi: "terve", ru: "привет; здоровый", en: "hey; healthy", k: "w" },
    { fi: "hän", ru: "он, она", en: "he, she", k: "w" },
    { fi: "varmaan", ru: "наверное", en: "surely", k: "w" },
    { fi: "väsynyt", ru: "уставший", en: "tired", k: "w" },
    { fi: "sinä", ru: "ты", en: "you", k: "w" },
    { fi: "vähän", ru: "немного", en: "a little", k: "w" },
    { fi: "hei", ru: "привет", en: "hello", k: "w" },
    { fi: "moi", ru: "привет (разговорное)", en: "hi (casual)", k: "w" },
    { fi: "Hän syötti kanat tänä aamuna.", ru: "Он покормил кур этим утром.", en: "He fed the chickens this morning.", k: "s" },
    { fi: "Hän tulee kohta.", ru: "Он скоро придёт.", en: "He will come soon.", k: "s" },
    { fi: "Hän on varmaan jääkiekkoilija.", ru: "Он, наверное, хоккеист.", en: "He is surely an ice hockey player.", k: "s" },
    { fi: "Olen väsynyt.", ru: "Я устал.", en: "I'm tired.", k: "s" },
    { fi: "Sinä olet kutsuttu.", ru: "Ты приглашён.", en: "You are invited.", k: "s" },
    { fi: "Mitä sinä teet?", ru: "Что ты делаешь?", en: "What are you doing?", k: "s" },
    { fi: "Nainen hymyilee sinulle.", ru: "Женщина тебе улыбается.", en: "The woman smiles at you.", k: "s" },
    { fi: "Hän nukkui vähän viime yönä.", ru: "Она мало спала прошлой ночью.", en: "She had little sleep last night.", k: "s" },
    { fi: "Kyllä, minulla on vähän nälkä.", ru: "Да, я немного голоден.", en: "Yes, I'm a little hungry.", k: "s" },
    { fi: "Kyllä, puhun vähän.", ru: "Да, немного говорю.", en: "Yes, I speak a little.", k: "s" },
    { fi: "Hei, Mari.", ru: "Привет, Мари.", en: "Hello, Mari.", k: "s" },
    { fi: "Minä olen vaihto-oppilas.", ru: "Я студент по обмену.", en: "I am an exchange student.", k: "s" },
    { fi: "Sinä olet lääkäri.", ru: "Ты врач.", en: "You are a doctor.", k: "s" },
    { fi: "Hän on poliisi.", ru: "Он полицейский.", en: "He is a police officer.", k: "s" },
    { fi: "Jussi on poika.", ru: "Юсси — мальчик.", en: "Jussi is a boy.", k: "s" },
    { fi: "Emmi on tyttö.", ru: "Эмми — девочка.", en: "Emmi is a girl.", k: "s" },
    { fi: "Tulen huomenna.", ru: "Приду завтра.", en: "I will come tomorrow.", k: "s" },
    { fi: "Olen iloinen, että olet täällä.", ru: "Я рад, что ты здесь.", en: "I'm glad you are here.", k: "s" },
    { fi: "minä tulen", ru: "я прихожу", en: "I come", k: "s" },
    { fi: "sinä tulet", ru: "ты приходишь", en: "you come", k: "s" },
    { fi: "hän tulee", ru: "он приходит", en: "he comes", k: "s" }
  ]
},
{
  id: "AB_S1_03",
  title: "Что это? Кто это?",
  source: "FinnishPod101 · Absolute Beginner S1 #3",
  glossary: [
    { w: "mikä ja kuka", ru: "вопросы «что это» и «кто это»", en: "asking what and who",
      forms: ["mikä", "kuka", "mitä"],
      note: "Берём обычное предложение Tämä on lautanen («Это тарелка») и обозначим его как схему A on B. Чтобы получился вопрос, убираем B и ставим вопросительное слово в начало:\nMikä A on? — «Что такое A?»\nKuka A on? — «Кто такой A?»\nОбратите внимание: в отличие от английского, порядок остальных слов НЕ меняется, ничего переставлять не надо. Просто добавили слово в начало — и готово.\nKuka спрашивает про личность человека: ответом будет имя, должность, «мой начальник». Mikä — про всё остальное." },
    { w: "tämä, tuo, se", ru: "этот, тот, он (по удалённости)", en: "this, that, it",
      forms: ["tämä", "tuo", "se", "tämän", "tuon", "siitä", "sen"],
      note: "Три указательных местоимения, и выбор зависит от расстояния. Tämä — то, что рядом с говорящим. Tuo — то, что не рядом, но видно; может быть рядом со слушателем. Se — то, что не рядом и видеть его не обязательно.\nTämä и tuo обычно говорят, показывая пальцем, а se — про то, о чём уже была речь, поэтому оно типично для ответов.\nВсе три могут стоять сами по себе (Tämä on punainen — «Это красное») или при существительном (Tämä pallo on punainen — «Этот мяч красный»). Когда они стоят одни, никакого слова-подпорки вроде английского one не нужно: Tuo on liian suuri — «Тот слишком большой».\nВ разговорной речи se говорят и про людей вместо hän. Ничего пренебрежительного в этом нет." },
    { w: "presidentti", ru: "президент (страны)", en: "president",
      forms: ["presidentti"],
      note: "Уже́, чем русское и английское слово: по-фински так называют почти исключительно главу государства. У руководителей компаний и организаций другие названия." },
    { w: "lautanen", ru: "тарелка", en: "plate", forms: ["lautanen", "lautasta", "lautas"] },
    { w: "lasi", ru: "стакан; стекло", en: "glass", forms: ["lasi", "lasia"] }
  ],
  items: [
    { fi: "Mikä tämä on?", ru: "Что это?", en: "What's this?", k: "d", who: "Helen" },
    { fi: "Se on lautanen.", ru: "Это тарелка.", en: "It's a plate.", k: "d", who: "Liisa" },
    { fi: "Mikä tuo on?", ru: "А то что?", en: "What's that?", k: "d", who: "Helen" },
    { fi: "Se on lasi.", ru: "Это стакан.", en: "It's a glass.", k: "d", who: "Liisa" },
    { fi: "Kuka tuo on?", ru: "А это кто?", en: "Who's that?", k: "d", who: "Helen" },
    { fi: "Se on presidentti Niinistö.", ru: "Это президент Ниинистё.", en: "It's President Niinistö.", k: "d", who: "Liisa" },
    { fi: "lasi", ru: "стакан", en: "glass", k: "w" },
    { fi: "kuka", ru: "кто", en: "who", k: "w" },
    { fi: "presidentti", ru: "президент", en: "president", k: "w" },
    { fi: "se", ru: "он, это", en: "it", k: "w" },
    { fi: "tämä", ru: "этот (рядом)", en: "this", k: "w" },
    { fi: "tuo", ru: "тот (видно, но не рядом)", en: "that", k: "w" },
    { fi: "lautanen", ru: "тарелка", en: "plate", k: "w" },
    { fi: "mikä", ru: "что, какой", en: "what, which", k: "w" },
    { fi: "Tämä lasi on painava.", ru: "Этот стакан тяжёлый.", en: "This glass is heavy.", k: "s" },
    { fi: "Kuka siellä?", ru: "Кто там?", en: "Who's there?", k: "s" },
    { fi: "Tarja Halonen on entinen presidentti.", ru: "Тарья Халонен — бывший президент.", en: "Tarja Halonen is a former President.", k: "s" },
    { fi: "Kyllä, se on aika hyvää.", ru: "Да, это довольно вкусно.", en: "Yes, it's quite good.", k: "s" },
    { fi: "Voisitko sanoa sen uudestaan?", ru: "Ты не мог бы повторить это?", en: "Could you say it once again?", k: "s" },
    { fi: "Isoäitini antoi minulle tämän.", ru: "Бабушка дала мне это.", en: "My grandmother gave me this.", k: "s" },
    { fi: "Tämä viini on hyvää.", ru: "Это вино вкусное.", en: "This wine is good.", k: "s" },
    { fi: "Tämä on kaunein paikka Suomessa.", ru: "Это самое красивое место в Финляндии.", en: "This is the most beautiful place in Finland.", k: "s" },
    { fi: "Voi, tämä ei ole hyvää.", ru: "Ой, это невкусно.", en: "Oh, this is not good.", k: "s" },
    { fi: "Haluan tämän kirjan, kiitos.", ru: "Я хочу эту книгу, пожалуйста.", en: "I want this book, please.", k: "s" },
    { fi: "Tuo juustopala ei ole sinun.", ru: "Тот кусок сыра не твой.", en: "That piece of cheese is not yours.", k: "s" },
    { fi: "Haluan tuon paidan, kiitos.", ru: "Я хочу ту рубашку, пожалуйста.", en: "I want that shirt, please.", k: "s" },
    { fi: "Mikä on tämän paikan nimi?", ru: "Как называется это место?", en: "What is this place's name?", k: "s" },
    { fi: "Kuka sinä olet?", ru: "Кто ты?", en: "Who are you?", k: "s" },
    { fi: "Kuka minä olen?", ru: "Кто я?", en: "Who am I?", k: "s" },
    { fi: "Kuka hän on?", ru: "Кто она?", en: "Who is she?", k: "s" },
    { fi: "Mikä se on?", ru: "Что это?", en: "What is it?", k: "s" },
    { fi: "Se on salaisuus.", ru: "Это секрет.", en: "It's a secret.", k: "s" },
    { fi: "Tämä on punainen.", ru: "Это красное.", en: "This is red.", k: "s" },
    { fi: "Tuo on liian suuri.", ru: "Тот слишком большой.", en: "That one is too big.", k: "s" }
  ]
},
{
  id: "AB_S1_04",
  title: "Партитив: «немного чего-то»",
  source: "FinnishPod101 · Absolute Beginner S1 #4",
  glossary: [
    { w: "partitiivi", ru: "партитив: -a/-ä, -ta/-tä, -tta/-ttä", en: "partitive case",
      forms: ["suolaa", "sokeria", "teetä", "lasia", "minua", "lautasta", "häntä", "mitä", "tervettä", "maitoa", "omenaa", "muovia", "apua", "hyvää", "emmiä"],
      note: "Основное значение — «часть чего-то», по-русски часто «немного»: Tarvitsen sokeria («Мне нужно немного сахара»), Anna Jussille maitoa.\nКакое окончание выбрать. Сначала гармония гласных, потом одно из трёх правил:\n1) основа кончается на один гласный → -a/-ä: lasi → lasia, suola → suolaa, minä → minua;\n2) основа кончается на два гласных или на согласный → -ta/-tä; сюда же почти все местоимения кроме minä и sinä: tee → teetä, lautanen (основа lautas-) → lautasta, hän → häntä, mikä → mitä;\n3) многие слова на -e берут -tta/-ttä: terve → tervettä. Правило нестрогое, эти слова придётся запоминать.\nГде ещё нужен партитив: материал, из которого сделана вещь (Se on sokeria, Tämä lautanen on muovia); объект при глаголах вроде kehua («хвалить») и kiittää («благодарить») — Hän kehuu minua, Jussi kiittää Emmiä; и оценка, какое что-то на вкус или на качество — Tee on hyvää." },
    { w: "vokaaliharmonia", ru: "гармония гласных", en: "vowel harmony",
      forms: ["suolaa", "sokeria", "teetä", "häntä", "-han", "-hän"],
      note: "Гласные делятся на задние (a, o, u) и передние (e, i, y, ä, ö). Если в слове есть хоть один задний гласный, окончание берёт a; если только передние — ä. Suola → suolaa, но tee → teetä.\nЭто касается вообще всех окончаний в финском, не только партитива, так что правило стоит усвоить сразу." },
    { w: "vielä", ru: "ещё; пока не; даже; ещё немного", en: "still, yet, even, more",
      forms: ["vielä"],
      note: "Слово с широким разбросом значений, всё решает контекст:\nTee on vielä kuumaa — «чай ещё горячий»;\nTee ei ole vielä valmista — «чай ещё не готов»;\nPidän teestä vielä enemmän — «чай мне нравится даже больше»;\nOttaisin vielä teetä — «я бы взял ещё чая»." },
    { w: "tässä", ru: "здесь, тут", en: "here",
      forms: ["tässä"],
      note: "Целый ряд финских слов — это бывшие существительные и местоимения, застывшие в одной падежной форме и ставшие наречиями. Tässä как раз такое: оно образовано от tämä («этот») и буквально значит «в этом (месте)»." },
    { w: "tarvita", ru: "нуждаться, требоваться", en: "to need", forms: ["tarvita", "tarvitsen", "tarvitset"] },
    { w: "entä", ru: "а как насчёт", en: "how about", forms: ["entä"] },
    { w: "sokeri", ru: "сахар", en: "sugar", forms: ["sokeri", "sokeria", "sokeritasoni"] },
    { w: "suola", ru: "соль", en: "salt", forms: ["suola", "suolaa"] },
    { w: "tee", ru: "чай", en: "tea", forms: ["tee", "teetä", "teestä"] }
  ],
  items: [
    { fi: "Mitä tämä on?", ru: "Что это?", en: "What's this?", k: "d", who: "Helen" },
    { fi: "Se on suolaa.", ru: "Это соль.", en: "It's salt.", k: "d", who: "Emmi" },
    { fi: "Entä tämä?", ru: "А это?", en: "How about this?", k: "d", who: "Helen" },
    { fi: "Se on sokeria.", ru: "Это сахар.", en: "It's sugar.", k: "d", who: "Emmi" },
    { fi: "Hyvä. Nyt tarvitsen vielä teetä.", ru: "Хорошо. Теперь мне нужен ещё чай.", en: "Good. Now I still need some tea.", k: "d", who: "Helen" },
    { fi: "Sitä on tässä.", ru: "Он здесь.", en: "There's tea in here.", k: "d", who: "Emmi" },
    { fi: "Kiitos.", ru: "Спасибо.", en: "Thank you.", k: "d", who: "Helen" },
    { fi: "sokeri", ru: "сахар", en: "sugar", k: "w" },
    { fi: "entä", ru: "а как насчёт", en: "how about", k: "w" },
    { fi: "tarvita", ru: "нуждаться", en: "to need", k: "w" },
    { fi: "tässä", ru: "здесь", en: "here", k: "w" },
    { fi: "vielä", ru: "ещё", en: "still", k: "w" },
    { fi: "kiitos", ru: "спасибо", en: "thank you", k: "w" },
    { fi: "nyt", ru: "сейчас", en: "now", k: "w" },
    { fi: "tee", ru: "чай", en: "tea", k: "w" },
    { fi: "suola", ru: "соль", en: "salt", k: "w" },
    { fi: "kahvi", ru: "кофе", en: "coffee", k: "w" },
    { fi: "Sokeritasoni on alhainen!", ru: "У меня низкий сахар!", en: "My sugar levels are low!", k: "s" },
    { fi: "Laitatko kahviisi sokeria?", ru: "Ты кладёшь сахар в кофе?", en: "Do you put sugar in your coffee?", k: "s" },
    { fi: "Sokeri on epäterveellistä.", ru: "Сахар вреден.", en: "Sugar is unhealthy.", k: "s" },
    { fi: "Entä tämä?", ru: "А это?", en: "How about this one?", k: "s" },
    { fi: "Tarvitsen vähän apua.", ru: "Мне нужна небольшая помощь.", en: "I need some help.", k: "s" },
    { fi: "Tässä on pubi, mennään sisään!", ru: "Вот паб, зайдём!", en: "Here's a pub, let's go in!", k: "s" },
    { fi: "Vielä kerran, pojat!", ru: "Ещё раз, ребята!", en: "One more time, boys!", k: "s" },
    { fi: "Kiitos hyvää.", ru: "Спасибо, хорошо.", en: "I'm fine. Thanks.", k: "s" },
    { fi: "Kiitos avustasi.", ru: "Спасибо за помощь.", en: "Thank you for your help.", k: "s" },
    { fi: "Saisinko suolaa?", ru: "Можно мне соли?", en: "May I have some salt, please?", k: "s" },
    { fi: "Tee on vielä kuumaa.", ru: "Чай ещё горячий.", en: "The tea is still hot.", k: "s" },
    { fi: "Tee ei ole vielä valmista.", ru: "Чай ещё не готов.", en: "The tea is not yet ready.", k: "s" },
    { fi: "Pidän teestä vielä enemmän.", ru: "Чай мне нравится даже больше.", en: "I like tea even more.", k: "s" },
    { fi: "Ottaisin vielä teetä.", ru: "Я бы взял ещё чая.", en: "I would like some more tea.", k: "s" },
    { fi: "Tarvitsen sokeria.", ru: "Мне нужно немного сахара.", en: "I need some sugar.", k: "s" },
    { fi: "Anna Jussille maitoa.", ru: "Дай Юсси молока.", en: "Give Jussi some milk.", k: "s" },
    { fi: "Lumikki puraisi omenaa.", ru: "Белоснежка откусила яблоко.", en: "Snow White took a bite of the apple.", k: "s" },
    { fi: "Tämä lautanen on muovia.", ru: "Эта тарелка пластиковая.", en: "This plate is made of plastic.", k: "s" },
    { fi: "Hän kehuu minua.", ru: "Он меня хвалит.", en: "He praises me.", k: "s" },
    { fi: "Jussi kiittää Emmiä.", ru: "Юсси благодарит Эмми.", en: "Jussi thanks Emmi.", k: "s" },
    { fi: "Tee on hyvää.", ru: "Чай вкусный.", en: "Tea is delicious.", k: "s" }
  ]
},
{
  id: "AB_S1_05",
  title: "Как дела",
  source: "FinnishPod101 · Absolute Beginner S1 #5",
  glossary: [
    { w: "mitä kuuluu", ru: "«как дела» и ответы на него", en: "how are you",
      forms: ["kuuluu", "hyvää", "tässähän", "siinähän", "mikäs"],
      note: "Буквально «что слышно», а по смыслу «как дела» — самый частый вопрос о самочувствии.\nОтветы:\n• Kiitos hyvää — «спасибо, хорошо». Стандартный ответ. Hyvää стоит в партитиве, как и mitä в вопросе. Можно усилить: Kiitos oikein hyvää.\n• Tässähän tämä (menee) — «да ничего». Буквально «вот так вот тут и идёт». Годится и когда всё скучно-обычно, и когда всё плохо, и когда прекрасно, но рассказывать не хочется. Решает интонация, а не слова.\n• Siinähän se (menee) — то же самое, только tässä заменено на siinä, а tämä на se.\n• Mikäs tässä — ещё один уклончивый ответ, сокращение от Mikäs tässä ollessa, примерно «да нормально, держусь»." },
    { w: "miten menee", ru: "«как идёт» и ответы", en: "how is it going",
      forms: ["miten", "menee", "hyvin", "loistavasti", "koulussa", "töissä", "kotona"],
      note: "Второй ходовой вопрос. В середину можно вставить область жизни: Miten koulussa menee?, Miten töissä menee?, Miten kotona menee?\nОтветы: Kiitos hyvin, Ihan hyvin, Loistavasti! («блестяще», услышите редко), а также любые уклончивые из предыдущей записи.\nВажная тонкость: на Mitä kuuluu? отвечают hyvää, а на Miten menee? — hyvin. Разница в том, что miten — наречие, значит и в ответе нужно наречие. Ihan hyvin при этом не лучше, чем просто hyvin: это скорее «нормально», чем «отлично».\nЕсть и совсем разговорный вариант вопроса: Kuis hurisee? — буквально «как жужжит». Среди друзей хорошо, в официальной обстановке не стоит.\nОтветив, вежливо спросить в ответ: Entä itsellesi? — «А у тебя как?»" },
    { w: "-han/-hän", ru: "частица усиления и смягчения", en: "emphasis particle",
      forms: ["-han", "-hän", "tässähän", "siinähän", "jussihan", "tämähän", "sehän"],
      note: "Ещё одна энклитика: приклеивается к концу слова и добавляет оттенок удивления, очевидности или мягкого нажима. Подчиняется гармонии гласных: -han после слов с a, o, u, и -hän после слов только с e, i, y, ä, ö.\nJussihan on tänään iloinen — «Юсси-то сегодня радостный». Tämähän on hyvää! — «Да это же вкусно!»" },
    { w: "kuulua", ru: "быть слышным, доноситься", en: "to be heard",
      forms: ["kuulua", "kuuluu", "kuulla", "kuulee"],
      note: "Родственно глаголу kuulla («слышать»), но подлежащее у них разное. У kuulla подлежащее — тот, кто слышит: Kalle kuulee jyrinää («Калле слышит грохот»). У kuulua подлежащее — сам звук, а кто его слышит, обычно вообще не упоминается: Kuuluu jyrinää («Слышится грохот»)." },
    { w: "itse", ru: "сам", en: "self", forms: ["itse", "itsellesi"] },
    { w: "ihan", ru: "совсем, вполне", en: "quite, totally", forms: ["ihan"] },
    { w: "hyvin", ru: "хорошо (наречие)", en: "well", forms: ["hyvin"] },
    { w: "koulu", ru: "школа", en: "school", forms: ["koulu", "koulussa", "kouluun"] }
  ],
  items: [
    { fi: "Mitä kuuluu?", ru: "Как дела?", en: "How are you?", k: "d", who: "Liisa" },
    { fi: "Kiitos hyvää. Entä itsellesi?", ru: "Спасибо, хорошо. А у тебя?", en: "I'm fine, thanks. And you?", k: "d", who: "Helen" },
    { fi: "Tässähän tämä menee. Miten koulussa menee?", ru: "Да потихоньку. Как дела в школе?", en: "It's going OK. How's it going at school?", k: "d", who: "Liisa" },
    { fi: "Ihan hyvin.", ru: "Вполне неплохо.", en: "It's going well.", k: "d", who: "Helen" },
    { fi: "ihan", ru: "совсем, вполне", en: "quite", k: "w" },
    { fi: "hyvin", ru: "хорошо", en: "well", k: "w" },
    { fi: "itse", ru: "сам", en: "self", k: "w" },
    { fi: "koulu", ru: "школа", en: "school", k: "w" },
    { fi: "mennä", ru: "идти", en: "to go", k: "w" },
    { fi: "miten", ru: "как", en: "how", k: "w" },
    { fi: "kuulua", ru: "быть слышным", en: "to be heard", k: "w" },
    { fi: "loistavasti", ru: "блестяще", en: "brilliantly", k: "w" },
    { fi: "Kaikki on ihan hyvin.", ru: "Всё вполне хорошо.", en: "Everything is just fine.", k: "s" },
    { fi: "Tunnen hänet hyvin.", ru: "Я хорошо его знаю.", en: "I know him well.", k: "s" },
    { fi: "Tämähän on hyvää!", ru: "Да это же вкусно!", en: "I say, this tastes great!", k: "s" },
    { fi: "Teetkö sen itse?", ru: "Ты сделаешь это сам?", en: "Will you do it yourself?", k: "s" },
    { fi: "Menin eläinsairaalaan.", ru: "Я пошёл в ветклинику.", en: "I went to the animal hospital.", k: "s" },
    { fi: "Kuka menee rannalle ensi viikonloppuna?", ru: "Кто идёт на пляж в следующие выходные?", en: "Who is going to the beach next weekend?", k: "s" },
    { fi: "Menkää toiselle puolelle katua, kiitos.", ru: "Перейдите на другую сторону улицы, пожалуйста.", en: "Please go to the other side of the road.", k: "s" },
    { fi: "Menen sinne kello kahdeksan.", ru: "Я пойду туда в восемь часов.", en: "I will go there at 8 o'clock.", k: "s" },
    { fi: "Mitä kuuluu, Matti?", ru: "Как дела, Матти?", en: "How are you, Matti?", k: "s" },
    { fi: "Kiitos oikein hyvää.", ru: "Спасибо, очень хорошо.", en: "I'm very well, thank you.", k: "s" },
    { fi: "Tässähän tämä.", ru: "Да ничего.", en: "It's ok.", k: "s" },
    { fi: "Siinähän se menee.", ru: "Да потихоньку.", en: "It's going ok.", k: "s" },
    { fi: "Mikäs tässä.", ru: "Да нормально, держусь.", en: "It's ok.", k: "s" },
    { fi: "Miten menee?", ru: "Как идут дела?", en: "How is it going?", k: "s" },
    { fi: "Miten töissä menee?", ru: "Как дела на работе?", en: "How is it going at work?", k: "s" },
    { fi: "Miten kotona menee?", ru: "Как дела дома?", en: "How is it going at home?", k: "s" },
    { fi: "Kiitos hyvin.", ru: "Спасибо, хорошо.", en: "It's going well, thank you.", k: "s" },
    { fi: "Loistavasti!", ru: "Блестяще!", en: "Brilliantly!", k: "s" },
    { fi: "Kuis hurisee?", ru: "Как жизнь? (разговорное)", en: "What's cookin'?", k: "s" },
    { fi: "Entä itsellesi?", ru: "А у тебя как?", en: "How about you?", k: "s" },
    { fi: "Jussihan on tänään iloinen.", ru: "Юсси-то сегодня радостный.", en: "I say, Jussi is quite happy today.", k: "s" },
    { fi: "Kalle kuulee jyrinää.", ru: "Калле слышит грохот.", en: "Kalle hears a rumble.", k: "s" },
    { fi: "Kuuluu jyrinää.", ru: "Слышится грохот.", en: "A rumble is heard.", k: "s" }
  ]
},
];

const LESSONS_BE = [
{
  id: "BE_S1_06",
  title: "Звонок: как дела у всех",
  source: "FinnishPod101 · Beginner S1 #6",
  glossary: [
    { w: "mitä kuuluu", ru: "как дела: кому — в аллативе", en: "how are you",
      forms: ["kuuluu", "sinulle", "sulle", "teille", "minulle", "meille", "kaikille"],
      note: "Буквально «что слышно», то есть «что у тебя происходит». Тот, о ком спрашивают, ставится в аллатив (-lle): Mitä sinulle kuuluu?, Mitä teille kaikille kuuluu? В разговорной речи sinulle сокращается до sulle.\nОтвечают той же конструкцией: Minulle kuuluu hyvää, kiitos или Meille kaikille kuuluu ihan hyvää. Короткий вариант — Kiitos hyvää. Вежливо добавить Kiitos kysymästä («спасибо, что спросил»).\nВажно: этот вопрос задают тем, кого давно не видели или хотя бы знают. Незнакомому человеку при первой встрече так не говорят, и каждый день коллеге тоже." },
    { w: "miten voit", ru: "как ты себя чувствуешь", en: "how are you doing",
      forms: ["voit", "voi", "voida", "voiko"],
      note: "Тот же смысл, но через глагол voida — здесь он значит не «мочь», а «чувствовать себя». Особенно уместен, если человек болел или был травмирован: Kuulin että olit sairaana. Miten voit nyt? Про третьих лиц: Miten äitisi voi?, Voiko perheesi hyvin?\nСамый разговорный из трёх вариантов — Miten menee (урок 5 первого уровня)." },
    { w: "pitkästä aikaa", ru: "давно не виделись", en: "long time no see",
      forms: ["pitkästä", "aikaa"],
      note: "Из pitkä («долгий») и aika («время»), буквально «спустя долгое время». Годится не только про встречу с человеком, но и про любое дело, которого давно не делали: Menin pitkästä aikaa uimaan («Сходил поплавать первый раз за долгое время»). Место в предложении свободное." },
    { w: "soittaa", ru: "звонить; играть (на инструменте)", en: "to call; to play",
      forms: ["soittaa", "soitan", "soitatko", "soitanpa", "soittakaa"],
      note: "Два значения сразу: звонить по телефону и играть на музыкальном инструменте. Куда или кому звонят — в иллатив или аллатив: soittaa postitoimistoon, soittaa äidille." },
    { w: "yllätys", ru: "сюрприз, неожиданность", en: "surprise", forms: ["yllätys", "yllätyksen"] },
    { w: "yhdessä", ru: "вместе", en: "together", forms: ["yhdessä"] },
    { w: "haloo", ru: "алло", en: "hello (on the phone)", forms: ["haloo"] },
    { w: "mökki", ru: "дача, домик", en: "summer house", forms: ["mökki", "mökille", "kesämökki"] }
  ],
  items: [
    { fi: "Haloo. Heikki.", ru: "Алло. Хейкки.", en: "Hello. Heikki.", k: "d", who: "Heikki" },
    { fi: "Moi Heikki! Linnea täällä!", ru: "Привет, Хейкки! Это Линнеа!", en: "Hi, Heikki! Linnea here!", k: "d", who: "Linnea" },
    { fi: "Linnea! Mikä yllätys! Soitatko Amerikasta?", ru: "Линнеа! Какой сюрприз! Ты звонишь из Америки?", en: "Linnea! What a surprise! Are you calling from America?", k: "d", who: "Heikki" },
    { fi: "Soitanpa hyvinkin. Mitä sulle, ja teille kaikille kuuluu?", ru: "Именно что оттуда. Как ты и как вы все?", en: "I sure am. How are you, and the rest of the family?", k: "d", who: "Linnea" },
    { fi: "Meille kaikille kuuluu ihan hyvää.", ru: "У нас у всех всё вполне хорошо.", en: "We are all just fine.", k: "d", who: "Heikki" },
    { fi: "Oltiin juuri Ainon kanssa lomalla Helsingissä. Mutta miten sinä voit, ja Steven?", ru: "Мы с Айно только что были в отпуске в Хельсинки. А как ты и Стивен?", en: "Aino and I just had a holiday in Helsinki. But how are you, and Steven?", k: "d", who: "Heikki" },
    { fi: "Ihan hyvin, joskin Steven on aika väsynyt, koska hänellä on ollut niin paljon töitä.", ru: "Вполне хорошо, хотя Стивен довольно устал: у него было очень много работы.", en: "We're fine too, though Steven is pretty tired since he's had so much work.", k: "d", who: "Linnea" },
    { fi: "Mutta pian meilläkin alkaa loma! Ajattelimme tulla käymään Suomessa!", ru: "Но скоро и у нас отпуск! Мы подумывали приехать в Финляндию!", en: "But soon we'll also have our holidays! We were thinking of visiting Finland!", k: "d", who: "Linnea" },
    { fi: "No se on mahtavaa! Mennään sitten mökille yhdessä.", ru: "Это же отлично! Тогда поедем вместе на дачу.", en: "Well that's fantastic! Let's all go to the summer house together then.", k: "d", who: "Heikki" },
    { fi: "Ehdottomasti!", ru: "Обязательно!", en: "Absolutely!", k: "d", who: "Linnea" },
    { fi: "haloo", ru: "алло", en: "hello", k: "w" },
    { fi: "yllätys", ru: "сюрприз", en: "surprise", k: "w" },
    { fi: "soittaa", ru: "звонить; играть", en: "to call; to play", k: "w" },
    { fi: "yhdessä", ru: "вместе", en: "together", k: "w" },
    { fi: "pitkästä aikaa", ru: "давно не виделись", en: "long time no see", k: "w" },
    { fi: "kesämökki", ru: "дача", en: "summer house", k: "w" },
    { fi: "ehdottomasti", ru: "обязательно, безусловно", en: "absolutely", k: "w" },
    { fi: "mahtava", ru: "отличный, потрясающий", en: "fantastic", k: "w" },
    { fi: "Haloo, kuuletko minua?", ru: "Алло, ты меня слышишь?", en: "Hello, can you hear me?", k: "s" },
    { fi: "Voisitko korjata sen minulle?", ru: "Ты не мог бы починить это мне?", en: "Could you repair it for me?", k: "s" },
    { fi: "Voinko katsoa tätä kuvaa?", ru: "Можно посмотреть эту картинку?", en: "Can I look at this picture?", k: "s" },
    { fi: "Haluan viettää joulun yhdessä.", ru: "Я хочу провести Рождество вместе.", en: "I want to spend Christmas together.", k: "s" },
    { fi: "Meidän pitäisi mennä juhliin yhdessä.", ru: "Нам стоило бы пойти на праздник вместе.", en: "We should go to the party together.", k: "s" },
    { fi: "Mennään kotiin yhdessä.", ru: "Пойдём домой вместе.", en: "Let's go home together.", k: "s" },
    { fi: "Moi, minä täällä!", ru: "Привет, это я!", en: "Hi, it's me!", k: "s" },
    { fi: "Yllätys, järjestin sinulle juhlat!", ru: "Сюрприз, я устроил тебе праздник!", en: "Surprise, I arranged a party for you!", k: "s" },
    { fi: "Kuinka kallista on soittaa Italiasta Espanjaan?", ru: "Сколько стоит звонить из Италии в Испанию?", en: "How expensive is calling from Italy to Spain?", k: "s" },
    { fi: "Soitan sinulle myöhemmin, kun olen tehnyt kotitehtäväni.", ru: "Я позвоню тебе позже, когда сделаю домашку.", en: "I will call you later, after I'm done with my homework.", k: "s" },
    { fi: "Minun täytyy soittaa äidille.", ru: "Мне надо позвонить маме.", en: "I must call my mother.", k: "s" },
    { fi: "Soittakaa ambulanssi!", ru: "Вызовите скорую!", en: "Call an ambulance!", k: "s" },
    { fi: "Hei, pitkästä aikaa, mitä kuuluu?", ru: "Привет, давно не виделись, как дела?", en: "Hello, long time no see, how are you?", k: "s" },
    { fi: "Kuulin että olit sairaana. Miten voit nyt?", ru: "Я слышал, ты болел. Как ты сейчас?", en: "I heard you were ill. How are you now?", k: "s" },
    { fi: "Hei, mitä sinulle kuuluu?", ru: "Привет, как у тебя дела?", en: "Hi, how are you?", k: "s" },
    { fi: "Miten äitisi voi?", ru: "Как твоя мама?", en: "How is your mother?", k: "s" },
    { fi: "Voiko perheesi hyvin?", ru: "У твоей семьи всё хорошо?", en: "Is your family well?", k: "s" },
    { fi: "Minulle kuuluu hyvää, kiitos.", ru: "У меня всё хорошо, спасибо.", en: "I'm fine thank you.", k: "s" },
    { fi: "Kiitos kysymästä.", ru: "Спасибо, что спросил.", en: "Thanks for asking.", k: "s" }
  ]
},
{
  id: "BE_S1_07",
  title: "Запись в университет",
  source: "FinnishPod101 · Beginner S1 #7",
  glossary: [
    { w: "translatiivi", ru: "транслатив: в каком качестве становятся, -ksi", en: "translative case",
      forms: ["uudeksi", "opiskelijaksi", "valmiiksi", "punaiseksi"],
      note: "Окончание -ksi отвечает на вопрос «кем, чем становится» или «во что превращается»: ilmoittautua uudeksi opiskelijaksi («записаться в качестве нового студента»). Сравните с эссивом из урока 15, который описывает уже имеющееся состояние: opettajana («работая учителем»), а opettajaksi — «(стать) учителем»." },
    { w: "onko tämä", ru: "«это ли ...?» — уточнить, куда попал", en: "is this ...?",
      forms: ["onko", "tämä"],
      note: "Простая и очень полезная схема: onko + tämä + существительное. Onko tämä opintotoimisto?, Onko tämä kirjasto?, Onko tämä musiikkiopisto? Подставляется любое место, и получается вопрос «это вот то самое?»" },
    { w: "pitäisi", ru: "надо бы: кто — в генитиве", en: "should",
      forms: ["pitäisi", "minun", "hänen", "heidän"],
      note: "Схема: личное местоимение в генитиве + pitäisi + глагол в инфинитиве. Minun pitäisi ilmoittautua, Hänen pitäisi siivota keittiö, Heidän pitäisi nukkua. Сам pitäisi по лицам не меняется — это кондиционал (урок 21), и он же делает просьбу мягче." },
    { w: "opintotoimisto", ru: "учебный отдел, деканат", en: "student affairs office",
      forms: ["opintotoimisto", "opintotoimistoa", "opinnot", "toimisto"],
      note: "Из opinto (от opinnot, «учёба») и toimisto («офис»), буквально «контора по учёбе». Так называют учебную часть в университете или похожем заведении." },
    { w: "henkilöllisyystodistus", ru: "удостоверение личности", en: "identification",
      forms: ["henkilöllisyystodistus", "henkilöllisyystodistukseni", "henkkari"],
      note: "Длинное слово из henkilöllisyys («личность») и todistus («свидетельство, подтверждение»). В официальных ситуациях говорят так, а между собой — коротко henkkari." },
    { w: "opiskelusanasto", ru: "слова про учёбу", en: "study vocabulary",
      forms: ["yliopisto", "ammattikorkeakoulu", "lukio", "ammattikoulu", "luento", "kurssi", "koe", "muistiinpanot", "aikataulu", "syysloma", "joululoma", "talviloma", "pääsiäisloma", "kesäloma", "ryhmätyö", "presentaatio", "lukukausi", "lukuvuosi", "ylioppilastutkinto", "opiskelija-alennus"],
      note: "yliopisto («университет»), ammattikorkeakoulu («прикладной университет»), lukio («старшая школа»), ammattikoulu («профучилище»), luento («лекция»), kurssi («курс»), koe («экзамен»), muistiinpanot («конспект»), aikataulu («расписание»), lukukausi («семестр»), lukuvuosi («учебный год»), ryhmätyö («групповая работа»), presentaatio («презентация»). Каникулы: syysloma, joululoma, talviloma, pääsiäisloma, kesäloma.\nУчёба в Финляндии бесплатная от начальной школы до университета, а школьников ещё и кормят обедом. Обязательная школа длится девять лет, потом выбирают lukio или ammattikoulu." },
    { w: "ilmoittautua", ru: "записаться, зарегистрироваться", en: "to register", forms: ["ilmoittautua", "ilmoittauduin", "ilmoittautukaa"] },
    { w: "ylioppilaskunta", ru: "студенческий союз", en: "student union", forms: ["ylioppilaskunta", "ylioppilaskunnan"] },
    { w: "jäsenmaksu", ru: "членский взнос", en: "membership fee", forms: ["jäsenmaksu", "jäsenmaksun"] },
    { w: "kuitti", ru: "чек, квитанция", en: "receipt", forms: ["kuitti", "kuitin", "kuitteja", "kuitista"] },
    { w: "muun muassa", ru: "в том числе, среди прочего", en: "among other things", forms: ["muun muassa"] }
  ],
  items: [
    { fi: "Hei! Onko tämä opintotoimisto?", ru: "Здравствуйте! Это учебный отдел?", en: "Hi! Is this the student affairs office?", k: "d", who: "Vilja" },
    { fi: "Kyllä vain, olet oikeassa paikassa.", ru: "Да-да, вы пришли по адресу.", en: "Oh yes, you're in the right place.", k: "d", who: "Virkailija" },
    { fi: "Minun pitäisi ilmoittautua uudeksi opiskelijaksi.", ru: "Мне надо записаться как новому студенту.", en: "I need to register as a new student.", k: "d", who: "Vilja" },
    { fi: "Onko sinulla henkilöllisyystodistus ja hyväksymiskirje mukana?", ru: "У вас с собой удостоверение личности и письмо о зачислении?", en: "Do you have your ID and letter of acceptance with you?", k: "d", who: "Virkailija" },
    { fi: "Kyllä on, kas tässä.", ru: "Да, вот они.", en: "Yes I do, here you go.", k: "d", who: "Vilja" },
    { fi: "Opiskelijakortin saat sitten, kun olet maksanut ylioppilaskunnan jäsenmaksun ja tuonut kuitin maksusta tänne.", ru: "Студенческий получите, когда оплатите членский взнос студсоюза и принесёте сюда чек.", en: "You'll get a student ID after you've paid the student union membership fee and brought the receipt here.", k: "d", who: "Virkailija" },
    { fi: "Sillä saat alennusta muun muassa bussi- ja junalipuista.", ru: "По нему будет скидка, в том числе на автобусные и поездные билеты.", en: "You can get discounts on bus and train tickets among other things with your card.", k: "d", who: "Virkailija" },
    { fi: "Hienoa!", ru: "Отлично!", en: "Great!", k: "d", who: "Vilja" },
    { fi: "opintotoimisto", ru: "учебный отдел", en: "student affairs office", k: "w" },
    { fi: "ylioppilaskunta", ru: "студенческий союз", en: "student union", k: "w" },
    { fi: "jäsenmaksu", ru: "членский взнос", en: "membership fee", k: "w" },
    { fi: "opiskelijakortti", ru: "студенческий билет", en: "student card", k: "w" },
    { fi: "hyväksymiskirje", ru: "письмо о зачислении", en: "letter of acceptance", k: "w" },
    { fi: "kuitti", ru: "чек", en: "receipt", k: "w" },
    { fi: "muun muassa", ru: "в том числе", en: "among other things", k: "w" },
    { fi: "ilmoittautua", ru: "записаться", en: "to register", k: "w" },
    { fi: "opiskelija", ru: "студент", en: "student", k: "w" },
    { fi: "henkilöllisyystodistus", ru: "удостоверение личности", en: "identification", k: "w" },
    { fi: "yliopisto", ru: "университет", en: "university", k: "w" },
    { fi: "luento", ru: "лекция", en: "lecture", k: "w" },
    { fi: "kurssi", ru: "курс", en: "course", k: "w" },
    { fi: "koe", ru: "экзамен", en: "exam", k: "w" },
    { fi: "aikataulu", ru: "расписание", en: "schedule", k: "w" },
    { fi: "lukuvuosi", ru: "учебный год", en: "academic year", k: "w" },
    { fi: "En löydä opintotoimistoa.", ru: "Я не могу найти учебный отдел.", en: "I can't find the student affairs office.", k: "s" },
    { fi: "Opintotoimisto ei ole auki joka päivä.", ru: "Учебный отдел открыт не каждый день.", en: "The student affairs office is not open every day.", k: "s" },
    { fi: "Yliopistoni ylioppilaskunta on erittäin toimelias.", ru: "Студсоюз моего университета очень активный.", en: "The student union in my university is very active.", k: "s" },
    { fi: "Jäsenmaksu on tänä vuonna melko kallis.", ru: "Взнос в этом году довольно дорогой.", en: "The membership fee is quite expensive this year.", k: "s" },
    { fi: "Tarvitsen uuden lukuvuositarran opiskelijakorttiini.", ru: "Мне нужна новая наклейка учебного года на студенческий.", en: "I need a new academic year sticker on my student card.", k: "s" },
    { fi: "Olen odottanut yliopiston hyväksymiskirjettä jo pitkään.", ru: "Я уже давно жду письмо о зачислении из университета.", en: "I've been waiting for the university acceptance letter for a long time.", k: "s" },
    { fi: "Ostoksista täytyy aina antaa kuitti.", ru: "За покупки всегда должны давать чек.", en: "You must always give a receipt of purchase.", k: "s" },
    { fi: "Lompakkoni on täynnä kuitteja!", ru: "Мой кошелёк полон чеков!", en: "My wallet is full of receipts!", k: "s" },
    { fi: "Pidän muun muassa lukemisesta ja neulomisesta.", ru: "Мне нравится, в том числе, чтение и вязание.", en: "I like reading and knitting, among other things.", k: "s" },
    { fi: "Missä voin ilmoittautua jooga-tunneille?", ru: "Где можно записаться на йогу?", en: "Where can I register for the yoga class?", k: "s" },
    { fi: "Ilmoittauduin tänään laulutunneille.", ru: "Я сегодня записался на уроки вокала.", en: "I registered for singing lessons today.", k: "s" },
    { fi: "Hän opiskelee kovasti koska hän on opiskelija.", ru: "Он усердно учится, потому что он студент.", en: "He studies hard because he is a student.", k: "s" },
    { fi: "Passi on ainoa henkilöllisyystodistukseni.", ru: "Паспорт — мой единственный документ.", en: "My passport is my only identification.", k: "s" },
    { fi: "Minun täytyy hankkia uusi henkilöllisyystodistus.", ru: "Мне надо получить новое удостоверение.", en: "I need to get a new ID.", k: "s" },
    { fi: "Hänen pitäisi siivota keittiö.", ru: "Ему надо бы убрать кухню.", en: "He should clean the kitchen.", k: "s" },
    { fi: "Minun pitäisi maalata tänään.", ru: "Мне надо бы сегодня покрасить.", en: "I should paint today.", k: "s" },
    { fi: "Heidän pitäisi nukkua.", ru: "Им надо бы поспать.", en: "They should sleep.", k: "s" },
    { fi: "Onko tämä kirjasto?", ru: "Это библиотека?", en: "Is this the library?", k: "s" },
    { fi: "Missä on opintotoimisto?", ru: "Где учебный отдел?", en: "Where is the student affairs office?", k: "s" },
    { fi: "Täytänkö tämän lomakkeen?", ru: "Мне заполнить эту анкету?", en: "Shall I fill out this form?", k: "s" },
    { fi: "Mitä minun täytyy maksaa?", ru: "Что мне надо оплатить?", en: "What do I need to pay?", k: "s" }
  ]
},
{
  id: "BE_S1_08",
  title: "В ресторане: вкусы и заказ",
  source: "FinnishPod101 · Beginner S1 #8",
  glossary: [
    { w: "pitää ja rakastaa", ru: "нравится — элатив, люблю — партитив", en: "to like and to love",
      forms: ["pidän", "pidät", "pitää", "pidä", "rakastan", "rakastaa", "vihaan", "vihata", "kakusta", "kissoista", "kissoja", "mansikoista", "katkaravuista", "porosta", "ruisleivästä"],
      note: "Две конструкции, и падеж у них разный.\nPitää («нравиться») требует элатива (-sta/-stä): Minä pidän kakusta, Minä pidän kissoista, Saara pitää ruisleivästä.\nRakastaa («любить») требует партитива: Minä rakastan kissoja, Hän rakastaa sienipiirakkaa.\nОтрицание строится обычным способом: Minä en pidä kakusta, Hän ei pidä kalakeitosta. А если хочется сказать резче, есть vihata («ненавидеть») — тоже с партитивом: Minä vihaan vaniljajäätelöä." },
    { w: "tilaaminen", ru: "как сделать заказ", en: "placing an order",
      forms: ["tilaisin", "tilaan", "tilata", "ruokalista", "kahdelle", "kolmelle", "neljälle", "lohikeiton", "mustikkapiirakan", "silakkapihvit", "vettä", "olutta", "kahvia"],
      note: "Меню просят так: Saisinko ruokalistan, kiitos. Ruokalista — из ruoka («еда») и lista («список»).\nЗаказ начинают словом tilaisin («я бы заказал», кондиционал). Названия блюд при этом ставятся в генитив: lohikeitto → tilaisin lohikeiton, mustikkapiirakka → tilaisin mustikkapiirakan. Если название уже во множественном числе, его не трогают: tilaisin silakkapihvit.\nНапитки, наоборот, идут в партитив: vesi → vettä, olut → olutta, kahvi → kahvia. Количество людей — в аллативе: kahdelle («на двоих»), kolmelle, neljälle. И в конце обязательно kiitos.\nРазделы меню: alkupalat («закуски»), keitot ja salaatit («супы и салаты»), pääruoka («горячее»), jälkiruoka («десерт»)." },
    { w: "allerginen", ru: "аллергия: на что — в аллативе", en: "allergic to",
      forms: ["allerginen", "allergia", "porkkanalle", "pähkinöille", "kalalle", "mansikoille"],
      note: "То, на что аллергия, ставится в аллатив (-lle): Olen allerginen porkkanalle, Minä olen allerginen pähkinöille. Существительное — allergia. Частые: maitotuote-allergia, kala-allergia, pähkinä-allergia." },
    { w: "suomalaiset ruoat", ru: "финские блюда", en: "Finnish dishes",
      forms: ["graavilohi", "lohikeitto", "poronkäristys", "lihapullat", "mustikkapiirakka", "kalakukko", "silakkapihvit", "äyriäissalaatti"],
      note: "graavilohi — малосольный лосось в травах; lohikeitto — суп из лосося с картофелем и укропом; poronkäristys — тушёная оленина с картофельным пюре и брусничным вареньем; lihapullat — тефтели с пюре; mustikkapiirakka — черничный пирог; kalakukko — рыба, запечённая в ржаном тесте; silakkapihvit — котлетки из салаки." },
    { w: "lounaslista", ru: "обеденное меню", en: "lunch menu",
      forms: ["lounaslista", "ruokalista", "juomalista", "lista"],
      note: "Lounas («обед») + lista («список»). Первую часть можно менять: juomalista («карта напитков»), а ещё в ходу заимствование menu." },
    { w: "tarjoilija", ru: "официант, официантка", en: "waiter", forms: ["tarjoilija", "tarjoilijan"] },
    { w: "suositella", ru: "рекомендовать", en: "to recommend", forms: ["suositella", "suosittelen", "suositteli"] },
    { w: "ottaa", ru: "брать, взять", en: "to take", forms: ["ottaa", "otan", "otat", "otin"] }
  ],
  items: [
    { fi: "Tämä on kyllä kiva lounasravintola. Lounaslistakin näyttää hyvältä!", ru: "А это приятное место для обеда. И меню выглядит хорошо!", en: "This is a nice restaurant for lunch. The lunch menu looks good!", k: "d", who: "Aino" },
    { fi: "Mutta en osaa päättää, mitä tilaisin.", ru: "Но я не могу решить, что бы заказать.", en: "But I just can't decide what to order.", k: "d", who: "Aino" },
    { fi: "Lohikeitto on täällä hyvää, suosittelen sitä!", ru: "Суп из лосося тут вкусный, рекомендую!", en: "The salmon soup is nice here, I recommend that!", k: "d", who: "Jukka" },
    { fi: "Voi, mutta siinä on porkkanaa, ja minä olen porkkanalle allerginen. Otan äyriäissalaatin.", ru: "Ой, но там морковь, а у меня на неё аллергия. Возьму салат с морепродуктами.", en: "Oh, but it has carrot in it, and I'm allergic to carrot. I'll have the seafood salad.", k: "d", who: "Aino" },
    { fi: "Minä en oikein pidä katkaravuista. Mutta porosta minä pidän, joten tänään tilaan poronkäristystä.", ru: "Я не очень люблю креветки. А вот оленину люблю, так что сегодня закажу тушёную оленину.", en: "I don't really care for shrimp. But I do like reindeer, so today I'll order the sautéed reindeer.", k: "d", who: "Jukka" },
    { fi: "Hienoa, voimmekin sitten tilata!", ru: "Отлично, тогда можно и заказывать!", en: "Great, so we can place our order then!", k: "d", who: "Aino" },
    { fi: "Tarjoilija! Anteeksi, tilaisin äyriäissalaatin, poronkäristyksen, sekä kivennäisvettä kahdelle, kiitos.", ru: "Официант! Извините, я бы заказал салат с морепродуктами, тушёную оленину и минеральную воду на двоих, пожалуйста.", en: "Waitress! Excuse me, I would like to order a seafood salad, sautéed reindeer, and mineral water for two, please.", k: "d", who: "Jukka" },
    { fi: "lounasravintola", ru: "обеденный ресторан", en: "lunch restaurant", k: "w" },
    { fi: "pitää", ru: "нравиться", en: "to like", k: "w" },
    { fi: "tarjoilija", ru: "официант", en: "waiter", k: "w" },
    { fi: "ottaa", ru: "брать", en: "to take", k: "w" },
    { fi: "allerginen", ru: "аллергичный", en: "allergic", k: "w" },
    { fi: "äyriäissalaatti", ru: "салат с морепродуктами", en: "seafood salad", k: "w" },
    { fi: "poronkäristys", ru: "тушёная оленина", en: "sautéed reindeer", k: "w" },
    { fi: "lounaslista", ru: "обеденное меню", en: "lunch menu", k: "w" },
    { fi: "tilata", ru: "заказывать", en: "to order", k: "w" },
    { fi: "suositella", ru: "рекомендовать", en: "to recommend", k: "w" },
    { fi: "ruokalista", ru: "меню", en: "menu", k: "w" },
    { fi: "alkupalat", ru: "закуски", en: "appetizers", k: "w" },
    { fi: "pääruoka", ru: "горячее", en: "main course", k: "w" },
    { fi: "jälkiruoka", ru: "десерт", en: "dessert", k: "w" },
    { fi: "lohikeitto", ru: "суп из лосося", en: "salmon soup", k: "w" },
    { fi: "lihapullat", ru: "тефтели", en: "meatballs", k: "w" },
    { fi: "mustikkapiirakka", ru: "черничный пирог", en: "blueberry pie", k: "w" },
    { fi: "Kotini lähelle avattiin uusi lounasravintola.", ru: "Рядом с моим домом открыли новый обеденный ресторан.", en: "They opened a new lunch restaurant near my home.", k: "s" },
    { fi: "Minä pidän mansikoista.", ru: "Я люблю клубнику.", en: "I like strawberries.", k: "s" },
    { fi: "Pidätkö mustasta kahvista?", ru: "Ты любишь чёрный кофе?", en: "Do you like black coffee?", k: "s" },
    { fi: "Nuori tyttö todella pitää koiranpennuista.", ru: "Девочке очень нравятся щенки.", en: "The young girl really likes the puppies.", k: "s" },
    { fi: "Tarjoilija unohti tilaukseni.", ru: "Официант забыл мой заказ.", en: "The waiter forgot my order.", k: "s" },
    { fi: "Otan tämän mukaani.", ru: "Я возьму это с собой.", en: "I will take this with me.", k: "s" },
    { fi: "Minä olen allerginen pähkinöille.", ru: "У меня аллергия на орехи.", en: "I am allergic to nuts.", k: "s" },
    { fi: "Tämä äyriäissalaatti on herkullista.", ru: "Этот салат с морепродуктами восхитителен.", en: "This seafood salad is delicious.", k: "s" },
    { fi: "Poronkäristystä on helppo tehdä kotona.", ru: "Тушёную оленину легко приготовить дома.", en: "Sautéed reindeer is easy to make at home.", k: "s" },
    { fi: "Lounaslista on voimassa vain kello kahteen saakka.", ru: "Обеденное меню действует только до двух.", en: "The lunch menu is valid only until two o'clock.", k: "s" },
    { fi: "Voimmeko tilata verkossa?", ru: "Можно заказать онлайн?", en: "Can we order online?", k: "s" },
    { fi: "Tilasin sinullekin kahvin.", ru: "Я и тебе заказал кофе.", en: "I ordered a coffee for you too.", k: "s" },
    { fi: "Suosittelen tätä ravintolaa lämpimästi.", ru: "Горячо рекомендую этот ресторан.", en: "I warmly recommend this restaurant.", k: "s" },
    { fi: "Ystäväni suositteli minulle tätä kirjaa.", ru: "Друг посоветовал мне эту книгу.", en: "My friend recommended this book to me.", k: "s" },
    { fi: "Veljeni on erittäin allerginen kalalle.", ru: "У моего брата сильная аллергия на рыбу.", en: "My brother is extremely allergic to fish.", k: "s" },
    { fi: "Minä pidän kakusta.", ru: "Я люблю торт.", en: "I like cake.", k: "s" },
    { fi: "Minä rakastan vaniljajäätelöä.", ru: "Я обожаю ванильное мороженое.", en: "I love vanilla ice cream.", k: "s" },
    { fi: "Hän pitää kalakeitosta.", ru: "Он любит рыбный суп.", en: "He likes fish soup.", k: "s" },
    { fi: "Saara pitää ruisleivästä.", ru: "Саара любит ржаной хлеб.", en: "Saara likes rye bread.", k: "s" },
    { fi: "Minä pidän kissoista.", ru: "Я люблю кошек.", en: "I like cats.", k: "s" },
    { fi: "Minä rakastan kissoja.", ru: "Я обожаю кошек.", en: "I love cats.", k: "s" },
    { fi: "Minä en pidä kakusta.", ru: "Я не люблю торт.", en: "I don't like cake.", k: "s" },
    { fi: "Minä vihaan vaniljajäätelöä.", ru: "Я ненавижу ванильное мороженое.", en: "I hate vanilla ice cream.", k: "s" },
    { fi: "Saisinko ruokalistan, kiitos.", ru: "Можно меню, пожалуйста.", en: "Could I have the menu, please.", k: "s" },
    { fi: "Tilaisin vettä kolmelle, kiitos.", ru: "Я бы заказал воду на троих, пожалуйста.", en: "I would like to order water for three, please.", k: "s" },
    { fi: "Minä en pidä kalasta.", ru: "Я не люблю рыбу.", en: "I don't like fish.", k: "s" },
    { fi: "Rakastan marjoja, mutta olen allerginen mansikoille.", ru: "Обожаю ягоды, но у меня аллергия на клубнику.", en: "I love berries, but I'm allergic to strawberries.", k: "s" },
    { fi: "Saisinko lohipastaa kiitos?", ru: "Можно пасту с лососем, пожалуйста?", en: "Could I have salmon pasta, please?", k: "s" }
  ]
},
{
  id: "BE_S1_09",
  title: "Договориться о встрече по телефону",
  source: "FinnishPod101 · Beginner S1 #9",
  glossary: [
    { w: "ehdotus konditionaalilla", ru: "предложение через кондиционал + -ko/-kö", en: "suggestions with the conditional",
      forms: ["menisimmekö", "voisimme", "kävisikö", "näkisimme", "tapaisimmeko", "lähtisimmekö"],
      note: "Кондиционал (урок 21) годится не только для вежливых просьб, но и для предложений «давай сделаем». Схема для «мы»: основа + -isi- + окончание -mme + вопросительная частица -ko/-kö.\nMenisimmekö huomenna syömään? («Пойдём завтра поедим?»), Tapaisimmeko tänään illalla?, Lähtisimmekö kesän alussa risteilylle? Без вопросительной частицы получается просто мягкое «мы могли бы»: Voisimme juhlia sun uutta opiskelupaikkaa.\nВопрос про вариант дня строится так же, но в третьем лице: Kävisikö perjantaina? — «Пятница подошла бы?»" },
    { w: "kuulostaa hyvältä", ru: "звучит хорошо", en: "sounds good",
      forms: ["kuulostaa", "hyvältä", "kuulostaisi"],
      note: "Kuulostaa joltakin — «звучать как-то», и это «как-то» ставится в аблатив (-lta/-ltä), как и с vaikuttaa из урока 10: Suunnitelmasi kuulostaa hyvältä. Годится и про буквальный звук, и про идею или план." },
    { w: "puhekieli", ru: "разговорные сокращения местоимений", en: "colloquial pronouns",
      forms: ["sun", "mun", "sulle", "mulle", "sua", "mua"],
      note: "В живой речи minun сокращается до mun, sinun до sun, minulle до mulle, sinulle до sulle. В диалоге как раз так: sun uutta opiskelupaikkaa вместо sinun, mun ystävän вместо minun. На письме и в официальной речи пишут полные формы." },
    { w: "keikka", ru: "концерт, выступление; подработка", en: "gig", forms: ["keikka", "keikalle", "keikan"] },
    { w: "juhlia", ru: "праздновать, отмечать", en: "to celebrate", forms: ["juhlia", "juhlin", "juhlimme", "juhlat"] },
    { w: "ravintola", ru: "ресторан", en: "restaurant", forms: ["ravintola", "ravintolaan", "ravintoloissa", "ravintolan"] },
    { w: "ehtiä", ru: "успевать", en: "to have time", forms: ["ehtiä", "ehdi", "ehdinkö"] },
    { w: "ikävä kyllä", ru: "к сожалению", en: "unfortunately", forms: ["ikävä kyllä", "ikävä"] }
  ],
  items: [
    { fi: "Haloo. Vilja.", ru: "Алло. Вилья.", en: "Hello. Vilja.", k: "d", who: "Vilja" },
    { fi: "No moi Vilja! Aino täällä.", ru: "О, привет, Вилья! Это Айно.", en: "Well hello Vilja! Aino here.", k: "d", who: "Aino" },
    { fi: "Moikka Aino! Pitkästä aikaa.", ru: "Привет, Айно! Давно не виделись.", en: "Hiya Aino! Long time no see.", k: "d", who: "Vilja" },
    { fi: "No niinpä. Menisimmekö huomenna yhdessä syömään?", ru: "И правда. Пойдём завтра вместе поедим?", en: "Yeah, it has been. Shall we go out to eat together tomorrow?", k: "d", who: "Aino" },
    { fi: "Voisimme juhlia sun uutta opiskelupaikkaa.", ru: "Могли бы отметить твоё поступление.", en: "We could celebrate your new school placement.", k: "d", who: "Aino" },
    { fi: "Voi miten ihana ajatus, mutta huomenna en ikävä kyllä ehdi. Kävisikö perjantaina?", ru: "Ой, какая чудесная мысль, но завтра, к сожалению, не успеваю. Пятница подойдёт?", en: "Oh, that's a lovely idea, but unfortunately I don't have time tomorrow. Would Friday be okay?", k: "d", who: "Vilja" },
    { fi: "Voisimme sen jälkeen mennä mun ystävän jazz-keikalle.", ru: "Потом могли бы сходить на джазовый концерт моего друга.", en: "We could go to my friend's jazz gig afterwards.", k: "d", who: "Vilja" },
    { fi: "Se sopii! Menisimmekö siihen uuteen ravintolaan mistä puhuin aiemmin?", ru: "Подходит! Пойдём в тот новый ресторан, о котором я говорила?", en: "It's a plan! Shall we go to the new restaurant I was talking about?", k: "d", who: "Aino" },
    { fi: "Jos näkisimme sen edessä, vaikka kello seitsemän?", ru: "Может, встретимся перед ним, скажем, в семь?", en: "We could meet in front of it, say, at seven o'clock.", k: "d", who: "Aino" },
    { fi: "Kuulostaa hyvältä!", ru: "Звучит хорошо!", en: "Sounds good!", k: "d", who: "Vilja" },
    { fi: "pitkästä aikaa", ru: "давно не виделись", en: "long time no see", k: "w" },
    { fi: "ravintola", ru: "ресторан", en: "restaurant", k: "w" },
    { fi: "edessä", ru: "перед", en: "in front of", k: "w" },
    { fi: "keikka", ru: "концерт", en: "gig", k: "w" },
    { fi: "käydä", ru: "зайти, побывать", en: "to visit", k: "w" },
    { fi: "juhlia", ru: "праздновать", en: "to celebrate", k: "w" },
    { fi: "mennä syömään", ru: "пойти поесть", en: "to go eat", k: "w" },
    { fi: "ehtiä", ru: "успевать", en: "to make it", k: "w" },
    { fi: "kuulostaa hyvältä", ru: "звучит хорошо", en: "sounds good", k: "w" },
    { fi: "ikävä kyllä", ru: "к сожалению", en: "unfortunately", k: "w" },
    { fi: "Pitkästä aikaa, milloin näimmekään viimeksi?", ru: "Давно не виделись, когда мы встречались в последний раз?", en: "Long time no see, when was the last time we met?", k: "s" },
    { fi: "Minä käyn harvoin ravintoloissa.", ru: "Я редко хожу по ресторанам.", en: "I rarely go to restaurants.", k: "s" },
    { fi: "Ravintolan ilmapiiri on houkutellut paljon asiakkaita viime aikoina.", ru: "Атмосфера ресторана в последнее время привлекла много посетителей.", en: "The atmosphere of the restaurant has drawn a lot of customers lately.", k: "s" },
    { fi: "Lempibändini keikka on ensi viikolla.", ru: "Концерт моей любимой группы на следующей неделе.", en: "My favorite band's gig is next week.", k: "s" },
    { fi: "Haluan käydä joskus Keniassa.", ru: "Я хочу когда-нибудь побывать в Кении.", en: "I want to visit Kenya sometime.", k: "s" },
    { fi: "Miten aiot juhlia syntymäpäiviäsi?", ru: "Как ты собираешься отмечать день рождения?", en: "How are you going to celebrate your birthday?", k: "s" },
    { fi: "Ensi viikonloppuna aion juhlia!", ru: "В следующие выходные я собираюсь праздновать!", en: "Next weekend I am going to celebrate!", k: "s" },
    { fi: "Haluaisin mennä syömään japanilaista ruokaa.", ru: "Я бы хотел пойти поесть японской еды.", en: "I would like to go eat Japanese food.", k: "s" },
    { fi: "En ole varma ehdinkö enää lennolleni.", ru: "Не уверен, что успею на свой рейс.", en: "I am not sure I can make my flight anymore.", k: "s" },
    { fi: "Suunnitelmasi kuulostaa hyvältä.", ru: "Твой план звучит хорошо.", en: "Your plan sounds good.", k: "s" },
    { fi: "Ihana nähdä pitkästä aikaa.", ru: "Как чудесно увидеться спустя столько времени.", en: "It's so lovely to see you after such a long time.", k: "s" },
    { fi: "Menin pitkästä aikaa uimaan.", ru: "Я впервые за долгое время сходил поплавать.", en: "I went swimming for the first time in a long time.", k: "s" },
    { fi: "Tapaisimmeko tänään illalla?", ru: "Встретимся сегодня вечером?", en: "Shall we meet tonight?", k: "s" },
    { fi: "Onko sinulla aikaa viikonloppuna?", ru: "У тебя есть время на выходных?", en: "Do you have time during the weekend?", k: "s" },
    { fi: "Menisimmekö elokuviin yhdessä?", ru: "Пойдём вместе в кино?", en: "Shall we go to the movies together?", k: "s" },
    { fi: "kotibileet", ru: "домашняя вечеринка", en: "house party", k: "s" }
  ]
},
{
  id: "BE_S1_10",
  title: "На рынке: цена и скидка",
  source: "FinnishPod101 · Beginner S1 #10",
  glossary: [
    { w: "hinnan kysyminen", ru: "как спросить цену", en: "asking the price",
      forms: ["maksaa", "maksavat", "minkä verran", "kuinka paljon", "paljonko"],
      note: "Три равноправных способа: Kuinka paljon tämä maksaa? («Сколько это стоит?»), Minkä verran tuo maksaa?, Minkä verran nuo sinappisilakat maksavat? Перед вопросом вежливо добавить anteeksi.\nОбратите внимание на согласование: если спрашиваете про несколько предметов, глагол во множественном — nuo maksavat." },
    { w: "kilo kuudella eurolla", ru: "цена в адессиве: «за шесть евро»", en: "a kilo for six euros",
      forms: ["kuudella", "viidellätoista", "eurolla", "kilon"],
      note: "Цена, за которую что-то отдают, ставится в адессив (-lla/-llä): saat kilon kuudella eurolla («получишь килограмм за шесть евро»), saat ne viidellätoista eurolla. Ostin omenoita kilon kuudella eurolla." },
    { w: "alennuksen pyytäminen", ru: "как попросить скидку", en: "asking for a discount",
      forms: ["alennus", "alennusta", "edullisemmin", "halvemmalla", "tinkiä", "neuvotella", "kaupat tuli"],
      note: "Saisinko yhtään alennusta? — «Можно хоть какую-то скидку?». Ещё варианты: Saisinko sen edullisemmin? и Voisinko saada sen halvemmalla? («Можно подешевле?»). Прямо спросить о торге: Saanko tinkiä?\nПродавец может ответить Voimme neuvotella («можем договориться») или saa tinkiä («торговаться можно»). Сделка закрывается фразой Kaupat tuli! — «По рукам!», буквально «сделка пришла».\nВажно про место: в Финляндии торговаться почти не принято и часто считается невежливым. Уместно только на блошиных рынках (kirpputori) и иногда на уличных (markkinat)." },
    { w: "kaupan päälle", ru: "в придачу, бесплатно к покупке", en: "on the house",
      forms: ["kaupan päälle", "kauppa", "päällä"],
      note: "Из kauppa («сделка») и päällä («сверху»), буквально «поверх сделки»: что-то дают бесплатно вдобавок к покупке. Jos ostan nämä kolme pukua, saanko solmion kaupan päälle?" },
    { w: "kallis", ru: "дорогой", en: "expensive", forms: ["kallis", "kallista", "kalleimman", "kalliimpi"] },
    { w: "käteinen", ru: "наличные", en: "cash", forms: ["käteinen", "käteistä"] },
    { w: "silakka", ru: "салака", en: "Baltic herring", forms: ["silakka", "silakkaa", "silakoita", "sinappisilakat", "silakkapihvit"] },
    { w: "saaristolaisleipä", ru: "архипелажный хлеб", en: "islander bread", forms: ["saaristolaisleipä", "saaristolaisleivän"] },
    { w: "neuvotella", ru: "вести переговоры, договариваться", en: "to negotiate", forms: ["neuvotella", "neuvottelen", "neuvotellaan"] }
  ],
  items: [
    { fi: "Päivää! Onpa teillä hyvän näköisiä silakoita myytävänä.", ru: "Добрый день! Ну и хороша же у вас салака на продажу.", en: "Good afternoon! My, you have some fine looking herring here for sale.", k: "d", who: "Heikki" },
    { fi: "No päivää päivää! Kyllä, siinä olisi silakkaa poikineen.", ru: "Здравствуйте-здравствуйте! Да, тут и салака, и всё к ней.", en: "Well, hello hello! Yes, there's some herring and a few more things!", k: "d", who: "Myyjä" },
    { fi: "Mitä laitetaan kassiin ja kuinka paljon?", ru: "Что положить в пакет и сколько?", en: "What shall I pack up for you and how much?", k: "d", who: "Myyjä" },
    { fi: "Minkä verran nuo sinappisilakat maksavat?", ru: "Сколько стоит вон та салака в горчице?", en: "How much do those mustard herring cost?", k: "d", who: "Heikki" },
    { fi: "No, sovitaan että saat kilon kuudella eurolla.", ru: "Ну, договоримся: килограмм за шесть евро.", en: "Well, let's agree that you can have a kilo for six euros.", k: "d", who: "Myyjä" },
    { fi: "Hieman on kallista. Saisinko yhtään alennusta? Minulla ei ole kovin paljoa käteistä.", ru: "Дороговато. Можно хоть какую-то скидку? У меня не очень много наличных.", en: "That's a little bit expensive. Could I get any discount? I don't have much cash.", k: "d", who: "Heikki" },
    { fi: "Vai niin, no voimme toki neuvotella! Jos ostat kolme kiloa, saat ne viidellätoista eurolla.", ru: "Вот как, ну конечно можем договориться! Если возьмёте три килограмма, отдам за пятнадцать евро.", en: "Is that so? Well, we can definitely negotiate! If you buy three kilos, you can get them for fifteen euros.", k: "d", who: "Myyjä" },
    { fi: "Ja saat vielä saaristolaisleivän kaupan päälle!", ru: "И архипелажный хлеб дам в придачу!", en: "I'll even throw in some islander bread!", k: "d", who: "Myyjä" },
    { fi: "Kaupat tuli!", ru: "По рукам!", en: "It's a deal!", k: "d", who: "Heikki" },
    { fi: "silakka", ru: "салака", en: "Baltic herring", k: "w" },
    { fi: "saaristolaisleipä", ru: "архипелажный хлеб", en: "islander bread", k: "w" },
    { fi: "kaupan päälle", ru: "в придачу", en: "on the house", k: "w" },
    { fi: "neuvotella", ru: "договариваться", en: "to negotiate", k: "w" },
    { fi: "käteinen", ru: "наличные", en: "cash", k: "w" },
    { fi: "kilo", ru: "килограмм", en: "kilo", k: "w" },
    { fi: "kallis", ru: "дорогой", en: "expensive", k: "w" },
    { fi: "alennus", ru: "скидка", en: "discount", k: "w" },
    { fi: "tinkiä", ru: "торговаться", en: "to bargain", k: "w" },
    { fi: "kirpputori", ru: "блошиный рынок", en: "flea market", k: "w" },
    { fi: "markkinat", ru: "ярмарка, уличный рынок", en: "market, fair", k: "w" },
    { fi: "Silakkapihvit ovat herkullisia.", ru: "Котлетки из салаки восхитительны.", en: "Herring steaks are delicious.", k: "s" },
    { fi: "Saaristolaisleipä on hyvää maidon kanssa.", ru: "Архипелажный хлеб хорош с молоком.", en: "The islander bread is good with milk.", k: "s" },
    { fi: "Sain tämän kassin kaupan päälle.", ru: "Эту сумку мне дали в придачу.", en: "I got this bag on the house.", k: "s" },
    { fi: "Voimmeko neuvotella sopimuksesta?", ru: "Можем обсудить договор?", en: "Can we negotiate the contract?", k: "s" },
    { fi: "Minulla ei ole yhtään käteistä.", ru: "У меня совсем нет наличных.", en: "I don't have any cash.", k: "s" },
    { fi: "Keräsin eilen kilon mustikoita.", ru: "Вчера я набрал килограмм черники.", en: "I picked a kilo of blueberries yesterday.", k: "s" },
    { fi: "Lounasmenu on täällä halpa, mutta päivällinen on erittäin kallis.", ru: "Обед тут дешёвый, а ужин очень дорогой.", en: "The lunch menu here is cheap, but dinner is very expensive.", k: "s" },
    { fi: "Tokiossa on kallista asua.", ru: "В Токио дорого жить.", en: "It is expensive to live in Tokyo.", k: "s" },
    { fi: "Tuo auto on liian kallis, en aio ostaa sitä.", ru: "Та машина слишком дорогая, я не буду её покупать.", en: "That car is too expensive; I won't buy it.", k: "s" },
    { fi: "Saisinko tästä yhtään alennusta?", ru: "Можно на это какую-нибудь скидку?", en: "Can I get any discount on this?", k: "s" },
    { fi: "Kännykät ovat tällä hetkellä alennuksessa.", ru: "Телефоны сейчас со скидкой.", en: "Mobile phones are on sale at the moment.", k: "s" },
    { fi: "Ostin omenoita kilon kuudella eurolla.", ru: "Я купил килограмм яблок за шесть евро.", en: "I bought a kilo of apples for six euros.", k: "s" },
    { fi: "Jos ostan nämä kolme pukua, saanko solmion kaupan päälle?", ru: "Если куплю эти три костюма, дадите галстук в придачу?", en: "If I buy these three suits, can I get the necktie on the house?", k: "s" },
    { fi: "Kuinka paljon tämä maksaa?", ru: "Сколько это стоит?", en: "How much is this?", k: "s" },
    { fi: "Saisinko sen edullisemmin?", ru: "Можно подешевле?", en: "Could I get it any cheaper?", k: "s" },
    { fi: "Voisinko saada sen halvemmalla?", ru: "Можно получить это дешевле?", en: "Could I get it cheaper?", k: "s" },
    { fi: "Se on liian kallis.", ru: "Это слишком дорого.", en: "It's too expensive.", k: "s" },
    { fi: "Saanko tinkiä?", ru: "Можно поторговаться?", en: "Can I bargain?", k: "s" },
    { fi: "Voimme neuvotella.", ru: "Можем договориться.", en: "We can negotiate.", k: "s" }
  ]
},
];

const LESSONS_IN = [
{
  id: "IN_S1_02",
  title: "Прогноз погоды и потенциал",
  source: "FinnishPod101 · Intermediate S1 #2",
  glossary: [
    { w: "potentiaali", ru: "потенциал: показатель -ne-", en: "the potential mood",
      forms: ["paistanee", "satanee", "pilvistynee", "lienee", "tullee", "menneen"],
      note: "Наклонение предположения: «пожалуй, будет», «по всей вероятности». В прогнозах погоды оно встречается постоянно, в обычной речи — редко.\nОбразуется прибавлением -ne- к основе инфинитива, а дальше обычные личные окончания: -ne-n, -ne-t, -ne-e, -ne-mme, -ne-tte, -ne-vat/-vät.\npaistaa → paistanee («вероятно, будет светить»), sataa → satanee («вероятно, пойдёт дождь»), pilvistyä → pilvistynee («вероятно, затянет облаками»).\nОтдельно стоит запомнить lienee — это потенциал от olla: Huomenna lienee aurinkoinen ilma («Завтра, надо полагать, будет солнечно»)." },
    { w: "todennäköisyys", ru: "слова вероятности", en: "words of probability",
      forms: ["luultavasti", "todennäköisesti", "saattaa", "varmaankin", "varmasti", "ehkäpä", "kenties", "mahdollisesti"],
      note: "Кроме потенциала есть целый набор наречий: luultavasti и todennäköisesti («вероятно»), saattaa («может»), varmaankin («наверняка»), ehkäpä и kenties («пожалуй, может быть»), mahdollisesti («возможно»).\nIltapäivällä luultavasti sataa, Saattaa sataa, Koe on varmaankin vaikea, Kenties koe on helppo. Шкала уверенности та же, что в уроке 12: varmasti сильнее, чем varmaankin, а ehkäpä и kenties — самые осторожные." },
    { w: "pakkanen", ru: "мороз, минусовая температура", en: "frost, freezing weather",
      forms: ["pakkanen", "pakkasta", "pakkasella", "pakkaseen", "pakkasaste", "pakkasastetta", "pakkaslukema", "pakkaslukemat"],
      note: "Отдельное слово для погоды ниже нуля, которого нет в русском одним словом. Производные: pakkasaste — «градус мороза» (Ulkona on 15 pakkasastetta — «на улице минус пятнадцать»), pakkaslukema — «показание ниже нуля» (Ulkona on kovat pakkaslukemat).\nБлагодаря им финны обходятся без минуса: не «минус двадцать», а «двадцать градусов мороза»." },
    { w: "ilmanpaine", ru: "давление: высокое и низкое", en: "air pressure",
      forms: ["korkeapaine", "matalapaine", "paine", "korkea"],
      note: "Korkeapaine — из korkea («высокий») и paine («давление»), то есть антициклон. Противоположность — matalapaine («низкое давление, циклон»). Korkeapaine lähestyy viikonlopun aikana." },
    { w: "sääsanasto", ru: "погодный словарь прогноза", en: "weather forecast vocabulary",
      forms: ["paistaa", "pilvistyä", "sataa", "tuulla", "selkeytyä", "kirkastua", "kylmentyä", "lämmetä", "pakastua", "sulaa", "jäätyä", "lauhtua", "sademäärä", "lämpötila", "kosteus", "sumu", "usva", "sateenkaari", "myrsky", "ukonilma", "tulva", "kuivuus", "lämpöaalto", "sääennuste", "ilmasto", "ilmastonmuutos", "aurinkoinen", "sateinen", "sumuinen", "jäinen", "huurteinen", "myrskyinen"],
      note: "Глаголы: paistaa («светить»), pilvistyä («затягивать облаками»), sataa («идти — об осадках»), tuulla («дуть»), selkeytyä и kirkastua («проясняться»), kylmentyä («холодать»), lämmetä («теплеть»), pakastua («подмораживать»), sulaa («таять»), jäätyä («обледеневать»), lauhtua («оттаивать»).\nСуществительные: sumu и usva («туман, дымка»), sateenkaari («радуга»), tuulahdus («дуновение»), ukonilma («гроза»), navakka tuuli («крепкий ветер»), tulva («наводнение»), kuivuus («засуха»), lämpöaalto («волна жары»), sademäärä («количество осадков»), lämpötila («температура»), kosteus («влажность»), ilmastonmuutos («изменение климата»).\nПрилагательные: aurinkoinen, sateinen, sumuinen, jäinen («ледяной»), huurteinen («заиндевелый»), myrskyinen («штормовой»), kostea («влажный»), viileä («прохладный»)." },
    { w: "hellittää", ru: "ослабевать, отпускать", en: "to ease",
      forms: ["hellittää", "hellitä", "hellittäjä"],
      note: "Про погоду — ослабнуть: talvi hellittää otettaan («зима ослабляет хватку»). Про человека — сбавить обороты: Hellitä hieman, älä työskentele niin kovasti." },
    { w: "ulottua", ru: "простираться, доходить", en: "to extend", forms: ["ulottua", "ulottuu", "ulottunut"] },
    { w: "kiristyä", ru: "усиливаться, затягиваться", en: "to tighten", forms: ["kiristyä", "kiristyy"] },
    { w: "talvinen", ru: "зимний", en: "wintry", forms: ["talvinen", "talvisessa"] },
    { w: "säätiedotus", ru: "прогноз погоды", en: "weather forecast", forms: ["säätiedotus", "säätiedotusta", "sääennuste"] }
  ],
  items: [
    { fi: "Ja nyt kuulemme säätiedotuksen viikonlopulle. Kylmältä näyttää, vai mitä Pekka?", ru: "А теперь послушаем прогноз погоды на выходные. Выглядит холодно, не так ли, Пекка?", en: "And now we'll hear the weather forecast for the weekend. Looks cold, or what, Pekka?", k: "d", who: "Kuuluttaja" },
    { fi: "Kyllä vain. Viikonloppua vietetään erittäin talvisessa säässä.", ru: "Именно так. Выходные пройдут в очень зимнюю погоду.", en: "Yes, indeed. The weekend will be very wintry weather.", k: "d", who: "Pekka" },
    { fi: "Syynä pakkaseen on korkeapaine, joka on ulottunut Siperiasta asti meille.", ru: "Причина мороза — антициклон, который дотянулся до нас аж из Сибири.", en: "The reason for the freezing weather is the high pressure, which has extended all the way from Siberia to us.", k: "d", who: "Pekka" },
    { fi: "Pakkaslukemat liikkuvat 20-30 asteen välillä koko maassa.", ru: "Морозы по всей стране будут в пределах двадцати-тридцати градусов.", en: "The freezing temperatures will move between -20 and -30 degrees throughout the whole country.", k: "d", who: "Pekka" },
    { fi: "Yötä kohden pakkanen kiristyy, ja Lapissa 40 pakkasastetta voi mennä rikki.", ru: "К ночи мороз усилится, и в Лапландии может быть перейдён рубеж в сорок градусов.", en: "Towards the night the frost will tighten, and in Lapland -40 degrees might be seen.", k: "d", who: "Pekka" },
    { fi: "Pakkasella pysytään myös ensi viikolla, joskin talvi hellittää otettaan hieman loppuviikolla.", ru: "Морозы сохранятся и на следующей неделе, хотя к концу недели зима слегка ослабит хватку.", en: "The freezing weather will continue next week, although winter will lose its grip slightly towards the end of the week.", k: "d", who: "Pekka" },
    { fi: "Selvä, kiitos Pekka! Villapaidat siis esiin!", ru: "Ясно, спасибо, Пекка! Значит, достаём свитера!", en: "Okay, thank you, Pekka! So bring out the sweaters!", k: "d", who: "Kuuluttaja" },
    { fi: "säätiedotus", ru: "прогноз погоды", en: "weather forecast", k: "w" },
    { fi: "korkeapaine", ru: "высокое давление", en: "high pressure", k: "w" },
    { fi: "matalapaine", ru: "низкое давление", en: "low pressure", k: "w" },
    { fi: "pakkanen", ru: "мороз", en: "frost", k: "w" },
    { fi: "pakkasaste", ru: "градус мороза", en: "degree below zero", k: "w" },
    { fi: "ulottua", ru: "простираться", en: "to extend", k: "w" },
    { fi: "talvinen", ru: "зимний", en: "wintry", k: "w" },
    { fi: "kiristyä", ru: "усиливаться", en: "to tighten", k: "w" },
    { fi: "hellittää", ru: "ослабевать", en: "to ease", k: "w" },
    { fi: "pilvistyä", ru: "затягиваться облаками", en: "to cloud over", k: "w" },
    { fi: "selkeytyä", ru: "проясняться", en: "to clear up", k: "w" },
    { fi: "lämmetä", ru: "теплеть", en: "to warm up", k: "w" },
    { fi: "sulaa", ru: "таять", en: "to melt", k: "w" },
    { fi: "jäätyä", ru: "обледеневать", en: "to freeze over", k: "w" },
    { fi: "sumu", ru: "туман", en: "fog", k: "w" },
    { fi: "sateenkaari", ru: "радуга", en: "rainbow", k: "w" },
    { fi: "myrsky", ru: "буря, шторм", en: "storm", k: "w" },
    { fi: "tulva", ru: "наводнение", en: "flood", k: "w" },
    { fi: "lämpötila", ru: "температура", en: "temperature", k: "w" },
    { fi: "ilmastonmuutos", ru: "изменение климата", en: "climate change", k: "w" },
    { fi: "Odotan säätiedotusta.", ru: "Жду прогноз погоды.", en: "I am waiting for the weather forecast.", k: "s" },
    { fi: "Korkeapaine lähestyy Suomea.", ru: "Антициклон приближается к Финляндии.", en: "A high pressure system is approaching Finland.", k: "s" },
    { fi: "Pakkasen vuoksi autoa voi olla vaikea käynnistää.", ru: "Из-за мороза машину бывает трудно завести.", en: "It may be difficult to start the car because of the freeze.", k: "s" },
    { fi: "Ukkosrintama ulottuu rannikolta Hämeeseen saakka.", ru: "Грозовой фронт тянется от побережья до Хяме.", en: "A thunder front extends from the coast to Häme.", k: "s" },
    { fi: "Sää on tänään erittäin talvinen.", ru: "Погода сегодня совсем зимняя.", en: "The weather is very wintry today.", k: "s" },
    { fi: "Pakkanen kiristyy huomattavasti yön aikana.", ru: "За ночь мороз заметно усилится.", en: "The freezing weather will tighten considerably during the night.", k: "s" },
    { fi: "Ulkona on jo 25 pakkasastetta.", ru: "На улице уже двадцать пять мороза.", en: "It is already -25 degrees outside.", k: "s" },
    { fi: "Hellitä hieman, älä työskentele niin kovasti.", ru: "Сбавь немного, не работай так тяжело.", en: "Ease up a little, don't work so hard.", k: "s" },
    { fi: "Ulkona on kovat pakkaslukemat.", ru: "На улице крепкий мороз.", en: "There are hard sub-zero readings outside.", k: "s" },
    { fi: "Huomenna lienee aurinkoinen ilma.", ru: "Завтра, надо полагать, будет солнечно.", en: "It is most likely to be sunny weather tomorrow.", k: "s" },
    { fi: "Iltapäivällä luultavasti sataa.", ru: "После обеда, вероятно, пойдёт дождь.", en: "It will probably rain in the afternoon.", k: "s" },
    { fi: "Saattaa sataa.", ru: "Может пойти дождь.", en: "It might rain.", k: "s" },
    { fi: "Koe on varmaankin vaikea.", ru: "Экзамен наверняка трудный.", en: "The test is surely difficult.", k: "s" },
    { fi: "Ehkäpä koe on helppo.", ru: "А может, экзамен окажется лёгким.", en: "Perhaps the test will be easy.", k: "s" },
    { fi: "Lännestä alkaen pilvistyvää ja lumisadetta.", ru: "С запада начнёт затягивать облаками, будет снегопад.", en: "From the west it's getting cloudy and there is snowfall.", k: "s" },
    { fi: "Etelässä satanee iltapäivällä jonkin verran lunta.", ru: "На юге после обеда, вероятно, выпадет немного снега.", en: "It will probably snow lightly in the south during the afternoon.", k: "s" },
    { fi: "Yön aikana sää selkenee ja kylmenee.", ru: "За ночь погода прояснится и похолодает.", en: "During the night the weather clears up and cools down.", k: "s" },
    { fi: "Talvirenkaat on asennettava viimeistään 1.12.", ru: "Зимнюю резину надо поставить не позже первого декабря.", en: "Winter tires must be installed by December 1st at the latest.", k: "s" }
  ]
},
{
  id: "IN_S1_03",
  title: "Спор о планах: возразить вежливо",
  source: "FinnishPod101 · Intermediate S1 #3",
  glossary: [
    { w: "eri mieltä kohteliaasti", ru: "как вежливо возразить", en: "polite disagreement",
      forms: ["toisaalta", "kuitenkin", "silti", "aivan", "totta", "niinkin"],
      note: "Набор оборотов, которыми вводят своё несогласие, не обижая собеседника:\nToisaalta... («с другой стороны»), Voi olla, mutta... («может быть, но»), Se on totta, mutta... («это правда, но»), Minun mielestäni kuitenkin... («по-моему всё же»), Aivan, mutta silti... («верно, но всё равно»), Se on toki niinkin, mutta... («и так тоже, конечно, но»), Minulla on kuitenkin eri mielipide («у меня всё же другое мнение»), Aivan, olen kuitenkin eri mieltä kuin sinä." },
    { w: "hyvä ja huono puoli", ru: "плюсы и минусы", en: "pros and cons",
      forms: ["puoli", "juttu", "asia", "paras", "huonoin"],
      note: "Готовые каркасы для взвешивания: Hyvä/huono juttu on, että... («хорошо/плохо то, что»), Paras/huonoin puoli on... («лучшая/худшая сторона в том, что»), Tässä asiassa on se hyvä puoli, että..., Eräs huono puoli on, että...\nПример разговора: Paras puoli on sen hinta! — Huono puoli on sen sijainti. — No toisaalta, täällä on hyvin rauhallista." },
    { w: "ehdotus ja -ko/-kö", ru: "вопросительная частица и предложения", en: "question clitic",
      forms: ["-ko", "-kö", "menisimmekö", "onko", "sinullako", "kissako", "lähtikö", "oliko"],
      note: "Частица -ko/-kö цепляется к тому слову, о котором спрашивают, и это слово ставят в начало: Onko sinulla kissa? («У тебя есть кошка?»), Sinullako on kissa? («Это у тебя кошка?»), Kissako sinulla on? («Именно кошка у тебя?»). Остальной порядок слов свободный.\nВместе с кондиционалом получается вежливое предложение или просьба: Menisimmekö kahville?, Voisitteko siirtyä hieman oikealle?, Joisitko jotain kuumaa?\nТа же частица нужна в косвенных вопросах: En tiedä, lähtikö opettaja jo kotiin, Kysy, onko hänellä karttaa." },
    { w: "ei välitä", ru: "«не очень люблю» — мягкий отказ", en: "to not care for",
      forms: ["välittää", "välitä", "uimisesta", "urheilusta", "lukemisesta", "maidosta"],
      note: "Ei välitä jostakin — смягчённое «не люблю», то, о чём говорят, идёт в элатив: En välitä maidosta («молоко мне не очень»), Hän ei välitä lukemisesta. Если хочется сказать прямо, есть en pidä jostakin." },
    { w: "sekä... että", ru: "и то, и другое", en: "both... and",
      forms: ["sekä", "että"],
      note: "Парный союз: Pidän sekä omenista, että appelsiineista («Люблю и яблоки, и апельсины»), paikka, missä voimme sekä lautailla, että käydä kylpylässä." },
    { w: "hiihtoloma", ru: "лыжные каникулы", en: "skiing holiday",
      forms: ["hiihtoloma", "hiihtolomalla", "hiihtolomaa", "talviloma"],
      note: "Hiihto («катание на лыжах») + loma («каникулы»). Недельные школьные каникулы между февралём и мартом, причём в разных муниципалитетах в разные недели — чтобы лыжные курорты не забились разом. Традиция с 1930-х: детей выгоняли двигаться, чтобы хватило сил доучиться до весны.\nХодовые вопросы: Koska teillä on hiihtoloma?, Minne menette hiihtolomalla?" },
    { w: "lomamökki", ru: "съёмный домик на отпуск", en: "holiday cottage",
      forms: ["lomamökki", "lomamökin", "kesämökki", "mökki"],
      note: "Loma («отпуск») + mökki («домик»). Именно съёмный домик в туристической деревне. Свой собственный называют kesämökki или просто mökki." },
    { w: "tylsä", ru: "скучный; тупой (о лезвии)", en: "boring; dull", forms: ["tylsä", "tylsää"] },
    { w: "kylpylä", ru: "спа, термы", en: "spa", forms: ["kylpylä", "kylpylään", "kylpylässä"] },
    { w: "lumilautailla", ru: "кататься на сноуборде", en: "to snowboard", forms: ["lumilautailemaan", "lautailla", "lautailemaan"] }
  ],
  items: [
    { fi: "Heikki, hiihtoloma lähestyy. Minne mentäisiin lomalla?", ru: "Хейкки, лыжные каникулы приближаются. Куда поедем в отпуск?", en: "Heikki, the skiing holiday is approaching. Where should we go?", k: "d", who: "Aino" },
    { fi: "Haluaisin taas lumilautailemaan. Voisimme varata taas saman lomamökin Lapista, kuin viime vuonna.", ru: "Я бы снова на сноуборд. Могли бы опять снять тот же домик в Лапландии, что и в прошлом году.", en: "I would like to go snowboarding again. We could reserve the same cabin in Lapland as last year.", k: "d", who: "Heikki" },
    { fi: "Hmm, minun mielestäni se viime vuoden paikka oli hiukan tylsä. Haluaisin mieluummin kylpylään.", ru: "Хмм, по-моему то прошлогоднее место было скучноватым. Я бы лучше в спа.", en: "Hmm, I think the place last year was a little bit boring. I would rather go to a spa.", k: "d", who: "Aino" },
    { fi: "Minä en niin välitä uimisesta talvilomalla... Minusta talvella pitäisi nauttia lumesta!", ru: "Мне не очень плавание на зимних каникулах... По-моему, зимой надо наслаждаться снегом!", en: "I don't care for swimming that much during winter vacation... In my opinion you're supposed to enjoy snow during winter!", k: "d", who: "Heikki" },
    { fi: "No, onhan se toki niinkin. Voisimme silti etsiä paikan, missä voimme sekä lautailla, että käydä kylpylässä.", ru: "Ну, и так тоже, конечно. Но мы всё же могли бы найти место, где можно и покататься, и сходить в спа.", en: "Well, sure, that too. We could still search for a place where we can snowboard and go to a spa.", k: "d", who: "Aino" },
    { fi: "Joo, mikä ettei.", ru: "Да, почему бы и нет.", en: "Yeah, why not.", k: "d", who: "Heikki" },
    { fi: "hiihtoloma", ru: "лыжные каникулы", en: "skiing holiday", k: "w" },
    { fi: "tylsä", ru: "скучный", en: "boring", k: "w" },
    { fi: "minun mielestäni", ru: "по-моему", en: "in my opinion", k: "w" },
    { fi: "välittää", ru: "быть неравнодушным, любить", en: "to care about", k: "w" },
    { fi: "lomamökki", ru: "съёмный домик", en: "holiday cottage", k: "w" },
    { fi: "pitäisi", ru: "следовало бы", en: "be supposed to", k: "w" },
    { fi: "sekä... että", ru: "и то, и другое", en: "both... and", k: "w" },
    { fi: "kylpylä", ru: "спа", en: "spa", k: "w" },
    { fi: "toisaalta", ru: "с другой стороны", en: "on the other hand", k: "w" },
    { fi: "kuitenkin", ru: "всё же, однако", en: "however", k: "w" },
    { fi: "Koululaiset odottavat hiihtolomaa innokkaasti.", ru: "Школьники с нетерпением ждут лыжных каникул.", en: "Schoolchildren are waiting for the skiing holiday with enthusiasm.", k: "s" },
    { fi: "Hiihtoloma on helmikuussa.", ru: "Лыжные каникулы в феврале.", en: "The skiing holiday is in February.", k: "s" },
    { fi: "Tämä veitsi on tylsä.", ru: "Этот нож тупой.", en: "This knife is dull.", k: "s" },
    { fi: "Minun mielestäni tämä ohjelma on mielenkiintoinen.", ru: "По-моему, эта программа интересная.", en: "In my opinion this program is interesting.", k: "s" },
    { fi: "En oikein välitä urheilusta.", ru: "Спорт мне не особо интересен.", en: "I don't really care about sports.", k: "s" },
    { fi: "Hän ei välitä lukemisesta.", ru: "Он не любит читать.", en: "He does not care for reading.", k: "s" },
    { fi: "Haluaisin oman lomamökin.", ru: "Я бы хотел свой домик для отпуска.", en: "I would like to have my own holiday cottage.", k: "s" },
    { fi: "Haluaisin vuokrata lomamökin Lapista.", ru: "Я хотел бы снять домик в Лапландии.", en: "I would like to rent a holiday cottage in Lapland.", k: "s" },
    { fi: "Täällä pitäisi olla kirjoja.", ru: "Здесь должны быть книги.", en: "There are supposed to be books here.", k: "s" },
    { fi: "Pidän sekä omenista, että appelsiineista.", ru: "Я люблю и яблоки, и апельсины.", en: "I like both apples and oranges.", k: "s" },
    { fi: "Koska teillä on hiihtoloma?", ru: "Когда у вас лыжные каникулы?", en: "When do you have your skiing holiday?", k: "s" },
    { fi: "Se oli tylsä elokuva, mutta toisaalta, se oli myös erittäin informatiivinen.", ru: "Фильм был скучный, но, с другой стороны, очень познавательный.", en: "That was a boring movie, but on the other hand it was also really informative.", k: "s" },
    { fi: "Voi olla, mutta minun mielestäni jos elokuva on tylsä, en jaksa seurata sitä.", ru: "Может быть, но по-моему, если фильм скучный, я не могу его досмотреть.", en: "Maybe, but I think that if the movie is boring I can't be bothered to follow it.", k: "s" },
    { fi: "Paras puoli on sen hinta! Se on niin edullinen!", ru: "Лучшее в нём — цена! Он такой доступный!", en: "The best part is the price! It's so affordable!", k: "s" },
    { fi: "Huono puoli on sen sijainti.", ru: "Минус — его расположение.", en: "The bad point is its location.", k: "s" },
    { fi: "No toisaalta, täällä on hyvin rauhallista.", ru: "Ну, с другой стороны, тут очень спокойно.", en: "Well, on the other hand, it's very peaceful here.", k: "s" },
    { fi: "Onko sinulla kissa?", ru: "У тебя есть кошка?", en: "Do you have a cat?", k: "s" },
    { fi: "Sinullako on kissa?", ru: "Это у тебя кошка?", en: "Are you the one who has a cat?", k: "s" },
    { fi: "Kissako sinulla on?", ru: "Именно кошка у тебя?", en: "Is it a cat you have?", k: "s" },
    { fi: "Menisimmekö kahville?", ru: "Сходим на кофе?", en: "Shall we go for a coffee?", k: "s" },
    { fi: "Voisitteko siirtyä hieman oikealle?", ru: "Не могли бы вы сдвинуться немного вправо?", en: "Could you move a little to the right, please?", k: "s" },
    { fi: "Joisitko jotain kuumaa?", ru: "Выпьешь чего-нибудь горячего?", en: "Would you like to drink something hot?", k: "s" },
    { fi: "En tiedä, lähtikö opettaja jo kotiin.", ru: "Не знаю, ушёл ли учитель уже домой.", en: "I don't know whether the teacher went home already.", k: "s" },
    { fi: "Kysy, onko hänellä karttaa.", ru: "Спроси, есть ли у него карта.", en: "Ask whether he has a map.", k: "s" },
    { fi: "Minun mielestäni tämä keitto on hiukan mautonta.", ru: "По-моему, этот суп немного пресный.", en: "In my opinion, this soup is a little bit bland.", k: "s" },
    { fi: "Lähtisimmekö kesän alussa risteilylle?", ru: "Поедем в начале лета в круиз?", en: "Shall we go on a cruise in the beginning of summer?", k: "s" }
  ]
},
{
  id: "IN_S1_04",
  title: "Вызов скорой: повелительное наклонение",
  source: "FinnishPod101 · Intermediate S1 #4",
  glossary: [
    { w: "imperatiivi yksikkö", ru: "повелительное: ты", en: "singular imperative",
      forms: ["lue", "anna", "syö", "hymyile", "herää", "lukitse", "tule", "mene", "käänny", "siivoa", "odota", "kerro"],
      note: "Форма для «ты» берётся из первого лица единственного числа настоящего времени: убираем окончание -n, и всё.\nluen → Lue! («Читай!»), annan → Anna! («Дай!»), syön → Syö! («Ешь!»), hymyilen → Hymyile! («Улыбнись!»), herään → Herää! («Проснись!»), lukitsen → Lukitse! («Запри!»). Работает для всех типов глаголов.\nОтрицание — частица älä перед той же формой: Älä syö!, Älä tule!, Älä mene sinne!, Älä sulje puhelinta!" },
    { w: "imperatiivi monikko", ru: "повелительное: вы (и вежливое)", en: "plural imperative",
      forms: ["istukaa", "juokaa", "nouskaa", "menkää", "kertokaa", "odottakaa", "rauhoittukaa", "kuunnelkaa", "varokaa", "älkää", "auttako", "menkö", "tehkö", "sulkeko"],
      note: "Здесь основа берётся от инфинитива, к ней добавляется -kaa/-kää: istua → istukaa, juoda → juokaa, nousta → nouskaa, mennä → menkää.\nЭта же форма служит вежливым обращением к одному человеку — как teitittely из урока 19. Поэтому диспетчер говорит Kertokaa osoite hitaasti, а не Kerro.\nОтрицание сложнее: älkää + основа инфинитива + -ko/-kö. Älkää auttako!, Älkää menkö sinne!, Älkää tehkö tyhmyyksiä!, Älkää sulkeko puhelinta!" },
    { w: "hätäkeskus", ru: "служба экстренного вызова", en: "emergency response center",
      forms: ["hätäkeskus", "hätäkeskukseen", "hätä"],
      note: "Единый номер в Финляндии — 112. Hätä значит «беда, крайняя нужда», keskus — «центр». Оттуда же hätätilanne («чрезвычайная ситуация»)." },
    { w: "olla tavoitettavissa", ru: "быть доступным для связи", en: "to be reachable",
      forms: ["tavoitettavissa", "tavoittaa", "tavoittaako"],
      note: "Voiko teidät tavoittaa tästä numerosta? — «Вас можно застать по этому номеру?». Olen tavoitettavissa toimistoltani ensi viikolla. Lääkärin täytyy olla tavoitettavissa melkein koko ajan." },
    { w: "paikkakunta", ru: "населённый пункт, местность", en: "locality",
      forms: ["paikkakunta", "paikkakunnalta", "paikkakunnalla"],
      note: "Из paikka («место») и kunta («муниципалитет, община»). Любой посёлок, город или местность, но прежде всего единица административного деления. Olen kotoisin pieneltä paikkakunnalta." },
    { w: "liukastua", ru: "поскользнуться", en: "to slip", forms: ["liukastua", "liukastui", "liukastu", "jäinen"] },
    { w: "rauhoittua", ru: "успокоиться", en: "to calm down", forms: ["rauhoittua", "rauhoittukaa", "rauhoitu"] },
    { w: "odottaa", ru: "ждать", en: "to wait", forms: ["odottaa", "odotan", "odottakaa", "odotti", "odottamaan"] },
    { w: "kertoa", ru: "рассказывать, сообщать", en: "to tell", forms: ["kertoa", "kertokaa", "kertoi", "kerro"] },
    { w: "hitaasti", ru: "медленно", en: "slowly", forms: ["hitaasti", "hidas"] },
    { w: "ambulanssi", ru: "скорая помощь", en: "ambulance", forms: ["ambulanssi", "ambulanssin", "ambulansseista"] }
  ],
  items: [
    { fi: "Haloo, hätäkeskus.", ru: "Алло, служба экстренного вызова.", en: "Hello, emergency response center.", k: "d", who: "Työntekijä" },
    { fi: "Hei, tarvitsen äkkiä ambulanssin! Täällä on vanhus joka liukastui pahasti jäisellä tiellä.", ru: "Здравствуйте, мне срочно нужна скорая! Тут пожилой человек, который сильно поскользнулся на обледенелой дороге.", en: "Hi, I need an ambulance quickly! There is an elderly person here who slipped badly on the icy road.", k: "d", who: "Jukka" },
    { fi: "Rauhoittukaa - mikä paikkakunta on kyseessä?", ru: "Успокойтесь — о каком населённом пункте речь?", en: "Please calm down - which district are you in?", k: "d", who: "Työntekijä" },
    { fi: "Helsinki. Hänellä on kovia kipuja, tulkaa äkkiä!", ru: "Хельсинки. Ей очень больно, приезжайте скорее!", en: "Helsinki. She's in a lot of pain, please come soon!", k: "d", who: "Jukka" },
    { fi: "Kertokaa osoite hitaasti.", ru: "Продиктуйте адрес медленно.", en: "Please tell me the address slowly.", k: "d", who: "Työntekijä" },
    { fi: "Tämä on Brahenkadun ja Porvoonkadun kulmassa. Urheilukentän vieressä.", ru: "Это на углу Брахенкату и Порвоонкату. Рядом со спортивной площадкой.", en: "This is at the corner of Brahe street and Porvoo street. Next to the sports field.", k: "d", who: "Jukka" },
    { fi: "Älä sulje puhelinta, poistun hetkeksi linjalta.", ru: "Не кладите трубку, я на минуту отойду с линии.", en: "Please don't hang up, I will go off the line for a moment.", k: "d", who: "Työntekijä" },
    { fi: "No niin, apua on matkalla. Odottakaa siellä, kunnes ambulanssi saapuu.", ru: "Так, помощь уже в пути. Ждите там, пока скорая не приедет.", en: "Okay, help is on the way. Please wait there until the ambulance arrives.", k: "d", who: "Työntekijä" },
    { fi: "Voiko teidät tavoittaa tästä numerosta?", ru: "Вас можно застать по этому номеру?", en: "Can I reach you at this number?", k: "d", who: "Työntekijä" },
    { fi: "Kyllä. Kiitos!", ru: "Да. Спасибо!", en: "Yes. Thank you!", k: "d", who: "Jukka" },
    { fi: "hätäkeskus", ru: "служба экстренного вызова", en: "emergency center", k: "w" },
    { fi: "kertoa", ru: "рассказывать", en: "to tell", k: "w" },
    { fi: "hitaasti", ru: "медленно", en: "slowly", k: "w" },
    { fi: "paikkakunta", ru: "населённый пункт", en: "locality", k: "w" },
    { fi: "rauhoittua", ru: "успокоиться", en: "to calm down", k: "w" },
    { fi: "odottaa", ru: "ждать", en: "to wait", k: "w" },
    { fi: "ambulanssi", ru: "скорая", en: "ambulance", k: "w" },
    { fi: "liukastua", ru: "поскользнуться", en: "to slip", k: "w" },
    { fi: "jäinen", ru: "обледенелый", en: "icy", k: "w" },
    { fi: "kipu", ru: "боль", en: "pain", k: "w" },
    { fi: "Puhelinnumero hätäkeskukseen on 112.", ru: "Номер службы экстренного вызова — 112.", en: "The phone number of the emergency center is 112.", k: "s" },
    { fi: "Isoäitini kertoi minulle kiehtovan tarinan.", ru: "Бабушка рассказала мне захватывающую историю.", en: "My grandmother told me a fascinating story.", k: "s" },
    { fi: "Kävellään hitaasti, jalkaani sattuu.", ru: "Пойдём медленно, у меня болит нога.", en: "Let's walk slowly, my foot hurts.", k: "s" },
    { fi: "Olen kotoisin pieneltä paikkakunnalta.", ru: "Я родом из маленького городка.", en: "I am from a small municipality.", k: "s" },
    { fi: "Koirani ei meinannut millään rauhoittua.", ru: "Моя собака никак не могла успокоиться.", en: "My dog would not calm down.", k: "s" },
    { fi: "En pidä odottamisesta.", ru: "Я не люблю ждать.", en: "I don't like waiting.", k: "s" },
    { fi: "Jouduin odottamaan seuraavaa junaa.", ru: "Мне пришлось ждать следующий поезд.", en: "I had to wait for the next train.", k: "s" },
    { fi: "Odotan sinua puistossa.", ru: "Я жду тебя в парке.", en: "I will wait for you in the park.", k: "s" },
    { fi: "Tie on erittäin jäinen, varo ettet liukastu.", ru: "Дорога очень скользкая, смотри не поскользнись.", en: "The road is very icy, be careful not to slip.", k: "s" },
    { fi: "Lääkärin täytyy olla tavoitettavissa melkein koko ajan.", ru: "Врач должен быть на связи почти всё время.", en: "A doctor must be reachable at almost all times.", k: "s" },
    { fi: "Lue!", ru: "Читай!", en: "Read!", k: "s" },
    { fi: "Syö!", ru: "Ешь!", en: "Eat!", k: "s" },
    { fi: "Herää!", ru: "Просыпайся!", en: "Wake up!", k: "s" },
    { fi: "Älä mene sinne!", ru: "Не ходи туда!", en: "Do not go there!", k: "s" },
    { fi: "Älä sulje puhelinta!", ru: "Не клади трубку!", en: "Do not hang up!", k: "s" },
    { fi: "Istukaa!", ru: "Садитесь!", en: "Sit!", k: "s" },
    { fi: "Juokaa!", ru: "Пейте!", en: "Drink!", k: "s" },
    { fi: "Menkää!", ru: "Идите!", en: "Go!", k: "s" },
    { fi: "Kuunnelkaa minua!", ru: "Послушайте меня!", en: "Listen to me!", k: "s" },
    { fi: "Odottakaa rauhassa!", ru: "Подождите спокойно!", en: "Wait peacefully!", k: "s" },
    { fi: "Rauhoittukaa!", ru: "Успокойтесь!", en: "Calm down!", k: "s" },
    { fi: "Älkää menkö sinne!", ru: "Не ходите туда!", en: "Don't go there!", k: "s" },
    { fi: "Älkää tehkö tyhmyyksiä!", ru: "Не делайте глупостей!", en: "Don't do anything stupid!", k: "s" },
    { fi: "Varokaa heikkoa jäätä!", ru: "Осторожно, тонкий лёд!", en: "Beware of thin ice!", k: "s" },
    { fi: "Siivoa heti huoneesi!", ru: "Сейчас же убери свою комнату!", en: "Clean up your room right now!", k: "s" },
    { fi: "Kuunnelkaa tarkasti!", ru: "Слушайте внимательно!", en: "Listen carefully!", k: "s" }
  ]
},
{
  id: "IN_S1_05",
  title: "Сравнение: лучше, лучший",
  source: "FinnishPod101 · Intermediate S1 #5",
  glossary: [
    { w: "komparatiivin vartalo", ru: "сравнительная степень: что делать с основой", en: "comparative stem changes",
      forms: ["pienempi", "suurempi", "hitaampi", "nopeampi", "kauniimpi", "viisaampi", "onnellisempi", "hauskempi", "ahkerampi", "nuorempi", "kokeneempi", "isompi", "pidempi"],
      note: "Показатель -mpi уже был в уроке 20, здесь — точные правила для основы. Последняя буква основы отбрасывается в трёх случаях:\n• основа кончается на -i: pieni (piene-) → pienempi, suuri (suure-) → suurempi;\n• основа кончается на два гласных: hidas (hitaa-) → hitaampi, kaunis (kaunii-) → kauniimpi, viisas (viisaa-) → viisaampi;\n• в основе три слога и больше и она кончается на a/ä: nopea → nopeampi, onnellinen (onnellise-) → onnellisempi.\nУ двусложных на a/ä конечный гласный переходит в e: hauska → hauskempi. Но у трёхсложных этого не происходит: ahkera → ahkerampi.\nНеправильные: hyvä → parempi, pitkä → pidempi, lyhyt → lyhyempi." },
    { w: "superlatiivi", ru: "превосходная степень: -in", en: "superlative",
      forms: ["isoin", "mukavin", "nuorin", "rennoin", "iloisin", "halvin", "vakavin", "nätein", "kaunein", "rikkain", "tervein", "paras", "pisin", "uusin", "viisain"],
      note: "Показатель -in в номинативе и партитиве, прибавляется к основе. Основа при этом меняется:\n• конечные a, ä или e отбрасываются: halpa (halva-) → halvin, vakava → vakavin, terve (tervee-) → tervein;\n• i и ii переходят в e: nätti (näti-) → nätein, kaunis (kaunii-) → kaunein;\n• из двух одинаковых гласных остаётся один: rikas (rikkaa-) → rikkain.\nБез изменений: iso → isoin, mukava → mukavin, nuori → nuorin, iloinen (iloise-) → iloisin.\nИсключения: hyvä → parempi → paras, pitkä → pidempi → pisin, uusi → uudempi → uusin." },
    { w: "murehtia", ru: "беспокоиться, тревожиться", en: "to worry",
      forms: ["murehtia", "murehdi", "murehtivat", "murhe"],
      note: "От существительного murhe («печаль, горе»), но по смыслу мягче: это тревожиться, а не горевать. Älä murehdi menneistä («Не переживай о прошлом»), Äidit murehtivat aina lapsistaan. Если речь именно о трауре и скорби, нужен surra (урок 24)." },
    { w: "varmaan vai varmasti", ru: "«наверное» против «наверняка»", en: "probably vs surely",
      forms: ["varmaan", "varmasti", "varma"],
      note: "Оба от varma («уверенный, надёжный»), но степень разная. Varmaan — «наверное, скорее всего», с оттенком сомнения: Ruoka on varmaan jo valmista. Varmasti — «точно, безусловно», без сомнений.\nСама уверенность выражается через olla varma: Olen varma, että voitan tällä kerralla. Отрицание — обычное: En ole yhtään varma." },
    { w: "kokenut", ru: "опытный", en: "experienced", forms: ["kokenut", "kokeneempia", "kokeneet", "kokemus"] },
    { w: "mahdollisuus", ru: "возможность, шанс", en: "chance, possibility", forms: ["mahdollisuus", "mahdollisuuksia"] },
    { w: "hakija", ru: "соискатель, кандидат", en: "applicant", forms: ["hakija", "hakijat", "hakijaa"] },
    { w: "rento", ru: "расслабленный, непринуждённый", en: "relaxed", forms: ["rento", "rennoin", "rennosti"] },
    { w: "nuori", ru: "молодой", en: "young", forms: ["nuori", "nuorempi", "nuorin"] }
  ],
  items: [
    { fi: "Hei Vilja! Miten työhaastattelu meni? Oliko haastattelija mukava?", ru: "Привет, Вилья! Как прошло собеседование? Интервьюер был приятный?", en: "Hi Vilja! How was the job interview? Was the interviewer nice?", k: "d", who: "Aino" },
    { fi: "Moi Aino! Hmm, meni se varmaan ihan hyvin. Haastattelija oli ihan mukava ja rento.", ru: "Привет, Айно! Хмм, прошло вроде неплохо. Интервьюер был вполне приятный и расслабленный.", en: "Hi Aino! Hmm, I suppose it went ok. The interviewer was quite nice and relaxed.", k: "d", who: "Vilja" },
    { fi: "Milloin saat tietää, onko paikka sinun?", ru: "Когда узнаешь, твоё ли это место?", en: "When will you know if the position is yours?", k: "d", who: "Aino" },
    { fi: "Loppuviikosta. En tosin ole yhtään varma onko minulla mahdollisuuksia.", ru: "В конце недели. Правда, я совсем не уверена, есть ли у меня шансы.", en: "At the end of the week. However I'm not sure at all if I have a chance.", k: "d", who: "Vilja" },
    { fi: "Kuinka niin?", ru: "Это почему?", en: "How come?", k: "d", who: "Aino" },
    { fi: "No, muut hakijat ovat varmaan nuorempia tai ainakin kokeneempia, kuin minä.", ru: "Ну, другие кандидаты наверняка моложе или хотя бы опытнее меня.", en: "Well, all the other applicants are probably younger or at least more experienced than me.", k: "d", who: "Vilja" },
    { fi: "Älä murehdi. Olen varma, että saat paikan. Olet iloisin ja mukavin ihminen, kenet tunnen!", ru: "Не переживай. Я уверена, что ты получишь место. Ты самый радостный и приятный человек из всех, кого я знаю!", en: "Don't worry. I'm sure you'll get the job. You're the happiest and nicest person I know!", k: "d", who: "Aino" },
    { fi: "mukava", ru: "приятный", en: "nice", k: "w" },
    { fi: "murehtia", ru: "беспокоиться", en: "to worry", k: "w" },
    { fi: "kokenut", ru: "опытный", en: "experienced", k: "w" },
    { fi: "nuori", ru: "молодой", en: "young", k: "w" },
    { fi: "mahdollisuus", ru: "возможность, шанс", en: "chance", k: "w" },
    { fi: "hakija", ru: "соискатель", en: "applicant", k: "w" },
    { fi: "varmaan", ru: "наверное", en: "probably", k: "w" },
    { fi: "varmasti", ru: "наверняка", en: "surely", k: "w" },
    { fi: "rento", ru: "расслабленный", en: "relaxed", k: "w" },
    { fi: "paras", ru: "лучший", en: "the best", k: "w" },
    { fi: "pisin", ru: "самый длинный, самый высокий", en: "the tallest", k: "w" },
    { fi: "uusin", ru: "самый новый", en: "the newest", k: "w" },
    { fi: "Uudet naapurimme ovat oikein mukavia.", ru: "Наши новые соседи очень приятные.", en: "Our new neighbors are very nice.", k: "s" },
    { fi: "Äidit murehtivat aina lapsistaan.", ru: "Матери всегда тревожатся о детях.", en: "Mothers always worry over their children.", k: "s" },
    { fi: "Älä murehdi menneistä.", ru: "Не переживай о прошлом.", en: "Don't worry about the past.", k: "s" },
    { fi: "Isoisäni on kokenut merimies.", ru: "Мой дед — опытный моряк.", en: "My grandpa is an experienced seaman.", k: "s" },
    { fi: "Olet tuossa kuvassa niin nuori.", ru: "На этой фотографии ты такой молодой.", en: "You are so young in that picture.", k: "s" },
    { fi: "Minulla on mahdollisuus lähteä ulkomaille.", ru: "У меня есть возможность уехать за границу.", en: "I have a chance to go abroad.", k: "s" },
    { fi: "Yliopistoon on monta hakijaa.", ru: "В университет много желающих.", en: "There are many applicants to the university.", k: "s" },
    { fi: "Hän on varmaan jo kotona.", ru: "Он, наверное, уже дома.", en: "He is probably at home already.", k: "s" },
    { fi: "Ruoka on varmaan jo valmista.", ru: "Еда, наверное, уже готова.", en: "The food is surely done by now.", k: "s" },
    { fi: "Olen varma, että voitan tällä kerralla.", ru: "Я уверен, что в этот раз выиграю.", en: "I am sure that I'm going to win this time.", k: "s" },
    { fi: "Anna on pidempi kuin Emma.", ru: "Анна выше Эммы.", en: "Anna is taller than Emma.", k: "s" },
    { fi: "Isoveljeni on viisaampi kuin minä.", ru: "Мой старший брат мудрее меня.", en: "My big brother is wiser than me.", k: "s" },
    { fi: "Olen nuorempi kuin sinä.", ru: "Я моложе тебя.", en: "I am younger than you.", k: "s" },
    { fi: "Naapurin koira on isompi kuin sinun koirasi.", ru: "Соседская собака больше твоей.", en: "The neighbor's dog is bigger than your dog.", k: "s" },
    { fi: "Sinisen joukkueen juoksijat ovat nopeampia kuin punaisen joukkueen juoksijat.", ru: "Бегуны синей команды быстрее бегунов красной.", en: "The blue team's runners are faster than the red team's runners.", k: "s" },
    { fi: "Hän on viisain mies, jonka koskaan olen tavannut.", ru: "Он самый мудрый человек, которого я встречал.", en: "He is the wisest man that I have ever met.", k: "s" },
    { fi: "Tämä on halvin vaihtoehto.", ru: "Это самый дешёвый вариант.", en: "This is the cheapest option.", k: "s" },
    { fi: "Hän on rikkain ihminen kylässä.", ru: "Он самый богатый человек в деревне.", en: "He is the richest person in the village.", k: "s" },
    { fi: "Tämä on kaunein kuva.", ru: "Это самая красивая картина.", en: "This is the most beautiful picture.", k: "s" },
    { fi: "Hän on perheen nuorin.", ru: "Он самый младший в семье.", en: "He is the youngest in the family.", k: "s" }
  ]
},
{
  id: "IN_S1_06",
  title: "Сломалось: жалоба и гарантия",
  source: "FinnishPod101 · Intermediate S1 #6",
  glossary: [
    { w: "kieltoverbi", ru: "отрицательный глагол: en, et, ei, emme, ette, eivät", en: "the negative verb",
      forms: ["en", "et", "ei", "emme", "ette", "eivät", "ole", "toimi", "tarkenna", "käynnisty", "jousta"],
      note: "В финском отрицание — это отдельный глагол, который спрягается по лицам: en, et, ei, emme, ette, eivät. По временам и наклонениям он не меняется.\nОсновной глагол при этом теряет личное окончание и остаётся в слабой основе: её находят, взяв форму первого лица на minä и убрав -n. toimin → ei toimi, tarkennan → ei tarkenna, käynnistyn → ei käynnisty, joustan → ei jousta.\nПри жалобах на товар чаще всего нужны третьи лица: ei toimi («не работает»), eivät toimi («не работают»)." },
    { w: "kieltosanat", ru: "усилители отрицания", en: "words used with negation",
      forms: ["ollenkaan", "lainkaan", "varsinkaan", "yhtään", "enää", "eikä", "enkä"],
      note: "Слова, которые встречаются только рядом с отрицанием: ollenkaan и lainkaan («вовсе»), varsinkaan («особенно не»), yhtään («ни одного, нисколько»), enää («больше не», урок 1 уровня Beginner).\nTämä ei jousta lainkaan, Autoni ei käynnisty enää ollenkaan, Myymälässä ei ole yhtään myyjää.\nСоюз ja в отрицательном предложении превращается в eikä, а с первым лицом — в enkä: Nämä ovat vain perusmalleja, eikä näissä ole kameraa. En pidä sienistä, enkä varsinkaan kanttarelleista." },
    { w: "indikatiivi", ru: "изъявительное наклонение: просто факты", en: "the indicative mood",
      forms: ["sammuu", "pitää", "loppuu", "välkkynyt", "painan"],
      note: "Наклонение без особого показателя — просто основа плюс личное окончание. Им сообщают факты, а не чувства и мнения. При жалобе на товар пригождается во всех своих смыслах:\nповторяющееся действие — Ruutu sammuu joka kerta («Экран гаснет каждый раз»);\nдлящееся — Kytkin pitää kovaa ääntä («Переключатель громко трещит»);\nближайшее будущее — Virta loppuu viiden minuutin kuluttua;\nпостоянное состояние — Varaosaliike on liian kaukana;\nа также условие — Jos painan tästä napista..." },
    { w: "ei toimi kunnolla", ru: "не работает как следует", en: "doesn't work properly",
      forms: ["toimia", "toimii", "kunnolla", "kunnollinen"],
      note: "Три части: ei + toimia («функционировать») + kunnolla («как следует»). Если убрать kunnolla, получится «не работает вообще»: Tämä tietokone ei toimi. Без отрицания — toimia kunnolla («работать как надо»): Lukko ei toimi enää kunnolla." },
    { w: "vara- ja perus-", ru: "приставки «запасной» и «базовый»", en: "spare and basic",
      forms: ["varapuhelin", "vara-auto", "vara-avain", "perusmalli", "peruspyörä", "perus"],
      note: "Две продуктивные первые части сложных слов. Vara- значит «запасной»: varapuhelin («запасной телефон»), vara-auto, vara-avain. Perus- значит «базовый»: perusmalli («базовая модель»), peruspyörä («простой велосипед»). Их можно приставлять к почти любому существительному." },
    { w: "takuu", ru: "гарантия", en: "warranty", forms: ["takuu", "takuun", "takuuta"] },
    { w: "veloitukseton", ru: "бесплатный, без взимания платы", en: "free of charge", forms: ["veloitukseton", "veloituksetta"] },
    { w: "tallella", ru: "в сохранности, на месте", en: "intact, kept", forms: ["tallella", "tallessa"] },
    { w: "tarkentaa", ru: "фокусировать(ся); уточнять", en: "to focus", forms: ["tarkentaa", "tarkenna", "tarkentaako"] },
    { w: "korjata", ru: "чинить; исправлять", en: "to repair", forms: ["korjata", "korjaus", "korjauksen", "korjaamme"] }
  ],
  items: [
    { fi: "Hei. Ostin teiltä puhelimen pari kuukautta sitten. Puhelimen kamera ei toimi enää kunnolla.", ru: "Здравствуйте. Я купил у вас телефон пару месяцев назад. Камера уже не работает как следует.", en: "Hello. I bought a phone from you a couple of months ago. The camera isn't working properly anymore.", k: "d", who: "Heikki" },
    { fi: "Ahaa. Mikä on vialla?", ru: "Понятно. Что с ней не так?", en: "I see. What's wrong?", k: "d", who: "Työntekijä" },
    { fi: "Kamera ei tarkenna enää ollenkaan. Tarvitsen kameraa työssäni, joten tämä on todella ongelmallista.", ru: "Камера вообще перестала фокусироваться. Она нужна мне для работы, так что это серьёзная проблема.", en: "The camera doesn't focus at all anymore. I need the camera for my job, so this is really a problem.", k: "d", who: "Heikki" },
    { fi: "Onko teillä kuitti tallella?", ru: "Чек у вас сохранился?", en: "Do you still have your receipt?", k: "d", who: "Työntekijä" },
    { fi: "Kyllä on, kas tässä.", ru: "Да, вот он.", en: "Yes I do, here you go.", k: "d", who: "Heikki" },
    { fi: "Kuitin mukaan puhelimessa on vielä takuu voimassa, joten voimme korjata sen veloituksetta.", ru: "По чеку гарантия на телефон ещё действует, так что мы можем починить его бесплатно.", en: "According to the receipt the phone is still under warranty, so we can fix it free of charge.", k: "d", who: "Työntekijä" },
    { fi: "Kuinka kauan siinä kestää?", ru: "Сколько это займёт?", en: "How long does it take?", k: "d", who: "Heikki" },
    { fi: "Noin kaksi viikkoa.", ru: "Около двух недель.", en: "Approximately two weeks.", k: "d", who: "Työntekijä" },
    { fi: "En voi olla ilman puhelinta niin kauan!", ru: "Я не могу быть без телефона так долго!", en: "I can't be without a phone for that long!", k: "d", who: "Heikki" },
    { fi: "Saatte varapuhelimen korjauksen ajaksi, mutta nämä ovat vain perusmalleja, eikä näissä ole kameraa.", ru: "На время ремонта дадим запасной телефон, но это простые модели, и камеры в них нет.", en: "You'll get a spare phone for the duration of the repair, but these are just basic models, which don't have cameras.", k: "d", who: "Työntekijä" },
    { fi: "Ahaa, selvä. Minun täytyy sitten yrittää saada ystäviltäni kameraa lainaksi.", ru: "Ага, ясно. Тогда придётся попробовать одолжить камеру у друзей.", en: "I see, okay. I suppose I need to try to borrow a camera from my friends then.", k: "d", who: "Heikki" },
    { fi: "toimia", ru: "работать, функционировать", en: "to work", k: "w" },
    { fi: "takuu", ru: "гарантия", en: "warranty", k: "w" },
    { fi: "veloitukseton", ru: "бесплатный", en: "free of charge", k: "w" },
    { fi: "tallella", ru: "в сохранности", en: "intact", k: "w" },
    { fi: "kuitti", ru: "чек", en: "receipt", k: "w" },
    { fi: "perusmalli", ru: "базовая модель", en: "basic model", k: "w" },
    { fi: "kunnolla", ru: "как следует", en: "properly", k: "w" },
    { fi: "tarkentaa", ru: "фокусироваться", en: "to focus", k: "w" },
    { fi: "ollenkaan", ru: "вовсе (с отрицанием)", en: "at all", k: "w" },
    { fi: "varapuhelin", ru: "запасной телефон", en: "spare phone", k: "w" },
    { fi: "korjata", ru: "чинить", en: "to repair", k: "w" },
    { fi: "vialla", ru: "неисправно", en: "wrong, broken", k: "w" },
    { fi: "Tämä tietokone ei toimi.", ru: "Этот компьютер не работает.", en: "This computer doesn't work.", k: "s" },
    { fi: "Tämä pesukone toimii vielä hyvin, vaikka onkin yli 20 vuotta vanha.", ru: "Эта стиральная машина работает хорошо, хотя ей больше двадцати лет.", en: "This washing machine still works fine, even though it is over twenty years old.", k: "s" },
    { fi: "Lukko ei toimi enää kunnolla.", ru: "Замок больше не работает как следует.", en: "The lock does not work well anymore.", k: "s" },
    { fi: "Sähkölaitteiden takuu on nykyään usein vain pari vuotta.", ru: "Гарантия на электронику сейчас часто всего пара лет.", en: "The warranty for electronic devices is nowadays often only a couple of years.", k: "s" },
    { fi: "Jos liityt tänään, ensimmäinen kuukausi on veloitukseton.", ru: "Если вступишь сегодня, первый месяц бесплатный.", en: "If you join today, the first month is free of charge.", k: "s" },
    { fi: "Onko sinulla vanhat päiväkirjasi vielä tallella?", ru: "У тебя ещё сохранились старые дневники?", en: "Do you still have your old journals?", k: "s" },
    { fi: "Puhelimen perusmalli on edullisin.", ru: "Базовая модель телефона самая дешёвая.", en: "The basic model of the phone is the cheapest.", k: "s" },
    { fi: "Tee kotitehtäväsi kunnolla!", ru: "Сделай домашку как следует!", en: "Do your homework properly!", k: "s" },
    { fi: "Tämä kamera tarkentaa todella nopeasti.", ru: "Эта камера фокусируется очень быстро.", en: "This camera focuses really quickly.", k: "s" },
    { fi: "En muista viime oppitunnin asioita enää ollenkaan.", ru: "Я совсем не помню, что было на прошлом занятии.", en: "I don't remember the things from last lesson at all anymore.", k: "s" },
    { fi: "Voitko lainata minulle varapuhelintasi?", ru: "Можешь одолжить мне свой запасной телефон?", en: "Can you lend me your spare phone?", k: "s" },
    { fi: "Tässä perusmallissa ei ole mitään erikoisuuksia.", ru: "В этой базовой модели нет ничего особенного.", en: "There are no special features in this basic model.", k: "s" },
    { fi: "Ruutu sammuu joka kerta.", ru: "Экран гаснет каждый раз.", en: "The screen switches off every time.", k: "s" },
    { fi: "Kytkin pitää kovaa ääntä.", ru: "Переключатель громко трещит.", en: "The switch is making a loud noise.", k: "s" },
    { fi: "Virta loppuu viiden minuutin kuluttua.", ru: "Через пять минут зарядка кончится.", en: "The power will run out after five minutes.", k: "s" },
    { fi: "Se on välkkynyt kaksi tuntia.", ru: "Оно мигает уже два часа.", en: "It has been blinking for two hours.", k: "s" },
    { fi: "Tämä ei jousta lainkaan.", ru: "Это совсем не гнётся.", en: "This does not stretch at all.", k: "s" },
    { fi: "Autoni ei käynnisty enää ollenkaan.", ru: "Моя машина вообще перестала заводиться.", en: "My car does not start at all anymore.", k: "s" },
    { fi: "En pidä sienistä, enkä varsinkaan kanttarelleista.", ru: "Я не люблю грибы, и особенно лисички.", en: "I don't like mushrooms, and especially not chanterelles.", k: "s" },
    { fi: "Myymälässä ei ole yhtään myyjää.", ru: "В магазине нет ни одного продавца.", en: "There are no sales assistants in the shop.", k: "s" },
    { fi: "Avain on vääntynyt, en voi avata ovea.", ru: "Ключ погнулся, я не могу открыть дверь.", en: "The key is twisted, I can't open the door.", k: "s" },
    { fi: "Kynästä ei tule enää mustetta.", ru: "Из ручки больше не идут чернила.", en: "There is no more ink coming from the pen.", k: "s" },
    { fi: "Paperi on loppu, tämä on todella harmillista.", ru: "Бумага кончилась, это очень досадно.", en: "The paper has run out, this is really annoying.", k: "s" }
  ]
},
];

const LESSONS_BE2 = [
{
  id: "BE_S1_02",
  title: "Заселение в отель",
  source: "FinnishPod101 · Beginner S1 #2",
  glossary: [
    { w: "olisiko mahdollista", ru: "было бы возможно...? — вежливая просьба", en: "would it be possible to...?",
      forms: ["olisiko", "mahdollista", "mahdollinen"],
      note: "Кондиционал от olla + mahdollista («возможно»), а дальше глагол saada («получить») в инфинитиве и то, что хочется получить: Olisiko mahdollista saada huone merinäköalalla?, Olisiko mahdollista saada lisävuode? («Можно ли получить дополнительную кровать?»), Olisiko mahdollista saada huone parvekkeella?" },
    { w: "varaus nimellä", ru: "бронь: «на имя» — адессив", en: "reservation under a name",
      forms: ["nimellä", "varaus", "varauksenne", "varausta"],
      note: "«На имя» по-фински — существительное nimi в адессиве: Minulla on varaus nimellä + имя. Спрашивают так: Millä nimellä varaus on tehty? Слово varaus («бронь») пригождается везде: vaatimus lentokoneeseen, huonevaraus, pöytävaraus." },
    { w: "kahden hengen huone", ru: "номер на двоих: число + henki в генитиве", en: "a room for two people",
      forms: ["kahden hengen huone", "neljän hengen huone", "henki", "hengen"],
      note: "Схема: число + henki («человек») в генитиве + huone («номер»). Kahden hengen huone — «номер на двоих», по тому же образцу neljän hengen huone — «на четверых». Henki в этом смысле — устаревшая форма от henkilö, сохранившаяся в устойчивых выражениях." },
    { w: "kirjautua sisään/ulos", ru: "заселиться / выселиться", en: "to check in / check out",
      forms: ["kirjautua", "kirjaudun", "sisään", "ulos", "uloskirjautuminen", "kirjautuminen"],
      note: "Kirjautua sisään — «зайти, зарегистрироваться» (заселение), kirjautua ulos — «выселиться». Существительное uloskirjautuminen («выселение») составлено из ulos («наружу») и kirjautuminen («вход, регистрация»). То же слово используют и для выхода из электронной почты или другого сервиса." },
    { w: "merinäköala", ru: "вид на море", en: "sea view",
      forms: ["merinäköala", "merinäköalalla", "vuoristonäköala"],
      note: "Meri («море») + näköala («вид»). Первую часть легко заменить: vuoristonäköala — «вид на горы». Täältä on upea merinäköala." },
    { w: "ylihuomenna", ru: "послезавтра", en: "the day after tomorrow", forms: ["ylihuomenna", "ylihuomiseksi"] },
    { w: "varaus", ru: "бронь, резервация", en: "reservation", forms: ["varaus", "varauksenne", "varausta"] },
    { w: "huone", ru: "комната, номер", en: "room", forms: ["huone", "huoneessa", "huoneen"] }
  ],
  items: [
    { fi: "Päivää! Haluaisimme kirjautua sisään, meillä pitäisi olla varaus.", ru: "Добрый день! Мы хотели бы заселиться, у нас должна быть бронь.", en: "Good afternoon! We would like to check in. We should have a reservation.", k: "d", who: "Aino" },
    { fi: "Päivää, ja tervetuloa! Millä nimellä varaus on tehty?", ru: "Добрый день, добро пожаловать! На какое имя бронь?", en: "Good afternoon, and welcome! What name is your reservation under?", k: "d", who: "Vastaanottovirkailija" },
    { fi: "Se on nimellä Virtanen. Aino ja Heikki Virtanen.", ru: "На имя Виртанен. Айно и Хейкки Виртанен.", en: "It's under the name Virtanen. Aino and Heikki Virtanen.", k: "d", who: "Aino" },
    { fi: "Kyllä vain, löysin varauksenne. Kahden hengen huone kahdeksi yöksi.", ru: "Да, нашёл вашу бронь. Номер на двоих на две ночи.", en: "Oh yes, I found your reservation. A room for two people, for two nights.", k: "d", who: "Vastaanottovirkailija" },
    { fi: "Olisiko mahdollista saada huone merinäköalalla?", ru: "Можно ли получить номер с видом на море?", en: "Would it be possible to get a room with an ocean view?", k: "d", who: "Aino" },
    { fi: "Hetki, tarkistan. Kyllä, onnistuu!", ru: "Минутку, проверю. Да, получится!", en: "Just a moment, I'll check. Yes, it can be done!", k: "d", who: "Vastaanottovirkailija" },
    { fi: "Uloskirjautuminen on ylihuomenna kello 12 mennessä.", ru: "Выселение послезавтра до двенадцати.", en: "Check out will be the day after tomorrow by twelve o'clock.", k: "d", who: "Vastaanottovirkailija" },
    { fi: "Toivotan teille viihtyisää oleskelua!", ru: "Желаю вам приятного пребывания!", en: "Have a pleasant stay!", k: "d", who: "Vastaanottovirkailija" },
    { fi: "kirjautua", ru: "заселиться, войти", en: "to check in", k: "w" },
    { fi: "uloskirjautuminen", ru: "выселение", en: "check-out", k: "w" },
    { fi: "ylihuomenna", ru: "послезавтра", en: "the day after tomorrow", k: "w" },
    { fi: "merinäköala", ru: "вид на море", en: "ocean view", k: "w" },
    { fi: "varaus", ru: "бронь", en: "reservation", k: "w" },
    { fi: "huone", ru: "номер, комната", en: "room", k: "w" },
    { fi: "kahden hengen huone", ru: "номер на двоих", en: "room for two", k: "w" },
    { fi: "Kirjaudun ensin hotelliin, ja sitten menen ravintolaan.", ru: "Сначала заселюсь в отель, а потом пойду в ресторан.", en: "I will check into the hotel first, and then I will go to a restaurant.", k: "s" },
    { fi: "Mielestäni hotellin uloskirjautuminen on aina liian aikaisin.", ru: "По-моему, выселение из отеля всегда слишком рано.", en: "I think the hotel check-out is always too early.", k: "s" },
    { fi: "Hänellä on suuria suunnitelmia ylihuomiseksi.", ru: "У неё большие планы на послезавтра.", en: "She has big plans for the day after tomorrow.", k: "s" },
    { fi: "Menen ystäväni juhliin ylihuomenna.", ru: "Послезавтра иду на праздник к другу.", en: "I will go to my friend's party the day after tomorrow.", k: "s" },
    { fi: "Tämän pitäisi olla valmis ylihuomenna.", ru: "Это должно быть готово послезавтра.", en: "This should be ready the day after tomorrow.", k: "s" },
    { fi: "Vaikka matkustan yksin, haluan aina nukkua kahden hengen huoneessa.", ru: "Хоть я и путешествую одна, всегда хочу спать в номере на двоих.", en: "Even though I travel alone, I always want to sleep in a room for two people.", k: "s" },
    { fi: "Haluan laivalla aina hytin merinäköalalla.", ru: "На корабле я всегда хочу каюту с видом на море.", en: "I always want a cabin with an ocean view on the cruise ship.", k: "s" },
    { fi: "Onko sinulla varausta?", ru: "У тебя есть бронь?", en: "Do you have a reservation?", k: "s" },
    { fi: "Jos sinulla ei ole varausta, sinun täytyy odottaa pöytää ainakin kaksi tuntia.", ru: "Если у тебя нет брони, придётся ждать столик минимум два часа.", en: "If you don't have a reservation, you will have to wait at least two hours for a table.", k: "s" },
    { fi: "Teimme varauksemme melkein kaksi kuukautta etukäteen.", ru: "Мы забронировали почти за два месяца заранее.", en: "We made our reservation almost two months earlier.", k: "s" },
    { fi: "Minulla on varaus hotelliin.", ru: "У меня есть бронь в отеле.", en: "I have a reservation at a hotel.", k: "s" },
    { fi: "Varaus on tehty sinun nimelläsi.", ru: "Бронь оформлена на твоё имя.", en: "The reservation is under your name.", k: "s" },
    { fi: "Vahtimestari kantoi laukkumme huoneeseemme.", ru: "Портье отнёс наши сумки в номер.", en: "A porter carried our bags to our room.", k: "s" },
    { fi: "Minun täytyy siivota huoneeni tänä iltana.", ru: "Мне надо убрать свою комнату сегодня вечером.", en: "I need to clean up my room tonight.", k: "s" },
    { fi: "Haluaisin yhden huoneen.", ru: "Я бы хотел один номер.", en: "I'd like a room.", k: "s" },
    { fi: "Täältä on upea merinäköala.", ru: "Отсюда прекрасный вид на море.", en: "The ocean view from here is astonishing.", k: "s" },
    { fi: "Voisitteko tavata sen, kiitos?", ru: "Не могли бы вы продиктовать по буквам, пожалуйста?", en: "Could you spell it, please?", k: "s" },
    { fi: "Huomenta, olisiko mahdollista kirjautua sisään jo tähän aikaan?", ru: "Доброе утро, можно заселиться уже в это время?", en: "Good morning, is it possible to check in already?", k: "s" },
    { fi: "Varauksen pitäisi löytyä nimellä Nieminen.", ru: "Бронь должна быть на имя Ниеминен.", en: "The reservation should be under the name Nieminen.", k: "s" },
    { fi: "Haluaisin kirjautua ulos vasta iltapäivällä. Onko se mahdollista?", ru: "Я бы хотел выселиться только после обеда. Это возможно?", en: "I wouldn't want to check out until the afternoon. Is that possible?", k: "s" }
  ]
},
{
  id: "BE_S1_03",
  title: "На почте: письма и посылки",
  source: "FinnishPod101 · Beginner S1 #3",
  glossary: [
    { w: "adverbin komparatiivi", ru: "сравнительная степень наречия: -mmin", en: "comparative of adverbs",
      forms: ["nopeasti", "nopeammin", "nopeimmin", "hitaasti", "hitaammin", "vahvasti", "vahvemmin", "sievästi", "sievemmin"],
      note: "Наречия образуются от прилагательного через -sti: nopea → nopeasti («быстро»). Сравнительная степень — через -mmin: nopeampi (сравн. прилагательного) → nopeammin («быстрее»), hidas → hitaasti → hitaammin.\nУ двусложных на a/ä тот же переход в e, что и у прилагательных (урок 20): vahva → vahvemmin, sievä → sievemmin.\nВ прогрессии: Toisen luokan kirje toimitetaan nopeasti («доставляется быстро») → Ensimmäisen luokan kirje toimitetaan nopeammin («быстрее») → Express-kirje toimitetaan nopeimmin («быстрее всего»)." },
    { w: "postiasiointi", ru: "фразы на почте", en: "post office phrases",
      forms: ["lähettää", "haluaisin lähettää", "haluaisin ostaa", "lentopostina", "kakkosluokan postina"],
      note: "Отправить: Haluaisin lähettää tämän kirjeen / paketin / postikortin, при желании уточнить способ в конце: lentopostina («авиапочтой»), kakkosluokan postina.\nКупить: Haluaisin ostaa ykkösluokan postimerkkejä, kirjekuoria («конверты»), postikortteja." },
    { w: "ykkösluokka ja kakkosluokka", ru: "приоритетная и обычная почта", en: "priority and economy mail",
      forms: ["ykkösluokka", "kakkosluokka", "pikapaketti", "postipaketti"],
      note: "Ykkösluokka («первый класс») доставляется быстрее и дороже, kakkosluokka («второй класс») медленнее и дешевле. Для посылок аналогично: pikapaketti («экспресс») против tavallinen postipaketti («обычная посылка»)." },
    { w: "posti-yhdyssanat", ru: "составные слова с posti", en: "compound words with posti",
      forms: ["postikortti", "postimerkki", "postitoimisto", "syntymäpäiväkortti", "joulupostimerkki"],
      note: "posti («почта») + kortti («открытка») = postikortti; posti + merkki («знак») = postimerkki («марка»); posti + toimisto = postitoimisto. Первую часть легко заменить: syntymäpäiväkortti («открытка на день рождения»)." },
    { w: "kiire", ru: "спешка, срочность", en: "hurry, rush", forms: ["kiire", "kiirettä", "kovin kiire"] },
    { w: "kirje", ru: "письмо", en: "letter", forms: ["kirje", "kirjeet", "kirjettä", "kirjeen"] },
    { w: "postipaketti", ru: "почтовая посылка", en: "postal parcel", forms: ["postipaketti", "postipaketin", "postipakettia"] }
  ],
  items: [
    { fi: "Hei! Haluaisin lähettää nämä kirjeet, sekä tämän postipaketin.", ru: "Здравствуйте! Я хотел бы отправить эти письма и вот эту посылку.", en: "Hello! I would like to send these letters, and this package, too.", k: "d", who: "Heikki" },
    { fi: "Ahaa. Haluatteko lähettää kirjeet ykkös- vai kakkosluokassa?", ru: "Ясно. Отправить письма первым или вторым классом?", en: "Would you like to send the letters as priority or economy mail?", k: "d", who: "Postivirkailija" },
    { fi: "Ykkösluokan kirjeet jaetaan nopeammin, kakkosluokan kirjeissä menee hiukan kauemmin.", ru: "Письма первого класса доставляются быстрее, у второго класса чуть дольше.", en: "The priority mail letters are distributed faster, the economy mail letters take a little bit longer.", k: "d", who: "Postivirkailija" },
    { fi: "Kirjeillä ei ole kovin kiire, joten kakkosluokka käy hyvin.", ru: "Письма не очень срочные, так что второй класс отлично подойдёт.", en: "The letters aren't very urgent, so economy mail will do just fine.", k: "d", who: "Heikki" },
    { fi: "Selvä. Sitten tämä postipaketti. Haluaisitteko lähettää tämän pikapakettina vai tavallisena postipakettina?", ru: "Ясно. Теперь эта посылка. Отправить экспрессом или обычной посылкой?", en: "Okay. Then the package. Would you like to send it as an express package or as a regular postal package?", k: "d", who: "Postivirkailija" },
    { fi: "Pikapaketti on kalliimpi kuin tavallinen postipaketti, mutta myös nopeampi.", ru: "Экспресс дороже обычной посылки, но и быстрее.", en: "The express package is more expensive than regular postal package, but it's also faster.", k: "d", who: "Postivirkailija" },
    { fi: "Haluaisin lähettää sen tavallisena postipakettina, kiitos.", ru: "Я хотел бы отправить обычной посылкой, спасибо.", en: "I would like to send it as a regular postal package, thank you.", k: "d", who: "Heikki" },
    { fi: "Kiitos!", ru: "Спасибо!", en: "Thank you!", k: "d", who: "Postivirkailija" },
    { fi: "lähettää", ru: "отправлять", en: "to send", k: "w" },
    { fi: "kiire", ru: "спешка", en: "hurry", k: "w" },
    { fi: "kirje", ru: "письмо", en: "letter", k: "w" },
    { fi: "postipaketti", ru: "посылка", en: "parcel", k: "w" },
    { fi: "ykkösluokka", ru: "первый класс", en: "priority, first class", k: "w" },
    { fi: "kakkosluokka", ru: "второй класс, эконом", en: "economy", k: "w" },
    { fi: "pikapaketti", ru: "экспресс-посылка", en: "express parcel", k: "w" },
    { fi: "nopeammin", ru: "быстрее", en: "faster", k: "w" },
    { fi: "kauemmin", ru: "дольше", en: "longer", k: "w" },
    { fi: "kalliimpi", ru: "дороже", en: "more expensive", k: "w" },
    { fi: "postimerkki", ru: "марка", en: "stamp", k: "w" },
    { fi: "postikortti", ru: "открытка", en: "postcard", k: "w" },
    { fi: "Lähetän tämän pakkauksen huomenna.", ru: "Я отправлю эту посылку завтра.", en: "I will send this package tomorrow.", k: "s" },
    { fi: "Tänä vuonna aion lähettää paljon joulukortteja.", ru: "В этом году я собираюсь отправить много рождественских открыток.", en: "This year I'm going to send lots of Christmas cards.", k: "s" },
    { fi: "Lähetän sinulle postikortin.", ru: "Я пришлю тебе открытку.", en: "I will send you a postcard.", k: "s" },
    { fi: "En ehdi jutella nyt, minulla on kiire.", ru: "Не могу сейчас поболтать, я спешу.", en: "I don't have time to talk now, I'm in a hurry.", k: "s" },
    { fi: "Minä en tule autolla, vaan kävellen, joten minulla menee kauemmin.", ru: "Я не на машине, а пешком, так что у меня уйдёт больше времени.", en: "I'm not coming by car, but on foot, so it will take longer.", k: "s" },
    { fi: "Haluaisin juosta nopeammin!", ru: "Я хочу бегать быстрее!", en: "I want to run faster!", k: "s" },
    { fi: "Kakkosluokan postimaksut ovat edullisia.", ru: "Тарифы второго класса недорогие.", en: "The economy class postage fees are inexpensive.", k: "s" },
    { fi: "Tämä mekko on kalliimpi, mutta se on myös kauniimpi.", ru: "Это платье дороже, но зато и красивее.", en: "This dress is more expensive, but it's also more beautiful.", k: "s" },
    { fi: "Pikapaketin lähettäminen on kallista.", ru: "Отправка экспресс-посылки дорогая.", en: "Sending an express package is expensive.", k: "s" },
    { fi: "Kirjoitin ystävälleni kirjeen.", ru: "Я написал письмо другу.", en: "I wrote a letter to my friend.", k: "s" },
    { fi: "Käsinkirjoitetut kirjeet ovat nykyään harvinaisia.", ru: "Написанные от руки письма сейчас редкость.", en: "Hand-written letters are rare nowadays.", k: "s" },
    { fi: "Haluaisin lähettää tämän kirjeen siskolleni.", ru: "Я хотел бы отправить это письмо сестре.", en: "I would like to send this letter to my sister.", k: "s" },
    { fi: "Tämä postipaketti on todella painava!", ru: "Эта посылка очень тяжёлая!", en: "This package is really heavy!", k: "s" },
    { fi: "Ykkösluokan kirjeet jaetaan todella nopeasti.", ru: "Письма первого класса доставляются очень быстро.", en: "The priority class letters are distributed really fast.", k: "s" },
    { fi: "Pikkuveljeni kerää postimerkkejä.", ru: "Мой младший брат собирает марки.", en: "My little brother collects stamps.", k: "s" },
    { fi: "Minun täytyy noutaa postipaketti postitoimistosta.", ru: "Мне надо забрать посылку с почты.", en: "I need to pick up a parcel from the post office.", k: "s" },
    { fi: "Punainen paketti on kevyempi kuin vihreä paketti.", ru: "Красная посылка легче зелёной.", en: "The red parcel is lighter than the green parcel.", k: "s" },
    { fi: "Ruskea teippi on kestävämpi kuin valkoinen teippi.", ru: "Коричневый скотч прочнее белого.", en: "The brown tape is more durable than the white.", k: "s" },
    { fi: "Tarvitsen ykkösluokan postimerkkejä.", ru: "Мне нужны марки первого класса.", en: "I need some priority mail stamps.", k: "s" },
    { fi: "Yritykset lähettävät kirjeet usein kakkosluokassa.", ru: "Компании часто отправляют письма вторым классом.", en: "Companies often send letters economy class.", k: "s" }
  ]
},
{
  id: "BE_S1_04",
  title: "Потерянный багаж в аэропорту",
  source: "FinnishPod101 · Beginner S1 #4",
  glossary: [
    { w: "anteeksi + описание пропажи", ru: "как сообщить о потере", en: "reporting a loss",
      forms: ["anteeksi", "jätin", "unohdin", "ei saapunut", "en löydä"],
      note: "Схема: Anteeksi + глагол с объектом + место. Anteeksi, jätin takkini junaan («Извините, я оставил куртку в поезде»), Anteeksi, unohdin laukkuni asemalle, Anteeksi, laukkuni ei saapunut, Anteeksi, en löydä laukkuani.\nAnteeksi тут не просто вежливость: это же слово начинает разговор с незнакомцем, извинение и просьбу — три случая сразу." },
    { w: "kadonneen kuvailu", ru: "как описать потерянную вещь", en: "describing lost property",
      forms: ["se on", "musta", "nahkainen", "olkalaukku", "siinä on", "raidoilla"],
      note: "Порядок слов фиксированный: se on («это») + прилагательное(-ые) + существительное. Se on musta, nahkainen olkalaukku («Это чёрная кожаная сумка через плечо»), Se on pieni keltainen reppu.\nДобавить подробности можно через ja siinä on... («и у неё есть...») или ja se on... («и она...»): Se on suuri sininen salkku, ja siinä on musta kahva. Узор описывают через адессив множественного: valkoinen reppu keltaisilla raidoilla («белый рюкзак с жёлтыми полосками»)." },
    { w: "matkalaukku ja sukulaiset", ru: "виды сумок", en: "types of bags",
      forms: ["matkalaukku", "käsimatkatavara", "rinkka", "reppu", "urheilukassi", "salkku", "olkalaukku", "kassi"],
      note: "matkalaukku («чемодан», буквально «дорожная сумка»), käsimatkatavara («ручная кладь»), rinkka («большой туристический рюкзак»), reppu («обычный рюкзак»), urheilukassi («спортивная сумка»), salkku («портфель»), olkalaukku («сумка через плечо»), kassi («пакет, сумка-тоут»)." },
    { w: "epä-", ru: "приставка отрицания качества", en: "negative prefix",
      forms: ["epähuomiossa", "epäselvä", "epätavallinen"],
      note: "Продуктивная приставка вроде русского «не-» или английского un-. Huomio («внимание») → epähuomiossa («по невнимательности, случайно»); selvä («ясный») → epäselvä («неясный»)." },
    { w: "toimittaa", ru: "доставлять; поставлять", en: "to deliver", forms: ["toimittaa", "toimitetaan", "toimitamme", "toimittaminen"] },
    { w: "hukassa", ru: "потерянный, пропавший", en: "missing, lost", forms: ["hukassa", "hukka"] },
    { w: "saapua", ru: "прибывать", en: "to arrive", forms: ["saapua", "saavuin", "saapuivat", "saapunut"] },
    { w: "hakea", ru: "забирать, получать", en: "to pick up, to fetch", forms: ["hakea", "haen", "hakemaan"] }
  ],
  items: [
    { fi: "Hei! Saavuin juuri Roomasta ja odotin matkalaukkujani, mutta ne eivät saapuneet matkalaukkuhihnalle.", ru: "Здравствуйте! Я только что прилетела из Рима и ждала свои чемоданы, но они не появились на ленте.", en: "Hello! I just arrived from Rome and I was waiting for my bags, but they didn't arrive on the luggage conveyor belt.", k: "d", who: "Aino" },
    { fi: "Voi miten harmillista. Kuinka monta laukkua teiltä on hukassa?", ru: "Ох, как досадно. Сколько у вас пропало сумок?", en: "Oh, that's too bad. How many bags are you missing?", k: "d", who: "Lentokentän virkailija" },
    { fi: "Kaksi laukkua. Yksi sininen urheilukassi, ja yksi musta matkalaukku.", ru: "Две сумки. Одна синяя спортивная сумка и один чёрный чемодан.", en: "Two bags. One blue sports bag, and one black suitcase.", k: "d", who: "Aino" },
    { fi: "Saisinko nähdä matkalaukkujenne lipukkeet, niin yritän selvittää mitä tapahtui?", ru: "Можно посмотреть ваши бирки на багаж, я попробую выяснить, что случилось?", en: "Could I have a look at your luggage labels, so I can try to find out what happened?", k: "d", who: "Lentokentän virkailija" },
    { fi: "Toki, kas tässä.", ru: "Конечно, вот они.", en: "Oh sure, here you go.", k: "d", who: "Aino" },
    { fi: "Laukut ovat epähuomiossa jääneet Roomaan. Pahoitteluni.", ru: "Сумки по недосмотру остались в Риме. Прошу прощения.", en: "The bags were inadvertently left in Rome. I'm so sorry.", k: "d", who: "Lentokentän virkailija" },
    { fi: "Laukut lähetetään sieltä Suomeen huomenna.", ru: "Завтра их оттуда отправят в Финляндию.", en: "They'll be sent to Finland tomorrow.", k: "d", who: "Lentokentän virkailija" },
    { fi: "Täytyykö minun tulla hakemaan ne täältä?", ru: "Мне нужно будет приехать забрать их отсюда?", en: "Do I have to come and pick them up?", k: "d", who: "Aino" },
    { fi: "Ei toki. Ne toimitetaan kotiosoitteeseenne.", ru: "Конечно нет. Их доставят вам домой.", en: "Oh, of course not. They will be delivered to your home address.", k: "d", who: "Lentokentän virkailija" },
    { fi: "saapua", ru: "прибывать", en: "to arrive", k: "w" },
    { fi: "lähettää", ru: "отправлять", en: "to send", k: "w" },
    { fi: "hakea", ru: "забирать", en: "to pick up", k: "w" },
    { fi: "epähuomiossa", ru: "по невнимательности, случайно", en: "inadvertently", k: "w" },
    { fi: "lipuke", ru: "бирка, ярлык", en: "label", k: "w" },
    { fi: "toimittaa", ru: "доставлять", en: "to deliver", k: "w" },
    { fi: "kotiosoite", ru: "домашний адрес", en: "home address", k: "w" },
    { fi: "matkalaukku", ru: "чемодан", en: "suitcase", k: "w" },
    { fi: "hukassa", ru: "потерянный", en: "missing", k: "w" },
    { fi: "urheilukassi", ru: "спортивная сумка", en: "sports bag", k: "w" },
    { fi: "reppu", ru: "рюкзак", en: "backpack", k: "w" },
    { fi: "salkku", ru: "портфель", en: "briefcase", k: "w" },
    { fi: "Isä saapui puistoon.", ru: "Папа прибыл в парк.", en: "The father arrived at the park.", k: "s" },
    { fi: "Haen pikkuveljeni tänään koulusta.", ru: "Сегодня я забираю младшего брата из школы.", en: "I will pick my little brother up from school today.", k: "s" },
    { fi: "Unohdin avaimeni kotiin epähuomiossa.", ru: "Я случайно забыл ключи дома.", en: "I accidentally left my keys at home.", k: "s" },
    { fi: "Aion säästää teatterilippujen lipukkeet muistoksi.", ru: "Я хочу сохранить корешки театральных билетов на память.", en: "I am going to save the theater ticket stubs as a memory.", k: "s" },
    { fi: "Toimita täytekakku juhlapaikalle iltapäivällä.", ru: "Доставь торт на место праздника после обеда.", en: "Deliver the cake to the celebration venue in the afternoon.", k: "s" },
    { fi: "Olemme todella pahoillamme, mutta emme pysty toimittamaan jääkaappia ennalta sovittuun päivään mennessä.", ru: "Нам очень жаль, но мы не успеваем доставить холодильник к оговорённой дате.", en: "We are terribly sorry, but we are not able to deliver the refrigerator by the scheduled date.", k: "s" },
    { fi: "Sohva toimitetaan meille kotiin.", ru: "Диван доставят нам домой.", en: "The sofa will be delivered to our house for us.", k: "s" },
    { fi: "Onko sinulla uusi kotiosoite?", ru: "У тебя новый домашний адрес?", en: "Do you have a new home address?", k: "s" },
    { fi: "Minulla on uusi, punainen matkalaukku.", ru: "У меня новый красный чемодан.", en: "I have a new red suitcase.", k: "s" },
    { fi: "Meidän täytyy odottaa laukkuja matkalaukkuhihnan vieressä.", ru: "Нам нужно ждать сумки у ленты выдачи багажа.", en: "We have to wait for the bags next to the luggage conveyor belt.", k: "s" },
    { fi: "Bussilippuni on hukassa!", ru: "Мой автобусный билет потерялся!", en: "My bus ticket is missing!", k: "s" },
    { fi: "Matkalaukkuni on todella painava.", ru: "Мой чемодан очень тяжёлый.", en: "My suitcase is really heavy.", k: "s" },
    { fi: "Anteeksi, jätin takkini junaan.", ru: "Извините, я оставил куртку в поезде.", en: "Excuse me, I left my coat on the train.", k: "s" },
    { fi: "Anteeksi, laukkuni ei saapunut.", ru: "Извините, моя сумка не прибыла.", en: "Excuse me, my bag didn't arrive.", k: "s" },
    { fi: "Anteeksi, en löydä laukkuani.", ru: "Извините, я не могу найти свою сумку.", en: "Excuse me, I can't find my bag.", k: "s" },
    { fi: "Se on punainen kangaslaukku.", ru: "Это красная тканевая сумка.", en: "It's a red fabric bag.", k: "s" },
    { fi: "Se on pieni keltainen reppu.", ru: "Это маленький жёлтый рюкзак.", en: "It's a small yellow backpack.", k: "s" },
    { fi: "Se on musta, nahkainen olkalaukku.", ru: "Это чёрная кожаная сумка через плечо.", en: "It's a black leather shoulder bag.", k: "s" },
    { fi: "Se on suuri sininen salkku, ja siinä on musta kahva.", ru: "Это большой синий портфель, и у него чёрная ручка.", en: "It's a big blue briefcase, and it has a black handle.", k: "s" },
    { fi: "Se on valkoinen reppu keltaisilla raidoilla.", ru: "Это белый рюкзак с жёлтыми полосками.", en: "It's a white backpack with yellow stripes.", k: "s" },
    { fi: "Matkalaukkujen lipukkeet on hyvä pitää tallessa.", ru: "Бирки от чемоданов хорошо сохранять.", en: "It's good to keep luggage labels tucked away.", k: "s" },
    { fi: "Laukut jäivät Roomaan välilaskun vuoksi.", ru: "Сумки остались в Риме из-за пересадки.", en: "The bags were left in Rome due to a layover.", k: "s" }
  ]
},
{
  id: "BE_S1_05",
  title: "Как добраться до ресторана",
  source: "FinnishPod101 · Beginner S1 #5",
  glossary: [
    { w: "osaatteko neuvoa", ru: "как спросить дорогу вежливо", en: "asking for directions",
      forms: ["osaatteko", "neuvoa", "tiedättekö", "pääsemme", "löydämme"],
      note: "Три готовых каркаса: Osaatteko neuvoa, miten löydämme perille? («Не подскажете, как нам найти дорогу?»), Tiedättekö miten pääsemme + место? («Знаете, как нам добраться до...?»), Tiedättekö, missä on + место? («Знаете, где находится...?»)." },
    { w: "imperatiivi ohjeissa", ru: "повелительное наклонение для объяснения дороги", en: "imperative for directions",
      forms: ["ottakaa", "jääkää pois", "menkää", "kääntykää", "ajakaa", "kävelkää"],
      note: "Когда объясняют дорогу, используют повелительное наклонение (урок про hätäkeskus), и это не звучит грубо — это норма жанра: Ottakaa raitiovaunu numero kuusi, Jääkää pois ylioppilastalon pysäkillä, Kääntykää oikealle pääkadulle, Kävelkää suoraan alas puistoa kohti.\nГотовые обороты: Aja alas / Aja ylös («поезжай вниз/вверх»), Mene suoraan / Mene ohi, Käänny vasemmalle / Käänny oikealle, Mene ulos + название съезда, Kunnes näet... («пока не увидишь»), kulmassa («на углу»), kadun toisella puolella («через дорогу»), vieressä («рядом»)." },
    { w: "julkiset kulkuvälineet", ru: "общественный транспорт", en: "public transportation",
      forms: ["julkiset kulkuvälineet", "raitiovaunu", "bussi", "linja-auto", "juna", "metro", "lautta"],
      note: "Julkinen («общественный») + kulkuväline («средство передвижения»). В Финляндии: bussi/linja-auto («автобус»), juna («поезд»); metro и raitiovaunu («трамвай») есть только в Хельсинки; в некоторых местах ещё lautta («паром»)." },
    { w: "raitiovaunu", ru: "трамвай", en: "tram",
      forms: ["raitiovaunu", "raitiovaunulla", "ratikka", "spora", "raitsikka"],
      note: "Составлено из raitio (линия трамвайных путей) и vaunu («вагон»). Слово слегка официальное; в разговорной речи чаще ratikka, spora или raitsikka." },
    { w: "päästä", ru: "добраться, попасть", en: "to get to, to reach",
      forms: ["päästä", "pääsen", "pääseekö", "pääsemme", "pääsette"],
      note: "Pääseekö sinne julkisilla kulkuvälineillä? — «Можно туда добраться на общественном транспорте?». Тот же корень в слове perille («до места, к цели»): löydämme perille, pääsen perille." },
    { w: "pysäkki", ru: "остановка", en: "stop", forms: ["pysäkki", "pysäkillä", "pysäkiltä"] },
    { w: "jäädä pois", ru: "выйти (из транспорта)", en: "to get off", forms: ["jäädä pois", "jään pois", "jääkää pois"] },
    { w: "neuvoa", ru: "советовать, подсказывать", en: "to advise", forms: ["neuvoa", "neuvon", "neuvoisitteko"] }
  ],
  items: [
    { fi: "Iltaa!", ru: "Добрый вечер!", en: "Good evening!", k: "d", who: "Heikki" },
    { fi: "Iltaa! Miten voin olla avuksi?", ru: "Добрый вечер! Чем могу помочь?", en: "Good evening! How may I help you?", k: "d", who: "Hotellin virkailija" },
    { fi: "Haluaisimme vaimoni kanssa mennä tähän kalaravintolaan. Osaatteko neuvoa, miten löydämme perille?", ru: "Мы с женой хотели бы попасть в этот рыбный ресторан. Не подскажете, как нам туда добраться?", en: "I would like to go with my wife to this fish restaurant. Could you tell us how to get there?", k: "d", who: "Heikki" },
    { fi: "Osaan toki. Oletteko autolla liikkeellä?", ru: "Конечно могу. Вы на машине?", en: "Sure, I can tell you the route. Do you have a car?", k: "d", who: "Hotellin virkailija" },
    { fi: "Valitettavasti emme ole. Pääseekö sinne julkisilla kulkuvälineillä?", ru: "К сожалению, нет. Туда можно добраться на общественном транспорте?", en: "Unfortunately we don't. Can we get there with public transportation?", k: "d", who: "Heikki" },
    { fi: "Pääsee kyllä. Raitiovaunulla pääsette kätevimmin perille.", ru: "Да, можно. Удобнее всего добраться на трамвае.", en: "Oh, yes you can. You can get there quite conveniently by tram.", k: "d", who: "Hotellin virkailija" },
    { fi: "Ottakaa raitiovaunu numero kuusi hotellin edestä, keskustan suuntaan.", ru: "Сядьте на трамвай номер шесть от входа в отель, в сторону центра.", en: "Take tram number six from in front of the hotel, heading towards the city center.", k: "d", who: "Hotellin virkailija" },
    { fi: "Jääkää pois ylioppilastalon pysäkillä. Ravintola on punatiilisen rakennuksen vasemmalla puolella.", ru: "Выйдите на остановке «Дом студентов». Ресторан слева от краснокирпичного здания.", en: "Get off at the Student House stop. The restaurant is on the left side of a red brick building.", k: "d", who: "Hotellin virkailija" },
    { fi: "Soitanko teille ravintolaan varauksen?", ru: "Забронировать вам столик?", en: "Shall I call the restaurant to make a reservation for you?", k: "d", who: "Hotellin virkailija" },
    { fi: "Se olisi hienoa. Kiitos oikein paljon!", ru: "Это было бы прекрасно. Большое спасибо!", en: "That would be great. Thank you very much!", k: "d", who: "Heikki" },
    { fi: "neuvoa", ru: "советовать", en: "to advise", k: "w" },
    { fi: "pysäkki", ru: "остановка", en: "stop", k: "w" },
    { fi: "jäädä pois", ru: "выйти (из транспорта)", en: "to get off", k: "w" },
    { fi: "raitiovaunu", ru: "трамвай", en: "tram", k: "w" },
    { fi: "julkiset kulkuvälineet", ru: "общественный транспорт", en: "public transportation", k: "w" },
    { fi: "vasemmalla puolella", ru: "слева", en: "on the left side", k: "w" },
    { fi: "löytää", ru: "находить", en: "to find", k: "w" },
    { fi: "perille", ru: "к месту, до цели", en: "there, to the destination", k: "w" },
    { fi: "päästä", ru: "добраться", en: "to get, to reach", k: "w" },
    { fi: "Voisitko neuvoa minua tietokoneen kanssa.", ru: "Не мог бы ты помочь мне с компьютером.", en: "Could you help me with the computer?", k: "s" },
    { fi: "Mistä tiedän mikä on oikea pysäkki?", ru: "Как мне узнать, какая остановка нужная?", en: "How do I know which one is the right stop?", k: "s" },
    { fi: "Jäin vahingossa pois väärällä pysäkillä.", ru: "Я случайно вышел не на той остановке.", en: "I accidentally got off at the wrong stop.", k: "s" },
    { fi: "Jään pois seuraavalla pysäkillä.", ru: "Я выхожу на следующей остановке.", en: "I get off at the next stop.", k: "s" },
    { fi: "Raitiovaunut ovat sympaattisia.", ru: "Трамваи такие милые.", en: "Trams are likeable.", k: "s" },
    { fi: "Julkiset kulkuvälineet ovat tarpeellisia.", ru: "Общественный транспорт необходим.", en: "Public transportation is necessary.", k: "s" },
    { fi: "Tien vasemmalla puolella on kuuluisa patsas.", ru: "Слева от дороги известная статуя.", en: "There is a famous statue on the left side of the road.", k: "s" },
    { fi: "Pystyitkö löytämään tiesi akatemialle?", ru: "Ты смог найти дорогу до академии?", en: "Were you able to find your way to the academy?", k: "s" },
    { fi: "Jos en voi löytää apteekkia, soitan sinulle.", ru: "Если не найду аптеку, позвоню тебе.", en: "If I can't find a pharmacy, I'll call you.", k: "s" },
    { fi: "Soita kun pääset perille.", ru: "Позвони, когда доберёшься.", en: "Call me when you get there.", k: "s" },
    { fi: "Lupaan soittaa kun pääsen perille.", ru: "Обещаю позвонить, когда доберусь.", en: "I promise to call you when I get there.", k: "s" },
    { fi: "Japanissa on todella hyviä kalaravintoloita.", ru: "В Японии очень хорошие рыбные рестораны.", en: "There are really good fish restaurants in Japan.", k: "s" },
    { fi: "Julkisten kulkuvälineiden lakko alkaa huomenna.", ru: "Завтра начинается забастовка общественного транспорта.", en: "The public transport strike starts tomorrow.", k: "s" },
    { fi: "Matkustan mieluummin raitiovaunulla kuin bussilla.", ru: "Я предпочитаю ездить на трамвае, а не на автобусе.", en: "I prefer travelling by tram rather than bus.", k: "s" },
    { fi: "Osaatteko neuvoa, miten löydämme postiin?", ru: "Не подскажете, как нам найти почту?", en: "Can you tell us how to get to the post office?", k: "s" },
    { fi: "Tiedättekö miten pääsemme satamaan?", ru: "Знаете, как нам добраться до порта?", en: "Do you know how to get to the harbor?", k: "s" },
    { fi: "Tiedättekö missä on yliopisto?", ru: "Знаете, где университет?", en: "Do you know where the university is?", k: "s" },
    { fi: "Miten pääsen satamaan?", ru: "Как мне добраться до порта?", en: "How do I get to the harbor?", k: "s" },
    { fi: "Pääsenkö sinne metrolla?", ru: "Я могу добраться туда на метро?", en: "Can I get there by subway?", k: "s" }
  ]
},
];

/* ------------------------------------------------------------------ */
/*  Глаголы: спряжение по лицам и временам                             */
/*  pres/impf — шесть лиц: minä, sinä, hän, me, te, he                 */
/*  nut/neet — причастие для перфекта и отрицательного имперфекта      */
/*  neg — основа для отрицания в настоящем времени (en + основа)       */
/* ------------------------------------------------------------------ */
const PERSONS = ["minä", "sinä", "hän", "me", "te", "he"];
const OLLA_PRES = ["olen", "olet", "on", "olemme", "olette", "ovat"];
const NEG = ["en", "et", "ei", "emme", "ette", "eivät"];

const VERBS = [
  { inf: "olla", ru: "быть", type: 3, ex: { fi: "kotona", ru: "дома", en: "at home" }, pres: ["olen", "olet", "on", "olemme", "olette", "ovat"], impf: ["olin", "olit", "oli", "olimme", "olitte", "olivat"], cond: ["olisin", "olisit", "olisi", "olisimme", "olisitte", "olisivat"], nut: "ollut", neet: "olleet", neg: "ole" },
  { inf: "mennä", ru: "идти, ехать", type: 3, ex: { fi: "kauppaan", ru: "в магазин", en: "to the store" }, pres: ["menen", "menet", "menee", "menemme", "menette", "menevät"], impf: ["menin", "menit", "meni", "menimme", "menitte", "menivät"], cond: ["menisin", "menisit", "menisi", "menisimme", "menisitte", "menisivät"], nut: "mennyt", neet: "menneet", neg: "mene" },
  { inf: "tulla", ru: "приходить", type: 3, ex: { fi: "kotiin", ru: "домой", en: "home" }, pres: ["tulen", "tulet", "tulee", "tulemme", "tulette", "tulevat"], impf: ["tulin", "tulit", "tuli", "tulimme", "tulitte", "tulivat"], cond: ["tulisin", "tulisit", "tulisi", "tulisimme", "tulisitte", "tulisivat"], nut: "tullut", neet: "tulleet", neg: "tule" },
  { inf: "lukea", ru: "читать", type: 1, grad: "k → пропадает: lukee ~ luen", ex: { fi: "kirjaa", ru: "книгу", en: "a book" }, pres: ["luen", "luet", "lukee", "luemme", "luette", "lukevat"], impf: ["luin", "luit", "luki", "luimme", "luitte", "lukivat"], cond: ["lukisin", "lukisit", "lukisi", "lukisimme", "lukisitte", "lukisivat"], nut: "lukenut", neet: "lukeneet", neg: "lue" },
  { inf: "katsoa", ru: "смотреть", type: 1, ex: { fi: "televisiota", ru: "телевизор", en: "TV" }, pres: ["katson", "katsot", "katsoo", "katsomme", "katsotte", "katsovat"], impf: ["katsoin", "katsoit", "katsoi", "katsoimme", "katsoitte", "katsoivat"], cond: ["katsoisin", "katsoisit", "katsoisi", "katsoisimme", "katsoisitte", "katsoisivat"], nut: "katsonut", neet: "katsoneet", neg: "katso" },
  { inf: "sanoa", ru: "сказать", type: 1, ex: { fi: "hei naapurille", ru: "«привет» соседу", en: "hi to the neighbour" }, pres: ["sanon", "sanot", "sanoo", "sanomme", "sanotte", "sanovat"], impf: ["sanoin", "sanoit", "sanoi", "sanoimme", "sanoitte", "sanoivat"], cond: ["sanoisin", "sanoisit", "sanoisi", "sanoisimme", "sanoisitte", "sanoisivat"], nut: "sanonut", neet: "sanoneet", neg: "sano" },
  { inf: "nähdä", ru: "видеть", type: 2, grad: "k → пропадает: näkee ~ näen", ex: { fi: "hyvin", ru: "хорошо", en: "well" }, pres: ["näen", "näet", "näkee", "näemme", "näette", "näkevät"], impf: ["näin", "näit", "näki", "näimme", "näitte", "näkivät"], cond: ["näkisin", "näkisit", "näkisi", "näkisimme", "näkisitte", "näkisivät"], nut: "nähnyt", neet: "nähneet", neg: "näe" },
  { inf: "tehdä", ru: "делать", type: 2, grad: "k → пропадает: tekee ~ teen", ex: { fi: "töitä", ru: "работу", en: "work" }, pres: ["teen", "teet", "tekee", "teemme", "teette", "tekevät"], impf: ["tein", "teit", "teki", "teimme", "teitte", "tekivät"], cond: ["tekisin", "tekisit", "tekisi", "tekisimme", "tekisitte", "tekisivät"], nut: "tehnyt", neet: "tehneet", neg: "tee" },
  { inf: "syödä", ru: "есть", type: 2, ex: { fi: "leipää", ru: "хлеб", en: "bread" }, pres: ["syön", "syöt", "syö", "syömme", "syötte", "syövät"], impf: ["söin", "söit", "söi", "söimme", "söitte", "söivät"], cond: ["söisin", "söisit", "söisi", "söisimme", "söisitte", "söisivät"], nut: "syönyt", neet: "syöneet", neg: "syö" },
  { inf: "juoda", ru: "пить", type: 2, ex: { fi: "kahvia", ru: "кофе", en: "coffee" }, pres: ["juon", "juot", "juo", "juomme", "juotte", "juovat"], impf: ["join", "joit", "joi", "joimme", "joitte", "joivat"], cond: ["joisin", "joisit", "joisi", "joisimme", "joisitte", "joisivat"], nut: "juonut", neet: "juoneet", neg: "juo" },
  { inf: "saada", ru: "получать", type: 2, ex: { fi: "lahjoja", ru: "подарки", en: "gifts" }, pres: ["saan", "saat", "saa", "saamme", "saatte", "saavat"], impf: ["sain", "sait", "sai", "saimme", "saitte", "saivat"], cond: ["saisin", "saisit", "saisi", "saisimme", "saisitte", "saisivat"], nut: "saanut", neet: "saaneet", neg: "saa" },
  { inf: "antaa", ru: "давать", type: 1, grad: "nt → nn: antaa ~ annan", ex: { fi: "rahaa", ru: "денег", en: "money" }, pres: ["annan", "annat", "antaa", "annamme", "annatte", "antavat"], impf: ["annoin", "annoit", "antoi", "annoimme", "annoitte", "antoivat"], cond: ["antaisin", "antaisit", "antaisi", "antaisimme", "antaisitte", "antaisivat"], nut: "antanut", neet: "antaneet", neg: "anna" },
  { inf: "aikoa", ru: "собираться", type: 1, grad: "k → пропадает: aikoo ~ aion", ex: { fi: "lähteä", ru: "уйти", en: "to leave" }, pres: ["aion", "aiot", "aikoo", "aiomme", "aiotte", "aikovat"], impf: ["aioin", "aioit", "aikoi", "aioimme", "aioitte", "aikoivat"], cond: ["aikoisin", "aikoisit", "aikoisi", "aikoisimme", "aikoisitte", "aikoisivat"], nut: "aikonut", neet: "aikoneet", neg: "aio" },
  { inf: "voida", ru: "мочь", type: 2, ex: { fi: "auttaa", ru: "помочь", en: "help" }, pres: ["voin", "voit", "voi", "voimme", "voitte", "voivat"], impf: ["voin", "voit", "voi", "voimme", "voitte", "voivat"], cond: ["voisin", "voisit", "voisi", "voisimme", "voisitte", "voisivat"], nut: "voinut", neet: "voineet", neg: "voi", note: "Основа кончается на -i, поэтому имперфект совпадает с настоящим временем." },
  { inf: "käydä", ru: "сходить (и вернуться)", type: 2, ex: { fi: "kaupassa", ru: "в магазин", en: "at the store" }, pres: ["käyn", "käyt", "käy", "käymme", "käytte", "käyvät"], impf: ["kävin", "kävit", "kävi", "kävimme", "kävitte", "kävivät"], cond: ["kävisin", "kävisit", "kävisi", "kävisimme", "kävisitte", "kävisivät"], nut: "käynyt", neet: "käyneet", neg: "käy" },
  { inf: "haluta", ru: "хотеть", type: 4, ex: { fi: "jäätelöä", ru: "мороженого", en: "ice cream" }, pres: ["haluan", "haluat", "haluaa", "haluamme", "haluatte", "haluavat"], impf: ["halusin", "halusit", "halusi", "halusimme", "halusitte", "halusivat"], cond: ["haluaisin", "haluaisit", "haluaisi", "haluaisimme", "haluaisitte", "haluaisivat"], nut: "halunnut", neet: "halunneet", neg: "halua" },
  { inf: "tietää", ru: "знать", type: 1, grad: "t → d: tietää ~ tiedän", ex: { fi: "paljon", ru: "много", en: "a lot" }, pres: ["tiedän", "tiedät", "tietää", "tiedämme", "tiedätte", "tietävät"], impf: ["tiesin", "tiesit", "tiesi", "tiesimme", "tiesitte", "tiesivät"], cond: ["tietäisin", "tietäisit", "tietäisi", "tietäisimme", "tietäisitte", "tietäisivät"], nut: "tiennyt", neet: "tienneet", neg: "tiedä" },
  { inf: "pelata", ru: "играть", type: 4, grad: "t → пропадает: pelata ~ pelaan", ex: { fi: "jalkapalloa", ru: "в футбол", en: "football" }, pres: ["pelaan", "pelaat", "pelaa", "pelaamme", "pelaatte", "pelaavat"], impf: ["pelasin", "pelasit", "pelasi", "pelasimme", "pelasitte", "pelasivat"], cond: ["pelaisin", "pelaisit", "pelaisi", "pelaisimme", "pelaisitte", "pelaisivat"], nut: "pelannut", neet: "pelanneet", neg: "pelaa" },
  { inf: "avata", ru: "открывать", type: 4, grad: "t → пропадает: avata ~ avaan", ex: { fi: "ikkunaa", ru: "окно", en: "the window" }, pres: ["avaan", "avaat", "avaa", "avaamme", "avaatte", "avaavat"], impf: ["avasin", "avasit", "avasi", "avasimme", "avasitte", "avasivat"], cond: ["avaisin", "avaisit", "avaisi", "avaisimme", "avaisitte", "avaisivat"], nut: "avannut", neet: "avanneet", neg: "avaa" },
  { inf: "levätä", ru: "отдыхать", type: 4, grad: "v → p: levätä ~ lepään", ex: { fi: "sohvalla", ru: "на диване", en: "on the sofa" }, pres: ["lepään", "lepäät", "lepää", "lepäämme", "lepäätte", "lepäävät"], impf: ["lepäsin", "lepäsit", "lepäsi", "lepäsimme", "lepäsitte", "lepäsivät"], cond: ["lepäisin", "lepäisit", "lepäisi", "lepäisimme", "lepäisitte", "lepäisivät"], nut: "levännyt", neet: "levänneet", neg: "lepää" },
  { inf: "luulla", ru: "думать, полагать", type: 3, ex: { fi: "niin", ru: "так", en: "so" }, pres: ["luulen", "luulet", "luulee", "luulemme", "luulette", "luulevat"], impf: ["luulin", "luulit", "luuli", "luulimme", "luulitte", "luulivat"], cond: ["luulisin", "luulisit", "luulisi", "luulisimme", "luulisitte", "luulisivat"], nut: "luullut", neet: "luulleet", neg: "luule" },
  { inf: "kääntyä", ru: "поворачивать", type: 1, grad: "nt → nn: kääntyy ~ käännyn", ex: { fi: "vasemmalle", ru: "налево", en: "left" }, pres: ["käännyn", "käännyt", "kääntyy", "käännymme", "käännytte", "kääntyvät"], impf: ["käännyin", "käännyit", "kääntyi", "käännyimme", "käännyitte", "kääntyivät"], cond: ["kääntyisin", "kääntyisit", "kääntyisi", "kääntyisimme", "kääntyisitte", "kääntyisivät"], nut: "kääntynyt", neet: "kääntyneet", neg: "käänny" },
  { inf: "palata", ru: "возвращаться", type: 4, grad: "t → пропадает: palata ~ palaan", ex: { fi: "töistä", ru: "с работы", en: "from work" }, pres: ["palaan", "palaat", "palaa", "palaamme", "palaatte", "palaavat"], impf: ["palasin", "palasit", "palasi", "palasimme", "palasitte", "palasivat"], cond: ["palaisin", "palaisit", "palaisi", "palaisimme", "palaisitte", "palaisivat"], nut: "palannut", neet: "palanneet", neg: "palaa" },
  { inf: "juosta", ru: "бежать", type: 3, grad: "особая основа: juosta ~ juoksen", ex: { fi: "metsässä", ru: "в лесу", en: "in the forest" }, pres: ["juoksen", "juokset", "juoksee", "juoksemme", "juoksette", "juoksevat"], impf: ["juoksin", "juoksit", "juoksi", "juoksimme", "juoksitte", "juoksivat"], cond: ["juoksisin", "juoksisit", "juoksisi", "juoksisimme", "juoksisitte", "juoksisivat"], nut: "juossut", neet: "juosseet", neg: "juokse" },
  { inf: "auttaa", ru: "помогать", type: 1, grad: "tt → t: auttaa ~ autan", ex: { fi: "äitiä", ru: "маме", en: "my mother" }, pres: ["autan", "autat", "auttaa", "autamme", "autatte", "auttavat"], impf: ["autoin", "autoit", "auttoi", "autoimme", "autoitte", "auttoivat"], cond: ["auttaisin", "auttaisit", "auttaisi", "auttaisimme", "auttaisitte", "auttaisivat"], nut: "auttanut", neet: "auttaneet", neg: "auta" },
  { inf: "etsiä", ru: "искать", type: 1, ex: { fi: "sinua", ru: "тебя", en: "you" }, pres: ["etsin", "etsit", "etsii", "etsimme", "etsitte", "etsivät"], impf: ["etsin", "etsit", "etsi", "etsimme", "etsitte", "etsivät"], cond: ["etsisin", "etsisit", "etsisi", "etsisimme", "etsisitte", "etsisivät"], nut: "etsinyt", neet: "etsineet", neg: "etsi", note: "Основа кончается на -i, поэтому имперфект почти везде совпадает с настоящим временем: только в 3-м лице ед. числа разница слышна — etsii против etsi." },
  { inf: "kysyä", ru: "спрашивать", type: 1, ex: { fi: "neuvoa", ru: "совета", en: "for advice" }, pres: ["kysyn", "kysyt", "kysyy", "kysymme", "kysytte", "kysyvät"], impf: ["kysyin", "kysyit", "kysyi", "kysyimme", "kysyitte", "kysyivät"], cond: ["kysyisin", "kysyisit", "kysyisi", "kysyisimme", "kysyisitte", "kysyisivät"], nut: "kysynyt", neet: "kysyneet", neg: "kysy" },
  { inf: "sopia", ru: "подходить, идти", type: 1, grad: "p → v: sopii ~ sovin", ex: { fi: "tähän työhön", ru: "для этой работы", en: "for this job" }, pres: ["sovin", "sovit", "sopii", "sovimme", "sovitte", "sopivat"], impf: ["sovin", "sovit", "sopi", "sovimme", "sovitte", "sopivat"], cond: ["sopisin", "sopisit", "sopisi", "sopisimme", "sopisitte", "sopisivat"], nut: "sopinut", neet: "sopineet", neg: "sovi", note: "Чередование p > v в слабой ступени: sopia → minä sovin, но hän sopii." },
  { inf: "ajatella", ru: "думать, размышлять", type: 3, grad: "t → tt: ajatella ~ ajattelen", ex: { fi: "asiaa", ru: "об этом", en: "about it" }, pres: ["ajattelen", "ajattelet", "ajattelee", "ajattelemme", "ajattelette", "ajattelevat"], impf: ["ajattelin", "ajattelit", "ajatteli", "ajattelimme", "ajattelitte", "ajattelivat"], cond: ["ajattelisin", "ajattelisit", "ajattelisi", "ajattelisimme", "ajattelisitte", "ajattelisivat"], nut: "ajatellut", neet: "ajatelleet", neg: "ajattele" },
  { inf: "löytyä", ru: "найтись, быть в наличии", type: 1, grad: "t → d: löytyy ~ löydyn", ex: { fi: "täältä", ru: "здесь", en: "here" }, pres: ["löydyn", "löydyt", "löytyy", "löydymme", "löydytte", "löytyvät"], impf: ["löydyin", "löydyit", "löytyi", "löydyimme", "löydyitte", "löytyivät"], cond: ["löytyisin", "löytyisit", "löytyisi", "löytyisimme", "löytyisitte", "löytyisivät"], nut: "löytynyt", neet: "löytyneet", neg: "löydy", note: "Подлежащее при löytyä — то, что нашлось, поэтому в жизни глагол почти всегда стоит в 3-м лице: Löytyykö tätä isompana?" },
  { inf: "lähteä", ru: "уходить, отправляться", type: 1, grad: "t → d: lähtee ~ lähden", ex: { fi: "töihin", ru: "на работу", en: "for work" }, pres: ["lähden", "lähdet", "lähtee", "lähdemme", "lähdette", "lähtevät"], impf: ["lähdin", "lähdit", "lähti", "lähdimme", "lähditte", "lähtivät"], cond: ["lähtisin", "lähtisit", "lähtisi", "lähtisimme", "lähtisitte", "lähtisivät"], nut: "lähtenyt", neet: "lähteneet", neg: "lähde", note: "Чередование t > d в слабой ступени: minä lähden, но hän lähtee." },
  { inf: "unohtaa", ru: "забывать", type: 1, grad: "ht → hd: unohtaa ~ unohdan", ex: { fi: "usein", ru: "часто", en: "often" }, pres: ["unohdan", "unohdat", "unohtaa", "unohdamme", "unohdatte", "unohtavat"], impf: ["unohdin", "unohdit", "unohti", "unohdimme", "unohditte", "unohtivat"], cond: ["unohtaisin", "unohtaisit", "unohtaisi", "unohtaisimme", "unohtaisitte", "unohtaisivat"], nut: "unohtanut", neet: "unohtaneet", neg: "unohda" },
  { inf: "tarvita", ru: "нуждаться", type: 5, ex: { fi: "apua", ru: "в помощи", en: "help" }, pres: ["tarvitsen", "tarvitset", "tarvitsee", "tarvitsemme", "tarvitsette", "tarvitsevat"], impf: ["tarvitsin", "tarvitsit", "tarvitsi", "tarvitsimme", "tarvitsitte", "tarvitsivat"], cond: ["tarvitsisin", "tarvitsisit", "tarvitsisi", "tarvitsisimme", "tarvitsisitte", "tarvitsisivat"], nut: "tarvinnut", neet: "tarvinneet", neg: "tarvitse", note: "В причастии NUT показатель -tse- пропадает: tarvitsen, но en tarvinnut." },
  { inf: "valita", ru: "выбирать", type: 5, ex: { fi: "väärin", ru: "неправильно", en: "wrong" }, pres: ["valitsen", "valitset", "valitsee", "valitsemme", "valitsette", "valitsevat"], impf: ["valitsin", "valitsit", "valitsi", "valitsimme", "valitsitte", "valitsivat"], cond: ["valitsisin", "valitsisit", "valitsisi", "valitsisimme", "valitsisitte", "valitsisivat"], nut: "valinnut", neet: "valinneet", neg: "valitse" },
  { inf: "harkita", ru: "обдумывать, взвешивать", type: 5, ex: { fi: "asiaa", ru: "дело", en: "the matter" }, pres: ["harkitsen", "harkitset", "harkitsee", "harkitsemme", "harkitsette", "harkitsevat"], impf: ["harkitsin", "harkitsit", "harkitsi", "harkitsimme", "harkitsitte", "harkitsivat"], cond: ["harkitsisin", "harkitsisit", "harkitsisi", "harkitsisimme", "harkitsisitte", "harkitsisivat"], nut: "harkinnut", neet: "harkinneet", neg: "harkitse" },
  { inf: "vanheta", ru: "стареть", type: 6, ex: { fi: "nopeasti", ru: "быстро", en: "fast" }, pres: ["vanhenen", "vanhenet", "vanhenee", "vanhenemme", "vanhenette", "vanhenevat"], impf: ["vanhenin", "vanhenit", "vanheni", "vanhenimme", "vanhenitte", "vanhenivat"], cond: ["vanhenisin", "vanhenisit", "vanhenisi", "vanhenisimme", "vanhenisitte", "vanhenisivat"], nut: "vanhennut", neet: "vanhenneet", neg: "vanhene" },
  { inf: "kylmetä", ru: "остывать, замерзать", type: 6, ex: { fi: "ulkona", ru: "на улице", en: "outside" }, pres: ["kylmenen", "kylmenet", "kylmenee", "kylmenemme", "kylmenette", "kylmenevat"], impf: ["kylmenin", "kylmenit", "kylmeni", "kylmenimme", "kylmenitte", "kylmenivät"], cond: ["kylmenisin", "kylmenisit", "kylmenisi", "kylmenisimme", "kylmenisitte", "kylmenisivät"], nut: "kylmennyt", neet: "kylmenneet", neg: "kylmene" },
  { inf: "kuulla", ru: "слышать", type: 3, ex: { fi: "ääntä", ru: "звук", en: "a sound" }, pres: ["kuulen", "kuulet", "kuulee", "kuulemme", "kuulette", "kuulevat"], impf: ["kuulin", "kuulit", "kuuli", "kuulimme", "kuulitte", "kuulivat"], cond: ["kuulisin", "kuulisit", "kuulisi", "kuulisimme", "kuulisitte", "kuulisivat"], nut: "kuullut", neet: "kuulleet", neg: "kuule", note: "Kuulla — услышать само собой, kuunnella — слушать нарочно. Урок 24." },
  { inf: "kuunnella", ru: "слушать", type: 3, grad: "nn → nt: kuunnella ~ kuuntelen", ex: { fi: "musiikkia", ru: "музыку", en: "music" }, pres: ["kuuntelen", "kuuntelet", "kuuntelee", "kuuntelemme", "kuuntelette", "kuuntelevat"], impf: ["kuuntelin", "kuuntelit", "kuunteli", "kuuntelimme", "kuuntelitte", "kuuntelivat"], cond: ["kuuntelisin", "kuuntelisit", "kuuntelisi", "kuuntelisimme", "kuuntelisitte", "kuuntelisivat"], nut: "kuunnellut", neet: "kuunnelleet", neg: "kuuntele" },
  { inf: "surra", ru: "горевать, переживать", type: 3, ex: { fi: "menetystä", ru: "потерю", en: "the loss" }, pres: ["suren", "suret", "suree", "suremme", "surette", "surevat"], impf: ["surin", "surit", "suri", "surimme", "suritte", "surivat"], cond: ["surisin", "surisit", "surisi", "surisimme", "surisitte", "surisivat"], nut: "surrut", neet: "surreet", neg: "sure", note: "Редкий тип основы на -rra. Повелительное отрицание: Älä sure, Älkää surko." },
  { inf: "rikkoa", ru: "разбить, сломать", type: 1, grad: "kk → k: rikkoa ~ rikon", ex: { fi: "lautasia", ru: "тарелки", en: "plates" }, pres: ["rikon", "rikot", "rikkoo", "rikomme", "rikotte", "rikkovat"], impf: ["rikoin", "rikoit", "rikkoi", "rikoimme", "rikoitte", "rikkoivat"], cond: ["rikkoisin", "rikkoisit", "rikkoisi", "rikkoisimme", "rikkoisitte", "rikkoisivat"], nut: "rikkonut", neet: "rikkoneet", neg: "riko" },
  { inf: "harmittaa", ru: "раздражать, досаждать", type: 1, grad: "tt → t: harmittaa ~ harmitan", ex: { fi: "minua", ru: "меня", en: "me" }, pres: ["harmitan", "harmitat", "harmittaa", "harmitamme", "harmitatte", "harmittavat"], impf: ["harmitin", "harmitit", "harmitti", "harmitimme", "harmititte", "harmittivat"], cond: ["harmittaisin", "harmittaisit", "harmittaisi", "harmittaisimme", "harmittaisitte", "harmittaisivat"], nut: "harmittanut", neet: "harmittaneet", neg: "harmita", note: "В жизни глагол почти всегда стоит в 3-м лице единственного: Minua harmittaa, Häviäminen harmittaa minua. Остальные лица существуют, но встречаются редко. Урок 24." },
  { inf: "paeta", ru: "убегать, спасаться", type: 6, grad: "k появляется: paeta ~ pakenen", ex: { fi: "metsään", ru: "в лес", en: "into the forest" }, pres: ["pakenen", "pakenet", "pakenee", "pakenemme", "pakenette", "pakenevat"], impf: ["pakenin", "pakenit", "pakeni", "pakenimme", "pakenitte", "pakenivat"], cond: ["pakenisin", "pakenisit", "pakenisi", "pakenisimme", "pakenisitte", "pakenisivat"], nut: "paennut", neet: "paenneet", neg: "pakene" },
  { inf: "lainata", ru: "одалживать", type: 4, grad: "t → пропадает: lainata ~ lainaan", ex: { fi: "kynää", ru: "ручку", en: "a pen" }, pres: ["lainaan", "lainaat", "lainaa", "lainaamme", "lainaatte", "lainaavat"], impf: ["lainasin", "lainasit", "lainasi", "lainasimme", "lainasitte", "lainasivat"], cond: ["lainaisin", "lainaisit", "lainaisi", "lainaisimme", "lainaisitte", "lainaisivat"], nut: "lainannut", neet: "lainanneet", neg: "lainaa" },
];

const TENSES = [
  { id: "pres", ru: "настоящее время", short: "настоящее" },
  { id: "impf", ru: "имперфект (прошедшее)", short: "имперфект" },
  { id: "perf", ru: "перфект", short: "перфект" },
  { id: "cond", ru: "кондиционал («бы»)", short: "кондиционал" },
  { id: "negpres", ru: "отрицание в настоящем", short: "отрицание, сейчас" },
  { id: "negimpf", ru: "отрицание в прошедшем", short: "отрицание, прошлое" },
  { id: "negperf", ru: "отрицание в перфекте", short: "отрицание, перфект" },
  { id: "negcond", ru: "отрицание в кондиционале", short: "отрицание, «бы»" },
];

// Отрицание — не отдельное время, а вторая половина каждого из четырёх.
const BASE_TENSES = TENSES.filter((t) => !t.id.startsWith("neg"));
const NEG_OF = { pres: "negpres", impf: "negimpf", perf: "negperf", cond: "negcond" };

// Пояснения, которые открываются по пунктирной ссылке в задании.
const VERB_TYPES = {
  1: { w: "Тип 1", ru: "инфинитив на гласный + a/ä", en: "verb type 1",
    note: "Самый многочисленный тип: sanoa, kysyä, antaa, lähteä. Основа настоящего времени — инфинитив без последней -a/-ä: sano-, kysy-, anta-. К ней клеятся личные окончания.\nЧередование ступеней, если оно есть, идёт в обычную сторону: сильная ступень в инфинитиве и 3-м лице, слабая в остальных лицах и в отрицании. Antaa, hän antaa — но minä annan, en anna." },
  2: { w: "Тип 2", ru: "инфинитив на -da/-dä", en: "verb type 2",
    note: "Короткие глаголы: juoda, syödä, saada, nähdä, tehdä, voida, käydä. Убираем -da/-dä, и окончания клеятся прямо к оставшемуся гласному: juo-n, saa-t, voi-mme. В 3-м лице единственного окончания нет, но гласный удлиняется у тех, у кого может: hän juo, hän saa.\nЧередования ступеней в этом типе нет. Особняком стоят nähdä и tehdä: näkee ~ näen, tekee ~ teen." },
  3: { w: "Тип 3", ru: "инфинитив на -la, -na, -ra, -sta", en: "verb type 3",
    note: "Tulla, mennä, olla, luulla, ajatella, juosta. Убираем две последние буквы и добавляем -e-, а потом окончание: tul-e-n, men-e-t, ajattel-e-mme. В 3-м лице единственного гласный удлиняется: hän tulee, hän menee.\nЧередование здесь работает наоборот: слабая ступень в инфинитиве, сильная в личных формах — ajatella, но minä ajattelen." },
  4: { w: "Тип 4", ru: "инфинитив на гласный + ta/tä", en: "verb type 4",
    note: "Haluta, pelata, avata, levätä, palata, lainata. Убираем -ta/-tä и добавляем -a-/-ä-: halua-n, pelaa-n, avaa-t. В 3-м лице единственного окончания нет: hän pelaa.\nЧередование тоже обратное: t инфинитива в личных формах пропадает (avata ~ avaan, lainata ~ lainaan), а v становится p (levätä ~ lepään)." },
  5: { w: "Тип 5", ru: "инфинитив на -ita/-itä", en: "verb type 5",
    note: "Небольшой, но узнаваемый тип: tarvita, valita, harkita, häiritä, mainita. Убираем -ta/-tä и вставляем -tse-: tarvi-tse-n, vali-tse-t, harki-tse-mme. В 3-м лице единственного получается -tsee: hän tarvitsee.\nПоказатель -tse- есть только в настоящем и прошедшем: в причастии NUT он исчезает — tarvinnut, valinnut, harkinnut. Чередования ступеней в этом типе нет." },
  6: { w: "Тип 6", ru: "инфинитив на -eta/-etä", en: "verb type 6",
    note: "Самый редкий тип, и почти все его глаголы означают постепенное изменение: vanheta («стареть»), kylmetä («остывать»), lämmetä («теплеть»), paeta («убегать»). Убираем -ta/-tä и вставляем -ne-: vanhe-ne-n, kylme-ne-t. В 3-м лице единственного -nee: hän vanhenee.\nЧередование, если есть, обратное — слабая ступень в инфинитиве: paeta, но minä pakenen; lämmetä, но minä lämpenen." },
};

const TENSE_NOTES = {
  pres: "Личные окончания -n, -t, (ничего), -mme, -tte, -vat/-vät клеятся к основе настоящего времени. Какая это основа, зависит от типа глагола.",
  impf: "Между основой и окончанием встаёт показатель -i-: katso-i-n, katso-i-mme. В 3-м лице единственного окончания нет: hän katsoi. Основа перед -i- часто меняется: saan → sain, luen → luin, annan → annoin, tiedän → tiesin. Разбор в уроке 7.",
  perf: "Olla в нужном лице плюс причастие NUT: olen katsonut, olemme katsoneet. Причастие берёт -nut/-nyt в единственном числе и -neet во множественном. Употребляется, когда прошлое действие важно для настоящего. Урок 11.",
  cond: "Показатель -isi- между основой и окончанием, причём основа берётся от 3-го лица множественного: katsovat → katso-isi-n. Нужен для «бы», для вежливых просьб и для желаний. Урок 21.",
  negpres: "Отрицательный глагол берёт на себя лицо (en, et, ei, emme, ette, eivät), а основной глагол остаётся в слабой основе без всякого окончания: en katso, emme katso.",
  negimpf: "Отрицательный глагол по лицам плюс причастие NUT — то же причастие, что в перфекте: en katsonut, emme katsoneet. Урок 14.",
  negperf: "Три слова: отрицательный глагол по лицам, затем неизменное ole, затем причастие NUT — en ole katsonut, emme ole katsoneet. Ole — это слабая основа olla, она одна на все лица.",
  negcond: "Отрицательный глагол по лицам плюс кондиционал без личного окончания: en katsoisi, et katsoisi, emme katsoisi. Форма глагола одна и та же во всех лицах — лицо несёт только отрицание.",
};

// Перфект и отрицания собираются из тех же данных, поэтому таблицы не дублируются.
function verbForm(v, tenseId, p) {
  const plural = p >= 3;
  if (tenseId === "pres") return v.pres[p];
  if (tenseId === "impf") return v.impf[p];
  if (tenseId === "cond") return v.cond[p];
  if (tenseId === "perf") return OLLA_PRES[p] + " " + (plural ? v.neet : v.nut);
  if (tenseId === "negpres") return NEG[p] + " " + v.neg;
  if (tenseId === "negcond") return NEG[p] + " " + v.cond[2];
  if (tenseId === "negperf") return NEG[p] + " ole " + (plural ? v.neet : v.nut);
  return NEG[p] + " " + (plural ? v.neet : v.nut);
}

function verbTaskId(v, tenseId, p) { return "v:" + v.inf + ":" + tenseId + ":" + p; }

// Перевод приходит как «я бы искал»: первое слово — местоимение, остальное —
// собственно форма глагола, её и выделяем жирным внутри примера.
function splitGloss(str) {
  const i = String(str || "").indexOf(" ");
  return i < 0 ? [str || "", ""] : [str.slice(0, i), str.slice(i + 1)];
}

/* ------------------------------------------------------------------ */
/*  Переводы форм глагола на русский и английский                      */
/* ------------------------------------------------------------------ */
const RU_PRON = ["я", "ты", "он", "мы", "вы", "они"];
const EN_PRON = ["I", "you", "he", "we", "you", "they"];

const GLOSS = {
  olla: { ru: { pres: ["я есть", "ты есть", "он есть", "мы есть", "вы есть", "они есть"], sg: "был", pl: "были", neg: ["меня нет", "тебя нет", "его нет", "нас нет", "вас нет", "их нет"] }, be: true, pp: "been" },
  mennä: { ru: { pres: ["я иду", "ты идёшь", "он идёт", "мы идём", "вы идёте", "они идут"], sg: "пошёл", pl: "пошли" }, en: { base: "go", s: "goes", past: "went", pp: "gone" } },
  tulla: { ru: { pres: ["я прихожу", "ты приходишь", "он приходит", "мы приходим", "вы приходите", "они приходят"], sg: "пришёл", pl: "пришли" }, en: { base: "come", s: "comes", past: "came", pp: "come" } },
  lukea: { ru: { pres: ["я читаю", "ты читаешь", "он читает", "мы читаем", "вы читаете", "они читают"], sg: "читал", pl: "читали" }, en: { base: "read", s: "reads", past: "read", pp: "read" } },
  katsoa: { ru: { pres: ["я смотрю", "ты смотришь", "он смотрит", "мы смотрим", "вы смотрите", "они смотрят"], sg: "смотрел", pl: "смотрели" }, en: { base: "watch", s: "watches", past: "watched", pp: "watched" } },
  sanoa: { ru: { pres: ["я говорю", "ты говоришь", "он говорит", "мы говорим", "вы говорите", "они говорят"], sg: "сказал", pl: "сказали" }, en: { base: "say", s: "says", past: "said", pp: "said" } },
  nähdä: { ru: { pres: ["я вижу", "ты видишь", "он видит", "мы видим", "вы видите", "они видят"], sg: "видел", pl: "видели" }, en: { base: "see", s: "sees", past: "saw", pp: "seen" } },
  tehdä: { ru: { pres: ["я делаю", "ты делаешь", "он делает", "мы делаем", "вы делаете", "они делают"], sg: "сделал", pl: "сделали" }, en: { base: "do", s: "does", past: "did", pp: "done" } },
  syödä: { ru: { pres: ["я ем", "ты ешь", "он ест", "мы едим", "вы едите", "они едят"], sg: "ел", pl: "ели" }, en: { base: "eat", s: "eats", past: "ate", pp: "eaten" } },
  juoda: { ru: { pres: ["я пью", "ты пьёшь", "он пьёт", "мы пьём", "вы пьёте", "они пьют"], sg: "пил", pl: "пили" }, en: { base: "drink", s: "drinks", past: "drank", pp: "drunk" } },
  saada: { ru: { pres: ["я получаю", "ты получаешь", "он получает", "мы получаем", "вы получаете", "они получают"], sg: "получил", pl: "получили" }, en: { base: "get", s: "gets", past: "got", pp: "got" } },
  antaa: { ru: { pres: ["я даю", "ты даёшь", "он даёт", "мы даём", "вы даёте", "они дают"], sg: "дал", pl: "дали" }, en: { base: "give", s: "gives", past: "gave", pp: "given" } },
  aikoa: { ru: { pres: ["я собираюсь", "ты собираешься", "он собирается", "мы собираемся", "вы собираетесь", "они собираются"], sg: "собирался", pl: "собирались" }, en: { base: "intend", s: "intends", past: "intended", pp: "intended" } },
  voida: { ru: { pres: ["я могу", "ты можешь", "он может", "мы можем", "вы можете", "они могут"], sg: "мог", pl: "могли" }, modal: { pres: "can", past: "could", pp: "been able to", neg: "can't", negPast: "couldn't" } },
  käydä: { ru: { pres: ["я захожу", "ты заходишь", "он заходит", "мы заходим", "вы заходите", "они заходят"], sg: "сходил", pl: "сходили" }, en: { base: "visit", s: "visits", past: "visited", pp: "visited" } },
  haluta: { ru: { pres: ["я хочу", "ты хочешь", "он хочет", "мы хотим", "вы хотите", "они хотят"], sg: "хотел", pl: "хотели" }, en: { base: "want", s: "wants", past: "wanted", pp: "wanted" } },
  tietää: { ru: { pres: ["я знаю", "ты знаешь", "он знает", "мы знаем", "вы знаете", "они знают"], sg: "знал", pl: "знали" }, en: { base: "know", s: "knows", past: "knew", pp: "known" } },
  pelata: { ru: { pres: ["я играю", "ты играешь", "он играет", "мы играем", "вы играете", "они играют"], sg: "играл", pl: "играли" }, en: { base: "play", s: "plays", past: "played", pp: "played" } },
  avata: { ru: { pres: ["я открываю", "ты открываешь", "он открывает", "мы открываем", "вы открываете", "они открывают"], sg: "открыл", pl: "открыли" }, en: { base: "open", s: "opens", past: "opened", pp: "opened" } },
  levätä: { ru: { pres: ["я отдыхаю", "ты отдыхаешь", "он отдыхает", "мы отдыхаем", "вы отдыхаете", "они отдыхают"], sg: "отдыхал", pl: "отдыхали" }, en: { base: "rest", s: "rests", past: "rested", pp: "rested" } },
  luulla: { ru: { pres: ["я думаю", "ты думаешь", "он думает", "мы думаем", "вы думаете", "они думают"], sg: "думал", pl: "думали" }, en: { base: "think", s: "thinks", past: "thought", pp: "thought" } },
  kääntyä: { ru: { pres: ["я поворачиваю", "ты поворачиваешь", "он поворачивает", "мы поворачиваем", "вы поворачиваете", "они поворачивают"], sg: "повернул", pl: "повернули" }, en: { base: "turn", s: "turns", past: "turned", pp: "turned" } },
  palata: { ru: { pres: ["я возвращаюсь", "ты возвращаешься", "он возвращается", "мы возвращаемся", "вы возвращаетесь", "они возвращаются"], sg: "вернулся", pl: "вернулись" }, en: { base: "return", s: "returns", past: "returned", pp: "returned" } },
  juosta: { ru: { pres: ["я бегу", "ты бежишь", "он бежит", "мы бежим", "вы бежите", "они бегут"], sg: "бежал", pl: "бежали" }, en: { base: "run", s: "runs", past: "ran", pp: "run" } },
  auttaa: { ru: { pres: ["я помогаю", "ты помогаешь", "он помогает", "мы помогаем", "вы помогаете", "они помогают"], sg: "помог", pl: "помогли" }, en: { base: "help", s: "helps", past: "helped", pp: "helped" } },
  etsiä: { ru: { pres: ["я ищу", "ты ищешь", "он ищет", "мы ищем", "вы ищете", "они ищут"], sg: "искал", pl: "искали" }, en: { base: "search", s: "searches", past: "searched", pp: "searched" } },
  kysyä: { ru: { pres: ["я спрашиваю", "ты спрашиваешь", "он спрашивает", "мы спрашиваем", "вы спрашиваете", "они спрашивают"], sg: "спросил", pl: "спросили" }, en: { base: "ask", s: "asks", past: "asked", pp: "asked" } },
  sopia: { ru: { pres: ["я подхожу", "ты подходишь", "он подходит", "мы подходим", "вы подходите", "они подходят"], sg: "подошёл", pl: "подошли" }, en: { base: "suit", s: "suits", past: "suited", pp: "suited" } },
  ajatella: { ru: { pres: ["я думаю", "ты думаешь", "он думает", "мы думаем", "вы думаете", "они думают"], sg: "думал", pl: "думали" }, en: { base: "think", s: "thinks", past: "thought", pp: "thought" } },
  löytyä: { ru: { pres: ["я нахожусь", "ты находишься", "он находится", "мы находимся", "вы находитесь", "они находятся"], sg: "нашёлся", pl: "нашлись" }, en: { base: "be found", s: "is found", past: "was found", pp: "been found" } },
  lähteä: { ru: { pres: ["я ухожу", "ты уходишь", "он уходит", "мы уходим", "вы уходите", "они уходят"], sg: "ушёл", pl: "ушли" }, en: { base: "leave", s: "leaves", past: "left", pp: "left" } },
  unohtaa: { ru: { pres: ["я забываю", "ты забываешь", "он забывает", "мы забываем", "вы забываете", "они забывают"], sg: "забыл", pl: "забыли" }, en: { base: "forget", s: "forgets", past: "forgot", pp: "forgotten" } },
  lainata: { ru: { pres: ["я одалживаю", "ты одалживаешь", "он одалживает", "мы одалживаем", "вы одалживаете", "они одалживают"], sg: "одолжил", pl: "одолжили" }, en: { base: "borrow", s: "borrows", past: "borrowed", pp: "borrowed" } },
  tarvita: { ru: { pres: ["я нуждаюсь", "ты нуждаешься", "он нуждается", "мы нуждаемся", "вы нуждаетесь", "они нуждаются"], sg: "нуждался", pl: "нуждались" }, en: { base: "need", s: "needs", past: "needed", pp: "needed" } },
  valita: { ru: { pres: ["я выбираю", "ты выбираешь", "он выбирает", "мы выбираем", "вы выбираете", "они выбирают"], sg: "выбрал", pl: "выбрали" }, en: { base: "choose", s: "chooses", past: "chose", pp: "chosen" } },
  harkita: { ru: { pres: ["я обдумываю", "ты обдумываешь", "он обдумывает", "мы обдумываем", "вы обдумываете", "они обдумывают"], sg: "обдумывал", pl: "обдумывали" }, en: { base: "consider", s: "considers", past: "considered", pp: "considered" } },
  vanheta: { ru: { pres: ["я старею", "ты стареешь", "он стареет", "мы стареем", "вы стареете", "они стареют"], sg: "стал старше", pl: "стали старше" }, en: { base: "grow older", s: "grows older", past: "grew older", pp: "grown older" } },
  kylmetä: { ru: { pres: ["я замерзаю", "ты замерзаешь", "он замерзает", "мы замерзаем", "вы замерзаете", "они замерзают"], sg: "замёрз", pl: "замёрзли" }, en: { base: "get cold", s: "gets cold", past: "got cold", pp: "gotten cold" } },
  paeta: { ru: { pres: ["я убегаю", "ты убегаешь", "он убегает", "мы убегаем", "вы убегаете", "они убегают"], sg: "убежал", pl: "убежали" }, en: { base: "flee", s: "flees", past: "fled", pp: "fled" } },
  kuulla: { ru: { pres: ["я слышу", "ты слышишь", "он слышит", "мы слышим", "вы слышите", "они слышат"], sg: "слышал", pl: "слышали" }, en: { base: "hear", s: "hears", past: "heard", pp: "heard" } },
  kuunnella: { ru: { pres: ["я слушаю", "ты слушаешь", "он слушает", "мы слушаем", "вы слушаете", "они слушают"], sg: "слушал", pl: "слушали" }, en: { base: "listen to", s: "listens to", past: "listened to", pp: "listened to" } },
  surra: { ru: { pres: ["я переживаю", "ты переживаешь", "он переживает", "мы переживаем", "вы переживаете", "они переживают"], sg: "переживал", pl: "переживали" }, en: { base: "mourn", s: "mourns", past: "mourned", pp: "mourned" } },
  rikkoa: { ru: { pres: ["я разбиваю", "ты разбиваешь", "он разбивает", "мы разбиваем", "вы разбиваете", "они разбивают"], sg: "разбил", pl: "разбили" }, en: { base: "break", s: "breaks", past: "broke", pp: "broken" } },
  harmittaa: { ru: { pres: ["я раздражаю", "ты раздражаешь", "он раздражает", "мы раздражаем", "вы раздражаете", "они раздражают"], sg: "раздражал", pl: "раздражали" }, en: { base: "annoy", s: "annoys", past: "annoyed", pp: "annoyed" } },
};

const BE_PRES = ["I am", "you are", "he is", "we are", "you are", "they are"];
const BE_PAST = ["I was", "you were", "he was", "we were", "you were", "they were"];
const BE_NEGPRES = ["I'm not", "you aren't", "he isn't", "we aren't", "you aren't", "they aren't"];
const BE_NEGPAST = ["I wasn't", "you weren't", "he wasn't", "we weren't", "you weren't", "they weren't"];

function ruGloss(v, t, p) {
  const g = GLOSS[v.inf];
  if (!g) return v.ru;
  const past = p >= 3 ? g.ru.pl : g.ru.sg;
  if (t === "pres") return g.ru.pres[p];
  if (t === "cond") return RU_PRON[p] + " бы " + past;
  if (t === "negcond") return RU_PRON[p] + " бы не " + past;
  if (t === "impf" || t === "perf") return RU_PRON[p] + " " + past;
  if (t === "negpres") {
    if (g.ru.neg) return g.ru.neg[p];
    const w = g.ru.pres[p].split(" ");
    return w[0] + " не " + w.slice(1).join(" ");
  }
  return RU_PRON[p] + " не " + past;
}

function enGloss(v, t, p) {
  const g = GLOSS[v.inf];
  if (!g) return "";
  const has = p === 2;
  if (g.be) {
    if (t === "pres") return BE_PRES[p];
    if (t === "impf") return BE_PAST[p];
    if (t === "perf") return EN_PRON[p] + (has ? " has " : " have ") + g.pp;
    if (t === "cond") return EN_PRON[p] + " would be";
    if (t === "negcond") return EN_PRON[p] + " wouldn't be";
    if (t === "negperf") return EN_PRON[p] + (has ? " hasn't" : " haven't") + " been";
    if (t === "negpres") return BE_NEGPRES[p];
    return BE_NEGPAST[p];
  }
  if (g.modal) {
    const m = g.modal;
    if (t === "pres") return EN_PRON[p] + " " + m.pres;
    if (t === "impf") return EN_PRON[p] + " " + m.past;
    if (t === "perf") return EN_PRON[p] + (has ? " has " : " have ") + m.pp;
    if (t === "cond") return EN_PRON[p] + " could";
    if (t === "negcond") return EN_PRON[p] + " couldn't";
    if (t === "negperf") return EN_PRON[p] + (has ? " hasn't" : " haven't") + " been able to";
    if (t === "negpres") return EN_PRON[p] + " " + m.neg;
    return EN_PRON[p] + " " + m.negPast;
  }
  const e = g.en;
  if (t === "pres") return EN_PRON[p] + " " + (has ? e.s : e.base);
  if (t === "impf") return EN_PRON[p] + " " + e.past;
  if (t === "perf") return EN_PRON[p] + (has ? " has " : " have ") + e.pp;
  if (t === "cond") return EN_PRON[p] + " would " + e.base;
  if (t === "negcond") return EN_PRON[p] + " wouldn't " + e.base;
  if (t === "negperf") return EN_PRON[p] + (has ? " hasn't " : " haven't ") + e.pp;
  if (t === "negpres") return EN_PRON[p] + " " + (has ? "doesn't" : "don't") + " " + e.base;
  return EN_PRON[p] + " didn't " + e.base;
}

/* В задании даётся всё, что не является собственно формой глагола:
   частица отрицания и вспомогательный olla. Иначе правильный вариант
   выдавал бы себя лишним словом. */
function verbAnswer(v, t, p) {
  const plural = p >= 3;
  if (t === "pres") return v.pres[p];
  if (t === "impf") return v.impf[p];
  if (t === "cond") return v.cond[p];
  if (t === "negpres") return v.neg;
  if (t === "negcond") return v.cond[2];
  return plural ? v.neet : v.nut;
}
function verbGiven(v, t, p) {
  if (t === "perf") return PERSONS[p] + " " + OLLA_PRES[p];
  if (t === "negperf") return PERSONS[p] + " " + NEG[p] + " ole";
  if (String(t).startsWith("neg")) return PERSONS[p] + " " + NEG[p];
  return PERSONS[p];
}
function verbCandidates(v, t) {
  return [...v.pres, ...v.impf, ...v.cond, v.nut, v.neet, v.neg];
}

function fullSentence(task) {
  const t = PERSONS[task.person] + " " + task.full;
  return task.verb.ex ? t + " " + task.verb.ex.fi : t;
}

function makeVerbTask(v, tenseId, p, box) {
  const answer = verbAnswer(v, tenseId, p);
  const wrong = shuffle([...new Set(verbCandidates(v, tenseId))].filter((f) => f !== answer)).slice(0, 3);
  const type = box >= 1 && Math.random() < 0.5 ? "type" : "mc";
  return {
    verb: v, tenseId, person: p, answer, type,
    given: verbGiven(v, tenseId, p),
    full: verbForm(v, tenseId, p),
    neg: String(tenseId).startsWith("neg"),
    aux: tenseId === "perf" || tenseId === "negperf",
    ru: ruGloss(v, tenseId, p),
    en: enGloss(v, tenseId, p),
    options: shuffle([answer, ...wrong]),
  };
}

/* ------------------------------------------------------------------ */
/*  Уровни курса и порядок уроков                                      */
/* ------------------------------------------------------------------ */
const LEVELS = {
  AB: { n: 1, name: "Absolute Beginner", ru: "Самое начало", fi: "Aivan alkeet" },
  LB: { n: 2, name: "Lower Beginner", ru: "Начальный", fi: "Alkeet" },
  BE: { n: 3, name: "Beginner", ru: "Базовый", fi: "Jatkoalkeet" },
  IN: { n: 4, name: "Intermediate", ru: "Средний", fi: "Keskitaso" },
  UI: { n: 5, name: "Upper Intermediate", ru: "Выше среднего", fi: "Ylempi keskitaso" },
  AD: { n: 6, name: "Advanced", ru: "Продвинутый", fi: "Edistynyt" },
};
const LEVEL_COUNT = Object.keys(LEVELS).length;
function levelOf(lesson) {
  const code = String(lesson.id || "").split("_")[0];
  return LEVELS[code] || LEVELS.LB;
}
function lessonNumber(lesson) {
  const m = String(lesson.id || "").match(/(\d+)\s*$/);
  return m ? parseInt(m[1], 10) : 0;
}

const BUILTIN = [...LESSONS_EXTRA, ...LESSONS_78, ...LESSONS_4569, ...LESSONS_NEXT, ...LESSONS_AB, ...LESSONS_BE, ...LESSONS_BE2, ...LESSONS_IN, LESSON_17, LESSON_18, LESSON_19, LESSON_20]
  .sort((a, b) => a.id.localeCompare(b.id));

function mergeLessons(base, extra) {
  const map = new Map(base.map((l) => [l.id, l]));
  (extra || []).forEach((l) => { if (l && l.id && !map.has(l.id)) map.set(l.id, l); });
  return [...map.values()];
}

/* ------------------------------------------------------------------ */
/*  Хранилище                                                          */
/* ------------------------------------------------------------------ */
const BANK_KEY = "suomi_bank_v1";
const PROG_KEY = "suomi_progress_v1";
const mem = {};
let lastStorageError = "";

async function stGet(key, shared) {
  try {
    if (!window.storage) return mem[key] ?? null;
    const r = await window.storage.get(key, shared);
    return r ? JSON.parse(r.value) : null;
  } catch (e) {
    return mem[key] ?? null;
  }
}
async function stSet(key, value, shared) {
  mem[key] = value;
  try {
    if (!window.storage) { lastStorageError = "window.storage недоступен в этом окружении"; return false; }
    await window.storage.set(key, JSON.stringify(value), shared);
    lastStorageError = "";
    return true;
  } catch (e) {
    lastStorageError = String((e && e.message) || e);
    return false;
  }
}

// Три попытки с паузой: хранилище ограничивает частоту запросов,
// и одиночный отказ обычно означает «слишком часто», а не «сломано».
async function stSetRetry(key, value, shared) {
  for (let i = 0; i < 3; i++) {
    if (await stSet(key, value, shared)) return true;
    await new Promise((r) => setTimeout(r, 600 * (i + 1)));
  }
  return false;
}

async function storageSelfTest() {
  try {
    if (!window.storage) return "window.storage недоступен в этом окружении";
    await window.storage.set("suomi_selftest", "1", false);
    const r = await window.storage.get("suomi_selftest", false);
    if (!r || r.value !== "1") return "запись прошла, но чтение вернуло пусто";
    return "";
  } catch (e) {
    return String((e && e.message) || e);
  }
}

/* ------------------------------------------------------------------ */
/*  Утилиты                                                            */
/* ------------------------------------------------------------------ */
const norm = (s) =>
  s.toLowerCase().replace(/[.,!?;:"'“”„…()]/g, "").trim();

// В 1-м и 2-м лице подлежащее можно опустить — глагол и так его выдаёт
// (уроки Absolute Beginner 2 и 6). В 3-м лице (hän, he) так делать нельзя,
// иначе непонятно, о ком речь, поэтому эти местоимения не трогаем.
const DROP_PRONOUN = /^(minä|sinä|me|te)\s+/;
const dropLeadingPronoun = (s) => s.replace(DROP_PRONOUN, "");

// Ответ засчитывается, если совпадает после обычной нормализации, а если
// нет — то же самое ещё раз, но уже без стоящего в начале местоимения
// minä/sinä/me/te, если оно там есть. Так «Minä olen iloinen.» и
// «Olen iloinen» признаются одним и тем же ответом в любую сторону.
function sameAnswer(typed, answer) {
  const a = norm(typed), b = norm(answer);
  if (a === b) return true;
  return dropLeadingPronoun(a) === dropLeadingPronoun(b);
}

const shuffle = (a) => {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
};

const INTERVALS = [10 * 60e3, 4 * 3600e3, 24 * 3600e3, 3 * 24 * 3600e3, 10 * 24 * 3600e3, 30 * 24 * 3600e3];

function itemId(lessonId, i) { return lessonId + "#" + i; }

/* ------------------------------------------------------------------ */
/*  Пять уровней освоения урока и последовательное открытие            */
/*  Бронза открывает следующий урок; золото — прежняя привычная        */
/*  галочка; платина и алмаз существуют только затем, чтобы было       */
/*  зачем возвращаться и повторять уже пройденное.                     */
/* ------------------------------------------------------------------ */
const TIERS = [
  { name: null, color: C.line },
  { name: "Бронза", color: "#B0793F" },
  { name: "Серебро", color: "#93A0AC" },
  { name: "Золото", color: C.ochre },
  { name: "Платина", color: "#3E93B0" },
  { name: "Алмаз", color: "#5B63D6" },
];

// Средний балл считается по тем же коробкам интервального повторения,
// что и остальной прогресс, только не обрезается на трёх, как раньше,
// а идёт до потолка в пять — так открывается путь после золота.
function lessonStats(lesson, progress) {
  const items = lesson.items.map((_, i) => progress[itemId(lesson.id, i)]);
  const n = items.length || 1;
  const sum = items.reduce((s, p) => s + Math.min(p ? p.box : 0, 5), 0);
  const avg = sum / n;
  const tier = avg >= 5 ? 5 : avg >= 4 ? 4 : avg >= 3 ? 3 : avg >= 2 ? 2 : avg >= 1 ? 1 : 0;
  const bar = Math.min(avg, 3) / 3; // прежняя полоска «до золота», ничего не меняет во внешнем виде
  return { avg, tier, bar };
}

// Уроки одного уровня по номеру, уровни по порядку — это и есть маршрут курса.
function courseOrder(lessons) {
  const byLevel = new Map();
  lessons.forEach((l) => {
    const lv = levelOf(l);
    if (!byLevel.has(lv.n)) byLevel.set(lv.n, []);
    byLevel.get(lv.n).push(l);
  });
  return [...byLevel.entries()]
    .sort((a, b) => a[0] - b[0])
    .flatMap(([, list]) => [...list].sort((a, b) => lessonNumber(a) - lessonNumber(b)));
}

// Урок открыт, если он первый в маршруте или предыдущий уже открыт и
// дошёл хотя бы до бронзы. Цепочка рвётся один раз — и всё дальше заперто.
function computeUnlocks(lessons, progress) {
  const order = courseOrder(lessons);
  const map = new Map();
  let chainOpen = true;
  order.forEach((l, i) => {
    const stats = lessonStats(l, progress);
    const unlocked = i === 0 ? true : chainOpen;
    map.set(l.id, { ...stats, unlocked });
    chainOpen = unlocked && stats.tier >= 1;
  });
  return map;
}

function flatten(lessons) {
  const out = [];
  lessons.forEach((l) =>
    l.items.forEach((it, i) => out.push({ ...it, id: itemId(l.id, i), lessonId: l.id, lessonTitle: l.title }))
  );
  return out;
}

// Реплики урока идут подряд и уже помечены k:"d" — из них собирается диалог.
function buildDialogues(lessons) {
  return lessons
    .map((l) => {
      const lines = [];
      l.items.forEach((it, i) => {
        if (it.k === "d") lines.push({ ...it, id: itemId(l.id, i), lessonId: l.id });
      });
      const speakers = [...new Set(lines.map((x) => x.who).filter(Boolean))];
      return { id: l.id, title: l.title, source: l.source, lines, speakers };
    })
    .filter((d) => d.lines.length >= 2 && d.speakers.length >= 2);
}

function buildGlossaryMap(lessons) {
  const map = new Map();
  lessons.forEach((l) =>
    (l.glossary || []).forEach((g) => {
      const entry = { ...g, lessonId: l.id };
      map.set(norm(g.w), entry);
      (g.forms || []).forEach((f) => { if (!map.has(norm(f))) map.set(norm(f), entry); });
    })
  );
  return map;
}

/* ------------------------------------------------------------------ */
/*  Речь                                                               */
/* ------------------------------------------------------------------ */
function useSpeech() {
  const [voice, setVoice] = useState(null);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  useEffect(() => {
    if (!supported) return;
    const pick = () => {
      const v = window.speechSynthesis.getVoices().find((x) => (x.lang || "").toLowerCase().startsWith("fi"));
      if (v) setVoice(v);
    };
    pick();
    window.speechSynthesis.onvoiceschanged = pick;
    return () => { if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null; };
  }, [supported]);
  const say = useCallback((text) => {
    if (!supported) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "fi-FI";
      if (voice) u.voice = voice;
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    } catch (e) { /* тишина — не критично */ }
  }, [supported, voice]);
  return { say, supported };
}

/* ------------------------------------------------------------------ */
/*  Финский текст с подчёркнутыми словами                              */
/* ------------------------------------------------------------------ */
function FinnishText({ text, glossary, onWord, size = 26, weight = 700 }) {
  const parts = text.split(/(\s+)/);
  return (
    <span style={{ fontSize: size, fontWeight: weight, lineHeight: 1.28, letterSpacing: "-0.015em", color: C.ink }}>
      {parts.map((p, i) => {
        if (/^\s+$/.test(p)) return <span key={i}>{p}</span>;
        const g = glossary.get(norm(p));
        if (!g) return <span key={i}>{p}</span>;
        return (
          <button
            key={i}
            onClick={() => onWord(g)}
            style={{
              font: "inherit", color: "inherit", background: "none", border: "none", padding: 0,
              borderBottom: `2px dotted ${C.ochre}`, cursor: "pointer",
            }}
          >
            {p}
          </button>
        );
      })}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Кнопки                                                             */
/* ------------------------------------------------------------------ */
function Primary({ children, onClick, disabled, tone = "blue" }) {
  const bg = disabled ? "#B9C4D2" : tone === "spruce" ? C.spruce : tone === "lingon" ? C.lingon : C.blue;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", background: bg, color: "#fff", border: "none", borderRadius: 6,
        padding: "16px 18px", fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em",
        cursor: disabled ? "default" : "pointer",
        boxShadow: disabled ? "none" : "0 3px 0 rgba(14,30,51,0.22)",
      }}
    >
      {children}
    </button>
  );
}
function Ghost({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", background: "transparent", color: C.blue, border: `1.5px solid ${C.line}`,
        borderRadius: 6, padding: "14px 18px", fontSize: 16, fontWeight: 600, cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function Dotted({ children, onClick }) {
  return (
    <button onClick={onClick}
      style={{
        background: "none", border: "none", padding: 0, cursor: "pointer",
        fontSize: 13.5, fontWeight: 600, color: C.inkSoft, fontFamily: FONT,
        borderBottom: `1.5px dotted ${C.ochre}`, lineHeight: 1.4,
      }}>
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Карточка слова (нижний лист)                                       */
/* ------------------------------------------------------------------ */
function WordSheet({ entry, onClose, say }) {
  if (!entry) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(14,30,51,0.45)", zIndex: 60, display: "flex", alignItems: "flex-end" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.card, width: "100%", borderRadius: "14px 14px 0 0", padding: "20px 20px 32px",
          maxHeight: "78vh", overflowY: "auto", borderTop: `4px solid ${C.ochre}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em" }}>{entry.w}</div>
          <button onClick={() => say(entry.w)} style={{ background: C.blueSoft, border: "none", borderRadius: 6, padding: 8, cursor: "pointer" }}>
            <Volume2 size={18} color={C.blue} />
          </button>
          <div style={{ flex: 1 }} />
          <button onClick={onClose} style={{ background: "none", border: "none", padding: 6, cursor: "pointer" }}>
            <X size={22} color={C.inkSoft} />
          </button>
        </div>
        <div style={{ fontSize: 18, color: C.ink, marginTop: 8 }}>{entry.ru}</div>
        {entry.en && <div style={{ fontSize: 14, color: C.inkSoft, marginTop: 2 }}>{entry.en}</div>}
        {entry.note && (
          <div style={{ marginTop: 16, background: C.ochreSoft, borderRadius: 8, padding: 14, fontSize: 15, lineHeight: 1.5, color: C.ink, whiteSpace: "pre-line" }}>
            {entry.note}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Генерация упражнений                                               */
/* ------------------------------------------------------------------ */
function makeExercise(item, pool, box, speechOk, avoid) {
  const tokens = item.fi.split(/\s+/);
  const canBank = tokens.length >= 2 && tokens.length <= 9;
  const canType = box >= 1 && item.fi.length <= 30;

  // Все типы доступны с первой тренировки. Чем выше коробка, тем чаще
  // достаются сложные задания: сборка и ввод.
  const types = ["mc_fi_ru", "mc_ru_fi"];
  if (box === 0) types.push("mc_fi_ru");
  if (canBank) { types.push("bank"); if (box >= 1) types.push("bank"); }
  if (canType) { types.push("type"); if (box >= 2) types.push("type"); }
  if (speechOk) types.push("listen");

  const pick = () => types[Math.floor(Math.random() * types.length)];
  let type = pick();
  if (type === avoid) type = pick();

  const others = shuffle(pool.filter((p) => p.id !== item.id && p.k === item.k)).slice(0, 3);
  const filler = others.length === 3 ? others : [...others, ...shuffle(pool.filter((p) => p.id !== item.id)).slice(0, 3 - others.length)];

  if (type === "mc_fi_ru" || type === "listen") {
    return { type, item, options: shuffle([item.ru, ...filler.map((f) => f.ru)]), answer: item.ru };
  }
  if (type === "mc_ru_fi") {
    return { type, item, options: shuffle([item.fi, ...filler.map((f) => f.fi)]), answer: item.fi };
  }
  if (type === "bank") {
    const extra = shuffle(pool.flatMap((p) => p.fi.split(/\s+/))).filter((w) => !tokens.includes(w)).slice(0, Math.min(3, 10 - tokens.length));
    return { type, item, chips: shuffle([...tokens, ...extra]), answer: item.fi };
  }
  return { type: "type", item, answer: item.fi };
}

/* ------------------------------------------------------------------ */
/*  Экран тренировки                                                   */
/* ------------------------------------------------------------------ */
function Session({ queue, pool, glossary, onFinish, onExit, onAnswer, say, speechOk }) {
  const [idx, setIdx] = useState(0);
  const [ex, setEx] = useState(null);
  const [picked, setPicked] = useState(null);
  const [chips, setChips] = useState([]);
  const [typed, setTyped] = useState("");
  const [result, setResult] = useState(null); // null | 'ok' | 'no'
  const [word, setWord] = useState(null);
  const [stats, setStats] = useState({ ok: 0, no: 0 });
  const results = useRef([]);
  const lastType = useRef(null);
  const inputRef = useRef(null);

  const current = queue[idx];

  useEffect(() => {
    if (!current) return;
    const e = makeExercise(current.item, pool, current.box, speechOk, lastType.current);
    lastType.current = e.type;
    setEx(e); setPicked(null); setChips([]); setTyped(""); setResult(null);
    if (e.type === "listen") setTimeout(() => say(e.item.fi), 350);
  }, [idx, current, pool, say, speechOk]);

  if (!current || !ex) return null;

  const check = () => {
    let ok = false;
    if (ex.type === "bank") ok = norm(chips.map((c) => c.w).join(" ")) === norm(ex.answer);
    else if (ex.type === "type") ok = sameAnswer(typed, ex.answer);
    else ok = picked === ex.answer;
    setResult(ok ? "ok" : "no");
    setStats((s) => ({ ok: s.ok + (ok ? 1 : 0), no: s.no + (ok ? 0 : 1) }));
    results.current.push({ id: current.item.id, ok });
    onAnswer(current.item.id, ok);
    if (ok) say(ex.item.fi);
  };

  const next = () => {
    if (idx + 1 >= queue.length) onFinish(results.current, stats);
    else setIdx(idx + 1);
  };

  const ready =
    ex.type === "bank" ? chips.length > 0 : ex.type === "type" ? typed.trim().length > 0 : picked !== null;

  // Сколько букв ответа уже набрано верно — по ним подсвечивается схема слова.
  const shownPrefix = (() => {
    if (ex.type !== "type") return 0;
    let i = 0;
    while (i < typed.length && i < ex.answer.length && typed[i].toLowerCase() === ex.answer[i].toLowerCase()) i++;
    return i;
  })();

  const hintNextLetter = () => {
    if (result) return;
    setTyped(ex.answer.slice(0, shownPrefix + 1));
    inputRef.current?.focus();
  };

  const prompt = {
    mc_fi_ru: "Что это значит?",
    mc_ru_fi: "Как сказать по-фински?",
    bank: "Соберите предложение",
    type: "Напишите по-фински",
    listen: "Послушайте и выберите перевод",
  }[ex.type];

  const available = ex.type === "bank" ? ex.chips.filter((c, i) => !chips.some((ch) => ch.i === i && ch.w === c)) : [];

  return (
    <div style={{ minHeight: "100vh", background: C.paper, display: "flex", flexDirection: "column" }}>
      {/* шапка */}
      <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onExit} style={{ background: "none", border: "none", padding: 4, cursor: "pointer" }}>
          <X size={24} color={C.inkSoft} />
        </button>
        <div style={{ flex: 1, display: "flex", gap: 3 }}>
          {queue.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 6, borderRadius: 1, background: i < idx ? C.blue : i === idx ? C.ochre : C.line }} />
          ))}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.inkSoft, minWidth: 38, textAlign: "right" }}>
          {idx + 1}/{queue.length}
        </div>
      </div>

      <div style={{ flex: 1, padding: "10px 18px 180px" }}>
        <div style={{ fontSize: 15, color: C.inkSoft, fontWeight: 600, marginBottom: 18 }}>{prompt}</div>

        {/* задание */}
        {ex.type === "mc_fi_ru" && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <button onClick={() => say(ex.item.fi)} title="Повторить"
              style={{ background: C.blueSoft, border: "none", borderRadius: 6, padding: "9px 11px", marginTop: 4, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <Volume2 size={19} color={C.blue} />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: C.blue }}>Повтор</span>
            </button>
            <FinnishText text={ex.item.fi} glossary={glossary} onWord={setWord} size={ex.item.k === "w" ? 34 : 26} />
          </div>
        )}
        {ex.type === "listen" && (
          <button
            onClick={() => say(ex.item.fi)}
            style={{ background: C.blue, border: "none", borderRadius: 10, padding: "22px 26px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, color: "#fff", fontSize: 17, fontWeight: 700 }}
          >
            <Play size={22} fill="#fff" color="#fff" /> Прослушать ещё раз
          </button>
        )}
        {(ex.type === "mc_ru_fi" || ex.type === "bank" || ex.type === "type") && (
          <div style={{ fontSize: 22, fontWeight: 600, color: C.ink, lineHeight: 1.35 }}>{ex.item.ru}</div>
        )}

        {/* варианты */}
        {(ex.type === "mc_fi_ru" || ex.type === "mc_ru_fi" || ex.type === "listen") && (
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 10 }}>
            {ex.options.map((o) => {
              const sel = picked === o;
              return (
                <button
                  key={o}
                  onClick={() => !result && setPicked(o)}
                  style={{
                    textAlign: "left", background: sel ? C.blueSoft : C.card,
                    border: `2px solid ${sel ? C.blue : C.line}`, borderRadius: 8, padding: "15px 16px",
                    fontSize: 17, color: C.ink, cursor: "pointer", lineHeight: 1.35,
                  }}
                >
                  {o}
                </button>
              );
            })}
          </div>
        )}

        {ex.type === "bank" && (
          <div style={{ marginTop: 24 }}>
            <div style={{ minHeight: 64, borderBottom: `2px solid ${C.line}`, paddingBottom: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {chips.map((c, n) => (
                <button key={n} onClick={() => !result && setChips(chips.filter((_, k) => k !== n))}
                  style={{ background: C.card, border: `1.5px solid ${C.line}`, borderRadius: 6, padding: "9px 12px", fontSize: 17, fontWeight: 600, color: C.ink, cursor: "pointer" }}>
                  {c.w}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ex.chips.map((c, i) =>
                chips.some((ch) => ch.i === i) ? (
                  <span key={i} style={{ borderRadius: 6, padding: "9px 12px", fontSize: 17, background: C.line, color: C.line }}>{c}</span>
                ) : (
                  <button key={i} onClick={() => !result && setChips([...chips, { w: c, i }])}
                    style={{ background: C.card, border: `1.5px solid ${C.line}`, borderRadius: 6, padding: "9px 12px", fontSize: 17, fontWeight: 600, color: C.ink, cursor: "pointer", boxShadow: "0 2px 0 rgba(14,30,51,0.12)" }}>
                    {c}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {ex.type === "type" && (
          <div style={{ marginTop: 22 }}>
            <textarea
              ref={inputRef}
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              readOnly={!!result}
              rows={2}
              placeholder="Пишите здесь..."
              style={{ width: "100%", fontSize: 20, fontWeight: 600, color: C.ink, padding: 14, borderRadius: 8, border: `2px solid ${C.line}`, background: C.card, resize: "none", fontFamily: FONT }}
            />
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 10, fontSize: 19, fontWeight: 700, letterSpacing: "0.06em", color: C.inkSoft }}>
              {ex.answer.split(/\s+/).map((w, wi, arr) => {
                const start = arr.slice(0, wi).reduce((n, p) => n + p.length + 1, 0);
                return (
                  <span key={wi}>
                    {w.split("").map((ch, ci) => (
                      <span key={ci} style={{ color: start + ci < shownPrefix ? C.ink : C.inkSoft }}>
                        {start + ci < shownPrefix ? ch : "·"}
                      </span>
                    ))}
                  </span>
                );
              })}
            </div>
            <div style={{ marginTop: 12 }}>
              <button
                onClick={hintNextLetter}
                disabled={!!result}
                style={{ background: C.ochreSoft, border: `1.5px solid ${C.ochre}`, borderRadius: 6, padding: "10px 16px", fontSize: 15, fontWeight: 700, color: C.ink, cursor: result ? "default" : "pointer" }}
              >
                Подсказать букву
              </button>
            </div>
          </div>
        )}
      </div>

      {/* нижняя панель */}
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, background: result ? (result === "ok" ? C.spruceSoft : C.lingonSoft) : C.paper, borderTop: `1px solid ${C.line}`, padding: "14px 18px calc(18px + env(safe-area-inset-bottom))" }}>
        {result && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: result === "ok" ? C.spruce : C.lingon, marginBottom: 6 }}>
              {result === "ok" ? "Oikein — верно" : "Правильный ответ"}
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <button onClick={() => say(ex.item.fi)} title="Повторить"
                style={{ background: "rgba(255,255,255,0.85)", border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 10px", marginTop: 2, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <Volume2 size={16} color={C.ink} />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: C.ink }}>Повтор</span>
              </button>
              <div>
                <FinnishText text={ex.item.fi} glossary={glossary} onWord={setWord} size={19} weight={700} />
                <div style={{ fontSize: 15, color: C.ink, marginTop: 4 }}>{ex.item.ru}</div>
                {ex.item.en && <div style={{ fontSize: 13, color: C.inkSoft }}>{ex.item.en}</div>}
              </div>
            </div>
          </div>
        )}
        {!result ? (
          <Primary onClick={check} disabled={!ready}>Проверить</Primary>
        ) : (
          <Primary onClick={next} tone={result === "ok" ? "spruce" : "lingon"}>
            {idx + 1 >= queue.length ? "Завершить" : "Дальше"}
          </Primary>
        )}
      </div>

      <WordSheet entry={word} onClose={() => setWord(null)} say={say} />
      {!speechOk && ex.type === "listen" && (
        <div style={{ position: "fixed", top: 60, left: 18, right: 18, background: C.ochreSoft, padding: 10, borderRadius: 6, fontSize: 13 }}>
          Озвучка недоступна в этом браузере.
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Главный компонент                                                  */
/* ------------------------------------------------------------------ */
export default function App() {
  const [lessons, setLessons] = useState(BUILTIN);
  const [progress, setProgress] = useState({});
  const [screen, setScreen] = useState("home");
  const [queue, setQueue] = useState([]);
  const [summary, setSummary] = useState(null);
  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveNote, setSaveNote] = useState("");
  const [storeFail, setStoreFail] = useState("");
  const [verbTasks, setVerbTasks] = useState([]);
  const [dialogRun, setDialogRun] = useState(null);
  const [verbFilter, setVerbFilter] = useState(null);
  const [runKey, setRunKey] = useState(0);
  const [mode, setMode] = useState("phrases");
  const lastItems = useRef(null);
  const { say, supported } = useSpeech();

  useEffect(() => {
    (async () => {
      let extra = await stGet(BANK_KEY, true);
      if (!extra) extra = await stGet(BANK_KEY, false);
      if (extra && Array.isArray(extra.lessons)) setLessons(mergeLessons(BUILTIN, extra.lessons));
      const p = await stGet(PROG_KEY, false);
      if (p) setProgress(p);
      setLoading(false);
    })();
  }, []);

  const pool = useMemo(() => flatten(lessons), [lessons]);
  const glossary = useMemo(() => buildGlossaryMap(lessons), [lessons]);
  const dialogs = useMemo(() => buildDialogues(lessons), [lessons]);
  const dPool = useMemo(() => pool.filter((p) => p.k === "d"), [pool]);
  const unlockMap = useMemo(() => computeUnlocks(lessons, progress), [lessons, progress]);
  const nextLessonId = useMemo(() => {
    for (const l of courseOrder(lessons)) if (unlockMap.get(l.id).bar < 1) return l.id;
    return null;
  }, [lessons, unlockMap]);

  const saveBank = async (next) => {
    setLessons(next);
    const builtinIds = new Set(BUILTIN.map((l) => l.id));
    const extra = next.filter((l) => !builtinIds.has(l.id));
    let ok = await stSetRetry(BANK_KEY, { lessons: extra }, true);
    if (!ok) ok = await stSetRetry(BANK_KEY, { lessons: extra }, false);
    setSaveNote(ok ? "" : "Хранилище недоступно: добавленные уроки исчезнут после перезагрузки. Пришлите мне JSON — я вошью урок прямо в приложение.");
    return ok;
  };
  const progressRef = useRef(progress);
  useEffect(() => { progressRef.current = progress; }, [progress]);
  const pendingSave = useRef(null);
  const saveTimer = useRef(null);

  const flushProgress = useCallback(async () => {
    saveTimer.current = null;
    const value = pendingSave.current;
    if (!value) return;
    pendingSave.current = null;
    let ok = await stSetRetry(PROG_KEY, value, false);
    if (!ok) ok = await stSetRetry(PROG_KEY, value, true);
    setStoreFail(ok ? "" : lastStorageError || "запись не прошла");
  }, []);

  // Ответы копятся в памяти и уходят в хранилище одной записью:
  // у него есть ограничение на частоту запросов.
  const queueProgressSave = (next) => {
    pendingSave.current = next;
    if (saveTimer.current) return;
    saveTimer.current = setTimeout(flushProgress, 4000);
  };

  const applyAnswer = (id, ok) => {
    const cur = progressRef.current[id] || { box: 0, seen: 0 };
    const box = ok ? Math.min(cur.box + 1, INTERVALS.length - 1) : 0;
    const next = { ...progressRef.current, [id]: { box, seen: cur.seen + 1, due: Date.now() + INTERVALS[box] } };
    progressRef.current = next;
    setProgress(next);
    queueProgressSave(next);
  };

  // Диалог начинается заново: счётчик runKey пересоздаёт экран с первой реплики.
  const startDialog = (d, role) => {
    setMode("dialog");
    setDialogRun({ dialog: d, role });
    setRunKey((k) => k + 1);
    setScreen("dialogrun");
  };

  // Повтор запускает то же занятие, что и было: фразы, глаголы или диалог.
  const repeatRun = () => {
    if (mode === "verbs") startVerbs(verbFilter);
    else if (mode === "dialog" && dialogRun) startDialog(dialogRun.dialog, dialogRun.role);
    else startSession(lastItems.current || pool);
  };

  const startVerbs = (filter) => {
    const f = filter || verbFilter || { tenses: BASE_TENSES.map((t) => t.id), types: [1, 2, 3, 4, 5, 6] };
    setVerbFilter(f);
    // Каждое выбранное время приходит вместе со своим отрицанием.
    const wanted = f.tenses.flatMap((id) => (NEG_OF[id] ? [id, NEG_OF[id]] : [id]));
    const tasks = [];
    const seen = new Set();
    // Сначала формы, которые пора повторить, потом новые.
    const nowTs = Date.now();
    const all = [];
    VERBS.filter((v) => f.types.includes(v.type)).forEach((v) => TENSES.filter((t) => wanted.includes(t.id)).forEach((t) => PERSONS.forEach((_, pi) => {
      const id = verbTaskId(v, t.id, pi);
      const pr = progressRef.current[id];
      all.push({ verb: v, tenseId: t.id, person: pi, box: pr ? pr.box : 0, rank: !pr ? 1 : pr.due <= nowTs ? 0 : 2, due: pr ? pr.due : 0 });
    })));
    const dueOnes = all.filter((x) => x.rank === 0).sort((a, b) => a.due - b.due).slice(0, 6);
    const fresh = shuffle(all.filter((x) => x.rank === 1)).slice(0, 12);
    [...dueOnes, ...fresh].forEach((x) => {
      const id = verbTaskId(x.verb, x.tenseId, x.person);
      if (seen.has(id) || tasks.length >= 12) return;
      seen.add(id); tasks.push(x);
    });
    if (!tasks.length) return;
    setMode("verbs");
    setVerbTasks(shuffle(tasks));
    setScreen("verbs");
  };

  const due = useMemo(() => {
    const now = Date.now();
    return pool.filter((it) => {
      const p = progress[it.id];
      return p && p.due <= now;
    }).length;
  }, [pool, progress]);

  const studied = useMemo(() => {
    const ids = new Set(pool.map((it) => it.id));
    return Object.keys(progress).filter((id) => ids.has(id)).length;
  }, [pool, progress]);

  const startSession = (items) => {
    const now = Date.now();
    const scored = items.map((it) => {
      const p = progress[it.id];
      const rank = !p ? 1 : p.due <= now ? 0 : 2;
      return { item: it, box: p ? p.box : 0, rank, due: p ? p.due : 0 };
    });
    const dueOnes = scored.filter((s) => s.rank === 0).sort((a, b) => a.due - b.due);
    const fresh = shuffle(scored.filter((s) => s.rank === 1));
    const rest = shuffle(scored.filter((s) => s.rank === 2));
    const q = [...dueOnes.slice(0, 7), ...fresh.slice(0, 10), ...rest].slice(0, 12);
    if (!q.length) return;
    lastItems.current = items;
    setMode("phrases");
    setQueue(shuffle(q));
    setScreen("session");
  };

  const restoreProgress = (p) => {
    const merged = { ...progressRef.current, ...p };
    progressRef.current = merged;
    setProgress(merged);
    queueProgressSave(merged);
    return Object.keys(merged).length;
  };

  const retestStorage = async () => {
    const err = await storageSelfTest();
    setStoreFail(err);
    if (!err) {
      pendingSave.current = progressRef.current;
      flushProgress();
    }
  };

  const finishSession = (results, stats) => {
    flushProgress();
    setSummary(stats);
    setScreen("summary");
  };

  if (loading) {
    return (
      <div style={{ fontFamily: FONT, background: C.paper, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: C.inkSoft }}>
        Раздуваем горн...
      </div>
    );
  }

  if (screen === "session") {
    return (
      <div style={{ fontFamily: FONT }}>
        <Session queue={queue} pool={pool} glossary={glossary} say={say} speechOk={supported}
          onExit={() => { flushProgress(); setScreen("home"); }} onFinish={finishSession} onAnswer={applyAnswer} />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: FONT, background: C.paper, minHeight: "100vh", color: C.ink }}>
      {screen === "verbs" && (
        <VerbSession tasks={verbTasks} say={say} onAnswer={applyAnswer}
          onExit={() => { flushProgress(); setScreen("verbhub"); }}
          onFinish={(stats) => { flushProgress(); setSummary(stats); setScreen("summary"); }} />
      )}
      {screen === "dialogrun" && dialogRun && (
        <DialogSession key={runKey} dialog={dialogRun.dialog} role={dialogRun.role} dPool={dPool}
          glossary={glossary} progress={progress} say={say} onAnswer={applyAnswer}
          onExit={() => { flushProgress(); setScreen("dialogs"); }}
          onFinish={(stats) => { flushProgress(); setSummary(stats); setScreen("summary"); }} />
      )}
      {screen === "verbhub" && (
        <VerbHub progress={progress} initial={verbFilter} onStart={startVerbs} onBack={() => setScreen("home")} />
      )}
      {screen === "dialogs" && (
        <DialogPick dialogs={dialogs} progress={progress} onStart={startDialog} onBack={() => setScreen("home")} />
      )}
      {screen === "home" && (
        <Home lessons={lessons} pool={pool} progress={progress} due={due} studied={studied} unlockMap={unlockMap} nextLessonId={nextLessonId} say={say} onWord={setWord} onVerbs={() => setScreen("verbhub")} onDialogs={() => setScreen("dialogs")} saveNote={saveNote} storeFail={storeFail} onRetest={retestStorage}
          onStart={() => startSession(pool.filter((p) => { const st = unlockMap.get(p.lessonId); return st && st.unlocked; }))}
          onLesson={(l) => startSession(pool.filter((p) => p.lessonId === l.id))}
          onBank={() => setScreen("bank")} onImport={() => setScreen("import")} />
      )}
      {screen === "bank" && (
        <Bank pool={pool} glossary={glossary} say={say} onWord={setWord} onBack={() => setScreen("home")} />
      )}
      {screen === "import" && (
        <Import lessons={lessons} onSave={saveBank} progress={progress} onProgress={restoreProgress} onBack={() => setScreen("home")} />
      )}
      {screen === "summary" && summary && (
        <Summary stats={summary} mode={mode} onHome={() => setScreen("home")} onAgain={repeatRun} />
      )}
      <WordSheet entry={word} onClose={() => setWord(null)} say={say} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Тренировка глаголов                                                */
/* ------------------------------------------------------------------ */
function VerbSession({ tasks, onFinish, onExit, onAnswer, say }) {
  const [idx, setIdx] = useState(0);
  const [task, setTask] = useState(null);
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState("");
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState({ ok: 0, no: 0 });
  const [word, setWord] = useState(null);
  const inputRef = useRef(null);

  const cur = tasks[idx];

  useEffect(() => {
    if (!cur) return;
    setTask(makeVerbTask(cur.verb, cur.tenseId, cur.person, cur.box));
    setPicked(null); setTyped(""); setResult(null);
  }, [idx, cur]);

  if (!cur || !task) return null;

  const tense = TENSES.find((t) => t.id === task.tenseId);
  const ex = task.verb.ex;
  const [ruHead, ruVerb] = splitGloss(task.ru);
  const [enHead, enVerb] = splitGloss(task.en);

  const shownPrefix = (() => {
    let i = 0;
    while (i < typed.length && i < task.answer.length && typed[i].toLowerCase() === task.answer[i].toLowerCase()) i++;
    return i;
  })();

  const check = () => {
    const ok = task.type === "type" ? norm(typed) === norm(task.answer) : picked === task.answer;
    setResult(ok ? "ok" : "no");
    setStats((s) => ({ ok: s.ok + (ok ? 1 : 0), no: s.no + (ok ? 0 : 1) }));
    onAnswer(verbTaskId(task.verb, task.tenseId, task.person), ok);
    say(fullSentence(task));
  };

  const next = () => {
    if (idx + 1 >= tasks.length) onFinish(stats);
    else setIdx(idx + 1);
  };

  const ready = task.type === "type" ? typed.trim().length > 0 : picked !== null;

  return (
    <div style={{ minHeight: "100vh", background: C.paper, display: "flex", flexDirection: "column", fontFamily: FONT }}>
      <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onExit} style={{ background: "none", border: "none", padding: 4, cursor: "pointer" }}>
          <X size={24} color={C.inkSoft} />
        </button>
        <div style={{ flex: 1, display: "flex", gap: 3 }}>
          {tasks.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 6, borderRadius: 1, background: i < idx ? C.blue : i === idx ? C.ochre : C.line }} />
          ))}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.inkSoft, minWidth: 38, textAlign: "right" }}>{idx + 1}/{tasks.length}</div>
      </div>

      <div style={{ flex: 1, padding: "10px 18px 190px" }}>
        <div style={{ fontSize: 15, color: C.inkSoft, fontWeight: 600 }}>
          {task.neg && task.aux
            ? "Отрицание и ole даны — нужно только причастие"
            : task.neg
            ? "Частица отрицания дана — нужен только глагол"
            : task.aux
            ? "Вспомогательный глагол дан — нужно только причастие"
            : "Поставьте глагол в нужную форму"}
        </div>

        <div style={{
          marginTop: 16, background: C.card, border: `1px solid ${C.line}`,
          borderLeft: `4px solid ${task.neg ? C.lingon : C.spruce}`, borderRadius: 6, padding: "16px 16px 14px",
        }}>
          <div style={{ fontSize: 17, color: C.ink, lineHeight: 1.3 }}>
            {ruHead}{" "}
            <b style={{ fontWeight: 800 }}>{ruVerb}</b>
            {ex ? " " + ex.ru : ""}
          </div>
          <div style={{ fontSize: 13.5, color: C.inkSoft, marginTop: 2 }}>
            {enHead}{" "}
            <b style={{ fontWeight: 800, color: C.ink }}>{enVerb}</b>
            {ex ? " " + ex.en : ""}
          </div>

          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", color: task.neg ? C.lingon : C.spruce, lineHeight: 1.25 }}>
              {task.given}{" "}
              <span style={{ color: C.inkSoft }}>
                (<b style={{ color: C.ink, fontWeight: 800 }}>{task.verb.inf}</b>)
              </span>
              {ex && <span style={{ fontSize: 21, fontWeight: 700, color: C.inkSoft }}> {ex.fi}</span>}
            </div>
            <button onClick={() => say(task.verb.inf)} title="Послушать инфинитив"
              style={{ background: C.blueSoft, border: "none", borderRadius: 6, padding: "8px 10px", cursor: "pointer", display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
              <Volume2 size={17} color={C.blue} />
            </button>
          </div>

          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
            <Dotted onClick={() => setWord({ w: tense.ru, ru: "как образуется", en: "", note: TENSE_NOTES[task.tenseId] })}>
              {tense.ru}
            </Dotted>
            <span style={{ color: C.line }}>·</span>
            <Dotted onClick={() => setWord(VERB_TYPES[task.verb.type])}>
              {VERB_TYPES[task.verb.type].w}
            </Dotted>
            {task.verb.grad && (
              <>
                <span style={{ color: C.line }}>·</span>
                <Dotted onClick={() => setWord({
                  w: "Чередование ступеней", ru: task.verb.grad, en: "consonant gradation",
                  note: "Основа глагола меняется при спряжении, если в ней есть k, p или t. Сильная ступень: kk, pp, tt, а также nt, mp, ht, lt, rt. Слабая: k, p, t, а k между гласными и вовсе пропадает; nt → nn, mp → mm, ht → hd, lt → ll, rt → rr, t → d, p → v.\nВ типах 1 и 2 сильная ступень стоит в инфинитиве и 3-м лице, слабая — в остальных лицах и в отрицании. В типах 3 и 4 наоборот: инфинитив слабый, личные формы сильные.",
                })}>
                  {task.verb.grad}
                </Dotted>
              </>
            )}
          </div>
        </div>

        {task.type === "mc" ? (
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 10 }}>
            {task.options.map((o) => {
              const sel = picked === o;
              return (
                <button key={o} onClick={() => !result && setPicked(o)}
                  style={{ textAlign: "left", background: sel ? C.blueSoft : C.card, border: `2px solid ${sel ? C.blue : C.line}`, borderRadius: 8, padding: "15px 16px", fontSize: 19, fontWeight: 600, color: C.ink, cursor: "pointer" }}>
                  {o}
                </button>
              );
            })}
          </div>
        ) : (
          <div style={{ marginTop: 20 }}>
            <input ref={inputRef} value={typed} onChange={(e) => setTyped(e.target.value)} readOnly={!!result}
              placeholder={task.aux ? "Только причастие" : task.neg ? "Только глагол, без " + NEG[task.person] : "Форма глагола"}
              style={{ width: "100%", fontSize: 21, fontWeight: 700, color: C.ink, padding: 14, borderRadius: 8, border: `2px solid ${C.line}`, background: C.card, fontFamily: FONT }} />
            <div style={{ marginTop: 12, fontSize: 19, fontWeight: 700, letterSpacing: "0.06em" }}>
              {task.answer.split("").map((ch, i) => (
                <span key={i} style={{ color: i < shownPrefix ? C.ink : C.inkSoft }}>
                  {i < shownPrefix ? ch : ch === " " ? " " : "·"}
                </span>
              ))}
            </div>
            <button onClick={() => { if (!result) { setTyped(task.answer.slice(0, shownPrefix + 1)); inputRef.current?.focus(); } }}
              style={{ marginTop: 12, background: C.ochreSoft, border: `1.5px solid ${C.ochre}`, borderRadius: 6, padding: "10px 16px", fontSize: 15, fontWeight: 700, color: C.ink, cursor: "pointer" }}>
              Подсказать букву
            </button>
          </div>
        )}
      </div>

      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, background: result ? (result === "ok" ? C.spruceSoft : C.lingonSoft) : C.paper, borderTop: `1px solid ${C.line}`, padding: "14px 18px calc(18px + env(safe-area-inset-bottom))" }}>
        {result && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: result === "ok" ? C.spruce : C.lingon, marginBottom: 4 }}>
              {result === "ok" ? "Oikein — верно" : "Правильная форма"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 21, fontWeight: 800, color: C.ink }}>
                {PERSONS[task.person]} {task.full}
                {ex && <span style={{ color: C.inkSoft }}> {ex.fi}</span>}
              </div>
              <button onClick={() => say(fullSentence(task))} title="Повторить"
                style={{ background: "rgba(255,255,255,0.85)", border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 10px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <Volume2 size={16} color={C.ink} />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: C.ink }}>Повтор</span>
              </button>
            </div>
            <div style={{ fontSize: 14.5, color: C.ink, marginTop: 3 }}>
              {task.ru}{ex ? " " + ex.ru : ""} · {task.en}{ex ? " " + ex.en : ""}
            </div>
            <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 2 }}>
              {task.verb.inf} · {tense.ru}
            </div>
            {task.verb.note && <div style={{ fontSize: 13.5, color: C.ink, marginTop: 6 }}>{task.verb.note}</div>}
          </div>
        )}
        {!result ? (
          <Primary onClick={check} disabled={!ready}>Проверить</Primary>
        ) : (
          <Primary onClick={next} tone={result === "ok" ? "spruce" : "lingon"}>
            {idx + 1 >= tasks.length ? "Завершить" : "Дальше"}
          </Primary>
        )}
      </div>

      <WordSheet entry={word} onClose={() => setWord(null)} say={say} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Глаголы: прогресс и выбор темы в одном экране                      */
/* ------------------------------------------------------------------ */
// Заливка внутри кнопки показывает, насколько тема освоена, а рамка —
// выбрана ли она для тренировки. Два разных смысла, два разных признака.
function Chip({ on, onClick, children, sub, fill = 0, pct }) {
  return (
    <button onClick={onClick}
      style={{
        position: "relative", overflow: "hidden", textAlign: "left",
        background: C.card, border: `2px solid ${on ? C.blue : C.line}`,
        borderRadius: 7, padding: "7px 9px", cursor: "pointer",
        flex: "1 1 44%", minWidth: 138,
      }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.round(Math.min(1, fill) * 100)}%`, background: C.spruceSoft }} />
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
          <div style={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: on ? C.blue : C.ink, lineHeight: 1.2 }}>{children}</div>
          {pct !== undefined && (
            <div style={{ fontSize: 11, fontWeight: 700, color: fill >= 1 ? C.spruce : C.inkSoft }}>{pct}%</div>
          )}
        </div>
        {sub && <div style={{ fontSize: 10.5, color: C.inkSoft, marginTop: 2 }}>{sub}</div>}
      </div>
    </button>
  );
}

const TYPE_SHORT = { 1: "на -a/-ä", 2: "на -da/-dä", 3: "на -la, -na, -ra", 4: "на -ta/-tä", 5: "на -ita/-itä", 6: "на -eta/-etä" };

function VerbHub({ progress, initial, onStart, onBack }) {
  const [tenses, setTenses] = useState(initial && initial.tenses ? initial.tenses : []);
  const [types, setTypes] = useState(initial && initial.types ? initial.types : []);

  const allTenses = BASE_TENSES.map((t) => t.id);
  const allTypes = [1, 2, 3, 4, 5, 6];
  // Отрицание не выбирается отдельно: оно всегда идёт внутри своего времени.
  const expand = (ids) => ids.flatMap((id) => [id, NEG_OF[id]]);
  // Пустой список типов означает «любой» — этот фильтр можно не трогать.
  const usedTypes = types.length ? types : allTypes;

  // Одна «клетка» — глагол в одном лице и времени. Освоение считается так же,
  // как у фраз: три верных ответа дают полную долю.
  const stat = (tenseIds, typeIds) => {
    let total = 0, got = 0, started = 0, due = 0;
    const now = Date.now();
    VERBS.filter((v) => typeIds.includes(v.type)).forEach((v) =>
      tenseIds.forEach((tid) =>
        PERSONS.forEach((_, pi) => {
          total++;
          const p = progress[verbTaskId(v, tid, pi)];
          if (p) { started++; got += Math.min(p.box, 3); if (p.due <= now) due++; }
        })
      )
    );
    return { total, started, due, m: total ? got / (total * 3) : 0 };
  };

  const chosen = stat(expand(tenses.length ? tenses : allTenses), usedTypes);
  const everything = tenses.length === allTenses.length && !types.length;

  const toggle = (set, v) => set((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "calc(18px + env(safe-area-inset-top)) 18px 40px" }}>
      <TopBar title="Спряжение глаголов" onBack={onBack} />

      <div style={{ marginTop: 16, fontSize: 14.5, fontWeight: 800, letterSpacing: "-0.01em" }}>Время</div>
      <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 7 }}>
        {BASE_TENSES.map((t) => {
          const st = stat(expand([t.id]), usedTypes);
          return (
            <Chip key={t.id} on={tenses.includes(t.id)} onClick={() => toggle(setTenses, t.id)}
              fill={st.m} pct={Math.round(st.m * 100)}
              sub={`${st.started}/${st.total}${st.due ? ` · ${st.due} ждут` : ""}`}>
              {t.short}
            </Chip>
          );
        })}
      </div>

      <div style={{ marginTop: 16, display: "flex", alignItems: "baseline", gap: 8 }}>
        <div style={{ fontSize: 14.5, fontWeight: 800, letterSpacing: "-0.01em" }}>Тип глагола</div>
        {!types.length && <div style={{ fontSize: 11.5, color: C.inkSoft }}>не выбрано — любой</div>}
      </div>
      <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 7 }}>
        {allTypes.map((n) => {
          const st = stat(expand(tenses.length ? tenses : allTenses), [n]);
          return (
            <Chip key={n} on={types.includes(n)} onClick={() => toggle(setTypes, n)}
              fill={st.m} pct={Math.round(st.m * 100)}
              sub={`${VERBS.filter((v) => v.type === n).length} глаголов · ${TYPE_SHORT[n]}`}>
              {VERB_TYPES[n].w}
            </Chip>
          );
        })}
      </div>

      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <Primary onClick={() => onStart({ tenses, types: usedTypes })} disabled={!tenses.length}>
          {tenses.length
            ? `Тренировать · ${chosen.due ? chosen.due + " к повтору" : chosen.total + " форм"}`
            : "Отметьте хотя бы одно время"}
        </Primary>
        <Ghost onClick={() => { setTenses(everything ? [] : allTenses); setTypes([]); }}>
          {everything ? "Снять отметки" : "Всё вперемешку"}
        </Ghost>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Диалог: выбор сцены и роли                                         */
/* ------------------------------------------------------------------ */
function DialogPick({ dialogs, progress, onStart, onBack }) {
  const [pick, setPick] = useState(null);

  const done = (d) => {
    const n = d.lines.filter((l) => { const p = progress[l.id]; return p && p.box >= 3; }).length;
    return d.lines.length ? n / d.lines.length : 0;
  };

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "calc(18px + env(safe-area-inset-top)) 18px 40px" }}>
      <TopBar title="Диалоги" onBack={onBack} />
      <div style={{ fontSize: 14.5, color: C.inkSoft, marginTop: 10, lineHeight: 1.5 }}>
        Сцена из урока разыгрывается по репликам. Выберите, за кого говорите: его слова придётся собирать самому, остальные приходят как сообщения.
      </div>

      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        {dialogs.map((d) => {
          const m = done(d);
          return (
            <button key={d.id} onClick={() => setPick(d)}
              style={{
                textAlign: "left", background: C.card, border: `1px solid ${C.line}`,
                borderLeft: `4px solid ${m >= 1 ? C.spruce : C.line}`, borderRadius: 6,
                padding: "12px 14px", cursor: "pointer",
              }}>
              <div style={{ fontSize: 16.5, fontWeight: 700, color: C.ink, letterSpacing: "-0.01em" }}>{d.title}</div>
              <div style={{ fontSize: 12, color: C.inkSoft, margin: "3px 0 6px" }}>
                {d.lines.length} реплик · {d.speakers.join(", ")}
              </div>
              <Bar value={m} color={m >= 1 ? C.spruce : C.blue} height={4} />
            </button>
          );
        })}
      </div>

      {pick && (
        <div onClick={() => setPick(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(14,30,51,0.45)", zIndex: 60, display: "flex", alignItems: "flex-end" }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ background: C.card, width: "100%", borderRadius: "14px 14px 0 0", padding: "20px 20px 32px", borderTop: `4px solid ${C.blue}` }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em" }}>{pick.title}</div>
            <div style={{ fontSize: 14, color: C.inkSoft, marginTop: 4, marginBottom: 16 }}>За кого вы говорите?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pick.speakers.map((s) => {
                const n = pick.lines.filter((l) => l.who === s).length;
                return (
                  <button key={s} onClick={() => onStart(pick, s)}
                    style={{
                      textAlign: "left", background: C.blueSoft, border: `2px solid ${C.blue}`, borderRadius: 8,
                      padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "baseline", gap: 8,
                    }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: C.blue }}>{s}</span>
                    <span style={{ fontSize: 13, color: C.inkSoft }}>{n} реплик</span>
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: 12 }}><Ghost onClick={() => setPick(null)}>Отмена</Ghost></div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Диалог: сама тренировка                                            */
/* ------------------------------------------------------------------ */
function makeDialogTask(line, others, box) {
  const tokens = line.fi.split(/\s+/);
  const canBank = tokens.length >= 2 && tokens.length <= 10;
  const canType = box >= 2 && line.fi.length <= 28;
  let type = canType && Math.random() < 0.4 ? "type" : canBank ? "bank" : "mc";
  if (type === "bank" && box === 0 && Math.random() < 0.35) type = "mc";
  if (type === "mc") {
    const wrong = shuffle(others.filter((o) => o.fi !== line.fi)).slice(0, 3).map((o) => o.fi);
    return { type, answer: line.fi, options: shuffle([line.fi, ...wrong]) };
  }
  if (type === "bank") {
    const extra = shuffle(others.flatMap((o) => o.fi.split(/\s+/)))
      .filter((w) => !tokens.includes(w))
      .slice(0, Math.min(3, 13 - tokens.length));
    return { type, answer: line.fi, chips: shuffle([...tokens, ...extra]) };
  }
  return { type: "type", answer: line.fi };
}

function Bubble({ line, mine, glossary, onWord, say }) {
  return (
    <div style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", marginBottom: 12 }}>
      <div style={{ maxWidth: "86%" }}>
        <div style={{ fontSize: 11.5, fontWeight: 800, color: C.inkSoft, letterSpacing: "0.03em", marginBottom: 3, textAlign: mine ? "right" : "left" }}>
          {line.who || ""}
        </div>
        <div style={{
          background: mine ? C.blueSoft : C.card,
          border: `1px solid ${mine ? C.blue : C.line}`,
          borderRadius: mine ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
          padding: "11px 13px",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <FinnishText text={line.fi} glossary={glossary} onWord={onWord} size={17} weight={700} />
              <div style={{ fontSize: 14, color: C.inkSoft, marginTop: 4 }}>{line.ru}</div>
            </div>
            <button onClick={() => say(line.fi)} title="Повторить"
              style={{ background: "none", border: "none", padding: 2, cursor: "pointer", flexShrink: 0 }}>
              <Volume2 size={17} color={mine ? C.blue : C.inkSoft} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DialogSession({ dialog, role, dPool, glossary, progress, say, onAnswer, onExit, onFinish }) {
  const [pos, setPos] = useState(0);
  const [task, setTask] = useState(null);
  const [picked, setPicked] = useState(null);
  const [chips, setChips] = useState([]);
  const [typed, setTyped] = useState("");
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState({ ok: 0, no: 0 });
  const [word, setWord] = useState(null);
  const scroller = useRef(null);
  const inputRef = useRef(null);

  const lines = dialog.lines;
  const cur = lines[pos];
  const mine = !!cur && cur.who === role;

  useEffect(() => {
    if (!cur) return;
    setPicked(null); setChips([]); setTyped(""); setResult(null);
    if (cur.who === role) {
      const pr = progress[cur.id];
      setTask(makeDialogTask(cur, dPool, pr ? pr.box : 0));
    } else {
      setTask(null);
      const t = setTimeout(() => say(cur.fi), 250);
      return () => clearTimeout(t);
    }
  }, [pos, cur, role, dPool, say]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [pos, result]);

  if (!cur) return null;

  const shown = lines.slice(0, pos + (!mine || result ? 1 : 0));
  const mineTotal = lines.filter((l) => l.who === role).length;
  const mineDone = lines.slice(0, pos).filter((l) => l.who === role).length;

  const shownPrefix = (() => {
    if (!task || task.type !== "type") return 0;
    let i = 0;
    while (i < typed.length && i < task.answer.length && typed[i].toLowerCase() === task.answer[i].toLowerCase()) i++;
    return i;
  })();

  const check = () => {
    let ok = false;
    if (task.type === "bank") ok = norm(chips.map((c) => c.w).join(" ")) === norm(task.answer);
    else if (task.type === "type") ok = sameAnswer(typed, task.answer);
    else ok = picked === task.answer;
    setResult(ok ? "ok" : "no");
    setStats((s) => ({ ok: s.ok + (ok ? 1 : 0), no: s.no + (ok ? 0 : 1) }));
    onAnswer(cur.id, ok);
    say(cur.fi);
  };

  const next = () => {
    if (pos + 1 >= lines.length) onFinish(stats);
    else setPos(pos + 1);
  };

  const ready = !task ? true
    : task.type === "bank" ? chips.length > 0
    : task.type === "type" ? typed.trim().length > 0
    : picked !== null;

  return (
    <div style={{ minHeight: "100vh", background: C.paper, display: "flex", flexDirection: "column", fontFamily: FONT }}>
      <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <button onClick={onExit} style={{ background: "none", border: "none", padding: 4, cursor: "pointer" }}>
          <X size={24} color={C.inkSoft} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {dialog.title}
          </div>
          <div style={{ fontSize: 12, color: C.inkSoft }}>вы — {role} · {mineDone}/{mineTotal}</div>
        </div>
        <div style={{ display: "flex", gap: 3, width: 90 }}>
          {lines.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 6, borderRadius: 1, background: i < pos ? C.blue : i === pos ? C.ochre : C.line }} />
          ))}
        </div>
      </div>

      <div ref={scroller} style={{ flex: 1, overflowY: "auto", padding: "8px 16px 6px" }}>
        {shown.map((l, i) => (
          <Bubble key={i} line={l} mine={l.who === role} glossary={glossary} onWord={setWord} say={say} />
        ))}
        {mine && !result && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <div style={{ background: C.ochreSoft, border: `1px dashed ${C.ochre}`, borderRadius: "10px 10px 2px 10px", padding: "11px 13px", maxWidth: "86%" }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: C.ochre, letterSpacing: "0.03em", marginBottom: 3 }}>ВАША РЕПЛИКА</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: C.ink, lineHeight: 1.35 }}>{cur.ru}</div>
            </div>
          </div>
        )}
      </div>

      <div style={{
        flexShrink: 0, background: result ? (result === "ok" ? C.spruceSoft : C.lingonSoft) : C.paper,
        borderTop: `1px solid ${C.line}`, padding: "12px 16px calc(16px + env(safe-area-inset-bottom))",
      }}>
        {mine && !result && task && (
          <div style={{ marginBottom: 12 }}>
            {task.type === "mc" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {task.options.map((o) => {
                  const sel = picked === o;
                  return (
                    <button key={o} onClick={() => setPicked(o)}
                      style={{
                        textAlign: "left", background: sel ? C.blueSoft : C.card,
                        border: `2px solid ${sel ? C.blue : C.line}`, borderRadius: 8,
                        padding: "12px 14px", fontSize: 16, fontWeight: 600, color: C.ink, cursor: "pointer", lineHeight: 1.3,
                      }}>
                      {o}
                    </button>
                  );
                })}
              </div>
            )}
            {task.type === "bank" && (
              <div>
                <div style={{ minHeight: 46, borderBottom: `2px solid ${C.line}`, paddingBottom: 8, display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {chips.map((c, n) => (
                    <button key={n} onClick={() => setChips(chips.filter((_, k) => k !== n))}
                      style={{ background: C.card, border: `1.5px solid ${C.line}`, borderRadius: 6, padding: "8px 11px", fontSize: 16, fontWeight: 600, color: C.ink, cursor: "pointer" }}>
                      {c.w}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {task.chips.map((c, i) =>
                    chips.some((ch) => ch.i === i) ? (
                      <span key={i} style={{ borderRadius: 6, padding: "8px 11px", fontSize: 16, background: C.line, color: C.line }}>{c}</span>
                    ) : (
                      <button key={i} onClick={() => setChips([...chips, { w: c, i }])}
                        style={{ background: C.card, border: `1.5px solid ${C.line}`, borderRadius: 6, padding: "8px 11px", fontSize: 16, fontWeight: 600, color: C.ink, cursor: "pointer", boxShadow: "0 2px 0 rgba(14,30,51,0.12)" }}>
                        {c}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
            {task.type === "type" && (
              <div>
                <textarea ref={inputRef} value={typed} onChange={(e) => setTyped(e.target.value)} rows={2}
                  placeholder="Ответьте по-фински..."
                  style={{ width: "100%", fontSize: 18, fontWeight: 600, color: C.ink, padding: 12, borderRadius: 8, border: `2px solid ${C.line}`, background: C.card, resize: "none", fontFamily: FONT }} />
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "0.06em", color: C.inkSoft }}>
                    {task.answer.split("").map((ch, i) => (
                      <span key={i} style={{ color: i < shownPrefix ? C.ink : C.inkSoft }}>
                        {i < shownPrefix ? ch : ch === " " ? " " : "·"}
                      </span>
                    ))}
                  </div>
                  <button onClick={() => { setTyped(task.answer.slice(0, shownPrefix + 1)); inputRef.current?.focus(); }}
                    style={{ background: C.ochreSoft, border: `1.5px solid ${C.ochre}`, borderRadius: 6, padding: "8px 12px", fontSize: 14, fontWeight: 700, color: C.ink, cursor: "pointer" }}>
                    Подсказать букву
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {result && (
          <div style={{ fontSize: 14.5, fontWeight: 800, marginBottom: 10, color: result === "ok" ? C.spruce : C.lingon }}>
            {result === "ok" ? "Oikein — верно" : "Правильная реплика показана выше"}
          </div>
        )}

        {mine && !result ? (
          <Primary onClick={check} disabled={!ready}>Проверить</Primary>
        ) : (
          <Primary onClick={next} tone={result === "no" ? "lingon" : result === "ok" ? "spruce" : "blue"}>
            {pos + 1 >= lines.length ? "Завершить" : "Дальше"}
          </Primary>
        )}
      </div>

      <WordSheet entry={word} onClose={() => setWord(null)} say={say} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Полоска прогресса                                                  */
/* ------------------------------------------------------------------ */
function Bar({ value, color, height = 6 }) {
  return (
    <div style={{ background: C.line, borderRadius: 2, height, overflow: "hidden" }}>
      <div style={{ width: `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%`, background: color, height: "100%" }} />
    </div>
  );
}

// Пять сегментов — бронза, серебро, золото, платина, алмаз — заполняются
// слева направо по мере роста среднего балла урока. Сколько заполнено из
// пяти видно сразу, без отдельной подписи или легенды с цветами.
function TierPips({ avg }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, avg - (n - 1)));
        return (
          <div key={n} style={{ flex: 1, height: 5, borderRadius: 2, background: C.line, overflow: "hidden" }}>
            <div style={{ width: `${Math.round(fill * 100)}%`, height: "100%", background: TIERS[n].color }} />
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Главная                                                            */
/* ------------------------------------------------------------------ */
function Home({ lessons, pool, progress, due, studied, unlockMap, nextLessonId, say, onWord, onStart, onLesson, onVerbs, onDialogs, onBank, onImport, saveNote, storeFail, onRetest }) {
  // Уроки по порядку внутри уровня, уровни — по номеру.
  const groups = useMemo(() => {
    const byLevel = new Map();
    [...lessons].forEach((l) => {
      const lv = levelOf(l);
      if (!byLevel.has(lv.n)) byLevel.set(lv.n, { lv, list: [] });
      byLevel.get(lv.n).list.push(l);
    });
    return [...byLevel.values()]
      .sort((a, b) => a.lv.n - b.lv.n)
      .map((g) => ({ ...g, list: g.list.sort((a, b) => lessonNumber(a) - lessonNumber(b)) }));
  }, [lessons]);

  const nextLesson = nextLessonId;
  const [glossaryLesson, setGlossaryLesson] = useState(null);
  const [dueInfo, setDueInfo] = useState(false);

  // Уровни лежат в одной ленте: смахивание меняет страницу, нажатие на
  // вкладку прокручивает к ней. Активная вкладка вычисляется из прокрутки.
  const scroller = useRef(null);
  const [tab, setTab] = useState(0);

  const onScroll = () => {
    const el = scroller.current;
    if (!el || !el.clientWidth) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setTab((prev) => (prev === i ? prev : i));
  };

  const goTab = (i) => {
    const el = scroller.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
    setTab(i);
  };

  // При открытии показываем уровень, на котором человек остановился.
  useEffect(() => {
    const i = groups.findIndex((g) => g.list.some((l) => l.id === nextLesson));
    const el = scroller.current;
    if (i > 0 && el && el.clientWidth) { el.scrollLeft = i * el.clientWidth; setTab(i); }
  }, []);

  return (
    <div style={{ padding: "calc(24px + env(safe-area-inset-top)) 18px 40px", maxWidth: 620, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em" }}>suomi</div>
        <div style={{ fontSize: 30, fontWeight: 300, letterSpacing: "-0.03em", color: C.blue }}>treeni</div>
      </div>
      <div style={{ fontSize: 14.5, color: C.inkSoft, marginTop: 3 }}>Финские фразы с переводом на русский</div>
      <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 2, opacity: 0.8 }}>
        сборка {BUILD} · уроков {lessons.length}
      </div>

      {saveNote && (
        <div style={{ marginTop: 14, background: C.lingonSoft, color: C.lingon, padding: 12, borderRadius: 6, fontSize: 14 }}>{saveNote}</div>
      )}
      {storeFail && (
        <div style={{ marginTop: 14, background: C.ochreSoft, padding: 12, borderRadius: 6, fontSize: 13.5, lineHeight: 1.5, color: C.ink }}>
          Прогресс держится в памяти вкладки, но записать его не удалось. Перед закрытием загляните в «Добавить урок» и нажмите «Скопировать прогресс».
          <div style={{ marginTop: 6, color: C.inkSoft }}>Ответ хранилища: {storeFail}</div>
          <button onClick={onRetest} style={{ marginTop: 10, background: C.card, border: `1.5px solid ${C.line}`, borderRadius: 6, padding: "8px 14px", fontSize: 14, fontWeight: 600, color: C.blue, cursor: "pointer" }}>
            Проверить ещё раз
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <Stat value={pool.length} label="фраз в банке" />
        <Stat value={studied} label="начато" accent={C.spruce} />
        <Stat value={due} label="ждут повтора" accent={C.ochre} onClick={() => setDueInfo((v) => !v)} active={dueInfo} />
      </div>
      {dueInfo && (
        <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 8, lineHeight: 1.5 }}>
          Ждут повтора — фразы, у которых подошёл срок. После каждого верного ответа фраза возвращается всё позже: через 10 минут, 4 часа, сутки, 3 дня, 10 дней, месяц. Ошиблись — отсчёт начинается заново.
        </div>
      )}

      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
        <Primary onClick={onStart}>Тренировка фраз</Primary>
        <Ghost onClick={onDialogs}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <MessageSquare size={17} /> Диалог по ролям
          </span>
        </Ghost>
        <Ghost onClick={onVerbs}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Layers size={17} /> Спряжение глаголов
          </span>
        </Ghost>
      </div>

      {/* Уровни листаются вбок: одна страница — один уровень. */}
      <div style={{ marginTop: 26, display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
        {groups.map((g, i) => (
          <button key={g.lv.n} onClick={() => goTab(i)}
            style={{
              flexShrink: 0, background: i === tab ? C.blue : C.card,
              color: i === tab ? "#fff" : C.inkSoft,
              border: `1px solid ${i === tab ? C.blue : C.line}`,
              borderRadius: 20, padding: "7px 13px", fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: FONT,
            }}>
            {g.lv.n} · {g.lv.fi}
          </button>
        ))}
      </div>

      <div ref={scroller} onScroll={onScroll}
        style={{ marginTop: 12, display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>
        {groups.map((g) => {
          const avg = g.list.reduce((n, l) => n + unlockMap.get(l.id).bar, 0) / g.list.length;
          return (
            <div key={g.lv.n} style={{ flex: "0 0 100%", minWidth: "100%", scrollSnapAlign: "start" }}>
              <div style={{ marginTop: 8 }}><Bar value={avg} color={C.spruce} height={8} /></div>
              <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 5 }}>
                {g.list.length} уроков · освоено {Math.round(avg * 100)}%
              </div>

              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                {g.list.map((l) => {
                  const st = unlockMap.get(l.id);
                  const { tier, avg, unlocked } = st;
                  const locked = !unlocked;
                  const isNext = l.id === nextLesson;
                  const stripeColor = locked ? C.line : tier >= 1 ? TIERS[tier].color : isNext ? C.blue : C.line;
                  const badgeBg = locked ? C.line : tier >= 1 ? TIERS[tier].color : isNext ? C.blue : C.paper;
                  return (
                    <div key={l.id}
                      style={{
                        background: locked ? C.paper : C.card,
                        border: `1px solid ${locked ? C.line : isNext ? C.blue : C.line}`,
                        borderLeft: `4px solid ${stripeColor}`,
                        borderRadius: 6, padding: "12px 14px",
                        display: "flex", gap: 10, alignItems: "center", opacity: locked ? 0.6 : 1,
                      }}>
                      <button onClick={() => !locked && onLesson(l)} disabled={locked}
                        style={{
                          flex: 1, minWidth: 0, textAlign: "left", background: "none", border: "none", padding: 0,
                          cursor: locked ? "default" : "pointer", display: "flex", gap: 12, alignItems: "center", fontFamily: FONT,
                        }}>
                        <div style={{
                          width: 34, height: 34, flexShrink: 0, borderRadius: 17, display: "flex", alignItems: "center", justifyContent: "center",
                          background: badgeBg, color: locked ? C.inkSoft : (tier >= 1 || isNext) ? "#fff" : C.inkSoft, fontSize: 14, fontWeight: 800,
                        }}>
                          {locked ? <Lock size={14} /> : tier >= 3 ? <Check size={17} /> : lessonNumber(l)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                            <div style={{ fontSize: 16.5, fontWeight: 700, color: locked ? C.inkSoft : C.ink, letterSpacing: "-0.01em" }}>{l.title}</div>
                            {!locked && tier >= 1 && <span style={{ fontSize: 11, fontWeight: 800, color: TIERS[tier].color }}>{TIERS[tier].name.toUpperCase()}</span>}
                          </div>
                          {!locked && (
                            <div style={{ fontSize: 12, color: C.inkSoft, margin: "3px 0 6px" }}>
                              {l.items.length} фраз · {(l.glossary || []).length} слов с пояснениями
                            </div>
                          )}
                          {!locked && <TierPips avg={avg} />}
                        </div>
                      </button>
                      {!locked && (l.glossary || []).length > 0 && (
                        <button onClick={() => setGlossaryLesson(l)} title="Слова с пояснениями"
                          style={{
                            flexShrink: 0, width: 26, height: 26, borderRadius: 13, border: `1.4px solid ${C.line}`,
                            background: C.card, color: C.inkSoft, fontWeight: 800, fontSize: 13, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT,
                          }}>
                          ?
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
        <Ghost onClick={onBank}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><BookOpen size={17} /> Весь банк фраз</span>
        </Ghost>
        <Ghost onClick={onImport}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Plus size={17} /> Добавить урок из файла</span>
        </Ghost>
      </div>

      <div style={{ marginTop: 22, fontSize: 13, color: C.inkSoft, lineHeight: 1.5 }}>
        Урок открывает следующий, как только доходит до бронзы. Золото — прежняя привычная галочка. Платина и алмаз идут дальше и держатся только на повторении: чтобы дойти до них, нужно отвечать верно снова и снова, даже когда урок давно пройден.
      </div>

      <GlossarySheet lesson={glossaryLesson} onClose={() => setGlossaryLesson(null)} onWord={onWord} say={say} />
    </div>
  );
}

// Список всех слов урока с коротким переводом; по нажатию на слово
// открывается обычная карточка слова с полным пояснением.
function GlossarySheet({ lesson, onClose, onWord, say }) {
  if (!lesson) return null;
  const words = lesson.glossary || [];
  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(14,30,51,0.45)", zIndex: 60, display: "flex", alignItems: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          background: C.card, width: "100%", borderRadius: "14px 14px 0 0", padding: "20px 20px 32px",
          maxHeight: "78vh", overflowY: "auto", borderTop: `4px solid ${C.ochre}`,
        }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 19, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em" }}>{lesson.title}</div>
            <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 2 }}>{words.length} слов с пояснениями</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", padding: 6, cursor: "pointer" }}>
            <X size={22} color={C.inkSoft} />
          </button>
        </div>

        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
          {words.map((g, i) => (
            <button key={i} onClick={() => onWord(g)}
              style={{
                textAlign: "left", background: C.paper, border: `1px solid ${C.line}`, borderRadius: 8,
                padding: "10px 12px", cursor: "pointer", display: "flex", alignItems: "baseline", gap: 10, fontFamily: FONT,
              }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: C.ink, flexShrink: 0 }}>{g.w}</span>
              <span style={{ fontSize: 13.5, color: C.inkSoft, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.ru}</span>
            </button>
          ))}
          {!words.length && (
            <div style={{ fontSize: 14, color: C.inkSoft, padding: "10px 2px" }}>В этом уроке нет отдельного словаря.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label, accent, onClick, active }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag onClick={onClick}
      style={{
        flex: 1, background: active ? C.ochreSoft : C.card, border: `1px solid ${active ? C.ochre : C.line}`,
        borderRadius: 6, padding: "12px 12px 10px", textAlign: "left", cursor: onClick ? "pointer" : "default",
        fontFamily: FONT, WebkitAppearance: "none",
      }}>
      <div style={{ fontSize: 26, fontWeight: 800, color: accent || C.ink, letterSpacing: "-0.03em" }}>{value}</div>
      <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 1, display: "flex", alignItems: "center", gap: 4 }}>
        {label}
        {onClick && (
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", width: 13, height: 13,
            borderRadius: 7, border: `1.3px solid ${C.inkSoft}`, fontSize: 9.5, fontWeight: 800, flexShrink: 0,
          }}>?</span>
        )}
      </div>
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/*  Банк фраз                                                          */
/* ------------------------------------------------------------------ */
function Bank({ pool, glossary, say, onWord, onBack }) {
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState(false);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return pool;
    return pool.filter((p) => (p.fi + " " + p.ru + " " + (p.en || "")).toLowerCase().includes(s));
  }, [q, pool]);

  const copyAll = async () => {
    const text = pool.map((p) => `${p.fi}\t${p.ru}`).join("\n");
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (e) { setCopied(false); }
  };

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "calc(18px + env(safe-area-inset-top)) 18px 40px" }}>
      <TopBar title="Банк фраз" onBack={onBack} />
      <div style={{ position: "relative", marginTop: 12 }}>
        <Search size={17} color={C.inkSoft} style={{ position: "absolute", left: 12, top: 14 }} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск по-фински или по-русски"
          style={{ width: "100%", padding: "13px 12px 13px 38px", fontSize: 16, borderRadius: 6, border: `1.5px solid ${C.line}`, background: C.card, color: C.ink, fontFamily: FONT }} />
      </div>
      <div style={{ marginTop: 10 }}>
        <Ghost onClick={copyAll}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Copy size={16} /> {copied ? "Скопировано" : "Скопировать все фразы"}
          </span>
        </Ghost>
      </div>

      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        {list.map((p) => (
          <div key={p.id} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 6, padding: "13px 14px", display: "flex", gap: 10 }}>
            <button onClick={() => say(p.fi)} style={{ background: "none", border: "none", padding: 4, cursor: "pointer", alignSelf: "flex-start" }}>
              <Volume2 size={18} color={C.blue} />
            </button>
            <div style={{ flex: 1 }}>
              <FinnishText text={p.fi} glossary={glossary} onWord={onWord} size={17} weight={700} />
              <div style={{ fontSize: 15, color: C.ink, marginTop: 3 }}>{p.ru}</div>
              {p.en && <div style={{ fontSize: 13, color: C.inkSoft }}>{p.en}</div>}
            </div>
          </div>
        ))}
        {!list.length && <div style={{ color: C.inkSoft, fontSize: 15, padding: 20, textAlign: "center" }}>Ничего не нашлось. Попробуйте другое слово.</div>}
      </div>
    </div>
  );
}

function TopBar({ title, onBack }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", padding: 4, cursor: "pointer" }}>
        <ChevronLeft size={26} color={C.ink} />
      </button>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>{title}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Импорт урока                                                       */
/* ------------------------------------------------------------------ */
const EXAMPLE = `{
  "id": "LB_S1_21",
  "title": "Название урока",
  "source": "FinnishPod101 · Lower Beginner S1 #21",
  "glossary": [
    { "w": "sana", "ru": "слово", "en": "word",
      "forms": ["sana", "sanaa"], "note": "Пояснение из урока" }
  ],
  "items": [
    { "fi": "Tämä on lause.", "ru": "Это предложение.",
      "en": "This is a sentence.", "k": "s" }
  ]
}`;

function Import({ lessons, onSave, progress, onProgress, onBack }) {
  const [text, setText] = useState("");
  const [msg, setMsg] = useState(null);
  const [showFmt, setShowFmt] = useState(false);

  const add = async () => {
    let data;
    try { data = JSON.parse(text); } catch (e) { setMsg({ bad: true, t: "Это не похоже на JSON. Проверьте, что скопирован весь текст целиком." }); return; }
    if (data && data.progress && typeof data.progress === "object") {
      const n = onProgress(data.progress);
      setMsg({ bad: false, t: `Прогресс восстановлен: фраз в работе ${n}.`, done: true });
      setText("");
      return;
    }
    const arr = Array.isArray(data) ? data : [data];
    const good = [];
    for (const l of arr) {
      if (!l || !l.id || !Array.isArray(l.items) || !l.items.length) { setMsg({ bad: true, t: "В уроке нет полей id или items." }); return; }
      if (l.items.some((it) => !it.fi || !it.ru)) { setMsg({ bad: true, t: "У каждой фразы должны быть fi и ru." }); return; }
      good.push({ glossary: [], ...l });
    }
    const known = new Set(lessons.map((l) => l.id));
    const fresh = good.filter((l) => !known.has(l.id));
    if (!fresh.length) {
      setMsg({ bad: true, t: "Этот урок уже есть в банке — он встроен в приложение или добавлен раньше." });
      return;
    }
    const next = [...lessons, ...fresh];
    const ok = await onSave(next);
    const total = next.reduce((n, l) => n + l.items.length, 0);
    setMsg(
      ok
        ? { bad: false, t: `Урок сохранён. Уроков: ${next.length}, фраз: ${total}.`, done: true }
        : { bad: true, t: `Урок добавлен, но сохранить в хранилище не удалось — после перезагрузки он пропадёт. Пришлите мне этот JSON в чат, я вошью его в приложение.`, done: true }
    );
    setText("");
  };

  const exportAll = async () => {
    try { await navigator.clipboard.writeText(JSON.stringify({ lessons }, null, 1)); setMsg({ bad: false, t: "Весь банк скопирован в буфер обмена." }); }
    catch (e) { setMsg({ bad: true, t: "Браузер не дал доступ к буферу обмена." }); }
  };

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "calc(18px + env(safe-area-inset-top)) 18px 40px" }}>
      <TopBar title="Добавить урок" onBack={onBack} />
      <div style={{ fontSize: 15, color: C.inkSoft, marginTop: 10, lineHeight: 1.5 }}>
        Пришлите мне следующий PDF урока в чат — я верну готовый JSON с русским переводом и пояснениями к словам. Вставьте его сюда. Сюда же вставляется сохранённый прогресс.
      </div>

      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={9} placeholder="Вставьте JSON урока или сохранённый прогресс"
        style={{ width: "100%", marginTop: 14, padding: 13, fontSize: 14, borderRadius: 6, border: `1.5px solid ${C.line}`, background: C.card, color: C.ink, fontFamily: "ui-monospace, Menlo, monospace", resize: "vertical" }} />

      <div style={{ marginTop: 10 }}><Primary onClick={add} disabled={!text.trim()}>Добавить в банк</Primary></div>

      {msg && (
        <div style={{ marginTop: 12, background: msg.bad ? C.lingonSoft : C.spruceSoft, color: msg.bad ? C.lingon : C.spruce, padding: 12, borderRadius: 6, fontSize: 14, fontWeight: 600 }}>
          {msg.t}
        </div>
      )}
      {msg && msg.done && (
        <div style={{ marginTop: 10 }}><Primary onClick={onBack}>К урокам</Primary></div>
      )}

      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
        <Ghost onClick={exportAll}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Share2 size={16} /> Скопировать весь банк как JSON</span>
        </Ghost>
        <Ghost onClick={async () => {
          try {
            await navigator.clipboard.writeText(JSON.stringify({ progress }));
            setMsg({ bad: false, t: `Прогресс скопирован: фраз в работе ${Object.keys(progress || {}).length}. Сохраните текст себе — вставив его сюда, вы вернёте счётчики.` });
          } catch (e) {
            setMsg({ bad: true, t: "Браузер не дал доступ к буферу обмена." });
          }
        }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Copy size={16} /> Скопировать прогресс</span>
        </Ghost>
        <Ghost onClick={() => setShowFmt(!showFmt)}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Info size={16} /> {showFmt ? "Скрыть формат" : "Показать формат"}</span>
        </Ghost>
      </div>

      {showFmt && (
        <pre style={{ marginTop: 12, background: C.card, border: `1px solid ${C.line}`, borderRadius: 6, padding: 13, fontSize: 12.5, overflowX: "auto", color: C.ink, lineHeight: 1.5 }}>
{EXAMPLE}
        </pre>
      )}
      {showFmt && (
        <div style={{ marginTop: 10, fontSize: 13.5, color: C.inkSoft, lineHeight: 1.55 }}>
          k — тип: w слово, s предложение, d реплика диалога. forms — формы слова, которые будут подчёркнуты в упражнениях. note — пояснение, которое открывается по нажатию.
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Итоги                                                              */
/* ------------------------------------------------------------------ */
function Summary({ stats, mode, onHome, onAgain }) {
  const total = stats.ok + stats.no;
  const pct = total ? Math.round((stats.ok / total) * 100) : 0;
  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "calc(60px + env(safe-area-inset-top)) 18px 40px", textAlign: "center" }}>
      <div style={{ fontSize: 15, color: C.inkSoft, fontWeight: 600 }}>
        {mode === "verbs" ? "Глаголы: тренировка закончена" : mode === "dialog" ? "Диалог сыгран" : "Тренировка закончена"}
      </div>
      <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: "-0.05em", color: pct >= 70 ? C.spruce : C.ochre, lineHeight: 1.05, marginTop: 8 }}>
        {pct}%
      </div>
      <div style={{ fontSize: 17, color: C.ink, marginTop: 4 }}>
        {stats.ok} из {total} правильно
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: C.blue, marginTop: 8 }}>
      </div>
      <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 10 }}>
        <Primary onClick={onAgain} tone="spruce">{mode === "verbs" ? "Ещё глаголы" : mode === "dialog" ? "Сыграть ещё раз" : "Ещё одна тренировка"}</Primary>
        <Ghost onClick={onHome}>На главную</Ghost>
      </div>
    </div>
  );
}
