import { memo, useState, useReducer, useMemo, useEffect } from 'react';
import noteReducer from './noteReducer';
import ReactDOM from 'react-dom'
import './styles/NoteApp.css'
import Clock from './components/Clock';
import Note from './components/Note';
import Checklist from './components/Checklist';
import SettingPopup from './components/SettingPopup';
/* features:
    1. Add notes. 2. edit note. 3. delete a note. 4.search based on title of note

Date = {
    date = 13,
    month = 7,
    year = 2025,
    dateString = Sun 13 July 09:10:10 PM
  }

*/

function YesNoPopup({show, onYes, onNo, message, action}) {
    if(!show){
        return null;
    }
    return ReactDOM.createPortal(
        <div className='popup-div' onClick={onNo}>
            <div className='smol-popup' onClick={e=>e.stopPropagation()}>
                <h3 style={{whiteSpace:'pre-wrap'}}>{message}</h3>
                <div style={{display:"flex", width:"100%", justifyContent:"space-evenly", margin:"30px 0px 20px 0px"}}>
                    <button className='popup-btn action-btn' onClick={onYes}>{action}</button>
                    <button className='popup-btn cancel-btn' onClick={onNo} >Cancel</button>
                </div>

            </div>
        </div>,
        document.body
    )
}

function PopUp({show, id=null, date, dateFormat, title, content, onSave, onEdit, onClose, action}) {
    let [newTitle, setNewTitle] = useState(title);
    let [newContent, setNewContent] = useState(content);
    const dateString = dateFormat.replace("dd",date.date).replace("mm", date.month).replace("yyyy",date.year)
    if (!show){
        return null;
    }

    function handleSave() {
        onSave({title: newTitle, content: newContent, createdOn: date });
        setNewTitle();
        setNewContent();
    }

    function handleEdit() {
        onEdit({id: id, title: newTitle, content: newContent, lastEdited: date });
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
                    <span onClick={e=> {e.stopPropagation(); handleClose()}} style={{cursor:"pointer"}}><i className="fa-solid fa-xmark fa-lg" style={{color:'white'}}></i></span>
                </div>
                <b style={{marginRight:'20px', color:'gray'}}>Date: {dateString}</b> <br/>
                <input type='text' value={newTitle} onChange={e => setNewTitle(e.target.value)} className='title-input' placeholder='Title' /> <br />
                <textarea  value={newContent} onChange={e => setNewContent(e.target.value)} className='content-input' placeholder='Content'></textarea>
                <button className='save-note btn' onClick={action=="edit" ? handleEdit : handleSave}> {action=="edit" ? "Edit Note": "Save Note"}</button>
            </div>
        </div>,
        document.body
    )
}


