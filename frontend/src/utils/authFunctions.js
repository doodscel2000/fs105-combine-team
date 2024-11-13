//
const apiUrl = process.env.REACT_APP_API_URL;

export const handleEmailSignUp = async (user, name, address, phone, setSuccess) => {
  try {
    const response = await fetch(`${apiUrl}/users/createUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,  // Use Firebase email
        name,         // Use form-provided name
        phone,       // Use form-provided phone number
        address,
        firebaseId: user.uid, // Use Firebase UID
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('User created successfully in MongoDB:', data);
      setSuccess(true); // Set success to true if user created
    } else {
      console.error('Error creating user in MongoDB:', data.message);
    }
  } catch (error) {
    console.error('Error during MongoDB user creation:', error.message);
  }
};

