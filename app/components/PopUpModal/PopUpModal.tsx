'use client'

import React from 'react';
import styles from '../../page.module.css';
import { StyledButton } from '../Styled';

interface PopUpModalProps {
    isOpen: boolean;
    confirmButtonText: string;
    message: string;
    onClose: (result: boolean) => void;
}

const PopUpModal: React.FC<PopUpModalProps> = ({ isOpen, confirmButtonText, message, onClose, }) => {
    if (!isOpen) return null;

    const handleConfirm = (event: React.MouseEvent) => {
        event.preventDefault();
        onClose(true);
    };

    const handleCancel = (event: React.MouseEvent) => {
        event.preventDefault();
        onClose(false);
    };

    return (
        <div className={styles.popUpModal}>
            <div className={styles.wrapperPopUp}>
                <p>{message}</p>
                <div>
                    <StyledButton
                        className={styles.button}
                        onClick={handleConfirm}
                        type="button"
                    >
                        {confirmButtonText ? confirmButtonText : 'Confirm'}
                    </StyledButton>

                    <StyledButton
                        className={styles.button}
                        onClick={handleCancel}
                        type="button"
                    >
                        Cancel
                    </StyledButton>
                </div>
            </div>
        </div>
    );
}

export default PopUpModal;