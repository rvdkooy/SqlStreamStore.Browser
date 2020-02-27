import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

interface Stream {
    messageId: string;
    createdUtc: string;
    streamVersion: string;
    streamId: string;
    type: string;
    position: number
}

const Streams = () => {
    const [streams, updateStreams] = useState<Array<Stream>>([]);
    useEffect(() => {
        async function retrieveStreams() {
            const resp = await fetch('/api/streams');
            const streams = await resp.json();
            console.log(streams);
            updateStreams(streams);
        }
        retrieveStreams();
    }, []);

    return (
        <div>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Created UTC</TableCell>
                            <TableCell>Stream ID</TableCell>
                            <TableCell>Message ID</TableCell>
                            <TableCell>Version</TableCell>
                            <TableCell>Position</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {streams.map(s => (
                            <TableRow key={s.messageId}>
                                <TableCell component="th" scope="row">
                                    {s.createdUtc}
                                </TableCell>
                                <TableCell>{s.streamId}</TableCell>
                                <TableCell>{s.messageId}</TableCell>
                                <TableCell>{s.streamVersion}</TableCell>
                                <TableCell>{s.position}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Streams;
