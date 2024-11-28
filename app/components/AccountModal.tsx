'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../page.module.css';
import { useAuthContext } from '../providers/AuthProvider';
import { useAppContext } from '../providers/AppProvider';
import {
    InputAdornment
} from '@mui/material';

import {
    VisibilityOffOutlined, VisibilityOutlined
} from '@mui/icons-material';

import { StyledButton, FormTextField } from './Styled';

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    method: string;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, method }) => {
    const Router = useRouter();

    const { authError, user, sendPasswordReset, updateUserDisplayName, updateUserEmail,
        deleteUserAccount, sendUserVerification } = useAuthContext();

    const { setInfo } = useAppContext();

    const [deleteAccount, setDeleteAccount] = useState('');
    const [newDisplayName, setNewDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ displayName: '', email: '', password: '' });

    const handleClickShowPassword = () => {
        setShowPassword(prev => !prev);
    };

    const clearValues = () => {
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
            switch (method) {
                case "email":
                    if (email === user?.email) {
                        setErrors({ ...errors, email: 'Email is the same as current email' });
                        return;
                    }
                    await updateUserEmail(email, password);
                    clearValues();
                    setInfo('Please verify your new email address');
                    break;

                case "password":
                    if (user?.email) {
                        await sendPasswordReset(user?.email);
                        clearValues();
                        setInfo('Password reset link sent to your email');
                    }
                    break;

                case "delete":
                    await deleteUserAccount(password);
                    clearValues();
                    Router.push('/');
                    setInfo('Account deleted successfully');
                    break;

                case "displayName":
                    if (newDisplayName === user?.displayName) {
                        setErrors({ ...errors, displayName: 'Display name is the same as current display name' });
                        return;
                    }
                    await updateUserDisplayName(newDisplayName);
                    clearValues();
                    setInfo('Display name updated successfully');
                    break;

                case "verification":
                    if (email !== user?.email) {
                        setErrors({ ...errors, email: 'Email is not the same as current email' });
                        return;
                    }
                    await sendUserVerification();
                    clearValues();
                    setInfo('Please verify your new email address');
                    break;

                default:
                    console.error('Unknown method:', method);
            }
        } catch (error) {
            console.log(error);
            setInfo('An error occurred: ' + error);
        }
    };

    const isButtonEnabled = () => {
        if (method === "email") {
            return email.trim() !== '' && password.trim() !== '';
        } else if (method === "password") {
            return user?.email === email;
        } else if (method === "delete") {
            return deleteAccount === "delete-my-account" && password.trim() !== '';
        } else if (method === "displayName") {
            return newDisplayName.trim() !== '' && newDisplayName.length > 1;
        } else if (method === "verification") {
            return email.trim() !== ''
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
                            user?.email && (
                                <p>{user.email}</p>
                            )
                        }
                        <p>To continue, type your new email and your password below</p>
                    </React.Fragment>
                );
            case "password":
                return (
                    <React.Fragment>
                        <h1>Reset password</h1>
                        <p>Password reset link will be sent to {user?.email}</p>
                        <p>To continue, type your email below</p>
                    </React.Fragment>
                );
            case "delete":
                return (
                    <React.Fragment>
                        <h1>Delete account</h1>
                        <p>We will delete your account and all data associated with the email &apos;{user?.email}&apos;</p>
                        <p>To continue, type &apos;delete-my-account&apos; and your password below</p>
                    </React.Fragment>
                );
            case "displayName":
                return (
                    <React.Fragment>
                        <h1>Update display name</h1>
                        {user?.displayName && (<p>{user.displayName}</p>)}
                        <p>To continue, type your new display name below</p>
                    </React.Fragment>
                );
            case "verification":
                return (
                    <React.Fragment>
                        <h1>Email verification</h1>
                        <p>Email verification link will be sent to &apos;{user?.email}&apos;</p>
                        <p>To continue, type your email below</p>
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
                <div className={styles.wrapperAccount}>
                    {FormHeader(method)}
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
                                label="New email"
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
                                label="New display name"
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
                            {errors.email && (<p className={styles.textError} aria-live="polite">{errors.email}</p>)}
                            {errors.password && (<p className={styles.textError} aria-live="polite">{errors.password}</p>)}
                            {authError && (<p className={styles.textError} aria-live="polite">{authError}</p>)}
                            {
                                method === "password" ?
                                    <StyledButton className={styles.button} disabled={!isButtonEnabled()} type="submit">
                                        Send
                                    </StyledButton>
                                    :
                                    <StyledButton className={styles.button} disabled={!isButtonEnabled()} type="submit">
                                        {method === "verification" ? "Resend" : "Submit"}
                                    </StyledButton>
                            }
                            {
                                (method === "displayName" && user?.displayName) && (
                                    <StyledButton className={styles.button} type="button" onClick={handleRemoveDisplayName}>
                                        Remove Display Name
                                    </StyledButton>
                                )
                            }
                            <StyledButton className={styles.button} onClick={clearValues} type="reset">
                                Cancel
                            </StyledButton>
                        </React.Fragment>
                    </form>
                </div>
            </div>
        )
    );
}
export default AccountModal;