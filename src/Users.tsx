import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import InlineEdit from './InlineEdit';
import { User } from './types';

const Users = () => {
    const [usersData, setUsersData] = useState([]);
    const [, setValue] = useState<string>();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('https://660160fd87c91a11641ab523.mockapi.io/users');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setUsersData(result);
        } catch (error: any) {
            console.error('Error fetching data:', error.message);
            alert(error.message);
        }
      };

    const handleDeleteUser = (id: number) => {
        fetch(`https://660160fd87c91a11641ab523.mockapi.io/users/${id}`, {
            method: 'DELETE',
        }).then((response: any) => {
                if(response.ok) {
                    fetchData();
                } else {
                    alert("User already deleted");
                }
            }).catch((error: any) => {
                alert(error);
            })
      };
    
    const formatDate = (date: string) => date.split('T')[0].split('-').reverse().join('-');

    return (
        <div>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Hobby</th>
                        <th>Created On</th>
                        <th>Location</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {usersData.map((user: User, key: number)=>{
                        const count = usersData.filter((obj: User) => obj.location === user.location).length;
                        return (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.hobby}</td>
                                <td>{formatDate(user.createdAt)}</td>
                                <td><InlineEdit value={user.location} setValue={setValue} user={user} count={count} allUsers={usersData}/></td>
                                <td><Button onClick={() => handleDeleteUser(user.id)}><DeleteIcon /></Button></td>
                            </tr>
                        );})
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Users;