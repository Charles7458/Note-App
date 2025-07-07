import { memo, useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import './styles/Note.css'

function ZoomedNote({show, onHide, title, content, lastEdited, createdOn, onEdit, onDelete, pinned, handlePin, handleUnpin}){
    const [showOptions, setShowOptions] = useState(false)
    function handleHide() {
        setShowOptions(false);
        onHide();
    }
    useEffect(()=>{
        if(show){
            document.body.style.overflowY='hidden'
        }
        else{
            document.body.style.overflowY='auto'
        }
    },[show])

    if(show){
        return ReactDOM.createPortal(
            <div className='zn-backdrop'  onClick={e=>{e.stopPropagation();handleHide()}}>
                <div className='zoomed-note' onClick={e=>{e.stopPropagation();setShowOptions(false)}}>
                    <div className='zn-header'>{/*header */}
                        <h1>{title}</h1>
                        <div>
                           {!showOptions && <button className='options-btn' onClick={e=>{e.stopPropagation();setShowOptions(!showOptions)}}>
                                <i className="fa-solid fa-ellipsis fa-lg" style={{color:'white'}}></i>
                            </button> }
                        {
                            showOptions &&
                            <div className="option-tray">
                                <i className={pinned ? "options fa-solid fa-thumbtack-slash": "options fa-solid fa-thumbtack"} title={pinned ? 'Unpin': 'Pin'}
                                    onClick={pinned ? handleUnpin : handlePin}></i>

                                <i className='options fa-solid fa-pen-to-square' onClick={onEdit} title="Edit"></i>

                                <i className='options fa-solid fa-trash' onClick={onDelete}></i>

                                <i className="options fa-solid fa-xmark" onClick={()=>setShowOptions(false)}style={{marginLeft:'20px'}}></i>
                            </div>
                        }

                        </div>

                    </div>
                    <p className='details'>created: {createdOn}</p>
                    {lastEdited && <p className='details'>last edit: {lastEdited}</p>}
                    
                    <p className='zn-para'>{content}</p>
                </div>
            </div>,
            document.body
        )}
    else{
        return null;
    }
}


const Note = memo(function Note({id, createdOn, lastEdited, title, content, onEdit, onDelete, pinned, onPin, onUnpin}) {
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
                onEdit={editClick} onDelete={deleteClick} pinned={pinned} handlePin={onPin} handleUnpin={onUnpin}/>
            
            <div className='note-head'>
                <span onClick={e=>{e.stopPropagation();pinned ? onUnpin() : onPin()}} style={{cursor:"pointer",padding:'5px'}}><i className={pinned ? "fa-solid fa-thumbtack-slash": "fa-solid fa-thumbtack"}></i></span>
                <span onClick={e=>{e.stopPropagation();deleteClick()}} style={{cursor:"pointer",padding:'5px'}}><i className="fa-solid fa-trash"></i></span>
            </div>

            <div className='note-text'>
                <p style={{color:'lightgray',fontSize:'12px'}}>last edit: {lastEdited||createdOn}</p>
                <h4 className='note-title' style={{marginBottom:"15px"}}>{title}</h4> 
                <p className='note-para'>{content}</p>
            </div>
        </div>
    )
})

export default Note;