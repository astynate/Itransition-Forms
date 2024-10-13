import { useState } from 'react';
import styles from './main.module.css';
import remove from './remove.png';

const InputWrapper = ({
        children, 
        deleteFunction = () => {}, 
        isDraggAvailable = true, 
        index = 0,
        setAnswers = () => {},
        draggingAnswerIndex,
        setDraggingAnswerIndex
    }) => {

    const [isDragOver, setDragOverState] = useState();
    const [isDragElementHovered, setDragElementHoveredState] = useState(false);

    return (
        <div 
            className={styles.inputWrapper} 
            draggable={isDraggAvailable && isDragElementHovered}
            state={isDragOver ? 'dragging' : null}
            onDragStart={() => {
                if (isDraggAvailable) {
                    setDraggingAnswerIndex(index);
                }
            }}
            onDragLeave={() => {
                setDragOverState(false);
            }}
            onDragOver={(event) => {
                setDragOverState(isDraggAvailable);
                event.preventDefault();
            }}
            onDrop={() => {
                if (isDraggAvailable === false) return;

                setAnswers(prev => {
                    return [...prev.map(answer => {
                        if (answer.index === draggingAnswerIndex)
                            answer.index = index;
                        
                        else if (answer.index === index)
                            answer.index = draggingAnswerIndex;

                        return answer;
                    })];
                });

                setDragOverState(false);
            }}
        >
            <div 
                className={styles.drag}
                onMouseEnter={() => setDragElementHoveredState(true)}
                onMouseLeave={() => setDragElementHoveredState(false)}
            >
                {Array.from({ length: 6 }).map((_, index) => {
                    return (<div key={index} className={styles.point}></div>);
                })}
            </div>
            {children}
            <div className={styles.button} onClick={() => {
                if (deleteFunction) {
                    deleteFunction();
                }
            }}>
                <img src={remove} draggable="false" />
            </div>
        </div>
    );
}

export default InputWrapper;