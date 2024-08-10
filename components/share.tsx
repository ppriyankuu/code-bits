'use client'

import { useEffect, useRef, useState } from "react"
import { EditorState } from '@codemirror/state';
import { basicSetup, EditorView } from "codemirror";
import { javascript } from '@codemirror/lang-javascript' 

export const Share = ({ documentId: initialDocumentId = '' }) => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const editorViewRef = useRef<EditorView | null>(null);
    const [documentId, setDocumentId] = useState<string>(initialDocumentId);
    const [editorContent, setEditorContent] = useState<string>('');
    const [hasLoaded, setHasLoaded] = useState<boolean>(false);

    useEffect(() => {
        const path = initialDocumentId ?? window.location.pathname.slice(1);
        if (path.length >= 1) {
            handleFetchData(path);
            setDocumentId(path);
        } else {
            setDocumentId(path);
        }
        
        const storedContent = localStorage.getItem(path);
        if (storedContent) {
            setEditorContent(storedContent);
        }
        
        setHasLoaded(true);
    }, [initialDocumentId]);

    useEffect(() => {
        if (hasLoaded) {
            localStorage.setItem(`${documentId}`, editorContent);
            const updatedData = localStorage.getItem(`${documentId}`);
            if (!updatedData) return;
            handleDocumentUpdation(documentId, updatedData);
        }
    }, [editorContent]);

    useEffect(() => {
        if (!editorRef.current) return;

        const startState = EditorState.create({
            doc: editorContent ?? '',
            extensions: [
                basicSetup,
                javascript(),
                EditorView.updateListener.of((v) => {
                    if (!v.docChanged) return;
                    setEditorContent(v.state.doc.toString());

                    if (!documentId) {
                        handleDocumentCreation();
                    }
                }),
            ],
        });

        const view = new EditorView({
            state: startState,
            parent: editorRef.current,
        });

        editorViewRef.current = view;

        return () => view.destroy();
    }, [documentId]);

    useEffect(() => {
        const view = editorViewRef.current;
        if (view) {
            const transaction = view.state.update({
                changes: { from: 0, to: view.state.doc.length, insert: editorContent }
            });
            view.dispatch(transaction);
        }
    }, [editorContent]);

    useEffect(() => {
        const handleBeforeUnload = () => window.localStorage.removeItem(`${documentId}`);

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [documentId]);

    async function handleDocumentCreation() {
        try {
            const response = await fetch('/api/documents', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    content: editorContent,
                }),
            });

            if (!response.ok) {
                console.log('Document creation failed.');
                return;
            }

            const data = await response.json();
            console.log('Document creation response:', data);

            if (data && data.data.id) {
                const id = data.data.id;
                setDocumentId(id);
                window.history.pushState({}, '', `/${id}`);
            }
        } catch (error: any) {
            console.log(`Error creating/updating document: ${error.message}`);
        }
    }

    async function handleDocumentUpdation(id: string, updatedData: string) {
        try {
            const response = await fetch(`/api/documents/${id}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ content: updatedData }),
            });

            if (!response.ok) return;

            const data = await response.json();
            if (data.data.content === editorContent) return;
            else throw new Error("content didn't get updated!!!");
        } catch (error: any) {
            console.log('Unable to update the document' + error.message);
        }
    }

    async function handleFetchData(docId: string) {
        try {
            const response = await fetch(`/api/documents/${docId}`);

            if (!response.ok) return;

            const data = await response.json();

            const stuff = data.data.content;
            window.localStorage.setItem(`${docId}`, stuff);
            setEditorContent(stuff);
        } catch (error: any) {
            console.log(`Unable to fetch data from the backend : ${error.message}`);
        }
    }

    return (
        <div>
            <div 
                ref={editorRef} 
                style={{height: "500px", width: "1100px", border: "1px solid #333", background: "#98809f"}}
            ></div>
        </div>
    )
}