import * as Note from "./note.js";

// Container Element
const containerContent = document.getElementById('container');

/** 
 * Inisialisasi Tema Aplikasi
*/
if ( localStorage.getItem('theme') )
{
    document.querySelector('#htmlTheme').setAttribute('data-theme', localStorage.getItem('theme'))
} else {
    localStorage.setItem('theme', `light`);
}


/** 
 * Halaman: Semua catatan
*/
const btnAllNote = document.getElementById('allNote');
btnAllNote.addEventListener('click', function() {

    // Reset menu yang sedang aktif
    resetActiveMenu('bg-sky-500');

    // Buat menu aktif dengan menu yang sedang diakses saat ini
    this.classList.add('bg-sky-500', 'text-white')

    /** 
     * Injeksi semua data catatan
    */
   let allNotePage = ``;
    if ( Note.allNote().length != 0 )
    {
        for (const note of Note.allNote() )
        {
            allNotePage += `
                <a href="#" class="note-card" data-id="${note.row_id}">
                    <div class="card bg-amber-400 shadow-lg">
                        <div class="card-body">
                            <h2 class="card-title text-white">
                                ${note.title}
                            </h2>
                            <small class="text-white opacity-75">${note.created_at}</small>
                        </div>
                    </div>
                </a>
            `;
        }
    } else {
        allNotePage = `<h1 class="text-lg text-center">Tidak ada catatan</h1>`
    }

    containerContent.innerHTML = '<div class="grid grid-rows-1 md:grid-cols-4 gap-3" id="allNoteRow"></div>';
    document.querySelector('#allNoteRow').innerHTML = allNotePage;

    /** 
     * Aksi lihat & edit catatan
     * ketika ada salah satu catatan yang di klik
    */
    for ( const note of document.querySelectorAll('.note-card')) 
    {
        note.addEventListener('click', editNote);
    }
}); 

/** 
 * Halaman: Ubah & Lihat catatan
*/
const editNote = function() {

    // Ambil data id catatan yang telah diklik
    const note = Note.showNote(this.getAttribute('data-id'));
    
    /** 
     * Injeksi form untuk edit data catatan
    */
    const updateNotePage = `
    <div class="mb-3">
        <input type="text" id="noteTitle" placeholder="Judul catatan" class="input input-bordered w-full" value="${note.title}"/>
        <div id="noteTitleMessage"></div>
    </div>

    <div class="mb-5">
        <textarea id="noteContent" cols="100%" rows="10" placeholder="Ketik catatanmu disini.." class="textarea textarea-bordered w-full">${note.contents}</textarea>
        <div id="noteContentMessage"></div>
    </div>

    <div class="flex justify-between">
        <div class="btn-group btn-group-horizontal">
            <button class="capitalize btn btn-primary bg-gray-400 hover:bg-gray-500 border-0 border-transparent text-lg" id="btnBack">Kembali</button>
            <button class="capitalize btn btn-primary bg-sky-400 hover:bg-sky-500 border-0 border-transparent text-lg" id="btnEdit">Ubah</button>
        </div>
            <label for="modalBox" class="capitalize btn btn-primary bg-red-400 hover:bg-red-600 border-0 border-transparent text-lg">Hapus</label>
    </div>
    `
    containerContent.innerHTML = updateNotePage;


    /** 
     * Simpan data catatan yang telah di edit
     * ketika tombol ubah di klik
    */
    document.querySelector('#btnEdit').addEventListener('click', function() {

        // Form Input
        let noteTitle = document.querySelector('#noteTitle');
        let noteContent = document.querySelector('#noteContent');

        // Validasi Input Form
        if ( validationInput('noteTitle', 'noteContent') )
        {
            noteContent.innerHTML = document.querySelector('iframe').contentDocument.body.outerHTML
            Note.updateNote(note.row_id, noteTitle.value, noteContent.value, note.created_at)
            alertMessage('success', 'Berhasil diubah');
            return redirectToHome()
        } else {
            alertMessage('danger', 'Gagal diubah, Mohon periksa semua kolom');
        }
    })

    // Kembali ke halaman utama
    document.querySelector('#btnBack').addEventListener('click', function() {
        redirectToHome()
    })

    // Hapus Note
    document.querySelector('#btnDelete').addEventListener('click', function() {
        Note.deleteNote(note.row_id)
        alertMessage('success', 'Catatan Berhasil dihapus');
        redirectToHome()
    })

    /** 
     * Inisialisasi Teks Editor
     * ketika kondisi halaman dari kontainer telah selesai di load
    */
    const editorText = CKEDITOR.replace( 'noteContent' )
    const contentEditor = setInterval(() => {
        if ( editorText.status == 'ready' )
        {
            loadContentEditor()
            clearInterval(contentEditor)
        }
    }, 200)
}

