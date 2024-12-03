import React from 'react'

const Input = ({type, title, form, setForm}) => {
  // Map the title to the actual form field name
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  }

  // Create a mapping for form fields
  const titleToFieldMap = {
    "Ad Soyad": "username", // Map "Ad Soyad" to "username"
    "email": "email",
    "şifrə": "password",
    "təkrar şifrə": "rePassword"
  };

  // Use the mapped name in the form field
  const fieldName = titleToFieldMap[title] || title;  // Default to the title if no mapping is found

  return (
    <div className='flex flex-col gap-2'>
      <label className='text-sm capitalize'>{title}</label>
      <input 
        className='text-center border-b border-black outline-none dark:text-darkText dark:bg-darkBg dark:border-darkText p-1' 
        type={type} 
        name={fieldName} // Use the mapped field name here
        value={form[fieldName]} // Bind the value to the form state using the mapped field name
        onChange={handleChange}
      />
    </div>
  );
}

export default Input;
