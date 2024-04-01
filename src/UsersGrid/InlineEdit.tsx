import React, { useState } from "react";
import { User } from './types';

const locationOptions: {label: string; value: string}[] = [
  {label: 'ABU DHABI', value: 'abu-dhabi'},
  {label: 'AMSTERDAM', value: 'amsterdam'},
  {label: 'AUSTIN', value: 'austin'}, 
  {label: 'BARCELONA', value: 'barcelona'},
  {label: 'BENGALURU', value: 'bengaluru'},
  {label: 'BRASÍLIA', value: 'brasilia'},
  {label: 'BRUSSELS', value: 'brussels'},
  {label: 'BUENOS AIRES', value: 'buenos-aires'}
];

type Props = {
    allUsers: User[];
    value: string;
    setValue: (value: string) => void;
    user: User;
    count: number;
}

const InlineEdit = ({ value, setValue, user, count, allUsers}: Props) => {
  const [editingValue, setEditingValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEditingValue(event.target.value);
    const updatedUser = {
      ...user,
      location: event.target.value
    };
    fetch(`https://660160fd87c91a11641ab523.mockapi.io/users`, {
            method: 'PUT',
            headers: {'content-type':'application/json'},
            body: JSON.stringify(updatedUser)
        }).then((res) => {
          console.log("Updating location",res);
        }).catch((err) => console.log("Error updating", err));
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => setIsEditing(true);
  
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "Escape") {
      (event.target as HTMLInputElement).blur();
    }
  }
  
  const onBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.trim() === "") {
      setEditingValue(value);
    } else {
      setValue(event.target.value)
    }
  }

  return (
    !isEditing ?
      <input
        type="text"
        aria-label="Field name"
        value={`${editingValue} (${count})`}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      /> :
      <select value={editingValue} onChange={handleChange} id="location-select">
        {locationOptions.map((option) => {
          const locationCount = allUsers.filter((obj) => obj.location === option.label).length;
          return <option value={option.label}>{`${option.label} (${locationCount})`}</option>
        }
      )}

    </select>
  );
};

export default InlineEdit;