import ReactDOM from 'react-dom';
import { useState } from 'react';
import '../styles/settings.css';
import ImportExportPopup  from './ImportExportPopup' ;


export default function SettingPopup({show, existingFormat, onHide, onReset,onFormatChange, totalChar, onDownload, onImport}) {
    if(!show) {
        return null;
    }

    const [showOption,setShowOptions] = useState(false)
    const [showImpExp, setShowImpExp] = useState(false)
    const [isImp, setIsImp] = useState(false)

    const [format, setFormat] = useState(existingFormat)
    const formats = ["dd/mm/yyyy", "mm/dd/yyyy"]
    function handleFormatChange(value) {
        setShowOptions(false)
        if(value == "dd/mm/yyyy" || value == "mm/dd/yyyy") {
            setFormat(value)
            onFormatChange(value)
        }
    }

    return ReactDOM.createPortal(
        <div className='popup-div' onClick={onHide}>
            <ImportExportPopup show={showImpExp} close={()=>{setShowImpExp(false)}} isImport={isImp} onDownload={onDownload} onImport={onImport}/>
            <div className='settings-div' onClick={e=>e.stopPropagation()}>
                <h2 style={{marginBlockEnd:'30px'}}>Settings</h2>
                <div className='flex-items-center space-between my-3'>
                    <h3>Change date format</h3>
                    <div className='dropdown-container'>
                        <div role='button' className='format-input' onClick={()=>setShowOptions(!showOption)}>
                            {format}
                            { showOption ? <i className='fa-solid fa-caret-up'style={{marginLeft:'20px'}}></i> : <i className='fa-solid fa-caret-down'style={{marginLeft:'20px'}}></i>}
                        </div>
                        {
                            showOption && 
                            <div  className='dropdown'>
                                {formats.map((format)=> <div role='button' className='dropdown-option' onClick={()=>handleFormatChange(format)}>{format}</div>)}
                            </div>
                        }
                    </div>
                    

                </div>
                <div className='flex-items-center space-between my-3'>
                    <h3>Delete all notes</h3>
                    <button className='reset-btn' onClick={e=>{e.stopPropagation();onReset()}}>Reset</button>
                </div>

                <div className='flex-items-center space-between my-3'>
                    <h3>Take local backup of notes: </h3>
                    <button className='download-btn' onClick={()=>{setIsImp(false);setShowImpExp(true)}}>Download Notes</button>
                </div>

                <div className='flex-items-center space-between my-3'>
                    <h3>Sync notes: </h3>
                    <button className='import-btn' onClick={()=>{setIsImp(true);setShowImpExp(true)}}>Import Notes</button>
                </div>

                                {
                    totalChar &&
                    <div className='flex-items-center space-between my-3'>
                        <h3>Total Characters: </h3>
                        <p>{totalChar}</p>
                    </div>
                    
                }

                <p style={{marginTop:'50px',textAlign:'center'}}>
                    Made with ❤️ by Charles
                </p>

                <p style={{color:"gray",marginTop:'40px',textAlign:'center'}}>
                    Caution! The notes are stored in browser's local storage. The notes will get deleted, when clearing browser data or site data. Unless you take a backup.
                </p>
                
            </div>
        </div>, document.body
    )
}