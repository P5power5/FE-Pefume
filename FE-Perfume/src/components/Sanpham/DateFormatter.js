import React from 'react';
import { format, parseISO } from 'date-fns';

const DateFormatter = ({ isoDate }) => {
    if (!isoDate) {
        return <span>Invalid Date</span>;
    }

    try {
        const parsedDate = parseISO(isoDate);
        return <span>{format(parsedDate, 'dd-MM-yyyy')}</span>;
    } catch (error) {
        console.error("Invalid date format:", error);
        return <span>Invalid Date</span>;
    }
};

export default DateFormatter;
