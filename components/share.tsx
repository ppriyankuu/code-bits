import { useEffect, useRef, useState } from "react"
import { EditorState } from '@codemirror/state';
import { basicSetup, EditorView } from "codemirror";
import { javascript } from '@codemirror/lang-javascript' 

export const Share = () => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [documentId, setDocumentId] = useState<string>('');
    const [editorContent, setEditorContent] = useState(localStorage.getItem(`${window.location.pathname.slice(1)}`));

    useEffect(() => {
        const path = window.location.pathname.slice(1);
        if(path.length > 1){
            // TODO
            setDocumentId(path);
        } else {
            // something TODO
            setDocumentId(path);
        }

        const storedContent = localStorage.getItem(path);
        if(storedContent) setEditorContent(storedContent);
    }, []);

    useEffect(() => {
        if(!editorContent) return;
        localStorage.setItem(`${documentId}`, editorContent);
        const updatedData = localStorage.getItem(`${documentId}`);
        // TODO
    }, [editorContent]);

    useEffect(() => {
        if(!editorRef.current) return;

        const startState = EditorState.create({
            doc: editorContent ?? '',
            extensions: [
                basicSetup,
                javascript(),
                EditorView.updateListener.of((v) => {
                    if(!v.docChanged) return;
                    setEditorContent(v.state.doc.toString());
                }),
            ],
        });

        const view = new EditorView({
            state: startState,
            parent: editorRef.current,
        });

        return () => view.destroy();
    }, []);

    async function handleDocumentCreation() {
        try {
           const response = await fetch(
                'https://notepadbackend-y9k7.onrender.com/save',
                {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: '',
                        content: editorContent,
                    }),
                }
           ); 

           if(!response.ok) return;

           const data = await response.json();

           if(data && data.data._id) {
                const id = data.data._id;
                console.log(id);

                window.history.pushState({}, '', `/${id}`);
           }
        } catch (error : any) {
            console.log(`Error creating/updating document : ${error.message}`);
        }
    }

    return (
        <div>
            {<div 
                ref={editorRef} 
                style={{height: "500px", width: "1100px", border: "1px solid #333"}}
            ></div>} 
        </div>
    )
}