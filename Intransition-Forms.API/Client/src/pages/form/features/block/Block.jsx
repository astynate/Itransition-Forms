import { useState } from 'react';
import FormWrapper from '../../shared/form-wrapper/FormWrapper';
import styles from './main.module.css';

const Block = ({children, isDragOver = false, onDragStart, isDragAvailable = false}) => {
    return (
        <FormWrapper onDragStart={onDragStart} isDragAvailable={isDragAvailable}>
            <div state={isDragOver ? 'dragOver' : null} className={styles.block}>
                {children}
            </div>
        </FormWrapper>
    );
}

export default Block;