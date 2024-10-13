'use client'

import { useState } from 'react';
import styles from "../page.module.css";
import { useAuthContext } from "../providers/AuthProvider";
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import AccountModal from '../components/AccountModal';

export default function Account() {
    const { user, userDisplayName, userEmail } = useAuthContext();
    const [method, setMethod] = useState('');
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

    const pushToDeleteAccount = () => {
        if (user?.emailVerified === false) {
            alert("You must verify your current email before making account changes.");
            return;
        }
        setMethod('delete');
        setIsAccountModalOpen(true);
    }

    const pushToDisplayName = () => {
        setMethod('displayName');
        setIsAccountModalOpen(true);
    }

    const pushToEmail = () => {
        setMethod('email');
        setIsAccountModalOpen(true);
    }

    const pushToPassword = () => {
        setMethod('password');
        setIsAccountModalOpen(true);
    }

    const pushToSendVerification = () => {
        setMethod('verification');
        setIsAccountModalOpen(true);
    }

    return (
        <div className={styles.page}>
            <div className={styles.wrapperAccount}>
                <div className={styles.container}>
                    <div className={styles.containerItemHeader}>
                        <h1>Personal Info</h1>
                    </div>
                    {
                        user?.emailVerified === false && (
                        <div className={styles.containerItem} onClick={pushToSendVerification}>
                            <div className={styles.containerItemLeading}>
                                <p className={styles.textError}>Account Needs Email Verification!</p>
                            </div>
                            <div className={styles.containerItemTrailing}>
                                <ArrowForwardIos style={{
                                    color: 'red'
                                }} />
                            </div>
                        </div>
                        )
                    }
                    <div className={styles.containerItem} onClick={pushToEmail} >
                        <div className={styles.containerItemLeading}>
                            <p>Email</p>
                            <p>{userEmail}</p>
                        </div>
                        <div className={styles.containerItemTrailing}>
                            <ArrowForwardIos />
                        </div>
                    </div>
                    <div className={styles.containerItem} onClick={pushToDisplayName} >
                        <div className={styles.containerItemLeading}>
                            <p>Display name</p>
                            <p>{userDisplayName}</p>
                        </div>
                        <div className={styles.containerItemTrailing}>
                            <ArrowForwardIos />
                        </div>
                    </div>
                </div>
                <div className={styles.container}>
                    <div className={styles.containerItemHeader}>
                        <h1>Data & Security</h1>
                    </div>
                    <div className={styles.containerItem} onClick={pushToPassword}>
                        <div className={styles.containerItemLeading}>
                            <p>Password</p>
                        </div>
                        <div className={styles.containerItemTrailing}>
                            <ArrowForwardIos />
                        </div>
                    </div>
                    <div className={styles.containerItem} onClick={pushToDeleteAccount}>
                        <div className={styles.containerItemLeading}>
                            <p>Delete Account</p>
                        </div>
                        <div className={styles.containerItemTrailing}>
                            <ArrowForwardIos />
                        </div>
                    </div>
                    <AccountModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} method={method} />
                </div>
            </div>
        </div>
    );
}