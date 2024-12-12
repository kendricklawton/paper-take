'use client'

import { useState } from 'react';
import styles from "../page.module.css";
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import AccountModal from '../components/AccountModal/AccountModal';
import Link from 'next/link';
import { useAuthContext } from '../providers/AuthProvider';

export default function Account() {
    const { user } = useAuthContext();
    const [screen, setScreen] = useState('');
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

    const pushTo = (screen: string) => {
        setScreen(screen);
        setIsAccountModalOpen(true);
    };

    if (!user) {
        return (
            <div className={styles.page}>
                <div className={styles.wrapper}>
                    <div>You need to be logged in to view this page.</div>;
                </div>
            </div>
        );
    };

    return (
        <div className={styles.page}>
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <div className={styles.containerItemHeader}>
                        <h1>Personal Info</h1>
                    </div>
                    {
                        user?.emailVerified === false && (
                            <div className={styles.containerItem} onClick={() => pushTo('verification')}>
                                <div className={styles.containerItemLeading}>
                                    <p className={styles.textError}>Verify Account!</p>
                                </div>
                                <div className={styles.containerItemTrailing}>
                                    <ArrowForwardIos style={{
                                        color: 'red'
                                    }} />
                                </div>
                            </div>
                        )
                    }
                    <div className={styles.containerItem} onClick={() => pushTo('email')} >
                        <div className={styles.containerItemLeading}>
                            <p>Email</p>
                            <p>{user?.email}</p>
                        </div>
                        <div className={styles.containerItemTrailing}>
                            <ArrowForwardIos />
                        </div>
                    </div>
                    <div className={styles.containerItem} onClick={() => pushTo('displayName')} >
                        <div className={styles.containerItemLeading}>
                            <p>Display name</p>
                            <p>{user?.displayName}</p>
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
                    <div className={styles.containerItem} onClick={() => pushTo('password')}>
                        <div className={styles.containerItemLeading}>
                            <p>Password</p>
                        </div>
                        <div className={styles.containerItemTrailing}>
                            <ArrowForwardIos />
                        </div>
                    </div>
                    <div className={styles.containerItem} onClick={() => pushTo('deleteAccount')}>
                        <div className={styles.containerItemLeading}>
                            <p>Delete Account</p>
                        </div>
                        <div className={styles.containerItemTrailing}>
                            <ArrowForwardIos />
                        </div>
                    </div>
                </div>
                <p>
                    Need help with something else, please contact <Link href="mailto:support@machinename.dev?subject=Support%20Request&body=Please%20describe%20your%20issue%20here." className={styles.textTerms}>support</Link>
                </p>
            </div>
            <AccountModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} screen={screen} />
        </div>
    );
}