import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import styles from './AccountModal.module.css';
import { useAuthContext } from '../providers/AuthProvider';
import { IconButton } from '@mui/material';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    method: string;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, method }) => {
    const Router = useRouter();
    const { authError, user, deleteUserAccount, sendUserVerification, updateUserDisplayName, updateUserEmail, updateUserPassword } = useAuthContext();

    const [deleteAccount, setDeleteAccount] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [confirmNewEmail, setConfirmNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '', newPassword: '' });

    const handleClickShowPassword = () => {
        setShowPassword(prev => !prev);
    };

    const handleClose = () => {
        setDeleteAccount('');
        setDisplayName('');
        setEmail('');
        setConfirmNewEmail('');
        setPassword('');
        setConfirmNewPassword('');
        onClose();
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({ email: '', password: '', newPassword: '' });

        try {
            if (method === "email") {
                if (email === confirmNewEmail) {
                    await updateUserEmail(email, password);
                    handleClose();
                    alert('Please verify your new email address');

                } else {
                    setErrors({ ...errors, email: 'Emails do not match' });
                    return;
                }
            } else if (method === "password") {
                if (password === confirmNewPassword) {
                    await updateUserPassword(newPassword, password);
                    handleClose();
                    alert('Password updated successfully');

                } else {
                    setErrors({ ...errors, password: 'Passwords do not match' });
                    return;
                }
            } else if (method === "delete") {
                if (deleteAccount === "delete-my-account") {
                    await deleteUserAccount(password);
                    handleClose();
                    Router.push('/');
                    alert('Account deleted successfully');
                } else {
                    return;
                }
            } else if (method === "displayName") {
                if (displayName === user?.displayName) {
                    alert('Display name must be different from current display name');
                    return;
                }
                await updateUserDisplayName(displayName);
                handleClose();
            } else if (method === "verification") {
                await sendUserVerification();
                handleClose();
                alert('Verification email sent');
            }
        } catch (error) {
            setErrors({ ...errors, [method]: error });
        }
    };
    const isFormButtonEnabled = () => {
        if (method === "email") {
            return email.length > 0 && confirmNewEmail.length;
        } else if (method === "password") {
            return password.length > 0 && confirmNewPassword.length;
        } else if (method === "delete") {
            return password.length > 0 && deleteAccount === "delete-my-account"
        } else if (method === "displayName") {
            return displayName.length > 0;
        } else if (method === "verification") {
            return true;
        }
        return false;
    };
    return (
        isOpen && (
            <div className={styles.containerModal}>
                <div className={styles.formContainer}>
                    <form className={styles.authForm} onSubmit={handleSubmit}>
                        <h1>Nesta Note</h1>
                        {method === "email" && (
                            <>
                                <p>Current Email: {user?.email}</p>
                                <div className={styles.inputContainer}>
                                    <input
                                        className={styles.input}
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder='New email'
                                    // aria-invalid={!!errors.email}
                                    />
                                </div>
                                <div className={styles.inputContainer}>
                                    <input
                                        className={styles.input}
                                        type="email"
                                        id="confirmNewEmail"
                                        value={confirmNewEmail}
                                        onChange={(e) => setConfirmNewEmail(e.target.value)}
                                        placeholder='Confirm new email'
                                        // aria-invalid={!!errors.email}
                                        autoComplete='off'
                                    />
                                </div>
                                {
                                    errors.email
                                        ?
                                        <p className={styles.textError} aria-live="polite">{errors.email}</p>
                                        :
                                        null
                                }
                            </>
                        )}
                        {method === "password" && (
                            <>
                                <div className={styles.inputContainer}>
                                    <input
                                        className={styles.input}
                                        type={showPassword ? 'text' : 'password'}
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder='New password'
                                    // aria-invalid={!!errors.password}
                                    />
                                </div>
                                {
                                    errors.newPassword
                                        ?
                                        <p className={styles.textError} aria-live="polite">{errors.newPassword}</p>
                                        :
                                        null
                                }
                                <div className={styles.inputContainer}>
                                    <input
                                        className={styles.input}
                                        type={showPassword ? 'text' : 'password'}
                                        id="confirmNewPassword"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        placeholder='Confirm new password'
                                    // aria-invalid={!!errors.password}
                                    />
                                </div>
                                {errors.newPassword ?? (<p aria-live="polite">{errors.newPassword}</p>)}
                            </>
                        )}
                        {method === "delete" && (
                            <>
                                <p>We will immediately delete your account, along with all of your data assoicated with your account.</p>
                                <p>To verify, type &apos;delete-my-account&apos; below</p>
                                <div className={styles.inputContainer}>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        id="deleteAccount"
                                        value={deleteAccount}
                                        onChange={(event) => setDeleteAccount(event.target.value)}
                                        placeholder="delete-my-account"
                                        // aria-invalid={!!errors.password}
                                        autoComplete='off'
                                    />
                                </div>
                            </>
                        )}
                        {method === "displayName" && (
                            <>
                                <p>Current Display Name: {user?.displayName ? user?.displayName : 'N/A'}</p>
                                <div className={styles.inputContainer}>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        id="displayName"
                                        value={displayName}
                                        onChange={(event) => setDisplayName(event.target.value)}
                                        placeholder="New display name"
                                        // aria-invalid={!!authError}
                                        autoComplete='off'
                                    />
                                </div>
                            </>
                        )}
                        {method === "verification" && (
                            <p>Verification email will be sent to {user?.email}</p>
                        )}
                        {method != "displayName" && method != "verification" && (
                            <div className={styles.inputContainer}>
                                <input
                                    className={styles.inputVisiblity}
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='Password'
                                // aria-invalid={!!errors.password}
                                />
                                <IconButton onClick={handleClickShowPassword} className={styles.visiblityIcon}>
                                    {
                                        showPassword
                                            ?
                                            <VisibilityOffOutlined />
                                            :
                                            <VisibilityOutlined />
                                    }
                                </IconButton>
                            </div>
                        )}

                        {
                            authError
                                ?
                                <p className={styles.textError} aria-live="polite">{authError}</p>
                                :
                                null
                        }
                        {
                            (method === "displayName" && user?.displayName) && (
                                <button className={styles.formButton} type="submit">
                                    Remove Display Name
                                </button>
                            )
                        }
                        <button className={styles.formButton} disabled={!isFormButtonEnabled()} type="submit">
                            {method === "verification" ? 'Resend' : 'Submit'}
                        </button>
                        <button className={styles.formButton} onClick={handleClose} type="reset">
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        )
    );
}
export default AccountModal;