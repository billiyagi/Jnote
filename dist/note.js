const insertNote = (title, contents) => {
    const date = new Date();
    let idRow = date.getTime();
    let note = {
        'row_id': idRow,
        'title': title,
        'contents': contents,
        'created_at': date.toDateString()
    }
    return localStorage.setItem(idRow, JSON.stringify(note));
}

const updateNote = (id, title, contents, createdAt) => {
    // Update
    return localStorage.setItem(id, JSON.stringify(
        {
            'row_id': id,
            'title': title,
            'contents': contents,
            'created_at': createdAt
        }
    ))
}

const deleteNote = (id) => {
    // Delete
    return localStorage.removeItem(id)
}

const allNote = () => {
    let localNote = Array.of(localStorage)[0];
    let notesId = Object.keys(localNote).filter( value => value != 'theme');
    let notes = [];
    
    for (const note of notesId)
    {
        notes.unshift(JSON.parse(localStorage.getItem(note)));
    }
    
    return notes;
}

const showNote = (id) => {
    return JSON.parse(localStorage.getItem(id));
}

export {insertNote, updateNote, deleteNote, allNote, showNote}