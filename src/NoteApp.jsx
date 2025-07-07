import { memo, useState, useReducer, useMemo, useEffect } from 'react';

import ReactDOM from 'react-dom'
import './styles/NoteApp.css'
import Note from './Note';
import Checklist from './Checklist';
// features:
//1. Add notes. 2. edit note. 3. delete a note. 4.search based on title of note

function dateFormatter(date){
    const today = date.toLocaleDateString;

}
function noteReducer(notes, action) {
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

function YesNoPopup({isOpen, onYes, onNo, message}) {
    if(!isOpen){
        return null;
    }
    return ReactDOM.createPortal(
        <div className='popup-div' onClick={onNo}>
            <div className='smol-popup' onClick={e=>e.stopPropagation()}>
                <h3 style={{whiteSpace:'pre-wrap'}}>{message}</h3>
                <div style={{display:"flex", width:"100%", justifyContent:"space-evenly", margin:"30px 0px 20px 0px"}}>
                    <button style={{backgroundColor:"lightcoral", color:"red", padding:"10px 30px", borderRadius:"10px", cursor:"pointer"}} onClick={onYes}> YES</button>
                    <button style={{backgroundColor:"lightgreen", color:"green", padding:"10px 30px", borderRadius:"10px", cursor:"pointer"}} onClick={onNo} > NO</button>
                </div>

            </div>
        </div>,
        document.body
    )
}

function PopUp({isOpen, id=null, date, time, title, content, onSave, onEdit, onClose, action}) {
    let [newTitle, setNewTitle] = useState(title);
    let [newContent, setNewContent] = useState(content);

    if (!isOpen){
        return null;
    }

    function handleSave() {
        onSave({title: newTitle, content: newContent, createdOn: date +" ("+ time+")",});
        setNewTitle();
        setNewContent();
    }

    function handleEdit() {
        onEdit({id: id, title: newTitle, content: newContent, lastEdited: date +" ("+ time+")"});
        setNewTitle();
        setNewContent();
    }

    function handleClose() {
        onClose()
    }

    return ReactDOM.createPortal(
        <div className='popup-div'>
            <div className='popup'>
                <div style={{display:"flex", margin:"5px 0px", justifyContent:"flex-end"}}>
                    <span onClick={e=> {e.stopPropagation(); handleClose()}} style={{cursor:"pointer"}}><box-icon name="x" size="m" color="#ffffff"></box-icon></span>
                </div>
                <b>Date: {date}</b> <br/>
                <b>Title:</b> <br/>
                <input type='text' value={newTitle} onChange={e => setNewTitle(e.target.value)} className='title-input' /> <br />
                <b>Content:</b> <br />
                <textarea  value={newContent} onChange={e => setNewContent(e.target.value)} className='content-input'></textarea>
                <button className='save-note btn' onClick={action=="edit" ? handleEdit : handleSave}> {action=="edit" ? "Edit Note": "Save Note"}</button>
            </div>
        </div>,
        document.body
    )
}


function Clock() {
    const [date, setDate] = useState(new Date());
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const day = days[date.getDay()];

    useEffect(()=>{
        const interval = setInterval(()=> setDate(new Date()),1000);
        return ()=>clearInterval(interval)
    },[])
    

    return(
            <h3 style={{color:"gray"}}>{date.toDateString()}, {day} {date.toLocaleTimeString()}</h3>
    )
}

function NoteApp() {

    

    const initialNotes=[
        {
            id: 0,
            createdOn: new Date().toLocaleDateString()+" ("+new Date().toLocaleTimeString()+")",
            title:"Intro",
            content: "Hello User, this is a new note taking app. "+
            "Press the + icon to add a new note. You can also edit and delete a note by clicking the icons on the note.",
            pinned: false
        }
    ]

    const [notes, dispatch] = useReducer(noteReducer, JSON.parse(localStorage.getItem("notes")) || initialNotes);
    const nextId = notes.length;
    const [showPopup, setShowPopup] = useState(false);
    const [showDelPopup, setShowDelPopup] = useState(false);
    const [showResetPopup, setShowResetPopup] = useState(false);
    const [selectedNote, setSelectedNote] = useState();
    const popupTitle = useMemo( ()=> (selectedNote!== undefined ? notes.find( (note)=> note.id === selectedNote).title : undefined), [selectedNote]) ;
    const popupContent = useMemo( ()=> (selectedNote!== undefined ? notes.find( (note)=> note.id === selectedNote).content : undefined) ,[selectedNote]) ;
    const [search, setSearch] = useState("");
    const [searchText, setSearchText] = useState("");
    const delNoteMessage = "Are you sure, you want to delete this note?"
    const resetMessage = "Are you sure to reset?\n All your notes will be lost!"

    // useEffect(()=>{
    //     let mynotes = JSON.parse(localStorage.getItem("notes"));
    //     let unpinnednotes = [mynotes.map((note)=> note={...note,pinned:false})]
    //     localStorage.setItem("notes", JSON.stringify(unpinnednotes))
    //     }
    //     ,[])
    useEffect( ()=> {
        localStorage.setItem("notes", JSON.stringify(notes))
        console.log(notes)
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
            ...note
        }
        setShowPopup(false);

        dispatch(
            {
                type: "add",
                id: newNote.id,
                createdOn: newNote.createdOn,
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
                content: note.content,
                lastEdited: note.lastEdited
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
    function handlePin(id) {
        dispatch(
            {
                type: 'pin',
                id: id,
                pinned: true
            }
        )
    }

    function handleUnpin(id) {
        dispatch(
            {
                type: 'pin',
                id: id,
                pinned: false
            }
        )
    }

    function handleReset(){
        localStorage.clear();
        location.reload();
    }
    const checklistItems = ['Finish notes app', 'implement checklist', 'meet Akshit'];

    useEffect(()=>{
        if(notes.length>1){
        notes.map((note)=> {
        if(note!=null && note.id!=null && note.pinned==null){
        dispatch(
        {
            type: 'pin',
            id: note.id,
            pinned: false
        })
    }})
}}
,[notes])
    return ( 

        <div className='NoteApp'>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                <h1 className='heading'>Note App</h1>
                <button className='reset-btn' onClick={()=>setShowResetPopup(true)}>Reset</button>
            </div>
            <Clock />
            <label className='search-wrapper'>
                <input type='text' placeholder='Search' className='search' value={search} onChange={e => setSearch(e.target.value)}/>
                <span className='clear-btn' onClick={()=>setSearch("")}><box-icon name='x' size='sm'></box-icon></span>
            </label>
            <YesNoPopup message={delNoteMessage} isOpen={showDelPopup} onYes={handleDeleteNotes} onNo={()=>setShowDelPopup(false)}/> {/* Delete Note Popup*/}
            <YesNoPopup message={resetMessage} isOpen={showResetPopup} onYes={handleReset} onNo={()=>setShowResetPopup(false)}/>  {/* Reset Popup*/}
            <PopUp key={selectedNote} isOpen={showPopup} id={selectedNote} title={popupTitle} 
            content={popupContent} action={selectedNote===undefined ? "add": 'edit'} onSave={handleAddNotes} 
            onEdit={handleEditNotes} onClose={()=>{setShowPopup(false); setSelectedNote()}} date={ new Date().toLocaleDateString()} time={ new Date().toLocaleTimeString()}/>

            <button className='add-note-btn' onClick={handleAddClick}>
                +
            </button>

            { (notes.length > 0) && 

                <div className='notes'>
                    {/* first mapping pinned notes */}
                    {
                        search.length===0 &&
                        notes.filter((note)=> {return note.pinned}).map((note) =>
                            <Note key={note.id} id={note.id} title={note.title} content={note.content} createdOn={note.createdOn} 
                            lastEdited={note.lastEdited} onEdit={handlEditClick} onDelete={handleDeleteClick} pinned={note.pinned} onPin={()=>handlePin(note.id)} onUnpin={()=>handleUnpin(note.id)} />
                        )
                    }
                    
                    {
                        search.length > 0 ? 
                        
                        notes.filter( (note) =>
                        {   
                            let title = `${note.title}`.toLowerCase();
                            let content = `${note.content}`.toLowerCase();
                            let searchText = search.toLowerCase();
                            return title.includes(searchText) || content.includes(searchText)
                        })
                        .map( (note) =>
                            <Note key={note.id} id={note.id} title={note.title} content={note.content} createdOn={note.createdOn} 
                                lastEdited={note.lastEdited} onEdit={handlEditClick} onDelete={handleDeleteClick} pinned={note.pinned} onPin={()=>handlePin(note.id)} onUnpin={()=>handleUnpin(note.id)} />
                        )

                        :
                            //then mapping unpinned notes
                            notes.filter((note)=>{return !note.pinned}).map( (note) =>
                                <Note key={note.id} id={note.id} title={note.title} content={note.content} createdOn={note.createdOn} 
                            lastEdited={note.lastEdited} onEdit={handlEditClick} onDelete={handleDeleteClick} pinned={note.pinned} onPin={()=>handlePin(note.id)} onUnpin={()=>handleUnpin(note.id)} />
                            )

                    }

                    {/* <Checklist title='TO DO LIST' items={checklistItems}/> */}
                </div>

            }

        </div>
     );
}

export default NoteApp;