import { useState, useReducer, useMemo, useEffect } from 'react';
import './styles/NoteApp.css'
// features:
//1. Add notes. 2. edit note. 3. delete a note. 4.search based on title of note

function noteReducer(notes, action) {
    switch (action.type) {
        case 'add': 
        {
            console.log(`note added. ID: ${action.id}`);
           return [...notes, {
            id: action.id,
            date: action.date,
            title: action.title,
            content: action.content,
           }];
        }

        case 'edit': {
            return notes.map( (note) => {
                if (note.id === action.id) {
                    return note = {
                        ...note,
                        title: action.title,
                        content: action.content
                    }
                }
                else {
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

function DelPopup({isOpen, onYes, onNo}) {
    if(!isOpen){
        return null;
    }
    return (
        <div className='popup-div'>
            <div className='smol-popup'>
                <h3>Are you sure you want to delete this note?</h3>
                <div style={{display:"flex", width:"100%", justifyContent:"space-evenly", margin:"30px 0px 20px 0px"}}>
                    <button style={{backgroundColor:"lightcoral", color:"red", padding:"10px 30px", borderRadius:"10px", cursor:"pointer"}} onClick={onYes}> YES</button>
                    <button style={{backgroundColor:"lightgreen", color:"green", padding:"10px 30px", borderRadius:"10px", cursor:"pointer"}} onClick={onNo} > NO</button>
                </div>

            </div>
        </div>
    )
}

function PopUp({isOpen, id=null, date, title, content, onSave, onEdit, onClose, action}) {
    let [newTitle, setNewTitle] = useState(title);
    let [newContent, setNewContent] = useState(content);

    if (!isOpen){
        return null;
    }

    function handleSave() {
        onSave({title: newTitle, content: newContent, date: date});
        setNewTitle();
        setNewContent();
    }

    function handleEdit() {
        onEdit({id: id, title: newTitle, content: newContent});
        setNewTitle();
        setNewContent();
    }

    function handleClose() {
        onClose()
    }

    return(
        <div className='popup-div'>
            <div className='popup'>
                <div style={{display:"flex", margin:"5px 0px", justifyContent:"flex-end"}}>
                    <span onClick={e=> {e.stopPropagation; handleClose()}} style={{cursor:"pointer"}}><box-icon name="x" size="m" color="#ffffff"></box-icon></span>
                </div>
                <b>Title:</b> <br/>
                <input type='text' value={newTitle} onChange={e => setNewTitle(e.target.value)} className='title-input' /> <br />
                <b>Content:</b> <br />
                <textarea  value={newContent} onChange={e => setNewContent(e.target.value)} className='content-input'></textarea>
                <button className='save-note btn' onClick={action=="edit" ? handleEdit : handleSave}> {action=="edit" ? "Edit Note": "Save Note"}</button>
            </div>
        </div>
    )
}

function Note({id, date, title, content, onEdit, onDelete}) {
    function editClick() {
        onEdit(id,title, content)
    }

    function deleteClick() {
        onDelete(id)
    }

    return (
        <div className='note'>

            <div className='note-head'>
                <span onClick={editClick} style={{cursor:"pointer"}}><box-icon type='solid' name='edit' color='#ffffff'></box-icon></span>
                <span onClick={deleteClick} style={{cursor:"pointer"}}><box-icon type='solid' name='x-square' color='#ffffff'></box-icon></span>
            </div>

            <div className='note-text'>
                <p style={{color:'lightgray',fontSize:'17px'}}>{date}</p>
                <h2 className='note-title' style={{textDecoration:"underline", marginBottom:"15px"}}>{title}</h2> 
                <p style={{whiteSpace:'pre-wrap'}}>{content}</p>
            </div>
        </div>
    )
}

function NoteApp() {

    const [nextId, setNextId] = useState(1);

    const [notes, dispatch] = useReducer(noteReducer, JSON.parse(localStorage.getItem("notes")) || initialNotes);
    const [showPopup, setShowPopup] = useState(false);
    const [showDelPopup, setShowDelPopup] = useState(false);
    const [selectedNote, setSelectedNote] = useState();
    const popupTitle = useMemo( ()=> (selectedNote!== undefined ? notes.find( (note)=> note.id === selectedNote).title : undefined), [selectedNote]) ;
    const popupContent = useMemo( ()=> (selectedNote!== undefined ? notes.find( (note)=> note.id === selectedNote).content : undefined) ,[selectedNote]) ;
    const [search, setSearch] = useState("");
    const [searchText, setSearchText] = useState("");
    const [date, setDate] = useState(new Date());
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const day = days[date.getDay()];

    const initialNotes=[
        {
            id: 0,
            date: date.toLocaleDateString,
            title:"Intro",
            content: "Hello User, this is a new note taking app. "+
            "Press the + icon to add a new note. You can also edit and delete a note by clicking the ... menu"
        }
    ]

    useEffect( ()=> {
        localStorage.setItem("notes", JSON.stringify(notes))
    }, [notes]);

    function handleAddClick() {
        setShowPopup(true);
    }

    function handlEditClick(id) {
        setSelectedNote(id);
        setShowPopup(true);
    }

    function handleDeleteClick(id) {
        setSelectedNote(id)
        setShowDelPopup(true);
    }

    function handleAddNotes(note) {
        const newNote = {
            id: nextId,
            date: note.date,
            title: note.title,
            content: note.content
        }
        setNextId(nextId+1);
        setShowPopup(false);

        dispatch(
            {
                type: "add",
                id: newNote.id,
                date: newNote.date,
                title: newNote.title,
                content: newNote.content,
            })
    }

    function handleEditNotes(note) {
        setShowPopup(false);
        dispatch(
            {
                type: "edit",
                id: note.id,
                title: note.title,
                content: note.content
            }
        )
        setSelectedNote();
    }

    function handleDeleteNotes(){
        setShowDelPopup(false);
        dispatch(
            {
                type: "delete",
                id: selectedNote
            }
        )
        setSelectedNote();
    }

    function handleSearch() {
        setSearch(searchText);
    }
    
    return ( 

        <div className='NoteApp'>
            <h1 className='heading'>Note App</h1>
            <h3 style={{color:"gray"}}>{date.toLocaleDateString()}, {day}</h3>
            <label className='search-wrapper'>
                <input type='text' placeholder='Search a note title' className='search' value={search} onChange={e => setSearch(e.target.value)}/>
                <span className='clear-btn' onClick={()=>setSearch("")}><box-icon name='x' size='sm'></box-icon></span>
            </label>
            <DelPopup isOpen={showDelPopup} onYes={handleDeleteNotes} onNo={()=>setShowDelPopup(false)}/>
            <PopUp key={selectedNote} isOpen={showPopup} id={selectedNote} title={popupTitle} 
            content={popupContent} action={selectedNote===undefined ? "add": 'edit'} onSave={handleAddNotes} 
            onEdit={handleEditNotes} onClose={()=>{setShowPopup(false); setSelectedNote()}} date={date.toLocaleDateString()}/>

            <button className='add-note-btn' onClick={handleAddClick}>
                +
            </button>

            { (notes.length > 0) && 

                <div className='notes'>
                    
                    {
                        search.length > 0 ? 
                        
                        notes.map( (note) =>
                        {   
                            let title = `${note.title}`.toLowerCase();
                            let searchText = search.toLowerCase();
                            if(title.includes(searchText)){
                                return <Note key={note.id} id={note.id} title={note.title} content={note.content} onEdit={handlEditClick} onDelete={handleDeleteClick} />
                            }
                        }
                        )
                        :
                        notes.map( (note) =>
                            <Note key={note.id} id={note.id} title={note.title} content={note.content} date={note.date}
                            onEdit={handlEditClick} onDelete={handleDeleteClick} />
                        )
                    }
                </div>

            }

        </div>
     );
}

export default NoteApp;