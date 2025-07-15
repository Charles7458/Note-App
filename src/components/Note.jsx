import { memo, useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import '../styles/Note.css'

function Info({show,createdOn, lastEdited, charNum, onHide}){
    if(!show)
        {return null;}

    return ReactDOM.createPortal(
        <div className="popup-div" onClick={e=>{e.stopPropagation(); onHide()}}>
            <div className="info-div" onClick={e=>{e.stopPropagation()}}>
                <span className="info"><b>Creation: </b>{createdOn.datetime}</span>

                {lastEdited && <span className="info"><b>Last Edit: </b>{lastEdited.datetime}</span>}

                <span className="info"><b>Number of Characters: </b>{charNum}</span>
            </div>
        </div>,
        document.body
    )
}
function ZoomedNote({show, onHide, title, content, lastEdited,lastEditedDate, createdOn, createdOnDate, onEdit, onDelete, pinned, handlePin, handleUnpin}){
    const [showOptions, setShowOptions] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const charNum = content.length;
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
    
    function handleBgtouch(e){
        e.stopPropagation();
        if(showOptions){
            setShowOptions(false)
        } 
        else if (showInfo) {
            setShowOptions(false)
        }
        else{handleHide()}
    }

    if(show){
        return ReactDOM.createPortal(
            <div className='zn-backdrop'  onClick={e=>handleBgtouch(e)}>

                <Info show={showInfo} createdOn={createdOn} lastEdited={lastEdited} charNum={charNum} onHide={()=>setShowInfo(false)}/>

                <div className='zoomed-note' onClick={e=>{e.stopPropagation();setShowOptions(false)}}>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                        {lastEdited ? <p className='details'>last edit: {lastEditedDate}</p> :
                        <p className='details'>created: {createdOnDate}</p>
                            }
                    </div>
                    <div className='zn-header'>{/*header */}
                        <h1>{title}</h1>
                        <div>
                           {!showOptions && <button className='options-btn' onClick={e=>{e.stopPropagation();setShowOptions(!showOptions)}}>
                                <i className="fa-solid fa-ellipsis fa-lg" style={{color:'white'}}></i>
                            </button> }
                        {
                            showOptions &&
                            <div className="option-tray">
                                {/* <i className="options fa-solid fa-xmark" onClick={()=>setShowOptions(false)}></i> */}
                                <i className={pinned ? "options fa-solid fa-thumbtack-slash": "options fa-solid fa-thumbtack"} title={pinned ? 'Unpin': 'Pin'}
                                    onClick={pinned ? handleUnpin : handlePin}></i>
                                <i className='options fa-solid fa-pen-to-square' onClick={onEdit} title="Edit"></i>

                                <i className='options fa-solid fa-trash' onClick={onDelete}></i>

                                <i className="options fa-solid fa-circle-info" onClick={()=>setShowInfo(true)}></i>

                            </div>
                        }

                        </div>

                    </div>
                    
                    <p className='zn-para'>{content}</p>
                </div>
            </div>,
            document.body
        )}
    else{
        return null;
    }
}


const Note = memo(function Note({id, dateFormat, createdOn, lastEdited, title, content, onEdit, onDelete, pinned, onPin, onUnpin}) {

    const [showNote, setShowNote] = useState(false);
    const createdOnDate  = dateFormat.replace("dd", createdOn.date).replace("mm", createdOn.month).replace("yyyy", createdOn.year) || "";
    const lastEditedDate = lastEdited ? dateFormat.replace("dd", lastEdited.date).replace("mm", lastEdited.month).replace("yyyy", lastEdited.year) : "";
    
        
    function editClick() {
        onEdit(id,title, content)
    }

    function deleteClick() {
        onDelete(id)
    }
    
    return (
        <div className='note' onClick={()=>setShowNote(true)}>
           
            <ZoomedNote show={showNote} onHide={()=>setShowNote(false)} title={title} content={content} lastEdited={lastEdited} createdOn={createdOn}
                createdOnDate={createdOnDate} lastEditedDate={lastEditedDate}  onEdit={editClick} onDelete={deleteClick} pinned={pinned} 
                handlePin={onPin} handleUnpin={onUnpin}/>
            
            <div className='note-head'>
                <span onClick={e=>{e.stopPropagation();pinned ? onUnpin() : onPin()}} ><i className={pinned ? "fa-solid fa-thumbtack-slash options": "fa-solid fa-thumbtack options"}></i></span>
                <span onClick={e=>{e.stopPropagation();deleteClick()}} ><i className="fa-solid fa-trash options"></i></span>
            </div>

            <div className='note-text'>
                <p style={{color:'rgba(120, 120, 120, 0.773)',fontSize:'14px', marginBottom:'10px'}}>{lastEdited ? `Last Edit: ${lastEditedDate}` : `created: ${createdOnDate}`}</p>
                <h4 className='note-title' style={{marginBottom:"15px"}}>{title}</h4> 
                <p className='note-para'>{content}</p>
            </div>
        </div>
    )
})

export default Note;