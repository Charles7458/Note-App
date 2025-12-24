import { useState } from "react";

export default function ImportExportPopup({show,close, isImport, onDownload, onImport}){

    if(show) {
        const [importEvent,setImportEvent] = useState(null)

        function handleImport(){
            const event = importEvent
            console.log("File selected"+event.target.files[0].name)
            
            const file = event.target.files[0]
            if(event == null || event.target.files[0] == null) {
                console.log("Choose a file first")
                return;
            }

            if (file.type !== "application/json") {
                alert("Please upload a valid JSON file");
                event.target.value = "";
                return;
            }
            const reader = new FileReader();
            reader.readAsText(file); //starts reader.onload after reading
            reader.onload = (e) => {
                try {
                    const tempNotes = JSON.parse(e.target.result)
                    if(!Array.isArray(tempNotes)){
                        throw new Error("Invalid json file")
                    }
                    console.log("imported notes: " + tempNotes)
                    onImport(tempNotes)
                }
                catch(err) {
                    alert("Invalid notes file");
                    console.error(err)
                }
                finally{
                    setImportEvent(null)
                    event.target.value = ""
                    close();
                }
            }
        }

        return (
            <div className="popup-div" onClick={close}>
                <div className="import-popup" onClick={e=>e.stopPropagation()}>
                    <div style={{display:'flex', width:'full', justifyContent:'end'}}>
                        <button className="close-btn"
                            onClick={close}>
                            <i className="fa-solid fa-close"></i>
                        </button>
                    </div>
                    
                    <p style={{padding:'20px'}}>{
                    isImport ? "Select the file and click the below to sync the local notes with the present ones." 
                                    :
                        "The below button will start download of notes."
                        }
                        </p>
                        {
                            !isImport &&
                            <i style={{display:'block',color:'gray',fontSize:'14px',width:'400px',marginInline:'auto',}}>(No need to be afraid, the file is in js format because it's most compatible with this web app.)</i>
                        }
                    {
                        isImport ?
                        <div style={{display:'flex',justifyContent:'space-evenly',marginBlock:"20px"}}>
                            <input type="file" id="fileInput" accept=".json" onChange={e=>setImportEvent(e)} className="file-input"/>
                            <button className="download-btn" onClick={handleImport}>
                                Import
                            </button>
                        </div>
                        :
                        <button className="download-btn" onClick={()=>{onDownload();close();}} style={{marginBlock:'20px'}}>
                            Download
                        </button>
                    }
                
                </div>
                
            </div>
        ) 

    }
    
}