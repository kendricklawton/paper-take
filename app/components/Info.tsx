'use client'

import React from 'react';
import { IconButton } from '@mui/material';
import styles from "../page.module.css";
import { Close } from '@mui/icons-material';
import { useAppContext } from '../providers/AppProvider';

const Info: React.FC =()=> {
    const { info, setInfo, 
        // undoAction 
    } = useAppContext();

    return (
        info && (
            <div className={styles.information}>
                <p>{info}</p>
                <IconButton onClick={() => setInfo('')}
                    sx={{ color: 'lightgray'}}>
                    <Close />
                </IconButton>
            </div>
        ));
}

export default Info;