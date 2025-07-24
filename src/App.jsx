import {HashRouter,Routes, Route} from 'react-router-dom'


export default function App(){    
    return(
        <HashRouter>
            <Routes>
                <Route path='/:page' />
            </Routes>
        </HashRouter>
    )
}

// export const notesReversed = notes.toReversed();