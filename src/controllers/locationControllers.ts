// Define a type for your location objects
interface Location {
    id: number;
    name: string;
    type: string;
}

const mockLocations: Location[] = [
    { id: 1, name: 'Gachibowli', type: 'Area' },
    { id: 2, name: 'Madhapur', type: 'Area' },
    { id: 3, name: 'Kondapur', type: 'Area' },
    { id: 4, name: 'Jubilee Hills', type: 'Area' },
    { id: 5, name: 'Kukatpally', type: 'Area' },
    { id: 6, name: 'Hitec City', type: 'Area' },
];

import { Request, Response } from 'express';

export const searchLocations = (req: Request, res: Response) => {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
        return res.status(200).json([]);
    }

    const filteredLocations = mockLocations.filter(location =>
        location.name.toLowerCase().includes(query.toLowerCase())
    );
    
    res.status(200).json(filteredLocations);
};