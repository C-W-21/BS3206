import { useState } from 'react';
import { TextField, Button } from "@mui/material";

const LicensePlateInput = ({ onSubmit }) => {
  const [licensePlate, setLicensePlateValue] = useState('');

  const handleChange = (e) => {
    setLicensePlateValue(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(licensePlate);
    setLicensePlateValue('');
  };

  return (
    <div>
      <TextField
        type="text"
        value={licensePlate}
        onChange={handleChange}
        label="License Plate"
      />
      <Button onClick={handleSubmit}>Submit New Vehicle</Button>
    </div>
  );
};

export default LicensePlateInput;