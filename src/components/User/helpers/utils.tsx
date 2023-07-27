export const validate = (formData: {email: string, password: string}) => {
    const {email, password} = formData;
    let errors = {
              email: "",
              password: ""
            };
            if (!email) {
                errors.email = 'Email is required.';
            } 
            else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
                errors.email = 'Invalid email address. E.g. example@email.com';
            }    
        
              if (!password) {
                errors.password = "Password is required.";
              }
        
              return errors;      
}

