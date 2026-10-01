from pathlib import Path
p=Path('model-v2.js')
s=p.read_text(encoding='utf-8').replace("['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']", "Array.from({length:12},(_,i)=>'М'+(i+1))")
p.write_text(s,encoding='utf-8')
for filename in ['model-v2.js','app-v2.js','export-v2.js']:
 p=Path(filename);s=p.read_text(encoding='utf-8')
 for a,b in [('на конец декабря','на конец М12'),('до января','до М1'),('с января','с М1'),('структуре января','структуре М1'),('выручка января','выручка М1'),('Повторить январь на весь год','Повторить М1 на весь год'),('1 — январь, 2 — февраль, …, 12 — декабрь','Номер периода: 1 — М1, …, 12 — М12')]:s=s.replace(a,b)
 p.write_text(s,encoding='utf-8')
p=Path('index.html');s=p.read_text(encoding='utf-8').replace('v=month-names','v=convenience-1').replace('</head>','<link rel="stylesheet" href="convenience.css?v=1">\n</head>').replace('</body>','<script src="convenience.js?v=1"></script>\n</body>');p.write_text(s,encoding='utf-8')
