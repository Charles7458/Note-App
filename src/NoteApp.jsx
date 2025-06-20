import { useState, useReducer, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom'
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
            createdOn: action.createdOn,
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
                        content: action.content,
                        lastEdited: action.lastEdited
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
    return ReactDOM.createPortal(
        <div className='popup-div' onClick={onNo}>
            <div className='smol-popup' onClick={e=>e.stopPropagation()}>
                <h3>Are you sure you want to delete this note?</h3>
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

function Options({children}){
    return(
        <div className='option-div'>
            {children}
        </div>
    )
}

function ZoomedNote({show, onHide, title, content, lastEdited, createdOn, onEdit, onDelete}){
    const [showOptions, setShowOptions] = useState(false)
if(show){
    return ReactDOM.createPortal(
        <div className='zn-backdrop'  onClick={e=>{e.stopPropagation();onHide()}}>
            <div className='zoomed-note' onClick={e=>{e.stopPropagation();setShowOptions(false)}}>
                <div className='zn-header'>{/*header */}
                    <h1>{title}</h1>
                    <div>
                        <button className='options-btn' onClick={e=>{e.stopPropagation();setShowOptions(!showOptions)}}>
                        <box-icon name='dots-horizontal-rounded' color='#ffffff'></box-icon>
                    </button>
                    {
                        showOptions &&
                        <Options>
                            <p className='options' onClick={onEdit}>Edit</p>
                            <hr style={{justifySelf:'center',width:'80%'}}></hr>
                            <p className='options' style={{color:'red'}} onClick={onDelete}>Delete</p>
                        </Options>
                    }
                    
                    </div>
                    
                </div>
                <p className='details'>created: {createdOn}</p>
                <p className='details'>last edit: {lastEdited}</p>
                
                <p className='zn-para'>{content}</p>
            </div>
        </div>,
        document.body
    )}
    else{
        return null;
    }
}

function Note({id, createdOn, lastEdited, title, content, onEdit, onDelete}) {
    const [showNote, setShowNote] = useState(false);
    function editClick() {
        onEdit(id,title, content)
    }

    function deleteClick() {
        onDelete(id)
    }

    return (
        <div className='note' onClick={()=>setShowNote(true)}>
           
            <ZoomedNote show={showNote} onHide={()=>setShowNote(false)} title={title} content={content} lastEdited={lastEdited} createdOn={createdOn}
                onEdit={editClick} onDelete={deleteClick}/>
            
            <div className='note-head'>
                <span onClick={e=>{e.stopPropagation();editClick()}} style={{cursor:"pointer"}}><box-icon type='solid' name='edit' color='#ffffff'></box-icon></span>
                <span onClick={e=>{e.stopPropagation();deleteClick()}} style={{cursor:"pointer"}}><box-icon type='solid' name='x-square' color='#ffffff'></box-icon></span>
            </div>

            <div className='note-text'>
                <p style={{color:'lightgray',fontSize:'12px'}}>last edit: {lastEdited||createdOn}</p>
                <h4 className='note-title' style={{marginBottom:"15px"}}>{title}</h4> 
                <p className='note-para'>{content}</p>
            </div>
        </div>
    )
}


function NoteApp() {

    const [date, setDate] = useState(new Date());
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const day = days[date.getDay()];

    const initialNotes=[
        {
            id: 0,
            createdOn: date.toLocaleDateString()+" ("+date.toLocaleTimeString()+")",
            title:"Intro",
            content: "Hello User, this is a new note taking app. "+
            "Press the + icon to add a new note. You can also edit and delete a note by clicking the icons on the note."
        }
    ]

    const [notes, dispatch] = useReducer(noteReducer, JSON.parse(localStorage.getItem("notes")) || initialNotes);
    const nextId = notes.length;
    const [showPopup, setShowPopup] = useState(false);
    const [showDelPopup, setShowDelPopup] = useState(false);
    const [selectedNote, setSelectedNote] = useState();
    const popupTitle = useMemo( ()=> (selectedNote!== undefined ? notes.find( (note)=> note.id === selectedNote).title : undefined), [selectedNote]) ;
    const popupContent = useMemo( ()=> (selectedNote!== undefined ? notes.find( (note)=> note.id === selectedNote).content : undefined) ,[selectedNote]) ;
    const [search, setSearch] = useState("");
    const [searchText, setSearchText] = useState("");
    

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

    function handleSearch() {
        setSearch(searchText);
    }

    function handleReset(){
        localStorage.clear();
        location.reload();
    }

    setInterval(()=>{setDate(new Date())},1000)

    return ( 

        <div className='NoteApp'>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                <h1 className='heading'>Note App</h1>
                <button className='reset-btn' onClick={handleReset}>Reset</button>
            </div>

            <h3 style={{color:"gray"}}>{date.toLocaleDateString()}, {day} {date.toLocaleTimeString()}</h3>
            <label className='search-wrapper'>
                <input type='search' placeholder='Search' className='search' value={search} onChange={e => setSearch(e.target.value)}/>
                <span className='clear-btn' onClick={()=>setSearch("")}><box-icon name='x' size='sm'></box-icon></span>
            </label>
            <DelPopup isOpen={showDelPopup} onYes={handleDeleteNotes} onNo={()=>setShowDelPopup(false)}/>
            <PopUp key={selectedNote} isOpen={showPopup} id={selectedNote} title={popupTitle} 
            content={popupContent} action={selectedNote===undefined ? "add": 'edit'} onSave={handleAddNotes} 
            onEdit={handleEditNotes} onClose={()=>{setShowPopup(false); setSelectedNote()}} date={date.toLocaleDateString()} time={date.toLocaleTimeString()}/>

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
                            let content = `${note.content}`.toLowerCase();
                            let searchText = search.toLowerCase();
                            if(title.includes(searchText)||content.includes(searchText)){
                                return <Note key={note.id} id={note.id} title={note.title} content={note.content} onEdit={handlEditClick} onDelete={handleDeleteClick} />
                            }
                        }
                        )
                        :
                        notes.map( (note) =>
                            <Note key={note.id} id={note.id} title={note.title} content={note.content} createdOn={note.createdOn} 
                        lastEdited={note.lastEdited} onEdit={handlEditClick} onDelete={handleDeleteClick} />
                        )
                    }
                </div>

            }

        </div>
     );
}

export default NoteApp;