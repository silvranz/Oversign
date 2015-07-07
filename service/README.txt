Taro di folder htdocs

kalo mau nambah link baru (misal menu aaa):
1. tambahin di folder service/mapping file json-nya(format json ikutin home.json HARUS PAKAI KUTIP 2 "" BUAT NAMA ATRIBUT)

2. tambahin filenya ke folder source sesuai nama file dan tipe file yang di json 
misal "html":["home.html"] -> tambahin file source/html/home.html,
"js":["tes.js"] -> source/library/js/tes.js, 
"css":["tes.css"]->source/library/css/tes.css
PS: js & css lom dites, untuk external masih belum jalan

3. jalanin apache akses ke "localhost/oversign"

NOTE: file header dan footer ada di source/template (untuk master.html abaikan saja, itu file lama dari brian)