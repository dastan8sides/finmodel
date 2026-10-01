import openpyxl
import zipfile
import xml.etree.ElementTree as ET
for path in ['verification/metrics-known.xlsx', 'verification/metrics-browser.xlsx']:
    with zipfile.ZipFile(path) as z:
        assert z.testzip() is None
        for name in z.namelist():
            ET.fromstring(z.read(name))
    w = openpyxl.load_workbook(path, data_only=False)
    v = openpyxl.load_workbook(path, data_only=True)
    assert w.sheetnames == ['Модель', 'Вводные', 'Показатели']
    sheet = w['Показатели']
    for r in [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20,24,25,26,27]:
        assert sheet.cell(r,2).data_type == 'f'
    if 'known' in path:
        data = v['Показатели']
        for r, expected in [(4,1.1),(11,0),(12,.1),(14,.55),(15,.275),(25,2200),(27,0)]:
            assert abs(data.cell(r,2).value - expected) < 1e-7
        assert abs(sum(data.cell(36,c).value for c in range(2,15))) < 1e-7
    print('Validated formulas and saved values:', path)
