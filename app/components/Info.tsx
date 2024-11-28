'use client'

import React from 'react';
import { IconButton } from '@mui/material';
import styles from './Info.module.css';
import { Close } from '@mui/icons-material';
import { useAppContext } from '../providers/AppProvider';

const Info: React.FC = () => {
    const { info, setInfo,
        // undoAction 
    } = useAppContext();

    return (
        info && (
            <div className={styles.wrapper}>
                <div className={styles.info}>
                    <p>{info}</p>
                    <IconButton onClick={() => setInfo('')}
                        sx={{ color: 'lightgray' }}>
                        <Close />
                    </IconButton>
                </div>
            </div>
        ));
}

export default Info;