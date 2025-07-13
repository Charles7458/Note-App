export default function noteReducer(notes, action) {
    switch (action.type) {
        case 'add': 
        {
            console.log(`note added. ID: ${action.id}`);
           return [...notes, {
            id: action.id,
            createdOn: action.createdOn,
            title: action.title,
            content: action.content,
            pinned: false
           }];
        }

        case 'edit': {
            return notes.map( (note) => {
                if (note.id === action.id) {
                    return note = {
                        ...note,
                        title: action.title,
                        content: action.content,
                        lastEdited: action.lastEdited,
                    }
                }
                else {
                    return note;
                }
            })
        }

        case 'pin': {
            return notes.map((note)=> {
                if (note.id === action.id) {
                    return {
                        ...note,
                        pinned: action.pinned
                    }
                } else {
                    return note;
                }
            })
        }

        case 'delete': {
            return notes.filter((note)=> note.id !== action.id)
        }

        default: {
            alert("unidentified action");
            return null;
        }
    }
}
