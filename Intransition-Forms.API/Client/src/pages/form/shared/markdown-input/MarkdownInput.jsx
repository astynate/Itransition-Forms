import { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import eye from './images/eye.png';
import list from './images/list.png';
import Markdown from 'react-markdown';

const MarkdownInput = ({text, setText, isMultiple = false}) => {
    const [formattedText, setFormattedText] = useState(text);
    const [isBold, setBoldState] = useState(false);
    const [isItalic, setItalicState] = useState(false);
    const [isUnderlined, setUnderlinedState] = useState(false);
    const [isPreview, setPreviewState] = useState(false);
    const [parentTags, setParentTags] = useState([]);

    let ref = useRef();

    const removeWrapper = (wrapper) => {
        while (wrapper.firstChild) {
            wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
        }

        if (wrapper && wrapper.parentElement) {
            wrapper.parentNode.removeChild(wrapper);
        }
    }

    const setActiveButtons = (currentTag) => {
        if (!currentTag) return;

        let newParentTags = [];
    
        while (currentTag && (currentTag.tagName !== 'DIV' || currentTag.id !== 'input')) {
            newParentTags.push(currentTag);
            currentTag = currentTag.parentElement;
        }

        setParentTags(newParentTags);
        const parentTagNames = newParentTags.map(e => e.tagName);
    
        setBoldState(parentTagNames.includes('B'));
        setItalicState(parentTagNames.includes('I'));
        setUnderlinedState(parentTagNames.includes('U'));
    }

    const addMarkdown = (tag) => {
        const selection = window.getSelection();
    
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);

            if (range.endOffset === 0) return;

            const parentTag = range.commonAncestorContainer.tagName;
            const tempContainer = document.createElement('div');  

            setActiveButtons(range.commonAncestorContainer);

            const targetTag = parentTags.find(e => e.tagName === tag.toUpperCase());

            if (targetTag) {
                removeWrapper(targetTag);
                return;
            }

            if (parentTag === 'DIV') {
                tempContainer.appendChild(range.cloneContents());
                const newElement = document.createElement(tag);
                
                while (tempContainer.firstChild) {
                    newElement.appendChild(tempContainer.firstChild);
                }
        
                range.deleteContents();
                range.insertNode(newElement);
            }

            const divs = ref.current.querySelectorAll('*');

            divs.forEach(div => {
                if (!div.hasChildNodes() || div.innerHTML.trim() === '') {
                    div.remove();
                }
            });

            selection.removeAllRanges();
        }
    };

    const handleSelection = () => {
        const selection = window.getSelection();

        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            setActiveButtons(range.startContainer.parentElement);
        }
    }

    useEffect(() => {
        setFormattedText(text);
    }, [isPreview]);

    return (
        <div>
            {isPreview === false && <div
                id='input'
                ref={ref}
                key={isPreview}
                className={styles.input}
                contentEditable
                dangerouslySetInnerHTML={{ __html: formattedText }}
                onSelect={handleSelection}
                onBlur={() => {
                    setBoldState(false);
                    setItalicState(false);
                    setUnderlinedState(false);
                }}
                onInput={(event) => setText(event.target.innerHTML)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => event.preventDefault()}
            ></div>}
            {isPreview === true &&
                <div className={styles.markwdownWrapper}>
                    <Markdown>{text}</Markdown>
                </div>}
            <div className={styles.control}>
                <div className={styles.buttons}>
                    <button onClick={() => addMarkdown('B')} state={isBold ? 'active' : null}>B</button>
                    <button onClick={() => addMarkdown('I')} state={isItalic ? 'active' : null}>I</button>
                    <button onClick={() => addMarkdown('U')} state={isUnderlined ? 'active' : null}>U</button>
                    <button onClick={() => addMarkdown('UL')}><img src={list} draggable="false" /></button>
                </div>
                <div className={styles.preview}>
                    <button 
                        state={isPreview ? 'active' : null}
                        onClick={() => {setPreviewState(prev => !prev)}}
                    ><img src={eye} draggable="false" /></button>
                </div>
            </div>
        </div>
    );
}

export default MarkdownInput;