'use client'

import { useEffect, useRef, useState } from "react"
import { EditorState } from '@codemirror/state';
import { basicSetup, EditorView } from "codemirror";
import { javascript } from '@codemirror/lang-javascript' 

export const Share = ({documentId: initialDocumentId = ''}) => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [documentId, setDocumentId] = useState<string>(initialDocumentId);
    const [editorContent, setEditorContent] = useState<string | null>(null);

    useEffect(() => {
        const path = initialDocumentId ?? window.location.pathname.slice(1);
        if(path.length > 1){
            handleFetchData(path);
            setDocumentId(path);
        } else {
            handleDocumentCreation();
            setDocumentId(path);
        }

        const storedContent = localStorage.getItem(path);
        if(storedContent) setEditorContent(storedContent);
    }, []);

    useEffect(() => {
        if(!editorContent) return;
        localStorage.setItem(`${documentId}`, editorContent);
        const updatedData = localStorage.getItem(`${documentId}`);
        if(!updatedData) return;
        handleDocumentUpdation(documentId, updatedData);
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
           const response = await fetch('/api/documents', {
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

    async function handleDocumentUpdation(id: string, updatedData: string){
        try {
            const response = await fetch(`/api/documents/${id}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ content: updatedData }),
            });
            
            if(!response.ok) return;

            const data = await response.json();
            if(data.data.text === editorContent) return;
            else throw new Error("content didn't get updated!!!");
        } catch (error: any) {
            console.log('Unable to update the document' + error.message);
        }
    }

    async function handleFetchData(docId: string){
        try {
            const response = await fetch(`/api/documents/${docId}`);

            if(!response.ok) return;

            const data = await response.json();

            const stuff = data.data.text;
            window.localStorage.setItem(`${docId}`, stuff);
        } catch (error: any) {
            console.log(`Unable to fetch data from the backend : ${error.message}`);
        }
    }

    return (
        <div>
            <div 
                ref={editorRef} 
                style={{height: "500px", width: "1100px", border: "1px solid #333"}}
            ></div>
        </div>
    )
}