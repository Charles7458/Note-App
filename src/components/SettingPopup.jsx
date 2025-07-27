import ReactDOM from 'react-dom';
import { useState } from 'react';
import '../styles/settings.css';

export default function SettingPopup({show, existingFormat, onHide, onReset,onFormatChange, totalChar}) {
    if(!show) {
        return null;
    }
    const [showOption,setShowOptions] = useState(false)
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
                {
                    totalChar &&
                    <div className='flex-items-center space-between my-3'>
                        <h3>Total Characters: </h3>
                        <p>{totalChar}</p>
                    </div>
                }
            </div>
        </div>,
        document.body
    )
}