'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import styles from "../page.module.css";
import { useAuthContext } from '../providers/AuthProvider';
import {
    //  IconButton, 
    InputAdornment
 } from '@mui/material';
import { 
    // Close, 
    VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { FormButton, FormTextField } from './Styled';

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    method: string;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, method }) => {
    const Router = useRouter();

    const { authError, user, userDisplayName, userEmail, clearAuthError, sendPasswordReset, updateUserDisplayName, updateUserEmail,
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

    // const handleCloseButton = (event: React.FormEvent<HTMLButtonElement>) => {
    //     event.preventDefault();
    //     clearValues();
    // };

    const clearValues = () => {
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
        clearValues();
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

                clearValues();
                alert('Please verify your new email address');
            } else if (method === "password") {
                if (user?.email) {
                    await sendPasswordReset(user?.email);
                    clearValues();
                    alert('Password reset link sent to your email');
                }
            } else if (method === "delete") {
                await deleteUserAccount(password);
                clearValues();
                Router.push('/');
                alert('Account deleted successfully');
            } else if (method === "displayName") {
                if (newDisplayName === user?.displayName) {
                    setErrors({ ...errors, displayName: 'Display name is the same as current display name' });
                    return;
                }
                await updateUserDisplayName(newDisplayName);
                clearValues();
            }
        } catch (error) {
            clearValues();
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

    const FormHeader: React.FC = (method) => {
        switch (method) {
            case "email":
                return (
                    <React.Fragment>
                        <h1>Update email</h1>
                       {
                        userEmail && (
                            <p>{userEmail}</p>
                        )
                       } 
                    </React.Fragment>
                );
            case "password":
                return (
                    <React.Fragment>
                        <h1>Reset password</h1>
                        <p>Password reset link will be sent to {userEmail}</p>
                        <p>Type your email below to continue</p>
                        {/* <p>Password reset link will be sent to the following email &apos;{userEmail}&apos;. To verify, type your email below.</p> */}
                    </React.Fragment>
                );
            case "delete":
                return (
                    <React.Fragment>
                        <h1>Delete account</h1>
                        <p>We will delete your account associated with the email &apos;{userEmail}&apos;</p>
                        <p>Type &apos;delete-my-account&apos; and enter your password below to continue</p>
                    </React.Fragment>
                );
            case "displayName":
                return (
                    <React.Fragment>
                        <h1>Update display name</h1>
                        { userDisplayName && ( <p>{userDisplayName}</p> )
                    }
                    </React.Fragment>
                );
            case "verification":
                return (
                    <React.Fragment>
                        <h1>Email verification</h1>
                        <p>Email verification link will be sent to the following email &apos;{userEmail}&apos;. To verify, type your email below.</p>
                    </React.Fragment>
                );
            default:
                return null;
        }
    };

    console.log(method);
    return (
        isOpen && (
            <div className={styles.modal}>
                {/* <div className={styles.closeButtonContainer}>
                    <IconButton onClick={handleCloseButton} sx={{ color: 'gray' }}>
                        <Close />
                    </IconButton>
                </div> */}
                <div className={styles.wrapperAccount}>
                    {
                        FormHeader(method)
                    }
                    <form className={styles.form} onSubmit={handleSubmit}>
                        {method === "verification" && (
                            <FormTextField
                                type="email"
                                id="verification"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                variant="standard"
                                label="Email"
                                autoComplete='off'
                            />
                        )}
                        {method === "email" && (
                            <FormTextField
                                type="email"
                                id={method}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                variant="standard"
                                label="Email"
                                autoComplete='off'
                            />
                        )}
                        {method === "password" && (
                            <FormTextField
                                type='email'
                                id={method}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                variant="standard"
                                label="Email"
                                autoComplete='off'
                            />
                        )}
                        {method === "delete" && (
                            <FormTextField
                                type="text"
                                id={method}
                                value={deleteAccount}
                                onChange={(event) => setDeleteAccount(event.target.value)}
                                label="delete-my-account"
                         
                                autoComplete='off'
                                variant="standard"
                            />
                        )}
                        {method === "displayName" && (
                            <FormTextField
                                type="text"
                                id={method}
                                value={newDisplayName}
                                onChange={(event) => setNewDisplayName(event.target.value)}
                                autoComplete='off'
                                variant="standard"
                                label="Display name"
                            />
                        )}
                        {method !== "displayName" && method !== "verification" && method !== "password" && (
                            <FormTextField
                                type={showPassword ? 'text' : 'password'}
                                id="formPassword"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete='off'
                                variant="standard"
                                label="Password"
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {showPassword ? <VisibilityOffOutlined onClick={handleClickShowPassword} sx={{ color: 'gray' }} /> : <VisibilityOutlined onClick={handleClickShowPassword} sx={{ color: 'gray' }} />}
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        )}
                        <React.Fragment>
                            { errors.email && (<p className={styles.textError} aria-live="polite">{errors.email}</p>) }
                            { errors.password && (<p className={styles.textError} aria-live="polite">{errors.password}</p>) }
                            { authError && (<p className={styles.textError} aria-live="polite">{authError}</p>)}
                            {
                                method === "password" ?
                                    <FormButton className={styles.button} disabled={!isButtonEnabled()} type="submit">
                                        Send
                                    </FormButton>
                                    :
                                    <FormButton className={styles.button} disabled={!isButtonEnabled()} type="submit">
                                        {method === "verification" ? "Resend" : "Submit"}
                                    </FormButton>
                            }
                            {
                                ( method === "displayName" && user?.displayName ) && (
                                    <FormButton className={styles.button} type="button" onClick={handleRemoveDisplayName}>
                                        Remove Display Name
                                    </FormButton>
                                )
                            }
                            <FormButton className={styles.button} onClick={clearValues} type="reset">
                                Cancel
                            </FormButton>
                        </React.Fragment>
                    </form>
                </div>
            </div>
        )
    );
}
export default AccountModal;
