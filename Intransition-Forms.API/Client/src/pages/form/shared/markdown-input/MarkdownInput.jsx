import { useRef, useState } from 'react';
import styles from './main.module.css';

const MarkdownInput = ({text, setText, isMultiple = false}) => {
    const [formattedText, setFormattedText] = useState(text);
    const [isBold, setBoldState] = useState(false);
    const [isItalic, setItalicState] = useState(false);
    const [isUnderlined, setUnderlinedState] = useState(false);
    const [parentTags, setParentTags] = useState([]);

    let ref = useRef();

    const setActiveButtons = (currentTag) => {
        let newParentTags = [];
    
        while (currentTag.tagName !== 'DIV') {
            newParentTags.push(currentTag);
            currentTag = currentTag.parentElement;
        }
    
        setParentTags(newParentTags);
        const parentTagNames = newParentTags.map(e => e.tagName);

        setBoldState(parentTagNames.includes('B'));
        setItalicState(parentTagNames.includes('I'));
        setUnderlinedState(parentTagNames.includes('U'));
    }

    const removeWrapper = (wrapper) => {
        while (wrapper.firstChild) {
            wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
        }

        wrapper.parentNode.removeChild(wrapper);
    }

    const uniteSeparatedText = (wrapper) => {
        let htmlContent = wrapper.innerHTML;

        htmlContent = htmlContent.replace(/>(\s+)</g, '><').replace(/ +/g, ' ');
        wrapper.innerHTML = htmlContent;
    }

    const addMarkdown = (tag) => {
        const selection = window.getSelection();

        if (selection.rangeCount === 0) {
            setBoldState(false);
            setUnderlinedState(false);
            setItalicState(false);
            return;
        }

        const range = selection.getRangeAt(0);

        const innerHTML = range.startContainer.parentElement.innerHTML.toString();
        const parentTag = range.startContainer.parentElement.tagName;

        if (range.endOffset === 0) return;

        let before = innerHTML.slice(0, range.startOffset);
        let target = innerHTML.slice(range.startOffset, range.endOffset);
        let after = innerHTML.slice(range.endOffset, innerHTML.length);

        target = target.replace(`<${tag}>`, '').replace(`</${tag}>`, '');
        
        setActiveButtons(range.commonAncestorContainer);

        const targetTag = parentTags.find(e => e.tagName === tag.toUpperCase());
        const isDiv = parentTag === 'DIV';
        const isParentInput = range.startContainer.parentElement.id === 'input';

        if (targetTag) {
            removeWrapper(targetTag);
        } else if (isDiv === false || (isDiv && isParentInput)) {
            range.startContainer.parentElement.innerHTML = `${before}<${tag}>${target}</${tag}>${after}`;
        }

        uniteSeparatedText(ref.current);
        setText(ref.current.innerHTML);
    };

    const handleSelection = () => {
        const selection = window.getSelection();

        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            setActiveButtons(range.startContainer.parentElement);
        }
    }

    return (
        <div>
            <div
                id='input'
                ref={ref}
                contentEditable
                dangerouslySetInnerHTML={{__html: formattedText}}
                className={styles.input}
                onSelect={handleSelection}
                onBlur={() => {
                    setBoldState(false);
                    setItalicState(false);
                    setUnderlinedState(false);
                }}
                onInput={(event) => {
                    setText(event.target.innerHTML);
                }}
                onDragOver={(event) => {
                    event.preventDefault();
                }}
                onDrop={(event) => {
                    event.preventDefault();
                }}
            ></div>
            <div className={styles.buttons}>
                <button onClick={() => addMarkdown('b')} state={isBold ? 'active' : null}>B</button>
                <button onClick={() => addMarkdown('i')} state={isItalic ? 'active' : null}>I</button>
                <button onClick={() => addMarkdown('u')} state={isUnderlined ? 'active' : null}>U</button>
            </div>
        </div>
    );
}

export default MarkdownInput;