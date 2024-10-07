'use client'
import { useState } from 'react';
import styles from "../page.module.css";
import { useAuthContext } from "../providers/AuthProvider";
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import AccountModal from '../components/AccountModal';

export default function Account() {
    const { user } = useAuthContext();

    const [method, setMethod] = useState('');
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    // const [displayName, setDisplayName] = useState(localStorage.getItem('displayName') || '');

    const pushToEmail = () => {
        if (user?.emailVerified === false) {
            alert("You must verify your current email before making account changes.");
            return;
        }
        setMethod('email');
        setIsAccountModalOpen(true);
    }

    const pushToDisplayName = () => {
        setMethod('displayName');
        setIsAccountModalOpen(true);
    }

    const pushToPassword = () => {
        setMethod('password');
        setIsAccountModalOpen(true);
    }

    const pushToDeleteAccount = () => {
        if (user?.emailVerified === false) {
            alert("You must verify your current email before making account changes.");
            return;
        }
        setMethod('delete');
        setIsAccountModalOpen(true);
    }

    const pushToSendVerification = () => {
        setMethod('verification');
        setIsAccountModalOpen(true);
    }

    return (
        <div className={styles.page}>
            <div className={styles.wrapper}>
                <div className={styles.accountContainer}>
                    <div className={styles.accountContainerHeader}>
                        <h1>Personal Info</h1>
                    </div>
                    {
                        user?.emailVerified === false &&
                        <div className={styles.accountContainerItem} onClick={pushToSendVerification}>
                            <p style={{
                                color: 'red'
                            }}>Account Needs Email Verification!</p>
                            <ArrowForwardIos style={{
                                color: 'red'
                            }} />
                        </div>
                    }
                    <div className={styles.accountContainerItem} onClick={pushToEmail} >
                        <div className={styles.accountContainerItemLeading}>
                            <p>Email</p>
                        </div>
                        {
                            user?.email
                                ?
                                <div className={styles.accountContainerItemTrailing}>
                                    {user?.email}
                                    <ArrowForwardIos />
                                </div>
                                :
                                <ArrowForwardIos />
                        }
                    </div>
                    <div className={styles.accountContainerItem} onClick={pushToDisplayName} >
                        <div className={styles.accountContainerItemLeading}>
                            <p>Display Name </p>
                        </div>
                        {
                            user?.displayName
                                ?
                                <div className={styles.accountContainerItemTrailing}>
                                    {user?.displayName}
                                    <ArrowForwardIos />
                                </div>
                                :
                                <ArrowForwardIos />
                        }
                    </div>
                </div>
                <div className={styles.accountContainer}>
                    <div className={styles.accountContainerHeader}>
                        <h1>Data & Security</h1>
                    </div>
                    <div className={styles.accountContainerItem} onClick={pushToPassword}>
                        <p>Password</p>
                        <ArrowForwardIos />
                    </div>
                    <div className={styles.accountContainerItem} onClick={pushToDeleteAccount}>
                        <p>Delete Account</p>
                        <ArrowForwardIos />
                    </div>
                </div>
                <AccountModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} method={method} />
            </div>
        </div>
    );
}