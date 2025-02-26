import React, { useState } from 'react';
import { StyledTableCell, StyledTableRow } from './styles';
import { Table, TableBody, TableContainer, TableHead, TablePagination, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const TableWithActions = ({ columns, rows, onEdit, onDelete }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    return (
        <>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    {/* Table Header */}
                    <TableHead>
                        <StyledTableRow>
                            {columns.map((column, index) => (
                                <StyledTableCell
                                    key={index}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </StyledTableCell>
                            ))}
                            {/* Actions Column Header */}
                            <StyledTableCell align="center">Actions</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>

                    {/* Table Body */}
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        {columns.map((column, index) => {
                                            const value = row[column.id];
                                            return (
                                                <StyledTableCell key={index} align={column.align}>
                                                    {column.format && typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                </StyledTableCell>
                                            );
                                        })}
                                        {/* Actions Column */}
                                        <StyledTableCell align="center">
                                            <IconButton color="primary" onClick={() => onEdit(row.rollNum)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => onDelete(row.rollNum)}>
                                                <Delete />
                                            </IconButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 5));
                    setPage(0);
                }}
            />
        </>
    );
};

export default TableWithActions;
