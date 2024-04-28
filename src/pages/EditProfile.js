import React, {useState, useEffect, useRef} from 'react'
import { jwtDecode } from 'jwt-decode';
import {useNavigate} from 'react-router-dom'
import Header from '../components/Header';
import AutoSearchGoogle from '../components/AutoSearchGoogle';



const EditProfile = () => {
    const token = localStorage.getItem('token');
    let isTokenExpired = true;
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate();
    const [currentImage, setCurrentImage] = useState(null);
    const [displayVetFields, setDisplayVetFields] = useState(false);
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

    const handleCoordinatesChange = (newCoordinates) => {
        setCoordinates(newCoordinates);
        
    };

    const [fieldErrors, setFieldErrors] = useState({
        rcvs_email: [],
        reference_number: [],
        registration_date: [],
    });
    const handleUserNavigate = (authorId) => {
        navigate(`/profile/${authorId}`);
      };
      const handleAddressChange = (address) => {
        setProfile(prevProfile => ({
            ...prevProfile,
            vet_professional_info: {
                ...prevProfile.vet_professional_info,
                location: address // Assuming 'address' is the full address string provided by AutoSearchGoogle
            }
        }));
    };

    const handleCancel = () => {
        navigate('/profile'); // Adjust the path as needed for your application
    };
    let decodedToken = null;
    if (token) {
        decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds
        if (decodedToken.exp > currentTime) {
            isTokenExpired = false;
        }
    }
    
    const userid = decodedToken.user_id;
    
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        bio:'',
        vet_professional: false,
        date_of_birth: '',
        profile_image: '',
        vet_professional: false,
        vet_professional_info: { // New nested object for veterinary professional info
            reference_number: '',
            rcvs_email: '',
            registration_date:'',
            location:'',
            field_of_work:'',
        }
    });

    const initialVetInfoRef = useRef({
        reference_number: '',
        rcvs_email: '',
    });

      useEffect(() => {

        if (isTokenExpired) {
            // If the token is expired or not valid, navigate to login
            console.log('Token is expired or not valid.');
            navigate('/login');
            return; // Exit early to prevent further execution
        }

        const userid = decodedToken.user_id; // Use decoded token to get user_id
        const userProfileUrl = `http://127.0.0.1:8000/api/users/${userid}`;
        
    
        const fetchData = async () => {
            
            try {
                const response = await fetch(userProfileUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Include authorization headers as necessary
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    const vetInfo = data.vet_professional_info || { reference_number: '', rcvs_email: '', registration_date:'', location:'',field_of_work:'' };

                    // Store the initial veterinary professional info for comparison purposes
                    initialVetInfoRef.current = vetInfo;

                    setProfile(prevState => ({
                        ...prevState,
                        username: data.username || '',
                        email: data.email || '',
                        first_name: data.first_name || '',
                        last_name: data.last_name || '',
                        bio: data.bio || '',
                        vet_professional: data.vet_professional || false,
                        vet_professional_info: data.vet_professional_info || { reference_number: '', rcvs_email: '', registration_date:'', location:'',field_of_work:''},
                        date_of_birth: data.date_of_birth || '',
                        profile_image: data.profile_image || '',
                    }));
                    setCurrentImage(`http://127.0.0.1:8000${data.profile_image}`);
                    console.log(profile)
                    
                } else {
                    throw new Error('Failed to fetch user data');
                    
                }
            } catch (error) {
                
                //console.error(error.vet_professional_info.rcvs_email);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        
        let token = localStorage.getItem('token');
      
        const formData = new FormData(); // Use FormData for mixed data types including files
        if (profile.vet_professional) {
            const fieldsToCheck = ['reference_number', 'rcvs_email', 'location', 'registration_date', 'field_of_work'];
            let isChanged = fieldsToCheck.some(field => profile.vet_professional_info[field] !== initialVetInfoRef.current[field]);
        
            if (!profile.vet_professional_info.reference_number || !profile.vet_professional_info.rcvs_email) {
                alert("Please fill in both the reference number and RCVS email.");
                return; // Stop the form submission
            } else if (isChanged) {
                fieldsToCheck.forEach(field => {
                    formData.append(`vet_professional_info.${field}`, profile.vet_professional_info[field]);
                });
            }
        }


        // Append text inputs from the profile state
        formData.append('username', profile.username)
        formData.append('first_name', profile.first_name);
        formData.append('last_name', profile.last_name);
        formData.append('email', profile.email);
        formData.append('bio', profile.bio);
        
        

        //console.log(profile.profile_image)
        if (profile.profile_image instanceof File) {
            formData.append('profile_image', profile.profile_image);
        }
      
        try {
            const response = await fetch('http://127.0.0.1:8000/api/edit-profile/', {  
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            });
        
            // First, check if the response is not OK, including when it's a 401
            if (!response.ok) {
                const data = await response.json(); // Assuming you want to log or use the error response
                console.error('Error with the request:', data);
                const errorData = data instanceof Error ? data.message : data; // Check if error is an Error object or the API response
                setFieldErrors({
                    rcvs_email: errorData.vet_professional_info?.rcvs_email || [],
                    reference_number: errorData.vet_professional_info?.reference_number || [],
                    registration_date: errorData.vet_professional_info?.registration_date || [],

                });

                setErrorMessage(data)
                
                if (response.status === 401) {
                    navigate('/login');
                    return; 
                }
                
            } else {
                const data = await response.json();
                console.log(data)
                if (data.verification_code_sent) {
                    navigate('/verify-email')
                } else{
                    handleUserNavigate(userid)
                } 

            }
        } catch (error) {
            
            console.error('Error submitting the form:', error);
            // Handle fetch errors or other exceptions here
        }
    }

      const handleImageChange = (event) => {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
          // Update the profile state to include the new file for submission
          setProfile({ ...profile, profile_image: file });
      
          // Create a URL for the file to display it as a preview
          const previewUrl = URL.createObjectURL(file);
          setCurrentImage(previewUrl);
        }
      }; 

  return (
    <div>
        <Header/>
        <form className="edit-outer-form" style={{marginTop:'120px'}}onSubmit={handleSubmit} >

        <div className="profile-image-container">
            {currentImage && (
                <label htmlFor="profile-image-input">
                <img
                    className="profile-image"
                    src={currentImage}
                    alt="Profile"
                    style={{ width: '120px', height: '120px', cursor: 'pointer' }} // Added cursor:pointer to indicate it's clickable
                />
                </label>
            )}
            <input
                id="profile-image-input" 
                type="file"
                name="profile_image"
                onChange={handleImageChange}
                style={{ display: 'none' }} // Hide the actual input
            />

            <label>
                Veterinary Professional:
                <input
                    type="checkbox"
                    checked={profile.vet_professional || displayVetFields}
                    onChange={e => {
                        setProfile({ ...profile, vet_professional: e.target.checked });
                        setDisplayVetFields(e.target.checked);
                    }}
                />
            </label>


            <div  className={`edit-profile-form ${(profile.vet_professional || displayVetFields) ? 'two-columns' : ''}`}>

                <div className="textarea-container">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={profile.first_name}
                        onChange={e => setProfile({ ...profile, first_name: e.target.value })}
                        required
                    />
                    
                </div>

                <div className="textarea-container">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={profile.username}
                        onChange={e => setProfile({ ...profile, username: e.target.value })}
                    />
                    
                </div>


                <div className="textarea-container">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={profile.email}
                        onChange={e => setProfile({ ...profile, email: e.target.value })}
                        required
                    />
                    
                </div>

                <div className="textarea-container">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={profile.bio}
                        onChange={e => setProfile({ ...profile, bio: e.target.value })}
                        required
                    />
                    
                </div>

                {profile.vet_professional && (
                    <>
                        <div className="textarea-container">
                            <label htmlFor="reference_number">Reference Number</label>
                            <input
                                type='text'
                                id="reference_number"
                                name="reference_number"
                                value={profile.vet_professional_info.reference_number}
                                onChange={e => setProfile({
                                    ...profile,
                                    vet_professional_info: { ...profile.vet_professional_info, reference_number: e.target.value }
                                })}
                                required
                            />
                            {fieldErrors.reference_number.map((error, index) => (
                            <div key={index} className="error-message">{error}</div>
                        ))}
                            
                        </div>

                        <div className="textarea-container">
                            <label htmlFor="rcvs_email">RCVS Email</label>
                            <input
                                type="email"
                                id="rcvs_email"
                                name="rcvs_email"
                                value={profile.vet_professional_info.rcvs_email}
                                onChange={e => setProfile({
                                    ...profile,
                                    vet_professional_info: { ...profile.vet_professional_info, rcvs_email: e.target.value }
                                })}
                                required
                            />
                        
                        
                        {fieldErrors.rcvs_email.map((error, index) => (
                            <div key={index} className="error-message">{error}</div>
                        ))}
                            
                        </div>

                        <div className="textarea-container">
                            <label htmlFor="registration_date">Registration date</label>
                            <input
                                type="date"
                                id="registration_date"
                                name="registration_date"
                                value={profile.vet_professional_info.registration_date}
                                onChange={e => setProfile({
                                    ...profile,
                                    vet_professional_info: { ...profile.vet_professional_info, registration_date: e.target.value }
                                })}
                                required
                            />
                            {fieldErrors.registration_date.map((error, index) => (
                            <div key={index} className="error-message">{error}</div>
                        ))}
                            
                        </div>
                        <div className="textarea-container">
                            <label htmlFor="location">Location</label>
                        
                            <AutoSearchGoogle 
                                onAddressChange={handleAddressChange} 
                                onCoordinatesChange={handleCoordinatesChange}
                            />
                            
                        </div>
                        <div className="textarea-container">
                            <label htmlFor="field_of_work">Field of work</label>
                            <input
                                type="text"
                                id="field_of_work"
                                name="field_of_work"
                                value={profile.vet_professional_info.field_of_work}
                                onChange={e => setProfile({
                                    ...profile,
                                    vet_professional_info: { ...profile.vet_professional_info, field_of_work: e.target.value }
                                })}
                                required
                            />
                            
                        </div>

                    </>
                )}



            </div>
        </div>
                
        
        <div className="edit-complete-button">
            <button type="button" onClick={handleCancel} >
                Cancel
            </button>
            <button type="submit" >
                Submit
            </button>
        </div>
        
        </form>
    </div>
  )
}

export default EditProfile
