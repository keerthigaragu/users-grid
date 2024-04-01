import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { IconButton, Table, TableBody, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import DeleteIcon from '@mui/icons-material/Delete';
import './table-styles.css';
import InlineEdit from '../InlineEdit';
import { User } from '../types';

const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: 'black',
      color: 'white',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
}));
  
const StyledTableRow = styled(TableRow)(() => ({
    '&:nth-of-type(odd)': {
      backgroundColor: '#eee',
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
    '&:hover': {
        backgroundColor: '#ddd'
    }
}));
  
function createData(
    name: string,
    hobby: string,
    createdAt: string,
    location: string,
    isEditMode: boolean,
    id: number
) {
    return { name, hobby, createdAt, location, isEditMode, id };
}

const UsersTable = () => {
    const [, setValue] = useState<string>();
    const [rows, setRows] = useState([]);

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
            const rowData = result.map((obj: User) => createData(obj.name, obj.hobby, obj.createdAt, obj.location, false, obj.id))
            setRows(rowData);
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
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                    <TableRow>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell align="right">Hobby</StyledTableCell>
                        <StyledTableCell align="right">Created On</StyledTableCell>
                        <StyledTableCell align="right">Location</StyledTableCell>
                        <StyledTableCell align="right">Action</StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row: User) => {
                        const count = rows.filter((obj: User) => obj.location === row.location).length;
                        return (
                            <StyledTableRow key={row.name}>
                                <StyledTableCell component="th" scope="row">
                                    {row.name}
                                </StyledTableCell>
                                <StyledTableCell align="right">{row.hobby}</StyledTableCell>
                                <StyledTableCell align="right">{formatDate(row.createdAt)}</StyledTableCell>
                                <StyledTableCell align="right"><InlineEdit value={row.location} setValue={setValue} user={row} count={count} allUsers={rows}/></StyledTableCell>
                                <StyledTableCell align="right"><IconButton onClick={() => handleDeleteUser(row.id)}><DeleteIcon /></IconButton></StyledTableCell>
                            </StyledTableRow>
                        )})}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default UsersTable;