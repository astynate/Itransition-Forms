import Block from '../../features/block/Block';
import MarkdownInput from '../../shared/markdown-input/MarkdownInput';
import Select from '../../shared/select/Select';
import TextInput from '../../shared/text-input/TextInput';
import styles from './main.module.css';
import close from './images/remove.png';
import { useEffect, useState } from 'react';
import Guid from '../../../../utils/Guid';

const Title = ({form, setForm}) => {
    const [newTagValue, setNewTagValue] = useState('');
    const types = ['Education', 'Quiz', 'Other'];

    useEffect(() => {
        const keyDownHandler = (event) => {
            if (event.key === 'Enter' && !!newTagValue) {
                setForm(prev => {
                    const newTag = {
                        id: Guid.NewGuid(),
                        formModelId: form.id,
                        tag: newTagValue
                    };
    
                    return { ...prev, tags: [...prev.tags, newTag] };
                });

                setNewTagValue('');
            }
        };
    
        document.addEventListener('keydown', keyDownHandler);
    
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [newTagValue, form.id]);

    if (!form || !setForm) return null;

    return (
        <Block>
            <TextInput 
                text={form.title}
                setText={(newText) => {
                    setForm(prev => {
                        return { ...prev, title: newText };
                    })
                }}
                isMultiple={false}
            />
            <MarkdownInput 
                text={form.description}
                setText={(newText) => {
                    setForm(prev => {
                        return { ...prev, description: newText };
                    })
                }}
            />
            <div className={styles.tags}>
                {form.tags && form.tags.map((tag) => {
                    return (
                        <div className={styles.tag} key={tag.id}>
                            <span>{tag.tag}</span>
                            <img src={close} onClick={() => {
                                setForm(prev => {
                                    const newTags = prev.tags.filter(element => element.id !== tag.id);
                                    return { ...prev, tags: newTags }
                                })
                            }} />
                        </div>
                    );
                })}
                <div className={styles.newTag}>
                    <input 
                        placeholder='New tag'
                        maxLength={20}
                        onInput={(event) => setNewTagValue(event.target.value)} 
                        onBlur={(event) => event.target.value = ""}
                    />
                </div>
                <div className={styles.selectWrapper}>
                    <Select
                        items={types}
                        value={form.topic}
                        onChange={(event) => {  
                            setForm(prev => {
                                return { ...prev, topic: event.target.value };
                            })
                        }}
                    />
                </div>
            </div>
            {/* <div className={styles.select}>
                <button>
                    <span>Image</span>
                </button>
                <Select
                    items={types}
                    value={form.topic}
                    onChange={(event) => {  
                        setForm(prev => {
                            return { ...prev, topic: event.target.value };
                        })
                    }}
                />
            </div> */}
        </Block>
    );
}

export default Title;