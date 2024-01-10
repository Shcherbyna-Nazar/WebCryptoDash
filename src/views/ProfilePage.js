import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Box,
    Button,
    Container,
    Grid,
    Paper,
    TextField,
    Typography,
    CircularProgress,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    Card,
    CardContent

} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import {jwtDecode} from "jwt-decode";
import CustomAppBar from "./CryptoAppBar";
import {useAuth} from "../AuthContext";
import defaultProfilePhoto from '../images/bitok.png';

const darkBlueTheme = {
    primary: '#ffffff',
    secondary: '#e0e6ed',
    text: '#ffffff',
    tableBackground: '#1e2740',
    buttonBackground: '#6277a8',
    appBarBackground: '#0B1629',
    containerBackground: 'rgba(26, 32, 53, 0.8)',
    textShadow: '0px 0px 8px rgba(0, 0, 0, 0.7)',
    positiveSentiment: '#4CAF50',
    negativeSentiment: '#F44336',
    textColor: '#71FCFD'
};

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function getUserEmailFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.sub;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

function ProfilePage() {
    const userEmail = getUserEmailFromToken();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newBio, setNewBio] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const {isAuthenticated, handleLogout} = useAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userEmail) return;
            try {
                const response = await fetch(`https://cryptodashweb.azurewebsites.net/api/v1/user/${userEmail}`);
                const data = await response.json();
                setUser(data);
                setFirstName(data.firstName || '');  // Установка начального значения как пустая строка, если данных нет
                setLastName(data.lastName || '');    // То же самое для фамилии
                setNewBio(data.bio || '');           // И для биографии
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };
        fetchUserData();
    }, [userEmail]);


    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAvatarClick = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const handleEditToggle = () => {
        if (editMode) {
            handleUpdateProfile();
        }
        setEditMode(!editMode);
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpdateProfile = async () => {
        let shouldUpdateState = false;
        const updates = {};
        updates.firstName = firstName?.trim() !== '' ? firstName.trim() : user?.firstName;
        updates.lastName = lastName?.trim() !== '' ? lastName.trim() : user?.lastName;
        updates.bio = newBio?.trim() !== '' ? newBio.trim() : user?.bio;


        // Обработка загрузки фотографии
        if (selectedFile) {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const response = await fetch(`https://cryptodashweb.azurewebsites.net/api/v1/user/${userEmail}/uploadPhoto`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(prevUser => ({...prevUser, profilePhotoUrl: data.photoUrl}));
                    setOpenSnackbar({children: 'Photo uploaded successfully!', severity: 'success'});
                    shouldUpdateState = true;
                } else {
                    setOpenSnackbar({children: 'Failed to upload photo.', severity: 'error'});
                }
            } catch (error) {
                setOpenSnackbar({children: 'Error uploading photo.', severity: 'error'});
            } finally {
                setUploading(false);
            }
        }
        if (updates.firstName !== user?.firstName || updates.lastName !== user?.lastName || updates.bio !== user?.bio || selectedFile) {
            shouldUpdateState = true;
        }

        // Если есть что обновить, отправляем запрос
        if (shouldUpdateState) {
            try {
                const response = await fetch(`https://cryptodashweb.azurewebsites.net/api/v1/user/${userEmail}/updateProfile`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(updates),
                });

                if (response.ok) {
                    setOpenSnackbar({children: 'Profile updated successfully!', severity: 'success'});
                    setUser(prevUser => ({...prevUser, ...updates}));
                } else {
                    setOpenSnackbar({children: 'Failed to update profile.', severity: 'error'});
                }
            } catch (error) {
                setOpenSnackbar({children: 'Error updating profile.', severity: 'error'});
            }
        } else {
            // Если нет изменений, информируем пользователя
            setOpenSnackbar({children: 'No changes to update', severity: 'info'});
        }
    };


    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <>
            <CustomAppBar isAuthenticated={isAuthenticated} handleLogout={handleLogout}/>
            <Container component={Paper} sx={{
                mt: 8,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: darkBlueTheme.containerBackground
            }}>
                <Card sx={{mb: 2, width: '100%', bgcolor: darkBlueTheme.tableBackground}}>
                    <CardContent>
                        {editMode ? (
                            <>
                                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Avatar
                                        src={selectedFile ? URL.createObjectURL(selectedFile) : (user.profilePhotoUrl || defaultProfilePhoto)}
                                        sx={{width: 150, height: 150, mb: 2}} alt='Profile Picture'/>
                                    <Button variant='contained' component='label'
                                            sx={{mb: 2, bgcolor: darkBlueTheme.buttonBackground}}>Change Photo<input
                                        type='file' hidden onChange={handleFileChange} id='fileInput'/></Button>
                                    {uploading && <CircularProgress/>}
                                    <TextField
                                        label='First Name'
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        variant='outlined'
                                        fullWidth
                                        sx={{
                                            mb: 2,
                                            input: {color: '#ffffff'},
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {borderColor: '#ffffff'}, // цвет рамки по умолчанию
                                                '&:hover fieldset': {borderColor: '#71FCFD'}, // цвет рамки при наведении
                                                '&.Mui-focused fieldset': {borderColor: '#6277a8'}, // цвет рамки при фокусе
                                            },
                                            '& .MuiInputLabel-root': { // цвет подсказки
                                                color: darkBlueTheme.textColor, // голубой цвет текста
                                            },
                                            '& .Mui-focused .MuiInputLabel-root': { // цвет подсказки при фокусе
                                                color: darkBlueTheme.textColor, // голубой цвет текста
                                            }
                                        }}
                                    />
                                    <TextField
                                        label='Last Name'
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        variant='outlined'
                                        fullWidth
                                        sx={{
                                            mb: 2,
                                            input: {color: '#ffffff'},
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {borderColor: '#ffffff'}, // цвет рамки по умолчанию
                                                '&:hover fieldset': {borderColor: '#71FCFD'}, // цвет рамки при наведении
                                                '&.Mui-focused fieldset': {borderColor: '#6277a8'}, // цвет рамки при фокусе
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: darkBlueTheme.textColor,
                                            },
                                            '& .Mui-focused .MuiInputLabel-root': {
                                                color: darkBlueTheme.textColor
                                            }
                                        }}
                                    />
                                    <TextField
                                        label='Bio'
                                        value={newBio}
                                        onChange={(e) => setNewBio(e.target.value)}
                                        variant='outlined'
                                        fullWidth
                                        sx={{
                                            mb: 2,
                                            input: {color: '#ffffff'},
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {borderColor: '#ffffff'}, // цвет рамки по умолчанию
                                                '&:hover fieldset': {borderColor: '#71FCFD'}, // цвет рамки при наведении
                                                '&.Mui-focused fieldset': {borderColor: '#6277a8'}, // цвет рамки при фокусе
                                            },
                                            '& .MuiInputLabel-root': { // цвет подсказки
                                                color: darkBlueTheme.textColor, // голубой цвет текста
                                            },
                                            '& .Mui-focused .MuiInputLabel-root': { // цвет подсказки при фокусе
                                                color: darkBlueTheme.textColor, // голубой цвет текста
                                            }
                                        }}
                                    />
                                </Box>
                            </>
                        ) : (
                            <Box sx={{textAlign: 'center'}}>
                                <Avatar src={user.profilePhotoUrl || defaultProfilePhoto}
                                        sx={{width: 150, height: 150, mb: 2, mx: 'auto'}} alt='Profile Picture'
                                        onClick={handleAvatarClick}/>
                                <Typography variant='h4' gutterBottom
                                            sx={{color: darkBlueTheme.primary}}>{`${user.firstName} ${user.lastName}`}</Typography>
                                <Typography variant='body1' sx={{
                                    mb: 1,
                                    color: darkBlueTheme.secondary
                                }}>Email: {user.email}</Typography>
                                <Typography variant='body1' sx={{
                                    mb: 2,
                                    color: darkBlueTheme.text
                                }}>{user.bio || 'No bio available.'}</Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
                <Grid container justifyContent='center'>
                    <Button variant='contained' sx={{mt: 2, bgcolor: darkBlueTheme.buttonBackground}}
                            onClick={handleEditToggle}>{editMode ? 'Save Changes' : 'Edit Profile'}</Button>
                </Grid>
            </Container>
            <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Profile Avatar</DialogTitle>
                <DialogContent>
                    <img
                        src={user.profilePhotoUrl || defaultProfilePhoto}
                        alt="Profile"
                        style={{width: '100%', height: 'auto'}}
                    />
                </DialogContent>
            </Dialog>
            <Snackbar open={!!openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={openSnackbar.severity}>
                    {openSnackbar.children}
                </Alert>
            </Snackbar>
        </>
    );


}

export default ProfilePage;
