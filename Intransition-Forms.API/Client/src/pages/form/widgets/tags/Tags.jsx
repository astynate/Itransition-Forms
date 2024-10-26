import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Block from '../../features/block/Block';
import Select from '../../shared/select/Select';
import styles from './main.module.css';
import InputWithAutocomplition from '../../shared/input-with-autocomplition/InputWithAutocomplition';
import Guid from '../../../../utils/Guid';
import TagModel from '../../shared/tag-model/TagModel';

const Tags = ({form, setForm}) => {
    const [newTagValue, setNewTagValue] = useState('');
    const types = ['Education', 'Quiz', 'Other'];

    const { t } = useTranslation();

    return (
        <Block>
            <h2 className={styles.title}>Tags and type</h2>
            <div className={styles.tags}>
                {form.tags && form.tags.map((tag) => {
                    return (
                        <TagModel 
                            key={tag.id}
                            text={tag.tag} 
                            remove={() => {
                                setForm(prev => {
                                    const newTags = prev.tags.filter(element => element.id !== tag.id);
                                    return { ...prev, tags: newTags }
                                }
                            )}}
                        />
                    );
                })}
                <InputWithAutocomplition
                    placeholder="Write a new tag"
                    maxLength={20}
                    value={newTagValue}
                    onEnter={() => {
                        setForm(prev => {
                            const newTag = {
                                id: Guid.NewGuid(),
                                formModelId: form.id,
                                tag: newTagValue
                            };
            
                            return { ...prev, tags: [...prev.tags, newTag] };
                        });
                    }}
                    onInput={(text) => setNewTagValue(text)} 
                    onBlur={(event) => event.target.value = ""}
                />
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
        </Block>
    );
}

export default Tags;