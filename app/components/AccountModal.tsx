'use client'

import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation'
import styles from './Modal.module.css';
import { useAuthContext } from '../providers/AuthProvider';
import { Button, InputAdornment, TextField } from '@mui/material';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';

const StyledTextField = styled(TextField)({
    '& .MuiInputBase-input': {
        fontFamily: 'monospace',
        fontWeight: 'lighter',
    },
    '& label': {
        fontFamily: 'monospace',
        fontWeight: 'lighter',
    },
    '& label.Mui-focused': {
        fontFamily: 'monospace',
        fontWeight: 'lighter',
    },
});

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    method: string;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, method }) => {
    const Router = useRouter();

    const { authError, user, clearAuthError, sendPasswordReset, updateUserDisplayName, updateUserEmail,
        deleteUserAccount } = useAuthContext();

    const [deleteAccount, setDeleteAccount] = useState('');
    const [newDisplayName, setNewDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ displayName: '', email: '', password: '' });

    const handleClickShowPassword = () => {
        setShowPassword(prev => !prev);
    };

    const handleClose = () => {
        clearAuthError();
        setDeleteAccount('');
        setEmail('');
        setErrors({ displayName: '', email: '', password: '' });
        setNewDisplayName('');
        setPassword('');
        setShowPassword(false);
        onClose();
    }

    const handleRemoveDisplayName = () => {
        updateUserDisplayName('');
        handleClose();
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({ displayName: '', email: '', password: '' });
        try {
            console.log(method);
            if (method === "email") {
                if (email === user?.email) {
                    setErrors({ ...errors, email: 'Email is the same as current email' });
                    return;
                }
                await updateUserEmail(email, password);

                handleClose();
                alert('Please verify your new email address');
            } else if (method === "password") {
                if (user?.email) {
                    await sendPasswordReset(user?.email);
                    handleClose();
                    alert('Password reset link sent to your email');
                }
            } else if (method === "delete") {
                await deleteUserAccount(password);
                handleClose();
                Router.push('/');
                alert('Account deleted successfully');
            } else if (method === "displayName") {
                if (newDisplayName === user?.displayName) {
                    setErrors({ ...errors, displayName: 'Display name is the same as current display name' });
                    return;
                }
                await updateUserDisplayName(newDisplayName);
                handleClose();
            }
        } catch (error) {
            handleClose();
            alert('An error occurred: ' + error);
        }
    };

    const isButtonEnabled = () => {
        if (method === "email") {
            return email.trim() !== '' && password.trim() !== '' && password.length > 6;
        } else if (method === "password") {
            return user?.email === email;
        } else if (method === "delete") {
            return deleteAccount === "delete-my-account" && password.trim() !== '' && password.length > 6;
        } else if (method === "displayName") {
            return newDisplayName.trim() !== '' && newDisplayName.length > 1;
        } else if (method === "verification") {
            return true;
        }
        return false;
    };

    return (
        isOpen && (
            <div className={styles.containerModalAccount}>
                <div className={styles.containerAccount}>
                    <form className={styles.formAccount} onSubmit={handleSubmit}>
                        {method === "email" && (
                            <div className={styles.formAccountContainer}>
                                <h1>Update Email</h1>
                                <p>Current Email: {user?.email}</p>
                                <StyledTextField
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    variant="standard"
                                    label="Email"
                                    autoComplete='off'
                                />
                                {errors.email && (<p className={styles.textError} aria-live="polite">{errors.email}</p>)}
                            </div>
                        )}
                        {method === "password" && (
                            <div className={styles.formAccountContainer}>
                                <h1>Update Password</h1>
                                <p>Password reset link will be sent to the following email &apos;{user?.email}&apos;.</p>
                                <p>To verify, type your email below.</p>
                                <StyledTextField
                                    type='text'
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    variant="standard"
                                    label="Email"
                                    autoComplete='off'
                                />
                                {errors.email && (<p className={styles.textError} aria-live="polite">{errors.email}</p>)}
                            </div>
                        )}
                        {method === "delete" && (
                            <div className={styles.formAccountContainer}>
                                <h1>Delete Account</h1>
                                <p>We will promptly remove your account and all related information assoicated with the following email &apos;{user?.email}&apos;.</p>
                                <p>To verify, type &apos;delete-my-account&apos; below and enter your password. Please note that this is a permanent action.</p>
                                <StyledTextField
                                    type="text"
                                    id="deleteAccount"
                                    value={deleteAccount}
                                    onChange={(event) => setDeleteAccount(event.target.value)}
                                    placeholder="delete-my-account"
                                    autoComplete='off'
                                    variant="standard"
                                />
                            </div>
                        )}
                        {method === "displayName" && (
                            <div className={styles.formAccountContainer}>
                                <h1>Update Display Name</h1>
                                <p>Current Display Name: {user?.displayName ? user?.displayName : 'N/A'}</p>
                                <StyledTextField
                                    type="text"
                                    id="newDisplayName"
                                    value={newDisplayName}
                                    onChange={(event) => setNewDisplayName(event.target.value)}
                                    autoComplete='off'
                                    variant="standard"
                                    label="New Display Name"
                                />
                            </div>
                        )}
                        {method === "verification" && (
                            <div className={styles.formAccountContainer}>
                            <p>Current Email: {user?.email ? user?.email : 'N/A'}</p>
                            </div>
                        )}
                        {method !== "displayName" && method !== "verification" && method !== "password" && (
                            <div className={styles.formAccountContainer}>
                            <StyledTextField
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete='off'
                                variant="standard"
                                label="Password"
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {showPassword ? <VisibilityOffOutlined onClick={handleClickShowPassword} /> : <VisibilityOutlined onClick={handleClickShowPassword} />}
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                            </div>
                        )}
                        <div className={styles.formAccountContainer}>
                        {
                            errors.password && (<p className={styles.textError} aria-live="polite">{errors.password}</p>)
                        }
                        {
                            authError && (<p className={styles.textError} aria-live="polite">{authError}</p>)
                        }
                        {
                            method === "password" ?
                                <Button className={styles.button} disabled={!isButtonEnabled()} type="submit">
                                    Send
                                </Button>
                                :
                                <Button className={styles.button} disabled={!isButtonEnabled()} type="submit">
                                    {method === "verification" ? "Resend" : "Submit"}
                                </Button>
                        }

                        {
                            (method === "displayName" && user?.displayName) && (
                                <Button className={styles.button} type="button" onClick={handleRemoveDisplayName}>
                                    Remove Display Name
                                </Button>
                            )
                        }
                        <Button className={styles.button} onClick={handleClose} type="reset">
                            Cancel
                        </Button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
}
export default AccountModal;