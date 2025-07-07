import React, { useState } from 'react';
import './styles/checklist.css'

function CheckItem({content}){
    const [isChecked, setIsChecked] = useState(false);

    return(
        <div className="check-item-div">
            <input type='checkbox' onChange={e=>setIsChecked(e.target.checked)}/>
            <p className={isChecked ? 'striked-check-text' : 'normal-check-text'}>{content}</p>
        </div>
    )
}


export default function Checklist({items, title}){
    const [showNote, setShowNote] = useState(false);
    return(
        <div>
            <h3 style={{marginBottom:'40px'}}>{title}</h3>
            {
                items.map((item,i) => (
                    <CheckItem key={i} content={item}/>
                ))
            }
        </div>
    )
}