function NoteApp() {

    const now = new Date();
    const initialNotes=[
        {
            id: 0,
            createdOn: {date:now.getDate(), month: now.getMonth()+1, year: now.getFullYear(), datetime: `${now.toUTCString().substring(0,17)} | ${now.toLocaleTimeString()}`},
            title:"Intro",
            content: "Hello User, this is a note taking app. "+
            "Press the + icon to add a new note. You can also edit and delete a note by clicking the icons on the note.",
            pinned: false
        }
    ]

    const [notes, dispatch] = useReducer(noteReducer, JSON.parse(localStorage.getItem("notes")) || initialNotes);
    const nextId = notes.length;
    const [showSettings, setShowSettings] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showDelPopup, setShowDelPopup] = useState(false);
    const [showResetPopup, setShowResetPopup] = useState(false);
    const [selectedNote, setSelectedNote] = useState();
    const popupTitle = useMemo( ()=> (selectedNote!== undefined ? notes.find( (note)=> note.id === selectedNote).title : undefined), [selectedNote]) ;
    const popupContent = useMemo( ()=> (selectedNote!== undefined ? notes.find( (note)=> note.id === selectedNote).content : undefined) ,[selectedNote]) ;
    const [search, setSearch] = useState("");
    const delNoteMessage = "Are you sure, you want to delete this note?"
    const resetMessage = "Are you sure to reset?\n All your notes will be lost!"
    const [dateFormat, setDateFormat] = useState("dd/mm/yyyy");

    useEffect( ()=> {
        localStorage.setItem("notes", JSON.stringify(notes))
        console.log(notes)
    }, [notes]);

    function generateDate(date){
        return {date:date.getDate(), month: date.getMonth()+1, year: date.getFullYear(), 
            datetime: `${date.toUTCString().substring(0,17)} | ${date.toLocaleTimeString()}`}
    }

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
    const checklistItems = ['Finish notes app', 'implement checklist', 'meet my friend'];


    return ( 

        <div className='NoteApp'>
            <div style={{display:'flex', justifyContent:'space-between',alignItems: 'center', width:'100%', marginBottom:'50px'}}>
                <h1 className='heading'>Notes</h1>
                <button className='settings' onClick={()=>setShowSettings(true)}><i className="fa-solid fa-gear settings-icon"></i></button>
            </div>

            <Clock dateFormat={dateFormat}/>

            <input type='search' placeholder='Search' className='search' value={search} onChange={e => setSearch(e.target.value)}/>
            <SettingPopup show={showSettings} onHide={()=>setShowSettings(false)} onFormatChange={setDateFormat} onReset={()=>setShowResetPopup(true)}/>
            <YesNoPopup action="Delete" message={delNoteMessage} show={showDelPopup} onYes={handleDeleteNotes} onNo={()=>setShowDelPopup(false)}/> {/* Delete Note Popup*/}
            <YesNoPopup action="Reset" message={resetMessage} show={showResetPopup} onYes={handleReset} onNo={()=>setShowResetPopup(false)}/>  {/* Reset Popup*/}
            <PopUp key={selectedNote} show={showPopup} id={selectedNote} title={popupTitle} 
            content={popupContent} action={selectedNote===undefined ? "add": 'edit'} onSave={handleAddNotes} 
            onEdit={handleEditNotes} onClose={()=>{setShowPopup(false); setSelectedNote()}} date={generateDate(new Date())} dateFormat={dateFormat}/>

            <button className='add-note-btn' onClick={handleAddClick}>
                +
            </button>

            { (notes.length > 0) && 

                <>
                {/* pinned tab appears only when not empty */}
                { (notes.filter((note)=> {return note.pinned}).length > 0) &&

                    <div className='pinned-wrapper'>
                        <h3 style={{padding:'20px'}}>Pinned</h3>
                        <div className='notes'>
                            {/* first mapping pinned notes */}
                            {
                                search.length===0 &&
                                notes.filter((note)=> {return note.pinned}).map((note) =>
                                    <Note key={note.id} id={note.id} title={note.title} content={note.content} createdOn={note.createdOn} lastEdited={note.lastEdited} 
                                        dateFormat={dateFormat} onEdit={handlEditClick} onDelete={handleDeleteClick} pinned={note.pinned} onPin={()=>handlePin(note.id)} onUnpin={()=>handleUnpin(note.id)} />
                                )
                            }
                        </div>
                    </div>
                    }
                <div className='notes'>
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
                            <Note key={note.id} id={note.id} title={note.title} content={note.content} createdOn={note.createdOn} dateFormat={dateFormat}
                                lastEdited={note.lastEdited} onEdit={handlEditClick} onDelete={handleDeleteClick} pinned={note.pinned} onPin={()=>handlePin(note.id)} onUnpin={()=>handleUnpin(note.id)} />
                        )

                        :
                            //then mapping unpinned notes
                            notes.filter((note)=>{return !note.pinned}).map( (note) =>
                                <Note key={note.id} id={note.id} title={note.title} content={note.content} createdOn={note.createdOn} dateFormat={dateFormat}
                            lastEdited={note.lastEdited} onEdit={handlEditClick} onDelete={handleDeleteClick} pinned={note.pinned} onPin={()=>handlePin(note.id)} onUnpin={()=>handleUnpin(note.id)} />
                            )

                    }

                    {/* <Checklist title='TO DO LIST' items={checklistItems}/> */}
                </div>
                </>

            }

        </div>
     );
}

export default NoteApp;