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

    return (
        <div className={styles.pageAccount}>
            <div className={styles.wrapperAccount}>
                <h1>Account</h1>
                <div className={styles.container}>
                    {
                        user?.emailVerified === false && (
                            <div className={styles.containerItem} onClick={() => pushTo('verification')}>
                                <p className={styles.textError}>Verify Account!</p>
                                <ArrowForwardIos style={{
                                    color: 'red'
                                }} />
                            </div>
                        )
                    }
                    <div className={styles.containerItem} onClick={() => pushTo('email')} >
                        <p>Email</p>
                        <ArrowForwardIos />
                    </div>
                    <div className={styles.containerItem} onClick={() => pushTo('displayName')} >
                        <p>Display name</p>
                        <ArrowForwardIos />
                    </div>
                    <div className={styles.containerItem} onClick={() => pushTo('password')}>
                        <p>Password</p>
                        <ArrowForwardIos />
                    </div>
                    <div className={styles.containerItem} onClick={() => pushTo('delete')}>
                        <p>Delete account</p>
                        <ArrowForwardIos />
                    </div>
                </div>
                <p>
                    Need help with something else, please contact <Link href="mailto:support@machinename.dev?subject=Support%20Request&body=Please%20describe%20your%20issue%20here." className={styles.textTerms}>support</Link>
                </p>
                <p>PaperTake.io <Link href={'PaperTake.io - Privacy Policy.pdf'} className={styles.textTerms} target="_blank" rel="noopener noreferrer">Terms of Service</Link> & <Link href={'/PaperTake.io - Terms of Service.pdf'} className={styles.textTerms} target="_blank" rel="noopener noreferrer">Privacy Policy</Link></p>
            </div>
            <AccountModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} screen={screen} />
        </div>
    );
}