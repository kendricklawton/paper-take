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
<<<<<<< HEAD

    const { authError, user, resetPassword, setAuthError, updateUserDisplayName, updateUserEmail, 
        // updateUserPassword,
        deleteUserAccount } = useAuthContext();
=======
    const { authError, user, deleteUserAccount, sendUserVerification, updateUserDisplayName, updateUserEmail, updateUserPassword } = useAuthContext();
>>>>>>> origin/main

    const [deleteAccount, setDeleteAccount] = useState('');
    const [newDisplayName, setNewDisplayName] = useState('');
    const [email, setEmail] = useState('');
    // const [confirmNewEmail, setConfirmNewEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
<<<<<<< HEAD
    // const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errors, setErrors] = useState({ displayName: '', email: '', password: '', newPassword: '' });


    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

=======
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '', newPassword: '' });

    const handleClickShowPassword = () => {
        setShowPassword(prev => !prev);
    };

>>>>>>> origin/main
    const handleClose = () => {
        setDeleteAccount('');
        setNewDisplayName('');
        setEmail('');
        // setConfirmNewEmail('');
        // setNewPassword('');
        setPassword('');
        // setConfirmNewPassword('');
        setShowPassword(false);
        setErrors({ displayName: '', email: '', password: '', newPassword: '' });
        setAuthError(null);
        onClose();
    }

    const handleRemoveDisplayName = () => {
        updateUserDisplayName('');
        handleClose();
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({ displayName: '', email: '', password: '', newPassword: '' });

        let authAction = false;

        try {
            if (method === "email") {
                if (email === user?.email) {
                    setErrors({ ...errors, email: 'Email is the same as current email' });
                    return;
                }
                authAction = await updateUserEmail(email, password);
                if (authAction) {
                    alert('Please verify your new email address');
                    handleClose();
                }
            } else if (method === "password") {
                // if (newPassword.length < 6) {
                //     setErrors({ ...errors, newPassword: 'Password must be at least 6 characters' });
                //     return;
                // }
                // if (newPassword !== confirmNewPassword) {
                //     setErrors({ ...errors, newPassword: 'Passwords do not match' });
                //     return;
                // }
                if (user?.email) {
                    authAction = await resetPassword(user?.email);
                    if (authAction) {
                        alert('Password updated successfully');
                        handleClose();
                    }
                } else {
                    setAuthError('User email is null');
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
                if (newDisplayName === user?.displayName) {
                    setErrors({ ...errors, displayName: 'Display name is the same as current display name' });
                    return;
                }
<<<<<<< HEAD
                if (newDisplayName.length < 1) {
                    setErrors({ ...errors, displayName: 'Display name must be at least 1 character' });
                    return;
                }
                authAction = await updateUserDisplayName(newDisplayName);
                if (authAction) {
                    handleClose();
                }
=======
                await updateUserDisplayName(displayName);
                handleClose();
            } else if (method === "verification") {
                await sendUserVerification();
                handleClose();
                alert('Verification email sent');
>>>>>>> origin/main
            }
        } catch (error) {
            handleClose();
            alert('An error occurred: ' + error);
        }
    };

    const isButtonEnabled = () => {
        if (method === "email") {
<<<<<<< HEAD
            return email.trim() !== '' && password.trim() !== '' && password.length > 6;
        } else if (method === "password") {
            return user?.email === email;
            // return newPassword.trim() !== '' && newPassword.length > 6 && confirmNewPassword.trim() !== '' && confirmNewPassword.length > 6 && password.trim() !== '' && password.length > 6;
        } else if (method === "delete") {
            return password.length > 6 && deleteAccount === "delete-my-account" && password.trim() !== '' && password.length > 6;;
        } else if (method === "displayName") {
            return newDisplayName.trim() !== '' && newDisplayName.length > 1;
=======
            return email.length > 0 && confirmNewEmail.length;
        } else if (method === "password") {
            return password.length > 0 && confirmNewPassword.length;
        } else if (method === "delete") {
            return password.length > 0 && deleteAccount === "delete-my-account"
        } else if (method === "displayName") {
            return displayName.length > 0;
>>>>>>> origin/main
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
                            <>
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
                            </>
                        )}
                        {method === "password" && (
                            <>
                                <h1>Update Password</h1>
                                <p>Password reset link will be sent to {user?.email}</p>
                                <p>Please enter your email to continue</p>
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
                            </>
                        )}
                        {method === "delete" && (
                            <>
                                <h1>Delete Account</h1>
                                <p>We will promptly remove your account and all related information. </p>
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
                            </>
                        )}
                        {method === "displayName" && (
                            <>
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
                                    sx={{ width: '100%' }}
                                />
                            </>
                        )}
                        {method === "verification" && (
<<<<<<< HEAD
                            <p>Current Email: {user?.email ? user?.email : 'N/A'}</p>
                        )}
                        {method !== "displayName" && method !== "verification" && method !== "password" && (
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
                        )}
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
=======
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
>>>>>>> origin/main
                            Cancel
                        </Button>
                    </form>
                </div>
            </div>
        )
    );
}
export default AccountModal;