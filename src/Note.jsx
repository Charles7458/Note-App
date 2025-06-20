import { memo, useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import './styles/Note.css'

function ZoomedNote({show, onHide, title, content, lastEdited, createdOn, onEdit, onDelete}){
    const [showOptions, setShowOptions] = useState(false)
    
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

function Options({children}){
    return(
        <div className='option-div'>
            {children}
        </div>
    )
}


const Note = memo(function Note({id, createdOn, lastEdited, title, content, onEdit, onDelete}) {
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
})

export default Note;