/** 
 * Halaman: Membuat catatan baru
*/
const btnCreateNote = document.getElementById('createNote');
btnCreateNote.addEventListener('click', function() {

    // Reset Menu
    resetActiveMenu('bg-sky-500')

    // Tambahkan navigasi aktif pada menu
    this.classList.add('bg-sky-500', 'text-white')
    
    // Halaman Catatan
    const createNotePage = `
    <div class="mb-3">
        <input type="text" id="noteTitle" placeholder="Judul catatan" class="input input-bordered w-full"/>
        <div id="noteTitleMessage"></div>
    </div>

    <div class="mb-5">
        <textarea id="noteContent" cols="100%" rows="10" placeholder="Ketik catatanmu disini.." class="textarea textarea-bordered w-full"></textarea>
        <div id="noteContentMessage"></div>
    </div>

    <button class="capitalize btn btn-primary bg-sky-400 hover:bg-sky-500 border-0 border-transparent text-lg" id="btnSave">Simpan</button>
    `

    // Injeksi Halaman Membuat catatan
    containerContent.innerHTML = createNotePage;

    document.querySelector('#btnSave').addEventListener('click', function() {

        // Form Input
        let noteTitle = document.querySelector('#noteTitle');
        let noteContent = document.querySelector('#noteContent');

        // Validasi Form
        if ( validationInput('noteTitle', 'noteContent') )
        {
            noteContent.innerHTML = document.querySelector('iframe').contentDocument.body.outerHTML
            Note.insertNote(noteTitle.value, noteContent.value)
            alertMessage('success', 'Catatan Berhasil ditambahkan');
            return redirectToHome()
        } else {
            alertMessage('danger', 'Gagal disimpan, Mohon periksa semua kolom');
        }

    })
    
    /** 
     * Inisialisasi Teks Editor
     * ketika kondisi halaman dari kontainer telah selesai di load
    */
    const editorText = CKEDITOR.replace( 'noteContent' )
    const contentEditor = setInterval(() => {
        if ( editorText.status == 'ready' )
        {
            loadContentEditor()
            clearInterval(contentEditor)
        }
    }, 200)
});

/** 
 * Halaman: Settings aplikasi
*/
document.querySelector('#settings').addEventListener('click', function() {
    // Reset Menu
    resetActiveMenu('bg-sky-500')

    // Tambahkan navigasi aktif pada menu
    this.classList.add('bg-sky-500', 'text-white')

    /** 
     * Injeksi halaman settings
    */
    const settingsPage = `
    <div class="mb-3">
        <label for="" class="font-xl">Tema : </label>
        <select class="select select-bordered w-full max-w-xs" id="settingsTheme">
            <option disabled selected>-- Tema aplikasi --</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="synthwave">synthwave</option>
            <option value="retro">retro</option>
            <option value="cyberpunk">cyberpunk</option>
            <option value="night">night</option>
            <option value="winter">winter</option>
            <option value="valentine">valentine</option>
            <option value="dracula">dracula</option>
            <option value="forest">forest</option>
            <option value="aqua">aqua</option>
        </select>
    </div>
    `
    containerContent.innerHTML = settingsPage;


    /** 
     * Mengubah tema aplikasi
     * ubah tema dan menyimpan prefrensi tema yang telah dipilih
    */
    document.querySelector('#settingsTheme').addEventListener('change', function() {
        document.querySelector('#htmlTheme').setAttribute('data-theme', this.value)
        localStorage.setItem('theme', `${this.value}`);
    })

})

/** 
 * Halaman:  Tentang
*/
document.querySelector('#about').addEventListener('click', function() {

    // Reset Menu
    resetActiveMenu('bg-sky-500')

    // Tambahkan navigasi aktif pada menu
    this.classList.add('bg-sky-500', 'text-white')

    // Injeksi Halaman About
    const aboutPage = `
    <ul>
        <li>Author: Febry Billiyagi <a href="https://github.com/billiyagi" class="underline">(@billiyagi)</a></li>
        <li>Tentang: Aplikasi Catatan simpel, cepat dan ringan</li>
        <li>Stack: Vanilla JavaScript, TailwindCSS, DaisyUI</li>
        <li>Version: 0.2 (Beta)</li>
    </ul>
    `
    containerContent.innerHTML = aboutPage;
})


/** 
 * Fungsi tambahan yang dibutuhkan oleh Aplikasi
*/

// Reset kondisi aktif pada salah satu menu
const resetActiveMenu = (activeClass) => {
    const menu = document.querySelectorAll('.menu li');
    return menu.forEach(menu => menu.classList.remove(activeClass, 'text-white'));
}

// Menampilkan pesan feedback(umpan balik) kepada pengguna
const alertMessage = (type, message) => {
    if ( type == 'success' )
    {
        iziToast.success({
            message: message,
            position: 'topCenter'
        });
    } else {
        iziToast.error({
            message: message,
            position: 'topCenter'
        });
    }
}

// Alihkan ke halaman Utama
const redirectToHome = () => document.getElementById('allNote').click();

// Validasi input pada form
const validationInput = (...inputFormId) => {
    let resultValidation = [];

    for ( const inputForm of inputFormId )
    {
        if ( document.querySelector(`#${inputForm}`).value.length <= 0 )
        {
            document.querySelector(`#${inputForm}`).classList.add('input-error', 'textarea-error')
            document.querySelector(`#${inputForm}Message`).innerHTML = 'Kolom harus di isi.'
            resultValidation.push(false);
        } else {
            document.querySelector(`#${inputForm}`).classList.remove('input-error', 'textarea-error')
            document.querySelector(`#${inputForm}Message`).innerHTML = '';
            resultValidation.push(true);
        }
    }
    return resultValidation.every(element => element == true)
}

// Melacak perubahan pada editor dan melakukan injeksi pada kolom textarea
const loadContentEditor = () => {
    document.querySelector('iframe').contentDocument.addEventListener('keydown', function() {
        noteContent.innerHTML = document.querySelector('iframe').contentDocument.body.outerHTML;
    })
}

/** 
 * Ketika aplikasi baru di buka 
 * aplikasi akan secara otomatsi mengarahkan ke halaman utama
*/
btnAllNote.click();

