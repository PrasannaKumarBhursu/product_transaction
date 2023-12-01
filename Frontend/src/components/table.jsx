import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

export default function DynamicTable() {
    const [rowData, setRowData] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('March');


    useEffect(() => {
        // Fetch data from the URL
        const month =
            fetch(`http://localhost:3004/products`)
                .then((response) => response.json())
                .then((data) => {
                    // Update row data with fetched data
                    setRowData(data);
                    console.log(data[0]);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
    }, []);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];


    const filteredData = rowData.filter((row) => {
        const matchesSearch = (
            row.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            row.description.toLowerCase().includes(searchValue.toLowerCase()) ||
            row.price.toString().toLowerCase().includes(searchValue.toLowerCase())
        );


        const rowDate = new Date(row.dateOfSale);
        const rowMonth = rowDate.getMonth() + 1; // +1 because getMonth() returns a zero-based index
        const month = months.indexOf(selectedMonth) + 1;
        const matchesMonth = rowMonth === month;


        return matchesSearch && matchesMonth;
    });

 

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };




    return (
        <div>

            <TextField
                label="Search"
                variant="outlined"
                value={searchValue}
                onChange={handleSearchChange}
                mr={2}
            />

            <TextField
                select
                label="Month"
                variant="outlined"

                value={selectedMonth}
                onChange={handleMonthChange}
            >
                {months.map((month, index) => (
                    <MenuItem key={index} value={month}>
                        {month}
                    </MenuItem>
                ))}
            </TextField>



            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="dynamic table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Sold</TableCell>
                            <TableCell>Image</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                    {row.id}
                                </TableCell>
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{row.description}</TableCell>
                                <TableCell>{row.price}</TableCell>
                                <TableCell>{row.category}</TableCell>
                                <TableCell>{row.sold ? 'Yes' : 'No'}</TableCell>
                                <TableCell>
                                    <img src={row.image} alt={row.title} style={{ width: '50px', height: '50px' }} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>

        </div>
    );
}


